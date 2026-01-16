---
title: Installer une librairies
order: 6
category:
  - Guide
---

# Installer des librairies externes

Avant de continuer, il est nécessaire de savoir installer des librairies externes, car elles éviteront de recréer des Widgets déjà existant.

Nous allons installer une librairie externe, nommée _flutter_hooks_ indispensable pour la partie suivante.

Pour ce faire, il faut ouvrir le fichier `pubspec.yaml` dans le dossier de l'application.

Il y a ensuite deux manière de faire :

- Manuellement :

  - Rechercher la dernière version de la librairie dans le [repository](https://pub.dev/packages/flutter_hooks)

  - L'ajouter au fichier `pubspec.yaml` en ajoutant la ligne fléchée suivante :

  - ```yaml
        flutter:
          sdk: flutter

       -> flutter_hooks: <La version trouvée>

          cupertino_icons: ^0.1.0
    ```

  - Puis de lancer la commande `flutter pub get`

- A l'aide d'une extension VSCode:

  - Installer l'extension **Pubspec Assist**
  - Lancer la et rechercher `flutter_hooks`
  - L'extension va automatiquement installer la librairie `flutter_hooks`
  - Puis de lancer la commande `flutter pub get` ou de cliquer sur l'icône de téléchargement en haut à droite de la fenêtre du fichier.
