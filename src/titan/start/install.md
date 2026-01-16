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
- Dart
  - 3.9.2 ou plus
- Flutter
  - 3.38 ou plus

Pour pouvoir lancer Titan sur différentes plateforme, il te faut les outils suivants :

- Chrome pour le web
- Android Studio pour Android
- XCode pour IOS

Pour vérifier que tout est bien installé, lance

```zsh
flutter doctor
```

## 2. Installe les dépendances

Rien de plus simple :

```zsh
flutter pub get
```

## 4. Complète le _dotenv_ (`.env`)

:::: important

Commence par copier le `.env.template` dans un `.env`

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

### Le fichier `.env`

::: info

Le `.env` contient les variables d'environnement qui peuvent être accédées par l'application, à savoir les URL des Hyperions sur lesquel Titan doit se connecter

:::

Si tu travailles en local, change DEV_HOST pour pointer sur l'adresse d'Hyperion que tu souhaite atteindre

## 5. Lance l'app

Assez simple

```zsh
flutter run
```

Tu peux te connecter via CalypSSO avec le compte que tu as créé côté Hyperion, et voilà !
