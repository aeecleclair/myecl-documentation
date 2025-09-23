---
title: L'Asynchrone
description: Explication synthétique de l'intérêt de l'asynchrone en SQLAlchemy
order: 3
category:
  - Guide
  - SQLAlchemy
tag:
  - asynchrone
  - performance
  - base de données
---

# Pourquoi l'Asynchrone en SQLAlchemy ?

## 🤔 Le problème du synchrone

Dans une application web classique avec SQLAlchemy synchrone, chaque requête HTTP bloque complètement le thread pendant l'attente de la base de données :

::: tabs

@tab Synchrone - Bloquant

```python [Synchrone - Bloquant]
def get_user(user_id: str):
    user = session.query(User).filter(User.id == user_id).first()  # 🔴 Thread bloqué
    return user

# Si la DB met 100ms à répondre :
# - 1 requête = 1 thread occupé pendant 100ms
# - 10 requêtes simultanées = 10 threads occupés
# - Limite : ~50-200 connexions concurrentes max
```

@tab Asynchrone - Non-bloquant

```python [Asynchrone - Non-bloquant]
async def get_user(user_id: str):
    result = await db.execute(select(User).where(User.id == user_id))  # 🟢 Thread libéré pendant l'attente
    return result.scalars().first()

# Si la DB met 100ms à répondre :
# - 1 requête = 1 thread libéré pendant 100ms
# - 1000 requêtes simultanées = 1 seul thread nécessaire
# - Limite : ~10 000+ connexions concurrentes
```

:::

## ⚡ Les gains concrets

### 📊 Performance

::: tip Amélioration typique

- **x10 à x50** plus de requêtes simultanées
- **-80% d'utilisation CPU** pour les I/O
- **-90% d'utilisation RAM** (moins de threads)
- **Latence réduite** sous forte charge

:::

### 🎯 Cas d'usage Hyperion

**Avant (synchrone) :**

```
50 utilisateurs qui consultent leurs événements simultanément
→ 50 threads Python actifs
→ Serveur surchargé à 50 utilisateurs
```

**Après (asynchrone) :**

```
500 utilisateurs qui consultent leurs événements simultanément
→ 1-2 threads Python actifs
→ Serveur fluide même à 500 utilisateurs
```

## 🧠 Principe simplifié

L'asynchrone, c'est comme un serveur de restaurant efficace :

::: code-group

```text [Serveur synchrone (inefficace)]
1. Prendre commande table 1
2. Aller en cuisine et ATTENDRE le plat ⏰
3. Revenir avec le plat
4. Prendre commande table 2
5. Aller en cuisine et ATTENDRE le plat ⏰
→ 1 table servie toutes les 10 minutes
```

```text [Serveur asynchrone (efficace)]
1. Prendre commande table 1
2. Donner commande en cuisine (sans attendre)
3. Prendre commande table 2
4. Prendre commande table 3
5. Récupérer plat table 1 (prêt)
6. Continuer...
→ 10 tables servies en 10 minutes
```

:::

## 🎯 Quand utiliser l'asynchrone ?

::: tip Asynchrone recommandé pour

- **Applications web** (FastAPI, Django Async)
- **APIs REST** avec beaucoup de trafic
- **Microservices** qui font des appels externes
- **Applications avec I/O intensives** (DB, fichiers, réseau)

:::

::: warning Asynchrone non nécessaire pour

- **Scripts de batch** simples
- **Applications avec très peu d'utilisateurs** (<10 simultanés)
- **Calculs intensifs** (CPU-bound)

:::

## 🔄 Migration en une phrase

Remplacez `session.query()` par `await db.execute(select())` et ajoutez `async`/`await` partout.

**Résultat :** Votre application Hyperion peut servir 10x plus d'utilisateurs simultanés avec les mêmes ressources serveur.
