---
title: Bonnes pratiques
order: 2
category:
  - Guide
---

## Être concis et compréhensible

- Certes on peut faire de jolis rendus avec ce thème.
  Mais le fond reste plus important que la forme.
- Faire plein de petites pages, chacun traitant d'un point spécifique.
  Si un prétendant, ÉCLAIRman ou sage _scrolle_ sur cette documentation, c'est terminé.
- Ne pas balancer des dizaines de lignes de code sans explication.
  Se mettre dans les chaussures de quelqu'un qui n'y connaît rien au début et y aller incrémentalement.

## Formatter le projet

Si votre éditeur de texte ne le fait pas automatiquement :

:::tabs

@tab Tout formatter

```bash
npm run format .
```

@tab Formatter un dossier ou fichier

```bash
npm run format chemin/du/dossier/ou/fichier
```

:::

## Erreurs courantes de markdown augmenté

- Ne pas se servir d'un seul `#`, les sections principales commencent directement par `##`.
  Sinon la première section avec `#` n'apparaît pas dans le sommaire.
- Attention aux `:::`, il faut toujours une ligne vide avant et une après :

```md
Fin d'un paragraphe

::: tip

Voici un conseil

:::

Début d'un paragraphe
```

## Mots anglais

A mettre en italique _please_.

## _Assets_

- Dans `src/.vuepress/public`,
- puis on utilise un dossier par guide, et un dossier `common` pour factoriser les _assets_ communs.

::: info Exemple

Le logo d'ÉCLAIR se trouve à [`src/.vuepress/public/common/logoeclair.svg`](/common/logoeclair.svg)

:::
