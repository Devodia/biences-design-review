// ==UserScript==
// @name         Biences Design Review
// @namespace    devodia.biences
// @version      0.18.0
// @description  Revue visuelle du design system Biences : remplacer / creer un style (builder famille-tailles-mods) / multi-selection / avant-apres. Rapport JSON pour Claude Code.
// @match        https://*.dev.odoo.com/*
// @match        https://*.biences.ch/*
// @downloadURL  https://raw.githubusercontent.com/Devodia/biences-design-review/main/biences-design-review.user.js
// @updateURL    https://raw.githubusercontent.com/Devodia/biences-design-review/main/biences-design-review.user.js
// @grant        none
// @run-at       document-idle
// ==/UserScript==


/* Genere par gen_ds_catalog.py — SoT = ds/*.scss (css-refactor). Ne pas editer a la main. */
window.BDR_CATALOG = {
  "_note": "Genere par gen_ds_catalog.py — SoT = ds/*.scss (css-refactor). Ne pas editer a la main.",
  "nomenclature": "{famille}-{max}-{min}[-mods]  (1rem=10px)",
  "families": [
    {
      "key": "title",
      "font": "--font-title",
      "label": "Titre",
      "curve": "cta"
    },
    {
      "key": "title-it",
      "font": "--font-title-italic",
      "label": "Titre italique",
      "curve": "cta"
    },
    {
      "key": "body",
      "font": "--font-text",
      "label": "Texte",
      "curve": "text"
    },
    {
      "key": "body-med",
      "font": "--font-text-medium",
      "label": "Texte medium",
      "curve": "text"
    },
    {
      "key": "body-bold",
      "font": "--font-text-bold",
      "label": "Texte gras",
      "curve": "text"
    }
  ],
  "mods": [
    {
      "key": "caps",
      "label": "Capitales",
      "kind": "caps"
    },
    {
      "key": "muted",
      "label": "Atténué",
      "kind": "muted"
    },
    {
      "key": "ondark",
      "label": "Sur fond foncé",
      "kind": "ondark"
    },
    {
      "key": "wide",
      "label": "Interlettrage large",
      "kind": "wide"
    },
    {
      "key": "accent",
      "label": "Couleur accent",
      "kind": "accent"
    }
  ],
  "mod_order": [
    "caps",
    "muted",
    "ondark",
    "accent",
    "wide"
  ],
  "breakpoints": [
    361,
    510,
    768,
    1024,
    1366,
    1600,
    1920
  ],
  "canon": [
    "body-12-9-caps-muted-wide",
    "body-12-9-caps-wide",
    "body-12-9-muted",
    "body-13-10-caps-accent-wide",
    "body-13-10-caps-wide",
    "body-13-10-wide",
    "body-14-11",
    "body-14-11-ondark",
    "body-14-12",
    "body-14-12-caps",
    "body-14-12-muted",
    "body-15-12",
    "body-16-12",
    "body-16-12-caps-wide",
    "body-17-14",
    "body-17-14-caps-wide",
    "body-17-15",
    "body-18-12-caps-wide",
    "body-24-17-caps",
    "body-bold-13-10-caps-wide",
    "body-bold-14-11-caps-wide",
    "body-bold-15-12-caps-ondark-wide",
    "body-bold-16-12-caps-wide",
    "body-bold-16-14",
    "body-bold-16-14-caps-wide",
    "body-bold-18-14",
    "body-bold-18-14-caps-wide",
    "body-bold-9-ondark",
    "body-med-10-caps-ondark-wide",
    "body-med-12-9-caps-wide",
    "body-med-16-12-caps-wide",
    "body-med-16-14-caps-wide",
    "body-med-24-14-caps-wide",
    "title-30-24",
    "title-40-35",
    "title-54-31",
    "title-54-35",
    "title-78-42",
    "title-it-35-26",
    "title-it-40-33",
    "title-it-54-35"
  ],
  "roles": {
    "product-name": "body-14-12-caps",
    "price-discount": "body-14-11",
    "price-base": "body-12-9-caps-wide",
    "price-strike": "body-14-11-ondark",
    "eyebrow": "body-18-12-caps-wide",
    "eyebrow-sm": "body-bold-13-10-caps-wide",
    "link-accent": "body-13-10-caps-accent-wide"
  },
  "components": {
    "Boutons (CTA)": [
      "cta-primary",
      "cta-secondary",
      "cta-accent",
      "cta-outline",
      "cta-plain"
    ],
    "Panier": [
      "add-to-cart-link",
      "add-to-cart-pill"
    ],
    "Prix (chrome)": [
      "price-fake-discount",
      "price-discount-pill"
    ],
    "Disponibilite": [
      "unavailable-cta",
      "unavailable-cta-compact"
    ],
    "Menu / navigation": [
      "menu-link",
      "menu-link-top",
      "menu-link-bottom",
      "menu-link-hover",
      "menu-link-static",
      "menu-link-sub",
      "menu-link-mobile",
      "menu-link-lang",
      "menu-search-input"
    ],
    "Footer": [
      "footer-link"
    ],
    "Titres speciaux": [
      "title-78-42-banner"
    ]
  },
  "utils": [
    "u-accent",
    "u-accent-hover",
    "u-accent-hover-soft",
    "u-caps",
    "u-caps-none",
    "u-strike"
  ],
  "aliases": {
    "add-to-cart-11-style": "add-to-cart-link",
    "add-to-cart-12-style": "add-to-cart-pill",
    "add-to-cart-style": "add-to-cart-link",
    "cta-1-style": "cta-primary",
    "cta-2-style": "cta-outline",
    "cta-3-style": "cta-secondary",
    "cta-4-style": "cta-plain",
    "cta-important-style": "cta-accent",
    "cta-negative-style": "cta-primary",
    "default-style": "body-17-14",
    "fidelity-offer-title-style": "body-med-16-12-caps-wide",
    "font1-bold-title-style": "body-bold-16-14-caps-wide",
    "font1-medium-slogan-style": "body-med-24-14-caps-wide",
    "font1-medium-title-style": "body-med-16-14-caps-wide",
    "font2-big-title-style": "title-78-42",
    "font2-cta-slogan-style": "title-54-31",
    "font2-slideshow-slogan-style": "title-78-42-banner",
    "font2-small-italic-title-style": "title-it-40-33",
    "font2-small-smaller-title-style": "title-30-24",
    "font2-small-title-style": "title-40-35",
    "font2-text-italic-style": "title-it-35-26",
    "font2-title-italic-style": "title-it-54-35",
    "font2-title-style": "title-54-35",
    "footer-address-style": "body-13-10-wide",
    "footer-copyright-style": "body-bold-15-12-caps-ondark-wide",
    "footer-link-hover-style": "footer-link",
    "footer-links-title-style": "body-bold-13-10-caps-wide",
    "form-label-checkbox-style": "body-bold-16-14",
    "form-label-style": "body-bold-16-14",
    "heavy-subtitle-uppercase-style": "body-bold-18-14",
    "hover-main-color": "u-accent-hover",
    "lato-medium-slogan-style": "body-med-24-14-caps-wide",
    "lato-mediun-title-style": "body-med-16-14-caps-wide",
    "light-subtitle-style": "body-14-12-muted",
    "main-color": "u-accent",
    "mc-hover": "u-accent-hover-soft",
    "menu-bottom-link-style": "menu-link-bottom",
    "menu-cart-qty-style": "body-bold-9-ondark",
    "menu-link-hover-style": "menu-link-hover",
    "menu-link-mc-style": "menu-link-static",
    "menu-link-style": "menu-link",
    "menu-post-title-style": "body-18-12-caps-wide",
    "menu-promo-bar-style": "body-med-10-caps-ondark-wide",
    "menu-responsive-lang-link-style": "menu-link-lang",
    "menu-responsive-link-style": "menu-link-mobile",
    "menu-responsive-search-placeholder-style": "body-17-14-caps-wide",
    "menu-responsive-search-style": "menu-search-input",
    "menu-sub-link-style": "menu-link-sub",
    "menu-top-link-style": "menu-link-top",
    "ppp-style": "body-16-12-caps-wide",
    "price-base-strike": "price-base u-strike",
    "product-inci-style": "u-caps",
    "product-instead-style": "body-16-12",
    "product-name-style": "body-14-12-caps",
    "product-score-style": "body-14-12",
    "product-step-mc-style": "body-bold-18-14-caps-wide",
    "product-step-style": "body-bold-16-12-caps-wide",
    "promoted-product-name-style": "body-24-17-caps",
    "select-style": "body-14-11",
    "sherborne-cta-slogan-style": "title-54-31",
    "sherborne-slideshow-slogan-style": "title-78-42-banner",
    "sherborne-title-style": "title-54-35",
    "shop-product-base-price-style": "price-base u-strike",
    "shop-product-description-style": "body-15-12",
    "shop-product-discount-style": "price-discount-pill",
    "shop-product-fake-discount-style": "price-fake-discount",
    "shop-product-price-style": "body-16-12-caps-wide",
    "shop-product-title-style": "body-bold-16-12-caps-wide",
    "small-text-style": "body-12-9-muted",
    "text-bold-style": "body-bold-18-14",
    "text-none": "u-caps-none",
    "text-style": "body-17-14",
    "text-uppercase": "u-caps",
    "unavailable-2-style": "unavailable-cta-compact",
    "unavailable-style": "unavailable-cta"
  }
};

/* ==========================================================================
 * BDR — moteur de nomenclature DS (pur, sans DOM)
 * Decompose / construit les noms {famille}-{max}-{min}[-mods], calcule la
 * taille fidele aux mixins font-size-* (4 courbes x 8 paliers min-width),
 * synthetise le CSS d'un nouveau style, resout alias->canonique, indexe les
 * combinaisons existantes. Teste sous node ; makeEngine() est ensuite inline
 * dans le userscript avec le catalogue embarque.
 * ========================================================================== */
(function (root) {
  'use strict';

  // Coefficients des mixins _fonts_mixins.scss. Pour chaque palier i :
  //   font-size = max/divFS[i] - step*kFS[i]     (rem, 1rem=10px)
  //   line-height = (max/divLH[i] - step*kLH[i]) * mLH[i]
  // step = (max - min) / 6 ; paliers = min-width MQ.
  var MQ = [0, 361, 510, 768, 1024, 1366, 1600, 1920];
  var K = [6, 6, 5, 4, 3, 2, 1, 0];
  var CURVES = {
    text: {
      divFS: [1.15, 1, 1, 1, 1, 1, 1, 1], kFS: K,
      divLH: [1, 1, 1, 1, 1, 1, 1, 1], kLH: K,
      mLH: [1.2, 1.21, 1.22, 1.24, 1.26, 1.28, 1.3, 1.32]
    },
    cta: {
      divFS: [1.225, 1.1, 1.1, 1.1, 1, 1, 1, 1], kFS: K,
      divLH: [1.2, 1.03, 1.05, 1.07, 1, 1, 1, 1], kLH: K,
      mLH: [1, 1, 1.01, 1.02, 1.04, 1.06, 1.08, 1.1]
    },
    title: {
      divFS: [1.3, 1.25, 1.3, 1.225, 1, 1, 1, 1], kFS: K,
      divLH: [1.15, 1.125, 1.15, 1.15, 1, 1, 1, 1], kLH: K,
      mLH: [1, 1, 1.01, 1.02, 1.04, 1.06, 1.08, 1.1]
    },
    banner: {
      divFS: [1.238, 1.025, 1.15, 1.225, 1, 1, 1, 1], kFS: K,
      divLH: [1.15, 1.025, 1.15, 1.225, 1, 1, 1, 1], kLH: K,
      mLH: [1, 1, 1.01, 1.02, 1.04, 1.06, 1.08, 1.1]
    }
  };

  function r4(x) { return Math.round(x * 10000) / 10000; }

  function makeEngine(CAT) {
    var famByKey = {};
    CAT.families.forEach(function (f) { famByKey[f.key] = f; });
    var famKeys = CAT.families.map(function (f) { return f.key; })
      .sort(function (a, b) { return b.length - a.length; });   // plus long d'abord
    var modKeys = {};
    CAT.mods.forEach(function (m) { modKeys[m.key] = true; });
    var modOrder = CAT.mod_order;

    var canonSet = {}; CAT.canon.forEach(function (n) { canonSet[n] = true; });
    var utilSet = {}; CAT.utils.forEach(function (n) { utilSet[n] = true; });
    var compSet = {};
    Object.keys(CAT.components).forEach(function (g) {
      CAT.components[g].forEach(function (n) { compSet[n] = true; });
    });
    var roleMap = CAT.roles || {};
    var aliasMap = CAT.aliases || {};

    // ── decomposition / construction ────────────────────────────────────────
    function parseName(name) {
      for (var i = 0; i < famKeys.length; i++) {
        var fam = famKeys[i];
        if (name === fam || name.indexOf(fam + '-') === 0) {
          var rest = name.slice(fam.length).replace(/^-+/, '');
          var toks = rest ? rest.split('-') : [];
          var nums = [], j = 0;
          while (j < toks.length && /^\d+$/.test(toks[j])) { nums.push(+toks[j]); j++; }
          if (!nums.length) continue;
          var mods = toks.slice(j);
          for (var k = 0; k < mods.length; k++) if (!modKeys[mods[k]]) return null;
          return { family: fam, max: nums[0], min: nums.length > 1 ? nums[1] : nums[0], mods: mods };
        }
      }
      return null;
    }
    function sortMods(mods) {
      return modOrder.filter(function (m) { return mods.indexOf(m) !== -1; });
    }
    function buildName(fam, max, min, mods) {
      var size = (min == null || +min === +max) ? ('' + max) : (max + '-' + min);
      var ms = sortMods(mods || []);
      return fam + '-' + size + (ms.length ? '-' + ms.join('-') : '');
    }

    // ── taille fidele au mixin ────────────────────────────────────────────────
    function sizeLevels(curve, max, min) {
      var c = CURVES[curve] || CURVES.text, step = (max - min) / 6, out = [];
      for (var i = 0; i < 8; i++) {
        out.push({
          mq: MQ[i],
          fs: r4(max / c.divFS[i] - step * c.kFS[i]),
          lh: r4((max / c.divLH[i] - step * c.kLH[i]) * c.mLH[i])
        });
      }
      return out;
    }
    function levelIndexFor(vw) {
      var idx = 0;
      for (var i = 0; i < MQ.length; i++) if (vw >= MQ[i]) idx = i;
      return idx;
    }
    function sizeAt(curve, max, min, vw) {
      return sizeLevels(curve, max, min)[levelIndexFor(vw)].fs;
    }

    // ── resolution nom -> categorie / canonique ──────────────────────────────
    function resolve(name) {
      if (canonSet[name]) return { name: name, category: 'canon', canonical: name };
      if (roleMap[name]) return { name: name, category: 'role', canonical: roleMap[name] };
      if (compSet[name]) return { name: name, category: 'component', canonical: name };
      if (utilSet[name]) return { name: name, category: 'util', canonical: name };
      if (aliasMap[name]) return { name: name, category: 'alias', canonical: aliasMap[name] };
      if (parseName(name)) return { name: name, category: 'buildable', canonical: name };
      return { name: name, category: 'unknown', canonical: null };
    }
    function isDS(name) { return resolve(name).category !== 'unknown'; }

    // ── index des combinaisons existantes (canoniques) ───────────────────────
    var parsedCanon = CAT.canon.map(function (n) {
      var p = parseName(n); p.name = n; return p;
    });
    function forFamily(fam) {
      return parsedCanon.filter(function (p) { return p.family === fam; });
    }
    function maxesForFamily(fam) {
      var s = {}; forFamily(fam).forEach(function (p) { s[p.max] = true; });
      return Object.keys(s).map(Number).sort(function (a, b) { return a - b; });
    }
    function minsForFamilyMax(fam, max) {
      var s = {};
      forFamily(fam).forEach(function (p) { if (p.max === +max) s[p.min] = true; });
      return Object.keys(s).map(Number).sort(function (a, b) { return a - b; });
    }
    function modSetsFor(fam, max, min) {
      return forFamily(fam)
        .filter(function (p) { return p.max === +max && p.min === +min; })
        .map(function (p) { return p.mods; });
    }
    // le nom construit existe-t-il deja (canonique, role, composant, util) ?
    function existsExact(name) {
      var c = resolve(name).category;
      return c === 'canon' || c === 'role' || c === 'component' || c === 'util';
    }
    // un role/canonique porte-t-il exactement cette combinaison ? -> son nom
    function nameForCombo(fam, max, min, mods) {
      return buildName(fam, max, min, mods);
    }

    // ── synthese CSS d'un style (nouveau) ─────────────────────────────────────
    // colors : { text, muted, accent } resolus a runtime (probes). ondark=#fff.
    function synthCSS(selector, parsed, colors) {
      var fam = famByKey[parsed.family];
      var curve = fam ? fam.curve : 'text';
      var levels = sizeLevels(curve, parsed.max, parsed.min);
      var mods = parsed.mods || [];
      var col = colors && colors.text || '#1c1c1c';
      if (mods.indexOf('ondark') !== -1) col = '#ffffff';
      else if (mods.indexOf('muted') !== -1) col = (colors && colors.muted) || col;
      else if (mods.indexOf('accent') !== -1) col = (colors && colors.accent) || col;
      var decl = 'font-family:var(' + (fam ? fam.font : '--font-text') + ');';
      decl += 'color:' + col + ';';
      decl += 'text-transform:' + (mods.indexOf('caps') !== -1 ? 'uppercase' : 'none') + ';';
      if (mods.indexOf('wide') !== -1) decl += 'letter-spacing:0.2em;';
      decl += 'font-size:' + levels[0].fs + 'rem;line-height:' + levels[0].lh + 'rem;';
      var css = '.' + selector + '{' + decl + '}';
      for (var i = 1; i < 8; i++) {
        css += '@media(min-width:' + MQ[i] + 'px){.' + selector +
          '{font-size:' + levels[i].fs + 'rem;line-height:' + levels[i].lh + 'rem;}}';
      }
      return css;
    }

    return {
      CAT: CAT, famByKey: famByKey,
      parseName: parseName, buildName: buildName, sortMods: sortMods,
      sizeLevels: sizeLevels, sizeAt: sizeAt, levelIndexFor: levelIndexFor,
      resolve: resolve, isDS: isDS,
      maxesForFamily: maxesForFamily, minsForFamilyMax: minsForFamilyMax,
      modSetsFor: modSetsFor, existsExact: existsExact, nameForCombo: nameForCombo,
      synthCSS: synthCSS
    };
  }

  root.BDR_makeEngine = makeEngine;
  if (typeof module !== 'undefined' && module.exports) module.exports = { makeEngine: makeEngine };
})(typeof window !== 'undefined' ? window : globalThis);


/* ==========================================================================
 * Biences Design Review — UI (v0.18)
 * --------------------------------------------------------------------------
 * Parcours Eliott : VISITER une page -> la REVIEWER visuellement -> RAPPORT
 * (JSON consomme par Claude Code). Rapport persiste cross-page (localStorage)
 * et s'accumule sur tout le site ; export unique a la fin.
 *
 * La migration ancien->nouveau nom est INVISIBLE pour Eliott (boulot Claude) :
 * toute classe DS est resolue vers son nom canonique et presentee comme telle.
 * ========================================================================== */
(async function () {
  'use strict';

  if (window.__bdr) { window.__bdr.toggle(); return; }   // re-injection = toggle

  var CAT = window.BDR_CATALOG;
  var E = window.BDR_makeEngine(CAT);
  var Z = 2147483000;
  var STORE = 'bdr_report_v1';     // rapport accumule cross-page
  var INTENT = 'bdr_intent';       // "revue en cours" -> reprise auto page suivante

  /* ---- state -------------------------------------------------------------- */
  var feedbacks = [];
  var createdStyles = {};          // name -> css synthetise (commite, va au rapport)
  var reviewMode = false;
  var selected = null;
  var selPath = null;
  var lastStack = [];
  var TOKENS = {};
  var colors = { text: '#1c1c1c', muted: '#8a8a8a', accent: '#e87722' };
  var multiGroup = null;
  var showAfter = false;
  var pageLocked = false;
  var newStyleSheet = null;
  var injectedCSS = {};
  var dynCleanup = null;
  var view = 'review';             // 'review' | 'report'

  // registre avant/apres (par page, refs DOM vivantes)
  var touchedEls = [];
  var beforeOf = new Map();
  var afterOf = new Map();

  /* ---- persistance -------------------------------------------------------- */
  function saveReport() {
    try { localStorage.setItem(STORE, JSON.stringify({ feedbacks: feedbacks, created: createdStyles })); } catch (e) {}
  }
  function loadReport() {
    try {
      var d = JSON.parse(localStorage.getItem(STORE) || 'null');
      if (d) { if (d.feedbacks) feedbacks = d.feedbacks; if (d.created) createdStyles = d.created; }
    } catch (e) {}
  }
  function clearReport() {
    feedbacks = []; createdStyles = {};
    try { localStorage.removeItem(STORE); } catch (e) {}
    if (window.__bdr) window.__bdr.feedbacks = feedbacks;
    renderTray();
  }

  /* ---- helpers DOM -------------------------------------------------------- */
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
  var classAttr = function (el) { return el.getAttribute('class') || ''; };
  var breakpoint = function () { return innerWidth < 768 ? 'mobile' : innerWidth < 1024 ? 'tablet' : 'desktop'; };
  function chip(name, col) { return h('span', { class: 'bdr-chip', style: 'background:' + col + '22;color:' + col, text: name }); }
  function inField() { var a = document.activeElement; return a && (a.tagName === 'INPUT' || a.tagName === 'TEXTAREA' || a.isContentEditable); }

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
  // Plus de notion "a migrer" : tout style resolu = ds. (Alias resolu au canonique.)
  function classify(el) {
    var ds = dsClassesOf(el);
    var override = el.getAttribute && el.getAttribute('style') ? ['inline-style'] : [];
    var state = 'plain';
    if (ds.length) state = 'ds';
    else if (override.length) state = 'override';
    return { state: state, ds: ds, override: override };
  }
  // nom affiche pour une classe DS = son canonique (monde "nouvelle nomenclature")
  function canonOf(r) { return r.canonical || r.name; }

  /* ---- ressource (image / icone / fond) ---------------------------------- */
  function resourceOf(el) {
    if (!el || el.nodeType !== 1) return null;
    if (el.tagName === 'IMG' && el.getAttribute('src')) return el.getAttribute('src');
    var use = el.tagName.toLowerCase() === 'svg' ? el.querySelector('use') : (el.tagName.toLowerCase() === 'use' ? el : null);
    if (use) { var href = use.getAttribute('href') || use.getAttribute('xlink:href'); if (href) return href; }
    try {
      var bg = getComputedStyle(el).backgroundImage;
      var m = bg && bg.match(/url\(["']?([^"')]+)["']?\)/);
      if (m) return m[1];
    } catch (e) {}
    var img = el.querySelector && el.querySelector('img[src], use[href], use[xlink\\:href]');
    if (img) return img.getAttribute('src') || img.getAttribute('href') || img.getAttribute('xlink:href');
    return null;
  }

  /* ---- ancrage / description --------------------------------------------- */
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
      tag: el.tagName.toLowerCase(), resource: resourceOf(el),
      rect: { x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height) }
    };
  }

  /* ---- couleurs / tokens (robuste prod + staging) ------------------------ */
  function rawToRgb(raw, probe) {
    probe.style.color = ''; probe.style.color = raw;
    if (!probe.style.color) return null;
    var rgb = getComputedStyle(probe).color;
    return (rgb && rgb !== 'rgba(0, 0, 0, 0)') ? rgb : null;
  }
  function resolveColors() {
    var probe = h('span', { style: 'position:absolute;opacity:0;pointer-events:none;left:-9999px;' });
    document.body.appendChild(probe);
    colors.text = getComputedStyle(document.body).color || '#1c1c1c';
    function viaToken(names) {
      for (var i = 0; i < names.length; i++) {
        var raw = getComputedStyle(document.documentElement).getPropertyValue(names[i]).trim();
        if (raw) { var rgb = rawToRgb(raw, probe); if (rgb) return rgb; }
      }
      return null;
    }
    function viaClass(classes) {   // accepte seulement si distinct du texte (=> la classe existe)
      for (var i = 0; i < classes.length; i++) {
        probe.className = classes[i];
        var col = getComputedStyle(probe).color;
        probe.className = '';
        if (col && col !== 'rgba(0, 0, 0, 0)' && col !== colors.text) return col;
      }
      return null;
    }
    colors.accent = viaToken(['--primary-color', '--main-color', '--color-primary', '--accent-color'])
      || viaClass(['u-accent', 'main-color', 'text-primary']) || '#e87722';
    colors.muted = viaToken(['--light-color', '--text-light', '--color-light', '--muted-color'])
      || viaClass(['body-14-12-muted', 'light-subtitle-style', 'small-text-style']) || '#8a8a8a';
    probe.remove();
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
    var tc = cs.color.trim();
    if (tc && tc !== 'rgba(0, 0, 0, 0)') rows.push(['texte', tc, TOKENS[tc] || null]);
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
    el.setAttribute('class', afterClass);
    showAfter = true;
  }
  function applyBA(after) {
    showAfter = after;
    touchedEls.forEach(function (el) {
      el.setAttribute('class', after ? afterOf.get(el) : beforeOf.get(el));
      if (el === selected) { markSelected(el); boxAt(selBox, el); }
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
      css_path: d.css_path, rect: d.rect, resource: d.resource,
      classes: { ds: c.ds.map(canonOf), dom: d.classes_all, override: c.override }
    }, extra || {}));
    el.setAttribute('data-bdr-v', verdict);
    saveReport(); renderTray(); renderSelected();
  }

  /* ---- peinture ----------------------------------------------------------- */
  function paint() {
    document.querySelectorAll('[class]').forEach(function (el) {
      if (el.closest && el.closest('#bdr-root')) return;
      if (el === selected) return;
      if (classify(el).state === 'ds') el.setAttribute('data-bdr', 'ds');
      else el.removeAttribute('data-bdr');
    });
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
  // masque le pointille propre de l'element selectionne -> une seule bordure (verte)
  var lastSelMarked = null;
  function markSelected(el) {
    if (lastSelMarked && lastSelMarked !== el) lastSelMarked.removeAttribute('data-bdr-sel');
    if (el) { el.removeAttribute('data-bdr'); el.setAttribute('data-bdr-sel', ''); lastSelMarked = el; }
  }
  function unmarkSelected() {
    if (lastSelMarked) { lastSelMarked.removeAttribute('data-bdr-sel'); if (reviewMode && classify(lastSelMarked).state === 'ds') lastSelMarked.setAttribute('data-bdr', 'ds'); lastSelMarked = null; }
  }

  /* ---- groupes du selecteur de styles (tries par pertinence) ------------- */
  var SWAP_GROUPS = (function () {
    var groups = [];
    CAT.families.forEach(function (f) {
      var items = CAT.canon.filter(function (n) { var p = E.parseName(n); return p && p.family === f.key; })
        .map(function (n) { return { name: n, fam: f.key }; });
      if (items.length) groups.push({ title: f.label, fam: f.key, items: items });
    });
    var roles = Object.keys(CAT.roles).map(function (n) { return { name: n }; });
    if (roles.length) groups.push({ title: 'Rôles', items: roles });
    Object.keys(CAT.components).forEach(function (g) {
      groups.push({ title: g, items: CAT.components[g].map(function (n) { return { name: n }; }) });
    });
    groups.push({ title: 'Utilitaires', items: CAT.utils.map(function (n) { return { name: n }; }) });
    return groups;
  })();
  function groupsFor(fam) {   // met la famille courante en premier
    if (!fam) return SWAP_GROUPS;
    var head = [], tail = [];
    SWAP_GROUPS.forEach(function (g) { (g.fam === fam ? head : tail).push(g); });
    return head.concat(tail);
  }
  // style typographique courant de l'element (pour pre-remplir le builder / trier)
  function currentTypo(el) {
    var dsc = dsClassesOf(el);
    for (var i = 0; i < dsc.length; i++) { var p = E.parseName(canonOf(dsc[i])); if (p) return p; }
    return null;
  }

  /* ======================================================================= *
   *  UI ROOT + STYLES
   * ======================================================================= */
  var root = h('div', { id: 'bdr-root' });
  var style = h('style', {
    text: `
      #bdr-root{position:fixed;inset:0;z-index:${Z};pointer-events:none;font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;}
      #bdr-root *{box-sizing:border-box;}
      [data-bdr="ds"]{outline:1px dashed rgba(120,140,170,.35) !important;outline-offset:1px !important;}
      [data-bdr-sel]{outline:none !important;}
      [data-bdr-v]{outline:2px solid rgba(45,212,191,.55) !important;outline-offset:2px !important;}
      #bdr-hovbox,#bdr-selbox{position:fixed;pointer-events:none;display:none;border-radius:4px;}
      #bdr-hovbox{border:2px dashed #fbbf24;background:rgba(251,191,36,.06);}
      #bdr-selbox{border:2px solid #22c55e;background:rgba(34,197,94,.07);box-shadow:0 0 0 1px rgba(34,197,94,.3),0 0 16px rgba(34,197,94,.28);}
      #bdr-multilayer{position:fixed;inset:0;pointer-events:none;}
      .bdr-mbox{position:fixed;border:2px solid #a855f7;background:rgba(168,85,247,.10);border-radius:4px;}
      #bdr-panel{position:fixed;top:0;right:0;bottom:0;width:360px;z-index:${Z};pointer-events:auto;display:flex;flex-direction:column;background:#0f1620;color:#e6eaf0;font-size:12.5px;line-height:1.45;border-left:1px solid #22303f;box-shadow:-14px 0 44px rgba(0,0,0,.45);transition:transform .22s cubic-bezier(.4,0,.2,1);}
      #bdr-panel.collapsed{transform:translateX(100%);}
      #bdr-reopen{position:fixed;top:50%;right:0;transform:translateY(-50%);z-index:${Z};pointer-events:auto;display:none;background:linear-gradient(135deg,#fb923c,#f97316);color:#fff;padding:15px 8px;border-radius:11px 0 0 11px;cursor:pointer;font-weight:700;font-size:11px;letter-spacing:.02em;writing-mode:vertical-rl;box-shadow:-4px 0 18px rgba(0,0,0,.35);}
      #bdr-reopen:hover{filter:brightness(1.07);}
      .bdr-hd{display:flex;align-items:center;justify-content:space-between;padding:13px 16px;border-bottom:1px solid #1b2634;background:#0b1119;}
      .bdr-brand{display:flex;align-items:center;gap:9px;font-size:13.5px;font-weight:700;white-space:nowrap;}
      .bdr-dot{width:8px;height:8px;border-radius:50%;background:#22c55e;box-shadow:0 0 10px #22c55e;flex:0 0 auto;}
      .bdr-icon{cursor:pointer;background:none;border:none;color:#8896a8;font-size:15px;line-height:1;padding:5px 9px;border-radius:7px;}
      .bdr-icon:hover{background:#1b2634;color:#e6eaf0;}
      #bdr-top{padding:15px 16px;border-bottom:1px solid #1b2634;}
      .bdr-cta{display:block;width:100%;cursor:pointer;border:none;border-radius:11px;padding:13px;font-size:13px;font-weight:700;color:#fff;background:linear-gradient(135deg,#34d399,#22c55e);box-shadow:0 6px 18px rgba(34,197,94,.32);transition:transform .12s,box-shadow .12s;}
      .bdr-cta:hover{transform:translateY(-1px);box-shadow:0 10px 26px rgba(34,197,94,.42);}
      .bdr-steps{display:flex;gap:6px;margin-top:13px;}
      .bdr-stp{flex:1;text-align:center;font-size:10.5px;color:#5b6b7d;border-top:2px solid #22303f;padding-top:7px;}
      .bdr-stp.on{color:#86efac;border-color:#22c55e;}
      .bdr-hint{color:#8896a8;font-size:11.5px;margin-top:11px;line-height:1.55;}
      .bdr-kbd{font-family:ui-monospace,monospace;background:#1b2634;border:1px solid #2a3a4c;border-radius:4px;padding:0 5px;color:#c3ccd8;}
      .bdr-live-row{display:flex;align-items:center;gap:9px;}
      .bdr-livedot{width:8px;height:8px;border-radius:50%;background:#22c55e;box-shadow:0 0 8px #22c55e;animation:bdrpulse 1.6s infinite;flex:0 0 auto;}
      @keyframes bdrpulse{0%,100%{opacity:1;}50%{opacity:.3;}}
      .bdr-live-lbl{font-weight:600;flex:1;}
      .bdr-ghost{cursor:pointer;background:none;border:1px solid #2a3a4c;color:#c3ccd8;border-radius:8px;padding:5px 12px;font-size:11.5px;font-weight:600;}
      .bdr-ghost:hover{background:#1b2634;border-color:#3a4c60;}
      .bdr-meta{display:flex;gap:6px;margin-top:12px;align-items:center;flex-wrap:wrap;}
      .bdr-chip2{background:#16202c;border:1px solid #22303f;border-radius:7px;padding:4px 9px;font-size:11px;color:#8896a8;font-variant-numeric:tabular-nums;}
      .bdr-hover{color:#8896a8;font-size:11px;margin-top:12px;min-height:15px;word-break:break-word;}
      .bdr-hover .up{color:#fbbf24;}
      .bdr-card{margin:12px 14px 0;background:#131c27;border:1px solid #22303f;border-radius:12px;padding:13px;}
      #bdr-panel.acting .bdr-card .bdr-props,#bdr-panel.acting .bdr-card .bdr-stack{display:none;}
      .bdr-empty{margin:30px 18px;text-align:center;color:#5b6b7d;font-size:12px;line-height:1.6;}
      .bdr-empty b{display:block;color:#8896a8;font-size:13px;margin-bottom:5px;font-weight:600;}
      .bdr-selhd{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;}
      .bdr-state{font-weight:700;padding:3px 9px;border-radius:7px;font-size:11px;}
      .bdr-state.ds{background:#22c55e22;color:#86efac;}
      .bdr-state.override{background:#ef444422;color:#fca5a5;} .bdr-state.plain{background:#8896a822;color:#c3ccd8;}
      .bdr-nav{display:flex;gap:3px;align-items:center;}
      .bdr-navbtn{cursor:pointer;color:#8896a8;font-size:15px;line-height:1;font-weight:700;padding:2px 7px;border-radius:6px;}
      .bdr-navbtn:hover{background:#1b2634;color:#e6eaf0;}
      .bdr-x{cursor:pointer;color:#8896a8;font-size:17px;line-height:1;padding:0 5px;} .bdr-x:hover{color:#fca5a5;}
      .bdr-chips{display:flex;flex-wrap:wrap;gap:4px;margin-bottom:9px;}
      .bdr-chip{display:inline-block;padding:2px 7px;border-radius:6px;font-weight:600;font-family:ui-monospace,monospace;font-size:11px;}
      .bdr-anchor{color:#6b7b8d;font-size:11px;word-break:break-word;font-family:ui-monospace,monospace;}
      .bdr-res{display:flex;gap:6px;align-items:baseline;margin-top:7px;font-size:11px;color:#8896a8;}
      .bdr-res .p{color:#5eead4;font-family:ui-monospace,monospace;word-break:break-all;}
      .bdr-props{margin-top:11px;border-top:1px solid #22303f;padding-top:9px;}
      .bdr-props-t,.bdr-stack-t{color:#6b7b8d;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;margin-bottom:5px;}
      .bdr-prop{display:flex;gap:8px;align-items:baseline;font-size:11px;padding:2px 0;flex-wrap:wrap;}
      .bdr-prop .k{color:#6b7b8d;min-width:48px;} .bdr-prop .v{color:#e6eaf0;font-family:ui-monospace,monospace;word-break:break-all;}
      .bdr-prop .tok{color:#2dd4bf;font-family:ui-monospace,monospace;background:#2dd4bf1f;padding:1px 6px;border-radius:5px;}
      .bdr-warn{margin-top:10px;font-size:11px;color:#fcd34d;background:#78350f4d;border:1px solid #9a3412;border-radius:8px;padding:8px 10px;line-height:1.45;}
      .bdr-stack{margin-top:11px;border-top:1px solid #22303f;padding-top:8px;}
      .bdr-stack-scroll{max-height:196px;overflow-y:auto;margin:0 -4px;padding:0 4px;}
      .bdr-stack-row{cursor:pointer;padding:3px 7px;border-radius:6px;font-family:ui-monospace,monospace;font-size:11px;color:#8896a8;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
      .bdr-stack-row:hover{background:#1b2634;color:#e6eaf0;} .bdr-stack-row.on{background:#22c55e26;color:#86efac;}
      .bdr-verbs{display:flex;flex-wrap:wrap;gap:7px;padding:12px 14px 4px;}
      .bdr-v{cursor:pointer;border:1px solid #2a3a4c;background:#182230;color:#e6eaf0;border-radius:9px;padding:8px 12px;font-size:12px;font-weight:600;transition:background .12s;}
      .bdr-v:hover{background:#22303f;}
      .bdr-v.create{border-color:#3b82f6;color:#93c5fd;background:#3b82f614;}
      .bdr-v.multi{border-color:#a855f7;color:#d8b4fe;background:#a855f714;width:100%;text-align:left;}
      .bdr-dyn{flex:1;overflow:auto;padding:0 14px;}
      #bdr-search{width:100%;padding:8px 10px;border:1px solid #2a3a4c;border-radius:8px;margin:8px 0;font-size:12px;background:#0b1119;color:#e6eaf0;}
      #bdr-search:focus{outline:none;border-color:#22c55e;}
      .bdr-opt{cursor:pointer;padding:6px 9px;border-radius:7px;font-family:ui-monospace,monospace;font-size:11px;color:#c3ccd8;}
      .bdr-opt:hover{background:#22c55e;color:#062012;}
      .bdr-optgroup{color:#6b7b8d;font-weight:700;font-size:10px;text-transform:uppercase;letter-spacing:.06em;padding:10px 4px 4px;border-top:1px solid #22303f;margin-top:3px;}
      .bdr-bld{padding:6px 0 12px;}
      .bdr-bld-t{color:#93c5fd;font-weight:700;font-size:12px;margin:8px 0 4px;}
      .bdr-lbl{color:#6b7b8d;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;margin:11px 0 5px;}
      .bdr-fams{display:flex;flex-wrap:wrap;gap:6px;}
      .bdr-fam{cursor:pointer;border:1px solid #2a3a4c;background:#182230;color:#c3ccd8;border-radius:8px;padding:6px 10px;font-size:11.5px;}
      .bdr-fam.on{border-color:#3b82f6;background:#3b82f622;color:#dbeafe;}
      .bdr-sizerow{display:flex;align-items:center;gap:8px;}
      .bdr-num{width:66px;padding:7px 8px;border:1px solid #2a3a4c;border-radius:8px;background:#0b1119;color:#e6eaf0;font-size:13px;font-family:ui-monospace,monospace;}
      .bdr-num:focus{outline:none;border-color:#22c55e;}
      .bdr-sizechips{display:flex;flex-wrap:wrap;gap:4px;margin-top:6px;}
      .bdr-sc{cursor:pointer;font-family:ui-monospace,monospace;font-size:11px;padding:2px 8px;border-radius:6px;border:1px solid #2a3a4c;color:#8896a8;}
      .bdr-sc.exists{border-color:#22c55e66;color:#86efac;background:#22c55e14;}
      .bdr-sc:hover{border-color:#22c55e;color:#86efac;}
      .bdr-mods{display:flex;flex-wrap:wrap;gap:6px;}
      .bdr-mod{cursor:pointer;border:1px solid #2a3a4c;background:#182230;color:#c3ccd8;border-radius:20px;padding:5px 12px;font-size:11.5px;}
      .bdr-mod.on{border-color:#a855f7;background:#a855f722;color:#e9d5ff;}
      .bdr-preview{margin:12px 0;padding:11px 12px;border:1px dashed #2a3a4c;border-radius:10px;background:#0b1119;}
      .bdr-name{font-family:ui-monospace,monospace;font-size:13px;color:#86efac;word-break:break-all;}
      .bdr-status{margin-top:7px;font-size:11px;line-height:1.5;}
      .bdr-status.exists{color:#86efac;} .bdr-status.new{color:#93c5fd;}
      .bdr-role{width:100%;padding:8px 10px;border:1px solid #2a3a4c;border-radius:8px;background:#0b1119;color:#e6eaf0;font-size:12px;margin:8px 0 12px;font-family:inherit;}
      .bdr-role:focus{outline:none;border-color:#3b82f6;}
      #bdr-note{width:100%;height:84px;border:1px solid #2a3a4c;border-radius:8px;padding:8px;font-size:12px;resize:vertical;background:#0b1119;color:#e6eaf0;margin:8px 0;font-family:inherit;}
      #bdr-note:focus{outline:none;border-color:#22c55e;}
      .bdr-btn{cursor:pointer;border:none;border-radius:9px;padding:9px;font-size:12px;font-weight:600;background:#22303f;color:#e6eaf0;width:100%;}
      .bdr-rep{padding:6px 0 14px;}
      .bdr-rep-ba{display:flex;gap:8px;align-items:center;margin:8px 0 12px;}
      .bdr-ba{flex:1;cursor:pointer;text-align:center;border:1px solid #2a3a4c;border-radius:9px;padding:8px;font-size:12px;font-weight:600;color:#c3ccd8;background:#182230;}
      .bdr-ba.on{border-color:#22c55e;background:#22c55e22;color:#86efac;}
      .bdr-rep-pg{color:#6b7b8d;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;padding:10px 2px 3px;border-top:1px solid #1b2634;margin-top:4px;}
      .bdr-rep-row{display:flex;gap:8px;align-items:flex-start;padding:7px 0;font-size:11.5px;}
      .bdr-rep-v{flex:0 0 auto;font-size:14px;}
      .bdr-rep-main{flex:1;min-width:0;}
      .bdr-rep-main .to{color:#86efac;font-family:ui-monospace,monospace;word-break:break-all;}
      .bdr-rep-main .anc{color:#6b7b8d;font-size:10.5px;word-break:break-word;}
      .bdr-rep-del{cursor:pointer;color:#6b7b8d;font-size:14px;} .bdr-rep-del:hover{color:#fca5a5;}
      .bdr-lock{width:100%;margin-top:14px;cursor:pointer;border:1px solid #22c55e55;background:#14532d33;color:#86efac;border-radius:9px;padding:10px;font-size:12px;font-weight:700;}
      .bdr-clear{width:100%;margin-top:8px;cursor:pointer;border:1px solid #3a2530;background:none;color:#8896a8;border-radius:9px;padding:7px;font-size:11px;}
      .bdr-clear:hover{color:#fca5a5;border-color:#7f1d1d;}
      .bdr-ft{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:11px 14px;border-top:1px solid #1b2634;background:#0b1119;}
      .bdr-tab{cursor:pointer;font-size:11.5px;font-weight:600;color:#8896a8;padding:6px 10px;border-radius:8px;}
      .bdr-tab:hover{color:#e6eaf0;} .bdr-tab.on{color:#86efac;background:#22c55e18;}
      .bdr-exp{cursor:pointer;border:none;border-radius:9px;padding:9px 16px;font-size:12px;font-weight:700;color:#062012;background:linear-gradient(135deg,#34d399,#22c55e);box-shadow:0 4px 12px rgba(34,197,94,.3);}
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
  var countBadge = h('span', { class: 'bdr-tab', text: 'Modifications enregistrées · 0', onclick: showReport });
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

  function syncState() {
    topZone.innerHTML = '';
    if (!reviewMode) {
      if (pageLocked) {
        topZone.appendChild(h('button', { class: 'bdr-cta', text: '▶  Reprendre la revue', onclick: function () { pageLocked = false; toggle(); } }));
        topZone.appendChild(h('div', { class: 'bdr-hint', html: 'Page <b>verrouillée</b> — pause de revue. Les liens sont réactivés : <b>va sur une autre page</b>, elle reprendra la revue toute seule. Ou reprends ici.' }));
      } else {
        topZone.appendChild(h('button', { class: 'bdr-cta', text: '▶  Démarrer la revue', onclick: toggle }));
        topZone.appendChild(h('div', { class: 'bdr-steps' },
          h('div', { class: 'bdr-stp on', text: '1 · Visiter' }),
          h('div', { class: 'bdr-stp', text: '2 · Reviewer' }),
          h('div', { class: 'bdr-stp', text: '3 · Rapport' })));
        topZone.appendChild(h('div', { class: 'bdr-hint', html: 'Clique un élément → <b>change son style</b>, <b>crée-en un</b> ou <b>annote</b>. Raccourcis : <span class="bdr-kbd">C</span> changer · <span class="bdr-kbd">S</span> style · <span class="bdr-kbd">N</span> note · <span class="bdr-kbd">↑↓</span> hiérarchie · <span class="bdr-kbd">Échap</span> fermer.' }));
      }
    } else {
      topZone.appendChild(h('div', { class: 'bdr-live-row' },
        h('span', { class: 'bdr-livedot' }),
        h('span', { class: 'bdr-live-lbl', text: 'Revue en cours' }),
        h('button', { class: 'bdr-ghost', title: 'Suspendre (Alt+R)', text: '⏸ Pause', onclick: toggle })));
      topZone.appendChild(h('div', { class: 'bdr-meta' }, resBadge));
      topZone.appendChild(hoverLine);
    }
  }

  /* ---- selection --------------------------------------------------------- */
  function setSel(el) { clearDyn(); selected = el; markSelected(el); boxAt(selBox, el); if (view === 'report') view = 'review'; renderSelected(); }
  function select(el) { selPath = el; clearMulti(); setSel(el); expand(); }
  function deselect() { clearDyn(); unmarkSelected(); selected = null; selPath = null; selBox.style.display = 'none'; clearMulti(); renderSelected(); }
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

  /* ---- multi-selection par classe ---------------------------------------- */
  function clearMulti() { multiGroup = null; paintMulti(); }
  function selectGroup(cls) {
    var els = Array.prototype.slice.call(document.querySelectorAll('.' + CSS.escape(cls)))
      .filter(function (el) { return !(el.closest && el.closest('#bdr-root')); });
    multiGroup = { selector: cls, els: els };
    paintMulti(); renderSelected();
    toast('Ciblé : ' + els.length + ' éléments');
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
    var stLabel = { ds: '✅ style DS', override: '⛔ style inline', plain: '— sans style DS —' }[c.state];
    selCard.appendChild(h('div', { class: 'bdr-selhd' },
      h('span', { class: 'bdr-state ' + c.state, text: stLabel }),
      h('span', { class: 'bdr-nav' },
        h('span', { class: 'bdr-navbtn', title: 'Parent (↑)', text: '↑', onclick: navUp }),
        h('span', { class: 'bdr-navbtn', title: 'Enfant (↓)', text: '↓', onclick: navDown }),
        h('span', { class: 'bdr-x', text: '×', title: 'Désélectionner (Échap)', onclick: deselect }))));

    // chips : nom canonique resolu pour chaque classe DS
    var chips = h('div', { class: 'bdr-chips' });
    c.ds.forEach(function (r) {
      var col = r.category === 'component' ? '#38bdf8' : r.category === 'util' ? '#2dd4bf' : r.category === 'role' ? '#a3e635' : '#16a34a';
      chips.appendChild(chip(canonOf(r), col));
    });
    if (c.override.length) chips.appendChild(chip('inline-style', '#dc2626'));
    if (c.state === 'plain') chips.appendChild(chip('— sans style —', '#94a3b8'));
    selCard.appendChild(chips);
    selCard.appendChild(h('div', { class: 'bdr-anchor', text: '<' + d.tag + '>  ' + d.text_anchor }));
    if (d.resource) selCard.appendChild(h('div', { class: 'bdr-res' }, h('span', { text: '🖼' }), h('span', { class: 'p', text: d.resource })));
    selCard.appendChild(propsBlock(selected));
    if (dsClassInert(selected)) selCard.appendChild(h('div', { class: 'bdr-warn', text: '⚠ Ici, changer le style ne modifiera pas l’affichage : une mise en forme propre à cette page prend le dessus.' }));

    // hierarchie sous le curseur (scrollbox complete jusqu'a <html>)
    if (lastStack.length > 1) {
      var scroll = h('div', { class: 'bdr-stack-scroll' });
      lastStack.forEach(function (el) {
        var cls = classAttr(el).trim().split(/\s+/).filter(Boolean).slice(0, 3).join('.');
        var label = '<' + el.tagName.toLowerCase() + '>' + (cls ? ' .' + cls : '');
        scroll.appendChild(h('div', { class: 'bdr-stack-row' + (el === selected ? ' on' : ''), text: label, title: label, onclick: function () { clearMulti(); setSel(el); } }));
      });
      selCard.appendChild(h('div', { class: 'bdr-stack' }, h('div', { class: 'bdr-stack-t', text: 'Hiérarchie (clique pour remonter)' }), scroll));
    }

    // multi-selection : un bouton par classe DS partagee (>1 element)
    var shared = [];
    classAttr(selected).trim().split(/\s+/).forEach(function (nm) {
      if (!nm) return;
      var r = E.resolve(nm);
      if (r.category === 'unknown' || r.category === 'buildable') return;
      var n = document.querySelectorAll('.' + CSS.escape(nm)).length;
      if (n > 1) shared.push({ nm: nm, n: n, canon: canonOf(r) });
    });
    shared.forEach(function (s) {
      var on = multiGroup && multiGroup.selector === s.nm;
      var label = shared.length > 1 ? ('🎯 Cibler les ' + s.n + ' × ' + s.canon) : ('🎯 Cibler les ' + s.n + ' éléments de ce style');
      verbsBox.appendChild(h('button', { class: 'bdr-v multi' + (on ? ' on' : ''), title: 'Sélectionner les ' + s.n + ' éléments identiques pour un changement groupé', text: label, onclick: function () { on ? clearMulti() : selectGroup(s.nm); renderSelected(); } }));
    });

    verbsBox.appendChild(h('button', { class: 'bdr-v', text: '🔁 Changer le style', onclick: showSwap }));
    verbsBox.appendChild(h('button', { class: 'bdr-v create', text: '➕ Nouveau style', onclick: showBuilder }));
    verbsBox.appendChild(h('button', { class: 'bdr-v', text: '📝 Ajouter une note', onclick: showNote }));
  }

  /* ---- cibles + preview -------------------------------------------------- */
  function targets() { return multiGroup ? multiGroup.els : (selected ? [selected] : []); }
  function clearDyn() { restorePreview(); if (dynCleanup) { try { dynCleanup(); } catch (e) {} dynCleanup = null; } }
  function keptClasses(el) { return classAttr(el).split(/\s+/).filter(function (c) { return c && E.resolve(c).category === 'unknown'; }); }

  var previewSaved = null;
  function applyClass(cls) {
    targets().forEach(function (el) { var k = keptClasses(el); k.push(cls); el.setAttribute('class', k.join(' ')); });
    if (selected) { markSelected(selected); boxAt(selBox, selected); } paintMulti();
  }
  function swapPreview(cls) {
    if (!previewSaved) { previewSaved = new Map(); targets().forEach(function (el) { previewSaved.set(el, classAttr(el)); }); }
    applyClass(cls);
  }
  function restorePreview() {
    if (previewSaved) { previewSaved.forEach(function (v, el) { el.setAttribute('class', v); }); previewSaved = null; if (selected) { markSelected(selected); boxAt(selBox, selected); } paintMulti(); }
  }
  function commitSwap(cls, verdictExtra) {
    restorePreview();
    var els = targets();
    els.forEach(function (el) { var k = keptClasses(el); k.push(cls); stage(el, k.join(' ')); });
    var extra = Object.assign({ proposition: cls }, verdictExtra || {});
    if (multiGroup) extra.group = { selector: '.' + multiGroup.selector, count: els.length };
    record(els[0], verdictExtra && verdictExtra.new_style ? 'create' : 'swap', extra);
    toast((multiGroup ? els.length + ' éléments → ' : '') + cls + ' — enregistré');
    clearMulti();
  }

  /* ---- changer le style (dropdown triee, preview live) ------------------- */
  function showSwap() {
    if (!selected) return;
    clearDyn(); view = 'review'; dynBox.innerHTML = ''; panel.classList.add('acting');
    var fam = currentTypo(selected); fam = fam && fam.family;
    var search = h('input', { id: 'bdr-search', placeholder: 'Chercher un style…' });
    var list = h('div', {});
    function optEl(name) {
      var opt = h('div', { class: 'bdr-opt', text: name });
      opt.addEventListener('mouseenter', function () { swapPreview(name); });
      opt.addEventListener('mouseleave', function () { restorePreview(); });
      opt.addEventListener('click', function () { commitSwap(name); dynBox.innerHTML = ''; });
      return opt;
    }
    function fill(q) {
      list.innerHTML = '';
      groupsFor(fam).forEach(function (g) {
        var items = g.items.filter(function (it) { return it.name.indexOf(q) !== -1; });
        if (!items.length) return;
        list.appendChild(h('div', { class: 'bdr-optgroup', text: g.title }));
        items.forEach(function (it) { list.appendChild(optEl(it.name)); });
      });
    }
    search.addEventListener('input', function () { fill(search.value.trim()); });
    dynBox.appendChild(search); dynBox.appendChild(list); fill(''); search.focus();
  }

  /* ---- builder : nouveau style (pre-rempli depuis le style courant) ------ */
  function showBuilder() {
    if (!selected) return;
    clearDyn(); view = 'review'; dynBox.innerHTML = ''; panel.classList.add('acting');
    var pre = currentTypo(selected);
    var st = pre ? { family: pre.family, max: pre.max, min: (pre.min === pre.max ? null : pre.min), mods: pre.mods.slice() }
                 : { family: null, max: null, min: null, mods: [] };

    var wrap = h('div', { class: 'bdr-bld' });
    var nameEl = h('div', { class: 'bdr-name', text: '—' });
    var statusEl = h('div', { class: 'bdr-status' });
    var actionEl = h('div', {});
    var maxChips = h('div', { class: 'bdr-sizechips' });
    var minChips = h('div', { class: 'bdr-sizechips' });
    var maxIn = h('input', { class: 'bdr-num', type: 'number', placeholder: 'max', min: '1' });
    var minIn = h('input', { class: 'bdr-num', type: 'number', placeholder: 'min', min: '1' });
    var modsBox = h('div', { class: 'bdr-mods' });
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
        maxChips.appendChild(h('span', { class: 'bdr-sc exists', text: mx, title: 'taille déjà utilisée', onclick: function () { maxIn.value = mx; st.max = mx; refreshMins(); update(); } }));
      });
      refreshMins();
    }
    function refreshMins() {
      minChips.innerHTML = '';
      if (!st.family || !st.max) return;
      E.minsForFamilyMax(st.family, st.max).forEach(function (mn) {
        minChips.appendChild(h('span', { class: 'bdr-sc exists', text: mn, title: 'déjà utilisée', onclick: function () { minIn.value = mn; st.min = mn; update(); } }));
      });
    }
    maxIn.addEventListener('input', function () { st.max = maxIn.value ? +maxIn.value : null; refreshMins(); update(); });
    minIn.addEventListener('input', function () { st.min = minIn.value ? +minIn.value : null; update(); });

    CAT.mods.forEach(function (m) {
      var on = st.mods.indexOf(m.key) !== -1;
      var b = h('div', { class: 'bdr-mod' + (on ? ' on' : ''), text: (on ? '✓ ' : '+ ') + m.label, title: m.key, onclick: function () {
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
    var bldPreviewSaved = null;
    function previewCreated(name, parsed) {
      if (parsed) injectStyle(name, parsed);
      if (!bldPreviewSaved) { bldPreviewSaved = new Map(); targets().forEach(function (el) { bldPreviewSaved.set(el, classAttr(el)); }); }
      applyClass(name);
    }
    function restoreBld() { if (bldPreviewSaved) { bldPreviewSaved.forEach(function (v, el) { el.setAttribute('class', v); }); bldPreviewSaved = null; if (selected) { markSelected(selected); boxAt(selBox, selected); } } }
    function update() {
      var name = currentName();
      if (!name) { nameEl.textContent = '—'; statusEl.textContent = ''; statusEl.className = 'bdr-status'; actionEl.innerHTML = ''; return; }
      nameEl.textContent = name;
      var min = (st.min == null || st.min === '') ? st.max : st.min;
      var parsed = { family: st.family, max: +st.max, min: +min, mods: E.sortMods(st.mods) };
      var exists = E.existsExact(name);
      actionEl.innerHTML = '';
      if (exists) {
        statusEl.className = 'bdr-status exists';
        statusEl.textContent = '✓ Ce style existe déjà — autant le réutiliser tel quel.';
        previewCreated(name, null);
        actionEl.appendChild(h('button', { class: 'bdr-cta', text: 'Utiliser ce style', onclick: function () { restoreBld(); dynCleanup = null; commitSwap(name); dynBox.innerHTML = ''; } }));
      } else {
        statusEl.className = 'bdr-status new';
        statusEl.innerHTML = '✨ Nouveau style — aperçu appliqué en direct.';
        previewCreated(name, parsed);
        var role = h('input', { class: 'bdr-role', placeholder: 'Rôle' });
        actionEl.appendChild(role);
        actionEl.appendChild(h('button', { class: 'bdr-cta', text: 'Créer et appliquer', onclick: function () {
          restoreBld(); dynCleanup = null;
          var css = injectStyle(name, parsed); createdStyles[name] = css;
          commitSwap(name, { new_style: { name: name, family: parsed.family, max: parsed.max, min: parsed.min, mods: parsed.mods, role: role.value.trim() || null, css: css } });
          dynBox.innerHTML = '';
        } }));
      }
    }

    wrap.appendChild(h('div', { class: 'bdr-bld-t', text: pre ? '➕ Ajuster / créer un style' : '➕ Construire un style' }));
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

    // reflet du pre-remplissage
    if (st.family) {
      Array.prototype.forEach.call(famsBox.children, function (c) { if (c.getAttribute('title') === st.family) c.classList.add('on'); });
      if (st.max != null) maxIn.value = st.max;
      if (st.min != null) minIn.value = st.min;
      refreshSizes();
    }
    update();
  }

  /* ---- note (n'importe quel element, dont icones) ------------------------ */
  function showNote() {
    if (!selected) return;
    clearDyn(); view = 'review'; dynBox.innerHTML = ''; panel.classList.add('acting');
    var d = describe(selected);
    var ph = d.resource ? 'Ex : « Utilise cette icône : … » ou « Remplace par … »' : 'Changement souhaité, remarque…';
    var ta = h('textarea', { id: 'bdr-note', placeholder: ph });
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
      h('span', { class: 'bdr-state ds', text: 'Modifications · ' + feedbacks.length }),
      h('span', { class: 'bdr-x', text: '×', title: 'Revenir à la revue', onclick: function () { view = 'review'; renderSelected(); } })));

    if (touchedEls.length) {
      rep.appendChild(h('div', { class: 'bdr-rep-ba' },
        h('div', { class: 'bdr-ba' + (!showAfter ? ' on' : ''), text: 'Avant', onclick: function () { applyBA(false); renderReport(); } }),
        h('div', { class: 'bdr-ba' + (showAfter ? ' on' : ''), text: 'Après', onclick: function () { applyBA(true); renderReport(); } })));
    }

    if (!feedbacks.length) {
      rep.appendChild(h('div', { class: 'bdr-empty', text: 'Aucune modification pour l’instant. Sélectionne un élément et propose un changement.' }));
    } else {
      var curPage = null;
      feedbacks.forEach(function (fb, i) {
        if (fb.url !== curPage) { curPage = fb.url; rep.appendChild(h('div', { class: 'bdr-rep-pg', text: fb.url })); }
        var icon = { swap: '🔁', create: '➕', note: '📝' }[fb.verdict] || '•';
        var to = fb.verdict === 'create' ? (fb.new_style && fb.new_style.name) : fb.verdict === 'swap' ? fb.proposition : (fb.note || '');
        var main = h('div', { class: 'bdr-rep-main' },
          h('div', { class: 'to', text: (fb.group ? '[' + fb.group.count + '×] ' : '') + (to || '') }),
          h('div', { class: 'anc', text: '<' + fb.tag + '> ' + (fb.text_anchor || fb.css_path || '').slice(0, 44) }));
        rep.appendChild(h('div', { class: 'bdr-rep-row' },
          h('span', { class: 'bdr-rep-v', text: icon }), main,
          h('span', { class: 'bdr-rep-del', text: '×', title: 'Retirer', onclick: function () { feedbacks.splice(i, 1); saveReport(); renderTray(); renderReport(); } })));
      });
    }

    rep.appendChild(h('button', { class: 'bdr-lock', text: pageLocked ? '↻ Reprendre la revue de cette page' : '🔒 Verrouiller la page (revue terminée)', onclick: function () { toggleLock(); } }));
    if (feedbacks.length) rep.appendChild(h('button', { class: 'bdr-clear', text: 'Vider le rapport', onclick: function () { if (confirm('Effacer toutes les modifications enregistrées (toutes pages) ?')) { clearReport(); renderReport(); } } }));
    dynBox.appendChild(rep);
  }
  function toggleLock() {
    pageLocked = !pageLocked;
    if (pageLocked) {
      applyBA(true);
      reviewMode = false; unpaint(); clearHover(); unmarkSelected();
      selected = null; selPath = null; selBox.style.display = 'none'; clearMulti();
      view = 'review'; syncState(); renderSelected();
      toast('Page verrouillée — navigue vers la suivante');
    } else { toast('Revue reprise'); renderReport(); }
  }

  /* ---- barre / divers ---------------------------------------------------- */
  function renderRes() { resBadge.textContent = breakpoint() + ' ' + innerWidth + '×' + innerHeight; }
  function renderTray() { countBadge.textContent = 'Modifications enregistrées · ' + feedbacks.length; }
  function collapse() { panel.classList.add('collapsed'); reopen.style.display = 'block'; }
  function expand() { panel.classList.remove('collapsed'); reopen.style.display = 'none'; }

  function exportJSON() {
    var payload = {
      tool: 'biences-design-review', version: '0.18.0',
      site: location.hostname, exported_at: new Date().toISOString(),
      created_styles: createdStyles, feedbacks: feedbacks
    };
    var data = JSON.stringify(payload, null, 2);
    try { navigator.clipboard && navigator.clipboard.writeText(data); } catch (e) {}
    var blob = new Blob([data], { type: 'application/json' });
    var a = h('a', { href: URL.createObjectURL(blob), download: 'review_' + location.hostname + '_' + feedbacks.length + '.json' });
    root.appendChild(a); a.click(); a.remove();
    toast(feedbacks.length + ' modification(s) exportée(s)');
  }

  function toggle() {
    reviewMode = !reviewMode;
    if (reviewMode) { try { localStorage.setItem(INTENT, '1'); } catch (e) {} pageLocked = false; expand(); paint(); }
    else { try { localStorage.removeItem(INTENT); } catch (e) {} unpaint(); clearHover(); }
    syncState(); renderSelected();
  }

  /* ---- hover -------------------------------------------------------------- */
  var hovered = null;
  function setHover(el) { hovered = el; boxAt(hovBox, el); }
  function clearHover() { hovered = null; hovBox.style.display = 'none'; hoverLine.innerHTML = 'Survole un élément…'; }
  function showHoverInfo(el) {
    var c = classify(el);
    var names = c.ds.map(canonOf);
    var txt = '&lt;' + el.tagName.toLowerCase() + '&gt; ';
    if (names.length) txt += names.join(', ');
    else {
      var base = c.override.length ? 'inline-style' : '— sans style —';
      var anc = nearestStyled(el);
      if (anc) txt += base + ' <span class="up">↑ ' + anc.tagName.toLowerCase() + ' ' + classify(anc).ds.map(canonOf).join(',') + '</span>';
      else txt += base;
    }
    hoverLine.innerHTML = txt;
  }

  /* ---- listeners ---------------------------------------------------------- */
  document.addEventListener('mouseover', function (e) {
    if (!reviewMode || (e.target.closest && e.target.closest('#bdr-root'))) { clearHover(); return; }
    if (e.target === selected) { hovBox.style.display = 'none'; hovered = null; return; }
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
  addEventListener('resize', function () { renderRes(); if (reviewMode) paint(); if (selected) { markSelected(selected); boxAt(selBox, selected); } boxAt(hovBox, hovered); paintMulti(); });
  addEventListener('scroll', function () { if (selected) boxAt(selBox, selected); if (hovered) boxAt(hovBox, hovered); paintMulti(); }, true);
  addEventListener('keydown', function (e) {
    if (e.altKey && (e.key === 'r' || e.key === 'R')) { e.preventDefault(); toggle(); return; }
    if (e.key === 'Escape') {
      if (inField()) { document.activeElement.blur(); return; }
      if (dynBox.firstChild) { clearDyn(); renderSelected(); }
      else if (selected) deselect();
      return;
    }
    if (!reviewMode || inField() || e.ctrlKey || e.metaKey || e.altKey) return;
    if (!selected) return;
    var k = e.key.toLowerCase();
    if (k === 'c') { e.preventDefault(); showSwap(); }
    else if (k === 's') { e.preventDefault(); showBuilder(); }
    else if (k === 'n') { e.preventDefault(); showNote(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); navUp(); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); navDown(); }
  });

  /* ---- boot --------------------------------------------------------------- */
  root.appendChild(style); root.appendChild(hovBox); root.appendChild(selBox); root.appendChild(multiLayer); root.appendChild(panel); root.appendChild(reopen); root.appendChild(toastEl);
  document.body.appendChild(root);
  buildTokens(); resolveColors(); loadReport();
  var resume = false; try { resume = localStorage.getItem(INTENT) === '1'; } catch (e) {}
  if (resume) reviewMode = true;
  renderRes(); renderTray(); syncState(); renderSelected(); if (reviewMode) paint();
  collapse();

  window.__bdr = { toggle: toggle, get feedbacks() { return feedbacks; }, export: exportJSON, clear: clearReport, engine: E, catalog: CAT, colors: colors };
  console.log('[BDR] v0.18 prêt — ' + (reviewMode ? 'revue reprise' : 'en pause') + ', ' + feedbacks.length + ' modif(s) en mémoire. Onglet « Design Review » à droite, ou Alt+R.');
})();
