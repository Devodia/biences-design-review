# -*- coding: utf-8 -*-
"""Assemble le userscript BDR depuis src/ vers la RACINE du repo.

Mise a jour du script en UNE commande :
    python src/build.py
puis  git commit -am "..."  &&  git push
(le push met a jour le Tampermonkey d'Eliott via @updateURL).

Regenerer le catalogue (uniquement si les ds/*.scss du theme ont change) :
    python src/gen_ds_catalog.py     # necessite le clone Odoo css-refactor

Ordre d'assemblage (execution sequentielle dans un seul contexte navigateur) :
    bdr_catalog.js -> window.BDR_CATALOG
    bdr_engine.js  -> window.BDR_makeEngine   (bloc de tests node retire)
    bdr_ui.js      -> IIFE qui consomme les deux
"""
import os

HERE = os.path.dirname(os.path.abspath(__file__))   # src/
REPO = os.path.dirname(HERE)                          # racine du repo


def read(name):
    with open(os.path.join(HERE, name), encoding="utf-8") as f:
        return f.read()


HEADER = """// ==UserScript==
// @name         Biences Design Review
// @namespace    devodia.biences
// @version      __VER__
// @description  Revue visuelle du design system Biences : remplacer / creer un style (builder famille-tailles-mods) / multi-selection / avant-apres. Rapport JSON pour Claude Code.
// @match        https://*.dev.odoo.com/*
// @match        https://*.biences.ch/*
// @downloadURL  https://raw.githubusercontent.com/Devodia/biences-design-review/main/biences-design-review.user.js
// @updateURL    https://raw.githubusercontent.com/Devodia/biences-design-review/main/biences-design-review.user.js
// @grant        none
// @run-at       document-idle
// ==/UserScript==
"""

catalog = read("bdr_catalog.js").strip()
engine = read("bdr_engine.js")
cut = engine.find("/* ---- tests node")            # retire le harnais de tests node
if cut != -1:
    engine = engine[:cut].rstrip() + "\n"
ui = read("bdr_ui.js").strip()

VERSION = "0.28.0"    # source unique de la version (injectee dans l'entete + le code)
SEP = "\n\n"
userscript = (HEADER + SEP + catalog + SEP + engine + SEP + ui + "\n").replace("__VER__", VERSION).replace("__BDR_VERSION__", VERSION)
standalone = ("/* Biences Design Review v" + VERSION + " — standalone (coller dans la console devtools). */"
              + SEP + catalog + SEP + engine + SEP + ui + "\n").replace("__BDR_VERSION__", VERSION)

with open(os.path.join(REPO, "biences-design-review.user.js"), "w", encoding="utf-8") as f:
    f.write(userscript)
with open(os.path.join(REPO, "review.standalone.js"), "w", encoding="utf-8") as f:
    f.write(standalone)

print("userscript :", len(userscript.splitlines()), "lignes ->", os.path.join(REPO, "biences-design-review.user.js"))
print("standalone :", len(standalone.splitlines()), "lignes ->", os.path.join(REPO, "review.standalone.js"))
