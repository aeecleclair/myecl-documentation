---
title: Communication API
order: 8
category:
  - Guide
---

# Communication avec une API REST

L'objectif de cette partie est de détailler un moyen d'interagir avec une API REST. Elle se décompose en deux étapes : les classes et les repositories.

## Les classes

Une classe est un objet class de Dart donc l'unique but est d'être une représentation des données renvoyées par l'API.

Voici par exemple la classe représentant un objet dans le module de prêt :

```dart
class Item {
  Item({
    required this.id,
    required this.name,
    required this.caution,
    required this.available,
    required this.suggestedLendingDuration,
  });
  late final String id;
  late final String name;
  late final int caution;
  late final bool available;
  late final double suggestedLendingDuration;

  Item.fromJson(Map<String, dynamic> json) {
    id = json['id'];
    name = json['name'];
    caution = json['suggested_caution'];
    available = json['available'];
    suggestedLendingDuration =
        json['suggested_lending_duration'];
  }

  Map<String, dynamic> toJson() {
    final data = <String, dynamic>{};
    data['id'] = id;
    data['name'] = name;
    data['suggested_caution'] = caution;
    data['available'] = available;
    data['suggested_lending_duration'] = suggestedLendingDuration;
    return data;
  }

  Item copyWith({id, name, caution, available, suggestedLendingDuration}) {
    return Item(
        id: id ?? this.id,
        name: name ?? this.name,
        caution: caution ?? this.caution,
        available: available ?? this.available,
        suggestedLendingDuration:
            suggestedLendingDuration ?? this.suggestedLendingDuration);
  }

  Item.empty() {
    id = '';
    name = '';
    caution = 0;
    available = false;
    suggestedLendingDuration = 0;
  }

  @override
  String toString() {
    return 'Item(id: $id, name: $name, caution: $caution, available: $available, suggestedLendingDuration: $suggestedLendingDuration)';
  }
}
```

On voit apparaître plusieurs choses :

- un contructeur `Item(...)` qui explicite comment une instance d'Item doit être crée (required signifiant que le paramêtre est obligatoire)
- L'explication des attributs de la classe (ici mis après le constructeur). Le type des arguments est explicité et `final` indique qu'une fois construite, les attributs de l'instances sont immuables. Enfin, `late` indique que ces attributs seront renseignés au moment de l'instanciation et non au moment de la compilation de la classe.
- La fonction d'instanciation `.fromJson`, qui est un constructeur alternatif de la classe à partir d'un Json, qui est le format des données renvoyées par une API. La notation `Item.fromJson(...){}` est une abbréviation de `Item fromJson(...) { return Item(...)}`, utilisée dans `copyWith`.
- La fonction `toJson`, essentielle pour envoyer des données à l'API.
- La fonction `copyWith`, qui permet de "modifier" les attributs d'une instance (en créant une nouvelle instance).
- La fonction `toString`, est un `@override`, ce qui signifie que l'on réécrit le comportement déjà existant de la fonction `toString`. Cette fonction est optionnelle mais très utilise pour débugger, puisque l'on peut afficher tous les attributs de la classe.

Ce code peut être quaiment intégralement généré (sauf, `copyWith`) par le site [jsondart](https://www.jsontodart.in/), qui prend la réponse Json de l'API et en déduit la classe.
Attention, les dates sont interprétées comme des String, il faudra donc modifier le code en conséquence.

## Les repositories

Les repositories sont des classes dont l'unique fonction est de communiquer avec l'API. Voici celui associé au objet du module de prêt :

```dart
import 'package:myecl/loan/class/item.dart';
import 'package:myecl/tools/repository/repository.dart';

class ItemRepository extends Repository {
  @override
  // ignore: overridden_fields
  final ext = "loans/loaners/";

  Future<List<Item>> getItemList(String loanerId) async {
    return List<Item>.from((await getList(suffix: "$loanerId/items"))
        .map((x) => Item.fromJson(x)));
  }

  Future<Item> createItem(String loanerId, Item item) async {
    return Item.fromJson(
        await create(item.toJson(), suffix: "$loanerId/items"));
  }

  Future<bool> updateItem(String loanerId, Item item) async {
    return await update(item.toJson(), "$loanerId/items/${item.id}");
  }

  Future<bool> deleteItem(String loanerId, String itemId) async {
    return await delete("$loanerId/items/$itemId");
  }
}
```

Ici, on peut voir :

- Une implémentation de Repository, qui permet
  - la communication API
  - la gestion des erreurs
  - la mise en cache des données (donc le mode hors ligne)
  - la gestion de l'expiration de l'accessToken et donc son rafraichissement (détaillé plus loin)

- Les attributs de la classe :
  - `host`, qui indique le serveur de l'API (normalement host est dans un fichier auxiliaire pour simplifier sa modification)
  - `ext`, que l'on override, qui spécifie une partie de l'url pour indiquer le module (voir certaine partie du module, comme ici)

- Les réponses sont de type `Future<...>`, car les fonction sont asynchrones (`async`, `await`). Si ces fonctions sont appelées et que leur résultat doit être récupéré, il faudra ajouter `.then((value) => ...)`puis agir sur value, qui sera du type précisé dans`Future`.
- Les fonction ont pour seul et unique objectifs de convertir des objets `Map<String, dynamic>` en la classe associées au repository (ici `Item`), puisque la classe Repository ne manipule que la représentation `Map<String, dynamic>` des objets.
