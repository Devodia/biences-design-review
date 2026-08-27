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
    ap.add_argument("--servi", action="store_true",
                    help="mesure le script SERVI par GitHub, pas la copie locale")
    ap.add_argument("--lecture-seule", action="store_true", dest="lecture",
                    help="ne mesure QUE la lecture du vocabulaire : aucun clic, "
                         "aucun changement de classe. Seul mode autorise hors banc.")
    o = ap.parse_args()
    if "dev.odoo.com" not in o.url and not o.lecture:
        print("!! refus : hors d'un banc dev.odoo.com, seul --lecture-seule est permis")
        return 2

    # Par defaut on mesure le fichier LOCAL. `--servi` mesure celui que GitHub
    # sert reellement : c'est le seul qui prouve ce qu'Eliott recevra, un push
    # pouvant tres bien reussir et servir autre chose.
    if o.servi:
        import urllib.request
        url = ("https://raw.githubusercontent.com/Devodia/biences-design-review"
               "/main/review.standalone.js")
        script = urllib.request.urlopen(url, timeout=30).read().decode("utf-8")
        print("  script mesure : celui SERVI par GitHub (%d octets)" % len(script))
    else:
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

        # ── 🔴 LE CAS REMONTE PAR MANUEL LE 25.08 ────────────────────────
        # Sur la home, le <h3> « Nos offres passagères » porte `s-54-35-cta` et
        # une règle plus spécifique impose sa taille. L'atome ne gagnait pas, il
        # rendait la MEME valeur par coïncidence. Poser `s-30-24-cta` changeait
        # donc la classe sans rien changer à l'écran : l'outil affirmait un
        # changement que la page refusait.
        #
        # Ce test rejoue exactement ce geste. Il demande de faire défiler la page
        # (les carrousels produits se chargent au scroll), ce qui est le prix à
        # payer pour mesurer sur le vrai élément plutôt que sur un témoin fabriqué.
        cas = pg.evaluate("""() => {
          const el = [...document.querySelectorAll('.block-title h3')]
            .find(e => (e.textContent||'').includes('offres passag'));
          return el ? el.getAttribute('class') : null;
        }""")
        if not cas:
            for _ in range(14):
                pg.mouse.wheel(0, 1200)
                pg.wait_for_timeout(350)
            pg.wait_for_timeout(1500)
        force = pg.evaluate("""() => {
          const E = window.BDR_makeEngine(window.BDR_CATALOG);
          const el = [...document.querySelectorAll('.block-title h3')]
            .find(e => (e.textContent||'').includes('offres passag'));
          if (!el) return null;
          const r = E.readClasses((el.getAttribute('class')||'').trim().split(/\\s+/).filter(Boolean));
          if (!r.s) return null;
          const act = E.parseAtom(r.s);
          const cand = E.sizesByCurve(act.curve)
            .filter(a => Math.abs(a.max - act.max) >= 8)
            .sort((a,b) => Math.abs(b.max - act.max) - Math.abs(a.max - act.max))[0];
          if (!cand) return null;
          const avant = parseFloat(getComputedStyle(el).fontSize);
          window.__bdr.applyAtom(el, cand.name);
          return {vise: cand.name, avant: avant,
                  apres: parseFloat(getComputedStyle(el).fontSize),
                  attendu: E.sizeAt(cand.curve, cand.max, cand.min, window.innerWidth)};
        }""")
        if force:
            print("  cascade : %s → %s, %.2f px → %.2f px (le cran vaut %.2f)"
                  % (cas or "?", force["vise"], force["avant"], force["apres"], force["attendu"]))
            check("un atome que la cascade écrase PEINT quand même",
                  abs(force["apres"] - force["attendu"]) < 0.6)
        else:
            print("  (le <h3> du carrousel n'est pas sur cette page : cas non rejoué)")

        # ── 🔴 LE TIROIR PANIER, remonte par Manuel le 25.08 ─────────────
        # « quand je cible plusieurs elements, les modifs s'appliquent pas a
        # toutes les cibles ». Deux mecanismes distincts, tous deux mesures a
        # 0/N avant correction. On ne remplit PAS de panier pour les rejouer :
        # un banc qui clique ecrit, et des temoins fabriques les isolent mieux.
        tiroir = pg.evaluate("""() => {
          const E = window.BDR_makeEngine(window.BDR_CATALOG);
          const res = {};
          const attendu = E.sizeAt('text', 24, 21, window.innerWidth);

          // A. une regle de page en `#id .classe { !important }` : elle pese
          // (1,1,0) et bat toute regle injectee. Seul l'inline passe.
          const z = document.createElement('div');
          z.id = 'bdr-temoin-a';
          for (let i = 0; i < 4; i++) {
            const p = document.createElement('p');
            p.className = 'f-body s-14-11 bdr-t-a';
            p.textContent = 'ligne ' + i;
            z.appendChild(p);
          }
          document.body.appendChild(z);
          const st = document.createElement('style');
          st.textContent = '#bdr-temoin-a .bdr-t-a { font-size: 40px !important; }';
          document.body.appendChild(st);
          const ca = [...z.querySelectorAll('.bdr-t-a')];
          ca.forEach(el => window.__bdr.applyAtom(el, 's-24-21'));
          res.A = ca.filter(el => Math.abs(parseFloat(getComputedStyle(el).fontSize) - attendu) < 0.6).length;
          res.An = ca.length;
          z.remove(); st.remove();

          // B. le composant se re-rend APRES le ciblage : les cibles memorisees
          // deviennent des noeuds detaches, et le compteur ment.
          const z2 = document.createElement('div');
          z2.id = 'bdr-temoin-b';
          for (let i = 0; i < 3; i++) {
            const p = document.createElement('p');
            p.className = 'f-body s-14-11 bdr-t-b';
            p.textContent = 'item ' + i;
            z2.appendChild(p);
          }
          document.body.appendChild(z2);
          window.__bdr.select(z2.firstChild);
          window.__bdr.selectGroup('bdr-t-b');
          res.Bn = window.__bdr.group.length;
          z2.innerHTML = z2.innerHTML;               // le re-rendu
          window.__bdr.commitAtom('s-24-21');
          res.B = [...z2.querySelectorAll('.bdr-t-b')]
            .filter(el => Math.abs(parseFloat(getComputedStyle(el).fontSize) - attendu) < 0.6).length;
          z2.remove();
          window.__bdr.clearGroup();
          return res;
        }""")
        print("  tiroir : règle #id !important %d/%d peintes · après re-rendu %d/%d"
              % (tiroir["A"], tiroir["An"], tiroir["B"], tiroir["Bn"]))
        check("une règle de page en #id !important ne bloque plus le changement",
              tiroir["A"], tiroir["An"])
        check("un composant qui se re-rend ne fait plus perdre les cibles",
              tiroir["B"], tiroir["Bn"])

        # ── la pause doit rendre la page NEUTRE, forçage inline compris ────
        # Garantie de la v0.24. Le forçage écrit en inline : sans instantané du
        # `style`, la pause laisserait des `!important` derrière elle.
        neutre = pg.evaluate("""() => {
          const el = document.createElement('p');
          el.className = 'f-body s-14-11 bdr-t-c';
          el.textContent = 'témoin de pause';
          document.body.appendChild(el);
          const st = document.createElement('style');
          st.textContent = 'p.bdr-t-c.bdr-t-c { font-size: 41px !important; }';
          document.body.appendChild(st);
          const avant = parseFloat(getComputedStyle(el).fontSize);
          window.__bdr.select(el);
          window.__bdr.commitAtom('s-24-21');
          const pendant = parseFloat(getComputedStyle(el).fontSize);
          window.__bdr.toggle();                     // pause
          const enPause = parseFloat(getComputedStyle(el).fontSize);
          const styleReste = el.getAttribute('style') || '';
          window.__bdr.toggle();                     // reprise
          const apres = parseFloat(getComputedStyle(el).fontSize);
          el.remove(); st.remove();
          return {avant, pendant, enPause, apres, styleReste};
        }""")
        print("  pause : %.1f px → %.1f px (changé) → %.1f px (pause) → %.1f px (reprise)"
              % (neutre["avant"], neutre["pendant"], neutre["enPause"], neutre["apres"]))
        check("le changement peint malgré une règle plus forte",
              abs(neutre["pendant"] - neutre["avant"]) > 1)
        check("la pause rend la page à son état d'origine",
              abs(neutre["enPause"] - neutre["avant"]) < 0.6)
        check("la pause ne laisse aucun style inline derrière elle",
              neutre["styleReste"], "")
        check("la reprise restaure le changement",
              abs(neutre["apres"] - neutre["pendant"]) < 0.6)

        # ── 🔴 LES DEUX RETOURS D'ELIOTT DU 25.08 ────────────────────────
        #
        # 1. « sur mon portable, je ne peux pas voir les options en entier
        #    (ajouter une note, exporter…) ». Seul le contenu dynamique
        #    defilait ; la carte de l'element et la barre de verbes n'avaient
        #    ni hauteur max ni retrecissement, et poussaient le pied du panneau
        #    hors de l'ecran des que la hauteur descendait.
        #
        # 2. « quand j'ai ouvert le panier, c'est comme si le panier etait
        #    devant l'outil et je peux pas selectionner le champ de texte ».
        #    `tb_generics/drawer.js` pose un `focusin` en CAPTURE sur
        #    `document` qui ramene le focus dans le tiroir ouvert. Le panneau
        #    n'en etait pas exclu : il recevait bien le clic, mais le CLAVIER
        #    lui etait repris aussitot.
        pg.set_viewport_size({"width": 1512, "height": 823})   # son portable
        pg.wait_for_timeout(400)
        pg.evaluate("""() => {
          const el = document.querySelector('[data-bdr-cible]');
          if (el) window.__bdr.select(el);
        }""")
        pg.wait_for_timeout(500)      # ⚠️ l'ouverture du panneau dure 0,22 s :
                                       # mesurer tout de suite rend une position
                                       # de MI-ANIMATION, pas la position finale.
        petit = pg.evaluate("""() => {
          const ft = document.querySelector('#bdr-root .bdr-ft');
          const exp = ft && ft.querySelector('.bdr-exp');
          if (!exp) return null;
          const rf = ft.getBoundingClientRect(), re = exp.getBoundingClientRect();
          const pt = document.elementFromPoint(re.left + re.width / 2, re.top + re.height / 2);
          const verbes = [...document.querySelectorAll('#bdr-root .bdr-v')];
          const note = verbes.find(b => b.textContent.includes('note'));
          const rn = note ? note.getBoundingClientRect() : null;
          return {
            piedDansEcran: rf.bottom <= innerHeight + 1 && rf.top >= 0,
            exportAtteignable: !!pt && (pt === exp || exp.contains(pt)),
            noteVisible: !!rn && rn.top >= 0 && rn.bottom <= innerHeight + 1,
            h: innerHeight
          };
        }""")
        if petit:
            print("  portable %dpx : pied dans l'écran %s · Exporter atteignable %s · bouton note visible %s"
                  % (petit["h"], petit["piedDansEcran"], petit["exportAtteignable"], petit["noteVisible"]))
            check("sur un portable, le pied du panneau reste dans l'écran", petit["piedDansEcran"])
            check("sur un portable, « Exporter » est atteignable au clic", petit["exportAtteignable"])
            check("sur un portable, « Ajouter une note » reste visible", petit["noteVisible"])

        # le piège à focus d'un tiroir ne doit plus vider le champ de note
        trap = pg.evaluate("""() => {
          // on rejoue EXACTEMENT le piège de tb_generics/drawer.js
          const tiroir = document.createElement('div');
          tiroir.id = 'faux-tiroir';
          tiroir.innerHTML = '<button id="dans-tiroir">x</button>';
          document.body.appendChild(tiroir);
          const filet = function (ev) {
            if (tiroir.contains(ev.target)) return;
            document.getElementById('dans-tiroir').focus();
          };
          document.addEventListener('focusin', filet, true);
          const note = [...document.querySelectorAll('#bdr-root .bdr-v')]
            .find(b => b.textContent.includes('note'));
          if (!note) { tiroir.remove(); return null; }
          note.click();
          const ta = document.getElementById('bdr-note');
          if (!ta) { tiroir.remove(); return null; }
          ta.focus();
          const tenu = document.activeElement === ta;
          ta.value = 'essai de saisie';
          ta.dispatchEvent(new Event('input', {bubbles: true}));
          document.removeEventListener('focusin', filet, true);
          tiroir.remove();
          return {tenu: tenu, valeur: ta.value,
                  actif: document.activeElement ? (document.activeElement.id || document.activeElement.tagName) : null};
        }""")
        if trap:
            print("  tiroir ouvert : le champ de note garde le focus %s (actif : %s)"
                  % (trap["tenu"], trap["actif"]))
            check("le piège à focus d'un tiroir ne vide plus le champ de note", trap["tenu"])
            check("et la saisie arrive bien dans le champ", trap["valeur"], "essai de saisie")
        pg.set_viewport_size({"width": o.largeur, "height": 900})
        pg.wait_for_timeout(300)

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
