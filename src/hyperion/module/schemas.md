---
title: Schemas
order: 1
category:
  - Guide
---

Comme l'a dit le grand Linus Torvalds[^1] :

> _Bad programmers worry about the code. Good programmers worry about data structures and their relationships._

Donc faut traiter des schema, expliquer que c la lingua franca d'Hyperion (à partir de l'endpoint et dans toute la trace qui en découle (la vie de l'endpoint), toute la communication se fait avec des schemas (tu reçois un schema de FastAPI ds les endpoints, tu envoies un schema aux CRUDs, donc les CRUDs "comprennent" les schemas et ils gèrent intérieurement la conversion avec les modèles)).

Expliquer des bases de Pydantic et de validation (c littéralement Zod en python hein).

Et tjs donner des exemples c important. Et expliquer qu'il faut souvent un plusieurs modèles pour 1 "type logique", genre un TrucBase, un TrucEdit et un TrucComplete, et expliquer que l'héritage c important.

Un petit point sur le principe de Liskov[^2] peut éclaircir des doutes sur la validité d'un supertype.

Expliquer pk le typage fort et statique c cool pour catch pleins d'erreurs, avoir de l'intellisense propre, et valider les données une seule fois à l'entrée[^3].

[^1]: [Mail original (sur LWN)](https://lwn.net/Articles/193245)

[^2]: [Principe de substitution de Liskov](https://fr.wikipedia.org/wiki/Principe_de_substitution_de_Liskov)

[^3]: [_Parse, don't validate_](https://lexi-lambda.github.io/blog/2019/11/05/parse-don-t-validate/), cité dans [l'intro de Zod v3](https://v3.zod.dev/?id=introduction)
