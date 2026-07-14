/* ==========================================================================
 * Biences Design Review — UI (v0.17)
 * --------------------------------------------------------------------------
 * Parcours Eliott : VISITER une page -> la REVIEWER visuellement -> produire
 * un RAPPORT (JSON consomme par Claude Code au jour J).
 *
 * Consomme window.BDR_CATALOG (catalogue nouvelle nomenclature css-refactor)
 * et window.BDR_makeEngine (moteur : parseName/buildName/sizeAt/synthCSS/
 * resolve/combinaisons). Assemble par build.py en biences-design-review.user.js.
 *
 * Detection : une classe est DS si le moteur la resout (canon / role /
 * composant / util = VALIDE ; alias -style = LEGACY a migrer).
 * Actions dans le PANNEAU DROIT (jamais par-dessus le texte restylise) :
 *   Remplacer (dropdown filtree, preview live) | Nouveau style (builder
 *   famille->tailles->mods, combinaisons existantes mises en evidence, role) |
 *   Note | Multi (tous les elements d'une meme classe -> remplacement groupe).
 *   Comparateur Avant/Apres + verrouillage de page. Export JSON.
 * ========================================================================== */
(async function () {
  'use strict';

  if (window.__bdr) { window.__bdr.toggle(); return; }   // re-injection = toggle

  var CAT = window.BDR_CATALOG;
  var E = window.BDR_makeEngine(CAT);
  var Z = 2147483000;

  /* ---- state -------------------------------------------------------------- */
  var feedbacks = [];
  var reviewMode = false;        // demarre EN PAUSE
  var selected = null;
  var selPath = null;            // element exact clique (redescente apres ↑)
  var lastStack = [];            // pile sous le curseur (perce les overlays)
  var TOKENS = {};               // couleur rgb resolue -> nom de token DS
  var colors = { text: '#1c1c1c', muted: '#8a8a8a', accent: '#e87722' };
  var multiGroup = null;         // { selector, els[] } quand multi-selection active
  var showAfter = false;         // etat du comparateur avant/apres
  var pageLocked = false;        // page verrouillee (revue figee)
  var newStyleSheet = null;      // <style> qui recoit les styles crees (synthese)
  var injectedCSS = {};          // name -> css injecte (preview + commit)
  var createdStyles = {};        // name -> css COMMITE (va au rapport)
  var dynCleanup = null;         // restauration de la preview du builder au changement de vue

  // registre avant/apres : els touches, classe d'origine, classe finale
  var touchedEls = [];
  var beforeOf = new Map();
  var afterOf = new Map();

  /* ---- helpers DOM (repris v0.16) ---------------------------------------- */
  function h(tag, props) {
    var e = document.createElement(tag);
    if (props) for (var k in props) {
      if (k === 'class') e.className = props[k];
      else if (k === 'html') e.innerHTML = props[k];
      else if (k === 'text') e.textContent = props[k];
      else if (k.slice(0, 2) === 'on') e.addEventListener(k.slice(2), props[k]);
      else e.setAttribute(k, props[k]);
    }
    for (var i = 2; i < arguments.length; i++) {
      var c = arguments[i]; if (c == null) continue;
      e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    }
    return e;
  }
  var classAttr = function (el) { return el.getAttribute('class') || ''; };   // SVG-safe
  var breakpoint = function () { return innerWidth < 768 ? 'mobile' : innerWidth < 1024 ? 'tablet' : 'desktop'; };
  function chip(name, col) { return h('span', { class: 'bdr-chip', style: 'background:' + col + '22;color:' + col, text: name }); }

  var hovBox = h('div', { id: 'bdr-hovbox' });
  var selBox = h('div', { id: 'bdr-selbox' });
  var multiLayer = h('div', { id: 'bdr-multilayer' });
  function boxAt(box, el) {
    if (!el) { box.style.display = 'none'; return; }
    var r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) { box.style.display = 'none'; return; }
    box.style.display = 'block';
    box.style.left = r.left + 'px'; box.style.top = r.top + 'px';
    box.style.width = r.width + 'px'; box.style.height = r.height + 'px';
  }

  /* ---- detection DS (moteur) --------------------------------------------- */
  // classes DS de l'element, avec resolution moteur
  function dsClassesOf(el) {
    var out = [];
    var cls = classAttr(el).trim();
    if (!cls) return out;
    cls.split(/\s+/).forEach(function (c) {
      var r = E.resolve(c);
      if (r.category !== 'unknown' && r.category !== 'buildable') out.push(r);
    });
    return out;
  }
  function hasStyle(el) { return el.nodeType === 1 && dsClassesOf(el).length > 0; }
  function nearestStyled(el) {
    var n = el;
    while (n && n.nodeType === 1) {
      if (n.closest && n.closest('#bdr-root')) return null;
      if (hasStyle(n)) return n;
      n = n.parentElement;
    }
    return null;
  }
  // etat : legacy (alias -style a migrer) > ds (valide) > override (inline) > plain
  function classify(el) {
    var ds = [], legacy = [];
    dsClassesOf(el).forEach(function (r) {
      if (r.category === 'alias') legacy.push(r); else ds.push(r);
    });
    var override = el.getAttribute && el.getAttribute('style') ? ['inline-style'] : [];
    var state = 'plain';
    if (legacy.length) state = 'legacy';
    else if (ds.length) state = 'ds';
    else if (override.length) state = 'override';
    return { state: state, ds: ds, legacy: legacy, override: override };
  }

  /* ---- ancrage / description (repris v0.16) ------------------------------ */
  function describe(el) {
    var parts = []; var n = el;
    while (n && n.nodeType === 1 && !(n.closest && n.closest('#bdr-root'))) {
      if (n.id) { parts.unshift('#' + CSS.escape(n.id)); break; }
      var seg = n.tagName.toLowerCase();
      var p = n.parentElement;
      if (p) {
        var same = Array.prototype.filter.call(p.children, function (c) { return c.tagName === n.tagName; });
        if (same.length > 1) seg += ':nth-of-type(' + (same.indexOf(n) + 1) + ')';
      }
      parts.unshift(seg); n = n.parentElement;
    }
    var a = el, id = '';
    while (a && a.nodeType === 1 && !(a.closest && a.closest('#bdr-root'))) { if (a.id) { id = a.id; break; } a = a.parentElement; }
    var open = '<' + el.tagName.toLowerCase();
    Array.prototype.forEach.call(el.attributes, function (at) {
      if (at.name === 'style' || at.name.indexOf('data-bdr') === 0) return;
      open += ' ' + at.name + (at.value ? '="' + at.value + '"' : '');
    });
    open += '>';
    if (open.length > 240) open = open.slice(0, 240) + '…';
    var r = el.getBoundingClientRect();
    return {
      css_path: parts.join(' > '), id: id, open_tag: open,
      classes_all: classAttr(el).trim().split(/\s+/).filter(Boolean),
      text_anchor: (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 60),
      tag: el.tagName.toLowerCase(),
      rect: { x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height) }
    };
  }
  function ruleFor(cls) {
    for (var s = 0; s < document.styleSheets.length; s++) {
      var rules; try { rules = document.styleSheets[s].cssRules; } catch (e) { continue; }
      for (var i = 0; i < rules.length; i++) {
        var r = rules[i];
        if (r.selectorText && r.selectorText.split(',').some(function (x) { return x.trim() === '.' + cls; })) return r.cssText;
      }
    }
    return null;
  }

  /* ---- couleurs / tokens (resolus a runtime = multi-sites) --------------- */
  function resolveColorViaClass(cls, prop, fallback) {
    var s = h('span', { class: cls, style: 'position:absolute;opacity:0;pointer-events:none;left:-9999px;' });
    document.body.appendChild(s);
    var v = getComputedStyle(s)[prop]; s.remove();
    return v || fallback;
  }
  function resolveColors() {
    colors.text = resolveColorViaClass('body-17-14', 'color', getComputedStyle(document.body).color || '#1c1c1c');
    colors.muted = resolveColorViaClass('body-14-12-muted', 'color', '#8a8a8a');
    colors.accent = resolveColorViaClass('u-accent', 'color', '#e87722');
  }
  function buildTokens() {
    var probe = h('span', { style: 'position:absolute;opacity:0;pointer-events:none' });
    document.body.appendChild(probe);
    var names = new Set();
    for (var s = 0; s < document.styleSheets.length; s++) {
      var rules; try { rules = document.styleSheets[s].cssRules; } catch (e) { continue; }
      for (var i = 0; i < rules.length; i++) {
        var r = rules[i];
        if (r.selectorText && /(^|,)\s*:root\b/.test(r.selectorText)) {
          for (var j = 0; j < r.style.length; j++) { var p = r.style[j]; if (p.indexOf('--') === 0) names.add(p); }
        }
      }
    }
    names.forEach(function (name) {
      var raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
      if (!raw) return;
      probe.style.color = ''; probe.style.color = raw;
      if (!probe.style.color) return;
      var rgb = getComputedStyle(probe).color;
      if (rgb && rgb !== 'rgba(0, 0, 0, 0)' && !(rgb in TOKENS)) TOKENS[rgb] = name;
    });
    probe.remove();
  }

  function propsBlock(el) {
    var cs = getComputedStyle(el);
    var rows = [];
    function color(label, prop) {
      var v = cs.getPropertyValue(prop).trim();
      if (!v || v === 'rgba(0, 0, 0, 0)' || v === 'transparent') return;
      rows.push([label, v, TOKENS[v] || null]);
    }
    function plain(label, v) { if (v && v !== 'normal' && v !== '0px') rows.push([label, v, null]); }
    var ownC = cs.backgroundColor, ownI = cs.backgroundImage;
    var hasC = ownC && ownC !== 'rgba(0, 0, 0, 0)' && ownC !== 'transparent';
    var hasI = ownI && ownI !== 'none';
    if (hasC) rows.push(['fond', ownC, TOKENS[ownC] || null]);
    if (hasI) rows.push(['fond img', ownI.length > 60 ? ownI.slice(0, 60) + '…' : ownI, null]);
    if (!hasC && !hasI) {
      var n = el.parentElement;
      while (n && n.nodeType === 1 && !(n.closest && n.closest('#bdr-root'))) {
        var b = bgOf(n);
        if (b) { rows.push(['fond ↑', b.length > 46 ? b.slice(0, 46) + '…' : b, TOKENS[b] || null]); break; }
        n = n.parentElement;
      }
    }
    color('texte', 'color');
    if (cs.borderTopStyle !== 'none' && cs.borderTopWidth !== '0px') {
      var bc = cs.borderTopColor.trim();
      rows.push(['bordure', cs.borderTopWidth + ' ' + cs.borderTopStyle + ' ' + bc, TOKENS[bc] || null]);
    }
    plain('radius', cs.borderRadius);
    plain('police', cs.fontFamily);
    plain('taille', cs.fontSize);
    plain('graisse', cs.fontWeight);
    var box = h('div', { class: 'bdr-props' });
    if (!rows.length) return box;
    box.appendChild(h('div', { class: 'bdr-props-t', text: 'Propriétés' }));
    rows.forEach(function (r) {
      var row = h('div', { class: 'bdr-prop' }, h('span', { class: 'k', text: r[0] }), h('span', { class: 'v', text: r[1] }));
      if (r[2]) row.appendChild(h('span', { class: 'tok', text: r[2] }));
      box.appendChild(row);
    });
    return box;
  }
  function fontSig(cs) { return [cs.fontFamily, cs.fontSize, cs.fontWeight, cs.fontStyle, cs.color, cs.backgroundColor, cs.textTransform, cs.letterSpacing, cs.lineHeight, cs.textDecorationLine].join('|'); }
  function dsClassInert(el) {
    var dsc = dsClassesOf(el);
    if (!dsc.length) return false;
    var before = fontSig(getComputedStyle(el));
    var orig = classAttr(el);
    var keep = orig.split(/\s+/).filter(function (c) { return c && E.resolve(c).category === 'unknown'; });
    el.setAttribute('class', keep.join(' '));
    var after = fontSig(getComputedStyle(el));
    el.setAttribute('class', orig);
    return before === after;
  }
  function bgOf(el) {
    var cs = getComputedStyle(el);
    var c = cs.backgroundColor, img = cs.backgroundImage;
    if (c && c !== 'rgba(0, 0, 0, 0)' && c !== 'transparent') return c;
    if (img && img !== 'none') return img;
    return null;
  }

  /* ---- registre avant/apres ---------------------------------------------- */
  function stage(el, afterClass) {
    if (!beforeOf.has(el)) { beforeOf.set(el, classAttr(el)); touchedEls.push(el); }
    afterOf.set(el, afterClass);
    el.setAttribute('class', afterClass);   // applique l'etat APRES
    showAfter = true;
  }
  function applyBA(after) {
    showAfter = after;
    touchedEls.forEach(function (el) {
      el.setAttribute('class', after ? afterOf.get(el) : beforeOf.get(el));
      if (el === selected) boxAt(selBox, el);
    });
    paintMulti();
  }

  /* ---- styles crees (synthese CSS injectee) ------------------------------ */
  function ensureSheet() {
    if (!newStyleSheet) { newStyleSheet = h('style', { id: 'bdr-created' }); document.head.appendChild(newStyleSheet); }
    return newStyleSheet;
  }
  function injectStyle(name, parsed) {
    if (injectedCSS[name]) return injectedCSS[name];
    var css = E.synthCSS(name, parsed, colors);
    injectedCSS[name] = css;
    ensureSheet().appendChild(document.createTextNode(css));
    return css;
  }

  /* ---- enregistrement d'un retour ---------------------------------------- */
  function record(el, verdict, extra) {
    var c = classify(el), d = describe(el);
    feedbacks.push(Object.assign({
      verdict: verdict, url: location.pathname, ts: new Date().toISOString(),
      breakpoint: breakpoint(), viewport: innerWidth + 'x' + innerHeight,
      tag: d.tag, id: d.id, open_tag: d.open_tag, text_anchor: d.text_anchor,
      css_path: d.css_path, rect: d.rect,
      classes: {
        ds: c.ds.map(function (r) { return r.name; }),
        legacy: c.legacy.map(function (r) { return r.name; }),
        override: c.override, all: d.classes_all
      }
    }, extra || {}));
    el.setAttribute('data-bdr-v', verdict);
    renderTray(); renderSelected();
  }

  /* ---- peinture ----------------------------------------------------------- */
  function paint() {
    var nDs = 0, nLeg = 0;
    document.querySelectorAll('[class]').forEach(function (el) {
      if (el.closest && el.closest('#bdr-root')) return;
      if (typeof el.className !== 'string' && !el.getAttribute('class')) return;
      var st = classify(el).state;
      if (st === 'legacy') { nLeg++; el.setAttribute('data-bdr', 'legacy'); }
      else if (st === 'ds') { nDs++; el.setAttribute('data-bdr', 'ds'); }
      else el.removeAttribute('data-bdr');
    });
    countStyle.textContent = '✅ ' + nDs + '  ·  ⚠ ' + nLeg;
  }
  function unpaint() { document.querySelectorAll('[data-bdr]').forEach(function (el) { el.removeAttribute('data-bdr'); }); }
  function paintMulti() {
    multiLayer.innerHTML = '';
    if (!multiGroup) return;
    multiGroup.els.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (!r.width && !r.height) return;
      var b = h('div', { class: 'bdr-mbox' });
      b.style.left = r.left + 'px'; b.style.top = r.top + 'px'; b.style.width = r.width + 'px'; b.style.height = r.height + 'px';
      multiLayer.appendChild(b);
    });
  }

  /* ---- groupes du selecteur de remplacement ------------------------------ */
  var SWAP_GROUPS = (function () {
    var groups = [];
    // canoniques par famille
    CAT.families.forEach(function (f) {
      var items = CAT.canon.filter(function (n) { var p = E.parseName(n); return p && p.family === f.key; })
        .map(function (n) { return { name: n, kind: 'canon' }; });
      if (items.length) groups.push({ title: f.label, items: items });
    });
    // roles
    var roles = Object.keys(CAT.roles).map(function (n) { return { name: n, kind: 'role' }; });
    if (roles.length) groups.push({ title: 'Rôles', items: roles });
    // composants (groupes du catalogue)
    Object.keys(CAT.components).forEach(function (g) {
      groups.push({ title: g, items: CAT.components[g].map(function (n) { return { name: n, kind: 'component' }; }) });
    });
    // utilitaires
    groups.push({ title: 'Utilitaires', items: CAT.utils.map(function (n) { return { name: n, kind: 'util' }; }) });
    return groups;
  })();

  /* ======================================================================= *
   *  UI ROOT + STYLES
   * ======================================================================= */
  var root = h('div', { id: 'bdr-root' });
  var style = h('style', {
    text: `
      #bdr-root{position:fixed;inset:0;z-index:${Z};pointer-events:none;font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;}
      #bdr-root *{box-sizing:border-box;}
      [data-bdr="ds"]{outline:1px dashed rgba(45,212,191,.5) !important;outline-offset:1px !important;}
      [data-bdr="legacy"]{outline:2px dashed #f59e0b !important;outline-offset:2px !important;}
      body.bdr-anomalies [data-bdr="ds"]{outline:none !important;}
      [data-bdr-v]{outline:2px solid #2dd4bf !important;outline-offset:2px !important;}
      #bdr-hovbox,#bdr-selbox{position:fixed;pointer-events:none;display:none;border-radius:4px;}
      #bdr-hovbox{border:2px dashed #fbbf24;background:rgba(251,191,36,.06);}
      #bdr-selbox{border:2px solid #f97316;background:rgba(249,115,22,.08);box-shadow:0 0 0 1px rgba(249,115,22,.25),0 0 16px rgba(249,115,22,.22);}
      #bdr-multilayer{position:fixed;inset:0;pointer-events:none;}
      .bdr-mbox{position:fixed;border:2px solid #a855f7;background:rgba(168,85,247,.10);border-radius:4px;}
      #bdr-panel{position:fixed;top:0;right:0;bottom:0;width:360px;z-index:${Z};pointer-events:auto;display:flex;flex-direction:column;background:#0f1620;color:#e6eaf0;font-size:12.5px;line-height:1.45;border-left:1px solid #22303f;box-shadow:-14px 0 44px rgba(0,0,0,.45);transition:transform .22s cubic-bezier(.4,0,.2,1);}
      #bdr-panel.collapsed{transform:translateX(100%);}
      #bdr-reopen{position:fixed;top:50%;right:0;transform:translateY(-50%);z-index:${Z};pointer-events:auto;display:none;background:linear-gradient(135deg,#fb923c,#f97316);color:#fff;padding:15px 8px;border-radius:11px 0 0 11px;cursor:pointer;font-weight:700;font-size:11px;letter-spacing:.02em;writing-mode:vertical-rl;box-shadow:-4px 0 18px rgba(0,0,0,.35);}
      #bdr-reopen:hover{filter:brightness(1.07);}
      .bdr-hd{display:flex;align-items:center;justify-content:space-between;padding:13px 16px;border-bottom:1px solid #1b2634;background:#0b1119;}
      .bdr-brand{display:flex;align-items:center;gap:9px;font-size:13.5px;font-weight:700;white-space:nowrap;}
      .bdr-dot{width:8px;height:8px;border-radius:50%;background:#f97316;box-shadow:0 0 10px #f97316;flex:0 0 auto;}
      .bdr-icon{cursor:pointer;background:none;border:none;color:#8896a8;font-size:15px;line-height:1;padding:5px 9px;border-radius:7px;}
      .bdr-icon:hover{background:#1b2634;color:#e6eaf0;}
      #bdr-top{padding:15px 16px;border-bottom:1px solid #1b2634;}
      .bdr-cta{display:block;width:100%;cursor:pointer;border:none;border-radius:11px;padding:13px;font-size:13px;font-weight:700;color:#fff;background:linear-gradient(135deg,#fb923c,#f97316);box-shadow:0 6px 18px rgba(249,115,22,.35);transition:transform .12s,box-shadow .12s;}
      .bdr-cta:hover{transform:translateY(-1px);box-shadow:0 10px 26px rgba(249,115,22,.45);}
      .bdr-steps{display:flex;gap:6px;margin-top:13px;}
      .bdr-stp{flex:1;text-align:center;font-size:10.5px;color:#5b6b7d;border-top:2px solid #22303f;padding-top:7px;transition:.15s;}
      .bdr-stp.on{color:#fdba74;border-color:#f97316;}
      .bdr-hint{color:#8896a8;font-size:11.5px;margin-top:11px;line-height:1.55;}
      .bdr-live-row{display:flex;align-items:center;gap:9px;}
      .bdr-livedot{width:8px;height:8px;border-radius:50%;background:#22c55e;box-shadow:0 0 8px #22c55e;animation:bdrpulse 1.6s infinite;flex:0 0 auto;}
      @keyframes bdrpulse{0%,100%{opacity:1;}50%{opacity:.3;}}
      .bdr-live-lbl{font-weight:600;flex:1;}
      .bdr-ghost{cursor:pointer;background:none;border:1px solid #2a3a4c;color:#c3ccd8;border-radius:8px;padding:5px 12px;font-size:11.5px;font-weight:600;}
      .bdr-ghost:hover{background:#1b2634;border-color:#3a4c60;}
      .bdr-meta{display:flex;gap:6px;margin-top:12px;align-items:center;flex-wrap:wrap;}
      .bdr-chip2{background:#16202c;border:1px solid #22303f;border-radius:7px;padding:4px 9px;font-size:11px;color:#8896a8;font-variant-numeric:tabular-nums;}
      .bdr-toggle{margin-left:auto;cursor:pointer;font-size:10.5px;color:#8896a8;border:1px solid #2a3a4c;border-radius:6px;padding:3px 8px;}
      .bdr-toggle.on{color:#fdba74;border-color:#f97316;}
      .bdr-hover{color:#8896a8;font-size:11px;margin-top:12px;min-height:15px;word-break:break-word;}
      .bdr-hover .up{color:#fbbf24;}
      .bdr-card{margin:12px 14px 0;background:#131c27;border:1px solid #22303f;border-radius:12px;padding:13px;}
      #bdr-panel.acting .bdr-card .bdr-props,#bdr-panel.acting .bdr-card .bdr-stack,#bdr-panel.acting .bdr-card>.bdr-btn.bg,#bdr-panel.acting .bdr-card .bdr-anchor{display:none;}
      .bdr-empty{margin:30px 18px;text-align:center;color:#5b6b7d;font-size:12px;line-height:1.6;}
      .bdr-empty b{display:block;color:#8896a8;font-size:13px;margin-bottom:5px;font-weight:600;}
      .bdr-selhd{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;}
      .bdr-state{font-weight:700;padding:3px 9px;border-radius:7px;font-size:11px;}
      .bdr-state.legacy{background:#f59e0b22;color:#fcd34d;} .bdr-state.ds{background:#22c55e22;color:#86efac;}
      .bdr-state.override{background:#ef444422;color:#fca5a5;} .bdr-state.plain{background:#8896a822;color:#c3ccd8;}
      .bdr-nav{display:flex;gap:3px;align-items:center;}
      .bdr-navbtn{cursor:pointer;color:#8896a8;font-size:15px;line-height:1;font-weight:700;padding:2px 7px;border-radius:6px;}
      .bdr-navbtn:hover{background:#1b2634;color:#e6eaf0;}
      .bdr-x{cursor:pointer;color:#8896a8;font-size:17px;line-height:1;padding:0 5px;} .bdr-x:hover{color:#fca5a5;}
      .bdr-chips{display:flex;flex-wrap:wrap;gap:4px;margin-bottom:9px;}
      .bdr-chip{display:inline-block;padding:2px 7px;border-radius:6px;font-weight:600;font-family:ui-monospace,monospace;font-size:11px;}
      .bdr-alias{text-decoration:line-through;opacity:.75;}
      .bdr-arrow{color:#6b7b8d;font-family:ui-monospace,monospace;font-size:11px;}
      .bdr-anchor{color:#6b7b8d;font-size:11px;word-break:break-word;font-family:ui-monospace,monospace;}
      .bdr-props{margin-top:11px;border-top:1px solid #22303f;padding-top:9px;}
      .bdr-props-t,.bdr-stack-t{color:#6b7b8d;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;margin-bottom:5px;}
      .bdr-prop{display:flex;gap:8px;align-items:baseline;font-size:11px;padding:2px 0;flex-wrap:wrap;}
      .bdr-prop .k{color:#6b7b8d;min-width:48px;} .bdr-prop .v{color:#e6eaf0;font-family:ui-monospace,monospace;word-break:break-all;}
      .bdr-prop .tok{color:#2dd4bf;font-family:ui-monospace,monospace;background:#2dd4bf1f;padding:1px 6px;border-radius:5px;}
      .bdr-warn{margin-top:10px;font-size:11px;color:#fcd34d;background:#78350f4d;border:1px solid #9a3412;border-radius:8px;padding:8px 10px;line-height:1.45;}
      .bdr-stack{margin-top:11px;border-top:1px solid #22303f;padding-top:8px;}
      .bdr-stack-row{cursor:pointer;padding:3px 7px;border-radius:6px;font-family:ui-monospace,monospace;font-size:11px;color:#8896a8;}
      .bdr-stack-row:hover{background:#1b2634;color:#e6eaf0;} .bdr-stack-row.on{background:#f9731626;color:#fdba74;}
      .bdr-verbs{display:flex;flex-wrap:wrap;gap:7px;padding:12px 14px 4px;}
      .bdr-v{cursor:pointer;border:1px solid #2a3a4c;background:#182230;color:#e6eaf0;border-radius:9px;padding:8px 12px;font-size:12px;font-weight:600;transition:background .12s;}
      .bdr-v:hover{background:#22303f;}
      .bdr-v.create{border-color:#3b82f6;color:#93c5fd;background:#3b82f614;}
      .bdr-v.multi{border-color:#a855f7;color:#d8b4fe;background:#a855f714;}
      .bdr-btn{cursor:pointer;border:none;border-radius:9px;padding:9px;font-size:12px;font-weight:600;background:#22303f;color:#e6eaf0;}
      .bdr-btn.bg{margin-top:10px;width:100%;background:#134e4a;color:#5eead4;}
      .bdr-btn.bg:hover{background:#155e56;}
      .bdr-dyn{flex:1;overflow:auto;padding:0 14px;}
      #bdr-search{width:100%;padding:8px 10px;border:1px solid #2a3a4c;border-radius:8px;margin:8px 0;font-size:12px;background:#0b1119;color:#e6eaf0;}
      #bdr-search:focus{outline:none;border-color:#f97316;}
      .bdr-opt{cursor:pointer;padding:6px 9px;border-radius:7px;font-family:ui-monospace,monospace;font-size:11px;color:#c3ccd8;display:flex;justify-content:space-between;gap:8px;}
      .bdr-opt:hover{background:#f97316;color:#fff;}
      .bdr-opt .knd{opacity:.5;font-size:10px;}
      .bdr-optgroup{color:#6b7b8d;font-weight:700;font-size:10px;text-transform:uppercase;letter-spacing:.06em;padding:10px 4px 4px;border-top:1px solid #22303f;margin-top:3px;}
      /* builder */
      .bdr-bld{padding:6px 0 12px;}
      .bdr-bld-t{color:#93c5fd;font-weight:700;font-size:12px;margin:8px 0 4px;}
      .bdr-lbl{color:#6b7b8d;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;margin:11px 0 5px;}
      .bdr-fams{display:flex;flex-wrap:wrap;gap:6px;}
      .bdr-fam{cursor:pointer;border:1px solid #2a3a4c;background:#182230;color:#c3ccd8;border-radius:8px;padding:6px 10px;font-size:11.5px;}
      .bdr-fam.on{border-color:#3b82f6;background:#3b82f622;color:#dbeafe;}
      .bdr-sizerow{display:flex;align-items:center;gap:8px;}
      .bdr-num{width:66px;padding:7px 8px;border:1px solid #2a3a4c;border-radius:8px;background:#0b1119;color:#e6eaf0;font-size:13px;font-family:ui-monospace,monospace;}
      .bdr-num:focus{outline:none;border-color:#f97316;}
      .bdr-sizechips{display:flex;flex-wrap:wrap;gap:4px;margin-top:6px;}
      .bdr-sc{cursor:pointer;font-family:ui-monospace,monospace;font-size:11px;padding:2px 8px;border-radius:6px;border:1px solid #2a3a4c;color:#8896a8;}
      .bdr-sc.exists{border-color:#22c55e66;color:#86efac;background:#22c55e14;}
      .bdr-sc:hover{border-color:#f97316;color:#fdba74;}
      .bdr-mods{display:flex;flex-wrap:wrap;gap:6px;}
      .bdr-mod{cursor:pointer;border:1px solid #2a3a4c;background:#182230;color:#c3ccd8;border-radius:20px;padding:5px 12px;font-size:11.5px;}
      .bdr-mod.on{border-color:#a855f7;background:#a855f722;color:#e9d5ff;}
      .bdr-preview{margin:12px 0;padding:11px 12px;border:1px dashed #2a3a4c;border-radius:10px;background:#0b1119;}
      .bdr-name{font-family:ui-monospace,monospace;font-size:13px;color:#fdba74;word-break:break-all;}
      .bdr-status{margin-top:7px;font-size:11px;line-height:1.5;}
      .bdr-status.exists{color:#86efac;} .bdr-status.new{color:#93c5fd;}
      .bdr-role{width:100%;padding:7px 9px;border:1px solid #2a3a4c;border-radius:8px;background:#0b1119;color:#e6eaf0;font-size:12px;margin-top:8px;font-family:ui-monospace,monospace;}
      .bdr-role:focus{outline:none;border-color:#3b82f6;}
      #bdr-note{width:100%;height:84px;border:1px solid #2a3a4c;border-radius:8px;padding:8px;font-size:12px;resize:vertical;background:#0b1119;color:#e6eaf0;margin:8px 0;font-family:inherit;}
      #bdr-note:focus{outline:none;border-color:#f97316;}
      /* rapport */
      .bdr-rep{padding:6px 0 14px;}
      .bdr-rep-ba{display:flex;gap:8px;align-items:center;margin:8px 0 12px;}
      .bdr-ba{flex:1;cursor:pointer;text-align:center;border:1px solid #2a3a4c;border-radius:9px;padding:8px;font-size:12px;font-weight:600;color:#c3ccd8;background:#182230;}
      .bdr-ba.on{border-color:#f97316;background:#f9731622;color:#fdba74;}
      .bdr-rep-row{display:flex;gap:8px;align-items:flex-start;padding:8px 0;border-top:1px solid #1b2634;font-size:11.5px;}
      .bdr-rep-v{flex:0 0 auto;font-size:14px;}
      .bdr-rep-main{flex:1;min-width:0;}
      .bdr-rep-main .to{color:#fdba74;font-family:ui-monospace,monospace;word-break:break-all;}
      .bdr-rep-main .anc{color:#6b7b8d;font-size:10.5px;word-break:break-word;}
      .bdr-rep-del{cursor:pointer;color:#6b7b8d;font-size:14px;} .bdr-rep-del:hover{color:#fca5a5;}
      .bdr-lock{width:100%;margin-top:12px;cursor:pointer;border:1px solid #f59e0b55;background:#78350f33;color:#fcd34d;border-radius:9px;padding:9px;font-size:12px;font-weight:700;}
      .bdr-lock.locked{border-color:#22c55e55;background:#14532d33;color:#86efac;}
      .bdr-ft{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:11px 14px;border-top:1px solid #1b2634;background:#0b1119;}
      .bdr-tab{cursor:pointer;font-size:11.5px;font-weight:600;color:#8896a8;padding:6px 10px;border-radius:8px;}
      .bdr-tab.on{color:#fdba74;background:#f9731618;}
      .bdr-exp{cursor:pointer;border:none;border-radius:9px;padding:9px 16px;font-size:12px;font-weight:700;color:#fff;background:linear-gradient(135deg,#fb923c,#f97316);box-shadow:0 4px 12px rgba(249,115,22,.3);}
      .bdr-exp:hover{filter:brightness(1.06);}
      #bdr-toast{position:fixed;bottom:18px;right:376px;z-index:${Z};pointer-events:none;background:#0d9488;color:#fff;padding:9px 14px;border-radius:9px;font-size:12px;font-weight:600;opacity:0;transform:translateY(6px);transition:opacity .2s,transform .2s;box-shadow:0 8px 24px rgba(0,0,0,.4);}
      #bdr-toast.on{opacity:1;transform:translateY(0);}
    `
  });

  /* ---- toast -------------------------------------------------------------- */
  var toastEl = h('div', { id: 'bdr-toast' });
  var toastT = 0;
  function toast(msg) { toastEl.textContent = msg; toastEl.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove('on'); }, 1700); }

  /* ---- structure du panneau ---------------------------------------------- */
  var resBadge = h('span', { class: 'bdr-chip2' });
  var countStyle = h('span', { class: 'bdr-chip2', title: 'Classes DS validées  ·  restes legacy à migrer', text: '✅ 0' });
  var anomToggle = h('span', { class: 'bdr-toggle', title: 'N’afficher que les anomalies (legacy)', text: 'anomalies', onclick: toggleAnomalies });
  var countBadge = h('span', { class: 'bdr-tab', text: 'Rapport · 0', onclick: showReport });
  var exportBtn = h('button', { class: 'bdr-exp', text: 'Exporter', onclick: exportJSON });
  var hoverLine = h('div', { class: 'bdr-hover' });
  var selCard = h('div', {});
  var verbsBox = h('div', { class: 'bdr-verbs' });
  var dynBox = h('div', { class: 'bdr-dyn' });
  var topZone = h('div', { id: 'bdr-top' });

  var panel = h('div', { id: 'bdr-panel', class: 'collapsed' },
    h('div', { class: 'bdr-hd' },
      h('div', { class: 'bdr-brand' }, h('span', { class: 'bdr-dot' }), 'Design Review'),
      h('button', { class: 'bdr-icon', title: 'Cacher (rouvre via l’onglet à droite)', text: '⟩', onclick: collapse })),
    topZone, selCard, verbsBox, dynBox,
    h('div', { class: 'bdr-ft' }, countBadge, exportBtn)
  );
  var reopen = h('div', { id: 'bdr-reopen', title: 'Ouvrir Design Review', text: '◀ Design Review', onclick: expand });

  var view = 'review';   // 'review' | 'report'

  function syncState() {
    topZone.innerHTML = '';
    if (!reviewMode) {
      topZone.appendChild(h('button', { class: 'bdr-cta', text: '▶  Démarrer la revue', onclick: toggle }));
      topZone.appendChild(h('div', { class: 'bdr-steps' },
        h('div', { class: 'bdr-stp on', text: '1 · Visiter' }),
        h('div', { class: 'bdr-stp', text: '2 · Reviewer' }),
        h('div', { class: 'bdr-stp', text: '3 · Rapport' })));
      topZone.appendChild(h('div', { class: 'bdr-hint', html: 'Survole un élément, clique pour le <b>remplacer</b>, <b>créer un nouveau style</b> ou <b>annoter</b>. Termine par <b>Exporter</b> le rapport.' }));
    } else {
      topZone.appendChild(h('div', { class: 'bdr-live-row' },
        h('span', { class: 'bdr-livedot' }),
        h('span', { class: 'bdr-live-lbl', text: 'Revue en cours' }),
        h('button', { class: 'bdr-ghost', title: 'Suspendre (Alt+R)', text: '⏸ Pause', onclick: toggle })));
      topZone.appendChild(h('div', { class: 'bdr-meta' }, resBadge, countStyle, anomToggle));
      topZone.appendChild(hoverLine);
    }
  }
  function toggleAnomalies() {
    document.body.classList.toggle('bdr-anomalies');
    anomToggle.classList.toggle('on', document.body.classList.contains('bdr-anomalies'));
  }

  /* ---- selection --------------------------------------------------------- */
  function setSel(el) { clearDyn(); selected = el; boxAt(selBox, el); if (view === 'report') view = 'review'; renderSelected(); }
  function select(el) { selPath = el; clearMulti(); setSel(el); expand(); }
  function deselect() { clearDyn(); selected = null; selPath = null; selBox.style.display = 'none'; clearMulti(); renderSelected(); }
  function navUp() {
    if (!selected) return;
    var p = selected.parentElement;
    if (p && p.nodeType === 1 && p !== document.body && p !== document.documentElement && !(p.closest && p.closest('#bdr-root'))) { clearMulti(); setSel(p); }
  }
  function navDown() {
    if (!selected || !selPath || selected === selPath) return;
    var n = selPath;
    while (n && n.parentElement !== selected) n = n.parentElement;
    if (n) { clearMulti(); setSel(n); }
  }
  function climbToBg() {
    var n = selected ? selected.parentElement : null;
    while (n && n.nodeType === 1 && !(n.closest && n.closest('#bdr-root')) && n !== document.documentElement) {
      if (bgOf(n)) { setSel(n); return; }
      n = n.parentElement;
    }
    toast('Aucun parent avec un fond');
  }

  /* ---- multi-selection par classe ---------------------------------------- */
  function clearMulti() { multiGroup = null; paintMulti(); }
  function selectGroup(cls) {
    var els = Array.prototype.slice.call(document.querySelectorAll('.' + CSS.escape(cls)))
      .filter(function (el) { return !(el.closest && el.closest('#bdr-root')); });
    multiGroup = { selector: cls, els: els };
    paintMulti();
    renderSelected();
    toast(els.length + ' élément(s) « .' + cls +' » sélectionnés');
  }

  /* ---- carte de l'element selectionne ------------------------------------ */
  function renderSelected() {
    panel.classList.remove('acting');
    verbsBox.innerHTML = ''; selCard.innerHTML = '';
    if (view === 'report') { renderReport(); return; }
    dynBox.innerHTML = '';
    if (!selected) {
      selCard.className = '';
      if (reviewMode) selCard.appendChild(h('div', { class: 'bdr-empty' }, h('b', { text: 'Aucun élément sélectionné' }), 'Survole la page puis clique un élément pour l’inspecter.'));
      return;
    }
    selCard.className = 'bdr-card';
    var c = classify(selected), d = describe(selected);
    var stLabel = { legacy: '⚠ à migrer', ds: '✅ validé', override: '⛔ inline', plain: 'DS neutre' }[c.state];
    selCard.appendChild(h('div', { class: 'bdr-selhd' },
      h('span', { class: 'bdr-state ' + c.state, text: stLabel }),
      h('span', { class: 'bdr-nav' },
        h('span', { class: 'bdr-navbtn', title: 'Sélectionner le parent', text: '↑', onclick: navUp }),
        h('span', { class: 'bdr-navbtn', title: 'Redescendre vers l’élément cliqué', text: '↓', onclick: navDown }),
        h('span', { class: 'bdr-x', text: '×', title: 'Désélectionner', onclick: deselect }))));

    // chips : classes DS resolues (canonique + alias barre -> cible)
    var chips = h('div', { class: 'bdr-chips' });
    c.ds.forEach(function (r) {
      var col = r.category === 'component' ? '#38bdf8' : r.category === 'util' ? '#2dd4bf' : r.category === 'role' ? '#a3e635' : '#16a34a';
      chips.appendChild(chip(r.name, col));
    });
    c.legacy.forEach(function (r) {
      var w = h('span', { class: 'bdr-chip', style: 'background:#f59e0b22;color:#fcd34d' });
      w.appendChild(h('span', { class: 'bdr-alias', text: r.name }));
      w.appendChild(h('span', { class: 'bdr-arrow', text: ' → ' + r.canonical }));
      chips.appendChild(w);
    });
    if (c.override.length) chips.appendChild(chip('inline-style', '#dc2626'));
    if (c.state === 'plain') chips.appendChild(chip('— DS neutre —', '#94a3b8'));
    selCard.appendChild(chips);
    selCard.appendChild(h('div', { class: 'bdr-anchor', text: '<' + d.tag + '>  ' + d.text_anchor }));
    selCard.appendChild(propsBlock(selected));
    if (!bgOf(selected)) selCard.appendChild(h('button', { class: 'bdr-btn bg', text: '↑ Aller à l’élément avec fond', onclick: climbToBg }));
    if (dsClassInert(selected)) selCard.appendChild(h('div', { class: 'bdr-warn', text: '⚠ Classe DS sans effet ici — une règle locale l’écrase. Un remplacement ne changera pas le rendu.' }));

    // multi-selection : un bouton par classe DS partagee (>1 element)
    var dsNames = c.ds.concat(c.legacy).map(function (r) { return r.name; });
    dsNames.forEach(function (nm) {
      var n = document.querySelectorAll('.' + CSS.escape(nm)).length;
      if (n > 1) {
        var on = multiGroup && multiGroup.selector === nm;
        verbsBox.appendChild(h('button', { class: 'bdr-v multi' + (on ? ' on' : ''), title: 'Sélectionner les ' + n + ' éléments « .' + nm + ' » (remplacement groupé)', text: '👥 ' + n + ' × .' + nm, onclick: function () { on ? clearMulti() : selectGroup(nm); renderSelected(); } }));
      }
    });

    // stack sous le curseur
    if (lastStack.length > 1) {
      var sw = h('div', { class: 'bdr-stack' }, h('div', { class: 'bdr-stack-t', text: 'Sous le curseur (perce les overlays)' }));
      lastStack.slice(0, 8).forEach(function (el) {
        var cls = classAttr(el).trim().split(/\s+/).filter(Boolean).slice(0, 2).join('.');
        var label = '<' + el.tagName.toLowerCase() + '>' + (cls ? ' .' + cls : '');
        sw.appendChild(h('div', { class: 'bdr-stack-row' + (el === selected ? ' on' : ''), text: label, onclick: function () { clearMulti(); setSel(el); } }));
      });
      selCard.appendChild(sw);
    }

    // verbes principaux
    verbsBox.appendChild(h('button', { class: 'bdr-v', text: multiGroup ? '🔁 Remplacer (groupe)' : '🔁 Remplacer', onclick: showSwap }));
    verbsBox.appendChild(h('button', { class: 'bdr-v create', text: '➕ Nouveau style', onclick: showBuilder }));
    verbsBox.appendChild(h('button', { class: 'bdr-v', text: '📝 Note', onclick: showNote }));
  }

  /* ---- cibles du remplacement (un ou plusieurs elements) ----------------- */
  function targets() { return multiGroup ? multiGroup.els : (selected ? [selected] : []); }
  function clearDyn() { restorePreview(); if (dynCleanup) { try { dynCleanup(); } catch (e) {} dynCleanup = null; } }

  /* ---- remplacement (dropdown filtree, preview live) --------------------- */
  var previewSaved = null;   // Map<el, classAttr> pendant la preview
  function swapPreview(cls) {
    if (!previewSaved) {
      previewSaved = new Map();
      targets().forEach(function (el) { previewSaved.set(el, classAttr(el)); });
    }
    targets().forEach(function (el) {
      var kept = classAttr(el).split(/\s+/).filter(function (c) { return c && E.resolve(c).category === 'unknown'; });
      kept.push(cls); el.setAttribute('class', kept.join(' '));
    });
    if (selected) boxAt(selBox, selected);
    paintMulti();
  }
  function restorePreview() {
    if (previewSaved) { previewSaved.forEach(function (v, el) { el.setAttribute('class', v); }); previewSaved = null; if (selected) boxAt(selBox, selected); paintMulti(); }
  }
  function doSwap(cls) {
    restorePreview();
    var els = targets();
    els.forEach(function (el) {
      var kept = classAttr(el).split(/\s+/).filter(function (c) { return c && E.resolve(c).category === 'unknown'; });
      kept.push(cls);
      stage(el, kept.join(' '));
    });
    var extra = { proposition: cls, resolved: E.resolve(cls).canonical };
    if (multiGroup) extra.group = { selector: '.' + multiGroup.selector, count: els.length };
    record(els[0], 'swap', extra);
    toast((multiGroup ? els.length + ' éléments → ' : 'Remplacé par ') + cls);
    clearMulti();
  }
  function showSwap() {
    if (!selected) return;
    clearDyn(); view = 'review'; dynBox.innerHTML = ''; panel.classList.add('acting');
    var search = h('input', { id: 'bdr-search', placeholder: 'Chercher une classe…' });
    var list = h('div', {});
    function optEl(it) {
      var opt = h('div', { class: 'bdr-opt' }, h('span', { text: it.name }), h('span', { class: 'knd', text: it.kind }));
      opt.addEventListener('mouseenter', function () { swapPreview(it.name); });
      opt.addEventListener('mouseleave', function () { restorePreview(); });
      opt.addEventListener('click', function () { doSwap(it.name); });
      return opt;
    }
    function fill(q) {
      list.innerHTML = '';
      SWAP_GROUPS.forEach(function (g) {
        var items = g.items.filter(function (it) { return it.name.indexOf(q) !== -1; });
        if (!items.length) return;
        list.appendChild(h('div', { class: 'bdr-optgroup', text: g.title }));
        items.forEach(function (it) { list.appendChild(optEl(it)); });
      });
    }
    search.addEventListener('input', function () { fill(search.value.trim()); });
    dynBox.appendChild(search); dynBox.appendChild(list); fill(''); search.focus();
  }

  /* ---- builder : nouveau style ------------------------------------------- */
  function showBuilder() {
    if (!selected) return;
    clearDyn(); view = 'review'; dynBox.innerHTML = ''; panel.classList.add('acting');
    var st = { family: null, max: null, min: null, mods: [] };
    var wrap = h('div', { class: 'bdr-bld' });
    var nameEl = h('div', { class: 'bdr-name', text: '—' });
    var statusEl = h('div', { class: 'bdr-status' });
    var actionEl = h('div', {});
    var maxChips = h('div', { class: 'bdr-sizechips' });
    var minChips = h('div', { class: 'bdr-sizechips' });
    var maxIn = h('input', { class: 'bdr-num', type: 'number', placeholder: 'max', min: '1' });
    var minIn = h('input', { class: 'bdr-num', type: 'number', placeholder: 'min', min: '1' });
    var modsBox = h('div', { class: 'bdr-mods' });

    // famille
    var famsBox = h('div', { class: 'bdr-fams' });
    CAT.families.forEach(function (f) {
      var b = h('div', { class: 'bdr-fam', text: f.label, title: f.key, onclick: function () {
        st.family = f.key;
        Array.prototype.forEach.call(famsBox.children, function (c) { c.classList.remove('on'); });
        b.classList.add('on'); refreshSizes(); update();
      } });
      famsBox.appendChild(b);
    });

    function refreshSizes() {
      maxChips.innerHTML = ''; minChips.innerHTML = '';
      if (!st.family) return;
      E.maxesForFamily(st.family).forEach(function (mx) {
        maxChips.appendChild(h('span', { class: 'bdr-sc exists', text: mx, title: 'taille max déjà utilisée', onclick: function () { maxIn.value = mx; st.max = mx; refreshMins(); update(); } }));
      });
      refreshMins();
    }
    function refreshMins() {
      minChips.innerHTML = '';
      if (!st.family || !st.max) return;
      E.minsForFamilyMax(st.family, st.max).forEach(function (mn) {
        minChips.appendChild(h('span', { class: 'bdr-sc exists', text: mn, title: 'taille min déjà utilisée pour ' + st.family + '-' + st.max, onclick: function () { minIn.value = mn; st.min = mn; update(); } }));
      });
    }
    maxIn.addEventListener('input', function () { st.max = maxIn.value ? +maxIn.value : null; refreshMins(); update(); });
    minIn.addEventListener('input', function () { st.min = minIn.value ? +minIn.value : null; update(); });

    // modificateurs
    CAT.mods.forEach(function (m) {
      var b = h('div', { class: 'bdr-mod', text: '+ ' + m.label, title: m.key, onclick: function () {
        var i = st.mods.indexOf(m.key);
        if (i === -1) { st.mods.push(m.key); b.classList.add('on'); b.textContent = '✓ ' + m.label; }
        else { st.mods.splice(i, 1); b.classList.remove('on'); b.textContent = '+ ' + m.label; }
        update();
      } });
      modsBox.appendChild(b);
    });

    function currentName() {
      if (!st.family || !st.max) return null;
      var min = (st.min == null || st.min === '') ? st.max : st.min;
      return E.buildName(st.family, st.max, min, st.mods);
    }
    function update() {
      var name = currentName();
      // mise en evidence : les tailles existantes sont deja marquees .exists ;
      // ici on annonce si la COMBINAISON complete existe.
      if (!name) { nameEl.textContent = '—'; statusEl.textContent = ''; statusEl.className = 'bdr-status'; actionEl.innerHTML = ''; return; }
      nameEl.textContent = name;
      var min = (st.min == null || st.min === '') ? st.max : st.min;
      var parsed = { family: st.family, max: +st.max, min: +min, mods: E.sortMods(st.mods) };
      var exists = E.existsExact(name);
      actionEl.innerHTML = '';
      if (exists) {
        statusEl.className = 'bdr-status exists';
        statusEl.textContent = '✓ Ce style existe déjà — réutilise-le plutôt que d’en créer un jumeau.';
        // preview live = classe existante
        previewCreated(name, null);
        actionEl.appendChild(h('button', { class: 'bdr-cta', text: 'Utiliser « ' + name + ' »', onclick: function () { commitReuse(name); } }));
      } else {
        statusEl.className = 'bdr-status new';
        statusEl.innerHTML = '✨ Nouveau style. Rendu appliqué en direct. Donne-lui un <b>rôle</b> si c’est un usage sémantique récurrent.';
        previewCreated(name, parsed);   // synthese + injection + preview
        var role = h('input', { class: 'bdr-role', placeholder: 'rôle / alias optionnel (ex : eyebrow, price-note)…' });
        actionEl.appendChild(role);
        actionEl.appendChild(h('button', { class: 'bdr-cta', text: 'Créer et appliquer', onclick: function () { commitCreate(name, parsed, role.value.trim()); } }));
      }
    }

    // preview live sur les cibles (sans enregistrer)
    var bldPreviewSaved = null;
    function previewCreated(name, parsed) {
      if (parsed) injectStyle(name, parsed);   // rend la classe applicable
      if (!bldPreviewSaved) { bldPreviewSaved = new Map(); targets().forEach(function (el) { bldPreviewSaved.set(el, classAttr(el)); }); }
      targets().forEach(function (el) {
        var base = bldPreviewSaved.get(el).split(/\s+/).filter(function (c) { return c && E.resolve(c).category === 'unknown'; });
        base.push(name); el.setAttribute('class', base.join(' '));
      });
      if (selected) boxAt(selBox, selected); paintMulti();
    }
    function restoreBld() { if (bldPreviewSaved) { bldPreviewSaved.forEach(function (v, el) { el.setAttribute('class', v); }); bldPreviewSaved = null; } }

    function commitReuse(name) {
      restoreBld(); dynCleanup = null;
      var els = targets();
      els.forEach(function (el) {
        var base = classAttr(el).split(/\s+/).filter(function (c) { return c && E.resolve(c).category === 'unknown'; });
        base.push(name); stage(el, base.join(' '));
      });
      var extra = { proposition: name, resolved: E.resolve(name).canonical };
      if (multiGroup) extra.group = { selector: '.' + multiGroup.selector, count: els.length };
      record(els[0], 'swap', extra);
      toast('Réutilisé : ' + name); clearMulti(); dynBox.innerHTML = '';
    }
    function commitCreate(name, parsed, role) {
      restoreBld(); dynCleanup = null;
      var css = injectStyle(name, parsed); createdStyles[name] = css;
      var els = targets();
      els.forEach(function (el) {
        var base = classAttr(el).split(/\s+/).filter(function (c) { return c && E.resolve(c).category === 'unknown'; });
        base.push(name); stage(el, base.join(' '));
      });
      var extra = { new_style: { name: name, family: parsed.family, max: parsed.max, min: parsed.min, mods: parsed.mods, role: role || null, css: css } };
      if (multiGroup) extra.group = { selector: '.' + multiGroup.selector, count: els.length };
      record(els[0], 'create', extra);
      toast('Créé : ' + name + (role ? ' (' + role + ')' : '')); clearMulti(); dynBox.innerHTML = '';
    }

    wrap.appendChild(h('div', { class: 'bdr-bld-t', text: '➕ Construire un style' }));
    wrap.appendChild(h('div', { class: 'bdr-lbl', text: 'Famille' })); wrap.appendChild(famsBox);
    wrap.appendChild(h('div', { class: 'bdr-lbl', text: 'Taille max (desktop) — px' }));
    wrap.appendChild(h('div', { class: 'bdr-sizerow' }, maxIn, h('span', { class: 'bdr-hint', text: '10 px = 1.0' }))); wrap.appendChild(maxChips);
    wrap.appendChild(h('div', { class: 'bdr-lbl', text: 'Taille min (mobile) — px, vide = fixe' }));
    wrap.appendChild(h('div', { class: 'bdr-sizerow' }, minIn)); wrap.appendChild(minChips);
    wrap.appendChild(h('div', { class: 'bdr-lbl', text: 'Modificateurs' })); wrap.appendChild(modsBox);
    wrap.appendChild(h('div', { class: 'bdr-preview' }, nameEl, statusEl));
    wrap.appendChild(actionEl);
    dynBox.appendChild(wrap);
    dynCleanup = restoreBld;
  }

  function showNote() {
    if (!selected) return;
    clearDyn(); view = 'review'; dynBox.innerHTML = ''; panel.classList.add('acting');
    var ta = h('textarea', { id: 'bdr-note', placeholder: 'Changement à opérer, ou style souhaité si aucune classe DS ne convient…' });
    var save = h('button', { class: 'bdr-btn', text: 'Enregistrer la note',
      onclick: function () { if (ta.value.trim()) record(selected, 'note', { note: ta.value.trim() }); dynBox.innerHTML = ''; toast('Note enregistrée'); } });
    dynBox.appendChild(ta); dynBox.appendChild(save); ta.focus();
  }

  /* ---- vue Rapport ------------------------------------------------------- */
  function showReport() { clearDyn(); view = 'report'; expand(); renderSelected(); }
  function renderReport() {
    selCard.className = ''; selCard.innerHTML = ''; verbsBox.innerHTML = ''; dynBox.innerHTML = '';
    var rep = h('div', { class: 'bdr-rep' });
    rep.appendChild(h('div', { class: 'bdr-selhd' },
      h('span', { class: 'bdr-state ds', text: 'Rapport · ' + feedbacks.length }),
      h('span', { class: 'bdr-x', text: '×', title: 'Revenir à la revue', onclick: function () { view = 'review'; renderSelected(); } })));

    if (touchedEls.length) {
      rep.appendChild(h('div', { class: 'bdr-rep-ba' },
        h('div', { class: 'bdr-ba' + (!showAfter ? ' on' : ''), text: 'Avant', onclick: function () { applyBA(false); renderReport(); } }),
        h('div', { class: 'bdr-ba' + (showAfter ? ' on' : ''), text: 'Après', onclick: function () { applyBA(true); renderReport(); } })));
    }

    if (!feedbacks.length) {
      rep.appendChild(h('div', { class: 'bdr-empty', text: 'Aucune décision pour l’instant. Sélectionne un élément et propose un changement.' }));
    } else {
      feedbacks.forEach(function (fb, i) {
        var icon = { swap: '🔁', create: '➕', note: '📝' }[fb.verdict] || '•';
        var main = h('div', { class: 'bdr-rep-main' });
        var to = fb.verdict === 'create' ? (fb.new_style && fb.new_style.name) : fb.verdict === 'swap' ? fb.proposition : (fb.note || '');
        main.appendChild(h('div', { class: 'to', text: (fb.group ? '[' + fb.group.count + '×] ' : '') + (to || '') }));
        main.appendChild(h('div', { class: 'anc', text: '<' + fb.tag + '> ' + (fb.text_anchor || fb.css_path).slice(0, 46) }));
        rep.appendChild(h('div', { class: 'bdr-rep-row' },
          h('span', { class: 'bdr-rep-v', text: icon }), main,
          h('span', { class: 'bdr-rep-del', text: '×', title: 'Retirer', onclick: function () { feedbacks.splice(i, 1); renderTray(); renderReport(); } })));
      });
    }

    rep.appendChild(h('button', { class: 'bdr-lock' + (pageLocked ? ' locked' : ''), text: pageLocked ? '🔒 Page verrouillée — cliquer pour déverrouiller' : '🔓 Verrouiller la page (revue terminée)', onclick: function () { toggleLock(); renderReport(); } }));
    dynBox.appendChild(rep);
  }
  function toggleLock() {
    pageLocked = !pageLocked;
    if (pageLocked) { applyBA(true); toast('Page verrouillée — état « après » appliqué'); }
    else toast('Page déverrouillée');
  }

  /* ---- barre / divers ---------------------------------------------------- */
  function renderRes() { resBadge.textContent = breakpoint() + ' ' + innerWidth + '×' + innerHeight; }
  function renderTray() { countBadge.textContent = 'Rapport · ' + feedbacks.length; }
  function collapse() { panel.classList.add('collapsed'); reopen.style.display = 'block'; }
  function expand() { panel.classList.remove('collapsed'); reopen.style.display = 'none'; }

  function exportJSON() {
    var payload = {
      tool: 'biences-design-review', version: '0.17.0',
      url: location.href, exported_at: new Date().toISOString(),
      viewport: innerWidth + 'x' + innerHeight, breakpoint: breakpoint(),
      created_styles: createdStyles, feedbacks: feedbacks
    };
    var data = JSON.stringify(payload, null, 2);
    try { navigator.clipboard && navigator.clipboard.writeText(data); } catch (e) {}
    var blob = new Blob([data], { type: 'application/json' });
    var a = h('a', { href: URL.createObjectURL(blob), download: 'review_' + location.hostname + '_' + Date.now() + '.json' });
    root.appendChild(a); a.click(); a.remove();
    toast(feedbacks.length + ' retour(s) exporté(s)');
  }

  function toggle() {
    reviewMode = !reviewMode;
    if (reviewMode) { expand(); paint(); } else { unpaint(); clearHover(); }
    syncState(); renderSelected();
  }

  /* ---- hover -------------------------------------------------------------- */
  var hovered = null;
  function setHover(el) { hovered = el; boxAt(hovBox, el); }
  function clearHover() { hovered = null; hovBox.style.display = 'none'; hoverLine.innerHTML = 'Survole un élément…'; }
  function showHoverInfo(el) {
    var c = classify(el);
    var names = c.ds.map(function (r) { return r.name; }).concat(c.legacy.map(function (r) { return r.name + '→' + r.canonical; }));
    var txt = '&lt;' + el.tagName.toLowerCase() + '&gt; ';
    if (names.length) txt += names.join(', ');
    else {
      var base = c.override.length ? 'inline-style' : '— DS neutre —';
      var anc = nearestStyled(el);
      if (anc) { var a = classify(anc); txt += base + ' <span class="up">↑ ' + anc.tagName.toLowerCase() + ' ' + a.ds.concat(a.legacy).map(function (r) { return r.name; }).join(',') + '</span>'; }
      else txt += base;
    }
    hoverLine.innerHTML = txt;
  }

  /* ---- listeners ---------------------------------------------------------- */
  document.addEventListener('mouseover', function (e) {
    if (!reviewMode || (e.target.closest && e.target.closest('#bdr-root'))) { clearHover(); return; }
    setHover(e.target); showHoverInfo(e.target);
  }, true);
  document.addEventListener('click', function (e) {
    if (!reviewMode) return;
    if (e.target.closest && e.target.closest('#bdr-root')) return;
    e.preventDefault(); e.stopImmediatePropagation();
    lastStack = document.elementsFromPoint(e.clientX, e.clientY).filter(function (el) { return !(el.closest && el.closest('#bdr-root')); });
    select(e.target);
  }, true);
  ['mousedown', 'mouseup', 'pointerdown', 'pointerup', 'dblclick'].forEach(function (ev) {
    document.addEventListener(ev, function (e) {
      if (!reviewMode || (e.target.closest && e.target.closest('#bdr-root'))) return;
      e.stopImmediatePropagation();
    }, true);
  });
  document.addEventListener('submit', function (e) {
    if (!reviewMode || (e.target.closest && e.target.closest('#bdr-root'))) return;
    e.preventDefault(); e.stopImmediatePropagation();
  }, true);
  addEventListener('resize', function () { renderRes(); if (reviewMode) paint(); boxAt(selBox, selected); boxAt(hovBox, hovered); paintMulti(); });
  addEventListener('scroll', function () { if (selected) boxAt(selBox, selected); if (hovered) boxAt(hovBox, hovered); paintMulti(); }, true);
  addEventListener('keydown', function (e) { if (e.altKey && (e.key === 'r' || e.key === 'R')) { e.preventDefault(); toggle(); } });

  /* ---- boot --------------------------------------------------------------- */
  root.appendChild(style); root.appendChild(hovBox); root.appendChild(selBox); root.appendChild(multiLayer); root.appendChild(panel); root.appendChild(reopen); root.appendChild(toastEl);
  document.body.appendChild(root);
  buildTokens(); resolveColors();
  renderRes(); renderTray(); syncState(); renderSelected(); if (reviewMode) paint();
  collapse();

  window.__bdr = { toggle: toggle, feedbacks: feedbacks, export: exportJSON, engine: E, catalog: CAT };
  console.log('[BDR] v0.17 prêt (caché, en pause) — ' + CAT.canon.length + ' canoniques, ' + Object.keys(CAT.roles).length + ' rôles, ' + Object.keys(CAT.aliases).length + ' alias. Onglet « Design Review » à droite, ou Alt+R.');
})();
