---
title: Jointures
order: 1
category:
  - Guide
---

## Introduction

Nous allons dans ce guide aborder les jointures qui s'avèrent très utiles lors de la création d'un module sur Hyperion.

## Exposition d'un problème courant

::: warning Probleme de performance

Les jointures peuvent rapidement devenir complexes et impacter les performances. Utilisez les bonnes jointures et avec parcimonie.

:::

Il existe deux types de jointures :

- Jointures explicites
- Jointures implicites

### Jointures explicites

En effectuant une seule requête SQL. C'est une jointure que vous feriez de manière naturelle en SQL.

```sql
SELECT *
FROM users
LEFT JOIN todos ON users.id = todos.user_id
WHERE users.username = 'john_doe';
```

### Jointures implicites

En revanche lorsque vous travaillez avec SQLAlchemy, celui-ci peut réaliser des jointures implicites sans que vous en soyez conscient. SQLAlchemy va finalement réaliser une multitude de requêtes SQL.

```sql
SELECT *
FROM users
WHERE users.username = 'john_doe';
```

```sql
SELECT *
FROM todos
WHERE todos.user_id = (SELECT id FROM users WHERE users.username = 'john_doe');
```

C'est pas pour autant que les jointures implicites sont à bannir, cela dépend du cas d'usage

### Pseudo conclusion

Nous avons vu qu'il existe deux types de jointure, l'une réalisé au niveau de sqlalchemy et l'autre au niveau de sql. En pratique, il faut choisir le meilleur moyen de faire en fonction du cas d'utilisation.

Il existe deux critères :

- La type de relation utilisée
    - One-to-one
    - One-to-many / Many-to-one
    - Many-to-many
- La condition d'accès aux données
    - Accès certains aux données issues de la relation
    - Accès probable aux données issues de la relation

## Les relations one-to-one

## Les relations one-to-many

## Les relations many-to-many
