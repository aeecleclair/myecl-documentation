---
title: AdminButton
order: 4
category:
  - Guide
---

#### AlignLeftText

**Description :**

Aligne le texte à gauche, très utile pour les formulaires.

**Utilisation :**

Utilisation très fréquente (52 fois).
Il contient beaucoup de paramètres déjà prédéfinis, ce qui permet d'aller assez vite dans la création de formulaires, d'où son utilisation très fréuentes.

**Paramètres :**

- `title (String)` _obligatoire_: Le texte à aligner
- `color (Color)` _optionel_ : La couleur du texte (par défaut noir)
- `fontSize (double)` _optionel_ : La taille du texte (par défaut 18)
- `fontWeight (FontWeight)` _optionel_ : L'épaisseur du texte (par défaut bold)
- `padding (EdgeInsetsGeometry)` _optionel_ : Le padding autour du text (par défaut aucun)

**Exemple :**
_add_edit_delivery_cmd_page.dart_

```dart
const AlignLeftText(
	AMAPTextConstants.addDelivery, // On ne précise pas le texte avec un texte: ..., c'est comme pour un Text classique
	color: AMAPColorConstants.green2,
),
```
