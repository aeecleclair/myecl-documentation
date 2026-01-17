---
title: Widget Customs
order: 2
category:
  - Guide
---

# Les Widgets custom de Titan

## Contexte

### Pourquoi les avoir créés ?

Ces Widgets ont pour but de faire gagner du temps à tous ceux qui veulent travailler sur Titan, en évitant d'avoir à copier coller des bouts de code d'autres modules, ce qui peut entraîner des erreurs et une redondance. Ils fournissent aussi une abstraction de certaines fonctionalités qui peuvent être complexe.
La PR (Pull Request) qui a créé ces Widget a réduit la taille de code d'environ 7000 lignes soit 15% de la taille du projet.

### Comment en ajouter ?

Il faut considérer la création d'un Widget custom dès qu'un groupe de Widget est répété au moins deux fois, avec quelques changements (par exemple la carte d'un objet, qui put avoir ou pas des boutons).
De là, deux cas de figure :

- Soit ce Widget est exclusif au module, alors il doit être placé dans le dossier ui/components du module.
- Soit l'ensemble de Widget dont on veux créer un Widget custom existe déjà (ou presque) dans au moins un autre module, alors ce Wdiget custom peut être ajoutés au Widget custom de Titan, en le plaçant là où il doit (la différence entre les trois dossier est expliquée plus tard). Cet ajout doit faire l'objet d'une PR.
- Si le Widget à créer se rapproche énormément d'un Widget existant, alors les modifications peuvent être directement faites sur ce Widget custom. Cette modification doit également faire l'objet d'une PR, ainsi que d'une vérification des utilisations de l'ancienne version du Widget et d'une mise à jour de cette documentation.

## Documentation

Les différents Widgets sont répartis en trois catégories, en fonction des paramèters qu'ils acceptent.
Les nombres d'utilisations ont été pris au moment où la branche qui a créé tous ces Widgets à été merge. Ils sont là pour indiquer la fréquence d'utilisation et donner une idée desquels ils seraient bon de matrîser au plus vite.
