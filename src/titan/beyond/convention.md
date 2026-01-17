---
title: Dénomination
order: 14
category:
  - Guide
---

# Comment nommer les choses

## Les variables

En Dart, les variables suivent la convention _lowerCamelCase_.

Une classe suit la convention _UpperCamelCase_.

Un fichier suit la convention _lowercase_with_underscores_.

On ne met pas de "\_" avant le nom des variables.

## Les repositories

Le nom du fichier indique quel est le repository dans ce fichier, le nom du fichier suit la convention : _\<\<nom de la classe manipulé par le repository>>\_repository.dart_
Le nom de la classe dans le fichier suit la convention `<<nom de la class>>Repository`

Ex : dans le fichier _item_repository.dart_ la classe est `ItemRepository`

Les fonctions créées par les fonctions de `Repository` se nomment en ajoutant le nom de la classe après le nom de la fonction.

Ex : `createItem` utilise la fonction `create` de `Repository`

:exclamation: Dans le cas de `getList`, il est plus convenable d'intercaler le nom de la classe, c'est bien plus lisible (ex: `getBookingList`)

## Les providers

On suit la même convention que pour les repositories :

Ex : `ItemListNotifier` implémente `ListNotifier<Item>` (c'est une classe)
et `itemListProvider` est un `StateNotifierProvider` qui manipule `List<Item>` (c'est une variable)

Dans les fichiers qui utilisent le provider, on le nomme en enlevant "provider", et en ajoutant "Notifier", s'il s'agit de son notifier.

Ex :

```dart
   final itemList = ref.watch(itemListProvider);
   final itemListNotifier = ref.watch(itemListProvider.notifier);
```
