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
      max = max / 10; min = min / 10;   // le nom encode des px (1rem = 10px) ; le mixin travaille en rem
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
    function synthCSS(selector, parsed, colors, important) {
      var fam = famByKey[parsed.family];
      var curve = fam ? fam.curve : 'text';
      var levels = sizeLevels(curve, parsed.max, parsed.min);
      var mods = parsed.mods || [];
      var imp = important ? ' !important' : '';
      var col = colors && colors.text || '#1c1c1c';
      if (mods.indexOf('ondark') !== -1) col = '#ffffff';
      else if (mods.indexOf('muted') !== -1) col = (colors && colors.muted) || col;
      else if (mods.indexOf('accent') !== -1) col = (colors && colors.accent) || col;
      var decl = 'font-family:var(' + (fam ? fam.font : '--font-text') + ')' + imp + ';';
      decl += 'color:' + col + imp + ';';
      decl += 'text-transform:' + (mods.indexOf('caps') !== -1 ? 'uppercase' : 'none') + imp + ';';
      if (mods.indexOf('wide') !== -1) decl += 'letter-spacing:0.2em' + imp + ';';
      decl += 'font-size:' + levels[0].fs + 'rem' + imp + ';line-height:' + levels[0].lh + 'rem' + imp + ';';
      var css = '.' + selector + '{' + decl + '}';
      for (var i = 1; i < 8; i++) {
        css += '@media(min-width:' + MQ[i] + 'px){.' + selector +
          '{font-size:' + levels[i].fs + 'rem' + imp + ';line-height:' + levels[i].lh + 'rem' + imp + ';}}';
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

/* ---- tests node ---------------------------------------------------------- */
if (typeof require !== 'undefined' && require.main === module) {
  var fs = require('fs'), path = require('path');
  var CAT = JSON.parse(fs.readFileSync(path.join(__dirname, 'ds_catalog_v2.json'), 'utf8'));
  var E = require('./bdr_engine.js').makeEngine(CAT);
  var ok = 0, ko = 0;
  function eq(label, got, want) {
    var g = JSON.stringify(got), w = JSON.stringify(want);
    if (g === w) { ok++; }
    else { ko++; console.log('  KO ' + label + '\n     got  ' + g + '\n     want ' + w); }
  }

  // decomposition
  eq('parse body-17-14', E.parseName('body-17-14'), { family: 'body', max: 17, min: 14, mods: [] });
  eq('parse body-bold-15-12-caps-ondark-wide', E.parseName('body-bold-15-12-caps-ondark-wide'),
    { family: 'body-bold', max: 15, min: 12, mods: ['caps', 'ondark', 'wide'] });
  eq('parse title-it-54-35', E.parseName('title-it-54-35'), { family: 'title-it', max: 54, min: 35, mods: [] });
  eq('parse body-bold-9-ondark', E.parseName('body-bold-9-ondark'), { family: 'body-bold', max: 9, min: 9, mods: ['ondark'] });
  eq('parse cta-primary (non typo)', E.parseName('cta-primary'), null);
  eq('parse bad mod', E.parseName('body-17-14-xxx'), null);

  // construction + round-trip sur tout le canon
  var rt = 0;
  CAT.canon.forEach(function (n) {
    var p = E.parseName(n);
    var built = E.buildName(p.family, p.max, p.min, p.mods);
    if (built !== n) { rt++; console.log('  KO round-trip ' + n + ' -> ' + built); }
  });
  eq('round-trip canon (0 divergence)', rt, 0);
  eq('build tri des mods', E.buildName('body', 12, 9, ['wide', 'caps', 'muted']), 'body-12-9-caps-muted-wide');
  eq('build taille simple', E.buildName('body-bold', 9, 9, ['ondark']), 'body-bold-9-ondark');

  // taille fidele : body-17-14 (nom en px) -> font-size-text donne 1.7rem en hd
  var lv = E.sizeLevels('text', 17, 14);
  eq('text 17/14 @1920 (hd)', lv[7].fs, 1.7);
  eq('text 17/14 @1600 (desktop)', lv[6].fs, 1.65);
  eq('text 17/14 @768 (tablet)', lv[3].fs, 1.5);
  eq('sizeAt vw=1440', E.sizeAt('text', 17, 14, 1440), 1.6);   // bucket laptop 1366
  eq('sizeAt vw=500 (bucket 361)', E.sizeAt('text', 17, 14, 500), 1.4);
  eq('cta 54/35 @1920', E.sizeLevels('cta', 54, 35)[7].fs, 5.4);
  eq('title-78-42 @1920 = 7.8rem (78px, pas 780)', E.sizeLevels('title', 78, 42)[7].fs, 7.8);

  // resolution
  eq('resolve alias font2-title-style', E.resolve('font2-title-style').canonical, 'title-54-35');
  eq('resolve role product-name', E.resolve('product-name'), { name: 'product-name', category: 'role', canonical: 'body-14-12-caps' });
  eq('resolve component cta-primary', E.resolve('cta-primary').category, 'component');
  eq('resolve util u-strike', E.resolve('u-strike').category, 'util');
  eq('resolve unknown', E.resolve('col-md-6').category, 'unknown');
  eq('alias multi price-base-strike', E.resolve('price-base-strike').canonical, 'price-base u-strike');

  // combinaisons existantes
  eq('maxes body-bold', E.maxesForFamily('body-bold'), [9, 13, 14, 15, 16, 18]);
  eq('mins body-bold max16', E.minsForFamilyMax('body-bold', 16), [12, 14]);
  eq('modSets body 12/9', E.modSetsFor('body', 12, 9).sort().length >= 2, true);
  eq('existsExact body-17-14', E.existsExact('body-17-14'), true);
  eq('existsExact body-99-88 (nouveau)', E.existsExact('body-99-88'), false);

  // synthese CSS : contient bien 8 niveaux et le token de police
  var css = E.synthCSS('body-52-34-caps-wide', E.parseName('body-52-34-caps-wide'), { text: '#1c1c1c', muted: '#8a8a8a', accent: '#e87722' });
  eq('synth: 7 media-queries', (css.match(/@media/g) || []).length, 7);
  eq('synth: police body', css.indexOf('var(--font-text)') !== -1, true);
  eq('synth: uppercase', css.indexOf('text-transform:uppercase') !== -1, true);
  eq('synth: wide', css.indexOf('letter-spacing:0.2em') !== -1, true);

  console.log('\n=== moteur BDR : ' + ok + ' OK, ' + ko + ' KO ===');
  process.exit(ko ? 1 : 0);
}
