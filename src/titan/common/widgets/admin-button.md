---
title: AdminButton
order: 3
category:
  - Guide
---

#### AdminButton

**Description :**

Le visuel du bouton pour accéder aux pages d'admin.

**Utilisation :**

Utilisation rare (11 fois).
Ce Widget est à utliser dans la page d'où on peut accéder aux pages d'admin (généralement la main_page), donc une fois par module

**Paramètres :**

- `onTap (VoidCallback)` _obligatoire_: La fonction à appeler au clic du bouton
- `textColor (Color)` _optionel_ : La couleur du texte du bouton (par défaut blanc)
- `color (Color)` _optionel_ : La couleur de fond du bouton (par défaut noir)
- `colors (List<Color>)` _optionel_ : Si précisé, le bouton aura un gradient avec les couleurs données

**Exemple :**
_amap/.../main_page.dart_

```dart
if (isAdmin)
	AdminButton(
		onTap: () {
			QR.to(AmapRouter.root + AmapRouter.admin);
		},
		colors: const [
			AMAPColorConstants.greenGradient1,
			AMAPColorConstants.greenGradient2
		],
	),
```
