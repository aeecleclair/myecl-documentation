---
title: Other files
order: 7
category:
  - Guide
  - Module
---

# Other files in a module

You will often see in a module some other files that are not the main ones (endpoints, cruds, models, schemas).

## Factory

When you want to test your module, it is often useful to have some pre-filled data in the database, to avoid having to create it manually every time. This is where the factory comes in, it is a file that contains functions to create some data in the database, and it is usually called `factory_{module_name}.py`.

Here is an example of a factory function:

```py
import random
from datetime import UTC, datetime, timedelta
from uuid import uuid4

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.memberships.factory_memberships import CoreMembershipsFactory
from app.core.mypayment.factory_mypayment import MyPaymentFactory
from app.core.users.factory_users import CoreUsersFactory
from app.core.utils.config import Settings
from app.modules.ticketing import cruds_ticketing, schemas_ticketing
from app.types.factory import Factory


class TicketingFactory(Factory):
    depends_on = [
        CoreUsersFactory,
        MyPaymentFactory,
        CoreMembershipsFactory,
    ]

    organiser_id = uuid4()
    event_id = uuid4()
    session1_id = uuid4()
    session2_id = uuid4()
    category1_id = uuid4()
    category2_id = uuid4()
    category3_id = uuid4()

    @classmethod
    async def run(cls, db: AsyncSession, settings: Settings) -> None:
        await cls.add_organiser(db)
        await cls.add_event(db)
        await cls.add_sessions(db)
        await cls.add_categories(db)
        await cls.add_tickets(db)

    @classmethod
    async def add_organiser(cls, db: AsyncSession) -> None:
        """Create an organiser"""
        await cruds_ticketing.create_organiser(
            db,
            schemas_ticketing.OrganiserComplete(
                id=cls.organiser_id,
                store_id=MyPaymentFactory.other_stores_id[0][0],
                name="ECLAIR",
            ),
        )

    @classmethod
    async def add_event(cls, db: AsyncSession) -> None:
        """Create a sample event."""
        await cruds_ticketing.create_event(
            db,
            schemas_ticketing.EventSimple(
                id=cls.event_id,
                organiser_id=cls.organiser_id,
                creator_id=CoreUsersFactory.other_users_id[0],
                name="Commuz 2025",
                open_date=datetime.now(UTC),
                close_date=datetime.now(UTC) + timedelta(days=30),
                quota=500,
                user_quota=4,
                used_quota=0,
                disabled=False,
            ),
        )

    @classmethod
    async def add_sessions(cls, db: AsyncSession) -> None:
        """Create sample sessions."""
        await cruds_ticketing.create_session(
            db,
            schemas_ticketing.SessionSimple(
                id=cls.session1_id,
                event_id=cls.event_id,
                date=datetime.now(UTC) + timedelta(days=10),
                name="TicketingSession du Samedi Soir",
                quota=300,
                user_quota=2,
                used_quota=0,
                disabled=False,
            ),
        )
        await cruds_ticketing.create_session(
            db,
            schemas_ticketing.SessionSimple(
                id=cls.session2_id,
                event_id=cls.event_id,
                date=datetime.now(UTC) + timedelta(days=11),
                name="TicketingSession du Dimanche Après-midi",
                quota=200,
                user_quota=2,
                used_quota=0,
                disabled=False,
            ),
        )

    @classmethod
    async def add_categories(cls, db: AsyncSession) -> None:
        """Create sample categories."""
        await cruds_ticketing.create_category(
            db,
            schemas_ticketing.CategorySimple(
                id=cls.category1_id,
                event_id=cls.event_id,
                name="Étudiant Centrale",
                sessions=[cls.session1_id, cls.session2_id],
                required_mebership=CoreMembershipsFactory.memberships_ids[0],
                quota=150,
                user_quota=2,
                used_quota=0,
                price=1500,
                disabled=False,
            ),
        )
        await cruds_ticketing.create_category(
            db,
            schemas_ticketing.CategorySimple(
                id=cls.category2_id,
                event_id=cls.event_id,
                name="Étudiant Lyon",
                sessions=[cls.session1_id, cls.session2_id],
                required_mebership=CoreMembershipsFactory.memberships_ids[1],
                quota=200,
                user_quota=2,
                used_quota=0,
                price=2000,
                disabled=False,
            ),
        )
        await cruds_ticketing.create_category(
            db,
            schemas_ticketing.CategorySimple(
                id=cls.category3_id,
                event_id=cls.event_id,
                name="Externe",
                sessions=[cls.session1_id],
                required_mebership=None,
                quota=100,
                user_quota=1,
                used_quota=0,
                price=3000,
                disabled=False,
            ),
        )

    @classmethod
    async def add_tickets(cls, db: AsyncSession) -> None:
        """Create sample tickets for users."""
        categories = [cls.category1_id, cls.category2_id]

        for _i, user_id in enumerate(CoreUsersFactory.other_users_id[:10]):
            category_id = random.choice(categories)  # noqa: S311

            await cruds_ticketing.create_ticket(
                db,
                schemas_ticketing.TicketSimple(
                    id=uuid4(),
                    user_id=user_id,
                    event_id=cls.event_id,
                    category_id=category_id,
                    session_id=cls.session1_id,
                    total=1500 if category_id == cls.category1_id else 2000,
                    created_at=datetime.now(UTC),
                    nb_scan=0,
                    status="valid",
                ),
            )

    @classmethod
    async def should_run(cls, db: AsyncSession):
        # test condtion to know if the factory should be run or not.
        return await cruds_ticketing.get_events(db) == []
```

::: warning Module router

Don't forget to add the factory to the module router, otherwise it won't be executed at startup if factories are enabled.

```py
module = Module(
    root="ticketing",
    tag="Ticketing",
    router=router,
    factory=TicketingFactory(),
)
```

Enable it in config.yaml:

```yaml
USE_FACTORIES: true
```

:::

## Types

Sometimes you may need to define some custom types that are used in your module, for example some Enums or custom Exceptions. No schema or model only some types that are used in the models or schemas. In this case, you can create a file called `types_{module_name}.py` and define your types there.

Example of an Enum definition:

```py
class HelloAssoConfigName(Enum):
    CDR = "CDR"
    RAID = "RAID"
    MYPAYMENT = "MYPAYMENT"
    CHALLENGER = "CHALLENGER"
```


## Utils

You can also have a file called `utils_{module_name}.py` where you can put some utility functions that are used in your module. For example, if you have some complex logic that is used in multiple places in your module, you can put it in a utility function to avoid code duplication and to make your code more readable.

Feel free to refactor your code by using such utility functions.


## Others

You can create as many files as you want in your module, as long as they are useful and well organized.
For example, a cache file for having CRUDs equivalent for Redis.