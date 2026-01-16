---
title: AutoLoaderChild
order: 4
category:
  - Guide
---

#### AutoLoaderChild

**Description :**

Ce Widget permet de charger une donnée qui sera ajoutée à un MapNotifier, tout en affichant quelque chose pendant l'attente. Il faut s'en servir dès que les conditions suivantes sont vérifiées :

- Il faut un MapNotifier
- On veux l'approvisionner
- On veux afficher quelque chose quelque soit l'état du MapNotifier
  Ex: la gestion des logos des prétendances du modules de vote, on ne les charges qui si l'utilisateurs peut les voir.

**Utilisation :**

Utilisation assez rare (10 fois).
Ce Widget est conçus pour un cas d'usage trés précis, mais il permet d'abstraire toutes la logique et d'éviter les cas d'erreurs qui ont étés très compliquées à trouver et résoudre.

**Paramètres :**

- `value (AsyncValue<Map<MapKey, AsyncValue<List<MapValue>>>>)` _obligatoire_ : Le MapNotifier dont on veux utiliser les données pour de l'affichage.
- `notifier (MapNotifier<MapKey, MapValue>)` _obligatoire_ : Le notifier de value
- `mapKey (MapKey)` _obligatoire_ : La clée de la valeur que l'on veux afficher
- `loader (Future<MapValue> Function(MapKey t))` _obligatoire si listLoader n'es pas donné_ : la fonction à appeler pour charge la donnée manquante (typiquement l'appel à un SimpleNotifier)
- `listLoader (Future<AsyncValue<List<MapValue>>> Function(MapKey t))` _obligatoire si loader n'est pas donné_: la fonction à appeler pour charge la donnée manquante (typiquement l'appel à un ListNotifier)
- `dataBuilder Widget Function(BuildContext context, MapValue value))` _obligatoire_ : Le builder qui prend en entrée le contexte et la valeur de la map associée à mapKey et qui doit retourner un Widget.
- `errorBuilder (Widget Function(Object? error, StackTrace? stack))` _optionel_ : Le builder de l'erreur, à ne donner que si le Text avec l'erreur ne convient pas.
- `loadingBuilder (Widget Function(BuildContext context))` _optionel_ : Le builder du loading, à ne donner que si le Loader ne convient pas.
- `orElseBuilder (Widget Function(BuildContext context, Widget child))` _optionel_ : Le builder de l'erreur et du loading, le child est soit l'errorBuilder, s'il est donné, soit le Text dans le cas de l'erreur, soit le loadingBuilder, s'il est donné, soit le Loader. Ce builder permet d'avoir un style pour ces deux options, dans le cas où les data doivent prendrer une toutes autres formes (Ex: Une colonne pour les données et juste un SizedBox pour loading et error)
- `loaderColor (Color)` _optionel_ : La couleur du loader et du texte.

**Exemple :**
_contender_logo.dart_

```dart
final contenderLogos = ref.watch(contenderLogosProvider);
final contenderLogosNotifier = ref.read(contenderLogosProvider.notifier);
final logoNotifier = ref.read(contenderLogoProvider.notifier);
return AutoLoaderChild(
    value: contenderLogos,
    notifier: contenderLogosNotifier,
    mapKey: contender,
    loader: (contender) => logoNotifier.getLogo(contender.id),
    dataBuilder: (context, logo) => Container(
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            image: DecorationImage(
              image: logo.image,
              fit: BoxFit.cover,
            ),
          ),
        ),
    );
```
