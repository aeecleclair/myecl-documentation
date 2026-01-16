---
title: Les Widgets
order: 5
category:
  - Guide
---


# Les Widgets

C'est l'élément de base de Flutter, toute l'application n'est qu'une imbrication de Widget les uns dans les autres.

Dans le code précédent les Widgets sont imbriqués comme suit :

MyApp (= MaterialApp) <- MyHomePage (= Scaffold) <- Center <- Column <- List(Text)

Les plus utilisés sont :

- `MaterialApp` : permet de crée l'application (indispensable)

- `Scaffold` : permet de crée un élément de base pour l'application (indispensable)

- `Container` : L'élément le plus modifiables de tous, il sert aussi bien pour placer un autre Widget que pour de la décoration

```dart
Container(
    // L'apparance
    decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(25),
        color: ColorConstant.darkGrey,
        boxShadow: const [
        BoxShadow(
            color: ColorConstant.darkGrey,
            blurRadius: 10,
            offset: Offset(0, 5),
            ),
        ],
    ),
    // L'espacement entre l'extérieur et le Widget
    margin: const EdgeInsets.all(15.0),
    // L'espacement entre le Widget et child
    padding: const EdgeInsets.only(left: 15.0, right: 15.0),
    child: ...
),
```

Les Widgets `Center`, `Align`, `Padding`, ... sont des versions simplifiées de `Container` ne permettant de changer que certains paramètres, d'où leurs noms.

- `Column` / `Row` / `Stack` : Permettent d'afficher des éléments les uns en-dessous / à côté / par dessus les autres

```dart
Column(
    // le type d'espacement des éléments dans la direction de défilement
    mainAxisAlignment: MainAxisAlignment.center,
    // le type d'espacement des éléments dans la direction perpendiculaire
    crossAxisAlignment: CrossAxisAlignment.center,
    children: [...],
),
```

(Pour `Column` et `Row`, il est possible d'utiliser le Widget `Expanded`, dont le comportement est de prendre toute la place disponible)

- `Text` / `Icon` : Permettent d'afficher de texte un icône

```dart
Text(
    'Texte à afficher',
    // le style du texte
    style: TextStyle(
        fontSize: 30,
        fontWeight: FontWeight.bold,
        color: Colors.white,
    ),
),
```

(Il est important de remarquer que ces Widget n'ont pas de child, il sont donc mis en fin de chaîne d'imbrication, de plus child est optionel dans Container)

- `GestureDetector` / `Inkwell` / `ElevatedButton` : Trois type de boutons (avec / sans animation, gestion de plusieurs types d'évènement, ...)

```dart
InkWell(
    splashColor: const Color.fromRGBO(255, 255, 255, 1),
    onTap: () {
        // La fonction à lancer au clic
    },
    child: ...
)
```

- `Form` / `TextFormField` : `Form` permet de crée un formulaire et `TextFormField` un champ de saisie pour l'utilisateur

```dart
Form(
    child: TextFormField(
        style: const TextStyle(
            fontSize: 18,
            color: Colors.white,
        ),
    ),
),
```

La liste est bien plus grande mais ces différents Widget permettent déjà de créer une grande variété de page.

## Les StateLessWidgets et StatefulWidgets

Les `StatelessWidgets` sont des widgets qui n'ont aucun état, i.e. qui ne sont crées qu'à la compilation du code. Tout ce qui est contenue dans un `StatelessWidget` doit donc être harcodé (il est impossible de changer du texte par exemple).

Voici un exemple d'utilisation d'un `StatelessWidget` dans l'application créée précédemment :

```dart
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
```

Ici, tout est constant, on peut donc utiliser un `StateLessWidget` pour éviter de recréer la page dès que l'utilisateur la demande.

Les `StatefulWidget` peuvent prendre des arguments en entrée, et permettent donc beaucoup plus de chose.
Le code ci-dessous est le StateFulWidget de l'application créée.

```dart

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

On remarque plusieurs choses :

- On crée en réalité deux classes (`MyHomePage` et `_MyHomePageState`)
- On peut effectivement fournir des arguments en entrée d'un `StatefulWidget`, qui sont déclarés et typés (précédées de `final`) obligatoirement être fournis à l'instanciation (`required`), ou totalement définies (précédées de `static const`, que l'on ne vois pas dans cet exemple).
- On peut accéder aux variables de `MyHomePage` depuis `_MyHomePageState` grâce à `widget.`, comme avec `title`, mais on ne peut pas les modifier.
- Les variables modifiables sont créées et modifiées dans `_MyHomePageState`. Elles sont créées comme des variables classiques, et ne sont modifiables qu'uniquement dans la fonction `setState()`.
