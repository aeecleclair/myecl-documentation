---
title: Websockets
order: 15
category:
  - Guide
---


# Websockets

## Quick overview

### What are Websockets?

According to the Wikipedia definition,
> [WebSocket](https://en.wikipedia.org/wiki/WebSocket) is a computer communications protocol, providing a bidirectional communication channel over a single Transmission Control Protocol (TCP) connection. [...]
> WebSocket is distinct from HTTP used to serve most webpages. Although they are different, RFC 6455 states that WebSocket "is designed to work over HTTP ports 443 and 80 as well as to support HTTP proxies and intermediaries", making the WebSocket protocol compatible with HTTP. To achieve compatibility, the WebSocket handshake uses the HTTP Upgrade header to change from the HTTP protocol to the WebSocket protocol.

In simple terms, Websockets are a way to establish a persistent connection between a client and a server, allowing for real-time communication. The most well-known use case for Websockets is for chat applications, but other use cases including real-time data transmission or gaming are also common.

### Our use case for Websockets

Currently, we use Websockets for the "Chaine de rentrée (CdR)". During the CdR, new students go from stand to stand to discover the different associations of the school and purchase some goodies. Thus, there are many students who manage their stand through the web interface (Siarnaq) and they need to see updated information about the students who come to their stand in real-time, so we use Websockets to send this information to the clients in real-time.

::: info Future use cases?

We might use Websockets for other use cases in the future like an announcement system, the sg system, or even for the RAID/Challenge system.

:::

## How to use Websockets in Hyperion?

::: warning Multiple Workers

Keep in mind that Hyperion is using **multiple workers** in production, so if you want to use Websockets so a websocket connection can be handled by any worker, and thus a **broadcasting messages** is required to handle the communication between the workers. In our case, we use **Redis** as a message broker (in production).

:::

We have implemented the concept of **Room** to handle Websocket connections in Hyperion, a Room is a group of Websocket connections that can receive the same messages. For example, we have a Room called cdr which contains all the Websocket connections of the clients who are managing their stand during the CdR, so when we want to send a message to all the clients who are managing their stand, we just need to send a message to the cdr Room and all the clients in this Room will receive the message.

### Sending messages to clients in a Room

Let's look at this particular code:

```py
@module.router.patch(
    "/cdr/users/{user_id}/",
    status_code=204,
)
async def update_cdr_user(
    user_id: str,
    user_update: schemas_cdr.CdrUserUpdate,
    db: AsyncSession = Depends(get_db),
    seller_user: models_users.CoreUser = Depends(
        is_user_allowed_to([CdrPermissions.manage_cdr]),
    ),
    ws_manager: WebsocketConnectionManager = Depends(get_websocket_connection_manager),
    mail_templates: calypsso.MailTemplates = Depends(get_mail_templates),
    settings: Settings = Depends(get_settings),
):

    # [...]

    cdr_status = await get_core_data(coredata_cdr.Status, db)
    if cdr_status.status == CdrStatus.onsite:
        try:
            await ws_manager.send_message_to_room(
                message=schemas_cdr.UpdateUserWSMessageModel(
                    data=schemas_cdr.CdrUser(
                        curriculum=curriculum,
                        school_id=user_db.school_id,
                        account_type=user_db.account_type,
                        name=user_db.name,
                        firstname=user_db.firstname,
                        nickname=user_db.nickname,
                        id=user_db.id,
                        promo=user_db.promo,
                        email=user_db.email,
                        birthday=user_db.birthday,
                        phone=user_db.phone,
                        floor=user_db.floor,
                    ),
                ),
                room_id=HyperionWebsocketsRoom.CDR,
            )
        except Exception:
            hyperion_error_logger.exception(
                f"Error while sending a message to the room {HyperionWebsocketsRoom.CDR}",
            )
```

So we are getting the `WebsocketConnectionManager` through dependency injection and then we are using the `send_message_to_room` method to send a message to all the clients in the cdr Room.

The `HyperionWebsocketsRoom.CDR` is hardcoded on the websocket file like this:

```py
class HyperionWebsocketsRoom(str, Enum):
    CDR = "5a816d32-8b5d-4c44-8a8d-18fd830ec5a8"
```

You can create as many Rooms as you want, just make sure to use a unique id for each Room.

Note that the message must be of the type `WSMessageModel`:
```py
class WSMessageModel(BaseModel):
    command: str
    data: Any
```
data can be any data that you want to send to the clients, but it must be serializable to JSON since Websockets only support text messages.

### Receiving messages from clients in a Room

::: warning TODO

Currently, this feature is not implemented in Hyperion.

:::

### Managing Websocket connections

We have seen how to send messages to clients in a Room, but now we should see how to manage Websocket connections, for example, how to add a client to a Room or how to remove a client from a Room.

We have a utility function which managed all this logic for us, it's called `manage_websocket`.
For example in the case of the CdR, we have this endpoint to manage the Websocket connections.
```py
@module.router.websocket("/cdr/users/ws")
async def websocket_endpoint(
    websocket: WebSocket,
    ws_manager: WebsocketConnectionManager = Depends(get_websocket_connection_manager),
    db: AsyncSession = Depends(get_unsafe_db),
    settings: Settings = Depends(get_settings),
):
    await ws_manager.manage_websocket(
        websocket=websocket,
        settings=settings,
        room=HyperionWebsocketsRoom.CDR,
        db=db,
    )
```

It will add the websocket connection to the cdr Room and it will also handle the disconnection of the websocket connection when the client disconnects (and close the connection).

::: warning get_unsafe_db

This endpoint is one of the only endpoints in Hyperion that uses the `get_unsafe_db` dependency, which means that the database connection will not be closed automatically after the request is done, and thus the database connection will be closed when the websocket connection is closed.

:::

## Conclusion

Websockets are a powerful tool to establish a persistent connection between a client and a server, allowing for real-time communication. In Hyperion, we have implemented the concept of Room to handle Websocket connections and we have a utility function to manage Websocket connections. We currently use Websockets for the CdR, but the future is yours.

