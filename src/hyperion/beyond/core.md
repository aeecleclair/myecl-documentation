---
title: Plus loin...
order: 10
category:
  - Guide
---

A partir de là c du vrac sur la suite :

## Auth

- CalypSSO
- le SSO OIDC avec nos auth clients
- cmt marche le flow d'authentification

## db

- migrations
- CoreData

## Service externe

Un point sur chaque service externe utilisable

- PostgreSQL/SQLite
- ReDis
- HelloAsso, le S3
- TMDb
- Firebase
- mails
- Matrix/Synapse

## FS

- assets
- cmt enregistrer et récup des fichiers (affiches du ciné, pdfs du ph, dossiers du RAID)

## Code quality, CI/CD

- tests
- ruff et mypy

## Autres

- un point sur MyECLPay
- le core que j'ai pas encore mentionné
- l'utilité de chaque info ds le `config.yaml` ou le `.env`
- l'utilité du `__init__.py`
- cmt utiliser les notifs ou l'envoi de mail en les retardant avec le scheduler
- les websockets
- loggers avec log levels
- initialisation de l'app (que se passe-t-il sous le capot qd on lance le projet)
- expliquer pk on a 2 Dockerfiles pour garder la mm base (juste les imports sans notre code)
