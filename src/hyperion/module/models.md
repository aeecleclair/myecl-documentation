---
title: Models
order: 3
category:
  - Guide
  - Module
---

# Models Guide

## Introduction

In Hyperion, models are used to define the structure of the database tables and how they relate to each other. They are defined using SQLAlchemy, which is a powerful ORM (Object-Relational Mapping) library for Python.

What's an ORM?
> Object–relational mapping (ORM, O/RM, and O/R mapping tool) in computer science is a programming technique for converting data between a relational database and the memory (usually the heap) of an object-oriented programming language. This creates, in effect, a virtual object database that can be used from within the program.

::: info ORM

ORMs != SQLAlchemy, there are other ORMs for Python as well as for other programming languages. SQLAlchemy is just one of the most popular ORMs for Python.

:::

So when you see a model definition, it is essentially a Python class that represents a table in your SQL database. Additionnaly, you can also define relationships between tables but we will get to that part later in the doc.


## Why use models?

Using models allows us to interact with the database in a more intuitive and Pythonic way. Instead of writing raw SQL queries, we can use the model classes to perform CRUD (Create, Read, Update, Delete) operations on the database. Thus it is far less likely to make mistakes in the SQL syntax, and especially when you change things in the database schema, you don't have to go through all your raw SQL queries and update them (and obviously forgetting to update one and then having to debug it later).

## Defining a model

Models are defined in the `models_{module_name}.py` file. Each model is a class that inherits from `Base`, which is the base class for all models in Hyperion.

::: warning 1. The class name

Be careful when naming your model class, the name can only be used once in the whole API.
Thus, is the name is relatively generic, it can be a good idea to prefix it with the module name, for example `TicketingEvent` instead of `Event`, to avoid potential conflicts with other modules.

:::

::: warning 2. Imports

Sometimes imports can be a bit tricky and your editor may not be able to find the `Base` class, or the `Mapped` type, or the `mapped_column` function.

```py
from datetime import datetime
from uuid import UUID

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.types.sqlalchemy import Base, PrimaryKey
```

:::

Here is an example of a model definition:

```python
class TicketingEvent(Base):
    __tablename__ = "ticketing_event"

    id: Mapped[PrimaryKey]
    store_id: Mapped[UUID] = mapped_column(ForeignKey("mypayment_store.id"))
    store: # relationship to the store, many-to-one will be explained later
    creator_id: Mapped[str] = mapped_column(ForeignKey("core_user.id"))
    name: Mapped[str]
    open_date: Mapped[datetime]
    close_date: Mapped[datetime | None]
    quota: Mapped[int | None]
    used_quota: Mapped[int]
    user_quota: Mapped[int | None]
    disabled: Mapped[bool]

    # More complex relationships (one-to-many, many-to-many) are removed for simplicity, but they are explained further in the doc.
```

Some useful tips for defining models:
- Define your tablename, this will be used for the table name in the database, and it is a good practice to prefix it with the module name to avoid potential conflicts with other modules. This will also be used for foreign keys references.
- Use the `Mapped` type hint to specify the type of each column, and use `mapped_column` to specify additional options for the column, such as foreign keys, indexes, uniqueness, nullability, etc.
- id should be defined with our custom UUID primary key type, which is an UUID and a mapped column with a primary key constraint.
```py
PrimaryKey = Annotated[uuid.UUID, mapped_column(primary_key=True)]
```




## Relationships

In a relational database, you may be wondering how to store a list in a column, it's not possible at the database level, but you can achieve this by creating a separate table for the related items and then defining a relationship between the two tables. This is how we do one-to-many relationships in SQLAlchemy.

::: info Relationships

You can see the guide on joining tables and relationships in SQLAlchemy [here](../common/sqlalchemy/joins.md)

:::

## Models vs Schemas

Models and schemas are two different concepts, but they are closely related. Models are used to define the structure of the database tables and how they relate to each other, while schemas are used to define the structure of the data that is sent and received by the API endpoints.

## Conclusion

Models are a fundamental concept in Hyperion, they define the structure of the database tables in Python Object by using SQLAlchemy, and they allow us to relate different tables to each other. At the end, you will not have to write raw SQL queries.