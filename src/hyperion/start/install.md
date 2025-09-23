---
title: Installation et configuration initiale
order: 2
category:
  - Guide
---

install et config : comment lancer Hyperion, et une fois Hyperion lancé, expliquer à quoi servent les principaux champs du `config.yaml` et du `.env`

Bienvenue dans la documentation de Hyperion, le back-end de MyECL. Ce guide vous aidera à faire vos premiers pas avec Hyperion et à comprendre ses fonctionnalités de base.

## Qu'est-ce qu'Hyperion ?

Hyperion est une application back-end conçue pour gérer les contenus et les utilisateurs de MyECL ainsi que des services annexes comme la chaine de rentrée et le système d'authentification SSO[^sso-note]. Il offre une interface API RESTful pour interagir avec les données et les services.

[^sso-note]: Pour plus d'informations sur l'authentification Single Sign-On (SSO), voir : /hyperion/authentification-sso/

## Qu'est-ce qu'une API RESTful ?

Une API RESTful (Representational State Transfer) est un style d'architecture pour les services web qui utilise les protocoles HTTP pour effectuer des opérations sur les ressources. Les principales caractéristiques d'une API RESTful incluent :

- Utilisation des verbes HTTP (GET, POST, PUT, DELETE) pour effectuer des opérations sur les ressources.
- Identification des ressources via des URI (Uniform Resource Identifier).
- Représentation des ressources au format JSON.
- Statelessness : chaque requête du client au serveur doit contenir toutes les informations nécessaires pour comprendre et traiter la requête.

## Prérequis : Installation de Git

::: warning Vérification

Avant de commencer, assurez-vous que Git est installé sur votre système. Vous pouvez vérifier cela en exécutant la commande suivante dans votre terminal :

```bash
git --version
```

Si Git est installé, vous devriez voir quelque chose comme `git version 2.x.x`.

:::

:::tabs

@tab Github Desktop

Si Git n'est pas installé sur votre système, nous vous recommandons d'installer Github Desktop, qui inclut Git et offre une interface utilisateur graphique pour gérer vos dépôts Git. Vous pouvez le télécharger depuis [le site officiel de GitHub Desktop](https://desktop.github.com/).

@tab Fork

Vous pouvez également installer Fork qui est une alternative à Github Desktop plus complète, disponible sur [le site officiel de Fork](https://git-fork.com/).

@tab Git CLI

Si vous préférez utiliser les lignes de commandes uniquement, vous pouvez installer Git en suivant les instructions sur [le site officiel de Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git).

:::

::: tip Configuration initiale

Après l'installation de Git, il est recommandé de configurer votre nom d'utilisateur et votre adresse e-mail :

```bash
git config --global user.name "Votre Nom"
git config --global user.email "votre.email@example.com"
```

:::

## Cloner le dépôt Hyperion

Une fois Git installé et configuré, vous pouvez cloner le dépôt Hyperion en utilisant la commande suivante :

```bash
git clone https://github.com/aeecleclair/hyperion.git
```

## Suivre les instructions d'installation du README

Après avoir cloné le dépôt, naviguez dans le répertoire du projet et suivez les instructions d'installation fournies dans le fichier `README.md`. Cela vous guidera à travers le processus de configuration et d'installation d'Hyperion.
