---
title: Les Hooks
order: 7
category:
  - Guide
---

# Les Hooks

Leur principale utilisation est de simplifier la gestion des états en s'affranchissant des `StatefulWidgets`. Ils seront utilisés pour des variables limitées à un seul fichier .dart, principalement des formulaires ou des animations.

L'idée est de créer une variable dont on peut modifier la valeur, et que cette modification entraîne un reconstruction de la page.

```dart
final compteur = useState(0); // compteur est un Hook
print(compteur.value); // 0
compteur.value = 1; // modifie la valeur de la variable
print(compteur.value); // 1
```

Il y a des Hooks spécifiques pour certaines utilisations :

- `useState` : permet de gérer les variables
- `useTextEditingController` : permet de gérer les champs de saisie de texte
- `useAnimationController` : permet de gérer les animations
- `usePageController` : permet de gérer les pages
- ...

L'utilisation des Hooks nécessite d'utiliser le package :

```dart
import 'package:flutter_hooks/flutter_hooks.dart';
```

et de transformer un `StateLessWidget` en `HookWdiget` :

Voici le code de l'application précédente, modifiée pour intégrer les Hooks :

```dart
class MyHomePage extends HookWidget {
  const MyHomePage({Key? key, required this.title}) : super(key: key);

  final String title;

  @override
  Widget build(BuildContext context) {
    final _counter = useState(0);
    return Scaffold(
      appBar: AppBar(
        title: Text(title),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            const Text(
              'You have pushed the button this many times:',
            ),
            Text(
              '${_counter.value}',
              style: const TextStyle(fontSize: 20),
            ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => _counter.value++,
        tooltip: 'Increment',
        child: const Icon(Icons.add),
      ),
    );
  }
}
```

On peut remarquer plusieurs choses dans ce nouveau code (qui donne la même application par ailleurs):

- Il n'y a plus qu'un seul Widget qui est créé, c'est le `HookWidget`
- `title` est accédé comme dans le `StatefulWidget` dans le code précédent, on ne peut toujours pas le modifier.
- On crée le compteur comme étant `final`, ce qui peut paraître contre-intuitif, mais \_counter est un Hook, qui est initialisé une seule fois, est c'est \_counter.value qui est un entier, valant initialement 0, qui est modifié par le bouton.
- On remarque enfin que ce code est plus concis et plus lisible que le code précédent, ce qui est une des principales motivations de l'utilisation des Hooks.
