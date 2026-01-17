---
title: AsyncChild
order: 3
category:
  - Guide
---

#### AsyncChild

**Description :**
Ce Widget permet de gérer les AsyncValue, en gérant les trois valeurs possibles. Par défaut, un AsyncLoading sera rendu par un Loader et un AsyncError par un Text affichant l'erreur, mais tout est customisable.

**Utilisation :**

Utilisation assez fréquente (72 fois).
Ce Widget sert dès qu'il y a un AsyncValue dont la valeur fait directement changer les widgets à afficher.

**Paramètres :**

- `value (AsyncValue<T>)` _obligatoire_ : L'asyncValue dont on veux rendre le contenu
- `builder (Widget Function(BuildContext context, T value))` _obligatoire_ : Le builder qui prend en entrée le contexte et la valeur de l'AsyncData et qui doit retourner un Widget.
- `errorBuilder (Widget Function(Object? error, StackTrace? stack))` _optionel_ : Le builder de l'erreur, à ne donner que si le Text avec l'erreur ne convient pas.
- `loadingBuilder (Widget Function(BuildContext context))` _optionel_ : Le builder du loading, à ne donner que si le Loader ne convient pas.
- `orElseBuilder (Widget Function(BuildContext context, Widget child))` _optionel_ : Le builder de l'erreur et du loading, le child est soit l'errorBuilder, s'il est donné, soit le Text dans le cas de l'erreur, soit le loadingBuilder, s'il est donné, soit le Loader. Ce builder permet d'avoir un style pour ces deux options, dans le cas où les data doivent prendrer une toutes autres formes (Ex: Une colonne pour les données et juste un SizedBox pour loading et error)
- `loaderColor (Color)` _optionel_ : La couleur du loader et du texte.

**Exemple :**
_cash_container.dart_

```dart
final cash = ref.watch(cashProvider);
return AsyncChild(
    value: cash,
    builder: (context, cash) =>
        Row(children: cash.map((e) => UserCashUi(cash: e)).toList()),
    loaderColor: AMAPColorConstants.greenGradient2);
```
