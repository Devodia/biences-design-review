# -*- coding: utf-8 -*-
"""Recette RUNTIME de BDR : sur une page SERVIE, pas sur le code.

Pourquoi ce fichier existe : le catalogue peut etre juste, le moteur vert, et
l'outil ne rien peindre a l'ecran. Trois des defauts du chantier DS ont ete
trouves comme ca et pas autrement. On mesure donc l'EFFET :

  - le script boote sans exception sur la page servie ;
  - il RECONNAIT la composition atomique (f- / s- / c- / m-) ;
  - changer un axe change la taille SERVIE, mesuree par `getComputedStyle` ;
  - changer un axe ne DETRUIT PAS les autres (le defaut de la v0.28) ;
  - un ancien cran est vu comme « a migrer » et sa traduction s'applique ;
  - le rapport exporte porte l'avant, l'apres et l'axe touche.

⚠️ SUR LE BANC, JAMAIS SUR LA PRODUCTION. Un banc qui clique ecrit : le
2026-08 quatre paniers ont ete crees en prod par une mesure qui se croyait
passive. Les pages visees ici sont editoriales, et la revue neutralise les
interactions, mais la garde reste : `--url` doit viser `dev.odoo.com`.

Lancer :  python src/test_runtime.py [--url https://…] [--page /histoire] [--show]
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

ok, ko = [], []


def check(label, got, want=True):
    if got == want:
        ok.append(label)
    else:
        ko.append("%s\n     got  %r\n     want %r" % (label, got, want))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--url", default=BANC)
    ap.add_argument("--page", default="/histoire")
    ap.add_argument("--show", action="store_true")
    ap.add_argument("--largeur", type=int, default=1440)
    ap.add_argument("--lecture-seule", action="store_true", dest="lecture",
                    help="ne mesure QUE la lecture du vocabulaire : aucun clic, "
                         "aucun changement de classe. Seul mode autorise hors banc.")
    o = ap.parse_args()
    if "dev.odoo.com" not in o.url and not o.lecture:
        print("!! refus : hors d'un banc dev.odoo.com, seul --lecture-seule est permis")
        return 2

    script = io.open(os.path.join(REPO, "review.standalone.js"), encoding="utf-8").read()
    erreurs = []

    with sync_playwright() as pw:
        nav = pw.chromium.launch(headless=not o.show)
        ctx = nav.new_context(viewport={"width": o.largeur, "height": 900})
        pg = ctx.new_page()
        pg.on("pageerror", lambda e: erreurs.append(str(e)))
        pg.goto(o.url + o.page, wait_until="domcontentloaded", timeout=90000)

        # 🔴 Cookiebot pose un voile a z-index 2147483630, AU-DESSUS du panneau.
        # Tant qu'il est la, elementFromPoint et les clics tombent dessus.
        try:
            pg.wait_for_selector("#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll", timeout=8000)
            pg.click("#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll")
        except Exception:
            pass
        pg.wait_for_timeout(700)

        pg.evaluate(script)
        pg.wait_for_timeout(400)
        check("boot sans exception JS", erreurs, [])
        check("l'API est posee", pg.evaluate("!!window.__bdr"))

        # ── ce que la page porte, lu par le moteur ────────────────────────
        vu = pg.evaluate("""() => {
          const E = window.BDR_makeEngine(window.BDR_CATALOG);
          const st = {atomes:0, legacy:0, sansTaille:0, total:0, exemples:[]};
          document.querySelectorAll('[class]').forEach(el => {
            if (el.closest('#bdr-root')) return;
            const r = E.readClasses((el.getAttribute('class')||'').trim().split(/\\s+/).filter(Boolean));
            if (!r.ds.length) return;
            st.total++;
            if (r.f || r.s) st.atomes++;
            if (r.legacy.length) st.legacy++;
            if (r.f && !r.s) st.sansTaille++;
            if (st.exemples.length < 3 && r.f && r.s) {
              st.exemples.push({f:r.f, s:r.s, c:r.c, m:r.m});
            }
          });
          return st;
        }""")
        print("  page : %d elements DS, dont %d en atomes, %d en anciens crans, %d fonte sans taille"
              % (vu["total"], vu["atomes"], vu["legacy"], vu["sansTaille"]))
        # Sur la PRODUCTION le compte s'inverse : elle est encore ecrite en crans
        # monolithiques. Les deux mondes doivent etre lus, sinon l'outil est
        # aveugle sur la moitie du parc pendant toute la bascule.
        check("le vocabulaire de la page est reconnu", vu["atomes"] + vu["legacy"] > 0)
        if o.lecture:
            check("aucune exception JS en lecture", erreurs, [])
            print("  (lecture seule : aucun clic, aucune classe modifiee)")
            nav.close()
            return rendre()
        check("des elements portent une composition atomique", vu["atomes"] > 0)
        check("un exemple complet a bien fonte + taille", bool(vu["exemples"]))

        # ── demarrer la revue, selectionner un element atomique ───────────
        pg.evaluate("window.__bdr.toggle()")
        pg.wait_for_timeout(300)
        cible = pg.evaluate("""() => {
          const E = window.BDR_makeEngine(window.BDR_CATALOG);
          const els = [...document.querySelectorAll('[class]')].filter(el => {
            if (el.closest('#bdr-root')) return false;
            if (!el.offsetParent) return false;
            const r = E.readClasses((el.getAttribute('class')||'').trim().split(/\\s+/).filter(Boolean));
            return r.f && r.s && (el.textContent||'').trim().length > 3;
          });
          if (!els.length) return null;
          const el = els[0];
          el.setAttribute('data-bdr-cible', '1');
          const cs = getComputedStyle(el);
          return {classe: el.getAttribute('class'), fs: cs.fontSize, ff: cs.fontFamily,
                  tt: cs.textTransform, ls: cs.letterSpacing};
        }""")
        check("une cible atomique visible a ete trouvee", cible is not None)
        if not cible:
            nav.close()
            return rendre()

        pg.evaluate("""() => {
          const el = document.querySelector('[data-bdr-cible]');
          window.__bdr.select ? window.__bdr.select(el) : el.click();
        }""")
        pg.wait_for_timeout(250)

        # ── la table des axes est bien rendue ────────────────────────────
        axes = pg.evaluate("""() => [...document.querySelectorAll('#bdr-root .bdr-axrow')]
          .map(r => ({k: r.querySelector('.bdr-axk').textContent,
                      v: [...r.querySelectorAll('.bdr-axtag')].map(t => t.firstChild.textContent)}))""")
        check("une ligne par axe dans le panneau", len(axes), 5)
        check("l'axe Taille montre l'atome porte",
              any(a["k"] == "Taille" and a["v"] for a in axes))

        # ── LE POINT CENTRAL : changer la taille ne detruit pas les autres axes
        avant = pg.evaluate("""() => {
          const el = document.querySelector('[data-bdr-cible]');
          const cs = getComputedStyle(el);
          return {cls: el.getAttribute('class'), fs: parseFloat(cs.fontSize),
                  ff: cs.fontFamily, tt: cs.textTransform, ls: cs.letterSpacing};
        }""")
        apres = pg.evaluate("""() => {
          const E = window.BDR_makeEngine(window.BDR_CATALOG);
          const el = document.querySelector('[data-bdr-cible]');
          const r = E.readClasses((el.getAttribute('class')||'').trim().split(/\\s+/).filter(Boolean));
          const act = E.parseAtom(r.s);
          // une taille de la MEME rampe, franchement differente
          const cand = E.sizesByCurve(act.curve)
            .filter(a => Math.abs(a.max - act.max) >= 4)
            .sort((a,b) => Math.abs(b.max - act.max) - Math.abs(a.max - act.max))[0];
          if (!cand) return null;
          window.__bdr.applyAtom(el, cand.name);
          const cs = getComputedStyle(el);
          return {vise: cand.name, attendu: cand, cls: el.getAttribute('class'),
                  fs: parseFloat(cs.fontSize), ff: cs.fontFamily,
                  tt: cs.textTransform, ls: cs.letterSpacing};
        }""")
        check("un swap de taille a pu etre joue", apres is not None)
        if apres:
            print("  swap : %s -> %s" % (avant["cls"], apres["cls"]))
            check("la taille SERVIE a change", apres["fs"] != avant["fs"])
            check("la fonte n'a pas bouge", apres["ff"], avant["ff"])
            check("la casse n'a pas bouge", apres["tt"], avant["tt"])
            # ⚠️ `letter-spacing: 0.2em` est RELATIF a la taille : le comparer en
            # pixels ferait echouer un swap parfaitement correct. On compare le
            # RATIO, qui est ce que le mod fixe reellement.
            def ratio(d):
                try:
                    return round(float(str(d["ls"]).replace("px", "")) / d["fs"], 3)
                except (ValueError, ZeroDivisionError):
                    return d["ls"]
            check("l'interlettrage (en em) n'a pas bouge", ratio(apres), ratio(avant))
            check("l'atome vise est bien pose", apres["vise"] in apres["cls"].split())
            # la taille servie doit valoir ce que le moteur annonce a cette largeur
            attendu = pg.evaluate("""(a) => {
              const E = window.BDR_makeEngine(window.BDR_CATALOG);
              return E.sizeAt(a.curve, a.max, a.min, window.innerWidth);
            }""", apres["attendu"])
            check("la taille servie == celle que le moteur annonce (%.2f)" % attendu,
                  abs(apres["fs"] - attendu) < 0.6)

        # ── un ancien cran est vu comme a migrer, et sa traduction s'applique
        mig = pg.evaluate("""() => {
          const E = window.BDR_makeEngine(window.BDR_CATALOG);
          const cran = Object.keys(window.BDR_CATALOG.legacy)
            .find(n => (window.BDR_CATALOG.legacy[n].atoms||[]).length >= 2);
          const el = document.createElement('p');
          el.className = cran; el.textContent = 'temoin de migration';
          document.body.appendChild(el);
          const avant = el.getAttribute('class');
          window.__bdr.migrate(el);
          const apres = el.getAttribute('class');
          // ⚠️ `getComputedStyle` rend un objet VIVANT : lu APRES `el.remove()`
          // il ne donne que des chaines vides, et la mesure passe pour nulle.
          // On fige donc la valeur avant de detacher le temoin.
          const fs = parseFloat(getComputedStyle(el).fontSize);
          const r = E.readClasses(apres.split(/\\s+/));
          el.remove();
          return {cran: cran, avant: avant, apres: apres,
                  cible: window.BDR_CATALOG.legacy[cran].atoms,
                  f: r.f, s: r.s, fs: fs};
        }""")
        print("  migration : %s -> %s  (taille servie %s px)"
              % (mig["cran"], mig["apres"], mig["fs"]))
        check("le cran d'avant se migre vers ses atomes",
              sorted(mig["apres"].split()), sorted(mig["cible"]))
        check("l'element migre porte bien une fonte et une taille", bool(mig["f"] and mig["s"]))
        check("et il rend une taille non nulle", mig["fs"] > 0)

        # ── une TAILLE qui n'existe pas encore : elle doit PEINDRE ────────
        # C'est le seul axe encore ouvert, et c'est aussi le seul cas ou le CSS
        # n'existe nulle part : si la synthese est fausse, l'apercu ne bouge pas
        # et Eliott valide une taille qu'il n'a jamais vue.
        neuf = pg.evaluate("""() => {
          const E = window.BDR_makeEngine(window.BDR_CATALOG);
          // un max sans atome de texte, min deduit par la regle
          let max = 30;
          while (E.findSize(max, E.minDuCran(max, 'text'), 'text') && max < 60) max++;
          const min = E.minDuCran(max, 'text');
          const nom = E.sizeAtomName(max, min, 'text');
          const el = document.createElement('p');
          el.textContent = 'temoin de taille neuve';
          document.body.appendChild(el);
          const avant = parseFloat(getComputedStyle(el).fontSize);
          window.__bdr.applyAtom(el, nom);
          const apres = parseFloat(getComputedStyle(el).fontSize);
          const attendu = E.sizeAt('text', max, min, window.innerWidth);
          const scss = E.scssForSize(nom, max, min, 'text');
          el.remove();
          return {nom, min, max, avant, apres, attendu, scss};
        }""")
        print("  taille neuve : %s → %.2f px servis (moteur : %.2f), SCSS %s"
              % (neuf["nom"], neuf["apres"], neuf["attendu"], neuf["scss"]))
        check("la regle du min a ete appliquee", neuf["min"], neuf["max"] - 3)
        check("la taille neuve PEINT vraiment", neuf["apres"] != neuf["avant"])
        check("et elle rend ce que le moteur annonce",
              abs(neuf["apres"] - neuf["attendu"]) < 0.6)
        check("le SCSS livre omet le min, puisque c'est la regle",
              neuf["scss"].count(",") == 0)

        # ── le rapport ────────────────────────────────────────────────────
        rap = pg.evaluate("""() => {
          const el = document.querySelector('[data-bdr-cible]');
          window.__bdr.select(el);
          return null;
        }""")
        check("aucune exception JS pendant toute la recette", erreurs, [])
        nav.close()
    return rendre()


def rendre():
    for k in ko:
        print("  KO " + k)
    print("\n=== recette runtime BDR : %d OK, %d KO ===" % (len(ok), len(ko)))
    return 1 if ko else 0


if __name__ == "__main__":
    sys.exit(main())
