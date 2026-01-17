---
title: HorizontalListView / HorizontalListView.builder
order: 6
category:
  - Guide
---

#### HorizontalListView / HorizontalListView.builder

**Description :**

Ce Widget permet de faire proprement un défilement horizontal. Le .builder permet de contruire le widget à partir d'une liste.

**Utilisation :**

Utilisation fréquente (35 fois).
Ce Widget est à utliser dans les page où on doit afficher une liste de carte d'objet.

**Paramètres :**
HorizontalListView :

- `ìtems (List<T>)` _obligatoire_ : La liste des objets dont on veux faire l'affichage de chaque objet
- `itemBuilder (Widget Function(BuildContext, T, int))` _obligatoire_ : Un builder pour chaque objet de la liste
- `height (double)` _obligatoire_ : La hauteur du Widget
- `horizontalSpace (double)` _optionnel_ : La largeur entre les bords horizontaux et le premier et le dernier objet (15 par défaut)
- `length (int)` _optionnel_ : Le nombre d'objet à afficher dans la liste
- `firstChild (Widget)` _optionnel_ : Si précisé, le premier élément de la liste (typiquement un boutton ajouter)
  HorizontalListView.builder :
- `children (List<Widget>)` _obligatoire_ : Les Widgets de la ligne
- `height (double)` _obligatoire_ : La hauteur du Widget

**Exemple :**
_advert/../detail_page.dart_

```dart
HorizontalListView.builder(
	height: 35,
	horizontalSpace: 30,
	items: inTagChipsList,
	itemBuilder:
		(BuildContext context, String item, int index) =>
				TagChip(tagname: item)),
```
