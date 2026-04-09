---
title: Scheduler
order: 13
category:
  - Guide
---

# Scheduler Guide

## Quick overview

A **Scheduler** is a component that allows you to defer the execution of a task to a later specified time.

We use [ARQ](https://arq-docs.helpmanual.io/) as our scheduler, which is a simple and efficient task queue for Python that uses Redis as a backend. According to their Readme, the main benefits of ARQ are **non-blocking**, **powerful-features**, **fast**, **elegant** and **small**.

Also according to their documentation, you must be vigilant when queuing tasks.
::: warning

Jobs may be called more than once!

So it means that a queued job may be executed more than once, and you have to make sure that your code will handle this case correctly. To solve this issue, in Hyperion we use the `job_id` parameter when queuing a job, which allows us to identify the job and cancel it if it is already queued.

:::

## Current code implementation (at this time)

```py
class Scheduler:
    """
    An [arq](https://arq-docs.helpmanual.io/) scheduler.
    The wrapper is intended to be used inside a FastAPI worker.

    The scheduler use a Redis database to store planned jobs.
    """

    # See https://github.com/fastapi/fastapi/discussions/9143#discussioncomment-5157572

    # Pointer to the app dependency overrides dict
    _dependency_overrides: dict[Callable[..., Any], Callable[..., Any]]

    def __init__(self):
        # ArqWorker, in charge of scheduling and executing tasks
        self.worker: Worker | None = None
        # Task will contain the asyncio task that runs the worker
        self.task: asyncio.Task | None = None

    async def start(
        self,
        redis_host: str,
        redis_port: int,
        redis_password: str | None,
        _dependency_overrides: dict[Callable[..., Any], Callable[..., Any]],
        **kwargs,
    ):
        """
        Parameters:
        - redis_host: str
        - redis_port: int
        - redis_password: str
        - _dependency_overrides: dict[Callable[..., Any], Callable[..., Any]] a pointer to the app dependency overrides dict
        """

        class ArqWorkerSettings(WorkerSettingsBase):
            functions = [run_task]
            allow_abort_jobs = True
            # After a job is completed or aborted, we want arq to remove its result
            # to be able to queue a new task with the same id
            keep_result = 0
            keep_result_forever = False
            redis_settings = RedisSettings(
                host=redis_host,
                port=redis_port,
                password=redis_password or "",
            )

        # We pass handle_signals=False to avoid arq from handling signals
        # See https://github.com/python-arq/arq/issues/182
        self.worker = create_worker(
            ArqWorkerSettings,
            handle_signals=False,
            **kwargs,
        )
        # We run the worker in an asyncio task
        self.task = asyncio.create_task(self.worker.async_run())

        self._dependency_overrides = _dependency_overrides

        scheduler_logger.info("Scheduler started")

    async def close(self):
        # If the worker was started, we close it
        if self.worker is not None:
            await self.worker.close()

    async def queue_job_defer_to(
        self,
        job_function: Callable[..., Coroutine[Any, Any, Any]],
        job_id: str,
        defer_date: datetime,
        **kwargs,
    ):
        """
        Queue a job to execute job_function at defer_date
        job_id will allow to abort if needed
        """
        if self.worker is None:
            raise SchedulerNotStartedError

        job = await self.worker.pool.enqueue_job(
            "run_task",
            job_function=job_function,
            _job_id=job_id,
            _defer_until=defer_date,
            _dependency_overrides=self._dependency_overrides,
            **kwargs,
        )
        scheduler_logger.debug(f"Job {job_id} queued {job}")

    async def cancel_job(self, job_id: str):
        """
        cancel a queued job based on its job_id
        """
        if self.worker is None:
            raise SchedulerNotStartedError
        job = Job(job_id, redis=self.worker.pool)
        # We only want to abort the job if it exist
        # otherwise if we try to plan a job with the same id just after, we may get
        # a job aborted before being queued
        status = await job.status()
        if status != JobStatus.not_found:
            scheduler_logger.debug(f"Job being aborted {job}")
            await job.abort()
```


## Example of usage

You can get the `Scheduler` instance with a dependency injection like this:

```py
async def send_test_future_notification(
    # things
    scheduler: Scheduler = Depends(get_scheduler),
):
    """
    Example
    """
    pass
```

One common use case of the scheduler is to send a notification to users at a given time, we may also want to edit or defer a notification before it is sent.

Firstly, wa can look at the endpoint that allow us to send a test notification to ourselves in the future:

```py
@router.post(
    "/notification/test/send/future",
    status_code=204,
)
async def send_test_future_notification(
    user_id: str | None = None,
    user: models_users.CoreUser = Depends(is_user_in(GroupType.admin)),
    notification_tool: NotificationTool = Depends(get_notification_tool),
    scheduler: Scheduler = Depends(get_scheduler),
):
    """
    Send ourself a test notification.

    **Only admins can use this endpoint**
    """
    message = schemas_notification.Message(
        title="Test notification future",
        content="Ceci est un test de notification future",
        action_module="test",
    )
    await notification_tool.send_notification_to_users(
        user_ids=[user_id or user.id],
        message=message,
        defer_date=datetime.now(UTC) + timedelta(seconds=10),
        scheduler=scheduler,
        job_id="send_test_future_notification",
    )
```

This endpoint will call a method in the `NotificationTool` that will use the `Scheduler` to defer the sending of the notification to 10 seconds later:

```py
async def send_future_notification_to_users_defer_to(
        self,
        user_ids: list[str],
        message: Message,
        scheduler: Scheduler,
        defer_date: datetime,
        job_id: str,
    ):
        # We cancel the job if it is already queued to avoid having multiple jobs with the same id, which may cause multiple notifications to be sent if the endpoint is called multiple times in a short period of time
        await scheduler.cancel_job(job_id=job_id)
        # We queue the job
        await scheduler.queue_job_defer_to(
            self.notification_manager.send_notification_to_users,
            user_ids=user_ids,
            message=message,
            job_id=job_id,
            defer_date=defer_date,
        )
```

::: tip Parameters of the job_function

You may want to pass some parameters to the `job_function` that will be executed by the scheduler.
There is two ways to do it, either by passing them as keyword arguments in the `queue_job_defer_to` method.

```py
await scheduler.queue_job_defer_to(
    self.notification_manager.send_notification_to_users,
    user_ids=user_ids, # Args of the job_function
    message=message, # Args of the job_function
    job_id=job_id,
    defer_date=defer_date,
)
```

In that case please be careful to pass the `job_id` and `defer_date` as keyword arguments and not as positional arguments, otherwise they will be passed to the `job_function` instead of being used by the scheduler.

Or by using a lambda function to wrap the `job_function` and pass the parameters to it.

```py
await scheduler.queue_job_defer_to(
    lambda: self.notification_manager.send_notification_to_users(
        user_ids=user_ids,
        message=message,
    ),
    job_id=job_id,
    defer_date=defer_date,
)
```

:::
