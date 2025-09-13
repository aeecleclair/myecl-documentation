---
title: CRUDs
order: 4
category:
  - Guide
---

Donc mtn les cruds, c le 4e pilier d'un module, ça prend en entrée des schemas (cf "lingua franca") et ça fait des requêtes SQL à la db (via l'ORM de SQLAlchemy qui parle les models et pas les schemas).

Ça permet de cacher aux endpoints (donc à la logique) l'accès à la db en le masquant dans ces fonctions.

A nouveau le SQL franchement c pas compliqué y a tjs 4 verbes (d'ailleurs faudrait mettre une page de grands principes où on explique que les 4 verbes HTTP (post, get, patch, delete), l'acronyme derrière CRUD (create read update delete) et les 4 verbes sql (insert select update delete) c la mm structure), ce verbe s'applique à une table, puis on peut faire des .where() dessus où on met des conditions pour filtrer, on peut faire des jointures avec d'autres tables qd elles se partagent une colonne, et du selectinload pour faire une requête sur le résultat d'une requête.

Comme le SQL c N! fois + rapide faut éviter de faire les opérations en Python.

Et à la fin oui faut convertir en Python donc .scalars() puis en général soit .all() pr tout avoir (ça fait une liste) soit .first_or_none() (ça renvoie 1 élément ou rien).

Penser à rappeler que le crud en a aucune idée qu'il est derrière une API HTTP (le crud pourrait très bien être appelé par un script, un logiciel, ...) donc hors de question de raise une HTTPException ds les cruds ou quoi que ce soit qui suppose un contexte HTTP.

Par contre on peut faire des try-except sur les cruds, si on peut s'attendre à une erreur d'intégrité (et expliquer ce que ça peut être, typiquement c lié à des truc unique en double ou des mapped qui ne se correspondent plus).

En vrai je crois que là on tient bien l'essentiel des cruds.
