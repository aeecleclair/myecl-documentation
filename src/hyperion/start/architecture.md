---
title: Architecture
order: 3
category:
  - Guide
---

A la fois

- l'archi à l'échelle du repo (des fichiers à la racine, des migrations, des tests, des assets, des modules, du core, des utils, etc)
- et un point spécifique sur l'archi d'un module

## Architecture à l'échelle du _repository_

- app/ : dossier principal, c'est là le code qui fait tourner tout le back-end
  - modules/ : l'ensemble des modules de MyECL
    - un dossier par module, chacun ayant la même architecture architecture. Voir la section suivante pour des détails.
      - cruds_nom.py
      - endpoints_nom.py
      - models_nom.py
      - schemas_nom.py
  - core/ : le noyau du projet, difficile à appréhender. La plupart des dossiers du core correspondent en fait à un module core, en ceci qu'ils ont la même architecture qu'un module
  - utils/ : des fonctions utilitaires pour différents services (auth, notifs, mails, les logs, ...)
  - api.py : l'instanciation du routeur, dans lequel le routeur de chaque module s'inclut
  - app.py : le fichier le plus critique d'Hyperion, c'est ici tout est initialisé
  - dependencies.py : fonctions qui gèrent la communication avec les services (base de données, websockets, notifs, paiement, mails, ...)
  - main.py : le point d'entrée (_entrypoint_) d'Hyperion, c'est ce fichier qui est appelé en ligne de commmande pour lancer Hyperion.
- migrations/ : une migration [de base de donnée] est une modification de sa forme ou de son contenu, par exemple on crée une colonne, une table, ou on supprime, ou on fait des modifications sur le contenu
  - versions/ : un dossier par migration, chacune ayant un numéro, car il faut maintenir la "version" de la base de données qu'on utilise.
    - N-nom.py
- tests/ : un fichier par module à tester.
  - test_module.py
- assets/ : les images, pdf, txt et autres fichiers statiques ("constants") prêts à être _servis_ tels quels le serveur.
-

Version pas propre là-dessous :

L'architecture d'Hyperion est la suivante :

- Plein de fichiers de config à la racine
  - .env.template
  - config.template.yaml
  - .gitignore
  - alembic.ini
  - docker-compose.yaml, docker-compose-dev.yaml, Dockerfile, Dockerfile.base
  - pyproject.toml
  - requirements-common.txt, requirements-dev.txt, requirements-prod.txt
- Des dossiers spécifiques à un service
  - .git/
  - .github/
    - workflows/
  - .vscode/
- Et enfin quatre dossiers avec du Python
  - app/
  - assets/
  - migrations/
  - tests/

## Architecture d'un module

- `cruds_nom.py`
- `endpoints_nom.py`
- `models_nom.py`
- `schemas_nom.py`
