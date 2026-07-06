# Biences Design Review

Outil de revue visuelle du design system Biences, distribué en **userscript
Tampermonkey**. Un relecteur (Eliott) survole/clique les éléments d'un build de
test, voit leur classement dans le design system, et pose des retours
(remplacer une classe / proposer un ajout au DS / annoter) depuis un **panneau
à droite** — sans jamais recouvrir le contenu revu.

> Ce repo ne contient que **l'artefact distribué** (le userscript + le catalogue
> des classes). Il n'expose que du code générique d'UI et des **noms de classes
> CSS déjà publics** dans le CSS du site. La **source** (review.js, générateur du
> catalogue) vit dans le repo privé `Devodia/odoo-biences`.

## Installation (relecteur)

1. Installer l'extension **Tampermonkey** (Chrome Web Store → « Ajouter à Chrome »).
2. Ouvrir ce lien : **https://raw.githubusercontent.com/Devodia/biences-design-review/main/biences-design-review.user.js**
3. Tampermonkey détecte le userscript et propose **« Installer »**. C'est tout.

L'outil s'active automatiquement sur les builds de test (`*.dev.odoo.com`). Pour
l'éteindre pendant une navigation normale : bouton **⏸ Suspendre** dans le
panneau, raccourci **Alt+R**, ou le toggle du script dans l'icône Tampermonkey.

## Mise à jour automatique

Le userscript porte `@updateURL` / `@downloadURL` pointant vers le raw de ce
repo. Tampermonkey re-vérifie périodiquement : dès que `@version` est incrémenté
ici, la version du relecteur se met à jour **toute seule**. Rien à réinstaller.

## Utilisation

- **Survol** : le panneau montre les classes de l'élément (résolution parent — la
  classe est cherchée sur l'ancêtre stylé, pas le nœud texte feuille).
- **Clic** : sélectionne l'élément (contour orange) → agir dans le panneau :
  - **🔁 Remplacer** — chercher une classe DS validée, survol = aperçu live.
  - **✨ Ajouter au DS** — sur une classe candidate (proposée / neuve).
  - **📝 Note** — texte libre.
- **Exporter** : télécharge un JSON (+ copie presse-papier) — un objet par retour
  (`verdict`, classes, `css_path`, `text_anchor`, `viewport`…), directement
  actionnable côté dev.

## Mise à jour (mainteneur)

1. Modifier la source (repo privé) et/ou régénérer le catalogue.
2. Rebuild du `.user.js`, **bump `@version`**.
3. Commit + push ici → Tampermonkey propage aux relecteurs (quelques minutes).
