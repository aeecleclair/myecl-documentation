---
title: Créer une app Flutter
order: 4
category:
  - Guide
---

# Créer une application avec Flutter

L'objectif de ce document est de présenter Dart et Flutter, de comprendre la logique du language et de pouvoir créer des modules sur MyEcl

## Installation des outils

L'objectif de cette partie est de résumer l'installation et la création d'une première application Flutter

### Installation de l'émulateur

- Télécharger Android Studio (<https://developer.android.com/studio>)
- Installer Android Studio
- Lancer Android Studio et ouvrir ADV Manager (l'icône de smartphone avec le logo Android)
- Sur la nouvelle page cliquer sur "Create Virtual Device" en bas à gauche
- Cliquer sur "New Hardware Profile" et rentrer les informations importantes comme le nom et la résolution et cliquer sur "Next"
- Choisir la version d'Android qui convient (éviter les toutes dernières pour la rétrocompatibilité) et cliquer sur "Next"
- Cliquer sur "Finish"
- Fermer Android Studio

(Pour Mac, la procédure devrait être similaire)

### Installation de Flutter

- Télécharger Flutter (<https://docs.flutter.dev/get-started/install>) et suiver son guide d'installation
- Vérifier que tout fonctionne avec la Order `flutter doctor` et regarder si Android Studio apparait dans la liste

## Installation de quelques extensions VSCode utiles

- Dart
- Flutter
- Flutter Widget Snippets
- Pubspec Assist

## Lancement du projet

- Lancer la commande `flutter create <nom de l'application>`
- Accéder au dossier crée avec `cd <nom de l'application>`
- Tout en bas à droite, cliquer sur la case "no device", puis sélectionner l'émulateur crée
- Vérifier que tout fonctionne normallement en lançant l'application avec `flutter run --no-sound-null-safety`

## Première application

Pour modifier l'application, ouvrir le fichier `/lib/main.dart` et modifier le code suivant :

```dart
import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: const MyHomePage(title: 'Flutter Demo Home Page'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  const MyHomePage({Key? key, required this.title}) : super(key: key);

  final String title;

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  int _counter = 0;

  void _incrementCounter() {
    setState(() {
      _counter++;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.title),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            const Text(
              'You have pushed the button this many times:',
            ),
            Text(
              '$_counter',
              style: Theme.of(context).textTheme.headline4,
            ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: _incrementCounter,
        tooltip: 'Increment',
        child: const Icon(Icons.add),
      ),
    );
  }
}
```

Ce code contient de nombreux éléments que les parties suivantes vont détailler.
