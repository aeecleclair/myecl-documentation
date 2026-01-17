---
title: Structure module
order: 10
category:
  - Guide
---

# La structure des modules

Cette partie détaille la structure des modules.
Chaque module de MyECL est contenu dans un dossier qui porte le nom du module.
Ce dossier en contient au maximun 5 sous-dossiers :

- `class` : contient les classes du module
- `repositories` : contient les repositories du module
- `providers` : contient les providers du module
- `ui` : contient les widgets du module et la structure des pages du module
  - `components` : contient des Widgets utilisés par plusieurs pages du modules
  - `pages` : contient les pages du module
- `tools` : contient les outils du module (principalement des constantes textuelles et de couleurs du module)
