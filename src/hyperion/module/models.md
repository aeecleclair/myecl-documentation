---
title: Models
order: 2
category:
  - Guide
---

Contraster les models : c les mm "types logiques" que les schemas, mais avec une perspective différentes : le modèle c le schéma d'une table SQL, donc la perspective est un peu différente, avec la notion de ligne (enregistrement) qui fait qu'on ne peut pas stocker une liste telle quelle pour faire du one-to-many, mais le fait que c relationnel c comme ça qu'on fait du one-to-many.

Expliquer donc des bases de SQLAlchemy, que le SQL c pas spécialement compliqué, parler du typage avec Mapped et des principales options de mapped_column (foreign key, index, unique, nullable, tout ce qui touche aux jointures, (relationship, lazy join, ...), ...).

Ah aussi : se rappeler que BaseModel c la classe Pydantic de base pour les... schemas !
