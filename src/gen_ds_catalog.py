# -*- coding: utf-8 -*-
"""Genere le catalogue DS ATOMIQUE (catalogue v3) pour l'outil BDR.

SOURCE UNIQUE = les `ds/*.scss` du theme, branche `europe-account`. Rien n'est
recopie a la main : tout ce qui compose le vocabulaire est SCANNE.

  Le DS s'ecrit desormais par COMPOSITION (decision Manuel du 23.08.2026,
  `cdc/ds-coherence/PLAN-DECOMPOSITION.md`) :

      body-bold-16-13-caps-wide  ->  f-body-bold s-16-13 m-caps m-wide
      title-54-35                ->  f-title s-54-35-cta

  cinq axes, un prefixe par nature :
      f-  la fonte          s-  la taille (rampe comprise dans le nom)
      c-  la couleur        m-  le mod (casse, interlettrage, barre)
      h-  l'etat de survol

CE QUE CE FICHIER PRODUIT, et pourquoi chaque piece existe :

  - `atoms`      : les cinq axes, scannes depuis `ds/_atomes.scss` (+ les mods
                   doubles qui vivent dans `_type_styles.scss`). Un atome de
                   taille porte ses bornes ET sa rampe, lues dans son
                   `@include font-size-*`.
  - `curves`     : les coefficients des quatre mixins, EXTRAITS de
                   `abstractions/_fonts_mixins.scss`. Le moteur en a besoin pour
                   synthetiser une taille qui n'existe pas encore. Les recopier
                   ici a la main serait un miroir de plus a maintenir : les
                   diviseurs de ces mixins ont ete retires le 17.08.2026 et le
                   moteur de BDR les appliquait encore un mois plus tard.
  - `legacy`     : les crans monolithiques encore DEFINIS dans `_type_styles.scss`,
                   avec leur traduction en atomes. Ils ne sont presque plus poses
                   sur `europe-account` mais la PRODUCTION est encore entierement
                   ecrite avec eux : sans cette table, l'outil ne sait plus rien
                   lire sur biences.ch.
  - `components` : les widgets opaques (nommes par leur role, non decomposables),
                   groupes PAR FICHIER. Le fichier EST le regroupement depuis que
                   le DS a eclate en `_components` / `_stepper` / `_review_inputs`
                   / `_spinner` / `_pulse` : plus de liste a tenir a la main, donc
                   plus de drift a controler.
  - `aliases`    : anciens noms, repris VERBATIM de `migrate_db_classes.MAPPING`.

LA REGLE DU MIN (decision Manuel du 22.08.2026) : pour le TEXTE, `min = max - 3`.
Les titres en sont hors, leurs mins sont ecrits a l'appel. Elle est portee ici
par `min_rule` et le builder de BDR doit l'appliquer au lieu de demander un min.

Lancer :  python gen_ds_catalog.py [--ds <dossier sass>] [--quiet]
"""
import argparse
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "ds_catalog_v3.json")
JS_OUT = os.path.join(HERE, "bdr_catalog.js")

# SoT du DS. `europe-account` est la branche ou le vocabulaire vit : la prod est
# encore au vocabulaire d'avant, et c'est ce que la table `legacy` couvre.
DS_CLONES = [
    r"C:\Users\Manu\Documents\odoo\github\europe-account",
    r"C:\Users\Manu\Documents\odoo\odoo-17-3\biences-multi",
]
SASS_REL = os.path.join("tb_theme_optimized", "static", "src", "sass")
MAP_REL = os.path.join("docs", "css-refactor", "scripts")
# la table cran -> atomes produite par le chantier de decomposition ; reprise
# telle quelle plutot que rederivee (meme doctrine que MAPPING).
ATOMES_JSON = r"C:\Users\Manu\Documents\claude\cdc\ds-coherence\donnees\atomes.json"

# ── Grammaire des axes (stable, saisie a la main) ────────────────────────────
AXES = [
    {"key": "f", "label": "Fonte",   "required": True,  "multiple": False},
    {"key": "s", "label": "Taille",  "required": True,  "multiple": False},
    {"key": "c", "label": "Couleur", "required": False, "multiple": False},
    {"key": "m", "label": "Mod",     "required": False, "multiple": True},
    {"key": "h", "label": "Survol",  "required": False, "multiple": False},
]

# Libelles francais des atomes. Seule partie ecrite a la main, et elle est
# DRIFT-CHECKEE : un atome du DS sans libelle devient un avertissement, un
# libelle sans atome une erreur.
LABELS = {
    "f-body": "Texte", "f-body-bold": "Texte gras", "f-body-med": "Texte medium",
    "f-title": "Titre", "f-title-it": "Titre italique",
    "c-default": "Couleur par défaut", "c-main": "Couleur principale",
    "c-important": "Couleur d'accent", "c-muted": "Atténué",
    "c-ondark": "Sur fond foncé", "c-error": "Erreur",
    "c-warning": "Avertissement", "c-success": "Succès",
    "m-caps": "Capitales", "m-caps-none": "Casse annulée",
    "m-wide": "Interlettrage large", "m-strike": "Barré",
    "m-tight": "Interligne serré", "m-tight-more": "Interligne très serré",
    "m-loose": "Interligne aéré", "m-loose-more": "Interligne très aéré",
    "h-color-main": "Survol : couleur principale",
    "h-color-important": "Survol : couleur d'accent",
}

# Libelles de groupe des composants, par fichier source.
FILE_GROUPS = {
    "_components.scss": "Composants",
    "_stepper.scss": "Tunnel — étapes",
    "_spinner.scss": "Chargement",
    "_review_inputs.scss": "Formulaire d'avis",
    "_pulse.scss": "Animation",
    "_ghost_repairs.scss": "Fantômes (réparations)",
    "_bootstrap_neutralisation.scss": "Bootstrap neutralisé",
    "_type_styles.scss": "Composants (socle)",
    "_aliases.scss": "Anciens noms",
    "_atomes.scss": "Atomes",
}

# Selecteurs hors vocabulaire DS : ils sont dans les fichiers mais ne sont pas
# un nom que l'on pose (neutralisations Bootstrap, etats structurels).
EXCLUDE = {"text-muted", "text-uppercase", "-loading", "-done", "-stacked", "-animate"}

CURVE_SUFFIX = {"cta": "cta", "title": "title", "banner": "banner"}


# ── Lecture SCSS ────────────────────────────────────────────────────────────
def strip_comments(txt):
    txt = re.sub(r"/\*.*?\*/", "", txt, flags=re.S)
    txt = re.sub(r"//[^\n]*", "", txt)
    return txt


def top_level_rules(txt):
    """Rend [(header, corps)] pour chaque regle de profondeur 0."""
    out, depth, header, body, start = [], 0, "", "", 0
    i = 0
    while i < len(txt):
        ch = txt[i]
        if ch == "{":
            if depth == 0:
                start = i + 1
            depth += 1
        elif ch == "}":
            depth -= 1
            if depth == 0:
                out.append((header.strip(), txt[start:i]))
                header = ""
        elif depth == 0:
            header += ch
        i += 1
    return out


def classes_of(header):
    """Noms de classe sujets d'un header (une par selecteur separe par virgule).

    `.m-loose.m-loose` -> `m-loose` : le doublement est un poids de specificite,
    pas un nom. `.checkout_recap_line.-stacked` -> `checkout_recap_line`.
    """
    header = header.strip()
    if not header or header[0] in "@%&":
        return []
    out = []
    for part in header.split(","):
        part = part.strip()
        if not part or part[0] != ".":
            continue
        m = re.match(r"\.([a-zA-Z][\w-]*)", part)
        if m:
            out.append(m.group(1))
    return out


def first_decl(body, prop):
    """Valeur de la premiere declaration `prop:` de PREMIER niveau du corps."""
    depth = 0
    for chunk in re.finditer(r"[^;{}]+|[{}]", body):
        t = chunk.group(0)
        if t == "{":
            depth += 1
        elif t == "}":
            depth -= 1
        elif depth == 0:
            m = re.match(r"\s*" + re.escape(prop) + r"\s*:\s*(.+)", t, re.S)
            if m:
                return m.group(1).strip()
    return None


# ── Les quatre courbes, extraites du mixin ──────────────────────────────────
def parse_level_expr(expr):
    """`($max-font-size / 1.05 - $step * 5) * 1.01` -> (div, k, mult)."""
    e = expr.strip().rstrip(";").strip()
    mult = 1.0
    # `(...) * 1.01` : le facteur d'interligne, entre parentheses ou non
    m = re.match(r"^\((.*)\)\s*\*\s*([\d.]+)$", e)
    if m:
        e, mult = m.group(1), float(m.group(2))
    else:
        m = re.match(r"^(\$max-font-size)\s*\*\s*([\d.]+)$", e)
        if m:
            e, mult = m.group(1), float(m.group(2))
    # `$max-font-size [/ D] [- $step [* K]]` — sans `* K`, le pas vaut 1
    m = re.match(r"^\$max-font-size(?:\s*/\s*([\d.]+))?"
                 r"(?:\s*-\s*\$step(?:\s*\*\s*(\d+))?)?$", e.strip())
    if not m:
        return None
    div = float(m.group(1)) if m.group(1) else 1.0
    if re.search(r"\$step", e):
        k = int(m.group(2)) if m.group(2) else 1
    else:
        k = 0
    return {"div": div, "k": k, "mult": mult}


def parse_curves(mixins_txt):
    """Rend {nom: {fs:[8x{div,k,mult}], lh:[...]}} pour les mixins d'affichage."""
    curves = {}
    for name in ("title", "cta", "banner"):
        m = re.search(r"@mixin\s+font-size-%s\s*\(" % name, mixins_txt)
        if not m:
            continue
        # le corps du mixin, jusqu'au prochain @mixin
        nxt = re.search(r"@mixin\s", mixins_txt[m.end():])
        body = mixins_txt[m.end(): m.end() + (nxt.start() if nxt else len(mixins_txt))]
        fs, lh = [None] * 8, [None] * 8
        for mm in re.finditer(r"\$([ol])(\d):\s*([^;]+);", body):
            kind, idx, expr = mm.group(1), int(mm.group(2)), mm.group(3)
            got = parse_level_expr(expr)
            if got is None:
                continue
            (fs if kind == "o" else lh)[idx] = got
        if all(x is not None for x in fs) and all(x is not None for x in lh):
            curves[name] = {"fs": fs, "lh": lh}
    return curves


def parse_text_curve(mixins_txt):
    """`font-size-text` : deux `fluide()`, donc deux couples de coefficients.

    `fluide($max, $min, "rem", 361, 1920)` -> rampe continue (clamp), pas un
    escalier. Les coefficients d'interligne sont lus dans le mixin plutot que
    recopies : ils ont deja bouge une fois (correctif du 27/07).
    """
    m = re.search(r"@mixin\s+font-size-text\s*\(.*?\)\s*\{(.*?)\n\}", mixins_txt, re.S)
    if not m:
        return None
    body = m.group(1)
    fs = re.search(r"font-size:\s*fluide\(([^)]*)\)", body)
    lh = re.search(r"line-height:\s*fluide\(([^)]*)\)", body)
    if not (fs and lh):
        return None

    def bornes(args):
        a = [x.strip() for x in args.split(",")]
        de, jusqua = int(a[3]), int(a[4])
        cmax = re.search(r"\*\s*([\d.]+)", a[0])
        cmin = re.search(r"\*\s*([\d.]+)", a[1])
        return {
            "max": float(cmax.group(1)) if cmax else 1.0,
            "min": float(cmin.group(1)) if cmin else 1.0,
            "de": de, "a": jusqua,
        }

    out = {"fs": bornes(fs.group(1)), "lh": bornes(lh.group(1))}
    mr = re.search(r"@function\s+min-du-cran\([^)]*\)\s*\{.*?@return\s*\$max\s*-\s*([\d.]+)", mixins_txt, re.S)
    out["min_rule_rem"] = float(mr.group(1)) if mr else None
    return out


# ── Scan du vocabulaire ─────────────────────────────────────────────────────
LEGACY_RE = re.compile(r"^(title-it|title|body-bold|body-med|body)-(\d+)(?:-(\d+))?((?:-[a-z]+)*)$")


def is_legacy_cran(name):
    m = LEGACY_RE.match(name)
    if not m:
        return None
    mods = [t for t in m.group(4).split("-") if t]
    # un suffixe de rampe (`title-78-42-banner`) nomme le MIXIN appele, pas un
    # modificateur : le confondre avec un mod rend le cran intraduisible.
    curve = None
    if mods and mods[-1] in ("cta", "title", "banner"):
        curve = mods.pop()
    return {
        "family": m.group(1),
        "max": int(m.group(2)),
        "min": int(m.group(3)) if m.group(3) else int(m.group(2)),
        "mods": mods,
        "curve": curve,
    }


SCSS_VARS = {}


def load_scss_vars(sass_dir):
    """Valeurs numeriques des `$var: 1.7;` du dossier `variables/`.

    `body-17-14` s'ecrit `font-size-text($defaultSizeMax, $defaultSizeMin)` :
    c'est l'ANCRE de l'echelle (cf. `ds/README.md`), et lire son appel sans
    resoudre ces deux variables ferait tomber tout le scan.
    """
    out = {}
    vdir = os.path.join(sass_dir, "variables")
    if not os.path.isdir(vdir):
        return out
    for fn in sorted(os.listdir(vdir)):
        if not fn.endswith(".scss"):
            continue
        txt = strip_comments(open(os.path.join(vdir, fn), encoding="utf-8").read())
        for m in re.finditer(r"^\s*\$([\w-]+)\s*:\s*([^;]+);", txt, re.M):
            val = m.group(2).replace("!default", "").strip()
            try:
                out[m.group(1)] = float(val)
            except ValueError:
                out[m.group(1)] = val
    return out


def px_de_larg(arg):
    """Argument d'un mixin (rem au dixieme, ou variable) -> px entiers, ou None."""
    arg = arg.strip()
    try:
        return round(float(arg) * 10)
    except ValueError:
        pass
    m = re.match(r"^\$([\w-]+)$", arg)
    if m and isinstance(SCSS_VARS.get(m.group(1)), float):
        return round(SCSS_VARS[m.group(1)] * 10)
    return None


def substituer_vars(val):
    """Remplace les `$var` par leur valeur. Les couleurs du DS valent
    `var(--primary-color)` : elles sont donc utilisables telles quelles a
    runtime, sur la production comme sur le banc."""
    def rep(m):
        v = SCSS_VARS.get(m.group(1))
        return str(v) if v is not None else m.group(0)
    return re.sub(r"\$([\w-]+)", rep, val).strip()


def decls_of(body):
    """Declarations d'un atome, pretes a etre reservies telles quelles.

    Rend [[suffixe de selecteur, [[prop, valeur], ...]], ...]. Le suffixe est
    vide pour le premier niveau, `` * `` ou `` em `` pour les blocs imbriques
    simples que le DS utilise (`m-wide` propage son interlettrage aux enfants,
    `f-title` impose l'italique a ses `em`) : sans eux, un aperçu sur la
    production rendrait a moitie.

    Ce qui est IGNORE, et assume : `&:hover`, `:focus-visible` et les `@media`
    des atomes `h-`. Un etat de survol ne se previsualise pas dans le panneau,
    et l'emettre en CSS plat le rendrait permanent.
    """
    out = []
    plat = []
    depth = 0
    buf = ""
    header = ""
    for ch in body:
        if ch == "{":
            if depth == 0:
                header = buf.strip()
                buf = ""
            else:
                buf += ch
            depth += 1
            continue
        if ch == "}":
            depth -= 1
            if depth == 0:
                sel = header
                if sel in ("*", "em"):
                    inner = [x for x in
                             ([[p.strip(), substituer_vars(v)] for p, v in
                               (kv.split(":", 1) for kv in buf.split(";") if ":" in kv)])]
                    if inner:
                        out.append([sel, inner])
                buf = ""
                header = ""
            else:
                buf += ch
            continue
        if depth == 0:
            if ch == ";":
                if ":" in buf:
                    p_, v_ = buf.split(":", 1)
                    plat.append([p_.strip(), substituer_vars(v_)])
                buf = ""
            else:
                buf += ch
        else:
            buf += ch
    if plat:
        out.insert(0, ["", plat])
    return out


def parse_size_atom(name, body):
    """`.s-54-35-cta { @include font-size-cta(5.4, 3.5) }` -> bornes + rampe."""
    m = re.match(r"^s-(\d+)(?:-(\d+))?(?:-(cta|title|banner))?$", name)
    if not m:
        return None
    inc = re.search(r"@include\s+font-size-(text|cta|title|banner)\s*\(([^)]*)\)", body)
    fixed = first_decl(body, "font-size")
    out = {"name": name, "max": int(m.group(1)),
           "min": int(m.group(2)) if m.group(2) else None,
           "curve": m.group(3) or "text"}
    if inc:
        args = [a.strip() for a in inc.group(2).split(",")]
        out["curve"] = inc.group(1)
        out["max"] = px_de_larg(args[0])
        out["min"] = px_de_larg(args[1]) if len(args) > 1 else None
        if out["max"] is None:
            return None
    elif fixed and fixed.endswith("px"):
        out["curve"] = "fixed"
        out["px"] = float(fixed[:-2])
        out["min"] = out["max"]
    if out["min"] is None:
        out["min"] = out["max"]
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--ds", help="dossier sass du theme (defaut : premier clone trouve)")
    ap.add_argument("--quiet", action="store_true")
    o = ap.parse_args()

    root = None
    if o.ds:
        sass_dir = o.ds
        root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(sass_dir))))
    else:
        for c in DS_CLONES:
            if os.path.isdir(os.path.join(c, SASS_REL, "ds")):
                root, sass_dir = c, os.path.join(c, SASS_REL)
                break
        else:
            print("!! aucun clone du DS trouve parmi :", DS_CLONES)
            return 1
    ds_dir = os.path.join(sass_dir, "ds")
    print("DS lu dans :", ds_dir)
    global SCSS_VARS
    SCSS_VARS = load_scss_vars(sass_dir)

    # 1. les courbes, depuis le mixin
    mixins_path = os.path.join(sass_dir, "abstractions", "_fonts_mixins.scss")
    mixins_txt = strip_comments(open(mixins_path, encoding="utf-8").read())
    curves = parse_curves(mixins_txt)
    text_curve = parse_text_curve(mixins_txt)
    errors, warnings = [], []
    for c in ("cta", "title", "banner"):
        if c not in curves:
            errors.append("courbe %s illisible dans %s" % (c, mixins_path))
    if not text_curve:
        errors.append("courbe text (fluide) illisible dans %s" % mixins_path)
    elif text_curve.get("min_rule_rem") is None:
        errors.append("regle du min (min-du-cran) illisible : le builder ne peut pas deduire un min")

    # 2. les alias, verbatim
    map_dir = os.path.join(root, MAP_REL)
    sys.path.insert(0, map_dir)
    try:
        from migrate_db_classes import MAPPING as ALIASES
    except Exception as e:
        warnings.append("MAPPING des anciens noms non importe (%s) : %s" % (map_dir, e))
        ALIASES = {}
    alias_keys = set(ALIASES)

    # 3. le scan des ds/*.scss
    atoms = {a["key"]: [] for a in AXES}
    legacy, components, roles, utils = {}, {}, {}, set()
    seen_atom = set()
    atomByName_scan = {}
    files = sorted(f for f in os.listdir(ds_dir) if f.endswith(".scss"))
    for fn in files:
        txt = strip_comments(open(os.path.join(ds_dir, fn), encoding="utf-8").read())
        for header, body in top_level_rules(txt):
            names = [c for c in classes_of(header) if c not in EXCLUDE]
            if not names:
                continue
            crans = [c for c in names if is_legacy_cran(c) or re.match(r"^[fscmh]-", c)]
            for name in names:
                if name in alias_keys and name not in crans:
                    continue                       # ancien nom : deja dans ALIASES
                m = re.match(r"^([fscmh])-", name)
                if m and name not in seen_atom:
                    axis = m.group(1)
                    entry = {"name": name}
                    if axis == "s":
                        got = parse_size_atom(name, body)
                        if not got:
                            warnings.append("atome de taille non decomposable : %s" % name)
                            continue
                        entry = got
                    elif axis == "f":
                        ff = first_decl(body, "font-family")
                        tok = re.search(r"var\((--[\w-]+)\)", ff or "")
                        entry["token"] = tok.group(1) if tok else None
                    elif axis == "c":
                        entry["value"] = substituer_vars(first_decl(body, "color") or "")
                    if axis in ("f", "c", "m"):
                        # de quoi REJOUER l'atome la ou il n'existe pas encore :
                        # la production n'a aucun de ces noms, l'apercu serait
                        # muet sans ces declarations.
                        entry["decls"] = decls_of(body)
                    entry["label"] = LABELS.get(name)
                    entry["file"] = fn
                    atoms[axis].append(entry)
                    atomByName_scan[name] = entry
                    seen_atom.add(name)
                elif m:
                    # 🔴 UN ATOME PEUT ETRE ECRIT EN PLUSIEURS REGLES, et prendre
                    # la premiere perd le reste. `.f-title` est declare deux fois :
                    # groupe avec `.f-title-it` pour l'interlettrage, puis seul pour
                    # sa police. S'arreter a la premiere rendait un `f-title` SANS
                    # font-family, donc un apercu qui ne change pas la police.
                    prev = atomByName_scan.get(name)
                    if prev is not None and "decls" in prev:
                        for bloc in decls_of(body):
                            for existant in prev["decls"]:
                                if existant[0] == bloc[0]:
                                    props = {d[0] for d in existant[1]}
                                    existant[1].extend([d for d in bloc[1] if d[0] not in props])
                                    break
                            else:
                                prev["decls"].append(bloc)
                    continue
                elif is_legacy_cran(name):
                    if name not in legacy:
                        info = is_legacy_cran(name)
                        # la rampe et les bornes REELLES viennent de l'appel du
                        # cran lui-meme, pas de son nom : c'est ce qui distingue
                        # `title-78-42` (rampe title) de `title-78-42-banner`.
                        inc = re.search(r"@include\s+font-size-(text|cta|title|banner)"
                                        r"\s*\(([^)]*)\)", body)
                        if inc:
                            args = [a.strip() for a in inc.group(2).split(",")]
                            mx = px_de_larg(args[0])
                            if mx is not None:
                                info["curve"] = inc.group(1)
                                info["max"] = mx
                                # min absent = deduit par la regle du min
                                info["min"] = px_de_larg(args[1]) if len(args) > 1 else None
                        else:
                            # pas de mixin : une taille FIXE, en pixels
                            fx = first_decl(body, "font-size")
                            if fx and fx.endswith("px"):
                                info["curve"] = "fixed"
                                info["max"] = info["min"] = round(float(fx[:-2]))
                        legacy[name] = info
                elif name.startswith("u-"):
                    utils.add(name)
                elif crans:
                    roles[name] = crans[0]          # role groupe avec un cran/atome
                else:
                    components.setdefault(FILE_GROUPS.get(fn, fn), [])
                    if name not in components[FILE_GROUPS.get(fn, fn)]:
                        components[FILE_GROUPS.get(fn, fn)].append(name)

    # 3-bis. le token de police se lit sur les declarations FUSIONNEES : les
    # deux fontes de titre sont declarees en deux temps (interlettrage groupe,
    # puis police seule), donc illisibles depuis la premiere regle seule.
    for e in atoms["f"]:
        if e.get("token"):
            continue
        for sel, props in e.get("decls") or []:
            if sel:
                continue
            for prop, val in props:
                m = re.search(r"var\((--[\w-]+)\)", val) if prop == "font-family" else None
                if m:
                    e["token"] = m.group(1)

    # 4. la traduction cran -> atomes.
    #
    # Elle est DERIVEE, pas recopiee. La table du chantier
    # (`cdc/ds-coherence/donnees/atomes.json`) date du lot 1 et a vieilli : elle
    # traduit encore `body-bold-12-caps` vers `s-12`, atome supprime depuis
    # (« pas d'atome a borne unique », `ds/_atomes.scss`). Une table figee se
    # trompe des que le DS bouge ; la derivation suit. La table sert donc de
    # TEMOIN : toute divergence est signalee, aucune n'est avalee.
    MOD_AXIS = {"caps": "m-caps", "wide": "m-wide", "muted": "c-muted",
                "ondark": "c-ondark", "accent": "c-main"}
    size_by_key = {(e["curve"], e["max"], e["min"]): e["name"] for e in atoms["s"]}
    min_px = catalog_min_px = int(round(((text_curve or {}).get("min_rule_rem") or 0.3) * 10))

    def traduire(name, info):
        out = ["f-" + info["family"]]
        curve = info.get("curve") or ("text" if info["family"].startswith("body") else "cta")
        if curve == "text" and info["family"].startswith("title"):
            curve = "cta"
        mx = info["max"]
        mn = info["min"]
        if mn is None:                       # la regle du min : TEXTE uniquement
            mn = mx - min_px if curve == "text" else mx
        key = (curve, mx, mn)
        if key not in size_by_key:
            return None, "aucun atome de taille pour %s %s-%s" % (curve, mx, mn)
        out.append(size_by_key[key])
        cols = [MOD_AXIS[m] for m in info["mods"] if MOD_AXIS.get(m, "").startswith("c-")]
        mods = [MOD_AXIS[m] for m in info["mods"] if MOD_AXIS.get(m, "").startswith("m-")]
        inconnus = [m for m in info["mods"] if m not in MOD_AXIS]
        if inconnus:
            return None, "modificateur(s) sans atome : %s" % ", ".join(inconnus)
        return out + cols + mods, None

    try:
        trad_temoin = json.load(open(ATOMES_JSON, encoding="utf-8"))["traduction"]
    except Exception as e:
        trad_temoin = {}
        warnings.append("table temoin cran->atomes non lue (%s) : %s" % (ATOMES_JSON, e))
    divergences = []
    for name, info in sorted(legacy.items()):
        got, why = traduire(name, info)
        info["atoms"] = got
        if got is None:
            warnings.append("cran %s non traduisible : %s" % (name, why))
            continue
        ref = trad_temoin.get(name)
        if ref and sorted(ref) != sorted(got):
            divergences.append("%s : chantier %s / derive %s" % (name, ref, got))
    if divergences:
        warnings.append("%d cran(s) traduits autrement que dans la table du chantier "
                        "(la derivation suit le DS d'aujourd'hui) : %s"
                        % (len(divergences), " | ".join(divergences)))

    # ── Validation : des controles qui SAVENT echouer ───────────────────────
    known_atoms = {e["name"] for lst in atoms.values() for e in lst}
    for name in LABELS:
        if name not in known_atoms:
            errors.append("libelle sans atome dans le DS (retire/renomme ?) : %s" % name)
    for axis, lst in atoms.items():
        if axis == "s":
            continue          # une taille se decrit par ses bornes, pas par un libelle
        for e in lst:
            if not e.get("label"):
                warnings.append("atome du DS sans libelle : %s" % e["name"])
    for axis in ("f", "s"):
        if not atoms[axis]:
            errors.append("aucun atome sur l'axe %s : le scan n'a rien lu" % axis)
    for e in atoms["f"]:
        if not e.get("token"):
            errors.append("fonte %s sans token de police : le scan a rate sa declaration" % e["name"])

    # un atome de taille dont le nom ment sur ses bornes
    for e in atoms["s"]:
        if e["curve"] == "fixed":
            continue
        want = re.match(r"^s-(\d+)(?:-(\d+))?", e["name"])
        nmax = int(want.group(1))
        nmin = int(want.group(2)) if want.group(2) else nmax
        if (nmax, nmin) != (e["max"], e["min"]):
            errors.append("atome %s annonce %s-%s et appelle %s-%s"
                          % (e["name"], nmax, nmin, e["max"], e["min"]))

    # la traduction des crans encore definis doit exister et ne viser que du connu
    for name, info in legacy.items():
        if info["atoms"] is None:
            warnings.append("cran legacy sans traduction en atomes : %s" % name)
            continue
        for tok in info["atoms"]:
            if tok not in known_atoms:
                errors.append("traduction de %s vise un atome inconnu : %s" % (name, tok))

    # les cibles d'alias existent
    known_all = known_atoms | set(legacy) | set(roles) | utils | {
        c for g in components.values() for c in g}
    # Les cibles d'alias datent de la migration PRECEDENTE : plusieurs visent des
    # crans depuis supprimes ou des utilitaires renommes en atomes. Ce n'est pas
    # une erreur du catalogue, c'est de la dette du DS — on la compte, on la
    # nomme, on ne bloque pas dessus.
    perimes = sorted({tok for tgt in ALIASES.values()
                      for tok in str(tgt).split() if tok not in known_all})
    if perimes:
        warnings.append("%d cible(s) d'alias ne sont plus dans le DS : %s"
                        % (len(perimes), ", ".join(perimes)))

    catalog = {
        "_note": "Genere par gen_ds_catalog.py — SoT = ds/*.scss (europe-account). Ne pas editer a la main.",
        "version": 3,
        "nomenclature": "f-<fonte> s-<max>-<min>[-rampe] [c-<couleur>] [m-<mod>…] [h-<survol>]  (1rem=10px)",
        "source": ds_dir,
        "axes": AXES,
        "atoms": {k: sorted(v, key=lambda e: e["name"]) for k, v in atoms.items()},
        "curves": curves,
        "text_curve": text_curve,
        "min_rule": {"px": int(round((text_curve or {}).get("min_rule_rem") or 0.3) * 10) or 3,
                     "applies": ["text"],
                     "note": "TEXTE uniquement : les titres gardent leur min ecrit a l'appel"},
        "breakpoints": [361, 510, 768, 1024, 1366, 1600, 1920],
        "legacy": dict(sorted(legacy.items())),
        "roles": dict(sorted(roles.items())),
        "components": {k: sorted(v) for k, v in sorted(components.items())},
        "utils": sorted(utils),
        "aliases": dict(sorted(ALIASES.items())),
    }

    if not o.quiet:
        print("=== Catalogue DS v3 (atomique, auto-scan de %d fichiers) ===" % len(files))
        for a in AXES:
            print("  %-8s : %d" % (a["label"], len(atoms[a["key"]])))
        print("  crans legacy : %d (dont %d traduits en atomes)"
              % (len(legacy), sum(1 for v in legacy.values() if v["atoms"])))
        print("  roles        : %d" % len(roles))
        print("  composants   : %d en %d groupes"
              % (sum(len(v) for v in components.values()), len(components)))
        print("  utils        : %d" % len(utils))
        print("  alias        : %d" % len(ALIASES))
        print("  courbes      : %s + text(fluide)" % ", ".join(sorted(curves)))
        for w in warnings:
            print("  (!)", w)

    if errors:
        print("\n!! VALIDATION ECHOUEE (%d) :" % len(errors))
        for e in errors:
            print("  -", e)
        return 1

    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(catalog, f, ensure_ascii=False, indent=2)
    with open(JS_OUT, "w", encoding="utf-8") as f:
        f.write("/* Genere par gen_ds_catalog.py — SoT = ds/*.scss (europe-account). Ne pas editer a la main. */\n")
        f.write("window.BDR_CATALOG = ")
        json.dump(catalog, f, ensure_ascii=False, indent=2)
        f.write(";\n")
    print("\nVALIDATION OK — ecrit", OUT)
    print("ecrit aussi      ", JS_OUT)
    return 0


if __name__ == "__main__":
    sys.exit(main())
