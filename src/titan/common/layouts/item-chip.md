---
title: ItemChip
order: 7
category:
  - Guide
---

#### ItemChip

**Description :**

Ce Widget permet de faire proprement un chip avec une action au clic, sa couleur dépend de s'il est séléctionné.

**Utilisation :**

Utilisation assez rare (10 fois).
Ce Widget est à utliser dans les page où on doit afficher une liste de clée.

**Paramètres :**

- `child (Widget)` _obligatoire_ : Le contenu du bouton (Ex: un Text)
- `selected (bool)` _obligatoire_ : Si le chip est séléctionné
- `onTap (Function())` _optionel_ : L'action à faire au clic

**Exemple :**
_section_bar.dart_

```dart
ItemChip(
	onTap: () {
		QR.to(VoteRouter.root +
			VoteRouter.admin +
			VoteRouter.addSection);
		},
  child: const HeroIcon(
		HeroIcons.plus,
		color: Colors.black,
  ),
)
```
