---
title: AddEditButtonLayout
order: 3
category:
  - Guide
---

#### AddEditButtonLayout

**Description :**

Ce bouton permet d'uniformiser l'apparence des boutons de confirmation d'ajout et d'édition d'un objet. La forme est fixe, mais la couleur peut changer.

**Utilisation :**

Utilisation assez rare (14 fois).
Ce bouton est à utliser dans les page d'ajout et d'édition d'objet, en le passant comme builder d'un WaitingButton.

**Paramètres :**

- `child (Widget)` _obligatoire_ : Le contenu du bouton (Ex: un Text)
- `color (Color)` _optionel_ : La couleur de fond du bouton (Par défaut, noir)
- `colors (Color)` _optionel_ : Si donné, le fond du bouton sera un gradient avec colors comme couleur.

**Exemple :**
_add_edit_product.dart_

```dart
AddEditButtonLayout(
	color: AMAPColorConstants.greenGradient1,
	gradient: AMAPColorConstants.greenGradient2,
	child: child)
```
