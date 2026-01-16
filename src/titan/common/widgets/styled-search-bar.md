---
title: StyledSearchBar
order: 8
category:
  - Guide
---

#### StyledSearchBar

**Description :**

Le style d'une barre de recherche

**Utilisation :**

Utilisation rare (7 fois).
A utiliser pour mettre en place une barre de recherche.

**Paramètres :**

- `label (String)` _obligatoire_: Le texte de la barre de recherche (au dessus du texte de recherche)
- `color (Color)` _optionel_ : La couleur de fond du bouton (par défaut gris)
- `onChanged (Future Function(String))` _optionel_ : La fonction à lancer quand le texte change
- `suffixIcon (Widget)` _optionel_ : Un widget qui sera tout à droite (typiquement un icône de recherche
- `padding (EdgeInsetsGeometry)` _optionel_ : Le padding autour de la barre de recherche (par défaut 30px horizontal)
- `onSuffixIconTap (void Function(FocusNode focusNode, TextEditingController controller))` _optionel_ : La fonction à lancer quand on clic sur le suffixIcon (il faut donc précisez le suffixIcon)

**Exemple :**
_loaners_items.dart_

```dart
StyledSearchBar(
	label: LoanTextConstants.itemHandling,
	onChanged: (value) async {
		if (editingController.text.isNotEmpty) {
			loanersItemsNotifier.setTData(
      loaner,
			await itemListNotifier
				.filterItems(editingController.text));
    } else {
			loanersItemsNotifier.setTData(loaner, itemList);
		}
	},
)
```
