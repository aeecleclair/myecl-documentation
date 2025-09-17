---
title: Comment ça marche ?
order: 1
category:
  - Guide
---

# Intro
Quand on parle de notifications push, il faut savoir qu’elles ne passent jamais directement du serveur à l'app.
Il y a toujours un intermédiaire, géré par Apple ou Google, qui est le seul autorisé à pousser une notif jusqu’au téléphone.
Chez Apple on a APNs (Apple Push Notification service) et chez Google on a FCM (Firebase Cloud Messaging).
Afin d'unifier cela, nous utilisons l'API de Firebase pour envoyer nos notifications (le même Firebase qui gère les notifications Android).
Il faut donc créer un projet sur la console Firebase (alors la c'est Jho) ce qui nous permet d'obtenir une config à placer dans les fichiers pour build notre app.

# Concept fonctionnel
Pour envoyer une notification, il faut donc que Firebase sache à qui l'envoyer. Les utilisateurs sont donc identifiés par un token unique, généré par Firebase.
A chaque ouverture de l'app Titan demande à Hyperion un nouveau token qui est donc généré par Firebase et renvoyé à Hyperion qui le stocke.
Quand on veut envoyer une notif, on envoie le message et le token de l'utilisateur à Firebase qui se charge de l'envoyer au téléphone.
Sauf que nous on veut envoyer des messages à des utilisateurs donc on associe dans la table notification_firebase_devices un user_id et un firebase_device_token.

# Concept de topic
Pour éviter d'envoyer n requete à Firebase pour n utilisateurs, on utilise les topics.
Un topic est un groupe d'utilisateurs. On peut s'abonner à un topic et recevoir toutes les notifications envoyées à ce topic.

# Dépendance à Google

On envoie donc toutes nos notifs à Firebase qui se charge de les envoyer aux utilisateurs. Ce qui peut poser quelques questions de RGPD.
Ce qui avait été tout d'abord imaginer (et qui fonctionnait plus ou moins mais plutôt moins) c'était d'envoyer à Firebase une notif vide.
Firebase se chargeait de l'envoyer au téléphone (pour réveiller MyECL) qui demandait alors à Hyperion le contenu de la notif.
Très malin mais ça marche pas ou mal (parfois sur iOS parfois sur Android) bref c'est pas fiable.
