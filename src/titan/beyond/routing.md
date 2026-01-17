---
title: Routage Qlevar
order: 15
category:
  - Guide
---

# Migration du routing

## Introduction

Sur Titan le routage de l'application était géré par un système de provider et d'affichage de page en fonction de la valeur de ces derniers. Ce système, assez simple à mettre en place (d'où son utilisation dans un premier temps), montre ses limites avec Titan web, puisque toutes les pages se situaient à la racine, forçant ainsi le navigateur à télécharger un seul fichier js très lourd. Le nouveau routage de l'application résoud ces problèmes en permettant de gérer des sous-routes et de différer le chargement des fichiers au moment où ils sont nécessaires.

Ce document précise comment mettre en place / migrer vers le routage par qlevar_router.

## Principaux composants

### Le router

Le router est le composant qui gère le routage de l'application. Il comporte une liste de QRoute, qui sont les routes de l'application. Il est possible de déclarer des sous-routes, qui seront chargées au moment où elles sont nécessaires.

### Les middlewares

Les middlewares sont des fonctions qui sont appelées avant l'affichage d'une page. Elles permettent de vérifier si l'utilisateur a le droit d'accéder à la page, et de rediriger l'utilisateur vers une autre page si ce n'est pas le cas.

## Mise en place

### router.dart

Le fichier router.dart est le fichier qui gère le routage de l'application. Il déclare les pages accessibles, sous quel route et avec quel restriction d'accès.

Exemple du router du module cinéma :

```dart
class CinemaRouter {
  final ProviderRef ref;
  static const String root = '/cinema';
  static const String admin = '/admin';
  static const String addEdit = '/add_edit';
  static const String detail = '/detail';
  static final Module module = Module(
      name: "Cinéma",
      icon: HeroIcons.ticket,
      root: CinemaRouter.root,
      selected: false);
  CinemaRouter(this.ref);

  QRoute route() => QRoute(
        path: CinemaRouter.root,
        builder: () => const CinemaMainPage(),
        middleware: [AuthenticatedMiddleware(ref)],
        children: [
          QRoute(path: admin, builder: () => const AdminPage(), middleware: [
            AdminMiddleware(ref, isCinemaAdminProvider),
          ], children: [
            QRoute(path: detail, builder: () => const DetailPage()),
            QRoute(path: addEdit, builder: () => const AddEditSessionPage()),
          ]),
        ],
      );
}
```

On déclare ici les routes de l'application.

On peut voir que la route admin est une sous-route de la route root. On peut également voir que la route admin a deux sous-routes, detail et addEdit.
On remarque également que les routes `admin`, `detail` et `addEdit` ont un middleware. Ce middleware est appelé avant l'affichage de la page, et permet de vérifier si l'utilisateur a le droit d'accéder à la page. Si ce n'est pas le cas, le middleware peut rediriger l'utilisateur vers une autre page.

L'`AuthenticatedMiddleware` vérifie que l'utilisateur est connecté, et le redirige vers la page de connexion si ce n'est pas le cas. L'`AdminMiddleware` vérifie que l'utilisateur est administrateur du cinéma, et le redirige vers la page de connexion du cinéma si ce n'est pas le cas.

Il est à noter que les middlewares s'applique à la route et à toutes ses sous-routes.

On notera également que le router retourne le module, ce qui sera indispensable pour l'ajouter à la side bar du drawer.

### La suppression du routage par provider

Cette étape est assez simple, il suffit de supprimer le provider de routage (ici `cinema_page_provider.dart`) et ces utilisations.

### La mise en place du router

Pour mettre en place le router, il faut remplacer tout le routage précédent par soit :

- `QR.to(<La page à afficher>)` pour afficher une page
- `QR.back()` pour revenir à la page précédente

Exemple :

On remplace :

```dart
pageNotifier.setCinemaPage(CinemaPage.admin);
```

par

```dart
QR.to(CinemaRouter.root + CinemaRouter.admin);
```

On ajoute les chemins, pour suivre la convention établie dans le router :

### Ajout du router du module dans le router principal

On ajouter le router du module dans les routes du router principal, dans le fichier `router.dart` de l'application.

Exemple :

```dart
routes = [
    // ...
    CinemaRouter(ref).route(),
    // ...
];
```

On ajoute enfin le module au drawer (s'il doit l'être) en l'ajoutant dans `settings/providers/module_list_provider.dart`:

```dart
List<Module> allModules = [
    // ...
    CinemaRouter.module,
    // ...
];
```

Et voilà, le routage est mis en place !
