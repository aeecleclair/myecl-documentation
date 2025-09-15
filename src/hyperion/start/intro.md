---
title: "Introduction: pourquoi et quoi ? Concepts fondamentaux"
order: 1
category:
  - Guide
---

## Pourquoi Hyperion existe-t-il ?

Dans n'importe quelle application mobile ou site web, il faut que les utilisateurs interagissent, ce qui implique une communication avec un serveur distant.
Ce serveur distant sert à stocker les données pour que le service (site ou application) fonctionne, et il traite ces données.

L'application sur votre téléphone, ou le site [myecl.fr](https://myecl.fr), sert seulement d'interface graphique (_GUI: Graphical User Interface_) pour afficher joliment des informations **devant** l'utilisateur final (_end-user_). Ceci s'appelle le côté client, mais tout le monde dit _front-end_.
Le serveur distant, à l'adresse [hyperion.myecl.fr](https://hyperion.myecl.fr/docs), est le "cerveau" qui applique la logique métier (_business logic_) du service aux données en communiquant avec une base de données et avec front-ends est caché à l'_end_user_ derrière, s'appelle le côté serveur, mais tout le monde l'appelle le _back-end_.

En fait, les mots "front-end" et "back-end" sont si courants qu'on ne va même plus les mettre en italique dans la suite.
À ÉCLAIR, le front-end s'appelle Titan, et le back-end Hyperion. Titan est la plus grosse lune de Saturne, et Hyperion orbite en résonance avec Titan. En fait, bien des choses à ÉCLAIR sont nommées d'après des satellites naturels de Saturne, d'où le logo de MyECL.

![Flux de données entre l'utilisateur final et la base de données](/hyperion/communication-flows.png)

::: warning

Faut faire un mermaid qui illustre juste ce qu'y a là-haut : end-user, front-end, back-end, db, point final.

:::
