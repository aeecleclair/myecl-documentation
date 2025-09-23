---
title: Endpoints
order: 3
category:
  - Guide
---

Mtn qu'on a les structures de données, on passe à tout ce qui est business logic donc endpoints et cruds. Honnêtement je sais pas ds quel ordre on les présente...

Les endpoints c là où on utilise le router FastAPI, faut expliquer que le @ c un décorateur faut pas en avoir peur c de la composition de fonction, faut parler des codes d'erreurs (les classes 200 à 500, et certains spécifiques qu'on utilise souvent comme 403, 404, 422, etc), expliquer que c là que les données qui entrent et sortent d'Hyperion sont validées (d'où le 422 si on envoie de la merde).

Peut-être le fait que le JSON correspond à une classe avec que des attributs c pas obvious.

Faire un point sur les dependencies, c comme ça qu'on récupère l'user qui a émis la requête, et la (session à la) db.

A propos de db, c là qu'on appelle les cruds (ça sera la page d'après) et qu'on utilise nos meilleurs `db.flush()`.

Ms faut appuyer sur le fait que les endpoints c là que se trouve quasiment toute la logique (la business logic, je crois que c "logique métier" en Fr ms ça sonne pas ouf), donc la plupart des lignes d'un endpoint c vérifier que telle et telle condition est bien remplie, que tel truc est ou n'est pas None, et pour gérer ces cas on sort nos meilleurs HTTPException : c des exceptions Python (donc qui font terminer la fonction) et ça renvoie à l'extérieur le code d'erreur qu'on a choisi.
