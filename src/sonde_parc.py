# -*- coding: utf-8 -*-
"""Sonde une PAGE SERVIE a une largeur donnee, et rend du JSON.

Sert a deux choses qui n'ont pas la meme nature :

  - VERIFIER L'OUTIL sur des pages qu'il n'a jamais vues (le panneau tient-il,
    un changement d'axe peint-il, la pause rend-elle la page neutre) ;
  - MESURER LE DS lui-meme : combien d'atomes sont DECORATIFS sur cette page,
    c'est-a-dire poses mais battus par une regle plus specifique. C'est la
    famille « appels hors DS » du chantier coherence, vue depuis l'ecran.

⚠️ LES GARDES, et elles ne sont pas decoratives :
  - hors d'un banc `dev.odoo.com`, seul `--lecture-seule` est permis ;
  - aucune page de tunnel ni d'ajout au panier : un banc qui clique ECRIT ;
  - une page a moins de 200 elements est declaree ABSENTE, pas vide : le banc
    a rendu deux fois un 503 « Odoo.sh | Platform Error » pendant le chantier,
    et une mesure a 25 elements ressemble a une regression alors qu'il n'y a
    simplement rien a mesurer.

Lancer :  python sonde_parc.py --page /shop --largeur 1512 --hauteur 823
          python sonde_parc.py --page / --json     # sortie machine
"""
import argparse
import io
import json
import os
import sys

from playwright.sync_api import sync_playwright

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(HERE)
BANC = "https://biences-europe-account-36096602.dev.odoo.com"
PLANCHER_ELEMENTS = 200      # sous ce seuil, la page est absente et non vide

# Le tunnel et tout ce qui ecrit sont hors sonde, quelle que soit la demande.
INTERDIT = ("/shop/cart", "/shop/checkout", "/shop/payment", "/shop/confirmation",
            "/web/login", "/my/", "/shop/address")


def sonder(url, page, largeur, hauteur, lecture, script):
    res = {"page": page, "largeur": largeur, "hauteur": hauteur}
    erreurs = []
    with sync_playwright() as pw:
        nav = pw.chromium.launch(headless=True)
        ctx = nav.new_context(viewport={"width": largeur, "height": hauteur})
        pg = ctx.new_page()
        pg.on("pageerror", lambda e: erreurs.append(str(e)))
        try:
            rep = pg.goto(url + page, wait_until="load", timeout=90000)
            res["http"] = rep.status if rep else None
        except Exception as e:
            res["erreur"] = "navigation : %s" % str(e)[:160]
            nav.close()
            return res
        try:
            pg.click("#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll", timeout=6000)
        except Exception:
            pass
        # les carrousels produits et les blocs bas se chargent au defilement
        for _ in range(8):
            pg.mouse.wheel(0, 1400)
            pg.wait_for_timeout(280)
        pg.mouse.wheel(0, -20000)
        pg.wait_for_timeout(1200)

        res["titre"] = pg.title()[:70]
        res["elements"] = pg.evaluate("document.querySelectorAll('[class]').length")
        if res["elements"] < PLANCHER_ELEMENTS or "Platform Error" in res["titre"]:
            res["erreur"] = ("page ABSENTE (%d elements, titre %r) : banc en erreur, "
                             "pas une regression" % (res["elements"], res["titre"]))
            nav.close()
            return res

        # 🔴 PHOTO AVANT INJECTION. Le site pose lui-meme des `!important`
        # inline (son `<h1>` masque en `position:absolute!important`). Les
        # compter apres coup ferait passer un fait normal pour une fuite de
        # l'outil : on ne compte que ce qui est APPARU.
        pg.evaluate("""() => {
          window.__inlineAvant = new Set();
          document.querySelectorAll('[style]').forEach(e => {
            if (/!important/.test(e.getAttribute('style') || '')) window.__inlineAvant.add(e);
          });
        }""")
        pg.evaluate(script)
        pg.wait_for_timeout(500)
        res["boot_exceptions"] = erreurs[:3]
        res["api"] = pg.evaluate("!!window.__bdr")

        # ── ce que le moteur lit, et ce que le DS y perd ────────────────────
        res["lecture"] = pg.evaluate("""() => {
          const E = window.BDR_makeEngine(window.BDR_CATALOG);
          const st = {ds:0, atomes:0, legacy:0, fonteSansTaille:0, decoratifs:[]};
          document.querySelectorAll('[class]').forEach(el => {
            if (el.closest('#bdr-root')) return;
            const r = E.readClasses((el.getAttribute('class')||'').trim().split(/\\s+/).filter(Boolean));
            if (!r.ds.length) return;
            st.ds++;
            if (r.f || r.s) st.atomes++;
            if (r.legacy.length) st.legacy++;
            if (r.f && !r.s) st.fonteSansTaille++;
            // ATOME DECORATIF : pose, mais la page sert autre chose que ce que
            // son nom annonce. Ce n'est un defaut ni de l'outil ni forcement du
            // DS -- c'est un fait a chiffrer.
            if (r.s && el.offsetParent) {
              const a = E.parseAtom(r.s);
              if (a && a.curve !== 'fixed') {
                const attendu = E.sizeAt(a.curve, a.max, a.min, innerWidth);
                const servi = parseFloat(getComputedStyle(el).fontSize);
                if (isFinite(servi) && Math.abs(servi - attendu) > 0.6 && st.decoratifs.length < 25) {
                  let chemin = el.tagName.toLowerCase();
                  let p = el.parentElement, n = 0;
                  while (p && n < 3) { chemin = p.tagName.toLowerCase()
                    + (p.className && typeof p.className === 'string'
                       ? '.' + p.className.trim().split(/\\s+/)[0] : '')
                    + ' > ' + chemin; p = p.parentElement; n++; }
                  st.decoratifs.push({atome: r.s, attendu: +attendu.toFixed(2),
                                      servi: +servi.toFixed(2), chemin: chemin.slice(0, 120),
                                      texte: (el.textContent||'').trim().slice(0, 40)});
                }
              }
            }
          });
          return st;
        }""")

        # ── ATOME DECORATIF, MESURE PAR L'EFFET ────────────────────────────
        # 🔴 Le detecteur par VALEUR ci-dessus rate le cas le plus trompeur :
        # un atome dont la valeur COINCIDE avec celle qu'impose la page. Le
        # <h3> « Nos offres passageres » portait `s-54-35-cta` et rendait
        # exactement la meme taille — l'atome ne gagnait pas, il etait d'accord.
        # Aucune comparaison de valeurs ne peut le voir.
        # Le seul test qui le voit : RETIRER l'atome et regarder si l'ecran
        # bouge. S'il ne bouge pas, la taille vient d'ailleurs.
        res["decoratifs_par_effet"] = pg.evaluate("""() => {
          const E = window.BDR_makeEngine(window.BDR_CATALOG);
          const vus = [], ech = [];
          document.querySelectorAll('[class]').forEach(el => {
            if (el.closest('#bdr-root') || !el.offsetParent) return;
            const r = E.readClasses((el.getAttribute('class')||'').trim().split(/\\s+/).filter(Boolean));
            if (r.s && (el.textContent||'').trim().length > 2) ech.push([el, r.s]);
          });
          // un echantillon par ATOME et par CONTENEUR : mesurer 400 fois la
          // meme carte de produit ne dit rien de plus que la mesurer une fois
          const deja = new Set();
          let testes = 0;
          for (const paire of ech) {
            const el = paire[0], atome = paire[1];
            const par = el.parentElement
              ? String(el.parentElement.className || '').split(/\\s+/)[0] : '';
            const cle = atome + '|' + par;
            if (deja.has(cle)) continue;
            deja.add(cle);
            if (testes >= 60) break;
            testes++;
            const orig = el.getAttribute('class');
            const avant = parseFloat(getComputedStyle(el).fontSize);
            el.setAttribute('class', orig.split(/\\s+/).filter(c => c !== atome).join(' '));
            const sans = parseFloat(getComputedStyle(el).fontSize);
            el.setAttribute('class', orig);
            if (isFinite(avant) && isFinite(sans) && Math.abs(avant - sans) < 0.3) {
              vus.push({atome: atome, servi: +avant.toFixed(2),
                        conteneur: par.slice(0, 40),
                        texte: (el.textContent||'').trim().slice(0, 40)});
            }
          }
          return {testes: testes, decoratifs: vus.length, exemples: vus.slice(0, 8)};
        }""")

        if lecture:
            res["mode"] = "lecture seule"
            nav.close()
            return res

        # ── l'outil, sur cette page ─────────────────────────────────────────
        pg.evaluate("window.__bdr.toggle()")
        pg.wait_for_timeout(300)
        res["outil"] = pg.evaluate("""() => {
          const E = window.BDR_makeEngine(window.BDR_CATALOG);
          const out = {};
          const el = [...document.querySelectorAll('[class]')].find(e => {
            if (e.closest('#bdr-root') || !e.offsetParent) return false;
            const r = E.readClasses((e.getAttribute('class')||'').trim().split(/\\s+/).filter(Boolean));
            return r.f && r.s && (e.textContent||'').trim().length > 3;
          });
          if (!el) { out.cible = null; return out; }
          window.__bdr.select(el);
          out.cible = el.getAttribute('class');
          const cs0 = getComputedStyle(el);
          const av = {fs: parseFloat(cs0.fontSize), ff: cs0.fontFamily,
                      tt: cs0.textTransform, ls: cs0.letterSpacing};
          const r = E.readClasses(out.cible.trim().split(/\\s+/).filter(Boolean));
          const act = E.parseAtom(r.s);
          const cand = E.sizesByCurve(act.curve)
            .filter(a => Math.abs(a.max - act.max) >= 4)
            .sort((a,b) => Math.abs(b.max - act.max) - Math.abs(a.max - act.max))[0];
          if (cand) {
            window.__bdr.applyAtom(el, cand.name);
            const cs1 = getComputedStyle(el);
            const attendu = E.sizeAt(cand.curve, cand.max, cand.min, innerWidth);
            out.swap = {
              vise: cand.name,
              peint: Math.abs(parseFloat(cs1.fontSize) - attendu) < 0.6,
              fonteIntacte: cs1.fontFamily === av.ff,
              casseIntacte: cs1.textTransform === av.tt,
              // l'interlettrage est en `em` : on compare le RATIO, pas les px
              interlettrageIntact: Math.abs(
                (parseFloat(cs1.letterSpacing) / parseFloat(cs1.fontSize) || 0) -
                (parseFloat(av.ls) / av.fs || 0)) < 0.005
            };
          }
          return out;
        }""")

        # ── geometrie du panneau a cette taille d'ecran ─────────────────────
        pg.wait_for_timeout(500)      # l'ouverture dure 0,22 s : pas de mesure a mi-animation
        res["panneau"] = pg.evaluate("""() => {
          const ft = document.querySelector('#bdr-root .bdr-ft');
          const exp = ft && ft.querySelector('.bdr-exp');
          if (!exp) return {erreur: 'pied introuvable'};
          const rf = ft.getBoundingClientRect(), re = exp.getBoundingClientRect();
          const pt = document.elementFromPoint(re.left + re.width/2, re.top + re.height/2);
          const verbes = [...document.querySelectorAll('#bdr-root .bdr-v')];
          const note = verbes.find(b => b.textContent.includes('note'));
          const rn = note && note.getBoundingClientRect();
          const pan = document.getElementById('bdr-panel').getBoundingClientRect();
          return {
            piedDansEcran: rf.bottom <= innerHeight + 1 && rf.top >= 0,
            exportAtteignable: !!pt && (pt === exp || exp.contains(pt)),
            noteVisible: !!rn && rn.top >= 0 && rn.bottom <= innerHeight + 1,
            panneauDansEcran: pan.left >= -1 && pan.right <= innerWidth + 1,
            largeurPanneau: Math.round(pan.width)
          };
        }""")

        # ── la pause rend-elle la page neutre ? ─────────────────────────────
        res["pause"] = pg.evaluate("""() => {
          const marques = () => document.querySelectorAll('[data-bdr],[data-bdr-sel]').length;
          const avant = marques();
          window.__bdr.toggle();
          const enPause = marques();
          // ⚠️ ON ATTRIBUE. Un `!important` inline peut venir du SITE et non de
          // BDR : le compter sans dire d'ou il vient transforme un fait normal
          // en fausse alerte.
          const inl = [...document.querySelectorAll('[style]')]
            .filter(e => !e.closest('#bdr-root')
                      && /!important/.test(e.getAttribute('style')||'')
                      && !(window.__inlineAvant && window.__inlineAvant.has(e)))
            .map(e => ({tag: e.tagName.toLowerCase(),
                        cls: (e.getAttribute('class')||'').slice(0,50),
                        style: e.getAttribute('style').slice(0,90)}));
          window.__bdr.toggle();
          return {marquesEnRevue: avant, marquesEnPause: enPause,
                  inlineResiduel: inl.length, inlineDetail: inl.slice(0,4)};
        }""")
        res["exceptions"] = erreurs[:5]
        nav.close()
    return res


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--url", default=BANC)
    ap.add_argument("--page", default="/")
    ap.add_argument("--largeur", type=int, default=1440)
    ap.add_argument("--hauteur", type=int, default=900)
    ap.add_argument("--lecture-seule", action="store_true", dest="lecture")
    ap.add_argument("--servi", action="store_true")
    ap.add_argument("--json", action="store_true")
    o = ap.parse_args()

    if "dev.odoo.com" not in o.url and not o.lecture:
        print("!! refus : hors d'un banc dev.odoo.com, seul --lecture-seule est permis")
        return 2
    if any(x in o.page for x in INTERDIT):
        print("!! refus : %r touche une surface qui ECRIT (tunnel, compte, panier)" % o.page)
        return 2

    if o.servi:
        import urllib.request
        script = urllib.request.urlopen(
            "https://raw.githubusercontent.com/Devodia/biences-design-review"
            "/main/review.standalone.js", timeout=30).read().decode("utf-8")
    else:
        script = io.open(os.path.join(REPO, "review.standalone.js"), encoding="utf-8").read()

    res = sonder(o.url, o.page, o.largeur, o.hauteur, o.lecture, script)
    if o.json:
        print(json.dumps(res, ensure_ascii=False))
        return 0

    print("== %s  @ %dx%d" % (res["page"], res["largeur"], res["hauteur"]))
    if res.get("erreur"):
        print("   !! %s" % res["erreur"])
        return 1
    lec = res.get("lecture", {})
    print("   HTTP %s · %d elements · %s" % (res.get("http"), res.get("elements"), res.get("titre")))
    print("   DS %d, dont atomes %d, anciens crans %d, fonte sans taille %d"
          % (lec.get("ds", 0), lec.get("atomes", 0), lec.get("legacy", 0),
             lec.get("fonteSansTaille", 0)))
    deco = lec.get("decoratifs", [])
    print("   atomes ÉCRASÉS (la page sert autre chose que le nom) : %d" % len(deco))
    for d in deco[:6]:
        print("      %-14s annonce %6.2f, sert %6.2f   « %s »"
              % (d["atome"], d["attendu"], d["servi"], d["texte"]))
    dpe = res.get("decoratifs_par_effet") or {}
    if dpe:
        print("   atomes DÉCORATIFS mesurés par l'effet : %d sur %d testés "
              "(les retirer ne change rien à l'écran)"
              % (dpe.get("decoratifs", 0), dpe.get("testes", 0)))
        for d in dpe.get("exemples", [])[:6]:
            print("      %-14s sert %6.2f dans .%-22s « %s »"
                  % (d["atome"], d["servi"], d["conteneur"], d["texte"]))
    if res.get("outil"):
        print("   outil : %s" % json.dumps(res["outil"], ensure_ascii=False)[:300])
    if res.get("panneau"):
        print("   panneau : %s" % json.dumps(res["panneau"], ensure_ascii=False))
    if res.get("pause"):
        print("   pause : %s" % json.dumps(res["pause"], ensure_ascii=False))
    if res.get("exceptions"):
        print("   exceptions JS : %s" % res["exceptions"])
    return 0


if __name__ == "__main__":
    sys.exit(main())
