---
title: Redis
order: 11
category:
  - Guide
---

# Redis Guide

## Quick overview

### Definition

The wikipedia definition of [Redis](https://en.wikipedia.org/wiki/Redis) is self-explanatory:

> Redis (/ˈrɛdɪs/; Remote Dictionary Server) is an in-memory key–value database, used as a distributed cache and message broker, with optional durability. Because it holds all data in memory and because of its design, Redis offers low-latency reads and writes, making it particularly suitable for use cases that require a cache.

So in python terms, you can think of Redis as a dictionary that unlike a normal dictionary, is shared across multiple processes and machines.
In our case, Redis may prove useful since Hyperion use multiple workers (which are separate processes).

::: warning

Since Redis is an in-memory database, it means that all the data stored in Redis is lost when the Redis server is stopped or restarted, so it's not suitable for storing persistent data as we do with a traditional database (e.g. PostgreSQL), but it's great for caching and other use cases where we don't care about data persistence.

:::

### What are our use cases for Redis?
Typically, these are:

::: details Lockers

Redis can be used to create locks, we'll define what a lock is.
A lock is a mechanism that allows us to ensure that only one worker is executing a specific piece of code (eventually at a time).

An example of this, executin the migrations on the database, only one worker should perform these.
We have a helper function to do so. The principle is simple, the first worker to run the code will get the lock (get a key in Redis which will be null and then set it to an arbitrary value e.g. "1"), and then the other workers will see that the lock is taken (the key in Redis is not null) and will not run the code.
```py
await initialization.use_lock_for_workers(
        init_db,
        "init_db",
        redis_client,
        number_of_workers,
        hyperion_error_logger,
        unlock_key="db_initialized",
        settings=settings,
        hyperion_error_logger=hyperion_error_logger,
        drop_db=drop_db,
    )
```

:::
::: details Caches

Naturally, Redis can be used as a cache, for example to cache the results of expensive computations or database queries.

When an endpoint is called, for the first time, the cache is empty (for the relevant key), so the endpoint will perform for example a database query, and then store the result in Redis with a specific key (e.g. "endpoint_name:query_parameters").
Afterwards, when the same endpoint is called (be careful with the query parameters, they should be the same as the ones used to store the result in Redis), the endpoint will first check if the result is in Redis (if the key exists), and if it is, it will return the cached result instead of performing the expensive computation or database query again.

Aditionally, we can set a TTL (Time To Live) for the cached results, so that they are automatically removed from Redis after a certain amount of time, which is useful to ensure that the cache does not grow indefinitely and decrease the probabilty of outdated data.

:::
::: details Pub/Sub

As far as I know, we don't use Redis Pub/Sub in Hyperion, but it's worth mentioning that Redis also offers a Pub/Sub mechanism which allows us to send messages between workers (or even between different applications) in a publish-subscribe manner.

:::


## Use redis in Hyperion

An helper function is provided to get the Redis client, which is a wrapper of the `redis` python package.

```py
def get_redis_client() -> redis.Redis | None:
    """
    Dependency that returns the redis client

    If the redis client is not available, it will return None.
    """
    return GLOBAL_STATE["redis_client"]
```

In endpoints, you can use the `get_redis_client` dependency.
For example:
```py
@router.get("/endpoint")
async def endpoint(
    redis_client: redis.Redis | None = Depends(get_redis_client),
):
    if redis_client is not None:
        # do something with redis
    else:
        # do something else
```

Be careful when using Redis in endpoints, since it may not be available (if the Redis server is not running e.g. in development environment), so always check if the `redis_client` is not `None` before using it.


## Useful basic Redis commands

Here are some basic Redis commands that you may find useful:

- `SET key value`: Set the value of a key.
- `GET key`: Get the value of a key.
- `DEL key`: Delete a key.
- `EXPIRE key seconds`: Set a TTL (Time To Live) for a key, after which it will be automatically deleted. (The TTL can be set when setting the key)
- `TTL key`: Get the remaining TTL of a key.
- `EXISTS key`: Check if a key exists.
- `INCR key`: Increment the value of a key (if it's an integer).
- `DECR key`: Decrement the value of a key (if it's an integer).

You can find more commands in the [Redis documentation](https://redis.io/docs/latest/commands/redis-8-6-commands/).

The most useful commands or the basic ones, the hash related commands, and the list related commands are the ones you will likely use in Hyperion.