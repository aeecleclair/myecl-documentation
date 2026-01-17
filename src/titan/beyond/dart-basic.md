---
title: Base de Dart
order: 3
category:
  - Guide
---

# Base de Dart / Flutter

## Types de variable

- var
  - Usage :

  ```dart
  var name = 'Bob';
  ```

  - Permet de créer une variable
  - Le type est inféré par Dart

- Object
  - Usage :
    ```dart
    Object name = 'Bob';
    ```
  - Permet de créer une variable
  - La variable n'a pas de type

- \<T> ?
  - Usage :
    ```dart
    String? name; // Ici name est soit un String soit null
    ```
  - Permet de créer une variable qui peut être nulle
  - \<!> Dart utilise le null-safety (vérifie systématiquement que les variables ne sont pas nulles)

- late
  - Usage :

    ```dart
    late String description;

    void main() {
        description = 'Hello World!';
        print(description);
    }
    ```

  - Permet de différer l'initialisation d'une variable
  - \<!> SI vous utilisez la variable avant de l'avoir initialisée, une erreur est levée
  - Si vous initialisez la variable avec une fonction, la fonction n'est appelée que lors de l'utilisation de la constante
  - Ex :
    ```dart
    late String temperature = _readThermometer();
    // Ici utiliser "temperature" pour la premières fois appelle _readThermometer()
    ```

- final
  - Usage :
    ```dart
    final String name = 'Bob';
    // Ou (Le type est inféré par Dart)
    final name = 'Bob';
    ```
  - Permet de créer une variable qui ne changera jamais
  - Changer une variable final lève une erreur
  - Ex :
    ```dart
    final name = 'Bob';
    name = 'Alice'; // Lève une erreur
    ```

- const
  - Usage :
    ```dart
    const String name = 'Bob';
    // Ou (Le type est inféré par Dart)
    const name = 'Bob';
    ```
  - Permet de créer une variable qui ne changera jamais
  - \<!> La variable est gelée à jamais et doit être initialisée avant l'éxecution
  - Ex :
    ```dart
    final DateTime now = DateTime.now(); // Ne pose pas de problème
    const DateTime now = DateTime.now(); // Est impossible car la valeur change à l'éxecution
    ```
  - Changer une variable const lève une erreur
  - Ex :
    ```dart
    const name = 'Bob';
    name = 'Alice'; // Lève une erreur
    ```

### Types intégrés par défaut à Dart

- Nombres (int, double)
  - Opération de base : \+, \-, \*, \/, abs(), ceil(), floor()
  - Le type `num` permet d'avoir des valeurs `int` et `double`
  - Dart transforme les entier en double en cas de nécessité
  - Ex :
    ```dart
    double z = 1; // z vaut 1.0
    ```
  - Opération binaire : (<<, >>, >>>), complement (~), AND (&), OR (|), and XOR (^)

- Chaîne de caractères (String)
  - Les simples guillemets et les doubles guillemets fonctionnent
  - Ex :

    ```dart
    var s1 = 'Hello World!';
    var s2 = "Hello World!";

    // En multilignes
    var s3 = '''
    Texte
    multiligne
    ''';

    var s4 = """Texte
    multiligne""";
    ```

  - On peut mettre des simples guillemets dans le texte
  - Ex :
    ```dart
    var s3 = '\'';
    // Ou
    var s3 = "'";
    ```
  - On peut interpoler des chaînes de caractères, des nombre et des booléens dans des chaînes de caractères
  - Ex :
    ```dart
    var s = 'Texte à ajouter';
    var n = 1;
    var s2 = 's vaut : $s $n'; // s2 vaut 's vaut : Texte à ajouter 1'
    // On peut aussi appliquer des fonctions
    var s3 = 's en majuscule : ${s.toUpperCase()}' // s3 vaut 's en majuscule : TEXTE A AJOUTER'
    ```
  - Fonctions de base :
    - isEmpty : Vérifie que la chaîne de caractère est vide
      - Ex :

      ```dart
      var s = 'Texte';
      var b = s.isEmpty; // b = false
      ```

    - length : Retourne la longueur de la chaîne de caractère
      - Ex :

      ```dart
      var s = 'Texte';
      var b = s.length; // b = 5
      ```

    - compareTo() : Compare ce texte avec un autre en suivant l'ordre lexicographique
      - Le résultat est dans [-1, 0, 1] :
        - 0 => égalité
        - -1 => Le texte que l'on compare est inférieur lexicographiquement
        - 1 => Le texte que l'on compare est supérieur lexicographiquement
      - Ex :

      ```dart
      String str1 = "A";
      String str2 = "A";
      String str3 = "B";

      str1.compareTo(str2): // 0
      str1.compareTo(str3): // -1
      str3.compareTo(str2): // 1
      ```

    - endsWith() : Vérifie que la chaîne de caractère termine par la lettre donnée
      - Ex :

      ```dart
      var s = 'Texte';
      var b = s.endsWith("t"); // b = false
      ```

    - replaceAll() : Remplace toutes les occurences de la chaîne de caractère par la chaîne donnée
      - Ex :

      ```dart
      var s = 'Texte';
      var b = s.replaceAll("e", "abc"); // b = Tabcxtabc
      ```

    - startsWith() : Vérifie que la chaîne de caractère commence par la lettre donnée
      - Ex :

      ```dart
      var s = 'Texte';
      var b = s.startsWith("T"); // b = true
      ```

    - split() : Sépare la chaîne là ou l'argument apparait
      - Ex :

      ```dart
      var s = 'Texte';
      var b = s.split("e"); // b = ["T", "xt", ""]
      ```

    - substring() : Récupère une partie de la chaîne initiale
      - Ex :

      ```dart
      var s = 'Texte';
      var b = s.substring(3); // b = "te", l'indice de départ est inclus
      var c = s.substring(1, 3); // c = "ex", l'indice de fin est exclus
      var copy = s.substring(0); // copy = 'Texte';
      ```

    - toLowerCase() : Met toute la chaîne en minuscule
      - Ex :

      ```dart
      var s = 'Texte';
      var b = s.toLowerCase(); // b = 'texte'
      ```

    - toString() : Donne la représentation texte de l'object donné
      - Ex :

      ```dart
      var s = 1;
      var a = s.toString(); // a = "1"
      ```

    - toUpperCase() : Met toute la chaîne en majuscule
      - Ex :

      ```dart
      var s = 'Texte';
      var b = s.toUpperCase(); // b = 'TEXTE'
      ```

    - trim() : enlève tous les espaces avant et après le texte
      - Ex :
      ```dart
      var s = '   Texte ';
      var b = s.trim(); // b = 'Texte'
      ```

- Booléens (bool)
  - Indispensable pour `if` et `assert`
  - Les seules valeurs sont `true` et `false`

- Listes (List)
  - Stocke une liste d'objects de **_même type_**
  - Ex :
    ```dart
    var list = [1, 2, 3]; // Dart infère le type List<int>
    var list2 = [
        'Car',
        'Boat',
        'Plane',
    ]; // Dart infère le type List<String>
    ```
  - On peut spécifier le type
  - Ex :
    ```dart
    List<int> list = [1, 2, 3];
    List<String> list2 = [
        'Car',
        'Boat',
        'Plane',
    ];
    ```
  - On peut créer une liste à partir d'autres objets (Dans le cas d'une liste c'est une copie)
  - Ex :

  ```dart
  var fiboNumbers = [1, 2, 3, 5, 8, 13];
  var clonedFiboNumbers = List.from(fiboNumbers); // clonedFiboNumbers = [1, 2, 3, 5, 8, 13]
  ```

  - Les indexes commencent à 0
  - Par défaut, les listes sont extensibles, mais on peut les rendre de taille fixe
  - Ex :
    ```dart
    final fixedLengthList = List<int>.filled(5, 0); // fixedLengthList = [0, 0, 0, 0, 0]
    ```
  - On peut changer les valeurs mais ni en ajouter ni en supprimer

  - Opérations
    - [i] : Retourne l'élément à la i ème place
    - Ex :
      ```dart
      List<int> list = [1, 2, 3];
      var l = list[0]; // l = 1
      ```
    - ... : Opérateur de répartition, décompose la liste en ses éléments
    - Ex :
      ```dart
      List<int> list = [1, 2, 3];
      var list2 = [0, ...list]; // list2 = [0, 1, 2, 3]
      ```
    - ...? : Opérateur de répartition avec une vérification que la liste n'est pas vide, décompose la liste en ses éléments
    - Ex :
      ```dart
      List<int> list = [];
      var list2 = [0, ...list]; // Lève une erreur car la liste est vide
      var list2 = [0, ...?list]; // list2 = [0]
      ```
    - compréhension de liste (if sans les accolades) : ajoute l'élément si la condition est vérifiée
    - Ex :
      ```dart
      var nav = ['Home', 'Furniture', 'Plants', if (promoActive) 'Outlet'];
      // Si promoActive = true, la liste contient 'Outlet' sinon non.
      ```
    - compréhension de liste (for sans les accolades) : ajoute les éléments de la première liste en effectuant les opérations données:
    - Ex :
      ```dart
      var listOfInts = [1, 2, 3];
      var listOfStrings = ['#0', for (var i in listOfInts) '#$i'];
      // listOfStrings = ['#0", '#1", '#2", '#3"]
      ```

  - Fonctions de base :
    - first → E :
      - Read / Write
      - Retourne le premier élément de la liste
      - Ex :
        ```dart
        var lst = [1, 2, 3, 4, 5];
        var b = lst.first; // b = 1
        ```

    - isEmpty → bool :
      - Read-Only
      - Vérifie que la chaîne de caractère est vide
      - Ex :
        ```dart
        var lst = [1, 2, 3, 4, 5];
        var b = lst.isEmpty; // b = false
        ```

    - isNotEmpty → bool :
      - Read-Only
      - Vérifie que la chaîne de caractère n'est pas vide
      - Ex :
        ```dart
        var lst = [1, 2, 3, 4, 5];
        var b = lst.isNotEmpty; // b = true
        ```

    - last → E :
      - Read / Write
      - Retourne le dernier élément de la liste
      - Ex :
        ```dart
        var lst = [1, 2, 3, 4, 5];
        var b = lst.last; // b = 5
        ```

    - length → int :
      - Read-Only
      - Retourne la longueur de la liste
      - Ex :
        ```dart
        var lst = [1, 2, 3, 4, 5];
        var b = lst.length; // b = 5
        ```

    - reversed → Iterable<E> :
      - Read-Only
      - Renverse la liste
      - Il faut reconvertir en liste après
      - Ex :
        ```dart
        var lst = [1, 2, 3, 4, 5];
        var b = lst.reversed.toList(); // b = [5, 4, 3, 2, 1]
        ```

    - add(E value) → void :
      - Ajoute un élément à la liste
      - Ex :
        ```dart
        var lst = [1, 2, 3, 4];
        lst.add(5); // lst = [1, 2, 3, 4, 5]
        ```

    - addAll(Iterable<E> iterable) → void :
      - Ajoute tous les éléments à la liste
      - Ex :
        ```dart
        var lst = [1, 2, 3, 4];
        lst.addAll([5, 6, 7]); // lst = [1, 2, 3, 4, 5, 6, 7]
        ```

    - any(bool test(E element)) → bool :
      - Vérifie qu'au moins un élément vérifie la condition
      - Ex :
        ```dart
        var sportsList = ['cricket', 'tennis', 'football'];
        var b = sportsList.any((e) => e == 'cricket'); // b = true
        ```

    - asMap → Map<int, E> :
      - Transforme la liste en dictionnaire
      - Ex :
        ```dart
        List<String> sports = ['cricket', 'football', 'tennis', 'baseball'];
        Map<int, String> map = sports.asMap();
        // map = {0: cricket, 1: football, 2: tennis, 3: baseball}
        ```

    - clear() → void :
      - Supprime tous les éléments de la liste
      - Ex :
        ```dart
        var lst = [1, 2, 3, 4, 5];
        lst.clear(); // lst = []
        ```

    - contains(Object? element) → bool :
      - Vérifie que la liste contient l'élément donné
      - Ex :
        ```dart
        var lst = [1, 2, 3, 4, 5];
        var b = lst.contains(5); // b = true
        ```

    - elementAt(int index) → E :
      - Retourne l'élément à la position donné
      - Ex :
        ```dart
        var lst = [1, 2, 3, 4, 5];
        var b = lst.elementAt(1); // b = 2
        ```

    - every(bool test(E element)) → bool :
      - Vérifie que tous les éléments vérifient la condition
      - Ex :
        ```dart
        var sportsList = ['cricket', 'tennis', 'football'];
        var b = sportsList.every((e) => e.startsWith('a')); // b = false
        ```

    - expand<T>(Iterable<T> toElements(E element)) → Iterable<T> :
      - Retourne un itérable des résultats de la fonction donnée
      - expand peut changer la forme et la longueur de la liste
      - Ex :
        ```dart
        var pairs = [[1, 2], [3, 4]];
        var flattened = pairs.expand((pair) => pair).toList(); // flattened = [1, 2, 3, 4]
        var input = [1, 2, 3];
        var duplicated = input.expand((i) => [i, i]).toList(); // duplicated = [1, 1, 2, 2, 3, 3]
        ```

    - fillRange(int start, int end, [E? fillValue]) → void:
      - Replace tous les éléments entre l'indice de départ (inclus) et celui d'arrivée (exclus) par l'élément donné
      - Ex :
        ```dart
        var lst = [1, 2, 3, 4, 5];
        var b = lst.fillRange(1, 3, 6); // lst = [1, 6, 6, 4, 5]
        ```

    - firstWhere(bool test(E element), {E orElse()?}) → E :
      - Retourne le premier élément vérifiant la condition donnée
      - Ex :

        ```dart
        var firstList = [1, 2, 3, 4, 5, 6];
        var b = firstList.firstWhere((i) => i < 4); // b = 1

        var sList = ['one', 'two', 'three', 'four'];
        var c = sList.firstWhere((i) => i.length > 3); // c = 'three'
        ```

    - fold<T>(T initialValue, T combine(T previousValue, E element)) → T :
      - Applique la fonction donnée aux élément de la liste avec comme valeur initiale celle donnée
      - Ex :
        ```dart
        var lst = [1, 2, 3, 4, 5];
        var res = lst.fold(5, (i, j) => i + j); // res = 5 + 1 + 2 + 3 + 4 + 5 = 20
        ```

    - followedBy(Iterable<E> other) → Iterable<E> :
      - Ajoute la liste donnée à la liste
      - Ex :
        ```dart
        var sportsList = ['cricket', 'tennis', 'football'];
        sportsList.followedBy(['golf', 'chess']).toList();
        // sportsList = ['cricket', 'tennis', 'football', 'golf', 'chess']
        ```

    - forEach(void action(E element)) → void :
      - Applique la fonction donnée à tous les éléments de la liste
      - Ne retourne rien
      - Ex :
        ```dart
        var fruits = ['banana', 'pineapple', 'watermelon'];
        fruits.forEach((fruit) => print(fruit)); // Affiche dans la console les fruits un par un
        ```

    - getRange(int start, int end) → Iterable<E> :
      - Retourne les éléments de la liste contenue entre l'indice de départ (inclus) et celui de fin (exclus) sous forme d'itérable
      - \<!> Attention au alias
      - \<!> Il faut reconvertir en liste après
      - Ex :
        ```dart
        var lst = [1, 2, 3, 4, 5];
        var b = lst.getRange(1,4).toList(); // b = [2, 3, 4]
        ```

    - indexOf(E element, [int start = 0]) → int :
      - Retourne l'indice de l'élément donné dans la liste (le plus petit indice par défaut, mais on peut depuis quelle position faire la recherche)
      - Retourne -1 si cet élément n'est pas dans la liste
      - Ex :

        ```dart
        var lst = [1, 2, 3, 4, 5];
        var b = lst.indexOf(3) // b = 2

        var notes = <String>['do', 're', 'mi', 're'];
        var i = notes.indexOf('re', 2); // i = 3
        ```

    - indexWhere(bool test(E element), [int start = 0]) → int :
      - Retourne l'indice du premier élément vérifiant la condition dans la liste
      - Retourne -1 si cet élément n'est pas dans la liste
      - On peut préciser un index à partir duquel vérifier la condition (0 par défaut)
      - Ex :
        ```dart
        var notes = <String>['do', 're', 'mi', 're'];
        var first = notes.indexWhere((note) => note.startsWith('r')); // first = 1
        var second = notes.indexWhere((note) => note.startsWith('r'), 2); // second = 3
        var index = notes.indexWhere((note) => note.startsWith('k')); // index = -1
        ```

    - insert(int index, E element) → void :
      - Ajoute l'élément donné à l'index donné
      - Ex :
        ```dart
        var lst = [1, 2, 3, 4, 5];
        var b = lst.insert(2, 7) // b = [1, 2, 7, 3, 4, 5]
        ```

    - insertAll(int index, Iterable<E> iterable) → void :
      - Ajoute les éléments donnés à l'index donnés
      - Ex :
        ```dart
        var lst = [1, 2, 3, 4, 5];
        var b = lst.insertAll(2, [7, 8]) // b = [1, 2, 7, 8, 3, 4, 5]
        ```

    - join([String separator = ""]) → String :
      - Convertit la liste en String avec comme séparateur celui donné
      - Ex :
        ```dart
        var lst = [1, 2, 3, 4, 5];
        var b = lst.join(" ! ") // b = "1 ! 2 ! 3 ! 4 ! 5"
        ```

    - lastIndexOf(E element, [int? start]) → int :
      - Retourne le dernier indice de l'élément donné dans la liste
      - Retourne -1 si cet élément n'est pas dans la liste
      - Ex :
        ```dart
        var lst = [1, 2, 3, 4, 5, 3];
        var b = lst.lastIndexOf(3) // b = 5
        ```

    - lastIndexWhere(bool test(E element), [int? start]) → int :
      - Retourne le dernier indice de l'élément vérifiant la condition dans la liste
      - Retourne -1 si cet élément n'est pas dans la liste
      - Ex :
        ```dart
        var notes = <String>['do', 're', 'mi', 're'];
        var first = notes.lastIndexWhere((note) => note.startsWith('r')); // first = 3
        ```

    - lastWhere(bool test(E element), {E orElse()?}) → E :
      - Retourne le dernier élément vérifiant la condition donnée
      - Ex :

        ```dart
        var firstList = [1, 2, 3, 4, 5, 6];
        var b = firstList.lastWhere((i) => i < 4); // b = 3

        var sList = ['one', 'two', 'three', 'four'];
        var c = sList.lastWhere((i) => i.length > 3); // c = 'four'
        ```

    - map<T>(T toElement(E e)) → Iterable<T> :
      - Applique la fonction donnée et retourne l'itérable des résultats
      - Il faut reconvertir en liste après
      - Ex :
        ```dart
        var fruits = ['banana', 'pineapple', 'watermelon'];
        var b = fruits.map((fruit) => 'I love $fruit').toList();
        // b = ['I love banana', ‘I love pineapple’, ‘I love watermelon’]
        ```

    - reduce(E combine(E value, E element)) → E :
      - Applique la fonction donnée aux élément de la liste
      - La liste ne doit pas être vide
      - Ex :
        ```dart
        var lst = [1, 2, 3, 4, 5];
        var res = lst.reduce((i, j) => i + j); // res = 15
        ```

    - remove(Object? value) → bool :
      - Supprime l'élément donné dans la liste
      - Ex :
        ```dart
        var lst = [1, 2, 3, 4, 5];
        var res = lst.remove(1); // res = True, lst = [2, 3, 4, 5]
        var res = lst.remove(6); // res = False, lst = [2, 3, 4, 5]
        ```

    - removeAt(int index) → E :
      - Supprime l'élément à l'indice donné dans la liste et le renvoie
      - Ex :
        ```dart
        var lst = [1, 2, 3, 4, 5];
        var res = lst.remove(1); // res = 2, lst = [1, 3, 4, 5]
        ```

    - removeLast() → E :
      - Supprime le dernier élément de la liste et le renvoie
      - Ex :
        ```dart
        var lst = [1, 2, 3, 4, 5];
        lst.removeLast(); // res = 5, lst = [1, 2, 3, 4]
        ```

    - removeRange(int start, int end) → void :
      - Supprime les éléments entre l'indice de départ (inclus) et celui d'arrivée (exclus)
      - Ex :
        ```dart
        var lst = [1, 2, 3, 4, 5];
        lst.removeRange(1, 3); // lst = [1, 4, 5]
        ```

    - removeWhere(bool test(E element)) → void :
      - Supprime les éléments vérifiant la condition
      - Ex :
        ```dart
        var lst = [1, 2, 3, 4, 5];
        lst.removeWhere((i) => i < 3); // lst = [3, 4, 5]
        ```

    - replaceRange(int start, int end, Iterable<E> replacements) → void :
      - Remplace les éléments de la liste par les éléments donnés.
      - Il faut également donner l'indice de départ et de fin pour le remplacement.
      - Ex :
        ```dart
        var rList= [0, 1, 2, 3, 4, 5, 6];
        rList.replaceRange(2, 3, [10]); // rList = [0, 1, 10, 3, 4, 5, 6]
        ```

    - retainWhere(bool test(E element)) → void :
      - Conserve les éléments vérifiant la condition
      - Ex :
        ```dart
        var lst = [1, 2, 3, 4, 5];
        lst.retainWhere((i) => i < 3); // lst = [1, 2]
        ```
    - removeWhere(bool test(E element)) → void :
      - Supprime les éléments vérifiant la condition
      - Ex :
        ```dart
        var lst = [1, 2, 3, 4, 5];
        lst.removeWhere((i) => i < 3); // lst = [3, 4, 5]
        ```

    - setAll(int index, Iterable<E> iterable) → void :
      - Change les éléments à partir de l'indice donné
      - Ex :
        ```dart
        var lst = [1, 2, 3, 4, 5];
        lst.setAll(1, [6, 7]); // lst = [1, 6, 7, 4, 5]
        ```

    - setRange(int start, int end, Iterable<E> iterable, [int skipCount = 0]) → void :
      - Change les éléments entre l'indice de départ (inclus) et celui d'arrivée (exclus) par ceux donné en excluant le nombre donné
      - Ex :
        ```dart
        var list1 = [1, 2, 3, 4];
        var list2 = [5, 6, 7, 8, 9];
        // On n'est pas obligé de préciser skipCount (qui par défaut vaut 0)
        var skipCount = 3;
        list1.setRange(1, 3, list2, skipCount); // list1 = [1, 8, 9, 4]
        ```

    - shuffle([Random? random]) → void :
      - Mélange aléatoirement la liste
      - Ex :
        ```dart
        var lst = [1, 2, 3, 4, 5];
        lst.shuffle(); // lst = [5, 3, 4, 2, 1]
        ```

    - singleWhere(bool test(E element), {E orElse()?}) → E :
      - Retourne le **_seul_** élément vérifiant la condition
      - \<!> Une exception est levée s'il y a un doublon
      - Ex :
        ```dart
        var mList = [1, 2, 3, 4];
        var b = mList.singleWhere((i) => i == 3); // b = 3
        ```

    - skip(int count) → Iterable<E> :
      - Retourne un itérable contenant les éléments entre l'indice donné et la fin de la liste
      - Il faut reconvertir en liste après
      - Ex :
        ```dart
        var sportsList = ['cricket', 'tennis', 'football'];
        var b = sportsList.skip(2).toList(); // b = ['football']
        ```

    - skipWhile(bool test(E value)) → Iterable<E> :
      - Retourne un itérable contenant les éléments entre le premier élément ne vérifiant pas la condition et la fin de la liste
      - Il faut reconvertir en liste après
      - Ex :
        ```dart
        var numbers =  [1, 2, 3, 4, 5];
        var result = numbers.skipWhile((x) => x < 3).toList(); // result = [3, 4, 5]
        ```

    - sort([int compare(E a, E b)?]) → void :
      - Trie la liste selon la fonction donnée
      - Ex :
        ```dart
        var numbers = [1, 3, 2, 5, 4];
        numbers.sort((num1, num2) => num1 - num2); // numbers = [1, 2, 3, 4, 5]
        ```

    - sublist(int start, [int? end]) → List<E> :
      - Récupère une copie de la portion de la liste contenue entre l'index de départ (inclus) et celui de fin (exclus, s'il est précisé, la fin de la liste sinon)
      - Ex :
        ```dart
        var lst = [1, 2, 3, 4, 5];
        var b = lst.sublist(2); // b = [3, 4, 5]
        var c = lst.sublist(1, 3); // c = [2, 3]
        var copy = lst.sublist(0); // copy = [1, 2, 3, 4, 5]
        ```

    - take(int count) → Iterable<E> :
      - Retourne un itérable contenant les éléments entre 0 et l'indice donné
      - Il faut reconvertir en liste après
      - Ex :
        ```dart
        var sportsList = ['cricket', 'tennis', 'football'];
        var b = sportsList.take(2).toList(); // b = ['cricket', 'tennis']
        ```

    - takeWhile(bool test(E value)) → Iterable<E> :
      - Retourne un itérable contenant les éléments entre le premier élément et le premier élément ne vérifiant pas la condition
      - Il faut reconvertir en liste après
      - Ex :
        ```dart
        var numbers =  [1, 2, 3, 4, 5];
        var result = numbers.takeWhile((x) => x < 3).toList(); // result = [1, 2]
        ```

    - where(bool test(E element)) → Iterable<E> :
      - Retourne les éléments vérifiant la condition donnée, sous forme d'itérable
      - Il faut reconvertir en liste après
      - Ex :

        ```dart
        var firstList = [1, 2, 3, 4, 5, 6];
        var b = firstList.where((i) => i < 4).toList(); // b = [1, 2, 3]

        var sList = ['one', 'two', 'three', 'four'];
        var c = sList.where((i) => i.length > 3).toList(); // c = ['three', 'four']
        ```

    - whereType<T>() → Iterable<T> :
      - Extrait un itérable qui ne contient que les éléments du même type depuis la liste
      - Il faut reconvertir en liste après
      - Ex :
        ```dart
        var mixList = [1, "a", 2, "b", 3, "c", 4, "d"];
        var num = mixList.whereType<int>().toList(); // [1, 2, 3, 4]
        ```

- Ensemble (Set)
  - Ensemble de données de même type sans doublons
  - Ex :
    ```dart
    var halogens = {'fluorine', 'chlorine', 'bromine', 'iodine', 'astatine'};
    // Dart infère le type String
    var elements = <String>{};
    // Création d'un ensemble vide
    var elements = {}
    // ! Crée un dictionnaire et non un ensemble
    elements.add('fluorine');
    // On ajoute 'fluorine'
    elements.addAll(halogens);
    // On ajoute tous les éléments de halogens, sauf 'fluorine' qui est déjà dedans
    ```
  - Les ensembles supportent aussi les ... et ...? et les compréhension de liste
  - les ensembles ont les mêmes méthodes que les listes (avec d'autres)
  - Les ensembles ne servent quasiment à rien, juste à virer les doublons
  - Ex :
    ```dart
    var lst = [1, 1, 3, 4, 1, 2, 3, 5];
    // On décompose la liste et on en crée un ensemble que l'on décompose pour recrée une liste
    var lst2 = [...{...lst}]; // lst2 = [1, 3, 4, 2, 5]
    ```

- Dictionnaire (Map)
  - Association entre une clé et une valeur
  - Ex :

    ```dart
    var gifts = {
        // Clé: Valeur
        'first': 'partridge',
        'second': 'turtledoves',
        'fifth': 'golden rings'
    }; // Dart infère le type Map<String, String>

    var nobleGases = {
        2: 'helium',
        10: 'neon',
        18: 'argon',
    }; // Ici,  Map<int, String>

    // On peut crée un dictionnaire vide
    var gifts = Map<String, String>();
    // Ou
    var gifts = {} // Dart infèrera le type avec le premier ajout de donnée
    // Et y ajouter les valeurs après
    gifts['first'] = 'partridge';
    ```

  - Les dictionnaires supportent aussi les ... et ...? et les compréhension de liste

  - Fonction de base
    - entries → Iterable<MapEntry<K, V>> :
      - Read-Only
      - Retourne les valeurs du dictionnaire
      - Il faut reconvertir en liste après
      - Ex :
        ```dart
        var dct = {'a': 1, 'b': 2, 'c': 3};
        var valeurs = dct.entries;
        // valeurs = [MapEntry<String, int>('a', 1), MapEntry<String, int>('b', 2), MapEntry<String, int>('c', 3)]
        ```

    - isEmpty → bool :
      - Read-Only
      - Vérifie que le dictionnaire est vide
      - Ex :
        ```dart
        var dct = {'a': 1, 'b': 2, 'c': 3};
        var b = dct.isEmpty; // b = False
        ```

    - isNotEmpty → bool :
      - Read-Only
      - Vérifie que le dictionnaire est vide
      - Ex :
        ```dart
        var dct = {'a': 1, 'b': 2, 'c': 3};
        var b = dct.isNotEmpty; // b = True
        ```

    - keys → Iterable<K> :
      - Read-Only
      - Retourne l'itérable des clés du dictionnaire
      - Il faut reconvertir en liste après
      - Ex :
        ```dart
        var dct = {'a': 1, 'b': 2, 'c': 3};
        var b = dct.keys.toList(); // b = ['a', 'b', 'c']
        ```

    - length → int :
      - Read-Only
      - Retourne la longeur du dictionnaire (le nombre de clés)
      - Ex :
        ```dart
        var dct = {'a': 1, 'b': 2, 'c': 3};
        var b = dct.length; // b = 3
        ```

    - values → Iterable<V> :
      - Read-Only
      - Retourne l'itérable des valeurs du dictionnaire
      - Il faut reconvertir en liste après
      - Ex :
        ```dart
        var dct = {'a': 1, 'b': 2, 'c': 3};
        var b = dct.values.toList(); // b = [1, 2, 3]
        ```

    - addAll(Map<K, V> other) → void :
      - Ajoute le dictionnaire donné
      - Si une clé est déjà dans le dictionnaire, sa valeur est remplacée par la nouvelle
      - Ex :
        ```dart
        var planets = <int, String>{1: 'Mercury', 2: 'Earth'};
        planets.addAll({5: 'Jupiter', 6: 'Saturn'});
        // planets = {1: 'Mercury', 2: 'Earth', 5: 'Jupiter', 6: 'Saturn'}
        ```

    - clear() → void :
      - Supprime tout le contenu du dictionnaire
      - Ex :
        ```dart
        var planets = <int, String>{1: 'Mercury', 2: 'Earth'};
        planets.clear();
        // planets = {}
        ```

    - containsKey(Object? key) → bool :
      - Vérifie que la clé donnée est parmi les clés du dictionnaire
      - Ex :
        ```dart
        var planets = <int, String>{1: 'Mercury', 2: 'Earth'};
        var isIn = planets.containsKey(1); // isIn = True
        ```

    - containsValue(Object? value) → bool :
      - Vérifie que la valeur donnée est parmis les clés du dictionnaire
      - Ex :
        ```dart
        var planets = <int, String>{1: 'Mercury', 2: 'Earth'};
        var isIn = planets.containsValue('Earth'); // isIn = True
        ```

    - forEach(void action(K key, V value)) → void :
      - Applique la fonction donnée à tous les éléments
      - Ex :
        ```dart
        var planets = <int, String>{1: 'Mercury', 2: 'Earth'};
        var isIn = planets.forEach((key, value) {print('$key: $value'); });
        // La console affiche :
        // 1: Mercury
        // 2: Earth
        ```

    - map<K, V>(MapEntry<K, V> convert(K key, V value)) → Map<K, V> :
      - Applique la fonction donnée à tous les éléments et reconstruit un dictionnaire avec les résultats
      - Ex :
        ```dart
        var planets = <int, String>{1: 'Mercury', 2: 'Earth'};
        var isIn = planets.map((key, value) => MapEntry(key, "Planète n° $key : $value") });
        // planets = {1: 'Planète n° 1 : Mercury', 2: 'Planète n° 2 : Earth'}
        ```

    - putIfAbsent(K key, V ifAbsent()) → V :
      - Ajoute la clé et la valeur si la clé n'est pas dans le dictionnaire, sinon renvoie la valeur actuelle
      - Ex :
        ```dart
        var planets = <int, String>{1: 'Mercury', 2: 'Earth'};
        planets.putIfAbsent(3, () => 'Mars'); // planets = {1: 'Mercury', 2: 'Earth', 3 : 'Mars'}
        var res = planets.putIfAbsent(3, () => 'Vénus'); // res = 'Mars'
        // planets = {1: 'Mercury', 2: 'Earth', 3 : 'Mars'}
        ```

    - remove(Object? key) → V? :
      - Supprime la clé donnée et sa valeur
      - Retourne la valeur supprimée
      - Ex :
        ```dart
        var planets = <int, String>{1: 'Mercury', 2: 'Earth'};
        var res = planets.remove(2); // res = 'Earth'
        // planets = {1: 'Mercury'}
        ```

    - removeWhere(bool test(K key, V value)) → void :
      - Supprime toutes les clés vérifiant la condition et leur valeur
      - Ex :
        ```dart
        var planets = <int, String>{1: 'Mercury', 2: 'Earth'};
        var res = planets.removeWhere((key, value) => value.startsWith('E')); // planets = {1: 'Mercury'}
        ```

    - update(K key, V update(V value), {V ifAbsent()?}) → V :
      - Met à jour la valeur associée à la clé donnée et retourne la nouvelle valeur
      - Si la clé n'est pas dans le dictionnaire, le paramètre ifAbsent doit être renseigné pour ajouter la paire clé / valeur
      - Ex :
        ```dart
        var planets = <int, String>{1: 'Mercury', 2: 'Earth'};
        var res = planets.update(1, (value) => 'Vénus'); // res = 'Vénus'
        // planets = {1: 'Vénus', 2: 'Earth'}
        var res = planets.update(3, (value) => 'Mars', ifAbsent: () => 'Neptune'); // res = 'Neptune'
        // planets = {1: 'Vénus', 2: 'Earth', 3 : 'Neptune'}
        ```

    - updateAll(V update(K key, V value)) → void :
      - Met à jour les paires clé / valeur en appliquant la fonction donnée
      - Ex :
        ```dart
        var planets = <int, String>{1: 'Mercury', 2: 'Earth'};
        planets.updateAll((key, value) => value.toUpperCase());
        // planets = {1: 'MERCURY', 2: 'EARTH'}
        ```

## Opérations usuelles

### Opération arithmétique

- \+ : addition
- \- : soustraction
- \-x : inversion de signe
- \* : multiplication
- / : division
- ~/ : division entière
- % : reste d'une division entière
- ++ : Incrémentation
- -- : Décrémentation

### Comparaison

- \> : Plus grand que
- < : Plus petit que
- \>= : Plus grand que ou égal à
- <= : Plus petit que ou égal à
- == : Égal
- != : Différent

### Vérification de type

- is : Vérifie si la variable est du type demandé
  - Ex :
    ```dart
    var n = 2;
    if (n is int) {
        ...
    }
    ```
- is! : Vérifie si la variable n'est pas du type demandé

### Opération d'assignation

- = : Assignation simple
- ??= : Assignation uniquement si la variable est nulle
  - Ex :
    ```dart
    var n;
    var m = 1;
    n ??= 2; // n = 2
    m ??= 2; // m = 1
    ```
- += : Assignation avec addition
- -= : Assignation avec soustraction
- \*= : Assignation avec multiplication
- /= : Assignation avec division
- ~/= : Assignation avec division entière
- %= : Assignation du reste de la division entière

### Opération logique

- && : Et
- || : Ou
- ! : Non

### Opération conditionnelle

- "cond ? expr1 : expr2" Si la condition cond est vrai, le résultat est expr1, sinon le résultat est expr2
- "expr1 ?? expr2" fait expr1 si expr1 est non nul, expr2 sinon

site : https://www.youtube.com/watch?v=lytQi-slT5Y&list=PLjxrf2q8roU23XGwz3Km7sQZFTdB996iG&ab_channel=Flutter
