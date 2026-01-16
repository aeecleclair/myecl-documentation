---
title: AsyncChild
order: 5
category:
  - Guide
---

#### WaitingButton

**Descrìption :**
Il a été designé pour gérer l'attente de la réponse de l'API. Au clic, il rétrécie, affiche un Loader et n'est pas cliquable tant qu'il n'y a pas eu de réponse.

**Utilisation :**

Utilisation très fréquente (54 fois).
Ce Widget est un bouton qui doit être utilisé quand la fonction qu'il appele contient un appel à l'API.

**Paramètres :**

- `child (Widget) obligatoire : Ce qui doit être dans le bouton (typiquement un Text ou un Icon)
- `builder (Widget Function(Widget))` obligatoire : Le visuel du bouton (typiquement un AddEditButtonLayout)
  final Color waitingColor;
  final Future Function()? onTap;

**Exemple :**
_association_ui.dart_

```dart
WaitingButton(
		onTap: onDelete,
		builder: (child) => AssociationButton(
					gradient1: ColorConstants.gradient1,
					gradient2: ColorConstants.gradient2,
					child: child,
				),
		child: const HeroIcon(
			HeroIcons.xMark,
      color: Colors.white,
		),
  ),
```

Info : OnDelete est un fonction définie plus haut, et AssociationButton est un Widget spécifique au module
