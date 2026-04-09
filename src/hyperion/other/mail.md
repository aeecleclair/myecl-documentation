---
title: Mail
order: 17
category:
  - Guide
---

# Mail Guide

## Introduction

Wikipedia's definition:

> Electronic mail (usually shortened to email; alternatively hyphenated e-mail) is a method of transmitting and receiving digital messages using electronic devices over a computer network.

When we think of emails, we often think of sending them, but also receiving them.
Technically, it's two complete different things. Sending an email is a requested action, whereas receiving an email is a passive action, where we have no control over when we receive an email.

So in order to receive emails, we need to have an email server that will wait for incoming emails and then process them. In our case, we will not process incoming emails, but we will just send emails to users, so we can connect to an external email server (like Gmail, Outlook, etc) to send emails to users by using their SMTP (Simple Mail Transfer Protocol) server.

::: info SMTP Configuration

The SMTP configuration (host, port, username, password, etc) is stored in the environment variables.
If you want to test mails, you should provide the necessary SMTP configuration in your `.env` file.

:::

## Email formats

Emails can obviously contain raw text, but they can also contain HTML content, which allows us to have more control over the formatting of the email (e.g. adding images, links, etc).

For that purpose, we will use jinja2 templates to create the HTML content of the emails.

## Creating a mail template

::: info Templates are located in CalypSSO

If you want to create a mail template, you should create it in the CalypSSO repository, since it this repository is already setup for nodejs and it is easier to create static html/css files.

:::

Here is a quick template example:

```html
---
preheader: Welcome to @{{ _product_name }}! Please create your account.
---

<x-default>
  <x-button-card
    title="Welcome to @{{ _product_name }}!"
    url="@{{ creation_url }}"
    button="Create your account"
  >
    You have been invited to join @{{ _product_name }}! To complete your
    registration, please create your account by clicking the button below:
  </x-button-card>

  <x-spacer height="24px" />

  <x-button-card
    lang="fr"
    title="Bienvenue sur @{{ _product_name }} !"
    url="@{{ creation_url }}"
    button="Créer votre compte"
  >
    Tu as été invité à rejoindre @{{ _product_name }} ! Pour finaliser ton
    inscription, nous te prions de créer ton compte en cliquant sur le bouton
    ci-dessous :
  </x-button-card>
</x-default>
```

::: warning Availabilty in Hyperion

Note that a new version of CalypSSO needs to be released in order for the new template to be available in Hyperion, since the templates are loaded as a python package in Hyperion.

:::


## Sending an email to users

::: warning Background tasks

Please use background tasks to send emails, since sending an email can take some time (especially if the SMTP server is slow), and we don't want to block the thread during the sending of the email.

[FastAPI docs for Background Tasks](https://fastapi.tiangolo.com/tutorial/background-tasks/).

:::


```py

@router.post(
    # ...
)
async def create_user_by_user(
    # ...
    background_tasks: BackgroundTasks,
    settings: Settings = Depends(get_settings),
    mail_templates: calypsso.MailTemplates = Depends(get_mail_templates),
):
    """
    ...
    """

    if settings.SMTP_ACTIVE:
        # Here you should get your own template.
        mail = mail_templates.get_mail_account_exist()
        background_tasks.add_task(
            send_email, # A utility function.
            recipient="Some@email.com",
            subject="MyECL - your account already exists",
            content=mail, # The content of the email is the rendered template.
            settings=settings, # Settings contains the SMTP configuration.
        )
    # ...
```

Notice that the arguments of the `send_email` function are passed as arguments to the `add_task` method, and the `send_email` function will be called with these arguments in the background.

For a better comprehension you can have a look at the `send_email` function.

::: details send_email function

```py


def send_email(
    recipient: str | list[str],
    subject: str,
    content: str,
    settings: "Settings",
):
    """
    Send a html email using **starttls**.
    Use the SMTP settings defined in environments variables or the dotenv file.
    See [Settings class](app/core/settings.py) for more information
    """
    # Send email using
    # https://realpython.com/python-send-email/#option-1-setting-up-a-gmail-account-for-development
    # Prevent send email from going to spam
    # https://errorsfixing.com/why-do-some-python-smtplib-messages-deliver-to-gmail-spam-folder/

    if isinstance(recipient, str):
        recipient = [recipient]

    context = ssl.create_default_context()

    msg = EmailMessage()
    msg.set_content(content, subtype="html", charset="utf-8")
    msg["From"] = settings.SMTP_EMAIL
    msg["To"] = ";".join(recipient)
    msg["Subject"] = subject

    with smtplib.SMTP(settings.SMTP_SERVER, settings.SMTP_PORT) as server:
        server.starttls(context=context)
        server.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
        try:
            server.send_message(msg, settings.SMTP_EMAIL, recipient)
        except smtplib.SMTPRecipientsRefused:
            hyperion_error_logger.warning(
                f'Bad email adress: "{", ".join(recipient)}" for mail with subject "{subject}".',
            )
```
:::
