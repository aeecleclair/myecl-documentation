---
title: DateEntry
order: 6
category:
  - Guide
---

#### DateEntry

**Description :**

Un bouton pour l'affichage d'un choix de date et / ou heure.

**Utilisation :**

Utilisation fréquente (22 fois).
Ce bouton dans des formulaires pour demander une date et / ou une heure. Il est à combiner avec les fonctions getFullDate, getOnlyHourDate, getOnlyDayDate.

**Paramètres :**

- `onTap (VoidCallback)` _obligatoire_: La fonction à appeler au clic du widget
- `label (String)` _obligatoire_ : Le texte à afficher dans le bouton
- `controller (TextEditingController)` _obligatoire_ : le controller qui récupèrera la date
- `enabled (bool)` _optionel_ : Si le bouton est cliquable
- `color (Color)` _optionel_ : La couleur du texte (par défaut noir)
- `enabledColor (Color)` _optionel_ : La couleur de la ligne en dessous (par défaut noir)
- `errorColor (Color)` _optionel_ : La couleur de la ligne en dessous en cas d'erreur (par défaut rouge)
- `suffixIcon (Widget)` _optionel_ : Un widget à afficher tout à droite

**Exemple :**
_add_edit_session.dart_

```dart
DateEntry(
	onTap: () => getFullDate(context, start),
	label: CinemaTextConstants.sessionDate,
	controller: start,
),
```
