---
title: Refresher
order: 8
category:
  - Guide
---

#### Refresher

**Description :**

Ce Widget permet de rafraîchir les providers passé en paramètres quand on tire la page vers le bas.

**Utilisation :**

Utilisation fréquente (22 fois).
Ce Widget est à utliser dans les page où on doit rafraîchir les données en tirant vers le bas.

**Paramètres :**

- `child (Widget)` _obligatoire_ : Le contenu du bouton (Ex: un Text)
- `onRefresh (Future Function())` _obligatoire_ : La fonction appelée quand on tire vers le bas (typiquement le chargement d'une donnée)

**Exemple :**
_event/.../main_page.dart_

```dart
Refresher(
	onRefresh: () async {
		await eventListNotifier.loadConfirmedEvent();
	},
	child:  ...
)
```
