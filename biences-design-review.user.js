// ==UserScript==
// @name         Biences Design Review
// @namespace    devodia.biences
// @version      0.10.0
// (defaut cible exact + toggle block + start paused + boite overlay)
// @description  Revue visuelle du design system Biences (clic -> panneau droit -> swap/promote/note)
// @match        https://*.dev.odoo.com/*
// @match        https://*.biences.ch/*
// @downloadURL  https://raw.githubusercontent.com/Devodia/biences-design-review/main/biences-design-review.user.js
// @updateURL    https://raw.githubusercontent.com/Devodia/biences-design-review/main/biences-design-review.user.js
// @grant        none
// @run-at       document-idle
// ==/UserScript==

/* ==========================================================================
 * Biences Design Review — review.js  (MVP, UI panneau droit)
 * --------------------------------------------------------------------------
 * Revue visuelle du design system, injecte a la demande (Tampermonkey/console).
 * INERTE : aucun asset du site ne le charge de lui-meme.
 *
 * Interaction : on CLIQUE un element -> il devient "selectionne" ; toute
 * l'action (remplacer / ajouter au DS / note) se passe dans le PANNEAU DE
 * DROITE, jamais au-dessus du texte restylise. Rien ne flotte sur la page a
 * part de fins contours.
 *
 * Trois etats (via ds_catalog.json {validated, proposed}) :
 *   validee  = classe -style de _styles_eliott.scss        (DS valide)
 *   candidat = classe -style hors du set valide (SAS ou nouvelle)  -> a revoir
 *   override = style inline
 * Resolution parent : hover/clic remontent au plus proche ancetre -style.
 *
 * Verdicts (action requise, pas de "OK") -> rapport JSON pour Claude Code :
 *   swap  remplacer par une classe validee (preview live) | promote  ajouter
 *   au DS (capture la regle CSS) | note  texte libre.
 * ========================================================================== */
(async function () {
  'use strict';

  if (window.__bdr) { window.__bdr.toggle(); return; }   // re-injection = toggle

  const BASE = '/tb_theme_optimized/static/review';
  const Z = 2147483000;

  /* ---- catalogue ---------------------------------------------------------- */
  const CAT_DATA = {"validated": ["add-to-cart-11-style", "add-to-cart-12-style", "cta-1-style", "cta-2-style", "cta-3-style", "cta-4-style", "cta-important-style", "default-style", "fidelity-offer-title-style", "font1-bold-title-style", "font1-medium-slogan-style", "font1-medium-title-style", "font2-big-title-style", "font2-cta-slogan-style", "font2-slideshow-slogan-style", "font2-small-italic-title-style", "font2-small-smaller-title-style", "font2-small-title-style", "font2-text-italic-style", "font2-title-italic-style", "font2-title-style", "footer-address-style", "footer-copyright-style", "footer-link-hover-style", "footer-links-title-style", "form-label-checkbox-style", "form-label-style", "heavy-subtitle-uppercase-style", "light-subtitle-style", "menu-bottom-link-style", "menu-cart-qty-style", "menu-link-hover-style", "menu-link-mc-style", "menu-link-style", "menu-post-title-style", "menu-promo-bar-style", "menu-responsive-lang-link-style", "menu-responsive-link-style", "menu-responsive-search-placeholder-style", "menu-responsive-search-style", "menu-sub-link-style", "menu-top-link-style", "ppp-style", "product-inci-style", "product-instead-style", "product-name-style", "product-score-style", "product-step-mc-style", "product-step-style", "promoted-product-name-style", "select-style", "sherborne-title-style", "shop-product-base-price-style", "shop-product-description-style", "shop-product-discount-style", "shop-product-fake-discount-style", "shop-product-price-style", "shop-product-title-style", "small-text-style", "text-bold-style", "text-style", "unavailable-2-style", "unavailable-style"], "proposed": ["arguments-list-style", "count-badge-style", "filter-chip-style", "icon-button-style", "link-subtle-style", "micro-text-style", "panel-card-style", "progress-fill-style", "progress-track-style", "section-label-style", "selection-card-style"], "groups": [{"title": "Textes", "items": [{"name": "default-style", "proposed": false}, {"name": "micro-text-style", "proposed": true}, {"name": "small-text-style", "proposed": false}, {"name": "text-bold-style", "proposed": false}, {"name": "text-style", "proposed": false}]}, {"title": "Titres — police 1", "items": [{"name": "font1-bold-title-style", "proposed": false}, {"name": "font1-medium-slogan-style", "proposed": false}, {"name": "font1-medium-title-style", "proposed": false}]}, {"title": "Titres — police 2", "items": [{"name": "font2-big-title-style", "proposed": false}, {"name": "font2-cta-slogan-style", "proposed": false}, {"name": "font2-slideshow-slogan-style", "proposed": false}, {"name": "font2-small-italic-title-style", "proposed": false}, {"name": "font2-small-smaller-title-style", "proposed": false}, {"name": "font2-small-title-style", "proposed": false}, {"name": "font2-text-italic-style", "proposed": false}, {"name": "font2-title-italic-style", "proposed": false}, {"name": "font2-title-style", "proposed": false}, {"name": "sherborne-title-style", "proposed": false}]}, {"title": "Sous-titres & slogans", "items": [{"name": "heavy-subtitle-uppercase-style", "proposed": false}, {"name": "light-subtitle-style", "proposed": false}]}, {"title": "Boutons (CTA)", "items": [{"name": "add-to-cart-11-style", "proposed": false}, {"name": "add-to-cart-12-style", "proposed": false}, {"name": "cta-1-style", "proposed": false}, {"name": "cta-2-style", "proposed": false}, {"name": "cta-3-style", "proposed": false}, {"name": "cta-4-style", "proposed": false}, {"name": "cta-important-style", "proposed": false}]}, {"title": "Boutons-icônes", "items": [{"name": "icon-button-style", "proposed": true}]}, {"title": "Formulaires", "items": [{"name": "form-label-checkbox-style", "proposed": false}, {"name": "form-label-style", "proposed": false}, {"name": "select-style", "proposed": false}]}, {"title": "Prix & produit (shop)", "items": [{"name": "shop-product-base-price-style", "proposed": false}, {"name": "shop-product-description-style", "proposed": false}, {"name": "shop-product-discount-style", "proposed": false}, {"name": "shop-product-fake-discount-style", "proposed": false}, {"name": "shop-product-price-style", "proposed": false}, {"name": "shop-product-title-style", "proposed": false}]}, {"title": "Fiche produit", "items": [{"name": "ppp-style", "proposed": false}, {"name": "product-inci-style", "proposed": false}, {"name": "product-instead-style", "proposed": false}, {"name": "product-name-style", "proposed": false}, {"name": "product-score-style", "proposed": false}, {"name": "product-step-mc-style", "proposed": false}, {"name": "product-step-style", "proposed": false}, {"name": "unavailable-2-style", "proposed": false}, {"name": "unavailable-style", "proposed": false}]}, {"title": "Menu / navigation", "items": [{"name": "menu-bottom-link-style", "proposed": false}, {"name": "menu-cart-qty-style", "proposed": false}, {"name": "menu-link-hover-style", "proposed": false}, {"name": "menu-link-mc-style", "proposed": false}, {"name": "menu-link-style", "proposed": false}, {"name": "menu-post-title-style", "proposed": false}, {"name": "menu-promo-bar-style", "proposed": false}, {"name": "menu-responsive-lang-link-style", "proposed": false}, {"name": "menu-responsive-link-style", "proposed": false}, {"name": "menu-responsive-search-placeholder-style", "proposed": false}, {"name": "menu-responsive-search-style", "proposed": false}, {"name": "menu-sub-link-style", "proposed": false}, {"name": "menu-top-link-style", "proposed": false}]}, {"title": "Footer", "items": [{"name": "footer-address-style", "proposed": false}, {"name": "footer-copyright-style", "proposed": false}, {"name": "footer-link-hover-style", "proposed": false}, {"name": "footer-links-title-style", "proposed": false}]}, {"title": "Cartes & conteneurs", "items": [{"name": "panel-card-style", "proposed": true}, {"name": "selection-card-style", "proposed": true}]}, {"title": "Puces & badges", "items": [{"name": "count-badge-style", "proposed": true}, {"name": "filter-chip-style", "proposed": true}]}, {"title": "Liens & labels", "items": [{"name": "link-subtle-style", "proposed": true}, {"name": "section-label-style", "proposed": true}]}, {"title": "Jauges & barres", "items": [{"name": "progress-fill-style", "proposed": true}, {"name": "progress-track-style", "proposed": true}]}, {"title": "Listes", "items": [{"name": "arguments-list-style", "proposed": true}]}, {"title": "Divers", "items": [{"name": "fidelity-offer-title-style", "proposed": false}, {"name": "promoted-product-name-style", "proposed": false}]}]};
  const CAT = { validated: new Set(CAT_DATA.validated), proposed: new Set(CAT_DATA.proposed), groups: CAT_DATA.groups || [] };

  const feedbacks = [];
  let reviewMode = false;   // demarre EN PAUSE : on lance la revue quand on veut
  let showAll = false;
  let blockMode = false;    // false = element exact sous le curseur (defaut) ; true = block signifiant
  let selected = null;
  let TOKENS = {};   // couleur resolue (rgb) -> nom de token DS (--x)
  let selPath = null;   // element exact clique (pour redescendre apres un ↑ parent)

  /* ---- primitives DS ------------------------------------------------------ */
  function hasStyle(el) {
    return el.nodeType === 1 && Array.prototype.some.call(el.classList, function (c) { return c.endsWith('-style'); });
  }
  function nearestStyled(el) {                            // + proche ancetre porteur d'une -style (ou null)
    let n = el;
    while (n && n.nodeType === 1) {
      if (n.closest('#bdr-root')) return null;
      if (hasStyle(n)) return n;
      n = n.parentElement;
    }
    return null;
  }
  function isBlock(el) {                                  // element "signifiant" : bordure / fond / classe -style
    if (hasStyle(el)) return true;
    const cs = getComputedStyle(el);
    if (cs.borderTopStyle !== 'none' && cs.borderTopWidth !== '0px') return true;
    const c = cs.backgroundColor, img = cs.backgroundImage;
    if (c && c !== 'rgba(0, 0, 0, 0)' && c !== 'transparent') return true;
    if (img && img !== 'none') return true;
    return false;
  }
  function toBlock(el) {                                  // remonte au + proche block signifiant (ou l'element)
    let n = el;
    while (n && n.nodeType === 1 && !n.closest('#bdr-root') && n !== document.body && n !== document.documentElement) {
      if (isBlock(n)) return n;
      n = n.parentElement;
    }
    return el;
  }
  function classify(el) {
    const ds = [], candidat = [];
    el.classList.forEach(function (c) {
      if (!c.endsWith('-style')) return;
      (CAT.validated.has(c) ? ds : candidat).push(c);
    });
    const override = el.getAttribute('style') ? ['inline-style'] : [];
    let state = 'plain';
    if (candidat.length) state = 'candidat';
    else if (ds.length) state = 'ds';
    else if (override.length) state = 'override';
    return { state, ds, candidat, override };
  }
  function describe(el) {
    const parts = []; let n = el;
    while (n && n.nodeType === 1 && parts.length < 6) {
      if (n.id) { parts.unshift('#' + CSS.escape(n.id)); break; }
      let seg = n.tagName.toLowerCase();
      const p = n.parentElement;
      if (p) {
        const same = Array.prototype.filter.call(p.children, function (c) { return c.tagName === n.tagName; });
        if (same.length > 1) seg += ':nth-of-type(' + (same.indexOf(n) + 1) + ')';
      }
      parts.unshift(seg); n = n.parentElement;
    }
    const r = el.getBoundingClientRect();
    return {
      css_path: parts.join(' > '),
      text_anchor: (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 60),
      tag: el.tagName.toLowerCase(),
      rect: { x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height) }
    };
  }
  function ruleFor(cls) {
    for (const sh of document.styleSheets) {
      let rules; try { rules = sh.cssRules; } catch (e) { continue; }
      for (const r of rules) {
        if (r.selectorText && r.selectorText.split(',').some(function (s) { return s.trim() === '.' + cls; })) return r.cssText;
      }
    }
    return null;
  }

  function buildTokens() {                               // map couleur resolue -> nom de token DS
    const probe = h('span', { style: 'position:absolute;opacity:0;pointer-events:none' });
    document.body.appendChild(probe);
    const names = new Set();
    for (const sh of document.styleSheets) {
      let rules; try { rules = sh.cssRules; } catch (e) { continue; }
      for (const r of rules) {
        if (r.selectorText && /(^|,)\s*:root\b/.test(r.selectorText)) {
          for (let i = 0; i < r.style.length; i++) { const p = r.style[i]; if (p.indexOf('--') === 0) names.add(p); }
        }
      }
    }
    names.forEach(function (name) {
      const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
      if (!raw) return;
      probe.style.color = ''; probe.style.color = raw;   // valeur non-couleur (police, ombre) => reste vide
      if (!probe.style.color) return;
      const rgb = getComputedStyle(probe).color;
      if (rgb && rgb !== 'rgba(0, 0, 0, 0)' && !(rgb in TOKENS)) TOKENS[rgb] = name;
    });
    probe.remove();
  }

  function propsBlock(el) {
    const cs = getComputedStyle(el);
    const rows = [];
    function color(label, prop) {
      const v = cs.getPropertyValue(prop).trim();
      if (!v || v === 'rgba(0, 0, 0, 0)' || v === 'transparent') return;
      rows.push([label, v, TOKENS[v] || null]);
    }
    function plain(label, v) { if (v && v !== 'normal' && v !== '0px') rows.push([label, v, null]); }
    const ownC = cs.backgroundColor, ownI = cs.backgroundImage;
    const hasC = ownC && ownC !== 'rgba(0, 0, 0, 0)' && ownC !== 'transparent';
    const hasI = ownI && ownI !== 'none';
    if (hasC) rows.push(['fond', ownC, TOKENS[ownC] || null]);
    if (hasI) rows.push(['fond img', ownI.length > 60 ? ownI.slice(0, 60) + '…' : ownI, null]);
    if (!hasC && !hasI) {                                 // fond effectif herite d'un parent
      let n = el.parentElement;
      while (n && n.nodeType === 1 && !n.closest('#bdr-root')) {
        const b = bgOf(n);
        if (b) { rows.push(['fond ↑', b.length > 46 ? b.slice(0, 46) + '…' : b, TOKENS[b] || null]); break; }
        n = n.parentElement;
      }
    }
    color('texte', 'color');
    if (cs.borderTopStyle !== 'none' && cs.borderTopWidth !== '0px') {
      const bc = cs.borderTopColor.trim();
      rows.push(['bordure', cs.borderTopWidth + ' ' + cs.borderTopStyle + ' ' + bc, TOKENS[bc] || null]);
    }
    plain('radius', cs.borderRadius);
    plain('police', cs.fontFamily);
    plain('taille', cs.fontSize);
    plain('graisse', cs.fontWeight);
    const box = h('div', { class: 'bdr-props' });
    if (!rows.length) return box;
    box.appendChild(h('div', { class: 'bdr-props-t', text: 'Propriétés' }));
    rows.forEach(function (r) {
      const row = h('div', { class: 'bdr-prop' }, h('span', { class: 'k', text: r[0] }), h('span', { class: 'v', text: r[1] }));
      if (r[2]) row.appendChild(h('span', { class: 'tok', text: r[2] }));
      box.appendChild(row);
    });
    return box;
  }

  const breakpoint = function () { return innerWidth < 768 ? 'mobile' : innerWidth < 1024 ? 'tablet' : 'desktop'; };
  const classAttr = function (el) { return el.getAttribute('class') || ''; };   // SVG-safe

  function record(el, verdict, extra) {
    const c = classify(el), d = describe(el);
    feedbacks.push(Object.assign({
      verdict: verdict, url: location.pathname, ts: new Date().toISOString(),
      breakpoint: breakpoint(), viewport: innerWidth + 'x' + innerHeight,
      css_path: d.css_path, text_anchor: d.text_anchor, tag: d.tag, rect: d.rect,
      classes: { ds: c.ds, candidat: c.candidat, override: c.override }
    }, extra || {}));
    el.setAttribute('data-bdr-v', verdict);
    renderTray(); renderSelected();
    toast(verdict === 'swap' ? 'Remplacement enregistre' : verdict === 'promote' ? 'Ajoute au DS' : 'Note enregistree');
  }

  /* ---- peinture ----------------------------------------------------------- */
  function paint() {
    let nDs = 0, nCand = 0;
    document.querySelectorAll('[class*="-style"]').forEach(function (el) {
      if (el.closest('#bdr-root')) return;
      const st = classify(el).state;
      if (st === 'candidat') { nCand++; el.setAttribute('data-bdr', 'candidat'); }
      else if (st === 'ds') { nDs++; if (showAll) el.setAttribute('data-bdr', 'ds'); else el.removeAttribute('data-bdr'); }
      else el.removeAttribute('data-bdr');
    });
    countStyle.textContent = '✅ ' + nDs + '  ✨ ' + nCand;
  }
  function unpaint() { document.querySelectorAll('[data-bdr]').forEach(function (el) { el.removeAttribute('data-bdr'); }); }

  /* ---- helpers DOM -------------------------------------------------------- */
  function h(tag, props) {
    const e = document.createElement(tag);
    if (props) for (const k in props) {
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
  function chip(name, col) { return h('span', { class: 'bdr-chip', style: 'background:' + col + '22;color:' + col, text: name }); }
  const hovBox = h('div', { id: 'bdr-hovbox' });
  const selBox = h('div', { id: 'bdr-selbox' });
  function boxAt(box, el) {                               // cale une boite fixed sur le rect reel de l'element
    if (!el) { box.style.display = 'none'; return; }
    const r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) { box.style.display = 'none'; return; }
    box.style.display = 'block';
    box.style.left = r.left + 'px'; box.style.top = r.top + 'px';
    box.style.width = r.width + 'px'; box.style.height = r.height + 'px';
  }

  /* ---- UI root + styles --------------------------------------------------- */
  const root = h('div', { id: 'bdr-root' });
  const style = h('style', {
    text: `
      #bdr-root{position:fixed;inset:0;z-index:${Z};pointer-events:none;font-family:system-ui,sans-serif;}
      #bdr-root *{box-sizing:border-box;}
      [data-bdr="candidat"]{outline:2px dashed #2563eb !important;outline-offset:2px !important;}
      [data-bdr="ds"]{outline:1px solid rgba(22,163,74,.4) !important;outline-offset:1px !important;}
      [data-bdr-v]{outline:2px solid #0d9488 !important;outline-offset:2px !important;}
      [data-bdr-hover]{outline:2px dotted #f59e0b !important;outline-offset:2px !important;cursor:crosshair !important;}
      [data-bdr-sel]{outline:3px solid #f97316 !important;outline-offset:2px !important;}
      #bdr-hovbox,#bdr-selbox{position:fixed;pointer-events:none;display:none;border-radius:3px;}
      #bdr-hovbox{border:2px dotted #f59e0b;}
      #bdr-selbox{border:3px solid #f97316;box-shadow:0 0 0 1px rgba(249,115,22,.3);}
      #bdr-panel{position:fixed;top:0;right:0;bottom:0;width:322px;z-index:${Z};pointer-events:auto;
        background:#1e293b;color:#e2e8f0;font-size:12px;display:flex;flex-direction:column;
        box-shadow:-8px 0 30px rgba(0,0,0,.35);transition:transform .2s ease;}
      #bdr-panel.collapsed{transform:translateX(100%);}
      #bdr-reopen{position:fixed;top:50%;right:0;transform:translateY(-50%);z-index:${Z};pointer-events:auto;display:none;
        background:#2563eb;color:#fff;padding:12px 6px;border-radius:8px 0 0 8px;cursor:pointer;font-weight:700;
        writing-mode:vertical-rl;box-shadow:-4px 0 14px rgba(0,0,0,.3);}
      #bdr-panel .hd{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:12px 14px;background:#0f172a;}
      #bdr-panel .hd b{font-size:13px;} .bdr-hg{display:flex;align-items:center;gap:6px;}
      #bdr-panel .sec{padding:11px 14px;border-bottom:1px solid #334155;}
      .bdr-row{display:flex;align-items:center;justify-content:space-between;gap:8px;}
      .bdr-badge{background:#0f172a;border-radius:6px;padding:3px 7px;font-variant-numeric:tabular-nums;}
      .bdr-kbd{background:#334155;border-radius:5px;padding:2px 6px;font-size:10px;}
      .bdr-btn{cursor:pointer;border:none;border-radius:8px;padding:8px 11px;font-size:12px;font-weight:600;color:#fff;background:#334155;}
      .bdr-btn:hover{filter:brightness(1.15);}
      .bdr-btn.pause{background:#ea580c;} .bdr-btn.paused{background:#16a34a;}
      .bdr-btn.exp{background:#16a34a;flex:1;} .bdr-btn.mini{padding:5px 9px;font-size:11px;background:#475569;}
      .bdr-btn.bg{margin-top:8px;width:100%;background:#0d9488;}
      .bdr-icon{cursor:pointer;background:none;border:none;color:#cbd5e1;font-size:16px;line-height:1;padding:2px 4px;}
      .bdr-hover{color:#94a3b8;min-height:18px;font-size:11px;word-break:break-word;}
      .bdr-hover .up{color:#fbbf24;}
      .bdr-empty{color:#64748b;font-style:italic;padding:6px 0;}
      .bdr-selhd{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;}
      .bdr-state{font-weight:700;padding:2px 8px;border-radius:6px;}
      .bdr-state.candidat{background:#2563eb33;color:#93c5fd;} .bdr-state.ds{background:#16a34a33;color:#86efac;}
      .bdr-state.override{background:#dc262633;color:#fca5a5;} .bdr-state.plain{background:#47556933;color:#cbd5e1;}
      .bdr-x{cursor:pointer;color:#94a3b8;font-size:16px;line-height:1;}
      .bdr-nav{display:flex;gap:9px;align-items:center;}
      .bdr-navbtn{cursor:pointer;color:#93c5fd;font-size:15px;line-height:1;font-weight:700;}
      .bdr-navbtn:hover{color:#fff;}
      .bdr-chips{display:flex;flex-wrap:wrap;gap:3px;margin-bottom:8px;}
      .bdr-chip{display:inline-block;padding:1px 6px;border-radius:5px;font-weight:600;font-family:ui-monospace,monospace;font-size:11px;}
      .bdr-anchor{color:#94a3b8;font-size:11px;word-break:break-word;}
      .bdr-props{margin-top:9px;border-top:1px solid #334155;padding-top:7px;}
      .bdr-props-t{color:#93c5fd;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px;}
      .bdr-prop{display:flex;gap:6px;align-items:baseline;font-size:11px;padding:1px 0;flex-wrap:wrap;}
      .bdr-prop .k{color:#94a3b8;min-width:50px;}
      .bdr-prop .v{color:#e2e8f0;font-family:ui-monospace,monospace;word-break:break-all;}
      .bdr-prop .tok{color:#34d399;font-family:ui-monospace,monospace;background:#34d39922;padding:0 5px;border-radius:4px;}
      .bdr-verbs{display:flex;flex-wrap:wrap;gap:6px;padding:11px 14px;}
      .bdr-v{cursor:pointer;border:1px solid #475569;background:#334155;color:#fff;border-radius:8px;padding:7px 10px;font-size:12px;font-weight:600;}
      .bdr-v:hover{background:#475569;} .bdr-v.promote{border-color:#3b82f6;color:#93c5fd;}
      .bdr-dyn{flex:1;overflow:auto;padding:0 14px;}
      #bdr-search{width:100%;padding:7px 9px;border:1px solid #475569;border-radius:7px;margin:6px 0;font-size:12px;background:#0f172a;color:#e2e8f0;}
      .bdr-opt{cursor:pointer;padding:5px 8px;border-radius:6px;font-family:ui-monospace,monospace;font-size:11px;color:#cbd5e1;}
      .bdr-opt:hover{background:#2563eb;color:#fff;}
      .bdr-opt.prop{color:#93c5fd;}
      .bdr-optgroup{color:#93c5fd;font-weight:700;font-size:10px;text-transform:uppercase;letter-spacing:.05em;padding:9px 4px 3px;border-top:1px solid #334155;margin-top:2px;}
      #bdr-note{width:100%;height:80px;border:1px solid #475569;border-radius:7px;padding:7px;font-size:12px;resize:vertical;background:#0f172a;color:#e2e8f0;margin:6px 0;}
      .bdr-ft{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:11px 14px;background:#0f172a;}
      #bdr-toast{position:fixed;bottom:16px;right:338px;z-index:${Z};pointer-events:none;background:#0d9488;color:#fff;
        padding:8px 12px;border-radius:8px;font-size:12px;font-weight:600;opacity:0;transition:opacity .2s;box-shadow:0 6px 20px rgba(0,0,0,.3);}
      #bdr-toast.on{opacity:1;}
    `
  });

  /* ---- toast -------------------------------------------------------------- */
  const toastEl = h('div', { id: 'bdr-toast' });
  let toastT = 0;
  function toast(msg) { toastEl.textContent = msg; toastEl.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove('on'); }, 1600); }

  /* ---- panneau : structure ------------------------------------------------ */
  const resBadge = h('span', { class: 'bdr-badge' });
  const countStyle = h('span', { class: 'bdr-badge', text: '✅ 0  ✨ 0' });
  const countBadge = h('span', { class: 'bdr-badge', text: '0 retour' });
  const allBtn = h('button', { class: 'bdr-btn mini', text: 'Candidats seuls', onclick: toggleAll });
  const targetBtn = h('button', { class: 'bdr-btn mini', title: 'Granularite du clic', text: 'Cible: exact', onclick: toggleTarget });
  const pauseBtn = h('button', { class: 'bdr-btn paused', title: 'Lancer / suspendre la revue (Alt+R)', text: '▶ Lancer la revue', onclick: toggle });
  const exportBtn = h('button', { class: 'bdr-btn exp', text: 'Exporter', onclick: exportJSON });
  const hoverLine = h('div', { class: 'bdr-hover', text: 'Survole un element...' });
  const selCard = h('div', { class: 'sec' });
  const verbsBox = h('div', { class: 'bdr-verbs' });
  const dynBox = h('div', { class: 'bdr-dyn' });

  const panel = h('div', { id: 'bdr-panel' },
    h('div', { class: 'hd' }, h('b', { text: 'Design Review' }),
      h('div', { class: 'bdr-hg' }, pauseBtn,
        h('button', { class: 'bdr-btn mini', title: 'Cacher le panneau (rouvre via l onglet a droite)', text: '⟩ Cacher', onclick: collapse }))),
    h('div', { class: 'sec' }, h('div', { class: 'bdr-row' }, resBadge, countStyle),
      h('div', { class: 'bdr-row', style: 'margin-top:8px' }, hoverLine)),
    h('div', { class: 'sec' }, h('div', { class: 'bdr-row' }, allBtn, targetBtn)),
    selCard, verbsBox, dynBox,
    h('div', { class: 'bdr-ft' }, countBadge, exportBtn)
  );
  const reopen = h('div', { id: 'bdr-reopen', title: 'Rouvrir le panneau', text: '◀ Panneau', onclick: expand });

  /* ---- selection + rendu -------------------------------------------------- */
  function setSel(el) {
    selected = el; boxAt(selBox, el);
    renderSelected();
  }
  function select(el) { selPath = el; setSel(blockMode ? toBlock(el) : el); expand(); }
  function deselect() { selected = null; selPath = null; selBox.style.display = 'none'; renderSelected(); }
  function navUp() {
    if (!selected) return;
    const p = selected.parentElement;
    if (p && p.nodeType === 1 && p !== document.body && p !== document.documentElement && !p.closest('#bdr-root')) setSel(p);
  }
  function navDown() {
    if (!selected || !selPath || selected === selPath) return;
    let n = selPath;
    while (n && n.parentElement !== selected) n = n.parentElement;
    if (n) setSel(n);
  }
  function bgOf(el) {
    const cs = getComputedStyle(el);
    const c = cs.backgroundColor, img = cs.backgroundImage;
    if (c && c !== 'rgba(0, 0, 0, 0)' && c !== 'transparent') return c;
    if (img && img !== 'none') return img;
    return null;
  }
  function climbToBg() {                                  // remonte au + proche parent qui porte un fond
    let n = selected ? selected.parentElement : null;
    while (n && n.nodeType === 1 && !n.closest('#bdr-root') && n !== document.documentElement) {
      if (bgOf(n)) { setSel(n); return; }
      n = n.parentElement;
    }
    toast('Aucun parent avec un fond');
  }

  function renderSelected() {
    verbsBox.innerHTML = '';
    if (!selected) { selCard.innerHTML = ''; selCard.appendChild(h('div', { class: 'bdr-empty', text: 'Clique un element a annoter.' })); dynBox.innerHTML = ''; return; }
    const c = classify(selected), d = describe(selected);
    selCard.innerHTML = '';
    const stLabel = { candidat: '✨ candidat', ds: '✅ valide', override: '⛔ inline', plain: 'DS neutre' }[c.state];
    selCard.appendChild(h('div', { class: 'bdr-selhd' },
      h('span', { class: 'bdr-state ' + c.state, text: stLabel }),
      h('span', { class: 'bdr-nav' },
        h('span', { class: 'bdr-navbtn', title: 'Selectionner le parent', text: '↑', onclick: navUp }),
        h('span', { class: 'bdr-navbtn', title: 'Redescendre vers l element clique', text: '↓', onclick: navDown }),
        h('span', { class: 'bdr-x', text: '×', title: 'Deselectionner', onclick: deselect }))));
    const chips = h('div', { class: 'bdr-chips' });
    c.ds.forEach(function (n) { chips.appendChild(chip(n, '#16a34a')); });
    c.candidat.forEach(function (n) { chips.appendChild(chip(n, '#2563eb')); });
    if (c.override.length) chips.appendChild(chip('inline-style', '#dc2626'));
    if (c.state === 'plain') chips.appendChild(chip('— DS neutre —', '#94a3b8'));
    selCard.appendChild(chips);
    selCard.appendChild(h('div', { class: 'bdr-anchor', text: '<' + d.tag + '>  ' + d.text_anchor }));
    selCard.appendChild(propsBlock(selected));
    if (!bgOf(selected)) selCard.appendChild(h('button', { class: 'bdr-btn bg', text: "↑ Aller à l'élément avec fond", onclick: climbToBg }));

    verbsBox.appendChild(h('button', { class: 'bdr-v', text: '🔁 Remplacer', onclick: showSwap }));
    if (c.candidat.length) verbsBox.appendChild(h('button', { class: 'bdr-v promote', text: '✨ Ajouter au DS',
      onclick: function () { record(selected, 'promote', { proposition: c.candidat[0], css_rule: ruleFor(c.candidat[0]) }); } }));
    verbsBox.appendChild(h('button', { class: 'bdr-v', text: '📝 Note', onclick: showNote }));
    dynBox.innerHTML = '';
  }

  /* ---- swap (dans le panneau, preview live sur la page) ------------------- */
  let previewOrig = null;
  function swapPreview(cls) {
    if (!selected) return;
    if (previewOrig === null) previewOrig = classAttr(selected);
    const kept = classAttr(selected).split(/\s+/).filter(function (c) { return c && !c.endsWith('-style'); });
    kept.push(cls); selected.setAttribute('class', kept.join(' ')); boxAt(selBox, selected);
  }
  function restorePreview() { if (selected && previewOrig !== null) { selected.setAttribute('class', previewOrig); boxAt(selBox, selected); } previewOrig = null; }

  function showSwap() {
    if (!selected) return;
    dynBox.innerHTML = '';
    const search = h('input', { id: 'bdr-search', placeholder: 'Chercher une classe...' });
    const list = h('div', {});
    const groups = (CAT.groups && CAT.groups.length) ? CAT.groups
      : [{ title: 'Classes', items: Array.from(CAT.validated).concat(Array.from(CAT.proposed)).sort().map(function (n) { return { name: n, proposed: CAT.proposed.has(n) }; }) }];
    function optEl(it) {
      const opt = h('div', { class: 'bdr-opt' + (it.proposed ? ' prop' : ''), text: (it.proposed ? '✨ ' : '') + it.name });
      opt.addEventListener('mouseenter', function () { swapPreview(it.name); });
      opt.addEventListener('mouseleave', function () { restorePreview(); });
      opt.addEventListener('click', function () { previewOrig = null; record(selected, 'swap', { proposition: it.name }); });
      return opt;
    }
    function fill(q) {
      list.innerHTML = '';
      groups.forEach(function (g) {
        const items = g.items.filter(function (it) { return it.name.indexOf(q) !== -1; });
        if (!items.length) return;
        list.appendChild(h('div', { class: 'bdr-optgroup', text: g.title }));
        items.forEach(function (it) { list.appendChild(optEl(it)); });
      });
    }
    search.addEventListener('input', function () { fill(search.value.trim()); });
    dynBox.appendChild(search); dynBox.appendChild(list); fill(''); search.focus();
  }

  function showNote() {
    if (!selected) return;
    dynBox.innerHTML = '';
    const ta = h('textarea', { id: 'bdr-note', placeholder: 'Changements a operer, ou style souhaite si pas de classe DS...' });
    const save = h('button', { class: 'bdr-btn', text: 'Enregistrer la note',
      onclick: function () { if (ta.value.trim()) record(selected, 'note', { note: ta.value.trim() }); dynBox.innerHTML = ''; } });
    dynBox.appendChild(ta); dynBox.appendChild(save); ta.focus();
  }

  /* ---- barre : divers ----------------------------------------------------- */
  function renderRes() { resBadge.textContent = breakpoint() + ' ' + innerWidth + '×' + innerHeight; }
  function renderTray() { countBadge.textContent = feedbacks.length + ' retour' + (feedbacks.length > 1 ? 's' : ''); }
  function toggleAll() { showAll = !showAll; allBtn.textContent = showAll ? 'Tout surligne' : 'Candidats seuls'; if (reviewMode) paint(); }
  function toggleTarget() { blockMode = !blockMode; targetBtn.textContent = blockMode ? 'Cible: block' : 'Cible: exact'; }
  function collapse() { panel.classList.add('collapsed'); reopen.style.display = 'block'; }
  function expand() { panel.classList.remove('collapsed'); reopen.style.display = 'none'; }

  function exportJSON() {
    const data = JSON.stringify(feedbacks, null, 2);
    try { navigator.clipboard && navigator.clipboard.writeText(data); } catch (e) {}
    const blob = new Blob([data], { type: 'application/json' });
    const a = h('a', { href: URL.createObjectURL(blob), download: 'review_' + location.hostname + '_' + Date.now() + '.json' });
    root.appendChild(a); a.click(); a.remove();
    toast(feedbacks.length + ' retour(s) exporte(s)');
  }

  function toggle() {
    reviewMode = !reviewMode;
    pauseBtn.textContent = reviewMode ? '⏸ Suspendre' : '▶ Reprendre';
    pauseBtn.className = 'bdr-btn ' + (reviewMode ? 'pause' : 'paused');
    if (reviewMode) paint(); else { unpaint(); clearHover(); }
  }

  /* ---- hover -------------------------------------------------------------- */
  let hovered = null;
  function setHover(el) { hovered = el; boxAt(hovBox, el); }
  function clearHover() { hovered = null; hovBox.style.display = 'none'; hoverLine.innerHTML = 'Survole un element...'; }
  function showHoverInfo(el) {
    const c = classify(el);
    const names = c.ds.concat(c.candidat);
    let txt = '&lt;' + el.tagName.toLowerCase() + '&gt; ';
    if (names.length) { txt += names.join(', '); }
    else {
      const base = c.override.length ? 'inline-style' : '— DS neutre —';
      const anc = nearestStyled(el);
      if (anc) { const a = classify(anc); txt += base + ' <span class="up">↑ ' + anc.tagName.toLowerCase() + ' ' + a.ds.concat(a.candidat).join(',') + '</span>'; }
      else txt += base;
    }
    hoverLine.innerHTML = txt;
  }

  /* ---- listeners ---------------------------------------------------------- */
  document.addEventListener('mouseover', function (e) {
    if (!reviewMode || e.target.closest('#bdr-root')) { clearHover(); return; }
    const t = blockMode ? toBlock(e.target) : e.target;
    setHover(t); showHoverInfo(t);
  }, true);
  document.addEventListener('click', function (e) {
    if (!reviewMode) return;
    if (e.target.closest('#bdr-root')) return;
    e.preventDefault(); e.stopImmediatePropagation();
    select(e.target);
  }, true);
  // Mode review : neutraliser toute action de la page (add-to-cart, submit, liens, handlers mousedown...).
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
  addEventListener('resize', function () { renderRes(); if (reviewMode) paint(); boxAt(selBox, selected); boxAt(hovBox, hovered); });
  addEventListener('scroll', function () { if (selected) boxAt(selBox, selected); if (hovered) boxAt(hovBox, hovered); }, true);
  addEventListener('keydown', function (e) { if (e.altKey && (e.key === 'r' || e.key === 'R')) { e.preventDefault(); toggle(); } });

  /* ---- boot --------------------------------------------------------------- */
  root.appendChild(style); root.appendChild(hovBox); root.appendChild(selBox); root.appendChild(panel); root.appendChild(reopen); root.appendChild(toastEl);
  document.body.appendChild(root);
  buildTokens();
  renderRes(); renderTray(); renderSelected(); if (reviewMode) paint();

  window.__bdr = { toggle: toggle, feedbacks: feedbacks, export: exportJSON };
  console.log('[BDR] pret (EN PAUSE) —', CAT.validated.size, 'validees,', CAT.proposed.size, 'proposees. Bouton "▶ Lancer la revue" ou Alt+R pour demarrer.');
})();
