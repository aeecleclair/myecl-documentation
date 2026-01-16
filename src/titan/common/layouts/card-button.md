---
title: CardButton
order: 4
category:
  - Guide
---

#### CardButton

**Description :**

Ce bouton permet d'uniformiser l'apparence des boutons d'ajout, d'édition de suppression d'un objet, ou de toutes autres actions dans une carte. La forme est fixe, mais la couleur peut changer.

**Utilisation :**

Utilisation fréquente (37 fois).
Ce bouton est à utliser dans les page d'ajout et d'édition d'objet, en le passant comme builder d'un WaitingButton.

**Paramètres :**

- `child (Widget)` _obligatoire_ : Le contenu du bouton (Ex: un Text)
- `color (Color)` _obligtoire_ : La couleur de fond du bouton
- `colors (Color)` _optionel_ : Si donné, le fond du bouton sera un gradient avec colors comme couleur.
- `shadownColor (Color)` _optionel_ : Si donnée, la couleur de la shadow
- `borderColor (Color)` _optionel_ : Si donné, la couleur de la bordure

**Exemple :**
_delivery_ui.dart_

```dart
CardButton(colors: const [
		AMAPColorConstants.redGradient1,
		AMAPColorConstants.redGradient2
	], child: child)
```
