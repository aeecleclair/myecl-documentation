---
title: Qu'est-ce que SQLAlchemy ?
order: 1
category:
  - Guide
tag:
  - Débutant
author: Skyrol
---

SQLAlchemy est une bibliothèque SQL pour Python qui facilite l'interaction avec les **bases de données relationnelles**. Elle offre une interface de haut niveau pour effectuer des opérations **CRUD** (Create, Read, Update, Delete) et gérer les relations entre les tables.

## Introduction à SQLAlchemy

SQLAlchemy est l'une des bibliothèques les plus populaires de l'écosystème Python pour interagir avec les bases de données. Si vous avez déjà écrit du SQL à la main, vous comprendrez rapidement l'intérêt de cette bibliothèque : elle permet d'écrire du code Python plus lisible et maintenable tout en gardant la puissance du SQL.

Au lieu d'écrire des requêtes SQL comme ceci :

```sql
SELECT users.id, users.username, todos.title
FROM users
LEFT JOIN todos ON users.id = todos.user_id
WHERE users.username = 'john_doe';
```

Vous pouvez utiliser SQLAlchemy pour écrire :

```python
user_with_todos = session.query(User).options(joinedload(User.todos)).filter(User.username == 'john_doe').first()
```

## Les deux approches de SQLAlchemy

SQLAlchemy propose deux façons de travailler avec les bases de données :

### SQLAlchemy Core

L'approche "Expression Language" qui reste proche du SQL mais avec une syntaxe Python. Elle offre un contrôle fin sur les requêtes générées.

```python
from sqlalchemy import select, text

# Avec Core
result = connection.execute(
    select([users.c.username, users.c.email]).where(users.c.id == 42)
)
```

### SQLAlchemy ORM

L'**Object-Relational Mapping** transforme vos tables en classes Python et vos lignes en objets. C'est cette approche que nous utilisons principalement dans Hyperion.

```python
# Avec ORM
user = session.query(User).filter(User.id == 42).first()
print(user.username, user.email)
```

::: info Choix dans Hyperion
Dans Hyperion, nous privilégions l'ORM car il offre une meilleure lisibilité du code et facilite la maintenance pour une équipe de développeurs. L'approche objet est également plus intuitive pour la plupart des développeurs Python.
:::

## Concepts fondamentaux

### Les Modèles

Les modèles sont des classes Python qui représentent vos tables de base de données. Chaque attribut de classe correspond à une colonne de la table.

```python
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(100), nullable=False)

    # Relation vers les todos
    todos = relationship("TodoItem", back_populates="user")

class TodoItem(Base):
    __tablename__ = 'todos'

    id = Column(Integer, primary_key=True)
    title = Column(String(200), nullable=False)
    done = Column(Boolean, default=False)
    user_id = Column(Integer, ForeignKey('users.id'))

    # Relation vers l'utilisateur
    user = relationship("User", back_populates="todos")
```

### Les Sessions

La session est votre interface principale pour interagir avec la base de données. Elle gère le cycle de vie de vos objets et les transactions.

```python
from sqlalchemy.orm import sessionmaker

# Configuration de la session
SessionLocal = sessionmaker(bind=engine)

# Utilisation
session = SessionLocal()
try:
    # Vos opérations
    user = session.query(User).first()
    session.commit()
finally:
    session.close()
```

### Les Relations

SQLAlchemy permet de définir facilement les relations entre vos modèles, automatisant ainsi les jointures SQL.

```python
# Récupérer un utilisateur avec tous ses todos
user = session.query(User).options(joinedload(User.todos)).filter(User.id == 1).first()

# Accéder aux todos de l'utilisateur (aucune requête supplémentaire grâce à joinedload)
for todo in user.todos:
    print(f"- {todo.title}: {'✓' if todo.done else '○'}")
```

## SQLAlchemy Asynchrone dans Hyperion

Hyperion utilise la version asynchrone de SQLAlchemy pour améliorer les performances et la gestion de la concurrence. Voici les principales différences :

### Session Asynchrone

```python
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy import select

# Au lieu de session.query(), on utilise session.execute()
async def get_user_by_id(db: AsyncSession, user_id: int):
    result = await db.execute(select(User).where(User.id == user_id))
    return result.scalars().first()
```

### Opérations CRUD Asynchrones

```python
async def create_user(db: AsyncSession, username: str, email: str):
    user = User(username=username, email=email)
    db.add(user)
    await db.commit()
    return user

async def update_user_email(db: AsyncSession, user_id: int, new_email: str):
    await db.execute(
        update(User).where(User.id == user_id).values(email=new_email)
    )
    await db.commit()
```

::: warning Points d'attention avec l'async

- N'oubliez jamais le mot-clé `await` devant les opérations de base de données
- Utilisez `select()` au lieu de `session.query()` avec la version async
- Assurez-vous que toutes vos fonctions qui interagissent avec la DB sont `async`
:::

## Avantages de SQLAlchemy

### Productivité

- **Code plus lisible** : Les requêtes complexes deviennent plus faciles à comprendre
- **Autocomplétion** : Votre IDE peut vous aider grâce au typage Python
- **Migrations automatiques** : Avec Alembic, la gestion du schéma devient simple

### Robustesse

- **Protection contre l'injection SQL** : SQLAlchemy échappe automatiquement les données
- **Gestion des transactions** : Rollback automatique en cas d'erreur
- **Validation des types** : Détection précoce des erreurs de type

### Portabilité

- **Multi-base de données** : Le même code fonctionne avec PostgreSQL, MySQL, SQLite...
- **Abstraction** : Vous n'avez pas besoin de connaître les spécificités de chaque SGBD

## Exemple pratique pour Hyperion

Voici un exemple typique d'utilisation dans Hyperion :

```python
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from sqlalchemy.orm import joinedload

async def get_user_todos(db: AsyncSession, user_id: int):
    """Récupère un utilisateur avec tous ses todos"""
    result = await db.execute(
        select(User)
        .options(joinedload(User.todos))
        .where(User.id == user_id)
    )
    return result.scalars().first()

async def mark_todo_completed(db: AsyncSession, todo_id: int, user_id: int):
    """Marque un todo comme terminé"""
    await db.execute(
        update(TodoItem)
        .where(TodoItem.id == todo_id, TodoItem.user_id == user_id)
        .values(done=True)
    )
    await db.commit()

async def create_todo(db: AsyncSession, user_id: int, title: str):
    """Crée un nouveau todo pour un utilisateur"""
    todo = TodoItem(title=title, user_id=user_id, done=False)
    db.add(todo)
    await db.commit()
    return todo
```

## Pour aller plus loin

Maintenant que vous avez une vue d'ensemble de SQLAlchemy, vous pouvez approfondir avec :

1. [Comment utiliser SQLAlchemy](./how-to-use.md) - Guide pratique avec des exemples concrets
2. [Les migrations](./migrations.md) - Gestion de l'évolution du schéma de base de données

SQLAlchemy peut sembler complexe au début, mais une fois que vous maîtrisez les concepts de base, il devient un outil très puissant pour développer des applications robustes et maintenables.
