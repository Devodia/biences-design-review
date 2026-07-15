# -*- coding: utf-8 -*-
"""Genere le catalogue DS nouvelle nomenclature (css-refactor) pour l'outil BDR.

Assemble familles + modificateurs (a la main, petite grammaire stable) avec les
noms canoniques / roles / composants / utilitaires (lus de mon depouillement des
ds/*.scss) et la table d'alias RETRO-COMPAT reutilisee VERBATIM depuis
migrate_db_classes.MAPPING (deja validee sur le chantier). Puis VALIDE :
  - chaque canonique se decompose ({famille}-{max}-{min}[-mods], mods connus)
  - chaque role pointe un canonique
  - chaque cible d'alias (multi-tokens possible) existe dans une categorie
  - categories disjointes
et emet ds_catalog_v2.json.

Lancer : PYTHONIOENCODING=utf-8 python gen_ds_catalog.py
"""
import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "ds_catalog_v2.json")
# table d'alias validee du chantier css-refactor
MAP_DIR = r"C:\Users\msanchez\Documents\odoo\github\css-refactor\biences\docs\css-refactor\scripts"

# ── Grammaire (stable, saisie a la main) ────────────────────────────────────
# curve = mixin de taille par defaut pour la SYNTHESE d'un nouveau style
# (title/title-it -> font-size-cta majoritaire ; body* -> font-size-text).
FAMILIES = [
    {"key": "title",     "font": "--font-title",         "label": "Titre",          "curve": "cta"},
    {"key": "title-it",  "font": "--font-title-italic",  "label": "Titre italique", "curve": "cta"},
    {"key": "body",      "font": "--font-text",          "label": "Texte",          "curve": "text"},
    {"key": "body-med",  "font": "--font-text-medium",   "label": "Texte medium",   "curve": "text"},
    {"key": "body-bold", "font": "--font-text-bold",     "label": "Texte gras",     "curve": "text"},
]

# kind = comment le synthetiser en CSS a runtime cote JS
MODS = [
    {"key": "caps",   "label": "Capitales",           "kind": "caps"},
    {"key": "muted",  "label": "Atténué",             "kind": "muted"},
    {"key": "ondark", "label": "Sur fond foncé",      "kind": "ondark"},
    {"key": "wide",   "label": "Interlettrage large", "kind": "wide"},
    {"key": "accent", "label": "Couleur accent",      "kind": "accent"},
]
MOD_ORDER = ["caps", "muted", "ondark", "accent", "wide"]

UTILS = [
    "u-accent", "u-accent-hover", "u-accent-hover-soft",
    "u-caps", "u-caps-none", "u-strike",
]

# ── Noms canoniques typographiques (se decomposent) ─────────────────────────
CANON = [
    "body-17-14", "body-14-12-muted", "body-bold-16-14", "body-14-12-caps",
    "body-24-17-caps", "body-14-11", "body-12-9-muted", "body-bold-18-14",
    "title-30-24", "title-40-35", "title-it-40-33", "title-54-35",
    "title-it-54-35", "title-it-35-26", "title-78-42", "title-54-31",
    "body-bold-13-10-caps-wide", "body-13-10-caps-wide",
    "body-bold-15-12-caps-ondark-wide", "body-13-10-wide",
    "body-med-16-14-caps-wide", "body-bold-16-14-caps-wide",
    "body-bold-18-14-caps-wide", "body-bold-16-12-caps-wide",
    "body-16-12-caps-wide", "body-med-24-14-caps-wide", "body-18-12-caps-wide",
    "body-med-16-12-caps-wide", "body-12-9-caps-wide", "body-bold-9-ondark",
    "body-med-10-caps-ondark-wide", "body-med-12-9-caps-wide",
    "body-17-14-caps-wide", "body-15-12", "body-14-11-ondark", "body-16-12",
    "body-14-12", "body-bold-14-11-caps-wide", "body-12-9-caps-muted-wide",
    "body-17-15", "body-13-10-caps-accent-wide",
]

# ── Roles semantiques (alias pur -> canonique) ──────────────────────────────
ROLES = {
    "product-name":  "body-14-12-caps",
    "price-discount": "body-14-11",
    "price-base":    "body-12-9-caps-wide",
    "price-strike":  "body-14-11-ondark",
    "eyebrow":       "body-18-12-caps-wide",
    "eyebrow-sm":    "body-bold-13-10-caps-wide",
    "link-accent":   "body-13-10-caps-accent-wide",
}

# ── Composants opaques (widgets nommes, non decomposables) ───────────────────
# groupes pour l'UI (comme l'ancien catalogue), + chrome/interactions.
COMPONENTS = {
    "Boutons (CTA)": ["cta-primary", "cta-secondary", "cta-accent", "cta-outline", "cta-plain"],
    "Panier": ["add-to-cart-link", "add-to-cart-pill"],
    "Prix (chrome)": ["price-fake-discount", "price-discount-pill"],
    "Disponibilite": ["unavailable-cta", "unavailable-cta-compact"],
    "Menu / navigation": [
        "menu-link", "menu-link-top", "menu-link-bottom", "menu-link-hover",
        "menu-link-static", "menu-link-sub", "menu-link-mobile", "menu-link-lang",
        "menu-search-input",
    ],
    "Footer": ["footer-link"],
    "Titres speciaux": ["title-78-42-banner"],
}

# ── parseName (miroir de la version JS) ─────────────────────────────────────
MOD_KEYS = {m["key"] for m in MODS}
FAM_KEYS = sorted([f["key"] for f in FAMILIES], key=len, reverse=True)


def parse_name(name):
    for fam in FAM_KEYS:
        if name == fam or name.startswith(fam + "-"):
            rest = name[len(fam):].lstrip("-")
            toks = rest.split("-") if rest else []
            nums, i = [], 0
            while i < len(toks) and toks[i].isdigit():
                nums.append(int(toks[i])); i += 1
            if not nums:
                continue
            mod_toks = toks[i:]
            if any(m not in MOD_KEYS for m in mod_toks):
                return None
            mx = nums[0]
            mn = nums[1] if len(nums) > 1 else nums[0]
            return {"family": fam, "max": mx, "min": mn, "mods": mod_toks}
    return None


# ── Alias retro-compat (reutilises depuis le chantier) ──────────────────────
sys.path.insert(0, MAP_DIR)
try:
    from migrate_db_classes import MAPPING as ALIASES  # noqa: E402
except Exception as e:
    print("!! impossible d'importer MAPPING:", e)
    ALIASES = {}

# ── Validation ──────────────────────────────────────────────────────────────
errors = []
comp_flat = [c for g in COMPONENTS.values() for c in g]
known = set(CANON) | set(ROLES) | set(comp_flat) | set(UTILS)

# 1. disjonction
for a, b, na, nb in [
    (set(CANON), set(ROLES), "CANON", "ROLES"),
    (set(CANON), set(comp_flat), "CANON", "COMPONENTS"),
    (set(CANON), set(UTILS), "CANON", "UTILS"),
    (set(ROLES), set(comp_flat), "ROLES", "COMPONENTS"),
    (set(ROLES), set(UTILS), "ROLES", "UTILS"),
    (set(comp_flat), set(UTILS), "COMPONENTS", "UTILS"),
]:
    inter = a & b
    if inter:
        errors.append("chevauchement %s/%s: %s" % (na, nb, sorted(inter)))

# 2. chaque canonique se decompose
for n in CANON:
    if parse_name(n) is None:
        errors.append("canonique non decomposable: %s" % n)

# 3. roles pointent un canonique
for r, tgt in ROLES.items():
    if tgt not in CANON:
        errors.append("role %s -> cible inconnue %s" % (r, tgt))

# 4. cibles d'alias resolues (multi-tokens possibles)
alias_unresolved = []
for old, tgt in ALIASES.items():
    for tok in str(tgt).split():
        if tok not in known:
            alias_unresolved.append("%s -> %s (token %s)" % (old, tgt, tok))
if alias_unresolved:
    errors.append("alias non resolus:\n    " + "\n    ".join(alias_unresolved))

# ── Emission ────────────────────────────────────────────────────────────────
catalog = {
    "_note": "Genere par gen_ds_catalog.py — SoT = ds/*.scss (css-refactor). Ne pas editer a la main.",
    "nomenclature": "{famille}-{max}-{min}[-mods]  (1rem=10px)",
    "families": FAMILIES,
    "mods": MODS,
    "mod_order": MOD_ORDER,
    "breakpoints": [361, 510, 768, 1024, 1366, 1600, 1920],
    "canon": sorted(CANON),
    "roles": ROLES,
    "components": COMPONENTS,
    "utils": UTILS,
    "aliases": dict(sorted(ALIASES.items())),
}

print("=== Catalogue DS v2 (nouvelle nomenclature) ===")
print("familles   :", len(FAMILIES))
print("mods       :", len(MODS))
print("canoniques :", len(CANON))
print("roles      :", len(ROLES))
print("composants :", len(comp_flat), "en", len(COMPONENTS), "groupes")
print("utils      :", len(UTILS))
print("alias      :", len(ALIASES))
print()

if errors:
    print("!! VALIDATION ECHOUEE (%d) :" % len(errors))
    for e in errors:
        print("  -", e)
    sys.exit(1)

with open(OUT, "w", encoding="utf-8") as f:
    json.dump(catalog, f, ensure_ascii=False, indent=2)
print("VALIDATION OK — ecrit", OUT)

# fragment JS embarquable dans le userscript (objet litteral)
JS_OUT = os.path.join(HERE, "bdr_catalog.js")
with open(JS_OUT, "w", encoding="utf-8") as f:
    f.write("/* Genere par gen_ds_catalog.py — SoT = ds/*.scss (css-refactor). Ne pas editer a la main. */\n")
    f.write("window.BDR_CATALOG = ")
    json.dump(catalog, f, ensure_ascii=False, indent=2)
    f.write(";\n")
print("ecrit aussi     ", JS_OUT)

# apercu decomposition de quelques canoniques (controle visuel)
print("\napercu decomposition :")
for n in ["body-17-14", "body-bold-15-12-caps-ondark-wide", "title-it-54-35",
          "body-med-10-caps-ondark-wide", "body-bold-9-ondark", "title-54-31"]:
    print("  %-34s -> %s" % (n, parse_name(n)))
