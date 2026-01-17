---
title: Gestion erreurs
order: 12
category:
  - Guide
---

# Gestion des erreurs

## AppException

La classe AppException est une extension de Exception, qui permet de gérer les erreurs de l'application. Elle a deux attributs :

- `type` : le type d'erreur parmi les types prédéfinis dans la classe ErrorType :
  - tokenExpire
  - notFound
  - invalidData
- `message` : le message d'erreur
