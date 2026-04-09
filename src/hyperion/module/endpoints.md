---
title: Endpoints
order: 4
category:
  - Guide
  - Module
---

# Endpoints Guide

## Introduction

Now that we have the data structures, we move on to the logical part of the module, which begins with the endpoints. We've decided to present the endpoints before the CRUDs because they are the entry point of the module, and they are where most of the logic is located.

What's an endpoint:
The client will call an endpoint to interact with the API, and the defined endpoint in the code (which is a function decorated with a FastAPI decorator) will be executed, and it will return a response to the client.

## Defining endpoints

### Declaring the module router

At the top of the `endpoints_{module_name}.py` file, we need to declare the router for the module, which is an instance of `APIRouter` from FastAPI. This router will be used to define the endpoints for the module.

```py
from fastapi import APIRouter

from app.core.permissions.type_permissions import ModulePermissions

from app.types.module import Module

# It's not the router but here is how to declare the module permissions.
class ModulePermissions(ModulePermissions):
    access_mymodule = "access_mymodule"

# The API Router from fastAPI
router = APIRouter(tags=["ModuleName"])

# Our own custom module class, it will be used to register the module in the main API and to define some properties of the module such as the root path, the tag, the router, factory and more things.
module = Module(
    root="module_name",
    tag="ModuleName",
    router=router,
    factory=ModuleFactory(),
    permissions=ModulePermissions,
)
```

::: details Module class

```py
class Module(CoreModule):
    def __init__(
        self,
        root: str,
        tag: str,
        factory: Factory | None,
        default_allowed_groups_ids: list[GroupType] | None = None,
        default_allowed_account_types: list[AccountType] | None = None,
        router: APIRouter | None = None,
        payment_callback: Callable[
            [schemas_payment.CheckoutPayment, AsyncSession],
            Awaitable[None],
        ]
        | None = None,
        registred_topics: list[Topic] | None = None,
        permissions: type[ModulePermissions] | None = None,
    ):
        """
        Initialize a new Module object.
        :param root: the root of the module, used by Titan
        :param tag: the tag of the module, used by FastAPI
        :param factory: a factory to use to create fake data for the module (development purpose)
        :param default_allowed_groups_ids: list of groups that should be able to see the module by default
        :param default_allowed_account_types: list of account_types that should be able to see the module by default
        :param router: an optional custom APIRouter
        :param payment_callback: an optional method to call when a payment is notified by HelloAsso. A CheckoutPayment and the database will be provided during the call
        :param registred_topics: an optionnal list of Topics that should be registered by the module. Modules can also register topics dynamically.
            Once the Topic was registred, removing it from this list won't delete it
        :param permissions: enum declaring permissions strings used by module
        """
        self.root = root
        self.default_allowed_groups_ids = default_allowed_groups_ids
        self.default_allowed_account_types = default_allowed_account_types
        self.router = router or APIRouter(tags=[tag])
        self.payment_callback: (
            Callable[[schemas_payment.CheckoutPayment, AsyncSession], Awaitable[None]]
            | None
        ) = payment_callback
        self.registred_topics = registred_topics
        self.factory = factory
        self.permissions = permissions
```

If you want to know more about the `payment_callback`, you can check the documentation about payments and HelloAsso integration [here](../beyond/myeclpay.md).

:::


### Declaring an endpoint

We will define our endpoints in the `endpoints_{module_name}.py` file. Each endpoint is a function that is decorated with a FastAPI decorator, such as `@router.get`, `@router.post`, `@router.put`, `@router.delete`, etc.

We'll explain the code of an example.

```py
# The decorator that defines the endpoint
# Notice the .get which indicates that this endpoint will be called with a GET request.
@module.router.get(
    "/ticketing/events/", # the path
    summary="Get all events", # the summary of the endpoint, used in the swagger documentation
    response_model=list[schemas_ticketing.EventSimple], # the response SCHEMA
    status_code=200, # Status code to return if the request is successful.
)
async def get_events(
    db: AsyncSession = Depends(get_db), # Dependency that provides the database session, used in 99% of the endpoints.
) -> list[schemas_ticketing.EventSimple]:
    """Get all events."""
    # The cruds to fetch data from the database, we will see them in the next section.
    return await cruds_ticketing.get_events(db=db)
```

::: info Decorator

What's a decorator: A decorator is a function that takes another function and extends its behavior without explicitly modifying it. It's like a function composition (wrapper) that allows you to add functionality to an existing function. Search for "Python decorators" if you want to know more about them.

:::

### Common status codes

When defining an endpoint, you can specify the status code to return if the request is successful. Here are some common status codes that you can use:

**2xx Success:**
- 200 OK: The request was successful, and the server is returning the requested data. (Usually used for **GET** requests)
- 201 Created: The request was successful, and a new resource was created as a result (Usually used for **POST** requests).
- 204 No Content: The request was successful, but there is no content to return. (Usually used for **PATCH/PUT/DELETE** requests)

**4xx Client Errors:**
- 400 Bad Request: The server could not understand the request due to invalid syntax.
- 401 Unauthorized: The client must authenticate itself to get the requested response.
- 403 Forbidden: The client does not have access rights to the content.
- 404 Not Found: The server can not find the requested resource.
- 422 Unprocessable Entity: The request was well-formed but was unable to be followed due to semantic errors (often used for validation errors).
- 429 Too Many Requests: The user has sent too many requests in a given amount of time ("rate limiting").

**5xx Server Errors:**
- 500 Internal Server Error: The server has encountered a situation it doesn't know how to handle.
- 503 Service Unavailable: The server is not ready to handle the request, often used when the server is down for maintenance or overloaded.

### Dependencies

A very quick word about dependencies, you can see the documentation about dependencies in FastAPI [here](https://fastapi.tiangolo.com/tutorial/dependencies/). Dependencies are a powerful feature of FastAPI that allows you to define reusable components that can be injected into your endpoints. For example, you can define a dependency to get the current user from the request, or to get the database session, etc.

The 2 must know dependencies in Hyperion are:
```py
db: AsyncSession = Depends(get_db), # Get the database session, used in 99% of the endpoints
user: models_users.CoreUser = Depends(is_user()), # not that we use a custom dependency is_user() that checks if the user is authenticated and returns the user object, if the user is not authenticated it raises a 401 error.
# But there are other dependencies to check in which group the user is, if the user has access to the module, etc.
```

### The business logic of the endpoints

We've seen a very basic get endpoint, but some endpoints can be more complex and contain a lot of logic, such as checking if the user has the right permissions to access the resource, if the resource exists, if the data is valid, etc. In these cases, we can use the `HTTPException` class from FastAPI to raise an exception with a specific status code and detail message.

Here is an example of a more complex endpoint:
::: info Disclaimer

No need to understand the business logic of this endpoint, it's just an example to show how to use `HTTPException` and how to structure the logic of an endpoint. We will see in the next sections how to interact with the database using CRUDs, and how to use dependencies to get the user and the database session.

:::

```py
@module.router.delete(
    "/ticketing/sessions/{session_id}",
    summary="Delete an existing session",
    response_model=None,
    status_code=204,
)
async def delete_session(
    session_id: UUID,
    db: AsyncSession = Depends(get_db),
    user: models_users.CoreUser = Depends(
        is_user_allowed_to([TicketingPermissions.manage_events]),
    ),
) -> None:
    """Delete an existing session."""
    stored = await cruds_ticketing.get_session_by_id(session_id=session_id, db=db)
    if stored is None:
        raise HTTPException(status_code=404, detail="Session not found")
    if stored.used_quota > 0:
        raise HTTPException(
            status_code=400,
            detail="Cannot delete a session with used quota",
        )
    categories = await cruds_ticketing.get_categories_by_session_id(
        session_id=session_id,
        db=db,
    )
    if len(categories) > 0:
        raise HTTPException(
            status_code=400,
            detail="Cannot delete a session with associated categories",
        )
    tickets = await cruds_ticketing.get_tickets_by_session_id(
        session_id=session_id,
        db=db,
    )
    if len(tickets) > 0:
        raise HTTPException(
            status_code=400,
            detail="Cannot delete a session with associated tickets",
        )
    await cruds_ticketing.delete_session(session_id=session_id, db=db)
```

Thus, you should not trust the user input that and even if the data is validated by Pydantic, it doesn't mean that the data is valid for your business logic, so you should always check that the data is valid before performing any action with it, and if it's not valid, you should raise an appropriate HTTPException with a clear message to the client.

You can also create custom exceptions if you want to handle specific cases in a more elegant way, for example by creating a `QuotaExceededException` that inherits from `HTTPException` and has a default status code of 400 and a default detail message of "Quota exceeded", and then you can raise this exception whenever the quota is exceeded instead of raising a generic HTTPException.

You can also create utils functions to handle common logic in your endpoints.

## Conclusion

**Endpoints** are the entry point of the module, they are where most of the logic is located, and they are what the client interacts with. When defining endpoints, you should always check that the data is valid for your **business logic**, and if it's not valid, you should raise an appropriate HTTPException. Remember that the client **arrives** at the endpoint with a **Schema** and the endpoint will **reply** with a **Schema**.