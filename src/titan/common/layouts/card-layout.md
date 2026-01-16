---
title: CardLayout
order: 5
category:
  - Guide
---

#### CardLayout

**Description :**

Cette carte permet d'uniformiser l'apparence des cartes de chaque module. La forme est fixe, mais la couleur peut changer.

**Utilisation :**

Utilisation fréquente (34 fois).
Ce Widget est à utliser dans les page où on doit afficher une carte d'un objet.

**Paramètres :**

- `child (Widget)` _obligatoire_ : Le contenu du bouton (Ex: un Text)
- `color (Color)` _obligtoire_ : La couleur de fond du bouton
- `colors (Color)` _optionel_ : Si donné, le fond du bouton sera un gradient avec colors comme couleur.
- `shadownColor (Color)` _optionel_ : Si donnée, la couleur de la shadow
- `borderColor (Color)` _optionel_ : Si donné, la couleur de la bordure
- `width (double)` _optionel_ : La largeur de la carte
- `height (double)` _optionel_ : La hauteur de la carte
- `id (String)` _optionel_ : Si précisé, avec l'id de l'objet dont on fait la carte, et si un page accessible depuis la page où ce Widget existe contient également un CardLayout avec le même id (d'où l'idée d'utiliser l'id de l'objet), alors la carte aura une animation de transition entre les deux pages (quelque soit la forme du child des deux pages)
- `padding (EdgeInsetsGeometry)` _optionel_ : L'espace entre la carte et son enfant
- `margin (EdgeInsetsGeometry)` _optionel_ : L'espace entre la carte et son parent

**Exemple :**
_delivery_handler.dart_

```dart
CardLayout(
	height: 160,
	width: 100,
	shadowColor: AMAPColorConstants.textDark.withOpacity(0.2),
		child: const Center(
			child: HeroIcon(
				HeroIcons.plus,
				color: AMAPColorConstants.textDark,
				size: 50,
			),
		),
	)
```
