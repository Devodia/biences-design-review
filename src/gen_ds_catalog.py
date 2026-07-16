# -*- coding: utf-8 -*-
"""Genere le catalogue DS nouvelle nomenclature (css-refactor) pour l'outil BDR.

SOURCE UNIQUE = les ds/*.scss du chantier css-refactor. Le catalogue est
DERIVE du SCSS, plus de liste canonique a la main :
  - CANON / ROLES / UTILS : AUTO-SCANNES depuis ds/_type_styles.scss + ds/_aliases.scss
    (tout ajout d'une classe canonique dans _type_styles.scss apparait
     automatiquement dans l'outil au prochain gen -> plus de drift).
  - COMPONENTS (widgets opaques, avec regroupement UI) : liste hand-curated,
    mais DRIFT-CHECKEE contre le scan (un composant retire/renomme du DS = erreur ;
    un composant present dans le DS mais non regroupe = groupe "Autres" + avertissement).
  - FAMILIES / MODS : grammaire stable, a la main.
  - ALIASES (anciens noms) : reutilises VERBATIM depuis migrate_db_classes.MAPPING.

Regle de classification d'un selecteur top-level des ds/*.scss (hors anciens noms
= cles du MAPPING) :
  - se decompose ({famille}-{max}-{min}[-mods]) -> CANON
  - commence par u-                             -> UTIL
  - groupe avec un canonique (ex '.body-14-12-caps, .product-name') -> ROLE
  - sinon                                       -> COMPONENT (widget opaque)

Lancer : PYTHONIOENCODING=utf-8 python gen_ds_catalog.py
"""
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "ds_catalog_v2.json")
# SoT du DS (clone css-refactor) : SCSS canoniques + alias + table de migration
DS_DIR = r"C:\Users\msanchez\Documents\odoo\github\css-refactor\biences\tb_theme_optimized\static\src\sass\ds"
MAP_DIR = r"C:\Users\msanchez\Documents\odoo\github\css-refactor\biences\docs\css-refactor\scripts"
SCAN_FILES = ["_type_styles.scss", "_aliases.scss"]

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

# Selecteurs "hors vocabulaire DS" a ignorer (neutralisations Bootstrap, etc.)
EXCLUDE = {"text-muted"}

# ── Composants opaques (widgets nommes, non decomposables) ───────────────────
# SEULE partie hand-curated : le REGROUPEMENT UI (les noms sont drift-checkes
# contre le DS ci-dessous). Ajouter ici le groupe d'un nouveau composant du DS.
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
ALIAS_KEYS = set(ALIASES.keys())


# ── Scan des ds/*.scss : groupes de classes des regles TOP-LEVEL ────────────
def _strip_comments(txt):
    txt = re.sub(r"/\*.*?\*/", "", txt, flags=re.S)   # blocs /* */
    txt = re.sub(r"//[^\n]*", "", txt)                 # ligne //
    return txt


def _classes_in_header(header):
    """Classes sujettes d'un header de regle (une par selecteur separe par virgule)."""
    header = header.strip()
    if not header or header[0] in "@%&":
        return []
    out = []
    for part in header.split(","):
        m = re.search(r"\.([a-z][\w-]*)", part)
        if m:
            out.append(m.group(1))
    return out


def scan_ds_groups():
    """Liste des groupes de classes (une entree par regle top-level des ds/*.scss)."""
    groups = []
    for fn in SCAN_FILES:
        path = os.path.join(DS_DIR, fn)
        try:
            txt = _strip_comments(open(path, encoding="utf-8").read())
        except FileNotFoundError:
            print("!! ds SCSS introuvable:", path)
            continue
        depth, header = 0, ""
        for ch in txt:
            if ch == "{":
                if depth == 0:
                    cls = _classes_in_header(header)
                    if cls:
                        groups.append(cls)
                    header = ""
                depth += 1
            elif ch == "}":
                if depth > 0:
                    depth -= 1
                if depth == 0:
                    header = ""
            elif depth == 0:
                header += ch
    return groups


# ── Derivation CANON / ROLES / UTILS depuis le scan ─────────────────────────
canon_set, utils_set, roles = set(), set(), {}
comp_scanned = set()

for grp in scan_ds_groups():
    members = [c for c in grp if c not in ALIAS_KEYS and c not in EXCLUDE]
    canon_in_grp = [c for c in members if parse_name(c)]
    for c in members:
        if parse_name(c):
            canon_set.add(c)
        elif c.startswith("u-"):
            utils_set.add(c)
        elif canon_in_grp:
            roles[c] = canon_in_grp[0]        # role -> canonique du meme groupe
        else:
            comp_scanned.add(c)               # widget opaque

CANON = sorted(canon_set)
UTILS = sorted(utils_set)

# ── Validation ──────────────────────────────────────────────────────────────
errors, warnings = [], []
comp_listed = [c for g in COMPONENTS.values() for c in g]
known = set(CANON) | set(roles) | set(comp_listed) | set(UTILS)

# 0. drift COMPONENTS <-> DS
missing_in_ds = set(comp_listed) - comp_scanned
if missing_in_ds:
    errors.append("composant(s) liste(s) absent(s) du DS (retire/renomme ?): %s" % sorted(missing_in_ds))
unlisted = comp_scanned - set(comp_listed)
if unlisted:
    warnings.append("composant(s) du DS non regroupe(s) -> groupe 'Autres' : %s" % sorted(unlisted))
    COMPONENTS = dict(COMPONENTS)
    COMPONENTS["Autres"] = sorted(unlisted)
    comp_listed = [c for g in COMPONENTS.values() for c in g]
    known |= set(unlisted)

# 1. disjonction
comp_flat = comp_listed
for a, b, na, nb in [
    (set(CANON), set(roles), "CANON", "ROLES"),
    (set(CANON), set(comp_flat), "CANON", "COMPONENTS"),
    (set(CANON), set(UTILS), "CANON", "UTILS"),
    (set(roles), set(comp_flat), "ROLES", "COMPONENTS"),
    (set(roles), set(UTILS), "ROLES", "UTILS"),
    (set(comp_flat), set(UTILS), "COMPONENTS", "UTILS"),
]:
    inter = a & b
    if inter:
        errors.append("chevauchement %s/%s: %s" % (na, nb, sorted(inter)))

# 2. chaque canonique se decompose (garanti par construction, verif defensive)
for n in CANON:
    if parse_name(n) is None:
        errors.append("canonique non decomposable: %s" % n)

# 3. roles pointent un canonique
for r, tgt in roles.items():
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
    "_note": "Genere par gen_ds_catalog.py — SoT = ds/*.scss (css-refactor), auto-scan. Ne pas editer a la main.",
    "nomenclature": "{famille}-{max}-{min}[-mods]  (1rem=10px)",
    "families": FAMILIES,
    "mods": MODS,
    "mod_order": MOD_ORDER,
    "breakpoints": [361, 510, 768, 1024, 1366, 1600, 1920],
    "canon": CANON,
    "roles": dict(sorted(roles.items())),
    "components": COMPONENTS,
    "utils": UTILS,
    "aliases": dict(sorted(ALIASES.items())),
}

print("=== Catalogue DS v2 (auto-scan ds/*.scss) ===")
print("familles   :", len(FAMILIES))
print("mods       :", len(MODS))
print("canoniques :", len(CANON), "(scannees)")
print("roles      :", len(roles), "(scannes)")
print("composants :", len(comp_flat), "en", len(COMPONENTS), "groupes")
print("utils      :", len(UTILS), "(scannes)")
print("alias      :", len(ALIASES))
if warnings:
    print()
    for w in warnings:
        print("  (!) ", w)
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
    f.write("/* Genere par gen_ds_catalog.py — SoT = ds/*.scss (css-refactor), auto-scan. Ne pas editer a la main. */\n")
    f.write("window.BDR_CATALOG = ")
    json.dump(catalog, f, ensure_ascii=False, indent=2)
    f.write(";\n")
print("ecrit aussi     ", JS_OUT)
