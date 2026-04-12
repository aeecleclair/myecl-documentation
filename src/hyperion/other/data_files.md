---
title: Data Files
order: 20
category:
  - Guide
---

# Data Files Guide

## Introduction

We've seen database data, but sometimes we need to store files that are not suitable for the database, such as images, documents, etc. This type of data is stored in `data/` directory.

**Assets** are static files that are used by the application, such as email templates, PDF templates, but also default images, etc. They are located in `assets/` directory.

::: danger Path transversal

When working with files, it's important to be careful with path transversal vulnerabilities, which can allow an attacker to access files outside of the intended directory. Always make sure to validate and sanitize any user input that is used to construct file paths.

:::

## Getting a data file

There are some utility functions such as `get_file_from_data` that can be used to get a file from the `data/` directory and one very useful is that this function can take a default asset as a fallback if the file is not found in the `data/` directory. These utilities ask for the filename that should be a UUID.

Example:

```py
@router.get(
    "/users/me/profile-picture",
    response_class=FileResponse,
    status_code=200,
)
async def read_own_profile_picture(
    user: models_users.CoreUser = Depends(is_user()),
):
    """
    Get the profile picture of the authenticated user.
    """

    return await get_file_from_data(
        directory="profile-pictures",
        filename=user.id,
        default_asset="assets/images/default_profile_picture.png",
    )
```

::: details get_file_from_data function

```py
async def get_file_from_data(
    directory: str,
    filename: str | UUID,
    default_asset: str | None = None,
) -> FileResponse:
    """
    If there is a file with the provided filename in the data folder, return it. The file extension will be inferred from the provided content file.
    > "data/{directory}/{filename}.ext"
    Otherwise, return the default asset.

    The filename should be a uuid.

    WARNING: **NEVER** trust user input when calling this function. Always check that parameters are valid.
    """
    path = await get_file_path_from_data(directory, filename, default_asset)

    return FileResponse(path)
```

:::

## Other utilities

`delete_file_from_data`
`save_file_as_data`
`save_bytes_as_data`
...
