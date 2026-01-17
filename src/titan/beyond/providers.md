---
title: Riverpod / Providers
order: 9
category:
  - Guide
---

# Riverpod et les Providers

Cette partie est surement la plus technique, mais ces outils sont vraiment très utiles et simplifient énormément le reste.

Pour comprendre la simplification que cela permet, il faut voir que les `StatefulWidgets` ont un gros problème quand les variables doivent être utilisées dans plusieurs widget à la fois. Par exemple, dans le module AMAP, la page principale permet d'afficher les commandes de l'utilisateur, elle a donc besoin de connaître la liste des commandes. Mais les pages pour modifier ou ajouter des commandes sont beaucoup plus loin dans la chaîne des Widgets, et il faudrait alors passer la liste des commandes en paramètres d'une dizaine de Widgets successifs pour que tout fonctionne, ce qui rend le code de ces Widgets plus lourd et compliqué pour rien. Les providers sont une réponse à ce problème.

## Explication des providers

Les providers sont des sortes de variable globale de l'application. Ils peuvent être importé dans n'importe quel Widget indépendemment du widget parent, ce qui permet d'éviter la longue chaîne de `StatefulWidget`. Flutter propose de nombreuses bibliothèques de provider. Celle utilisée par MyECL est [Riverpod](https://riverpod.dev/) (_flutter_riverpod_).

Dans Titan, chaque provider hérite de la classe `StateNotifierProvider<Notifier,Type>`, cette classe a la particularité de ne posséder qu'un seul attribut `state` contenant la valeur du provider. Le `state` d'un provider ne peut être modifier qu'à travers les méthodes d'une classe héritant de `StateNotifier<Type>`, on appelle cette classe un "notifier". C'est la modification du `state` dans les méthodes du notifier qui va prévenir les différents widgets utilisant le provider pour leur dire de s'actualiser.

Pour illustrer tout ça, voici le code d'un provider ayant simplement pour but de garder en mémoire entre plusieurs pages un Advert (une annonce) sur le module Annonce :

```dart
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:myecl/advert/class/advert.dart';

class AdvertNotifier extends StateNotifier<Advert> {
  AdvertNotifier() : super(Advert.empty());

  void setAdvert(Advert i) {
    state = i;
  }
}

final advertProvider = StateNotifierProvider<AdvertNotifier, Advert>((ref) {
  return AdvertNotifier();
});

```

Détaillons ce code ensemble :

- ```dart
  import package:flutter_riverpod/flutter_riverpod.dart';
  ```
  Nous permet d'importer les classes `StateNotifier` et `StateNotifierProvider`
- ```dart
  class AdvertNotifier extends StateNotifier<Advert> {
  AdvertNotifier() : super(Advert.empty());
  ```
  On commence par créer notre notifier, la classe `AdvertNotifier` qui hérite de `StateNotifier`. On précise entre chevrons (`<Advert>`) que le `state` de notre provider contiendra un objet de type `Advert`.
  L'objet contenu entre les parenthèses du `super(...)` correspond au `state` par défaut de notre provider, ici un Advert vide (c'est la synthaxe du constructeur en dart).
- ```dart
      void setAdvert(Advert i) {
        state = i;
    }
  ```
  Notre provider possède une unique méthode `setAdvert`, lorsqu'elle est appellée, le `state` du provider est modifié par l'Advert en argument, ce qui va notifier tout les widgets utilisant ce provider pour qu'ils se mettent à jour.
- ```dart
      final advertProvider = StateNotifierProvider<AdvertNotifier, Advert>((ref) {
  return AdvertNotifier();
  });
  ```
  Enfin, on défini notre provider qui hérite de `StateNotifierProvider`.
  On utilise le constructeur `StateNotifierProvider<Notifier,Type>()` pour définir notre provider. On lui spécifie entre crochet le type (la classe) du notifier et le type du `state`, on lui fourni dans les parenthèses une fonction qui retourne l'objet correspondant à notre classe AdvertNotifier.

Maintenant si on veut utiliser notre provider dans un autre fichier il faut importer notre provider :

```dart
import 'package:myecl/advert/providers/advert_provider.dart';
```

Le `StatelessWidgets` utilisé jusque là doit être remplacé par un `ConsumerWidget` et il faut dire à notre interface de s'actualiser lors d'un changement dans le `state` du provider :

```dart
final advert = ref.watch(advertProvider);
```

La variable `advert` contient l'état du provider et la clause `ref.watch(advertProvider)` "surveille" les éventuelles changements dans l'état du provider pour provoquer l'actualisation du widget.

Enfin, pour pouvoir appliquer des modifications à l'état du provider, il faut utiliser le notifier :

```dart
final advertNotifier = ref.watch(advertProvider.notifier);
```

Qu'on utilise de cette manière :

```dart
advertNotifier.setAdvert(advert);
```

Concrêtement, le code notre page ressemblerait à ça :

```dart
import 'package:flutter/material.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:myecl/advert/providers/advert_provider.dart';
import 'package:myecl/advert/ui/pages/advert.dart';
...

class AdvertAddEditAdvertPage extends HookConsumerWidget {
  const AdvertAddEditAdvertPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final advert = ref.watch(advertProvider);
    final advertNotifier = ref.watch(advertProvider.notifier);
		...

    return AdvertTemplate(
    ...
    );
  }
}

```

## Les providers comme lien entre UI et API

Dans Titan, il est souvant nécessaire de récuperer des informations depuis l'API d'Hyperion. Les classes et les repositories nous permettent la récupération de ces infos mais aimerait pouvoir les conserver au cours de notre utilisation de l'appli sans avoir besoin de les demander à Hyperion à chaque changement de page.

Il est possible d'utilliser des providers pour la gestion de nos objets API. Les méthodes du notifier permettent de gérer les différents états des requêtes API et surtout d'actualiser nos objets en conséquence.

Exemple : Un provider contient la liste des Sessions du module cinéma et on veut en ajouter une en base de donnée. Une solution pourrait être de faire la requête d'ajout et de charger ensuite toutes les sessions depuis Hyperion pour mettre à jour notre provider.
Une solution plus propre, serait de mettre à jour ou non la liste du provider directement grâce au résultat de la requête d'ajout.

C'est pour simplifier ces traitements que nous avons créé des templates de notifier, disponibiles dans les `lib/tools/providers/` : `SingleNotifier`, `ListNotifier`, `MapNotifier`. Il suffit alors d'hériter de ces classes pour faciliter les appels API.

Voici, par exemple, le code du `ListNotifier` :

```dart
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:myecl/tools/exception.dart';

abstract class ListNotifier<T> extends StateNotifier<AsyncValue<List<T>>> {
  ListNotifier(AsyncValue state) : super(const AsyncLoading());

  Future<AsyncValue<List<T>>> loadList(Future<List<T>> Function() f) async {
    try {
      final data = await f();
      state = AsyncValue.data(data);
      return state;
    } catch (e) {
      state = AsyncValue.error(e, StackTrace.current);
      if (e is AppException && e.type == ErrorType.tokenExpire) {
        rethrow;
      } else {
        return state;
      }
    }
  }

  Future<bool> add(Future<T> Function(T t) f, T t) async {
    return state.when(data: (d) async {
      try {
        final newT = await f(t);
        d.add(newT);
        state = AsyncValue.data(d);
        return true;
      } catch (error) {
        state = AsyncValue.data(d);
        if (error is AppException && error.type == ErrorType.tokenExpire) {
          rethrow;
        } else {
          return false;
        }
      }
    }, error: (error, s) {
      if (error is AppException && error.type == ErrorType.tokenExpire) {
        throw error;
      } else {
        state = AsyncValue.error(error, s);
        return false;
      }
    }, loading: () {
      state =
          const AsyncValue.error("Cannot add while loading", StackTrace.empty);
      return false;
    });
  }

  Future<bool> addAll(
      Future<List<T>> Function(List<T> listT) f, List<T> listT) async {
    return state.when(data: (d) async {
      try {
        final newT = await f(listT);
        d.addAll(newT);
        state = AsyncValue.data(d);
        return true;
      } catch (error) {
        state = AsyncValue.data(d);
        if (error is AppException && error.type == ErrorType.tokenExpire) {
          rethrow;
        } else {
          return false;
        }
      }
    }, error: (error, s) {
      if (error is AppException && error.type == ErrorType.tokenExpire) {
        throw error;
      } else {
        state = AsyncValue.error(error, s);
        return false;
      }
    }, loading: () {
      state = const AsyncValue.error(
          "Cannot addAll while loading", StackTrace.empty);
      return false;
    });
  }

  Future<bool> update(Future<bool> Function(T t) f,
      List<T> Function(List<T> listT, T t) replace, T t) async {
    return state.when(data: (d) async {
      try {
        final value = await f(t);
        if (!value) {
          return false;
        }
        d = replace(d, t);
        state = AsyncValue.data(d);
        return true;
      } catch (error) {
        state = AsyncValue.data(d);
        if (error is AppException && error.type == ErrorType.tokenExpire) {
          rethrow;
        } else {
          return false;
        }
      }
    }, error: (error, s) {
      if (error is AppException && error.type == ErrorType.tokenExpire) {
        throw error;
      } else {
        state = AsyncValue.error(error, s);
        return false;
      }
    }, loading: () {
      state = const AsyncValue.error(
          "Cannot update while loading", StackTrace.empty);
      return false;
    });
  }

  Future<bool> delete(Future<bool> Function(String id) f,
      List<T> Function(List<T> listT, T t) replace, String id, T t) async {
    return state.when(data: (d) async {
      try {
        final value = await f(id);
        if (!value) {
          return false;
        }
        d = replace(d, t);
        state = AsyncValue.data(d);
        return true;
      } catch (error) {
        state = AsyncValue.data(d);
        if (error is AppException && error.type == ErrorType.tokenExpire) {
          rethrow;
        } else {
          return false;
        }
      }
    }, error: (error, s) {
      if (error is AppException && error.type == ErrorType.tokenExpire) {
        throw error;
      } else {
        state = AsyncValue.error(error, s);
        return false;
      }
    }, loading: () {
      state = const AsyncValue.error(
          "Cannot delete while loading", StackTrace.empty);
      return false;
    });
  }
}
```

Pour résumé (et parce qu'il n'est pas nécessaire de comprendre chaque ligne de code pour l'utiliser), le notifier possède des méthodes loadList, add, addAll, update et delete. Ces méthodes sont chargées de :

- faire des appels API
- gérer les exceptions
- mettre à jour le `state` en conséquence

Et voici le code du provider associé à la liste des Sessions du module cinéma :

```dart
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:myecl/cinema/class/session.dart';
import 'package:myecl/cinema/repositories/session_repository.dart';
import 'package:myecl/tools/providers/list_notifier.dart';
import 'package:myecl/tools/token_expire_wrapper.dart';

class SessionListNotifier extends ListNotifier<Session> {
  final SessionRepository sessionRepository;
  SessionListNotifier({required this.sessionRepository})
      : super(const AsyncValue.loading());

  Future<AsyncValue<List<Session>>> loadSessions() async {
    return await loadList(sessionRepository.getAllSessions);
  }

  Future<bool> addSession(Session session) async {
    return await add(sessionRepository.addSession, session);
  }

  Future<bool> updateSession(Session session) async {
    return await update(
        sessionRepository.updateSession,
        (sessions, session) => sessions
          ..[sessions.indexWhere((b) => b.id == session.id)] = session,
        session);
  }

  Future<bool> deleteSession(Session session) async {
    return await delete(
        sessionRepository.deleteSession,
        (sessions, session) => sessions..removeWhere((b) => b.id == session.id),
        session.id,
        session);
  }
}

final sessionListProvider =
    StateNotifierProvider<SessionListNotifier, AsyncValue<List<Session>>>(
        (ref) {
  final sessionRepository = ref.watch(sessionRepositoryProvider);
  SessionListNotifier notifier = SessionListNotifier(
    sessionRepository: sessionRepository,
  );
  tokenExpireWrapperAuth(ref, () async {
    await notifier.loadSessions();
  });
  return notifier;
});
```

Dans sa forme globale, il est très similaire avec le provider vu précédement. Cette fois-ci, on initialise le notifier avec un `sessionRepository` permettant la réalisation des appels API (ligne 41-42).
Avant de retourner le notifier, on cherche à load les sessions dans le state (ligne 45).

## Les implémentations

Les méthodes du `SessionListNotifier ` sont des fonctions basée sur les méthodes existantes du `ListNotifier`. Les fonctions du `ListNotifier` prennent en paramètre :

- La fonctions réalisant l'appels API (ici, une méthode du repository)
- Quand c'est nécessaire, une fonction réalisant des modifications sur la liste
- Quand c'est nécessaire, l'objet de la requête (ici, une session)

## Les AsyncValues

On remarque ensuite que le `StateNotifier` (implémenté dans le `ListNotifier`) est de type `AsyncValue<List<Item>>`. Une variale `AsyncValue` peut valoir trois choses :

- `AsyncData<T>` où T est le type spécifié dans `AsyncValue` (ici, ce serait une list d'Item)
- `AsyncError` où l'on peut spécifier un message d'erreur
- `AsyncLoading`

Ce type de variable est très utile (voir indispensable) pour la communication avec une API, car elle permet de gérer tout les cas de figure (l'attente de la réponse, l'erreur ou la donnée renvoyée). La seule fonction à retenir au sujet de ces variables est `.when()`, qui permet de faire la disjonction de cas.

Ainsi, state est une `AsyncValue` qui, si elle possède des données, sont de type `List<Item>` (spécifié par `<Item>` à l'initialisation de `ListNotifier`.
