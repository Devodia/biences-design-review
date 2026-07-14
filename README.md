# Biences Design Review (BDR)

Userscript de **revue visuelle du design system** pour Eliott. Injecté dans une
page du site, il matérialise le parcours :

> **Visiter** une page → la **reviewer** style par style → produire un **rapport**
> JSON consommé par Claude Code pour appliquer les changements.

Ciblé sur la nomenclature `{famille}-{max}-{min}[-modificateurs]` (chantier
css-refactor). Les anciens noms `-style` restent reconnus et signalés *à migrer*.

Ce repo est **la source complète** : les sources sont dans `src/`, le fichier
distribué (`biences-design-review.user.js`) est buildé à la racine.

## Installer (Eliott)

Tampermonkey → ouvrir
`https://raw.githubusercontent.com/Devodia/biences-design-review/main/biences-design-review.user.js`
→ « Installer ». Se met à jour automatiquement (`@updateURL`). L'onglet
« Design Review » apparaît à droite sur `*.dev.odoo.com` et `*.biences.ch` ;
**Alt+R** ouvre + démarre.

Sans Tampermonkey : coller `review.standalone.js` dans la console devtools.

## Ce qu'il fait

- **Mode revue** : survol → contour ; clic → panneau droit. Interactions de la
  page neutralisées (add-to-cart, liens, formulaires).
- **Détection** : chaque classe résolue (canonique / rôle / composant / util =
  *validé* ; alias `-style` = *legacy à migrer*).
- **Remplacer** : dropdown filtrée, preview live au survol.
- **Nouveau style** (builder) : nom canonique construit **famille → max → min →
  modificateurs (+)**, avec **mise en évidence des tailles/combinaisons
  existantes** (anti-doublon), **rendu live** (CSS synthétisé fidèle aux mixins),
  **rôle** optionnel. Si la combinaison existe déjà → propose de la réutiliser.
- **Multi-sélection** : tous les éléments d'une même classe → remplacement groupé.
- **Avant/Après** + **verrouillage de page**.
- **Rapport** : décisions listées, export JSON + presse-papier.

## Structure du repo

```
biences-design-review.user.js   ← fichier chargé par Tampermonkey (BUILDÉ, ne pas éditer à la main)
review.standalone.js            ← version console (BUILDÉ)
src/
  gen_ds_catalog.py   génère le catalogue depuis les ds/*.scss du thème + réutilise migrate_db_classes.MAPPING
  ds_catalog_v2.json  catalogue (généré, référence)
  bdr_catalog.js      window.BDR_CATALOG (généré, embarqué au build)
  bdr_engine.js       moteur pur : parseName/buildName/sizeAt/synthCSS/resolve/combinaisons (testé node)
  bdr_ui.js           interface : détection, panneau, features, parcours
  build.py            assemble src/ → les fichiers buildés à la racine
```

## Mettre à jour le script (effort minimal)

1. Éditer une source dans `src/` (typiquement `bdr_ui.js` pour l'UX, `bdr_engine.js` pour la logique).
2. **`python src/build.py`** → régénère `biences-design-review.user.js` + `review.standalone.js` à la racine.
3. `git commit -am "…"` puis `git push` → **le Tampermonkey d'Eliott se met à jour tout seul.**

> ⚠ **Pousser = déployer chez Eliott.** À faire sciemment.

Vérifs : `node src/bdr_engine.js` (tests moteur, attendu 30 OK) puis
`node --check biences-design-review.user.js`.

### Régénérer le catalogue (si le DS change)

Seulement quand les `ds/*.scss` du thème ont évolué :

```
python src/gen_ds_catalog.py   # chemin du clone Odoo css-refactor en tête du fichier (MAP_DIR)
python src/build.py
```

## Format du rapport (export)

```jsonc
{
  "tool": "biences-design-review", "version": "0.17.0",
  "url": "...", "viewport": "1440x900", "breakpoint": "desktop",
  "created_styles": { "<nom>": "<css synthétisé, prêt pour _type_styles.scss>" },
  "feedbacks": [
    { "verdict": "swap",   "proposition": "body-16-12", "group": {"selector": ".x", "count": 12} },
    { "verdict": "create", "new_style": { "name": "body-52-caps", "family": "body",
      "max": 52, "min": 52, "mods": ["caps"], "role": null, "css": "..." } },
    { "verdict": "note",   "note": "..." }
  ]
}
```

## Statut

v0.17 — moteur 30/30 (node), smoke runtime 38/38 (Playwright) sur le staging
css-refactor : boot, 277 éléments détectés, builder, création, remplacement,
multi-sélection (134× groupé), avant/après, verrou — 0 exception.

## Limitations (v1)

- Le remplacement retire **toutes** les classes DS de l'élément avant d'ajouter
  la nouvelle → un util composé (`u-strike`…) est perdu au swap.
- Le catalogue reflète l'état css-refactor : sur la prod pré-refactor, tout
  apparaît en *legacy*.
- La synthèse de taille d'un nouveau style suppose la courbe majoritaire de la
  famille (`cta` pour title/title-it, `text` pour body*).
