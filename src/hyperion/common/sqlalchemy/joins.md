---
title: Jointures
description: Guide complet pour maîtriser les jointures SQLAlchemy dans Hyperion
order: 1
category:
  - Guide
  - SQLAlchemy
tag:
  - jointures
  - performance
  - base de données
---

# Guide des Jointures SQLAlchemy


::: danger Disclaimer

Les noms, propriétés des modèles ne sont pas ceux d'Hyperion mais sont ici présents pour faciliter la compréhension. C'est donc à vous d'adapter votre code en fonction de vos propres modèles.

:::

## Introduction

Les jointures sont un concept fondamental lors du développement de modules pour Hyperion. Elles permettent de récupérer des données liées depuis plusieurs tables en optimisant les performances et en réduisant le nombre de requêtes SQL.

Ce guide vous accompagnera dans la maîtrise des jointures SQLAlchemy, depuis les concepts de base jusqu'aux techniques avancées d'optimisation.

::: tip Objectifs du guide
- Comprendre les différents types de jointures
- Apprendre à optimiser les performances
- Maîtriser la syntaxe SQLAlchemy
- Éviter les pièges courants
:::

## Comprendre les jointures : explicites vs implicites

::: warning Attention aux performances
Les jointures peuvent rapidement devenir complexes et impacter les performances. Il est crucial de comprendre quand et comment les utiliser efficacement.
:::

SQLAlchemy offre deux approches pour gérer les relations entre entités :

### 🔍 Jointures explicites
### 🔄 Jointures implicites (Lazy Loading)

### 🔍 Jointures explicites

Les jointures explicites effectuent une seule requête SQL optimisée. C'est l'équivalent direct des jointures SQL classiques.

::: tabs

@tab SQL Natif

```sql [SQL Natif]
SELECT users.*, todos.*
FROM users
LEFT JOIN todos ON users.id = todos.user_id
WHERE users.username = 'john_doe';
```

@tab SQLAlchemy

```python [SQLAlchemy]
# Jointure explicite avec SQLAlchemy moderne
async def get_user_with_todos(
    db: AsyncSession,
    username: str,
) -> CoreUser | None:
    result = await db.execute(
        select(CoreUser)
        .where(CoreUser.username == username)
        .options(selectinload(CoreUser.todos))
    )
    return result.scalars().first()
```

:::

**Avantages :**
- ✅ Une seule requête SQL
- ✅ Performances optimales
- ✅ Contrôle total sur la requête

### 🔄 Jointures implicites (Lazy Loading)

SQLAlchemy peut charger les données liées à la demande, générant plusieurs requêtes SQL automatiquement.

::: tabs

@tab SQL

```sql [Première requête]
SELECT users.*
FROM users
WHERE users.username = 'john_doe';
```

@tab SQL [Requêtes suivantes (à la demande)]

```sql [Requêtes suivantes (à la demande)]
SELECT todos.*
FROM todos
WHERE todos.user_id = ?;
```

@tab SQLAlchemy

```python [SQLAlchemy]
# Chargement lazy (par défaut)
async def get_user(db: AsyncSession, username: str) -> CoreUser | None:
    result = await db.execute(
        select(CoreUser).where(CoreUser.username == username)
    )
    user = result.scalars().first()
    
    # Cette ligne déclenche une nouvelle requête SQL
    if user:
        todos = user.todos  # N+1 queries problem!
    return user
```

:::

**Avantages :**
- ✅ Simplicité d'utilisation
- ✅ Charge uniquement les données nécessaires

**Inconvénients :**
- ❌ Problème N+1 queries
- ❌ Performances imprévisibles

## 🎯 Matrice de décision

Le choix entre jointures explicites et implicites dépend de deux critères principaux :

::: tip Critères de décision
1. **Type de relation** : One-to-one, One-to-many, Many-to-many
2. **Probabilité d'accès** : Accès certain vs probable aux données liées
:::

| Type de relation | Accès certain | Accès probable | Recommandation |
|-----------------|---------------|----------------|-----------------|
| **One-to-one** | `joinedload()` | `selectinload()` | Toujours charger |
| **One-to-many** | `selectinload()` | `lazy='select'` | Évaluer le cas |
| **Many-to-many** | `selectinload()` | `lazy='dynamic'` | Pagination recommandée |

::: details Explication des stratégies de chargement
- **`joinedload()`** : Jointure SQL (LEFT JOIN)
- **`selectinload()`** : Requête séparée avec IN
- **`lazy='select'`** : Chargement à la demande (par défaut)
- **`lazy='dynamic'`** : Retourne une Query au lieu d'une liste
:::

## 🔗 Relations One-to-One

Les relations one-to-one sont idéales pour étendre un modèle principal avec des données optionnelles.

::: info Exemple concret
Un `User` peut avoir un seul `Profile` détaillé avec photo, bio, etc.
:::

### Définition des modèles

```python [models.py]
from sqlalchemy import ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

class CoreUser(Base):
    __tablename__ = "core_user"
    
    id: Mapped[str] = mapped_column(primary_key=True, index=True)
    username: Mapped[str] = mapped_column(index=True, unique=True)
    email: Mapped[str] = mapped_column(index=True, unique=True)
    
    # Relation one-to-one
    profile: Mapped["CoreUserProfile"] = relationship(
        "CoreUserProfile", 
        uselist=False, 
        back_populates="user"
    )

class CoreUserProfile(Base):
    __tablename__ = "core_user_profile"
    
    id: Mapped[str] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[str] = mapped_column(
        ForeignKey("core_user.id"), 
        unique=True, 
        index=True
    )
    bio: Mapped[str | None] = mapped_column(Text)
    avatar_url: Mapped[str | None]
    
    user: Mapped["CoreUser"] = relationship(
        "CoreUser", 
        back_populates="profile"
    )
```

### Stratégies de chargement

::: tabs

@tab Chargement eager (recommandé)

```python [Chargement eager (recommandé)]
async def get_user_with_profile(
    db: AsyncSession,
    username: str,
) -> CoreUser | None:
    """Récupère un utilisateur avec son profil en une seule requête"""
    result = await db.execute(
        select(CoreUser)
        .where(CoreUser.username == username)
        .options(joinedload(CoreUser.profile))
    )
    user = result.scalars().first()
    
    # Accès au profil sans requête supplémentaire
    if user and user.profile:
        bio = user.profile.bio
    
    return user
```

@tab Chargement lazy (par défaut)

```python [Chargement lazy (par défaut)]
async def get_user_lazy(
    db: AsyncSession,
    username: str,
) -> CoreUser | None:
    """Chargement lazy du profil (déclenche une requête supplémentaire)"""
    result = await db.execute(
        select(CoreUser).where(CoreUser.username == username)
    )
    user = result.scalars().first()
    
    # Cette ligne déclenche une deuxième requête SQL
    if user:
        profile = user.profile  # Peut être None
    
    return user
```

:::

::: tip Bonne pratique
Pour les relations one-to-one, utilisez toujours `joinedload()` car le coût de la jointure est minimal et évite le problème N+1.
:::

## 📚 Relations One-to-Many

Les relations one-to-many sont les plus courantes. Un parent peut avoir plusieurs enfants.

::: info Exemple concret
Un `CoreUser` peut avoir plusieurs `CoreAssociation` (adhésions à des associations).
:::

### Définition des modèles

```python [models.py]
from sqlalchemy import Boolean, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

class CoreUser(Base):
    __tablename__ = "core_user"
    
    id: Mapped[str] = mapped_column(primary_key=True, index=True)
    username: Mapped[str] = mapped_column(index=True, unique=True)
    
    # Relation one-to-many
    associations: Mapped[list["CoreAssociation"]] = relationship(
        "CoreAssociation",
        back_populates="user",
        default_factory=list,
    )

class CoreAssociation(Base):
    __tablename__ = "core_association"
    
    id: Mapped[str] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[str] = mapped_column(ForeignKey("core_user.id"), index=True)
    name: Mapped[str] = mapped_column(index=True)
    is_active: Mapped[bool] = mapped_column(default=True)
    
    user: Mapped["CoreUser"] = relationship(
        "CoreUser",
        back_populates="associations"
    )
```

### Stratégies selon le cas d'usage

::: tabs

@tab Petit nombre d'enfants (selectinload)

```python [Petit nombre d'enfants - selectinload]
async def get_users_with_associations(
    db: AsyncSession,
) -> list[CoreUser]:
    """Recommandé pour < 100 associations par utilisateur"""
    result = await db.execute(
        select(CoreUser).options(selectinload(CoreUser.associations))
    )
    
    # Génère 2 requêtes optimisées :
    # 1. SELECT core_user.*
    # 2. SELECT core_association.* WHERE user_id IN (?, ?, ?, ...)
    
    return result.scalars().all()
```

@tab Grand nombre d'enfants (lazy + pagination)

```python [Grand nombre d'enfants - lazy + pagination]
async def get_user_associations_paginated(
    db: AsyncSession,
    user_id: str,
    page: int = 0,
    page_size: int = 20,
) -> list[CoreAssociation]:
    """Pour de nombreuses associations, chargez à la demande avec pagination"""
    result = await db.execute(
        select(CoreAssociation)
        .where(CoreAssociation.user_id == user_id)
        .limit(page_size)
        .offset(page * page_size)
    )
    return result.scalars().all()
```

@tab Jointure avec filtres

```python [Jointure avec filtres]
async def get_users_with_active_associations(
    db: AsyncSession,
) -> list[CoreUser]:
    """Quand vous filtrez sur les enfants"""
    result = await db.execute(
        select(CoreUser)
        .options(selectinload(CoreUser.associations))
        .join(CoreUser.associations)
        .where(CoreAssociation.is_active == True)
    )
    return result.scalars().all()
```

:::

::: warning Attention au N+1
```python
# ❌ Problème N+1 - évitez ceci !
async def bad_example(db: AsyncSession) -> None:
    result = await db.execute(select(CoreUser))
    users = result.scalars().all()  # 1 requête
    
    for user in users:
        print(len(user.associations))  # N requêtes supplémentaires !

# ✅ Solution avec selectinload
async def good_example(db: AsyncSession) -> None:
    result = await db.execute(
        select(CoreUser).options(selectinload(CoreUser.associations))
    )
    users = result.scalars().all()
    
    for user in users:
        print(len(user.associations))  # Pas de requête supplémentaire
```
:::

## 🔀 Relations Many-to-Many

Les relations many-to-many nécessitent une table d'association et demandent une attention particulière.

::: info Exemple concret
Un `CoreUser` peut appartenir à plusieurs `CoreGroup`, et un `CoreGroup` peut contenir plusieurs `CoreUser`.
:::

### Définition des modèles

```python [models.py]
from sqlalchemy import Table, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

# Table d'association
core_membership = Table(
    "core_membership", 
    Base.metadata,
    mapped_column("user_id", ForeignKey("core_user.id"), primary_key=True),
    mapped_column("group_id", ForeignKey("core_group.id"), primary_key=True),
)

class CoreUser(Base):
    __tablename__ = "core_user"
    
    id: Mapped[str] = mapped_column(primary_key=True, index=True)
    username: Mapped[str] = mapped_column(index=True, unique=True)
    
    # Relation many-to-many
    groups: Mapped[list["CoreGroup"]] = relationship(
        "CoreGroup",
        secondary="core_membership",
        back_populates="members",
        default_factory=list,
    )

class CoreGroup(Base):
    __tablename__ = "core_group"
    
    id: Mapped[str] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(index=True, unique=True)
    description: Mapped[str | None]
    
    members: Mapped[list["CoreUser"]] = relationship(
        "CoreUser",
        secondary="core_membership",
        back_populates="groups",
        default_factory=list,
    )
```

### Stratégies de chargement optimisées

::: tabs

@tab Chargement standard (selectinload)

```python [Chargement standard - selectinload]
async def get_users_with_groups(
    db: AsyncSession,
) -> list[CoreUser]:
    """Pour un nombre modéré de relations"""
    result = await db.execute(
        select(CoreUser).options(selectinload(CoreUser.groups))
    )
    return result.scalars().all()
```

@tab Chargement avec filtres

```python [Chargement avec filtres]
async def get_active_groups_for_user(
    db: AsyncSession,
    user_id: str,
) -> list[CoreGroup]:
    """Filtrer les groupes directement dans la requête"""
    result = await db.execute(
        select(CoreGroup)
        .join(core_membership)
        .join(CoreUser)
        .where(CoreUser.id == user_id)
        .where(CoreGroup.is_active == True)
    )
    return result.scalars().all()
```

@tab Association Object Pattern - métadonnées

```python [Association Object Pattern - métadonnées]
from datetime import datetime

# Pour stocker des métadonnées sur la relation
class CoreMembership(Base):
    __tablename__ = "core_membership"
    
    user_id: Mapped[str] = mapped_column(
        ForeignKey("core_user.id"), 
        primary_key=True
    )
    group_id: Mapped[str] = mapped_column(
        ForeignKey("core_group.id"), 
        primary_key=True
    )
    joined_date: Mapped[datetime] = mapped_column(default_factory=datetime.utcnow)
    role: Mapped[str] = mapped_column(default="member")
    
    user: Mapped["CoreUser"] = relationship(
        "CoreUser", 
        back_populates="group_memberships"
    )
    group: Mapped["CoreGroup"] = relationship(
        "CoreGroup", 
        back_populates="user_memberships"
    )

class CoreUser(Base):
    group_memberships: Mapped[list["CoreMembership"]] = relationship(
        "CoreMembership", 
        back_populates="user",
        default_factory=list,
    )
    
    @property
    def groups(self) -> list[CoreGroup]:
        return [membership.group for membership in self.group_memberships]

# Usage
async def get_user_with_membership_details(
    db: AsyncSession,
    user_id: str,
) -> CoreUser | None:
    result = await db.execute(
        select(CoreUser)
        .where(CoreUser.id == user_id)
        .options(
            selectinload(CoreUser.group_memberships)
            .selectinload(CoreMembership.group)
        )
    )
    return result.scalars().first()
```

:::

::: tip Optimisation many-to-many
- Utilisez `lazy='dynamic'` pour de grandes collections
- Considérez l'Association Object Pattern pour les métadonnées
- Toujours paginer les résultats en production
:::

## 🚀 Techniques avancées et bonnes pratiques

### Combinaison de stratégies

::: tabs

@tab Chargement multi-niveaux

```python [Chargement multi-niveaux]
async def get_users_with_full_context(
    db: AsyncSession,
) -> list[CoreUser]:
    """Chargement optimisé sur plusieurs niveaux"""
    result = await db.execute(
        select(CoreUser).options(
            selectinload(CoreUser.associations).selectinload(CoreAssociation.events),
            joinedload(CoreUser.profile)
        )
    )
    return result.scalars().all()
```

@tab Chargement conditionnel

```python [Chargement conditionnel]
from sqlalchemy.orm import load_only

async def get_users_summary(
    db: AsyncSession,
) -> list[CoreUser]:
    """Charger seulement certains champs"""
    result = await db.execute(
        select(CoreUser).options(
            load_only(CoreUser.username, CoreUser.email),
            selectinload(CoreUser.groups).load_only(CoreGroup.name)
        )
    )
    return result.scalars().all()
```

:::

### Debugging et monitoring

::: details Debugging et profiling

::: tabs

@tab Logger SQL

```python [Logger SQL]
import logging

# Activer les logs SQL pour débugger (à configurer dans settings)
logging.basicConfig()
logging.getLogger('sqlalchemy.engine').setLevel(logging.INFO)

# En développement, vous pouvez aussi utiliser :
# SQLALCHEMY_ECHO=True dans votre configuration
```

@tab Middleware de monitoring

```python [Middleware de monitoring]
from fastapi import Request
from sqlalchemy import event
import time

class SQLMonitoringMiddleware:
    def __init__(self):
        self.query_count = 0
        self.total_time = 0
    
    def setup_monitoring(self, engine):
        @event.listens_for(engine, "before_cursor_execute")
        def before_cursor_execute(conn, cursor, statement, parameters, context, executemany):
            context._query_start_time = time.time()
            self.query_count += 1
            
        @event.listens_for(engine, "after_cursor_execute")
        def after_cursor_execute(conn, cursor, statement, parameters, context, executemany):
            total = time.time() - context._query_start_time
            self.total_time += total
            print(f"Query #{self.query_count}: {total:.3f}s")

# Usage
monitoring = SQLMonitoringMiddleware()
monitoring.setup_monitoring(engine)
```

:::

:::

### Patterns d'optimisation

::: details Repository Pattern avec chargement optimisé

```python
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload, joinedload, load_only

class CoreUserRepository:
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def get_by_id(self, user_id: str) -> CoreUser | None:
        """Récupération basique d'un utilisateur"""
        result = await self.db.execute(
            select(CoreUser).where(CoreUser.id == user_id)
        )
        return result.scalars().first()
    
    async def get_with_groups(self, user_id: str) -> CoreUser | None:
        """Utilisateur avec ses groupes"""
        result = await self.db.execute(
            select(CoreUser)
            .where(CoreUser.id == user_id)
            .options(selectinload(CoreUser.groups))
        )
        return result.scalars().first()
    
    async def get_with_full_profile(self, user_id: str) -> CoreUser | None:
        """Utilisateur avec profil complet (one-to-one)"""
        result = await self.db.execute(
            select(CoreUser)
            .where(CoreUser.id == user_id)
            .options(joinedload(CoreUser.profile))
        )
        return result.scalars().first()
    
    async def list_summary(
        self, 
        limit: int = 50, 
        offset: int = 0
    ) -> list[CoreUser]:
        """Liste optimisée pour l'affichage"""
        result = await self.db.execute(
            select(CoreUser)
            .options(
                load_only(CoreUser.id, CoreUser.username, CoreUser.email),
                joinedload(CoreUser.profile).load_only(CoreUserProfile.avatar_url)
            )
            .limit(limit)
            .offset(offset)
        )
        return result.scalars().all()
    
    async def search_with_associations(
        self, 
        search_term: str
    ) -> list[CoreUser]:
        """Recherche avec associations pré-chargées"""
        result = await self.db.execute(
            select(CoreUser)
            .where(CoreUser.username.ilike(f"%{search_term}%"))
            .options(
                selectinload(CoreUser.associations),
                selectinload(CoreUser.groups)
            )
        )
        return result.scalars().all()
```

:::

::: danger Anti-patterns à éviter

```python
# ❌ Chargement en boucle
async def bad_pattern(db: AsyncSession, user_ids: list[str]) -> None:
    for user_id in user_ids:
        result = await db.execute(
            select(CoreUser).where(CoreUser.id == user_id)
        )
        user = result.scalars().first()
        await process_user(user)

# ✅ Chargement en lot
async def good_pattern(db: AsyncSession, user_ids: list[str]) -> None:
    result = await db.execute(
        select(CoreUser).where(CoreUser.id.in_(user_ids))
    )
    users = result.scalars().all()
    for user in users:
        await process_user(user)

# ❌ Accès aux relations sans préchargement
async def bad_lazy_access(db: AsyncSession) -> None:
    result = await db.execute(select(CoreUser))
    users = result.scalars().all()
    
    for user in users:
        print(f"User {user.username} has {len(user.groups)} groups")  # N+1 !

# ✅ Préchargement approprié
async def good_eager_loading(db: AsyncSession) -> None:
    result = await db.execute(
        select(CoreUser).options(selectinload(CoreUser.groups))
    )
    users = result.scalars().all()
    
    for user in users:
        print(f"User {user.username} has {len(user.groups)} groups")  # OK !
```

:::

## 📋 Checklist des bonnes pratiques

::: tip Checklist performance
- [ ] **Identifiez vos patterns d'accès** avant de choisir la stratégie
- [ ] **Utilisez `selectinload()`** pour les relations one-to-many modérées
- [ ] **Utilisez `joinedload()`** pour les relations one-to-one
- [ ] **Paginez** les relations many-to-many volumineuses
- [ ] **Activez les logs SQL** en développement pour débugger
- [ ] **Mesurez les performances** avec des outils de profiling
- [ ] **Évitez les boucles** avec chargement lazy
- [ ] **Utilisez `load_only()`** pour limiter les colonnes chargées
:::

::: warning Points d'attention
- Les jointures peuvent exploser la taille des résultats
- Le lazy loading peut créer des problèmes N+1
- Les relations many-to-many nécessitent une pagination
- Testez toujours avec des données réalistes
:::
