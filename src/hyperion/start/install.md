---
title: Installation et configuration initiale
order: 2
category:
  - Guide
---

## 0. Stack recommandée

- Git
- Fork (optionnel)
- VS Code (ou autre éditeur de texte)
- Python
  - 3.14
  - 3.13 ou 3.12 (toujours supporté)

## 1. Création d'un _environnement virtuel_ (venv) pour Python 3.14

Ouvre un terminal dans le dossier `Hyperion` (`Ctrl + J` sur VS Code)

:::: tabs#os

@tab Windows#win

Crée un environnement virtuel :

```ps1
py -3.14 -m venv .venv
```

::: details Si tu as une erreur...

...disant grossièrement :

```
because the execution of scripts is disabled on this system. Please see "get-help about_signing" for more details.
```

Alors lance ça (dans un Powershell) pour autoriser l'exécution de scripts pour ton _user_ :

```ps1
Set-ExecutionPolicy Unrestricted -Scope CurrentUser
```

:::

Active-le :

```ps1
.\.venv\Scripts\activate
```

@tab macOS (avec Pyenv)#mac

Installe Pyenv:

```zsh
brew install pyenv
brew install pyenv-virtualenv
```

Modifie ton `~/.zhsrc` et ajoute à la fin du fichier :

```zsh
eval "$(pyenv init -)"
eval "$(pyenv virtualenv-init -)"
```

Crée l'environment virtuel :

```zsh
pyenv virtualenv 3.14.2 hyperion
```

Activae-le :

```zsh
pyenv activate hyperion
```

@tab Linux#linux

::: warning WIP
:::

::::

## 2. Installe les dépendances

::: details Windows seulement

### A propos de Jellyfish et de Rust

Si tu n'as pas Rust installé sur ton PC Windows ou ne veux pas l'installer, diminue la version le `jellyfish` à `0.10.0` dans le fichier `requirements.txt` :

```
jellyfish==0.10.0                    # String Matching
```

:::

### A propos de Weasyprint et Pango

Suis les étapes d'installation à :
https://doc.courtbouillon.org/weasyprint/stable/first_steps.html#installation.

:::: tabs#os

@tab Windows#win

La meilleure façon est avec MSYS2.

@tab macOS#mac

Tu peux simplement l'installer avec Homebrew.

@tab Linux#linux

::: warning

WIP

:::

::::

### Installe les dépendances (pour de vrai)

Installe les dépendances (modules Python) dont tu auras besoin avec `pip` (les _requirements_ communs à tous les environnements sont inclus dans les _requirements_ de dev):

```bash
pip install -r requirements-dev.txt
```

::: details Windows seulement

Si tu avais changé la version de Jellyfish, n'oublie pas de la remettre après:

```
jellyfish==1.0.4                    # String Matching
```

:::

::: info Si tu as besoin de retier tous les modules de ton venv, supprime le dossier `.venv`.
:::

### Installe les extensions VS Code recommandées

Si tu utilises VS Code, tu verras sûrement des extensions recommandées (Extensions > Recommandées).
Elles sont "recommandées" car VS Code les lit dans [.vscode/extensions.json](https://github.com/aeecleclair/Hyperion/blob/main/.vscode/extensions.json), ce sont les extensions que nous utilisons.

::: tip Installe-les !
:::

Pour le _lint & format_, on utilise actuellement `Ruff`. On utlise aussi `Mypy` pour le _type checking_ (typage).

::: info

Avant chaque PR GitHub ou `git push`, tu devrais idéalement lancer :

```sh
ruff check --fix && ruff format
```

afin de lint&format ton code, et :

```sh
mypy .
```

afin de vérifier qu'il n'y a aucune erreur de type.

:::

## 3. Installe et configure une base de données (db)

### Choisis soit SQLite ou PostgreSQL

:::: details Avantages et inconvénients

::: tabs#db

@tab SQLite#sqlite

#### Avantages

C'est un exécutable (_binary_).
Ce qui veut dire:

- SQLite is _lite_ (léger)
- C'est compris directement par ta machine, aucune config spéciale n'est nécessaire.

#### Inconvénients

Etant si léger, ça ne supporte pas certaines _features_ (fonctionnalités) communes de nos jours pour les db relationnelles :

- Drop la db à chaque migration : Alembic utilise des features incompatibles avec SQLite

@tab PostgreSQL#psql

#### Avantages

Ses avantages sont nombreux :

- db très puissante : ça supporte toutes les features dont tu auras jamais besoin.
- Utilisé en prod pour Hyperion.
- Largmenet utilisé en prod dans des services "enterprise-grade" : compétence utile sur le CV.
- Supporte les migrations avec Alembic.
- Un outil en CLI (_Command Line Interface_, ligne de commande) puissant.

#### Inconvénients

Aucun (pas si lourd, config pas si dure).

:::

::::

### Installation et configuration

::::: tabs#db

@tab SQLite#sqlite

Il n'y a rien à faire,

There is nothing to do, ça marche directement.

@tab PostgreSQL#psql

:::: details Sans Docker: exécutables natifs

1. Télécharge l'installeur: https://www.enterprisedb.com/downloads/postgres-postgresql-downloads
2. Lance-le et fais confiance au _wizard_
   - Garde les dossiers et ports par défaut, installe-le en entier, etc...
   - ...mais mets un mot de passe concis dont tu te souviendras, choisis ta langue
   - N'utilise pas le "Stack Builder" (pas nécessaire)
3. Sur Windows: dans ton path, ajoute `C:\Program Files\PostgreSQL\17\bin` et `C:\Program Files\PostgreSQL\17\lib` (si tu as installé Postgres 17 à cet endroit)
4. Crée une db nommée `hyperion` :

```ps1
psql -U postgres -c "create database hyperion;"
```

::: Démystifions la casse en SQL

Les mots-clefs SQL ne insensibles à la casse par convention.
Pas besoin d'écrire `CREATE DATABASE hyperion;`

:::

::: info Note pour plus tard

Maintenant ta db Hyperion peut être explorée à la main (en tant que le user `postgres`, en utilisant le mot de passe que tu as choisi) avec:

```ps1
psql -U postgres -d hyperion
```

puis en lançant des commandes SQL ou Postgres commands dans ce terminal, ou directement :

```ps1
psql -U postgres -d hyperion -c "select firstname from core_user;"
```

:::

::::

:::: details Avec Docker

::: warning WIP
:::

Installe Docker et le plug-in `compose` (https://docs.docker.com/compose/install/)

`docker-compose.yaml` inclut les settings minimaux requis pour lancer Hyperion en utilisant Docker compose.

::: tip

En dev, `docker-compose-dev.yaml` peut être utilisé pour lancer la db, le serveur Redis, etc...

:::

```yml {12-16} title="docker-compose.yml"
services:
  hyperion-db:
    image: postgres:15.1
    container_name: hyperion-db
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB}"]
      interval: 5s
      timeout: 5s
      retries: 5
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_HOST: ${POSTGRES_HOST}
      POSTGRES_DB: ${POSTGRES_DB}
      PGTZ: ${POSTGRES_TZ}
    ports:
      - 5432:5432
    volumes:
      - ./hyperion-db:/var/lib/postgresql/data
```

::: info Note pour plus tard

Maintenant ta db Hyperion peut être explorée à la main avec :

```bash
docker exec -it hyperion-db psql -U ${POSTGRES_USER} -d ${POSTGRES_DB}
```

puis en lançant des commandes SQL ou Postgres dans ce terminal, ou directement :

```bash
docker exec -it hyperion-db psql -U ${POSTGRES_USER} -d ${POSTGRES_DB} -c "select firstname from core_user;"
```

:::

::::

:::::

## 4. Complète le _dotenv_ (`.env`) et le `config.yaml`

:::: important

Commence par copier le `.env.template` dans un `.env`, de même copie le `config.template.yaml` dans un `config.yaml`.

::: tabs#os

@tab Windows#win

```ps1
cmd /c "cp .env.template .env && cp config.template.yaml config.yaml"
```

@tab macOS#mac

```zsh
cp .env.template .env && cp config.template.yaml config.yaml
```

@tab Linux#linux

```bash
cp .env.template .env && cp config.template.yaml config.yaml
```

:::

::::

::: tip A savoir

Ces fichiers template ont été soigneusement élaborés pour marcher pour toi avec un minimum de changements personnels à apporter, et quelques services pré-configurés.

:::

::: info Pour référence

Ces _settings_ sont documentés dans [app/core/utils/config.py](https://github.com/aeecleclair/Hyperion/blob/main/app/core/utils/config.py).
Va voir ce fichier pour savoir ce qui peut et doit être remplir en utilisant ces deux fichiers.

:::

### Le fichier `.env`

::: info

Le `.env` contient les variables d'environnement qui peuvent être accédées par l'OS pour les transmettre à d'autres services qui en ont besoin, comme la db.

:::

:::: tabs#db

@tab Avec SQLite#sqlite

A nouveau, il n'y a rien à faire.

@tab Avec PostgreSQL#psql

Remplis ton user, mot de passe, host et db.

Par exemple, **avec l'installeur** tu devrais avoir quelque chose comme :

```sh title=".env"
POSTGRES_USER="postgres"
POSTGRES_PASSWORD=""
POSTGRES_HOST="localhost"
POSTGRES_DB="hyperion"
```

Tandis qu'**avec Docker** tu devrais plutôt avoir quelque chose comme :

```sh title=".env"
POSTGRES_USER="hyperion"
POSTGRES_PASSWORD=""
POSTGRES_HOST="hyperion-db" # Doit être égal au nom du conteneur postgres
POSTGRES_DB="hyperion"
```

::::

### Le fichier `config.yaml`

::: info

Le `config.yaml` contient les variables d'environnement qui sont internes au _runtime_ (environnement d’exécution) Python _car_ elles sont utilisées seulement dans le code Python.

:::

#### a. `ACCESS_TOKEN_SECRET_KEY` et `RSA_PRIVATE_PEM_STRING`

Un exemple de chaque est fourni.

::: tip

Tu peux générer les tiens sur tu veux.
Ou juste changer quelques caractères dans les exemples.
Ou délibérément les laisser tels quels.

:::

#### b. `SQLITE_DB`: **dit à Hyperion d'utiliser SQLite ou PostgreSQL**.

::: tabs#db

@tab SQLite#sqlite

Ce champ doit être un nom de fichier (relatif), par défaut on l'a nommé `app.db`, tu peux changer ce nom.

Hyperion va créer ce fichier pour toi et s'en servir comme db.
Toute config liée à PostgreSQL sera ignorée.

@tab PostgreSQL#psql

**Vide ce champ.**

Hyperion va retomber sur les settings PostgreSQL.

:::

#### c. `USE_FACTORIES`

`True` par défaut, les _factories_ sèment ta db, si elle est vide, avec des données _mockées_ (fausses mais réalistes).
C'est pratique sur SQLite pour repeupler ta nouvelle db après avoir drop la précédente,ou pour créer automatiquement ton propre user avec des privilèges admin (cf. `FACTORIES_DEMO_USERS` ci-dessous).

::: tabs#factories

@tab Je veux utiliser les factories#yes

#### d. `FACTORIES_DEMO_USERS`

**Remplace les données du premier user par les tiennes**.
Ces futurs users seront créés automatiquement en lançant Hyperion avec une db vide.
En outre, ton user sera là avec ton mot de passe et sera déjà admin.

@tab Je ne veux pas utiliser les factories#no

Mets `USE_FACTORIES` à False, le tuto sera plus long pour toi.

:::

## 5. Lance l'API

::: caution

Auparavant, vérifie que ton venv est activé.

:::

::: tabs

@tab Avec VS Code

1. Dans l'_activity bar_ (la partie la plus à gauche), clique sur l'icône _Run and Debug_ (le bouton play).
2. Clique sur le bouton play vert.

@tab Avec la ligne de commande (CLI)

```bash
fastapi dev
```

:::

::: tip Vérifie que ton instance d'Hyperion est up en allant sur http://localhost:8000/information.

:::

::: info Le Swagger

Une UI (_User Interface_) web appelée le Swagger est disponible à http://127.0.0.1:8000/docs.

C'est une surcouche interactive de la documetation automatique (la _spécification OpenAPI_) générée automatiquement à `http://127.0.0.1:8000/openapi.json`.

Pour l'authentification, cela devrait fonctionner directement en mettant `Postman` et `PostmanSecret`. Si ce n'est pas le cas regarde dans ton `config.yml` le champ `AUTH_CLIENTS`, avec `http://127.0.0.1:8000/docs/oauth2-redirect` parmi les redirect URI.

**Coche la case "API".**

:::

::::: tabs#factories

@tab J'utilise les factories#yes

Bravo ! Tu as déjà terminé l'installation et la configuration de ton Hyperion local !
Tu peux avancer dans la suite de la documentation.

@tab Je n'utilise toujours pas les factories

## 6. Crée ton propre user

Il y a au moins 5 façons distinctes de le faire sans passer par les factories, classées ici de la plus facile (~GUI, _Graphical User Interface_) à la plus dure (~CLI, _Command-Line Interface_).

::: important

Utiliser les factories est la manière recommandée.
Toutes les autres méthodes sont _legacy_ (ce sont d'anciennes méthodes), et gardées ici pour des raisons historiques (excepté avec Titan, qui est la manière dont les users créent leur compte en prod).
Si tu veux, crée d'autres users d'autres façons pour apprendre.

:::

::: tip

Remarque que la _registration_ ("Créer un compte") et l'activation (après la confirmation du mail) sont des étapes distinctes vis-à-vis des appels API, donc pour t'amuser tu peux te _register_ d'une façon puis activer ton compte d'une autre façon (si tu crées ton user directement en db, cette distinction n'est pas pertinente).

:::

:::: details Avec CalypSSO

#### Crée ton compte

Va sur http://localhost:8000/calypsso/register et écris une adresse email valide pour _register_ (créer) ton compte.

#### Active ton compte

Retourne dans le terminal qui exécute ton instance d'Hyperion, dans les logs cherche un lien qui ressemble à http://localhost:3000/calypsso/activate?activation_token=12345.
Ouvre-le et active (finis la création de) ton compte.

::::

:::: details Avec Titan

1. Clique "_Se connecter_" sur la page de login de Titan : tu arrives sur la page de login de CalypSSO.
2. Clique "_Créer un compte_" et crée ton compte en utilisant CalypSSO comme ci-dessus.

::::

:::: details Avec l'API via le Swagger

#### Crée ton compte

1. Va sur http://localhost:8000/docs: ça s'appelle le _swagger_, une interface web pour interagir avec l'API, c'est la couche par-dessus la "documentation automatique" (la _spécification OpenAPI_) générée par FastAPI à http://localhost:8000/openapi.json.
2. Cherche `/users/create` (`Ctrl + F`).
3. Ouvre-le, clique "Try it out".
4. Remplis ton adresse email, et clique "Execute".

#### Active ton compte

1. Retourne dans le terminal qui exécute ton instance d'Hyperion, dans les logs cherche un lien qui ressemble à http://localhost:3000/calypsso/activate?activation_token=12345.
2. Copie ce token d'activation.
3. Reviens sur le swagger et cherche `/users/activate`.
4. Ouvre-le, clique "Try it out".
5. Remplis tes infos, avec le `activation_token` que tu as copié (clique "Schema" à côté de "Edit Value" pour voir quels champs sont optionels), puis clique "Execute".

::::

:::: details Avec l'API en ligne de commande

::: tip Sur Windows

Sur Windows, `curl` est different.
Pour avoir les mêmes résultats que sur Linux et macOS (basés sur Unix) :

- Ou bien remplace `curl` par `curl.exe`
- ou lance les commandes `curl` ci-dessous dans un bash (avec WSL ou Git Bash)

:::

#### Crée ton compte

```bash
curl --json '{"email": "prenom.nom@etu.ec-lyon.fr"}' http://localhost:8000/users/create
```

#### Active ton compte

1. Retourne dans le terminal qui exécute ton instance d'Hyperion, dans les logs cherche un lien qui ressemble à http://localhost:3000/calypsso/activate?activation_token=12345.
2. Copie ce token d'activation.
3. Utilise ce `activation_token` dans :

```bash
curl --json '{
    "name": "<Nom>",
    "firstname": "<Prénom>",
    "nickname": "<Surnom centralien>",
    "activation_token": "<Token d activation>",
    "password": "<Mdp>",
    "birthday": "<2019-08-24>",
    "phone": "<N° de téléphone>",
    "promo": 0,
    "floor": "Etage centralien"
}' http://localhost:8000/users/activate
```

::::

:::: details Avec un client de db en ligne de commande

::: warning Work in progress
:::

1. Ouvre un terminal connecté à ta db pour Hyperion
   - PostgreSQL: cf. ci-dessus, généralement `psql -U <username> -d hyperion`.
   - SQLite: ...
2. _Insère_ ton propre user \*dans\*\* la table des users (pour la school `centrale_lyon`, génère ton propre user UUID et hash salé, si tu veux insère des valeurs dans les colonnes nullables) :

```sql
insert into core_user (id, firstname, name, nickname, email, password_hash, school_id, account_type) values ('01234567-89ab-cdef-0123-456789abcdef', '<Prénom>', '<Nom>', '<Surnom centralien>', '<email>', '$2b$<longueur du sel>$<lehashsalédetonmdp>', 'd9772da7-1142-4002-8b86-b694b431dfed', 'student');
```

::::

## 7. Rend admin ton user

::: important

A nouveau, se servir des factories est la manière recommandée.

:::

:::: details S'il y a exactement un user dans la db

Alors tu peux le rendre admin avec la commande suivante :

```bash
curl -X POST http://localhost:8000/users/make-admin
```

::::

:::: details Avec un client de db en ligne de commande

::: warning WIP
:::

1. Ouvre un terminal connecté à ta db pour Hyperion
   - PostgreSQL: cf. ci-dessus, généralement `psql -U <username> -d hyperion`.
   - SQLite: ...
2. Obtiens le UUID de ton propre user, puis insère-le et le UUID du GroupType admin dans la table des memberships :

```sql
insert into core_membership (user_id, group_id) values ('<Ton user_id>', '0a25cb76-4b63-4fd3-b939-da6d9feabf28');
```

::::

:::::
