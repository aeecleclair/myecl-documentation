---
title: TopBar
order: 10
category:
  - Guide
---

#### TopBar

**Description :**

La top bar de chaque module, contient toutes la gestion des animations.

**Utilisation :**

Utilisation rare (13 fois).
Ce Widget est à utliser une fois par module, dans le template.

**Paramètres :**

- `label (String)` _obligatoire_: Le nom du module
- `root (String)` _optionel_ : Le chemin racine du module (par ex /amap pour le module Amap)
- `onBack (VoidCallback)` _optionel_ : La fonction à appeler quand on quitte le module
- `rightIcon (Widget)` _optionel_ : Un Widget à mettre à droite

**Exemple :**
_admin.dart_

```dart
TopBar(
  title: AdminTextConstants.administration,
	root: AdminRouter.root,
	onBack: () {
	tokenExpireWrapper(ref, () async {
		await meNotifier.loadMe(); // Quand on quitte les paramètres on remet à jour les infos de l'utilisateur
	});
})
```
