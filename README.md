# Biences Design Review (BDR)

Userscript de **revue visuelle du design system** pour Eliott. Injecté dans une
page du site, il matérialise le parcours :

> **Visiter** une page → la **reviewer** axe par axe → produire un **rapport**
> JSON consommé par Claude Code pour appliquer les changements.

Ce repo est **la source complète** : les sources sont dans `src/`, le fichier
distribué (`biences-design-review.user.js`) est buildé à la racine.

## Le vocabulaire qu'il revoit

Le DS s'écrit **par composition** depuis le 23.08.2026 (décision Manuel,
`cdc/ds-coherence/PLAN-DECOMPOSITION.md`). Un préfixe par nature :

| axe | ce qu'il porte | exemples |
|---|---|---|
| `f-` | la fonte, et ce qu'elle impose à ses enfants | `f-body`, `f-title-it` |
| `s-` | la taille, **rampe comprise dans le nom** | `s-16-13`, `s-54-35-cta` |
| `c-` | la couleur du texte | `c-muted`, `c-main` |
| `m-` | le mod typographique | `m-caps`, `m-wide` |
| `h-` | l'état de survol | `h-color-main` |

```
body-bold-16-13-caps-wide   →   f-body-bold  s-16-13  m-caps  m-wide
title-54-35                 →   f-title  s-54-35-cta
```

**Les deux mondes cohabitent, et c'est voulu.** `europe-account` est migrée
(1352 poses `f-`, 1475 poses `s-`, 2 crans monolithiques restants) ; la
**production est encore entièrement écrite en crans**. L'outil lit les deux :
un cran est reconnu, marqué **« à migrer »** en jaune, et sa traduction en
atomes s'applique d'un bouton.

## Installer (Eliott)

Tampermonkey → ouvrir
`https://raw.githubusercontent.com/Devodia/biences-design-review/main/biences-design-review.user.js`
→ « Installer ». Se met à jour automatiquement (`@updateURL`). L'onglet
« Design Review » apparaît à gauche sur `*.dev.odoo.com` et `*.biences.ch` ;
**Alt+R** ouvre + démarre.

Sans Tampermonkey : coller `review.standalone.js` dans la console devtools.

## Ce qu'il fait

- **Mode revue** : survol → contour ; clic → panneau. Interactions de la page
  neutralisées (add-to-cart, liens, formulaires).
- **La composition, une ligne par axe.** Le panneau montre les cinq axes, ce
  que l'élément porte sur chacun, et **ce qu'il ne porte pas** : une fonte sans
  taille retombe sur ce que son parent lui donne, et le voir est la moitié de
  la revue.
- **Changer un axe** : liste courte de l'axe, aperçu live au survol. Les autres
  axes ne bougent pas.
- **Migrer** un ancien cran vers ses atomes, en un clic, seul ou en groupe.
- **Nouvelle taille** : le seul axe encore ouvert. La **règle du min**
  (`min = max − 3`, texte seulement) est appliquée, pas seulement affichée ;
  écrire un min à la main devient une **exception qui doit se justifier par
  écrit**. Anti-doublon sur les tailles déjà servies par la rampe, rendu live,
  et le **SCSS prêt à coller** dans `ds/_atomes.scss`.
- **Multi-sélection** par classe → changement groupé.
- **Avant/Après** + **verrouillage de page**.
- **Rapport** : `from` / `to`, atomes avant/après, axe touché, export JSON.

Raccourcis : `F` fonte · `T` taille · `C` couleur · `M` mod · `H` survol ·
`X` nouvelle taille · `N` note · `G` cibler · `↑↓` hiérarchie · `Échap` fermer.

## Structure du repo

```
biences-design-review.user.js   ← chargé par Tampermonkey (BUILDÉ, ne pas éditer)
review.standalone.js            ← version console (BUILDÉ)
src/
  gen_ds_catalog.py   scanne les ds/*.scss du thème → le catalogue
  ds_catalog_v3.json  catalogue (généré, référence)
  bdr_catalog.js      window.BDR_CATALOG (généré, embarqué au build)
  bdr_engine.js       moteur pur : axes, tailles, traduction des crans (testé node)
  bdr_ui.js           interface : détection, panneau, parcours
  build.py            assemble src/ → les fichiers buildés à la racine
  test_runtime.py     recette Playwright sur une page SERVIE
  sonde_parc.py       sonde une page + une taille d'écran, rend du JSON
  fixtures/sass_compile.json   CSS réellement compilé par sass (21 atomes)
```

## Mettre à jour le script

1. Éditer une source dans `src/`.
2. **`python src/build.py`** → régénère les deux fichiers de la racine.
3. `git commit -am "…"` puis `git push` → **le Tampermonkey d'Eliott se met à
   jour tout seul.**

> ⚠ **Pousser = déployer chez Eliott.** À faire sciemment, sur go Manuel.

## Les vérifications, et pourquoi elles sont faites comme ça

```
python src/gen_ds_catalog.py     # catalogue : 0 erreur de validation
node src/bdr_engine.js           # moteur : 44 OK attendus
python src/test_runtime.py       # recette runtime sur le banc europe-account
python src/test_runtime.py --servi   # la même, sur le script SERVI par GitHub
python src/sonde_parc.py --page /shop --largeur 1512 --hauteur 823 --servi
node --check biences-design-review.user.js
```

**Le moteur n'est pas comparé à lui-même.** `fixtures/sass_compile.json` est le
CSS que **sass a réellement produit** pour 21 atomes, extrait de
`tb_theme_optimized/static/src/css/biences_product.css`. Les quatre régimes y
sont (clamp de texte, rampes cta / title / banner, tailles fixes), et le test
exige l'égalité à la 10ᵉ décimale — celle que sass écrit.

Les deux contrôles portent un **témoin négatif** : le moteur rejoue une courbe
faussée et exige que la comparaison la refuse ; la recette runtime a été
rejouée avec le geste destructeur de la v0.28 et signale bien les trois pertes
(fonte, casse, interlettrage).

`--servi` mesure le fichier que **GitHub sert reellement** au lieu de la copie
locale : c'est le seul controle qui prouve ce qu'Eliott recevra, un push pouvant
tres bien reussir et servir autre chose.

La recette runtime refuse de tourner ailleurs que sur un banc `dev.odoo.com`,
sauf en `--lecture-seule` (aucun clic, aucune classe modifiée) — mode à utiliser
pour vérifier la lecture de la production.

### Régénérer le catalogue (si le DS change)

```
python src/gen_ds_catalog.py            # lit le clone europe-account
python src/gen_ds_catalog.py --ds <dossier sass>   # ou un worktree précis
python src/build.py
```

Rien n'est recopié à la main : les atomes, leurs déclarations, **les
coefficients des quatre mixins** et la traduction des crans sont tous dérivés
du SCSS. C'est ce qui manquait : les diviseurs des mixins ont été retirés du DS
le 17.08.2026 et le moteur les appliquait encore un mois plus tard.

## Format du rapport (export)

```jsonc
{
  "tool": "biences-design-review", "version": "0.30.0",
  "ds": { "nomenclature": "f-<fonte> s-<max>-<min>[-rampe] …", "source": "…/ds" },
  "created_sizes": { "s-19-16": ".s-19-16 { @include font-size-text(1.9); }" },
  "feedbacks": [
    { "verdict": "swap", "axis": "s", "proposition": "s-18-15",
      "from": ["f-body", "s-16-13", "m-caps"], "to": ["f-body", "m-caps", "s-18-15"],
      "atoms_before": ["f-body","s-16-13","m-caps"],
      "atoms_after":  ["f-body","m-caps","s-18-15"],
      "group": { "selector": ".s-16-13", "count": 12 } },
    { "verdict": "migrate", "from": ["body-14-11-muted"],
      "atoms_after": ["f-body", "s-14-11", "c-muted"] },
    { "verdict": "create", "new_size": { "name": "s-19-16", "curve": "text",
      "max": 19, "min": 16, "exception": null, "scss": "…", "css": "…" } },
    { "verdict": "note", "note": "…" }
  ]
}
```

## Ce que la sonde de parc mesure en plus

`sonde_parc.py` sert deux natures à la fois, et il faut les distinguer :

- **côté outil** : le panneau tient-il à cette taille d'écran, un changement
  d'axe peint-il sans détruire les autres, la pause rend-elle la page neutre ;
- **côté DS** : combien d'atomes sont **décoratifs** — posés, mais qui ne
  décident de rien.

🔴 Le détecteur d'atome décoratif **ne compare pas des valeurs, il retire
l'atome et regarde si l'écran bouge.** C'est le seul test qui attrape le cas
trompeur : le `<h3>` « Nos offres passagères » portait `s-54-35-cta` et rendait
*exactement* la taille que la règle qui le battait imposait. Aucune comparaison
de valeurs ne pouvait le voir. Mesure sur la home : **7 atomes décoratifs sur
35 testés**.

Deux gardes qui ont déjà servi : une page sous 200 éléments est déclarée
**absente** et non vide (le banc a rendu deux 503 dans la même journée), et les
`!important` inline sont photographiés **avant** injection — sinon le `<h1>`
masqué du site passe pour une fuite de l'outil.

## Statut

**v0.33** — catalogue v3 (21 tailles, 5 fontes, 8 couleurs, 8 mods, 2 survols,
55 crans traduits), moteur **44/44** (dont l'égalité au CSS compilé par sass),
recette runtime **35/35** sur `biences-europe-account-36096602.dev.odoo.com`,
et lecture de la production vérifiée (257 éléments DS, 171 crans reconnus
« à migrer »).

Ce que la recette couvre en régression, parce que chacun a été un défaut réel :
un atome que la cascade écrase peint quand même · une règle de page en
`#id !important` ne bloque plus le changement · un composant qui se re-rend ne
fait plus perdre les cibles · la pause ne laisse aucun `!important` derrière
elle · sur un portable le pied du panneau reste dans l'écran · le piège à focus
d'un tiroir ne vide plus le champ de note.

## Limitations connues

- **La création ne couvre que les tailles.** Les quatre autres axes sont clos
  par le DS ; en ouvrir un est une décision, pas un manque de l'outil.
- **Les atomes `h-` ne se prévisualisent pas.** Un survol rendu en CSS plat
  serait permanent ; l'axe se change et s'enregistre, il ne s'aperçoit pas.
- **Le catalogue reflète `europe-account`.** Sur la production, tous les crans
  apparaissent en *legacy* — c'est exact, pas un défaut.
- **La rampe de `font-size-banner` recule** entre 361 et 510 px. C'est dans la
  forme d'origine et Manuel l'assume : le moteur la reproduit telle quelle.
