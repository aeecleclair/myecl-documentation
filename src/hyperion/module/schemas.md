---
title: Schemas
order: 1
category:
  - Guide
---

Comme l'a dit le grand Linus Torvalds, le truc à faire en premier c les structures de données.

Donc faut traiter des schema, expliquer que c la lingua franca d'Hyperion (à partir de l'endpoint et dans toute la trace qui en découle (la vie de l'endpoint), toute la communication se fait avec des schemas (tu reçois un schema de FastAPI ds les endpoints, tu envoies un schema aux CRUDs, donc les CRUDs "comprennent" les schemas et ils gèrent intérieurement la conversion avec les modèles).

Expliquer des bases de Pydantic et de validation (c littéralement Zod en python hein).

Et tjs donner des exemples c important. Et expliquer qu'il faut souvent un plusieurs modèles pour 1 "type logique", genre un TrucBase, un TrucEdit et un TrucComplete, et expliquer que l'héritage c important.

Un petit point sur le principe de Liskov peut éclaircir des doutes sur la validité d'un supertype.

Expliquer pk le typage fort et statique c cool pour catch pleins d'erreurs, avoir de l'intellisense propre, et valider les données une seule fois à l'entrée (un article cité par Zod que je n'ai plus en tête sur la validation en Haskell).
