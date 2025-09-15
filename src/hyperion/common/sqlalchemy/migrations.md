---
title: Guide des Migrations Alembic
description: Guide complet pour gérer l'évolution du schéma de base de données avec Alembic
order: 2
category:
  - Guide
  - SQLAlchemy
tag:
  - migrations
  - alembic
  - base de données
  - schéma
---

# Guide des Migrations Alembic

## Introduction

Les migrations sont essentielles pour gérer l'évolution du schéma de base de données dans Hyperion. Elles permettent de synchroniser les modifications des modèles SQLAlchemy avec la structure de la base de données de manière contrôlée et versionnée.

Ce guide vous accompagnera dans la maîtrise d'Alembic, l'outil de migration de référence pour SQLAlchemy.

::: tip Objectifs du guide
- Comprendre le fonctionnement des migrations Alembic
- Maîtriser les commandes essentielles
- Appliquer les bonnes pratiques
- Résoudre les problèmes courants
:::

::: info Fonctionnement d'Alembic
Alembic génère des fichiers de migration en comparant vos modèles SQLAlchemy avec l'état actuel de la base de données. Ces migrations sont ensuite appliquées séquentiellement pour maintenir la cohérence du schéma.
:::

## 🚀 Démarrage rapide

```bash [Créer une migration]
# Génère automatiquement une migration basée sur les changements des modèles
alembic revision --autogenerate -m "Ajouter table CoreEvent"
```

```bash [Appliquer les migrations]
# Applique toutes les migrations en attente
alembic upgrade head
```

```bash [Voir l'état actuel]
# Affiche la migration courante
alembic current
```

## 📚 Commandes Alembic essentielles

### 🔄 Exécution des migrations

Dans Hyperion, les migrations sont automatiquement exécutées au démarrage de l'application. Cependant, vous pouvez les lancer manuellement :

```bash [Migration complète]
# Applique toutes les migrations jusqu'à la dernière
alembic upgrade head
```

```bash [Migration ciblée]
# Applique les migrations jusqu'à une révision spécifique
alembic upgrade ae1027a6acf
```

```bash [Migration relative]
# Applique les 2 prochaines migrations
alembic upgrade +2
```

```bash [Retour en arrière]
# Revient à la migration précédente
alembic downgrade -1
```

::: warning Attention en production
Les migrations vers le bas (`downgrade`) peuvent entraîner une perte de données. Testez toujours sur un environnement de développement avant !
:::

### 📝 Création de migrations

::: tabs

@tab Migration auto-générée (recommandé)

```bash [Auto-génération (recommandé)]
# Génère une migration en comparant les modèles avec la DB
alembic revision --autogenerate -m "Description claire du changement"
```

@tab Migration manuelle

```bash [Migration manuelle]
# Crée une migration vide pour des changements personnalisés
alembic revision -m "Migration custom pour data seeding"
```

@tab Migration avec dépendances

```bash [Migration avec dépendances]
# Crée une migration dépendante d'une autre branche
alembic revision --depends-on ae1027a6acf -m "Merge de deux branches"
```

:::

::: tip Convention de nommage
Utilisez des messages descriptifs et en français : `"Ajouter table CoreEvent"`, `"Modifier contrainte unique sur username"`, etc.
:::

### 🔍 Inspection et historique

```bash [État actuel]
# Affiche la révision actuelle de la base de données
alembic current
```

```bash [Historique]
# Liste toutes les migrations avec leur statut
alembic history --verbose
```

```bash [Migrations en attente]
# Affiche les migrations qui ne sont pas encore appliquées
alembic heads
```

```bash [Affichage détaillé]
# Montre les détails d'une migration spécifique
alembic show ae1027a6acf
```

### 🛠️ Commandes de maintenance

```bash [Marquer comme appliquée]
# Force Alembic à considérer la DB à jour (sans exécuter les migrations)
alembic stamp head
```

```bash [Nettoyage force]
# Supprime les références à des migrations inexistantes
alembic stamp --purge head
```

```bash [Validation]
# Vérifie la cohérence de l'historique des migrations
alembic check
```

::: danger Commandes dangereuses
`stamp` et `stamp --purge` modifient l'état d'Alembic sans appliquer les changements réels. Utilisez uniquement en cas de problème et après backup !
:::

## 📋 Bonnes pratiques

### ✅ Workflow recommandé

::: tip Processus de migration standard
1. **Modifiez vos modèles** SQLAlchemy
2. **Générez la migration** avec `alembic revision --autogenerate`
3. **Reviewez le fichier** généré avant de l'appliquer
4. **Testez sur un environnement** de développement
5. **Appliquez en production** avec prudence
:::

### 🎯 Règles d'or

::: details Compatibilité SQLite
Pour que les migrations soient compatibles avec SQLite, les commandes `alter` doivent être encapsulées dans un contexte `batch_alter_table` :

```python
# ✅ Compatible SQLite
with op.batch_alter_table("core_user") as batch_op:
    batch_op.add_column(sa.Column('new_field', sa.String(50)))

# ❌ Incompatible SQLite
op.add_column('core_user', sa.Column('new_field', sa.String(50)))
```
:::

::: details Convention de nommage
Les fichiers de migration suivent la convention : `{révision}_{message}.py`

**Exemples de bons messages :**
- `"ajouter_table_core_event"`
- `"modifier_contrainte_unique_username"`  
- `"supprimer_colonne_deprecated_field"`

**À éviter :**
- Messages trop vagues : `"update"`, `"fix"`
- Messages en anglais inconsistants
- Messages sans contexte
:::

### 🔧 Révision systématique

::: warning Toujours réviser les migrations auto-générées
Alembic peut parfois générer des migrations incorrectes ou incomplètes. Vérifiez systématiquement :

- **Les suppressions de colonnes** ne sont pas des renommages
- **Les types de données** sont corrects
- **Les contraintes** sont bien définies
- **L'ordre des opérations** est logique
:::

### 💾 Migrations de données

::: tabs

@tab Migration avec données

```python [Migration avec données]
"""Ajouter champ is_active avec valeur par défaut

Revision ID: abc123
Revises: def456
Create Date: 2024-01-15 10:00:00.000000
"""

from alembic import op
import sqlalchemy as sa

def upgrade():
    # 1. Ajouter la colonne avec une valeur par défaut
    with op.batch_alter_table("core_user") as batch_op:
        batch_op.add_column(
            sa.Column('is_active', sa.Boolean(), server_default=sa.true())
        )
    
    # 2. Migrer les données existantes si nécessaire
    connection = op.get_bind()
    connection.execute(
        sa.text("UPDATE core_user SET is_active = true WHERE created_at < :date"),
        {"date": "2024-01-01"}
    )

def downgrade():
    with op.batch_alter_table("core_user") as batch_op:
        batch_op.drop_column('is_active')
```

@tab Migration complexe

```python [Migration complexe]
"""Restructurer la table des événements

Revision ID: xyz789
Revises: abc123
Create Date: 2024-01-20 15:30:00.000000
"""

def upgrade():
    # 1. Créer nouvelle table
    op.create_table(
        'core_event_new',
        sa.Column('id', sa.String(), primary_key=True),
        sa.Column('title', sa.String(200), nullable=False),
        sa.Column('description', sa.Text()),
        sa.Column('event_date', sa.DateTime(), nullable=False),
    )
    
    # 2. Migrer les données
    connection = op.get_bind()
    
    # Récupérer les données de l'ancienne table
    result = connection.execute(sa.text("SELECT * FROM core_event"))
    
    for row in result:
        # Transformer et insérer dans la nouvelle table
        connection.execute(
            sa.text("""
                INSERT INTO core_event_new (id, title, description, event_date)
                VALUES (:id, :title, :desc, :date)
            """),
            {
                "id": row.id,
                "title": row.event_title,  # Renommage
                "desc": row.event_description,
                "date": row.scheduled_date,
            }
        )
    
    # 3. Supprimer l'ancienne table et renommer
    op.drop_table('core_event')
    op.rename_table('core_event_new', 'core_event')
```

:::

### 🏗️ Gestion des environnements

::: details Stratégie multi-environnements

**Développement :**
```bash
# Auto-génération fréquente pour tester
alembic revision --autogenerate -m "test_feature_xyz"
```

**Staging :**
```bash
# Test des migrations avant production
alembic upgrade head
alembic history  # Vérifier l'état
```

**Production :**
```bash
# Backup avant migration !
pg_dump hyperion_prod > backup_$(date +%Y%m%d_%H%M%S).sql

# Migration avec logging
alembic upgrade head --verbose
```
:::

### 🛡️ Migrations sûres

::: details Changements sans risque vs. risqués

**✅ Changements sûrs :**
- Ajouter une colonne nullable
- Ajouter un index
- Ajouter une table
- Ajouter une contrainte de validation (avec `NOT VALID`)

**⚠️ Changements risqués :**
- Supprimer une colonne
- Modifier le type d'une colonne
- Ajouter une contrainte NOT NULL
- Renommer une table/colonne

**🔒 Pour les changements risqués :**
1. **Déploiement en 2 étapes** (ajout + suppression séparés)
2. **Fenêtre de maintenance** planifiée
3. **Rollback plan** testé
4. **Monitoring** accru post-déploiement
:::

## 🧩 Exemples de migrations courantes

### 🏷️ Gestion des Enums

::: tabs

@tab Ajouter des valeurs à un Enum

```python [Ajouter des valeurs à un Enum]
"""Ajouter nouvelles valeurs à CoreUserRole

Revision ID: enum_update_001
"""

from alembic import op
import sqlalchemy as sa

def upgrade():
    # Compatible SQLite et PostgreSQL
    with op.batch_alter_table("core_user") as batch_op:
        batch_op.alter_column(
            "role",
            existing_type=sa.Enum(
                "admin", 
                "member", 
                name="core_user_role"
            ),
            type_=sa.Enum(
                "admin",
                "member", 
                "moderator",    # Nouvelle valeur
                "contributor",  # Nouvelle valeur
                name="core_user_role",
            ),
            existing_nullable=False,
        )

def downgrade():
    # Attention : vérifier qu'aucune donnée n'utilise les nouvelles valeurs !
    with op.batch_alter_table("core_user") as batch_op:
        batch_op.alter_column(
            "role",
            existing_type=sa.Enum(
                "admin", "member", "moderator", "contributor",
                name="core_user_role"
            ),
            type_=sa.Enum(
                "admin", "member",
                name="core_user_role"
            ),
            existing_nullable=False,
        )
```

@tab Utiliser un Enum PostgreSQL existant

```python [Créer un Enum existant pour PostgreSQL]
"""Utiliser un Enum PostgreSQL existant

Revision ID: enum_reuse_001
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

def upgrade():
    # Réutilise un Enum existant (ne le crée pas)
    op.add_column(
        'core_association',
        sa.Column(
            'membership_type',
            postgresql.ENUM(
                name="available_association_membership", 
                create_type=False  # Important : ne crée pas l'Enum
            ),
            nullable=True
        )
    )
```

:::

### 🏗️ Modifications de structure

::: tabs

@tab Ajouter une colonne avec contrainte

```python [Ajouter une colonne avec contrainte]
"""Ajouter email unique aux utilisateurs

Revision ID: add_email_001
"""

def upgrade():
    with op.batch_alter_table("core_user") as batch_op:
        # 1. Ajouter la colonne nullable d'abord
        batch_op.add_column(
            sa.Column('email', sa.String(255), nullable=True)
        )
    
    # 2. Remplir avec des données par défaut si nécessaire
    connection = op.get_bind()
    connection.execute(
        sa.text("""
            UPDATE core_user 
            SET email = username || '@example.com' 
            WHERE email IS NULL
        """)
    )
    
    # 3. Ajouter les contraintes
    with op.batch_alter_table("core_user") as batch_op:
        batch_op.alter_column('email', nullable=False)
        batch_op.create_unique_constraint('uq_core_user_email', ['email'])

def downgrade():
    with op.batch_alter_table("core_user") as batch_op:
        batch_op.drop_constraint('uq_core_user_email', type_='unique')
        batch_op.drop_column('email')
```

@tab Renommer une colonne

```python [Renommer une colonne]
"""Renommer created_date en created_at

Revision ID: rename_column_001
"""

def upgrade():
    with op.batch_alter_table("core_event") as batch_op:
        # SQLite nécessite une approche différente pour renommer
        batch_op.alter_column(
            'created_date',
            new_column_name='created_at'
        )

def downgrade():
    with op.batch_alter_table("core_event") as batch_op:
        batch_op.alter_column(
            'created_at', 
            new_column_name='created_date'
        )
```

:::

### 🔗 Relations et clés étrangères

::: tabs

@tab Ajouter une relation

```python [Ajouter une relation]
"""Ajouter relation User -> Profile

Revision ID: add_profile_relation_001
"""

def upgrade():
    # 1. Créer la table liée
    op.create_table(
        'core_user_profile',
        sa.Column('id', sa.String(), primary_key=True),
        sa.Column('user_id', sa.String(), nullable=False),
        sa.Column('bio', sa.Text()),
        sa.Column('avatar_url', sa.String(500)),
        sa.Column('created_at', sa.DateTime(), server_default=sa.func.now()),
    )
    
    # 2. Ajouter la clé étrangère
    with op.batch_alter_table("core_user_profile") as batch_op:
        batch_op.create_foreign_key(
            'fk_core_user_profile_user_id',
            'core_user',
            ['user_id'],
            ['id'],
            ondelete='CASCADE'
        )
        batch_op.create_unique_constraint(
            'uq_core_user_profile_user_id', 
            ['user_id']
        )

def downgrade():
    op.drop_table('core_user_profile')
```

@tab Créer relation many-to-many

```python [Migration many-to-many]
"""Créer relation User <-> Group

Revision ID: user_group_relation_001
"""

def upgrade():
    # 1. Table d'association
    op.create_table(
        'core_membership',
        sa.Column('user_id', sa.String(), nullable=False),
        sa.Column('group_id', sa.String(), nullable=False),
        sa.Column('joined_at', sa.DateTime(), server_default=sa.func.now()),
        sa.Column('role', sa.String(50), server_default='member'),
    )
    
    # 2. Clé primaire composite
    with op.batch_alter_table("core_membership") as batch_op:
        batch_op.create_primary_key('pk_core_membership', ['user_id', 'group_id'])
        
        # 3. Clés étrangères
        batch_op.create_foreign_key(
            'fk_core_membership_user_id',
            'core_user', ['user_id'], ['id'],
            ondelete='CASCADE'
        )
        batch_op.create_foreign_key(
            'fk_core_membership_group_id', 
            'core_group', ['group_id'], ['id'],
            ondelete='CASCADE'
        )

def downgrade():
    op.drop_table('core_membership')
```

:::

### 📊 Index et performance

```python [Ajouter des index]
"""Optimiser les requêtes fréquentes

Revision ID: add_indexes_001
"""

def upgrade():
    # Index simple pour les recherches
    op.create_index(
        'idx_core_user_username', 
        'core_user', 
        ['username']
    )
    
    # Index composite pour les requêtes filtrées
    op.create_index(
        'idx_core_event_date_status',
        'core_event',
        ['event_date', 'status']
    )
    
    # Index partiel (PostgreSQL seulement)
    if op.get_context().dialect.name == 'postgresql':
        op.execute("""
            CREATE INDEX idx_core_user_active 
            ON core_user (created_at) 
            WHERE is_active = true
        """)

def downgrade():
    op.drop_index('idx_core_user_username')
    op.drop_index('idx_core_event_date_status')
    
    if op.get_context().dialect.name == 'postgresql':
        op.execute("DROP INDEX IF EXISTS idx_core_user_active")
```

### 🛠️ Valeurs par défaut et contraintes

```python [Server defaults]
"""Ajouter des valeurs par défaut côté serveur

Revision ID: server_defaults_001
"""

def upgrade():
    with op.batch_alter_table("core_user") as batch_op:
        # Boolean avec défaut serveur
        batch_op.add_column(
            sa.Column(
                'is_active', 
                sa.Boolean(), 
                server_default=sa.sql.true(),  # ✅ Correct pour SQLAlchemy
                nullable=False
            )
        )
        
        # DateTime avec défaut serveur
        batch_op.add_column(
            sa.Column(
                'last_login', 
                sa.DateTime(),
                server_default=sa.func.now(),
                nullable=True
            )
        )
        
        # UUID avec défaut serveur (PostgreSQL)
        if op.get_context().dialect.name == 'postgresql':
            batch_op.add_column(
                sa.Column(
                    'uuid',
                    sa.String(),
                    server_default=sa.text('gen_random_uuid()'),
                    nullable=False
                )
            )

def downgrade():
    with op.batch_alter_table("core_user") as batch_op:
        batch_op.drop_column('is_active')
        batch_op.drop_column('last_login')
        if op.get_context().dialect.name == 'postgresql':
            batch_op.drop_column('uuid')
```

## 🚨 Résolution de problèmes

### ❌ Erreurs courantes et solutions

::: details Migration qui échoue en cours d'exécution

**Problème :** `sqlalchemy.exc.IntegrityError: constraint failed`

**Causes possibles :**
- Contrainte NOT NULL sur une colonne avec des valeurs NULL existantes
- Contrainte UNIQUE violée par des données existantes
- Clé étrangère pointant vers un enregistrement inexistant

**Solutions :**
```python
def upgrade():
    # ❌ Échoue si des données existent
    op.add_column('core_user', sa.Column('email', sa.String(), nullable=False))
    
    # ✅ Solution en 2 étapes
    # 1. Ajouter la colonne nullable
    op.add_column('core_user', sa.Column('email', sa.String(), nullable=True))
    
    # 2. Remplir les données manquantes
    connection = op.get_bind()
    connection.execute(
        sa.text("UPDATE core_user SET email = username || '@temp.local' WHERE email IS NULL")
    )
    
    # 3. Appliquer la contrainte NOT NULL
    with op.batch_alter_table("core_user") as batch_op:
        batch_op.alter_column('email', nullable=False)
```
:::

::: details État de migration incohérent

**Problème :** `FAILED: Target database is not up to date`

**Diagnostic :**
```bash
# Vérifier l'état actuel
alembic current
alembic history --verbose

# Voir les migrations en attente
alembic heads
```

**Solutions :**
```bash
# Solution 1 : Appliquer les migrations manquantes
alembic upgrade head

# Solution 2 : Si la DB est déjà à jour mais Alembic ne le sait pas
alembic stamp head

# Solution 3 : En cas de corruption de l'historique
alembic stamp --purge head
```
:::

::: details Conflits de fusion de branches

**Problème :** `Multiple heads detected`

**Diagnostic :**
```bash
alembic heads  # Montre plusieurs têtes
```

**Solution :**
```bash
# 1. Créer une migration de fusion
alembic merge -m "Fusionner branches feature-A et feature-B" head1 head2

# 2. Ou utiliser les dépendances lors de la création
alembic revision --depends-on head1,head2 -m "Migration après fusion"
```
:::

### 🔄 Migrations complexes

::: details Migration zéro-downtime

Pour les applications critiques, certaines migrations doivent être déployées sans interruption :

**Étape 1 : Préparation**
```python
"""Phase 1: Ajouter nouvelle colonne

Revision ID: zero_downtime_001
"""

def upgrade():
    # Ajouter la nouvelle colonne nullable
    with op.batch_alter_table("core_user") as batch_op:
        batch_op.add_column(sa.Column('new_field', sa.String(100), nullable=True))
    
    # Pas de modification du code applicatif encore

def downgrade():
    with op.batch_alter_table("core_user") as batch_op:
        batch_op.drop_column('new_field')
```

**Étape 2 : Déploiement applicatif**
- Déployer le code qui écrit dans les deux colonnes (ancienne + nouvelle)
- Les lectures se font encore sur l'ancienne colonne

**Étape 3 : Migration des données**
```python
"""Phase 2: Migrer les données existantes

Revision ID: zero_downtime_002
"""

def upgrade():
    # Migrer toutes les données existantes
    connection = op.get_bind()
    connection.execute(
        sa.text("UPDATE core_user SET new_field = old_field WHERE new_field IS NULL")
    )

def downgrade():
    pass  # Les données peuvent être re-migrées à partir de old_field
```

**Étape 4 : Finalisation**
```python
"""Phase 3: Finaliser la migration

Revision ID: zero_downtime_003
"""

def upgrade():
    # Rendre la nouvelle colonne NOT NULL
    with op.batch_alter_table("core_user") as batch_op:
        batch_op.alter_column('new_field', nullable=False)
        # Optionnel : supprimer l'ancienne colonne
        # batch_op.drop_column('old_field')

def downgrade():
    with op.batch_alter_table("core_user") as batch_op:
        batch_op.alter_column('new_field', nullable=True)
        # Recréer old_field si supprimée
```
:::

::: details Migration de grandes tables

Pour les tables avec des millions d'enregistrements :

```python
"""Migration par batch pour grande table

Revision ID: large_table_001
"""

def upgrade():
    connection = op.get_bind()
    
    # Migration par batch de 10 000 enregistrements
    batch_size = 10000
    offset = 0
    
    while True:
        result = connection.execute(
            sa.text(f"""
                UPDATE core_user 
                SET processed = true 
                WHERE id IN (
                    SELECT id FROM core_user 
                    WHERE processed IS NULL 
                    LIMIT {batch_size}
                )
            """)
        )
        
        if result.rowcount == 0:
            break
            
        print(f"Traité {offset + result.rowcount} enregistrements")
        offset += result.rowcount
        
        # Commit intermédiaire pour éviter les verrous longs
        connection.commit()

def downgrade():
    connection = op.get_bind()
    connection.execute(sa.text("UPDATE core_user SET processed = NULL"))
```
:::

### 🛠️ Outils de debugging

::: details Mode verbose et logging

```python
# Dans votre migration, ajoutez du logging
import logging

logger = logging.getLogger(__name__)

def upgrade():
    logger.info("Début de la migration complexe")
    
    connection = op.get_bind()
    
    # Compter les enregistrements avant
    result = connection.execute(sa.text("SELECT COUNT(*) FROM core_user"))
    count_before = result.scalar()
    logger.info(f"Enregistrements avant migration: {count_before}")
    
    # Votre migration...
    
    # Compter après
    result = connection.execute(sa.text("SELECT COUNT(*) FROM core_user WHERE email IS NOT NULL"))
    count_after = result.scalar()
    logger.info(f"Enregistrements avec email après migration: {count_after}")
```

**Commandes de debug :**
```bash
# Mode verbose
alembic upgrade head --verbose

# Voir le SQL généré sans l'exécuter
alembic upgrade head --sql

# Créer une migration avec du SQL personnalisé
alembic upgrade head --tag "production-deployment-2024-01"
```
:::

## 🎯 Checklist pré-production

::: tip Checklist de déploiement
- [ ] **Backup complet** de la base de données
- [ ] **Test sur un clone** de la base de production
- [ ] **Validation** des données après migration
- [ ] **Plan de rollback** documenté et testé
- [ ] **Fenêtre de maintenance** planifiée si nécessaire
- [ ] **Monitoring** renforcé post-déploiement
- [ ] **Communication** aux équipes concernées
:::

::: warning Points critiques
- **Jamais de migration destructive** sans backup
- **Tester le rollback** avant le déploiement
- **Prévoir du temps supplémentaire** pour les grandes tables
- **Surveiller les performances** après déploiement
:::

::: danger En cas de problème en production
1. **STOP** : Arrêter immédiatement si possible
2. **ÉVALUER** : Analyser l'impact et les risques
3. **ROLLBACK** : Utiliser le plan de retour en arrière
4. **RESTAURER** : Depuis le backup si nécessaire
5. **POST-MORTEM** : Analyser les causes après résolution
:::

## 📚 Ressources et références

::: details Liens utiles
- **[Documentation Alembic officielle](https://alembic.sqlalchemy.org/)**
- **[Guide des migrations SQLAlchemy](https://docs.sqlalchemy.org/en/14/core/schema.html)**
- **[Batch operations pour SQLite](https://alembic.sqlalchemy.org/en/latest/batch.html)**
- **[Migration patterns avancés](https://alembic.sqlalchemy.org/en/latest/cookbook.html)**
:::

::: tip Commandes de référence rapide
```bash
# Créer une migration
alembic revision --autogenerate -m "Description"

# Appliquer les migrations
alembic upgrade head

# Voir l'état
alembic current

# Historique complet
alembic history --verbose

# Rollback d'une migration
alembic downgrade -1

# Marquer comme appliqué
alembic stamp head
```
:::

