/* ==========================================================================
 * BDR — moteur du DS ATOMIQUE (pur, sans DOM)
 *
 * Le vocabulaire se COMPOSE (decision Manuel du 23.08.2026) : au lieu d'un
 * cran par combinaison, une classe par nature.
 *
 *     body-bold-16-13-caps-wide  ->  f-body-bold s-16-13 m-caps m-wide
 *     title-54-35                ->  f-title s-54-35-cta
 *
 * Ce que le moteur sait faire :
 *   - lire une liste de classes et la ranger par AXE (f / s / c / m / h) ;
 *   - reconnaitre un cran monolithique (la PRODUCTION en est encore faite) et
 *     donner sa traduction en atomes ;
 *   - calculer la taille SERVIE, fidele aux mixins d'aujourd'hui ;
 *   - synthetiser le CSS d'un atome de taille qui n'existe pas encore.
 *
 * 🔴 LA MATH DES TAILLES A CHANGE LE 17.08.2026, ET C'EST LE PIEGE DE CE
 * FICHIER. Les quatre mixins posaient un DIVISEUR sur leur palier bas ; il a
 * ete retire parce que le min annonce par le nom n'etait servi a aucune
 * largeur. Depuis :
 *   - `font-size-text` n'est plus un escalier du tout, c'est un `clamp()`
 *     continu entre 361 et 1920 px ;
 *   - `cta` / `title` / `banner` gardent leurs huit paliers, mais RECALES par
 *     une transformation affine sur [min, max] : la forme de la courbe est
 *     conservee, les deux extremites atterrissent pile sur les bornes du nom.
 * Les coefficients ne sont donc PAS ecrits ici : ils sont extraits du SCSS par
 * `gen_ds_catalog.py` et vivent dans le catalogue. Un mixin qui bouge, un
 * `gen` a relancer, et le moteur suit. C'est exactement ce qui a manque : la
 * version precedente appliquait encore les diviseurs un mois apres.
 *
 * Teste sous node contre le CSS REELLEMENT COMPILE PAR SASS
 * (`fixtures/sass_compile.json`, extrait de `biences_product.css`). Un test
 * qui compare le moteur a lui-meme ne peut pas echouer ; celui-la le peut.
 * ========================================================================== */
(function (root) {
  'use strict';

  var MQ = [0, 361, 510, 768, 1024, 1366, 1600, 1920];

  /* Sass arrondit a 10 decimales et coupe les zeros de fin. On rend le meme
   * nombre, sinon la comparaison au CSS compile echoue sur du bruit flottant. */
  function sassNum(x) {
    var v = Math.round(x * 1e10) / 1e10;
    var s = v.toFixed(10).replace(/0+$/, '').replace(/\.$/, '');
    return s === '-0' ? '0' : s;
  }
  function r6(x) { return Math.round(x * 1e6) / 1e6; }

  function makeEngine(CAT) {
    var AX = {};
    (CAT.axes || []).forEach(function (a) { AX[a.key] = a; });

    // index des atomes par nom et par axe
    var atomByName = {}, atomsOf = {};
    Object.keys(CAT.atoms || {}).forEach(function (axis) {
      atomsOf[axis] = CAT.atoms[axis] || [];
      atomsOf[axis].forEach(function (a) {
        a.axis = axis;
        atomByName[a.name] = a;
      });
    });
    var legacyMap = CAT.legacy || {};
    var roleMap = CAT.roles || {};
    var aliasMap = CAT.aliases || {};
    var utilSet = {}; (CAT.utils || []).forEach(function (n) { utilSet[n] = true; });
    var compSet = {};
    Object.keys(CAT.components || {}).forEach(function (g) {
      CAT.components[g].forEach(function (n) { compSet[n] = g; });
    });
    var minPx = (CAT.min_rule && CAT.min_rule.px) || 3;

    // ── taille : les deux regimes ───────────────────────────────────────────

    /* `font-size-text` : une rampe continue. Rend les termes du `clamp()`,
     * en rem, tels que sass les ecrit. */
    function clampTerms(max, min, coefMax, coefMin, de, a) {
      var hi = max * coefMax, lo = min * coefMin;
      if (hi === lo) return { fixe: hi };
      return { lo: lo, hi: hi, pente: (hi - lo) * 10, de: de, a: a };
    }
    function textTerms(max, min) {
      var tc = CAT.text_curve;
      max = max / 10; min = min / 10;      // le nom porte des px, le mixin des rem
      return {
        fs: clampTerms(max, min, tc.fs.max, tc.fs.min, tc.fs.de, tc.fs.a),
        lh: clampTerms(max, min, tc.lh.max, tc.lh.min, tc.lh.de, tc.lh.a)
      };
    }
    function clampCSS(t) {
      if (t.fixe !== undefined) return sassNum(t.fixe) + 'rem';
      return 'clamp(' + sassNum(t.lo) + 'rem, ' + sassNum(t.lo) + 'rem + ' +
        sassNum(t.pente) + ' * (100vw - ' + t.de + 'px) / ' + (t.a - t.de) +
        ', ' + sassNum(t.hi) + 'rem)';
    }
    function clampAt(t, vw) {
      if (t.fixe !== undefined) return t.fixe;
      var v = t.lo + t.pente / 10 * (vw - t.de) / (t.a - t.de);
      return Math.min(t.hi, Math.max(t.lo, v));
    }

    /* `cta` / `title` / `banner` : huit paliers, recales en affine sur
     * [min, max]. `servi(k) = min + (o(k) - o(0)) * (max - min) / (o(7) - o(0))`,
     * et l'interligne suit par le RATIO l(k)/o(k) du mixin d'origine. */
    function ladderLevels(curve, max, min) {
      var c = CAT.curves[curve];
      if (!c) return null;
      max = max / 10; min = min / 10;
      var step = (max - min) / 6;
      function ev(co) { return (max / co.div - step * co.k) * co.mult; }
      var o = c.fs.map(ev), l = c.lh.map(ev);
      var k = (max - min) / (o[7] - o[0]);
      var out = [];
      for (var i = 0; i < 8; i++) {
        var fs = (i === 7) ? max : min + (o[i] - o[0]) * k;
        out.push({ mq: MQ[i], fs: fs, lh: fs * (l[i] / o[i]) });
      }
      return out;
    }

    /* Rend la description complete d'une taille, quel que soit son regime. */
    function sizeSpec(curve, max, min) {
      if (curve === 'fixed') return { kind: 'fixed', px: max };
      if (curve === 'text') return { kind: 'clamp', terms: textTerms(max, min) };
      return { kind: 'ladder', levels: ladderLevels(curve, max, min) };
    }
    function levelIndexFor(vw) {
      var idx = 0;
      for (var i = 0; i < MQ.length; i++) if (vw >= MQ[i]) idx = i;
      return idx;
    }
    /* Taille servie a une largeur, en PX. */
    function sizeAt(curve, max, min, vw) {
      var sp = sizeSpec(curve, max, min);
      if (sp.kind === 'fixed') return sp.px;
      if (sp.kind === 'clamp') return r6(clampAt(sp.terms.fs, vw) * 10);
      return r6(sp.levels[levelIndexFor(vw)].fs * 10);
    }

    // ── la regle du min ─────────────────────────────────────────────────────
    // TEXTE uniquement : `min = max - 3`. Les titres gardent le min ecrit a
    // l'appel (decision Manuel du 22.08.2026, « je veux pas que tu changes les
    // title »), le builder ne doit donc pas le deduire pour eux.
    function minDuCran(max, curve) {
      return (curve || 'text') === 'text' ? max - minPx : null;
    }

    // ── noms d'atomes de taille ─────────────────────────────────────────────
    function sizeAtomName(max, min, curve) {
      curve = curve || 'text';
      if (curve === 'fixed' || min == null || +min === +max) return 's-' + max;
      return 's-' + max + '-' + min + (curve === 'text' ? '' : '-' + curve);
    }
    function findSize(max, min, curve) {
      curve = curve || 'text';
      for (var i = 0; i < (atomsOf.s || []).length; i++) {
        var a = atomsOf.s[i];
        if (a.curve === curve && a.max === +max && a.min === +min) return a;
      }
      return null;
    }
    function sizesByCurve(curve) {
      return (atomsOf.s || []).filter(function (a) { return a.curve === curve; });
    }

    // ── lecture d'un nom ────────────────────────────────────────────────────
    function parseAtom(name) {
      return atomByName[name] || null;
    }
    /* Un nom de taille jamais defini mais bien forme : le builder peut le creer. */
    function parseSizeName(name) {
      var m = /^s-(\d+)(?:-(\d+))?(?:-(cta|title|banner))?$/.exec(name);
      if (!m) return null;
      var curve = m[3] || (m[2] ? 'text' : 'fixed');
      return {
        name: name, axis: 's', curve: curve,
        max: +m[1], min: m[2] ? +m[2] : +m[1]
      };
    }
    function legacyToAtoms(name) {
      var l = legacyMap[name];
      return (l && l.atoms) ? l.atoms.slice() : null;
    }

    function resolve(name) {
      if (atomByName[name]) {
        return { name: name, category: 'atom', axis: atomByName[name].axis,
                 atom: atomByName[name], atoms: [name] };
      }
      if (legacyMap[name]) {
        return { name: name, category: 'legacy', legacy: legacyMap[name],
                 atoms: legacyToAtoms(name) };
      }
      if (roleMap[name]) {
        var tgt = roleMap[name];
        return { name: name, category: 'role', canonical: tgt,
                 atoms: atomByName[tgt] ? [tgt] : legacyToAtoms(tgt) };
      }
      if (compSet[name]) {
        return { name: name, category: 'component', group: compSet[name], atoms: null };
      }
      if (utilSet[name]) return { name: name, category: 'util', atoms: [name] };
      if (aliasMap[name]) {
        var toks = String(aliasMap[name]).split(/\s+/);
        var out = [];
        toks.forEach(function (t) {
          var r = resolve(t);
          if (r.atoms) out = out.concat(r.atoms); else out.push(t);
        });
        return { name: name, category: 'alias', canonical: aliasMap[name], atoms: out };
      }
      var sz = parseSizeName(name);
      if (sz) return { name: name, category: 'buildable', axis: 's', atom: sz, atoms: [name] };
      return { name: name, category: 'unknown', atoms: null };
    }
    function isDS(name) { return resolve(name).category !== 'unknown'; }

    /* Range une liste de classes par axe. C'est la lecture dont l'interface a
     * besoin : un element ne porte plus UNE classe DS mais une composition, et
     * peut porter en plus un cran d'avant sur la production. */
    function readClasses(list) {
      var out = { f: null, s: null, c: null, m: [], h: null,
                  legacy: [], components: [], roles: [], aliases: [],
                  utils: [], unknown: [], ds: [] };
      (list || []).forEach(function (n) {
        if (!n) return;
        var r = resolve(n);
        if (r.category === 'atom') {
          out.ds.push(n);
          if (AX[r.axis] && AX[r.axis].multiple) out[r.axis].push(n);
          else out[r.axis] = n;
        } else if (r.category === 'legacy') { out.ds.push(n); out.legacy.push(n); }
        else if (r.category === 'role') { out.ds.push(n); out.roles.push(n); }
        else if (r.category === 'component') { out.ds.push(n); out.components.push(n); }
        else if (r.category === 'alias') { out.ds.push(n); out.aliases.push(n); }
        else if (r.category === 'util') { out.ds.push(n); out.utils.push(n); }
        else out.unknown.push(n);
      });
      return out;
    }

    /* Ce que l'element DEVRAIT porter : ses atomes, crans traduits compris.
     * Sert au bandeau « a migrer » et a la proposition automatique. */
    function atomsFor(list) {
      var seen = {}, out = [];
      (list || []).forEach(function (n) {
        var a = resolve(n).atoms;
        if (!a) return;
        a.forEach(function (x) { if (!seen[x]) { seen[x] = 1; out.push(x); } });
      });
      return out;
    }

    /* Une composition est-elle complete ? `f-` et `s-` sont requis : un texte
     * sans atome de taille retombe sur ce que son parent lui donne. */
    function missingAxes(read) {
      return (CAT.axes || []).filter(function (a) {
        return a.required && !(a.multiple ? read[a.key].length : read[a.key]);
      }).map(function (a) { return a.key; });
    }

    // ── synthese CSS d'un atome de taille neuf ──────────────────────────────
    function synthSizeCSS(name, max, min, curve, important) {
      var imp = important ? ' !important' : '';
      var sp = sizeSpec(curve, max, min);
      if (sp.kind === 'fixed') {
        return '.' + name + '{font-size:' + max + 'px' + imp + ';}';
      }
      if (sp.kind === 'clamp') {
        return '.' + name + '{font-size:' + clampCSS(sp.terms.fs) + imp +
          ';line-height:' + clampCSS(sp.terms.lh) + imp + ';}';
      }
      var lv = sp.levels;
      var css = '.' + name + '{font-size:' + sassNum(lv[0].fs) + 'rem' + imp +
        ';line-height:' + sassNum(lv[0].lh) + 'rem' + imp + ';}';
      for (var i = 1; i < 8; i++) {
        css += '@media(min-width:' + MQ[i] + 'px){.' + name +
          '{font-size:' + sassNum(lv[i].fs) + 'rem' + imp +
          ';line-height:' + sassNum(lv[i].lh) + 'rem' + imp + ';}}';
      }
      return css;
    }

    /* CSS d'un atome QUELCONQUE, pour le rejouer la ou il n'existe pas.
     * C'est le cas de la PRODUCTION : aucun `f-` / `s-` / `c-` / `m-` n'y est
     * servi. Sans ca, changer un axe sur biences.ch ne peindrait rien et
     * l'outil dirait le contraire de ce que l'ecran montre.
     * Les tailles passent par la math ; les autres axes rendent les
     * declarations que le DS ecrit, `var(--x)` compris — elles sont valides
     * telles quelles sur les deux sites. */
    function synthAtomCSS(name, important) {
      var a = atomByName[name] || parseSizeName(name);
      if (!a) return null;
      if (a.axis === 's' || /^s-/.test(name)) {
        return synthSizeCSS(name, a.max, a.min, a.curve, important);
      }
      var imp = important ? ' !important' : '';
      var css = '';
      (a.decls || []).forEach(function (bloc) {
        var sel = '.' + name + (bloc[0] ? ' ' + bloc[0] : '');
        var d = bloc[1].map(function (kv) {
          return kv[0] + ':' + String(kv[1]).replace(/\s*!important\s*$/, '') + imp;
        }).join(';');
        if (d) css += sel + '{' + d + ';}';
      });
      return css || null;
    }

    /* Le SCSS a coller dans `ds/_atomes.scss` : c'est ce qui part au rapport,
     * pas le CSS synthetise. Le CSS sert a VOIR, le SCSS a POSER. */
    function scssForSize(name, max, min, curve) {
      if (curve === 'fixed') return '.' + name + ' { font-size: ' + max + 'px; }';
      var args = (max / 10) + ', ' + (min / 10);
      if (curve === 'text' && min === max - minPx) args = String(max / 10);
      return '.' + name + ' { @include font-size-' + curve + '(' + args + '); }';
    }

    return {
      CAT: CAT, MQ: MQ, minPx: minPx,
      sassNum: sassNum,
      atomsOf: atomsOf, atomByName: atomByName,
      parseAtom: parseAtom, parseSizeName: parseSizeName,
      resolve: resolve, isDS: isDS, readClasses: readClasses, atomsFor: atomsFor,
      missingAxes: missingAxes, legacyToAtoms: legacyToAtoms,
      sizeSpec: sizeSpec, sizeAt: sizeAt, levelIndexFor: levelIndexFor,
      ladderLevels: ladderLevels, textTerms: textTerms, clampCSS: clampCSS,
      minDuCran: minDuCran, sizeAtomName: sizeAtomName, findSize: findSize,
      sizesByCurve: sizesByCurve,
      synthSizeCSS: synthSizeCSS, synthAtomCSS: synthAtomCSS, scssForSize: scssForSize
    };
  }

  root.BDR_makeEngine = makeEngine;
  if (typeof module !== 'undefined' && module.exports) module.exports = { makeEngine: makeEngine };
})(typeof window !== 'undefined' ? window : globalThis);

/* ---- tests node ---------------------------------------------------------- */
if (typeof require !== 'undefined' && require.main === module) {
  var fs = require('fs'), path = require('path');
  var CAT = JSON.parse(fs.readFileSync(path.join(__dirname, 'ds_catalog_v3.json'), 'utf8'));
  var E = require('./bdr_engine.js').makeEngine(CAT);
  var ok = 0, ko = 0;
  function eq(label, got, want) {
    var g = JSON.stringify(got), w = JSON.stringify(want);
    if (g === w) { ok++; }
    else { ko++; console.log('  KO ' + label + '\n     got  ' + g + '\n     want ' + w); }
  }

  // ── 1. la math, contre le CSS REELLEMENT COMPILE PAR SASS ────────────────
  // Fixture extraite de `tb_theme_optimized/static/src/css/biences_product.css`
  // (21 atomes, les quatre regimes). Le moteur n'a pas produit ces valeurs :
  // sass les a produites, a partir des mixins du theme.
  var FIX = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures', 'sass_compile.json'), 'utf8'));
  var nAtoms = 0, ecarts = [];
  Object.keys(FIX).forEach(function (name) {
    var a = E.parseAtom(name);
    if (!a) { ecarts.push(name + ' : absent du catalogue'); return; }
    nAtoms++;
    var sp = E.sizeSpec(a.curve, a.max, a.min);
    var ref = FIX[name];
    if (sp.kind === 'fixed') {
      if (ref['0']['font-size'] !== a.max + 'px') {
        ecarts.push(name + ' fixe : ' + ref['0']['font-size'] + ' vs ' + a.max + 'px');
      }
      return;
    }
    if (sp.kind === 'clamp') {
      var gotFS = E.clampCSS(sp.terms.fs).replace(/,\s*/g, ', ');
      var gotLH = E.clampCSS(sp.terms.lh).replace(/,\s*/g, ', ');
      if (gotFS !== ref['0']['font-size']) ecarts.push(name + ' fs\n     got  ' + gotFS + '\n     sass ' + ref['0']['font-size']);
      if (gotLH !== ref['0']['line-height']) ecarts.push(name + ' lh\n     got  ' + gotLH + '\n     sass ' + ref['0']['line-height']);
      return;
    }
    sp.levels.forEach(function (lv) {
      var r = ref[String(lv.mq)];
      if (!r) { ecarts.push(name + ' @' + lv.mq + ' : palier absent du CSS compile'); return; }
      var gf = E.sassNum(lv.fs) + 'rem', gl = E.sassNum(lv.lh) + 'rem';
      if (gf !== r['font-size']) ecarts.push(name + ' @' + lv.mq + ' fs : ' + gf + ' vs sass ' + r['font-size']);
      if (gl !== r['line-height']) ecarts.push(name + ' @' + lv.mq + ' lh : ' + gl + ' vs sass ' + r['line-height']);
    });
  });
  if (ecarts.length) ecarts.slice(0, 12).forEach(function (e) { console.log('  KO ' + e); });
  eq('math == sass, sur les ' + nAtoms + ' atomes compiles', ecarts.length, 0);

  // TEMOIN NEGATIF : le controle ci-dessus sait-il echouer ? On rejoue la
  // vieille math (celle avec les diviseurs, retiree du DS le 17.08) et on
  // EXIGE qu'elle soit refusee. Sans ce temoin, un comparateur muet et un
  // moteur juste rendent le meme resultat.
  (function () {
    var faux = CAT.curves.cta.fs.map(function (c, i) {
      return i === 0 ? { div: 1.225 * 1.5, k: c.k, mult: c.mult } : c;
    });
    var sauve = CAT.curves.cta.fs;
    CAT.curves.cta.fs = faux;
    var E2 = require('./bdr_engine.js').makeEngine(CAT);
    var lv = E2.ladderLevels('cta', 54, 35);
    var attendu = FIX['s-54-35-cta']['361']['font-size'];
    eq('temoin : une courbe faussee est bien detectee',
       E2.sassNum(lv[1].fs) + 'rem' !== attendu, true);
    CAT.curves.cta.fs = sauve;
  })();

  // ── 2. lecture d'une composition ─────────────────────────────────────────
  var r = E.readClasses(['f-body-bold', 's-16-13', 'm-caps', 'm-wide', 'col-6']);
  eq('lecture : fonte', r.f, 'f-body-bold');
  eq('lecture : taille', r.s, 's-16-13');
  eq('lecture : mods cumules', r.m, ['m-caps', 'm-wide']);
  eq('lecture : hors DS', r.unknown, ['col-6']);
  eq('composition complete', E.missingAxes(r), []);
  eq('taille manquante reperee', E.missingAxes(E.readClasses(['f-body'])), ['s']);

  // ── 3. les crans d'avant (la production en est faite) ────────────────────
  eq('cran -> atomes', E.legacyToAtoms('body-bold-16-13-caps-wide'),
     ['f-body-bold', 's-16-13', 'm-caps', 'm-wide']);
  eq('cran de titre -> rampe cta', E.legacyToAtoms('title-54-35'), ['f-title', 's-54-35-cta']);
  eq('la banniere garde SA rampe', E.legacyToAtoms('title-78-42-banner'), ['f-title', 's-78-42-banner']);
  eq('couleur, pas mod', E.legacyToAtoms('body-14-11-muted'), ['f-body', 's-14-11', 'c-muted']);
  eq('accent -> c-main', E.legacyToAtoms('body-13-10-caps-accent-wide'),
     ['f-body', 's-13-10', 'c-main', 'm-caps', 'm-wide']);
  eq('cran reconnu comme legacy', E.resolve('body-17-14').category, 'legacy');
  eq('atome reconnu comme atome', E.resolve('s-17-14').category, 'atom');
  eq('composant', E.resolve('cta-primary').category, 'component');
  eq('hors DS', E.resolve('col-md-6').category, 'unknown');
  var mig = E.atomsFor(['body-17-14', 'u-quelconque']);
  eq('migration proposee pour un cran pose', mig, ['f-body', 's-17-14']);

  // tous les crans encore definis se traduisent, et vers du connu
  var nonTrad = Object.keys(CAT.legacy).filter(function (n) { return !E.legacyToAtoms(n); });
  eq('0 cran sans traduction', nonTrad, []);
  var viseInconnu = [];
  Object.keys(CAT.legacy).forEach(function (n) {
    E.legacyToAtoms(n).forEach(function (t) { if (!E.parseAtom(t)) viseInconnu.push(n + '->' + t); });
  });
  eq('0 traduction vers un atome inconnu', viseInconnu, []);

  // ── 4. la regle du min, et le builder ────────────────────────────────────
  eq('regle du min sur le texte', E.minDuCran(16, 'text'), 13);
  eq('les titres sont hors regle', E.minDuCran(40, 'cta'), null);
  eq('nom d une taille de texte', E.sizeAtomName(16, 13, 'text'), 's-16-13');
  eq('nom d une taille de titre', E.sizeAtomName(54, 35, 'cta'), 's-54-35-cta');
  eq('taille existante retrouvee', E.findSize(16, 13, 'text').name, 's-16-13');
  eq('taille inexistante', E.findSize(19, 16, 'text'), null);
  eq('SCSS d une taille suivant la regle', E.scssForSize('s-19-16', 19, 16, 'text'),
     '.s-19-16 { @include font-size-text(1.9); }');
  eq('SCSS d une exception ecrit ses deux bornes', E.scssForSize('s-19-17', 19, 17, 'text'),
     '.s-19-17 { @include font-size-text(1.9, 1.7); }');
  eq('SCSS d une rampe cta', E.scssForSize('s-45-30-cta', 45, 30, 'cta'),
     '.s-45-30-cta { @include font-size-cta(4.5, 3); }');

  // ── 5. synthese CSS d une taille neuve ───────────────────────────────────
  var css = E.synthSizeCSS('s-19-16', 19, 16, 'text');
  eq('synth texte : un clamp, pas un escalier', /clamp\(/.test(css) && !/@media/.test(css), true);
  var css2 = E.synthSizeCSS('s-45-30-cta', 45, 30, 'cta');
  eq('synth cta : 7 media-queries', (css2.match(/@media/g) || []).length, 7);
  eq('synth cta : atterrit sur le max', /font-size:4\.5rem/.test(css2), true);

  // ── 5-bis. rejouer un atome la ou il n'existe pas (la production) ────────
  var cssF = E.synthAtomCSS('f-title');
  eq('fonte rejouable : la police y est', /font-family:var\(--font-title\)/.test(cssF), true);
  eq('fonte rejouable : ses enfants aussi', /\.f-title \*\{/.test(cssF), true);
  eq('couleur rejouable', E.synthAtomCSS('c-muted'), '.c-muted{color:var(--light-color);}');
  eq('mod rejouable, enfants compris', E.synthAtomCSS('m-wide'),
     '.m-wide{letter-spacing:0.2em;}.m-wide *{letter-spacing:0.2em;}');
  eq('taille rejouable passe par la math', /clamp\(/.test(E.synthAtomCSS('s-16-13')), true);
  var sansDecl = (CAT.atoms.f.concat(CAT.atoms.c, CAT.atoms.m))
    .filter(function (a) { return !E.synthAtomCSS(a.name); }).map(function (a) { return a.name; });
  eq('0 atome f/c/m irrejouable', sansDecl, []);

  // ── 6. la taille servie a une largeur ────────────────────────────────────
  eq('texte 16-13 a 1920', E.sizeAt('text', 16, 13, 1920), 16);
  eq('texte 16-13 a 361', E.sizeAt('text', 16, 13, 361), 13);
  eq('texte 16-13 sous 361 : le clamp plafonne au min', E.sizeAt('text', 16, 13, 320), 13);
  eq('texte 16-13 a mi-course', E.sizeAt('text', 16, 13, 1140.5), 14.5);
  eq('cta 54-35 a 1920', E.sizeAt('cta', 54, 35, 1920), 54);
  eq('taille fixe', E.sizeAt('fixed', 9, 9, 1440), 9);

  console.log('\n=== moteur BDR : ' + ok + ' OK, ' + ko + ' KO ===');
  process.exit(ko ? 1 : 0);
}
