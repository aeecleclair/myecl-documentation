---
title: Guide des Jointures SQLAlchemy
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
# Jointure explicite avec SQLAlchemy
result = session.query(User).options(
    joinedload(User.todos)
).filter(User.username == 'john_doe').first()
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
user = session.query(User).filter(User.username == 'john_doe').first()
# Cette ligne déclenche une nouvelle requête SQL
todos = user.todos  # N+1 queries problem!
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
from sqlalchemy import Column, Integer, String, ForeignKey, Text
from sqlalchemy.orm import relationship

class User(Base):
    __tablename__ = 'users'
    
    id = Column(Integer, primary_key=True)
    username = Column(String(50), unique=True)
    email = Column(String(100))
    
    # Relation one-to-one
    profile = relationship("Profile", uselist=False, back_populates="user")

class Profile(Base):
    __tablename__ = 'profiles'
    
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'), unique=True)
    bio = Column(Text)
    avatar_url = Column(String(255))
    
    user = relationship("User", back_populates="profile")
```

### Stratégies de chargement

::: tabs

@tab Chargement eager (recommandé)

```python [Chargement eager (recommandé)]
# Avec joinedload - une seule requête
user_with_profile = session.query(User).options(
    joinedload(User.profile)
).filter(User.username == 'john').first()

# Accès au profil sans requête supplémentaire
bio = user_with_profile.profile.bio if user_with_profile.profile else None
```

@tab Chargement lazy (par défaut)

```python [Chargement lazy (par défaut)]
# Première requête
user = session.query(User).filter(User.username == 'john').first()

# Deuxième requête déclenchée ici
profile = user.profile  # Peut être None
```

:::

::: tip Bonne pratique
Pour les relations one-to-one, utilisez toujours `joinedload()` car le coût de la jointure est minimal et évite le problème N+1.
:::

## 📚 Relations One-to-Many

Les relations one-to-many sont les plus courantes. Un parent peut avoir plusieurs enfants.

::: info Exemple concret
Un `User` peut avoir plusieurs `Todo` tasks.
:::

### Définition des modèles

```python [models.py]
class User(Base):
    __tablename__ = 'users'
    
    id = Column(Integer, primary_key=True)
    username = Column(String(50))
    
    # Relation one-to-many
    todos = relationship("Todo", back_populates="user")

class Todo(Base):
    __tablename__ = 'todos'
    
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    title = Column(String(200))
    completed = Column(Boolean, default=False)
    
    user = relationship("User", back_populates="todos")
```

### Stratégies selon le cas d'usage

::: tabs

@tab Petit nombre d'enfants (selectinload)

```python [Petit nombre d'enfants - selectinload]
# Recommandé pour < 100 enfants par parent
users_with_todos = session.query(User).options(
    selectinload(User.todos)
).all()

# Génère 2 requêtes optimisées :
# 1. SELECT users.*
# 2. SELECT todos.* WHERE user_id IN (1, 2, 3, ...)
```

@tab Grand nombre d'enfants (lazy + pagination)

```python [Grand nombre d'enfants - lazy + pagination]
# Pour de nombreux todos, chargez à la demande avec pagination
user = session.query(User).filter(User.id == 1).first()

# Paginer les todos
page_size = 20
todos_page = session.query(Todo).filter(
    Todo.user_id == user.id
).limit(page_size).offset(0).all()
```

```python [Jointure avec filtres - joinedload]
# Quand vous filtrez sur les enfants
users_with_active_todos = session.query(User).options(
    joinedload(User.todos)
).join(User.todos).filter(
    Todo.completed == False
).all()
```

:::

::: warning Attention au N+1
```python
# ❌ Problème N+1 - évitez ceci !
users = session.query(User).all()  # 1 requête
for user in users:
    print(len(user.todos))  # N requêtes supplémentaires !

# ✅ Solution avec selectinload
users = session.query(User).options(selectinload(User.todos)).all()
for user in users:
    print(len(user.todos))  # Pas de requête supplémentaire
```
:::

## 🔀 Relations Many-to-Many

Les relations many-to-many nécessitent une table d'association et demandent une attention particulière.

::: info Exemple concret
Un `User` peut appartenir à plusieurs `Group`, et un `Group` peut contenir plusieurs `User`.
:::

### Définition des modèles

```python [models.py]
# Table d'association
user_groups = Table('user_groups', Base.metadata,
    Column('user_id', Integer, ForeignKey('users.id')),
    Column('group_id', Integer, ForeignKey('groups.id'))
)

class User(Base):
    __tablename__ = 'users'
    
    id = Column(Integer, primary_key=True)
    username = Column(String(50))
    
    # Relation many-to-many
    groups = relationship("Group", secondary=user_groups, back_populates="users")

class Group(Base):
    __tablename__ = 'groups'
    
    id = Column(Integer, primary_key=True)
    name = Column(String(100))
    
    users = relationship("User", secondary=user_groups, back_populates="groups")
```

### Stratégies de chargement optimisées

::: tabs

@tab Chargement standard (selectinload)

```python [Chargement standard - selectinload]
# Pour un nombre modéré de relations
users_with_groups = session.query(User).options(
    selectinload(User.groups)
).all()
```

@tab Chargement dynamique (lazy) - large dataset

```python [Chargement dynamique - large dataset]
class User(Base):
    # ... autres champs
    groups = relationship("Group", 
                         secondary=user_groups, 
                         lazy='dynamic',  # Retourne une Query
                         back_populates="users")

# Usage avec pagination
user = session.query(User).first()
active_groups = user.groups.filter(Group.active == True).all()
group_count = user.groups.count()
```

@tab Association Object Pattern - métadonnées

```python [Association Object Pattern - métadonnées]
# Pour stocker des métadonnées sur la relation
class UserGroup(Base):
    __tablename__ = 'user_groups'
    
    user_id = Column(Integer, ForeignKey('users.id'), primary_key=True)
    group_id = Column(Integer, ForeignKey('groups.id'), primary_key=True)
    joined_date = Column(DateTime, default=datetime.utcnow)
    role = Column(String(50), default='member')
    
    user = relationship("User", back_populates="group_memberships")
    group = relationship("Group", back_populates="user_memberships")

class User(Base):
    group_memberships = relationship("UserGroup", back_populates="user")
    
    @property
    def groups(self):
        return [membership.group for membership in self.group_memberships]
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
# Chargement optimisé sur plusieurs niveaux
users = session.query(User).options(
    selectinload(User.todos).selectinload(Todo.tags),
    joinedload(User.profile)
).all()
```

@tab Chargement conditionnel

```python [Chargement conditionnel]
from sqlalchemy.orm import load_only

# Charger seulement certains champs
users = session.query(User).options(
    load_only(User.username, User.email),
    selectinload(User.todos).load_only(Todo.title, Todo.completed)
).all()
```

:::

### Debugging et monitoring

::: details Debugging

::: tabs

@tab Logger SQL

```python [Logger SQL]
import logging

# Activer les logs SQL pour débugger
logging.basicConfig()
logging.getLogger('sqlalchemy.engine').setLevel(logging.INFO)
```

@tab Compteur de requêtes

```python [Compteur de requêtes]
from sqlalchemy import event

query_count = 0

@event.listens_for(Engine, "before_cursor_execute")
def receive_before_cursor_execute(conn, cursor, statement, parameters, context, executemany):
    global query_count
    query_count += 1
    print(f"Query #{query_count}: {statement}")
```

:::

:::

### Patterns d'optimisation

::: details Pattern Repository avec chargement optimisé
```python
class UserRepository:
    def __init__(self, session):
        self.session = session
    
    def get_user_with_todos(self, user_id: int) -> User:
        return self.session.query(User).options(
            selectinload(User.todos)
        ).filter(User.id == user_id).first()
    
    def get_users_summary(self) -> List[User]:
        return self.session.query(User).options(
            load_only(User.id, User.username),
            joinedload(User.profile).load_only(Profile.avatar_url)
        ).all()
```
:::

::: danger Anti-patterns à éviter
```python
# ❌ Chargement en boucle
for user_id in user_ids:
    user = session.query(User).filter(User.id == user_id).first()
    process_user(user)

# ✅ Chargement en lot
users = session.query(User).filter(User.id.in_(user_ids)).all()
for user in users:
    process_user(user)
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
