---
title: CustomDialogBox
order: 5
category:
  - Guide
---

#### CustomDialogBox

**Description :**

Une popup avec une action quand on la valide.

**Utilisation :**

Utilisation très fréquente (42 fois).
Ce dialog est à utiliser dès que l'utilisateur veux faire quelque chose d'irréversible (une suppression par exemple)

**Paramètres :**

- `title (String)` _obligatoire_: Le titre de la popup
- `description (String)` _obligatoire_ : La description de la popup
- `onYes (VoidCallback)` _obligatoire_: La fonction à appeler quand on valider la popup

**Exemple :**
_product_choice_button.dart_

```dart
CustomDialogBox(
	descriptions: AMAPTextConstants.deletingOrder,
	title: AMAPTextConstants.deleting,
	onYes: () {
		orderNotifier.setOrder(Order.empty());
		QR.back();
	})
```
