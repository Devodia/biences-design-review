// ==UserScript==
// @name         Biences Design Review
// @namespace    devodia.biences
// @version      0.15.0
// (refonte UX/UI : palette premium, header 1 ligne, ecran d'accueil centre, etats live/pause)
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
  let selected = null;
  let TOKENS = {};   // couleur resolue (rgb) -> nom de token DS (--x)
  let selPath = null;   // element exact clique (pour redescendre apres un ↑ parent)
  let lastStack = [];   // elements empiles sous le curseur au dernier clic (pour percer les overlays)

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
    // css_path ancre sur le + proche id (self ou ancetre), sans plafond -> unique
    const parts = []; let n = el;
    while (n && n.nodeType === 1 && !n.closest('#bdr-root')) {
      if (n.id) { parts.unshift('#' + CSS.escape(n.id)); break; }
      let seg = n.tagName.toLowerCase();
      const p = n.parentElement;
      if (p) {
        const same = Array.prototype.filter.call(p.children, function (c) { return c.tagName === n.tagName; });
        if (same.length > 1) seg += ':nth-of-type(' + (same.indexOf(n) + 1) + ')';
      }
      parts.unshift(seg); n = n.parentElement;
    }
    // id de l'element ou du + proche ancetre porteur d'un id
    let a = el, id = '';
    while (a && a.nodeType === 1 && !a.closest('#bdr-root')) { if (a.id) { id = a.id; break; } a = a.parentElement; }
    // tag d'ouverture = ancre grep vers le template (attributs internes exclus)
    let open = '<' + el.tagName.toLowerCase();
    Array.prototype.forEach.call(el.attributes, function (at) {
      if (at.name === 'style' || at.name.indexOf('data-bdr') === 0) return;
      open += ' ' + at.name + (at.value ? '="' + at.value + '"' : '');
    });
    open += '>';
    if (open.length > 240) open = open.slice(0, 240) + '…';
    const r = el.getBoundingClientRect();
    return {
      css_path: parts.join(' > '),
      id: id,
      open_tag: open,
      classes_all: classAttr(el).trim().split(/\s+/).filter(Boolean),
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

  function fontSig(cs) { return [cs.fontFamily, cs.fontSize, cs.fontWeight, cs.fontStyle, cs.color, cs.backgroundColor, cs.textTransform, cs.letterSpacing, cs.lineHeight, cs.textDecorationLine].join('|'); }
  function dsClassInert(el) {                             // la classe -style ne change RIEN au rendu ? (ecrasee par une regle locale)
    if (!Array.prototype.some.call(el.classList, function (c) { return c.endsWith('-style'); })) return false;
    const before = fontSig(getComputedStyle(el));
    const orig = classAttr(el);
    el.setAttribute('class', orig.split(/\s+/).filter(function (c) { return c && !c.endsWith('-style'); }).join(' '));
    const after = fontSig(getComputedStyle(el));
    el.setAttribute('class', orig);
    return before === after;
  }
  const breakpoint = function () { return innerWidth < 768 ? 'mobile' : innerWidth < 1024 ? 'tablet' : 'desktop'; };
  const classAttr = function (el) { return el.getAttribute('class') || ''; };   // SVG-safe

  function record(el, verdict, extra) {
    const c = classify(el), d = describe(el);
    feedbacks.push(Object.assign({
      verdict: verdict, url: location.pathname, ts: new Date().toISOString(),
      breakpoint: breakpoint(), viewport: innerWidth + 'x' + innerHeight,
      tag: d.tag, id: d.id, open_tag: d.open_tag, text_anchor: d.text_anchor,
      css_path: d.css_path, rect: d.rect,
      classes: { ds: c.ds, candidat: c.candidat, override: c.override, all: d.classes_all }
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
      else { if (st === 'ds') nDs++; el.removeAttribute('data-bdr'); }
    });
    countStyle.textContent = '✨ ' + nCand + '  ·  ✅ ' + nDs;
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
      #bdr-root{position:fixed;inset:0;z-index:${Z};pointer-events:none;font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;}
      #bdr-root *{box-sizing:border-box;}
      [data-bdr="candidat"]{outline:2px dashed #60a5fa !important;outline-offset:2px !important;}
      [data-bdr-v]{outline:2px solid #2dd4bf !important;outline-offset:2px !important;}
      #bdr-hovbox,#bdr-selbox{position:fixed;pointer-events:none;display:none;border-radius:4px;}
      #bdr-hovbox{border:2px dashed #fbbf24;background:rgba(251,191,36,.06);}
      #bdr-selbox{border:2px solid #f97316;background:rgba(249,115,22,.08);box-shadow:0 0 0 1px rgba(249,115,22,.25),0 0 16px rgba(249,115,22,.22);}
      #bdr-panel{position:fixed;top:0;right:0;bottom:0;width:352px;z-index:${Z};pointer-events:auto;display:flex;flex-direction:column;background:#0f1620;color:#e6eaf0;font-size:12.5px;line-height:1.45;border-left:1px solid #22303f;box-shadow:-14px 0 44px rgba(0,0,0,.45);transition:transform .22s cubic-bezier(.4,0,.2,1);}
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
      .bdr-hint{color:#8896a8;font-size:11.5px;margin-top:11px;text-align:center;line-height:1.55;}
      .bdr-live-row{display:flex;align-items:center;gap:9px;}
      .bdr-livedot{width:8px;height:8px;border-radius:50%;background:#22c55e;box-shadow:0 0 8px #22c55e;animation:bdrpulse 1.6s infinite;flex:0 0 auto;}
      @keyframes bdrpulse{0%,100%{opacity:1;}50%{opacity:.3;}}
      .bdr-live-lbl{font-weight:600;flex:1;}
      .bdr-ghost{cursor:pointer;background:none;border:1px solid #2a3a4c;color:#c3ccd8;border-radius:8px;padding:5px 12px;font-size:11.5px;font-weight:600;}
      .bdr-ghost:hover{background:#1b2634;border-color:#3a4c60;}
      .bdr-meta{display:flex;gap:6px;margin-top:12px;}
      .bdr-chip2{background:#16202c;border:1px solid #22303f;border-radius:7px;padding:4px 9px;font-size:11px;color:#8896a8;font-variant-numeric:tabular-nums;}
      .bdr-hover{color:#8896a8;font-size:11px;margin-top:12px;min-height:15px;word-break:break-word;}
      .bdr-hover .up{color:#fbbf24;}
      .bdr-card{margin:12px 14px 0;background:#131c27;border:1px solid #22303f;border-radius:12px;padding:13px;}
      .bdr-empty{margin:30px 18px;text-align:center;color:#5b6b7d;font-size:12px;line-height:1.6;}
      .bdr-empty b{display:block;color:#8896a8;font-size:13px;margin-bottom:5px;font-weight:600;}
      .bdr-selhd{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;}
      .bdr-state{font-weight:700;padding:3px 9px;border-radius:7px;font-size:11px;}
      .bdr-state.candidat{background:#60a5fa22;color:#93c5fd;} .bdr-state.ds{background:#22c55e22;color:#86efac;}
      .bdr-state.override{background:#ef444422;color:#fca5a5;} .bdr-state.plain{background:#8896a822;color:#c3ccd8;}
      .bdr-selhd{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;}
      .bdr-nav{display:flex;gap:3px;align-items:center;}
      .bdr-navbtn{cursor:pointer;color:#8896a8;font-size:15px;line-height:1;font-weight:700;padding:2px 7px;border-radius:6px;}
      .bdr-navbtn:hover{background:#1b2634;color:#e6eaf0;}
      .bdr-x{cursor:pointer;color:#8896a8;font-size:17px;line-height:1;padding:0 5px;} .bdr-x:hover{color:#fca5a5;}
      .bdr-chips{display:flex;flex-wrap:wrap;gap:4px;margin-bottom:9px;}
      .bdr-chip{display:inline-block;padding:2px 7px;border-radius:6px;font-weight:600;font-family:ui-monospace,monospace;font-size:11px;}
      .bdr-anchor{color:#6b7b8d;font-size:11px;word-break:break-word;font-family:ui-monospace,monospace;}
      .bdr-props{margin-top:11px;border-top:1px solid #22303f;padding-top:9px;}
      .bdr-props-t,.bdr-stack-t{color:#6b7b8d;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;margin-bottom:5px;}
      .bdr-prop{display:flex;gap:8px;align-items:baseline;font-size:11px;padding:2px 0;flex-wrap:wrap;}
      .bdr-prop .k{color:#6b7b8d;min-width:48px;}
      .bdr-prop .v{color:#e6eaf0;font-family:ui-monospace,monospace;word-break:break-all;}
      .bdr-prop .tok{color:#2dd4bf;font-family:ui-monospace,monospace;background:#2dd4bf1f;padding:1px 6px;border-radius:5px;}
      .bdr-warn{margin-top:10px;font-size:11px;color:#fcd34d;background:#78350f4d;border:1px solid #9a3412;border-radius:8px;padding:8px 10px;line-height:1.45;}
      .bdr-stack{margin-top:11px;border-top:1px solid #22303f;padding-top:8px;}
      .bdr-stack-row{cursor:pointer;padding:3px 7px;border-radius:6px;font-family:ui-monospace,monospace;font-size:11px;color:#8896a8;}
      .bdr-stack-row:hover{background:#1b2634;color:#e6eaf0;} .bdr-stack-row.on{background:#f9731626;color:#fdba74;}
      .bdr-verbs{display:flex;flex-wrap:wrap;gap:7px;padding:12px 14px 4px;}
      .bdr-v{cursor:pointer;border:1px solid #2a3a4c;background:#182230;color:#e6eaf0;border-radius:9px;padding:8px 12px;font-size:12px;font-weight:600;transition:background .12s;}
      .bdr-v:hover{background:#22303f;} .bdr-v.promote{border-color:#3b82f6;color:#93c5fd;background:#3b82f614;}
      .bdr-btn.bg{cursor:pointer;border:none;margin-top:10px;width:100%;background:#134e4a;color:#5eead4;border-radius:9px;padding:9px;font-size:12px;font-weight:600;}
      .bdr-btn.bg:hover{background:#155e56;}
      .bdr-dyn{flex:1;overflow:auto;padding:0 14px;}
      #bdr-search{width:100%;padding:8px 10px;border:1px solid #2a3a4c;border-radius:8px;margin:8px 0;font-size:12px;background:#0b1119;color:#e6eaf0;}
      #bdr-search:focus{outline:none;border-color:#f97316;}
      .bdr-opt{cursor:pointer;padding:6px 9px;border-radius:7px;font-family:ui-monospace,monospace;font-size:11px;color:#c3ccd8;}
      .bdr-opt:hover{background:#f97316;color:#fff;} .bdr-opt.prop{color:#93c5fd;}
      .bdr-optgroup{color:#6b7b8d;font-weight:700;font-size:10px;text-transform:uppercase;letter-spacing:.06em;padding:10px 4px 4px;border-top:1px solid #22303f;margin-top:3px;}
      #bdr-note{width:100%;height:84px;border:1px solid #2a3a4c;border-radius:8px;padding:8px;font-size:12px;resize:vertical;background:#0b1119;color:#e6eaf0;margin:8px 0;font-family:inherit;}
      #bdr-note:focus{outline:none;border-color:#f97316;}
      .bdr-ft{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:12px 14px;border-top:1px solid #1b2634;background:#0b1119;}
      .bdr-ft .cnt{color:#8896a8;font-size:11.5px;font-variant-numeric:tabular-nums;}
      .bdr-exp{cursor:pointer;border:none;border-radius:9px;padding:9px 18px;font-size:12px;font-weight:700;color:#fff;background:linear-gradient(135deg,#fb923c,#f97316);box-shadow:0 4px 12px rgba(249,115,22,.3);}
      .bdr-exp:hover{filter:brightness(1.06);}
      #bdr-toast{position:fixed;bottom:18px;right:368px;z-index:${Z};pointer-events:none;background:#0d9488;color:#fff;padding:9px 14px;border-radius:9px;font-size:12px;font-weight:600;opacity:0;transform:translateY(6px);transition:opacity .2s,transform .2s;box-shadow:0 8px 24px rgba(0,0,0,.4);}
      #bdr-toast.on{opacity:1;transform:translateY(0);}
    `
  });

  /* ---- toast -------------------------------------------------------------- */
  const toastEl = h('div', { id: 'bdr-toast' });
  let toastT = 0;
  function toast(msg) { toastEl.textContent = msg; toastEl.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove('on'); }, 1600); }

  /* ---- panneau : structure ------------------------------------------------ */
  const resBadge = h('span', { class: 'bdr-chip2' });
  const countStyle = h('span', { class: 'bdr-chip2', title: 'Candidats a revoir  ·  classes DS validees sur la page', text: '✨ 0' });
  const countBadge = h('span', { class: 'cnt', text: '0 retour' });
  const exportBtn = h('button', { class: 'bdr-exp', text: 'Exporter', onclick: exportJSON });
  const hoverLine = h('div', { class: 'bdr-hover' });
  const selCard = h('div', {});
  const verbsBox = h('div', { class: 'bdr-verbs' });
  const dynBox = h('div', { class: 'bdr-dyn' });
  const topZone = h('div', { id: 'bdr-top' });

  const panel = h('div', { id: 'bdr-panel' },
    h('div', { class: 'bdr-hd' },
      h('div', { class: 'bdr-brand' }, h('span', { class: 'bdr-dot' }), 'Design Review'),
      h('button', { class: 'bdr-icon', title: 'Cacher (rouvre via l onglet a droite)', text: '⟩', onclick: collapse })),
    topZone,
    selCard, verbsBox, dynBox,
    h('div', { class: 'bdr-ft' }, countBadge, exportBtn)
  );
  const reopen = h('div', { id: 'bdr-reopen', title: 'Ouvrir Design Review', text: '◀ Design Review', onclick: expand });

  function syncState() {
    topZone.innerHTML = '';
    if (!reviewMode) {
      topZone.appendChild(h('button', { class: 'bdr-cta', text: '▶  Lancer la revue', onclick: toggle }));
      topZone.appendChild(h('div', { class: 'bdr-hint', text: 'Survolez un élément, cliquez pour proposer un changement.' }));
    } else {
      topZone.appendChild(h('div', { class: 'bdr-live-row' },
        h('span', { class: 'bdr-livedot' }),
        h('span', { class: 'bdr-live-lbl', text: 'Revue en cours' }),
        h('button', { class: 'bdr-ghost', title: 'Suspendre (Alt+R)', text: '⏸ Pause', onclick: toggle })));
      topZone.appendChild(h('div', { class: 'bdr-meta' }, resBadge, countStyle));
      topZone.appendChild(hoverLine);
    }
  }

  /* ---- selection + rendu -------------------------------------------------- */
  function setSel(el) {
    selected = el; boxAt(selBox, el);
    renderSelected();
  }
  function select(el) { selPath = el; setSel(el); expand(); }
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
    verbsBox.innerHTML = ''; selCard.innerHTML = '';
    if (!selected) {
      dynBox.innerHTML = ''; selCard.className = '';
      if (reviewMode) selCard.appendChild(h('div', { class: 'bdr-empty' }, h('b', { text: 'Aucun élément sélectionné' }), "Survolez la page puis cliquez un élément pour l'inspecter."));
      return;
    }
    selCard.className = 'bdr-card';
    const c = classify(selected), d = describe(selected);
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
    if (dsClassInert(selected)) selCard.appendChild(h('div', { class: 'bdr-warn', text: "⚠ Classe DS sans effet ici — une règle locale l'écrase. Un swap ne changera pas le rendu." }));
    if (lastStack.length > 1) {
      const sw = h('div', { class: 'bdr-stack' }, h('div', { class: 'bdr-stack-t', text: 'Sous le curseur (perce les overlays)' }));
      lastStack.slice(0, 8).forEach(function (el) {
        const cls = classAttr(el).trim().split(/\s+/).filter(Boolean).slice(0, 2).join('.');
        const label = '<' + el.tagName.toLowerCase() + '>' + (cls ? ' .' + cls : '');
        sw.appendChild(h('div', { class: 'bdr-stack-row' + (el === selected ? ' on' : ''), text: label, onclick: function () { setSel(el); } }));
      });
      selCard.appendChild(sw);
    }

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
      opt.addEventListener('click', function () {
        const original = (previewOrig !== null ? previewOrig : classAttr(selected));
        const from = original.split(/\s+/).filter(function (c) { return c.endsWith('-style'); });
        selected.setAttribute('class', original); previewOrig = null; boxAt(selBox, selected);   // enregistre l'ETAT ORIGINAL
        record(selected, 'swap', { from: from, proposition: it.name });
      });
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
    if (reviewMode) { expand(); paint(); } else { unpaint(); clearHover(); }
    syncState(); renderSelected();
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
    setHover(e.target); showHoverInfo(e.target);
  }, true);
  document.addEventListener('click', function (e) {
    if (!reviewMode) return;
    if (e.target.closest('#bdr-root')) return;
    e.preventDefault(); e.stopImmediatePropagation();
    lastStack = document.elementsFromPoint(e.clientX, e.clientY).filter(function (el) { return !el.closest('#bdr-root'); });
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
  renderRes(); renderTray(); syncState(); renderSelected(); if (reviewMode) paint();
  collapse();   // se charge CACHE : seul l'onglet lateral droit est visible, l'utilisateur ouvre quand il veut

  window.__bdr = { toggle: toggle, feedbacks: feedbacks, export: exportJSON };
  console.log('[BDR] pret (CACHE, EN PAUSE) —', CAT.validated.size, 'validees,', CAT.proposed.size, 'proposees. Onglet "Design Review" a droite pour ouvrir (ou Alt+R pour ouvrir + demarrer).');
})();
