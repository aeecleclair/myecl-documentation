---
title: TextEntry
order: 9
category:
  - Guide
---

#### TextEntry

**Description :**

Un input de texte avec des validateur et un style par défaut.

**Utilisation :**

Utilisation très fréquente (47 fois).
Cet input à ajouter dans des formulaires pour demander de remplir un champ. Il est très customisable, donc il couvre très certainement tous les cas d'utilisation.

**Paramètres :**

- `label (String)` _obligatoire_: Le texte du bouton (qui sera au dessus du texte de l'utilisateur)
- `controller (TextEditingController)` _obligatoire_: Le controller qui récupérera le texte
- `suffix (String)` _optionel_: La texte à afficher à droite du texte entré
- `prefix (String)` _optionel_: La texte à afficher à gauche du texte entré
- `minLines (int)` _optionel_: Le nombre minimal de ligne à afficher
- `maxLines (int)` _optionel_: Le nombre maximal de ligne que l'utilisateur peut remplir
- `noValueError (String)` _optionel_: La texte lorsqu'un texte est attendu mais non renseigné (par défaut : Veuillez entrer une valeur)
- `isInt (bool)` _optionel_ : Si le texte entré doit être un entier positif (par défaut false)
- `isDouble (bool)` _optionel_ : Si le texte entré doit être un double positif (par défaut false)
- `canBeEmpty (bool)` _optionel_ : Si le champ est optionel (par défaut false)
- `enabled (bool)` _optionel_ : Si l'input est séléctionable (par défaut true)
- `keyboardType (TextInputType)` _optionel_ : Le type de clavier (par défaut classique)
- `color (Color)` _optionel_ : La couleur du texte (par défaut noir)
- `enabledColor (Color)` _optionel_ : La couleur de l'input s'il est clicable (par défaut noir)
- `errorColor (Color)` _optionel_ : La couleur du l'input si le texte ne vérifie pas les conditions (par défaut rouge)
- `suffixIcon (Widget)` _optionel_ : Un widget qui sera tout à droite
- `onChanged (Future Function(String))` _optionel_ : La fonction à lancer quand le texte change
- `validator (String? Function(String))` _optionel_ : La fonction à lancer quand pour valider le texte (en plus des validateurs par défaut, doit retourner null si le texte vérifie la condition, et un message d'erreur sinon)

**Exemple :**
_admin/.../edit_page.dart_

```dart
TextEntry(
	controller: name,
	color: ColorConstants.gradient1,
	label: AdminTextConstants.name,
	suffixIcon: const HeroIcon(HeroIcons.pencil),
	enabledColor: Colors.transparent,
),
```
