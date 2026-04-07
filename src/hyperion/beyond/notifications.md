---
title: Notifications
order: 14
category:
  - Guide
---

# Notifications Guide

## Introduction

In the context of a mobile application, **push notifications** are really important to keep users engaged and informed about what is happening in the app.

In this guide, we will see how to send notifications to users using the `NotificationTool`.

## Push notifications

Push notifications are messages that are sent to users' devices even when they are not using the app.
There are a few things to keep in mind when sending push notifications. Firstly, Hyperion cannot send push notifications directly to users, it needs to use a third-party service like Firebase Cloud Messaging (FCM) or Apple Push Notification Service (APNS) to send push notifications to users' devices (In our case we will use the Firebase API which unifies the handling of both services). Secondly, in order to send push notifications to users, we need to have their device tokens, which are unique identifiers (given by Firebase) for each device that can receive push notifications.

The Firebase project can be managed through the Firebase Console to get the necessary credentials and so on.

## How it works

At each opening of the app (Titan), the app will send the device token (given by Firebase) to the backend (Hyperion) and Hyperion will store it in the database. Then, when we want to send a notification to a user, Hyperion will retrieve the device token of the user from the database and use it to send the notification to the user's device through the Firebase API which afterwards will deliver it to the user's device.

## Sending notifications

::: tip Deferring notifications

In this guide we will not see how to send notifications in the future, but it is possible to do so using the `Scheduler`, you can check the [Scheduler guide](./scheduler.md) to see how to do it.

:::

There is two ways to send notifications to users. Either by sending the notification to a list of user ids, or by sending the notification to a topic (a topic is a group of users that have subscribed to it).

### Sending notifications to a list of user ids

To send a notification to a list of user ids, we can use the `send_notification_to_users` method of the `NotificationTool`:

```py
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

::: details More in depth explanation of the code

We will see the code of `notification_tool.send_notification_to_users`

```py
async def send_notification_to_users(
        self,
        user_ids: list[str],
        message: Message,
        scheduler: Scheduler | None = None,
        defer_date: datetime | None = None,
        job_id: str | None = None,
    ):
        if defer_date is not None and scheduler is not None and job_id is not None:
            await self.send_future_notification_to_users_defer_to(
                user_ids=user_ids,
                message=message,
                scheduler=scheduler,
                defer_date=defer_date,
                job_id=job_id,
            )
        else:
            self.background_tasks.add_task(
                self.notification_manager.send_notification_to_users,
                user_ids=user_ids,
                message=message,
                db=self.db,
            )
```

In this code, we check if the `defer_date`, `scheduler` and `job_id` parameters are provided, if they are, we call the `send_future_notification_to_users_defer_to` method which will use the `Scheduler` to defer the sending of the notification to the given date. Otherwise, we send the notification immediately using background tasks.

Then we can look at the `send_future_notification_to_users_defer_to` method:

```py
async def send_future_notification_to_users_defer_to(
        self,
        user_ids: list[str],
        message: Message,
        scheduler: Scheduler,
        defer_date: datetime,
        job_id: str,
    ):
        await scheduler.cancel_job(job_id=job_id)
        await scheduler.queue_job_defer_to(
            self.notification_manager.send_notification_to_users,
            user_ids=user_ids,
            message=message,
            job_id=job_id,
            defer_date=defer_date,
        )
```

Nothing really special here, we just use the `queue_job_defer_to` method of the `Scheduler` to defer the sending of the notification to the given date. We also cancel the job if it is already queued to avoid having multiple jobs with the same id.

Then the `send_notification_to_users's code:

```py
async def send_notification_to_users(
    self,
    user_ids: list[str],
    message: Message,
    db: AsyncSession,
) -> None:
    """
    Send a notification to a given user.
    This utils will find all devices related to the user and send a firebase "trigger" notification to each of them.
    This notification will prompt Titan to query the API to get the notification content.

    The "trigger" notification will only be send if firebase is correctly configured.
    """
    if not self.use_firebase:
        hyperion_error_logger.info(
            "Firebase is disabled, not sending notification.",
        )
        return

    # Get all firebase_device_token related to the user
    firebase_device_tokens = (
        await cruds_notification.get_firebase_tokens_by_user_ids(
            user_ids=user_ids,
            db=db,
        )
    )

    try:
        await self._send_firebase_push_notification_by_tokens(
            tokens=firebase_device_tokens,
            db=db,
            message_content=message,
        )
    except Exception as error:
        hyperion_error_logger.warning(
            f"Notification: Unable to send firebase notification to users {user_ids} with device: {error}",
        )
```

:::


### Topic-based notifications

Another useful way to send notifications is to send them to a topic, a topic is a group of users that have subscribed to it. This can be useful for example to send a notification to the users that have purchased a product at the AMAP and tell them that the product is now available (Not sure if we actually do this, but you understand the concept).

```py
@router.post(
    "/notification/test/send/topic",
    status_code=204,
)
async def send_test_notification_topic(
    user: models_users.CoreUser = Depends(is_user_in(GroupType.admin)),
    notification_tool: NotificationTool = Depends(get_notification_tool),
):
    """
    Send ourself a test notification.

    **Only admins can use this endpoint**
    """
    message = schemas_notification.Message(
        title="Test notification topic",
        content="Ceci est un test de notification topic",
        action_module="test",
    )
    await notification_tool.send_notification_to_topic(
        topic_id=notification_test_topic.id,
        message=message,
    )
```

::: info Topic

Here `notification_test_topic` is a topic that is harcoded in the code for testing purposes, but in a real case scenario, you have to create your own topic and manage the subscription of users to it. You can check the code of the `NotificationManager` to see how to do it.

Here is an example of the available methods for topic management:

- 
```py
register_new_topic(
        self,
        topic_id: UUID,
        name: str,
        module_root: str,
        topic_identifier: str | None,
        restrict_to_group_id: str | None,
        restrict_to_members: bool,
        db: AsyncSession,
    )
```
Note that user of the group_id will be by default subscribed to the topic.
- `unsubscribe_user_to_topic(topic_id, user_id, db)`
- `subscribe_user_to_topic(topic_id, user_id, db)`