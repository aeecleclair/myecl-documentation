---
title: Module exemple
order: 13
category:
  - Guide
---

# Exemple : Le module de prêt

:exclamation: Cette page n'est pas à jour, le routage à changé, Il faut suivre la doc du routage pour avoir une navigation compatible

Cette partie détaille pas à pas la création du module de prêt.

## 1. Création des dossiers

Tout est dans le nom :wink:

## 2. Les classes du module

Normalement, le module communique avec l'API, il faut donc crée les classes desquelles on pourra crée les repositories et les providers.

Si l'API fournit le json avec les données, vous pouvez utiliser <https://www.jsontodart.in/> pour crée automatiquement les classes. Cet outil ne fait pas tout, en particulier il ne gére pas les `DateTime`. Il faut donc le faire à la main, avec la fonction `processDate` dans _tools/functions.dart_.

```dart
String processDate(DateTime date) {
  return date.toIso8601String();
}
```

Si les endpoints de l'API ne sont pas encore créés, vous pouvez quand même faire ces parties, il faudra juste tout vérifier, une fois les endpoints terminés.

Exemple : _loan/class/loan.dart_

```dart
class Loan {
  Loan({
    required this.id,
    required this.borrowerId,
    required this.notes,
    required this.start,
    required this.end,
    required this.association,
    required this.caution,
  });
  late final String id;
  late final String borrowerId;
  late final String notes;
  late final String start;
  late final String end;
  late final String association;
  late final bool caution;

  Loan.fromJson(Map<String, dynamic> json) {
    id = json['id'];
    borrowerId = json['borrower_id'];
    notes = json['notes'];
    start = DateTime.parse(json['start']); // On convertit le String en DateTime
    end = DateTime.parse(json['end']);
    association = json['association'];
    caution = json['caution'];
  }

  Map<String, dynamic> toJson() {
    final _data = <String, dynamic>{};
    _data['id'] = id;
    _data['borrower_id'] = borrowerId;
    _data['notes'] = notes;
    _data['start'] = processDate(start); // On convertit le DateTime en String
    _data['end'] = processDate(end);
    _data['association'] = association;
    _data['caution'] = caution;
    return _data;
  }

  // Cette fonction est à ajouter à la main
  Loan copyWith({id, borrowerId, notes, start, end, association, caution}) {
    return Loan(
        id: id ?? this.id,
        borrowerId: borrowerId ?? this.borrowerId,
        notes: notes ?? this.notes,
        start: start ?? this.start,
        end: end ?? this.end,
        association: association ?? this.association,
        caution: caution ?? this.caution);
  }
}
```

## 3. Les repositories

On crée les repositories qui permettent de récupérer les données depuis l'API.
Pour ce faire, il faut connaître les endpoints de l'API. Il faut crée un repository pour chaque groupe d'endpoint. Par exemple dans le cas du module de prêt, il y a des endpoints `loans/` (avec un id ou non) et des endpoints `loans/item/`. On crée donc deux repositories.

Exemple : _loan/repositories/item_repository.dart_

```dart
import 'package:myecl/loan/class/item.dart';
import 'package:myecl/tools/repository/repository.dart';

class ItemRepository extends Repository {
  @override
  // ignore: overridden_fields
  final ext = "loans/loaners/";

  Future<List<Item>> getItemList(String loanerId) async {
    return List<Item>.from((await getList(suffix: loanerId + "/items")).map((x) => Item.fromJson(x)));
  }

  Future<Item> createItem(String loanerId, Item item) async {
    return Item.fromJson(await create(item.toJson(), suffix: loanerId + "/items"));
  }

  Future<bool> updateItem(String loanerId, Item item) async {
    return await update(item.toJson(), loanerId + "/items/" + item.id);
  }

  Future<bool> deleteItem(String loanerId, String itemId) async {
    return await delete(loanerId + "/items/" + itemId);
  }
}
```

- On fait hériter le repository de la classe `Repository`, définie dans _tools/repository/repository.dart_. De cette manière, on élimine énormément de la redondance.
- Les fonctions de `Repository` ne prennent et renvoient que des `String` ou des `List<String>`, c'est pour cela que les fonctions de `ItemRepository` doivent faire les conversions.

- La classe Repository contient 6 fonctions.
  - getList : récupère la liste des éléments
  - create : crée un élément
  - update : met à jour un élément
  - delete : supprime un élément
  - getOne : récupère un élément
  - setToken : permet de définir le token pour les requêtes

Cettte classe a été codée pour rendre plus facile et plus lisible les codes des repositories. Je conseille fortement de s'en servir.

## 4. Les providers

A partir des repositories, on crée les providers qui permettront l'interaction entre l'utilisateur et la base de donnée. Il faut au moins autant de providers que de repositories. Cependant, il est très courant d'en avoir bien plus. Par exmple, l'endpoint `loans/history/` (que j'ai mis dans le repository loan_repository.dart, ce qui peut être discutable) demande son provider car il ne manipule pas les mêmes données que le provider _loan_list_provider.dart_.

La règle est qu'un provider manipule toujours le même type de données. Il en faut donc un pour la liste des prêts, un pour la liste des objets, un pour le détail d'un prêt (endpoints `loans/{loan_id}`), puisque son type est Loan et non `List<Loan>`, et un pour l'historique car la liste des prêts est différentes de celle des prêts en cours.

Exempe : _loan/providers/item_list_provider.dart_

```dart
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:myecl/auth/providers/oauth2_provider.dart';
import 'package:myecl/loan/class/item.dart';
import 'package:myecl/loan/providers/loaner_id_provider.dart';
import 'package:myecl/loan/repositories/item_repository.dart';
import 'package:myecl/tools/providers/list_notifier.dart';

class ItemListNotifier extends ListNotifier<Item> {
  final ItemRepository _itemrepository = ItemRepository();
  late final String loanerId;
  ItemListNotifier({required String token})
      : super(const AsyncValue.loading()) {
    _itemrepository.setToken(token);
  }

  void setId(String id) {
    loanerId = id;
  }

  Future<AsyncValue<List<Item>>> loadLoanList() async {
    return await loadList(() async => _itemrepository.getItemList(loanerId));
  }

  Future<bool> addItem(Item item) async {
    return await add(
        (i) async => _itemrepository.createItem(loanerId, i), item);
  }

  Future<bool> updateItem(Item item) async {
    return await update(
        (i) async => _itemrepository.updateItem(loanerId, i),
        (items, item) =>
            items..[items.indexWhere((i) => i.id == item.id)] = item,
        item);
  }

  Future<bool> deleteItem(Item item) async {
    return await delete(
        (id) async => _itemrepository.deleteItem(loanerId, id),
        (items, item) => items..removeWhere((i) => i.id == item.id),
        item.id,
        item);
  }

  Future<AsyncValue<List<Item>>> copy() {
    return state.when(
        data: (d) async => AsyncValue.data(d.sublist(0)),
        error: (e, s) async => AsyncValue.error(e),
        loading: () async => const AsyncValue.loading());
  }
}

final itemListProvider =
    StateNotifierProvider<ItemListNotifier, AsyncValue<List<Item>>>((ref) {
  final token = ref.watch(tokenProvider);
  final loanerId = ref.watch(loanerIdProvider);
  ItemListNotifier _itemListNotifier = ItemListNotifier(token: token);
  _itemListNotifier.setId(loanerId);
  _itemListNotifier.loadLoanList();
  return _itemListNotifier;
});
```

Encore une fois, on hérite de la classe `ListNotifier` pour pouvoir utiliser les méthodes de la classe.
On passe en premier argument, la fonction du repository que l'on veut utiliser.

Enfin, on récupère le token d'authorization grâce au provider `tokenProvider`, que l'on passe en argument du constructeur du notifier.

## 5. Le router

Tout est expliqué dans le tutoriel sur le routage

## 6. Les pages

On fait ici le front de chaque page.

On commence par créer un template pour toutes les pages du module

```dart
class LoanTemplate extends StatelessWidget {
  final Widget child;
  const LoanTemplate({super.key, required this.child});

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Column(
        children: [
          const TopBar(
            title: LoanTextConstants.loan,
            root: LoanRouter.root,
          ),
          Expanded(child: child)
        ],
      ),
    );
  }
}
```

Ce template ajoute une topbar qui gère les retours au clic du bouton (cf widget custom de Titan). Mettez le comme premier widget dans chacune de vos pages.

Créez ensuite un dossier dans ui par page (ex admin_page pour la page d'administration du module).

Le fichier contenant la page d'appelera ici admin_page.dart, et tous les fichiers dans ce dossier seront des widget utiles à la construction de cette page.

Si certains de vos widget sont utiles à plusieurs pages, placez-les dans le dossier `components`

N'oubliez pas de faire appel à QR pour passer d'une page à l'autre

```dart
// Pour aller sur une page
QR.to(LoanRouter.root + ...);
//...

// Pour revenir en arrière
QR.back();
```

Les parties suivantes détaillent des conseils pour la création de vos pages.

## 7. Les Formulaires

Il est très probable (voir certain) que votre module contienne une partie administrateur qui pourra manipuler des objets du module (par exemple les prêts du module de prêt). Dans ce cas, vous aurez à créer un formulaire pour a minima crée l'objet, voir le modifier. L'implémentation de ces formulaires que je propose n'est pas optimale (le formulaire de modification surtout) en raison de problème de rafraîchissement que je détaillerais, mais c'est pour l'instant la seule solution que j'ai pu faire fonctionner.

Exemple d'un formulaire d'ajout d'objet (Je ne détaille que les différents types de champs qui peuvent être nécessaire, le reste du code est dans des fichiers tels que _add_item_page.dart_).

### Le formulaire textuel

Utiliser un TextEntry (cf widget custom de Titan)


### Le formulaire de date

Utiliser un DateEntry (cf widget custom de Titan)

### Le formulaire à choix unique

```dart
final loaner = useState(ref.watch(loanerProvider));
...
Column(
  children: listLoaner
    .map(
      (e) => RadioListTile(
          title: Text(e.name),
          selected: loaner.value.name == e.name,
          value: e.name,
          groupValue: loaner.value.name,
          onChanged: (s) {
            loaner.value = e;
          }),
    )
    .toList()
  ),
```

Ici, listLoaner est de type `List<Loaner>` et loaner est provider local à cause du `useState` (pour éviter d'avoir à recréer un `StateNotifier` uniquement pour un fichier

### Le formulaire à choix multiple

```dart
Column(
  children: itemList
    .map(
      (e) => CheckboxListTile(
        title: Text(e.name),
        value: ...,
        onChanged: (s) {
          ...
          }
        },
      ),
    )
    .toList();
  )
```

Ce formulaire est une colonne de CheckBox, `value` indique si la case doit être cochée, et `onChanged` est un fonction qui est lancée quand l'ulisatueur coche ou décoche la case.

## 8. Le Pull-to-refresh

Le pull-to-refresh permet de rafraîchir le contenur d'une page en scrollant vers le bas. Puisque les implémentations différent en fonction des plateformes, j'ai créé une classe faisant la disjonction de cas, dans le ficher _tools/refresher.dart_. Passez en argument la zone que vous voulez rendre rafraîchissable et une fonction asynchrone `onRefresh`. Cette fonction doit être une fonction d'un provider (celle appelée à l'initialisation de celui-ci, car seules ces données ont pu changer en temps).


## 9. Le Dialog

Pour les fonctions qui vont avoir un impact irréversible sur la base de donnée, il est bon d'avoir une pop-up de confirmation avant d'exécuter ces-dernières. Pour ce faire, utilisez la classe Dialog dans _tools/functions.dart_, en précisant le titre, la description la fonction asynchrone quand on appuie sur "Oui" (cf widget custom de Titan).
Précisez dans vos pages la fonction à exécuter une fois la pop-up confirmée.

## 10. Le Toast

Les Toasts sont des messages qui apparaissent après un ajout, une modification, une suppression d'un objet ou tout autre interaction avec la base de donnée pour indiquer si l'opération s'est bien déroulée ou dans le cas contraire pourquoi.

Exemple d'utilisation dans _loan/ui/pages/add_loan_page/add_loan_page.dart_:

```dart
displayToast(context, TypeMsg.error, LoanTextConstants.invalidDates);
```
