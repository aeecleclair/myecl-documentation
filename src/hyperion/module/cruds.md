---
title: CRUDs
order: 4
category:
  - Guide
---

Donc mtn les cruds, c le 4e pilier d'un module, ça prend en entrée des schemas (cf "lingua franca")
et ça fait des requêtes SQL à la db (via l'ORM de SQLAlchemy qui parle les models et pas les
schemas).

Ça permet de cacher aux endpoints (donc à la logique) l'accès à la db en le masquant dans ces
fonctions.

A nouveau le SQL franchement c pas compliqué y a tjs 4 verbes (d'ailleurs faudrait mettre une page
de grands principes où on explique que les 4 verbes HTTP (post, get, patch, delete), l'acronyme
derrière CRUD (create read update delete) et les 4 verbes sql (insert select update delete) c la mm
structure), ce verbe s'applique à une table, puis on peut faire des .where() dessus où on met des
conditions pour filtrer, on peut faire des jointures avec d'autres tables qd elles se partagent une
colonne, et du selectinload pour faire une requête sur le résultat d'une requête.

Comme le SQL c N! fois + rapide faut éviter de faire les opérations en Python.

Et à la fin oui faut convertir en Python donc .scalars() puis en général soit .all() pr tout avoir
(ça fait une liste) soit .first_or_none() (ça renvoie 1 élément ou rien).

Penser à rappeler que le crud en a aucune idée qu'il est derrière une API HTTP (le crud pourrait
très bien être appelé par un script, un logiciel, ...) donc hors de question de raise une
HTTPException ds les cruds ou quoi que ce soit qui suppose un contexte HTTP.

Par contre on peut faire des try-except sur les cruds, si on peut s'attendre à une erreur
d'intégrité (et expliquer ce que ça peut être, typiquement c lié à des truc unique en double ou des
mapped qui ne se correspondent plus).

En vrai je crois que là on tient bien l'essentiel des cruds.

Bordel Skyrol là-dessus

SQLAlchemy est une bibliothèque SQL pour Python qui facilite l'interaction avec les **bases de
données relationnelles**. Elle offre une interface de haut niveau pour effectuer des opérations
**CRUD** (Create, Read, Update, Delete) et gérer les relations entre les tables.

## Introduction à SQLAlchemy

SQLAlchemy est l'une des bibliothèques les plus populaires de l'écosystème Python pour interagir
avec les bases de données. Si vous avez déjà écrit du SQL à la main, vous comprendrez rapidement
l'intérêt de cette bibliothèque : elle permet d'écrire du code Python plus lisible et maintenable
tout en gardant la puissance du SQL.

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

L'approche "Expression Language" qui reste proche du SQL mais avec une syntaxe Python. Elle offre un
contrôle fin sur les requêtes générées.

```python
from sqlalchemy import select, text

# Avec Core
result = connection.execute(
    select([users.c.username, users.c.email]).where(users.c.id == 42)
)
```

### SQLAlchemy ORM

L'**Object-Relational Mapping** transforme vos tables en classes Python et vos lignes en objets.
C'est cette approche que nous utilisons principalement dans Hyperion.

```python
# Avec ORM
user = session.query(User).filter(User.id == 42).first()
print(user.username, user.email)
```

::: info Choix dans Hyperion

Dans Hyperion, nous privilégions l'ORM car il offre une meilleure lisibilité du code et facilite la
maintenance pour une équipe de développeurs. L'approche objet est également plus intuitive pour la
plupart des développeurs Python.

:::

## Concepts fondamentaux

### Les Modèles

Les modèles sont des classes Python qui représentent vos tables de base de données. Chaque attribut
de classe correspond à une colonne de la table.

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

La session est votre interface principale pour interagir avec la base de données. Elle gère le cycle
de vie de vos objets et les transactions.

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

SQLAlchemy permet de définir facilement les relations entre vos modèles, automatisant ainsi les
jointures SQL.

```python
# Récupérer un utilisateur avec tous ses todos
user = session.query(User).options(joinedload(User.todos)).filter(User.id == 1).first()

# Accéder aux todos de l'utilisateur (aucune requête supplémentaire grâce à joinedload)
for todo in user.todos:
    print(f"- {todo.title}: {'✓' if todo.done else '○'}")
```

## SQLAlchemy Asynchrone dans Hyperion

Hyperion utilise la version asynchrone de SQLAlchemy pour améliorer les performances et la gestion
de la concurrence. Voici les principales différences :

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

SQLAlchemy peut sembler complexe au début, mais une fois que vous maîtrisez les concepts de base, il
devient un outil très puissant pour développer des applications robustes et maintenables.

---

page 2...

Désormais nous allons voir comment utiliser SQLAlchemy dans un projet Python. Nous allons couvrir
les bases de la configuration, de la définition des modèles, et de l'exécution des opérations CRUD
(Create, Read, Update, Delete).

Dans ce guide, nous utiliserons un exemple simple d'une application de gestion de tâches (To-Do
List) pour illustrer les concepts. On peut imaginer que nous avons deux modèles principaux : `User`
et `TodosItem`. Un utilisateur peut avoir plusieurs tâches (relation un-à-plusieurs). On peut créer,
lire, mettre à jour et supprimer des tâches associées à un utilisateur.

## Imports nécessaires

Avant de commencer, voici les imports typiques dont vous aurez besoin pour travailler avec
SQLAlchemy dans Hyperion :

::: tip

De manière plus générale, votre éditeur de code (comme VSCode ou PyCharm) peut vous aider à gérer
les imports automatiquement.

:::

```python
from typing import Sequence

from sqlalchemy import select, update, delete
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import models_todos  # Remplacez par votre modèle
```

## Opérations simples (CRUD)

### Lecture des données (Read)

La lecture de données se fait principalement avec la fonction `select()`. Voici comment récupérer
des enregistrements :

```python
async def get_items_by_user_id(
    db: AsyncSession,
    user_id: str,
) -> Sequence[models_todos.TodosItem]:
    """Récupère tous les éléments TodosItem d'un utilisateur spécifique"""
    # On récupère tous les éléments TodosItem
    # dont le user_id correspond à celui que l'on recherche
    result = await db.execute(
        select(models_todos.TodosItem).where(
            models_todos.TodosItem.user_id == user_id,
        )
    )
    return result.scalars().all()
```

::: tip Méthodes de récupération

- `db.execute()` : Exécute la requête SQL
- `.all()` : Retourne tous les résultats sous forme de liste
- `.first()` : Retourne le premier résultat ou `None`
- `.one()` : Retourne exactement un résultat (lève une exception sinon)
- `.one_or_none()` : Retourne un résultat ou `None`
- `.scalars()` : Extrait les objets des résultats (utile pour éviter les tuples)

:::

### Création de données (Create)

Pour créer de nouveaux enregistrements, utilisez `db.add()` :

```python
async def create_item(
    db: AsyncSession,
    item: models_todos.TodosItem,
) -> models_todos.TodosItem:
    """Crée un nouvel élément TodosItem"""
    # Avec `db.add(item)` l'élément est placé tout seul dans la bonne table de la bdd.
    # item est en effet une instance du model : models_todos.TodosItem
    db.add(item)
    try:
        await db.commit()
        return item
    except IntegrityError as error:
        # En cas d'erreur d'ajout de l'objet, on revient en arrière (rollback de la db)
        # pour annuler les modifications de la db et on lève une erreur.
        await db.rollback()
        raise ValueError(error)
```

### Mise à jour de données (Update)

Pour mettre à jour des enregistrements existants, utilisez `update()` :

```python
async def edit_done_status(
    db: AsyncSession,
    id: str,
    done: bool,
) -> None:
    """Met à jour le statut 'done' d'un élément TodosItem"""
    # On met à jour le champ `done` de l'élément TodosItem
    await db.execute(
        update(models_todos.TodosItem)
        .where(models_todos.TodosItem.id == id)
        .values(done=done)
    )
    await db.commit()
```

### Suppression de données (Delete)

Pour supprimer des enregistrements :

```python
async def delete_item(
    db: AsyncSession,
    id: str,
) -> None:
    """Supprime un élément TodosItem"""
    await db.execute(
        delete(models_todos.TodosItem)
        .where(models_todos.TodosItem.id == id)
    )
    await db.commit()
```

## Points de vigilance

### Gestion des transactions

::: warning Gestion des erreurs

Toujours encapsuler les opérations de modification dans des blocs try/catch pour gérer les erreurs
d'intégrité et effectuer un rollback si nécessaire.

:::

```python
async def safe_database_operation(db: AsyncSession, data):
    try:
        # Vos opérations de base de données
        db.add(data)
        await db.commit()
    except IntegrityError:
        await db.rollback()
        raise
    except Exception:
        await db.rollback()
        raise
```

### Performance et mémoire

::: tip Optimisation

- Utilisez `.scalars()` pour obtenir directement les objets plutôt que les tuples
- Préférez `.first()` à `.all()[0]` pour récupérer un seul élément
- Fermez toujours vos sessions avec un context manager ou explicitement

:::

### Validation des données

```python
async def create_validated_item(
    db: AsyncSession,
    item_data: dict,
) -> models_todos.TodosItem:
    """Crée un élément avec validation"""
    # Validation des données avant création
    if not item_data.get('title'):
        raise ValueError("Le titre est requis")

    item = models_todos.TodosItem(**item_data)
    db.add(item)

    try:
        await db.commit()
        return item
    except IntegrityError as error:
        await db.rollback()
        raise ValueError(f"Erreur d'intégrité : {error}")
```

## Jointures et requêtes avancées

::: warning Complexité avancée

Les jointures peuvent rapidement devenir complexes et impacter les performances. Utilisez-les avec
parcimonie et testez toujours les performances sur des données réelles.

:::

### Jointures simples

```python
from sqlalchemy.orm import joinedload

async def get_items_with_user(
    db: AsyncSession,
    item_id: str,
) -> models_todos.TodosItem:
    """Récupère un élément avec les informations de l'utilisateur"""
    result = await db.execute(
        select(models_todos.TodosItem)
        .options(joinedload(models_todos.TodosItem.user)) # [!code highlight]
        .where(models_todos.TodosItem.id == item_id)
    )
    return result.scalars().first()
```

### Comprendre `joinedload()` - Le chargement eager

::: info Qu'est-ce que `joinedload()` ?

`joinedload()` est une stratégie de chargement **eager** (avide) qui permet de récupérer les objets
liés en une seule requête SQL au lieu de faire des requêtes séparées.

:::

#### Problème du N+1

Sans `joinedload()`, vous pourriez rencontrer le problème du **N+1** :

```python
# ❌ PROBLEMATIQUE - Problème N+1
async def get_all_items_with_users_bad(db: AsyncSession):
    """Version problématique qui génère plusieurs requêtes"""
    result = await db.execute(select(models_todos.TodosItem))
    items = result.scalars().all()

    # Pour chaque item (N), une nouvelle requête sera faite pour récupérer l'utilisateur
    for item in items:
        print(f"Tâche: {item.title}, Utilisateur: {item.user.username}")
        # ↑ Chaque accès à item.user génère une nouvelle requête SQL !
```

#### Solution avec `joinedload()`

```python
# ✅ SOLUTION - Une seule requête
async def get_all_items_with_users_good(db: AsyncSession):
    """Version optimisée avec joinedload"""
    result = await db.execute(
        select(models_todos.TodosItem)
        .options(joinedload(models_todos.TodosItem.user))
    )
    items = result.scalars().all()

    # Maintenant, toutes les données utilisateur sont déjà chargées
    for item in items:
        print(f"Tâche: {item.title}, Utilisateur: {item.user.username}")
        # ↑ Aucune requête supplémentaire !
```

#### Quand utiliser `joinedload()` ?

::: tip Cas d'usage recommandés

- **Relations one-to-one** : Toujours recommandé
- **Relations many-to-one** : Recommandé quand vous savez que vous accéderez aux données liées
- **Petites collections** : Acceptable pour de petites listes

:::

::: warning Cas à éviter

- **Relations one-to-many volumineuses** : Peut créer des résultats dupliqués énormes
- **Relations many-to-many complexes** : Préférez `selectinload()` ou des requêtes séparées
- **Données rarement utilisées** : N'utilisez que si vous êtes sûr d'accéder aux données

:::

#### Alternatives à `joinedload()`

```python
from sqlalchemy.orm import selectinload, subqueryload

# selectinload() - Meilleur pour les collections
async def get_users_with_many_tasks(db: AsyncSession):
    """Utilise selectinload pour éviter la duplication de données"""
    result = await db.execute(
        select(models_todos.User)
        .options(selectinload(models_todos.User.todos_items))
    )
    return result.scalars().all()

# subqueryload() - Alternative pour certains cas
async def get_items_alternative(db: AsyncSession):
    """Utilise subqueryload comme alternative"""
    result = await db.execute(
        select(models_todos.TodosItem)
        .options(subqueryload(models_todos.TodosItem.user))
    )
    return result.scalars().all()
```

#### Jointures imbriquées

Vous pouvez chaîner `joinedload()` pour des relations imbriquées :

```python
async def get_items_with_user_and_profile(db: AsyncSession):
    """Charge les items avec utilisateur et profil en une requête"""
    result = await db.execute(
        select(models_todos.TodosItem)
        .options(
            joinedload(models_todos.TodosItem.user)
            .joinedload(models_todos.User.profile)
        )
    )
    return result.scalars().all()
```

::: details Requête SQL générée

Avec `joinedload()`, SQLAlchemy génère une requête avec LEFT OUTER JOIN :

```sql
SELECT todos_item.id, todos_item.title, todos_item.done, todos_item.user_id,
       user_1.id AS id_1, user_1.username, user_1.email
FROM todos_item
LEFT OUTER JOIN user AS user_1 ON user_1.id = todos_item.user_id
WHERE todos_item.id = ?
```

Sans `joinedload()`, vous auriez :

1. `SELECT * FROM todos_item WHERE id = ?`
2. `SELECT * FROM user WHERE id = ?` (pour chaque item accédé)

:::

### Jointures avec filtres

```python
async def get_completed_items_by_username(
    db: AsyncSession,
    username: str,
) -> Sequence[models_todos.TodosItem]:
    """Récupère les tâches terminées d'un utilisateur par nom d'utilisateur"""
    result = await db.execute(
        select(models_todos.TodosItem)
        .join(models_todos.User)
        .where(
            models_todos.User.username == username,
            models_todos.TodosItem.done == True
        )
    )
    return result.scalars().all()
```

### Agrégations

```python
from sqlalchemy import func, desc

async def get_user_task_count(
    db: AsyncSession,
) -> Sequence[tuple]:
    """Compte le nombre de tâches par utilisateur"""
    result = await db.execute(
        select(
            models_todos.User.username,
            func.count(models_todos.TodosItem.id).label('task_count')
        )
        .join(models_todos.TodosItem)
        .group_by(models_todos.User.id)
        .order_by(desc('task_count'))
    )
    return result.all()
```

::: tip Bonnes pratiques pour les jointures

- Utilisez `joinedload()` pour le chargement eager des relations
- Préférez les jointures explicites aux jointures implicites
- Testez les performances avec `EXPLAIN` sur vos requêtes complexes
- Considérez l'utilisation d'index sur les colonnes fréquemment jointes

:::

## Exemple complet d'un service

Voici un exemple complet d'un service de CRUDS utilisant toutes ces fonctionnalités :

```python :collapsed-lines=20
from typing import Optional, Sequence
from sqlalchemy import select, update, delete, func
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload

from app.models import models_todos


async def get_all_by_user(
    db: AsyncSession,
    user_id: str,
    include_completed: bool = True
) -> Sequence[models_todos.TodosItem]:
    """Récupère toutes les tâches d'un utilisateur"""
    query = select(models_todos.TodosItem).where(
        models_todos.TodosItem.user_id == user_id
    )

    if not include_completed:
        query = query.where(models_todos.TodosItem.done == False)

    result = await db.execute(query.order_by(models_todos.TodosItem.created_at))
    return result.scalars().all()


async def create(
    db: AsyncSession,
    user_id: str,
    title: str,
    description: Optional[str] = None
) -> models_todos.TodosItem:
    """Crée une nouvelle tâche"""
    item = models_todos.TodosItem(
        user_id=user_id,
        title=title,
        description=description,
        done=False
    )

    db.add(item)
    try:
        await db.commit()
        return item
    except IntegrityError as error:
        await db.rollback()
        raise ValueError(f"Impossible de créer la tâche : {error}")


async def toggle_completion(
    db: AsyncSession,
    item_id: str,
    user_id: str
) -> bool:
    """Bascule le statut d'une tâche et retourne le nouveau statut"""
    # Récupérer l'état actuel
    result = await db.execute(
        select(models_todos.TodosItem.done)
        .where(
            models_todos.TodosItem.id == item_id,
            models_todos.TodosItem.user_id == user_id
        )
    )
    current_status = result.scalar_one_or_none()

    if current_status is None:
        raise ValueError("Tâche non trouvée")

    new_status = not current_status

    await db.execute(
        update(models_todos.TodosItem)
        .where(
            models_todos.TodosItem.id == item_id,
            models_todos.TodosItem.user_id == user_id
        )
        .values(done=new_status)
    )
    await db.commit()
    return new_status
```

Cette approche modulaire et bien structurée vous permettra de maintenir un code propre et efficace
lors de l'utilisation de SQLAlchemy dans Hyperion.
