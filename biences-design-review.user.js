// ==UserScript==
// @name         Biences Design Review
// @namespace    devodia.biences
// @version      0.2.0
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
  const CAT_DATA = {"validated": ["add-to-cart-11-style", "add-to-cart-12-style", "cta-1-style", "cta-2-style", "cta-3-style", "cta-4-style", "cta-important-style", "default-style", "fidelity-offer-title-style", "font1-bold-title-style", "font1-medium-slogan-style", "font1-medium-title-style", "font2-big-title-style", "font2-cta-slogan-style", "font2-slideshow-slogan-style", "font2-small-italic-title-style", "font2-small-smaller-title-style", "font2-small-title-style", "font2-text-italic-style", "font2-title-italic-style", "font2-title-style", "footer-address-style", "footer-copyright-style", "footer-link-hover-style", "footer-links-title-style", "form-label-checkbox-style", "form-label-style", "heavy-subtitle-uppercase-style", "light-subtitle-style", "menu-bottom-link-style", "menu-cart-qty-style", "menu-link-hover-style", "menu-link-mc-style", "menu-link-style", "menu-post-title-style", "menu-promo-bar-style", "menu-responsive-lang-link-style", "menu-responsive-link-style", "menu-responsive-search-placeholder-style", "menu-responsive-search-style", "menu-sub-link-style", "menu-top-link-style", "ppp-style", "product-inci-style", "product-instead-style", "product-name-style", "product-score-style", "product-step-mc-style", "product-step-style", "promoted-product-name-style", "select-style", "sherborne-title-style", "shop-product-base-price-style", "shop-product-description-style", "shop-product-discount-style", "shop-product-fake-discount-style", "shop-product-price-style", "shop-product-title-style", "small-text-style", "text-bold-style", "text-style", "unavailable-2-style", "unavailable-style"], "proposed": ["arguments-list-style", "count-badge-style", "filter-chip-style", "icon-button-style", "link-subtle-style", "micro-text-style", "panel-card-style", "progress-fill-style", "progress-track-style", "section-label-style", "selection-card-style"]};
  const CAT = { validated: new Set(CAT_DATA.validated), proposed: new Set(CAT_DATA.proposed) };

  const feedbacks = [];
  let reviewMode = true;
  let showAll = false;
  let selected = null;

  /* ---- primitives DS ------------------------------------------------------ */
  function hasStyle(el) {
    return el.nodeType === 1 && Array.prototype.some.call(el.classList, function (c) { return c.endsWith('-style'); });
  }
  function resolve(el) {                                  // remonte au + proche ancetre -style
    let n = el;
    while (n && n.nodeType === 1) {
      if (n.closest('#bdr-root')) return el;
      if (hasStyle(n)) return n;
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
      .bdr-icon{cursor:pointer;background:none;border:none;color:#cbd5e1;font-size:16px;line-height:1;padding:2px 4px;}
      .bdr-hover{color:#94a3b8;min-height:18px;font-size:11px;word-break:break-word;}
      .bdr-hover .up{color:#fbbf24;}
      .bdr-empty{color:#64748b;font-style:italic;padding:6px 0;}
      .bdr-selhd{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;}
      .bdr-state{font-weight:700;padding:2px 8px;border-radius:6px;}
      .bdr-state.candidat{background:#2563eb33;color:#93c5fd;} .bdr-state.ds{background:#16a34a33;color:#86efac;}
      .bdr-state.override{background:#dc262633;color:#fca5a5;} .bdr-state.plain{background:#47556933;color:#cbd5e1;}
      .bdr-x{cursor:pointer;color:#94a3b8;font-size:16px;line-height:1;}
      .bdr-chips{display:flex;flex-wrap:wrap;gap:3px;margin-bottom:8px;}
      .bdr-chip{display:inline-block;padding:1px 6px;border-radius:5px;font-weight:600;font-family:ui-monospace,monospace;font-size:11px;}
      .bdr-anchor{color:#94a3b8;font-size:11px;word-break:break-word;}
      .bdr-verbs{display:flex;flex-wrap:wrap;gap:6px;padding:11px 14px;}
      .bdr-v{cursor:pointer;border:1px solid #475569;background:#334155;color:#fff;border-radius:8px;padding:7px 10px;font-size:12px;font-weight:600;}
      .bdr-v:hover{background:#475569;} .bdr-v.promote{border-color:#3b82f6;color:#93c5fd;}
      .bdr-dyn{flex:1;overflow:auto;padding:0 14px;}
      #bdr-search{width:100%;padding:7px 9px;border:1px solid #475569;border-radius:7px;margin:6px 0;font-size:12px;background:#0f172a;color:#e2e8f0;}
      .bdr-opt{cursor:pointer;padding:5px 8px;border-radius:6px;font-family:ui-monospace,monospace;font-size:11px;color:#cbd5e1;}
      .bdr-opt:hover{background:#2563eb;color:#fff;}
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
  const pauseBtn = h('button', { class: 'bdr-btn pause', title: 'Suspendre la revue (Alt+R)', text: '⏸ Suspendre', onclick: toggle });
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
    h('div', { class: 'sec' }, allBtn),
    selCard, verbsBox, dynBox,
    h('div', { class: 'bdr-ft' }, countBadge, exportBtn)
  );
  const reopen = h('div', { id: 'bdr-reopen', title: 'Rouvrir le panneau', text: '◀ Panneau', onclick: expand });

  /* ---- selection + rendu -------------------------------------------------- */
  function select(el) {
    if (selected) selected.removeAttribute('data-bdr-sel');
    selected = el; el.setAttribute('data-bdr-sel', '');
    renderSelected(); expand();
  }
  function deselect() { if (selected) selected.removeAttribute('data-bdr-sel'); selected = null; renderSelected(); }

  function renderSelected() {
    verbsBox.innerHTML = '';
    if (!selected) { selCard.innerHTML = ''; selCard.appendChild(h('div', { class: 'bdr-empty', text: 'Clique un element a annoter.' })); dynBox.innerHTML = ''; return; }
    const c = classify(selected), d = describe(selected);
    selCard.innerHTML = '';
    const stLabel = { candidat: '✨ candidat', ds: '✅ valide', override: '⛔ inline', plain: 'DS neutre' }[c.state];
    selCard.appendChild(h('div', { class: 'bdr-selhd' },
      h('span', { class: 'bdr-state ' + c.state, text: stLabel }),
      h('span', { class: 'bdr-x', text: '×', title: 'Deselectionner', onclick: deselect })));
    const chips = h('div', { class: 'bdr-chips' });
    c.ds.forEach(function (n) { chips.appendChild(chip(n, '#16a34a')); });
    c.candidat.forEach(function (n) { chips.appendChild(chip(n, '#2563eb')); });
    if (c.override.length) chips.appendChild(chip('inline-style', '#dc2626'));
    if (c.state === 'plain') chips.appendChild(chip('— DS neutre —', '#94a3b8'));
    selCard.appendChild(chips);
    selCard.appendChild(h('div', { class: 'bdr-anchor', text: '<' + d.tag + '>  ' + d.text_anchor }));

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
    kept.push(cls); selected.setAttribute('class', kept.join(' '));
  }
  function restorePreview() { if (selected && previewOrig !== null) selected.setAttribute('class', previewOrig); previewOrig = null; }

  function showSwap() {
    if (!selected) return;
    dynBox.innerHTML = '';
    const search = h('input', { id: 'bdr-search', placeholder: 'Chercher une classe DS validee...' });
    const list = h('div', {});
    const all = Array.from(CAT.validated).sort();
    function fill(q) {
      list.innerHTML = '';
      all.filter(function (n) { return n.indexOf(q) !== -1; }).slice(0, 250).forEach(function (n) {
        const opt = h('div', { class: 'bdr-opt', text: n });
        opt.addEventListener('mouseenter', function () { swapPreview(n); });
        opt.addEventListener('mouseleave', function () { restorePreview(); });
        opt.addEventListener('click', function () { previewOrig = null; record(selected, 'swap', { proposition: n }); });
        list.appendChild(opt);
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
  function setHover(el) { if (hovered && hovered !== el) hovered.removeAttribute('data-bdr-hover'); hovered = el; if (el) el.setAttribute('data-bdr-hover', ''); }
  function clearHover() { if (hovered) hovered.removeAttribute('data-bdr-hover'); hovered = null; hoverLine.innerHTML = 'Survole un element...'; }
  function showHoverInfo(target, leaf) {
    const c = classify(target);
    const names = c.ds.concat(c.candidat);
    const up = (target !== leaf) ? '<span class="up">↑ parent &lt;' + target.tagName.toLowerCase() + '&gt;</span> ' : '';
    hoverLine.innerHTML = up + '&lt;' + target.tagName.toLowerCase() + '&gt; '
      + (names.length ? names.join(', ') : (c.override.length ? 'inline-style' : '— DS neutre —'));
  }

  /* ---- listeners ---------------------------------------------------------- */
  document.addEventListener('mouseover', function (e) {
    if (!reviewMode || e.target.closest('#bdr-root')) { clearHover(); return; }
    const target = resolve(e.target);
    setHover(target); showHoverInfo(target, e.target);
  }, true);
  document.addEventListener('click', function (e) {
    if (!reviewMode) return;
    if (e.target.closest('#bdr-root')) return;
    e.preventDefault(); e.stopPropagation();
    select(resolve(e.target));
  }, true);
  addEventListener('resize', function () { renderRes(); if (reviewMode) paint(); });
  addEventListener('keydown', function (e) { if (e.altKey && (e.key === 'r' || e.key === 'R')) { e.preventDefault(); toggle(); } });

  /* ---- boot --------------------------------------------------------------- */
  root.appendChild(style); root.appendChild(panel); root.appendChild(reopen); root.appendChild(toastEl);
  document.body.appendChild(root);
  renderRes(); renderTray(); renderSelected(); paint();

  window.__bdr = { toggle: toggle, feedbacks: feedbacks, export: exportJSON };
  console.log('[BDR] pret —', CAT.validated.size, 'validees,', CAT.proposed.size, 'proposees. Clic = selectionner, panneau droit = agir, Alt+R = suspendre.');
})();
