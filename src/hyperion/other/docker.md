---
title: Docker
order: 12
category:
  - Guide
---

# Docker Guide

## Quick overview

Wikipedia defines [Docker](https://en.wikipedia.org/wiki/Docker_(software)) as:

> Docker is a set of products that uses operating system-level virtualization to deliver software in packages called containers. Docker automates the deployment of applications within lightweight containers, enabling them to run consistently across different computing environments.

The main goal of Docker is to solve the Developer's issue of **"it works on my machine"** by providing a **consistent environment** for the application to run, regardless of where it is deployed (e.g. on a developer's laptop or in production).

I'll not explain here how Docker works, we will just see how to use it in our project, but if you want to learn more about Docker, I recommend you to check out the [official documentation](https://docs.docker.com/).


## Dockerfile

A **Dockerfile** is a text file that contains a set of **instructions** to build a Docker image. See the Dockerfile as the __recipe of cake__, it contains all the steps to build the cake (the Docker image). Then the **CI/CD pipeline** will use this Dockerfile to build the Docker image and then push to a **Regisitry** (that can be see as a fridge where we can store our cakes) and then we can pull this image from the registry to run it in production (Yes we cannot eat a cake indefinitely but you understand the analogy).

I'll got through our Dockerfile and explain it.

```Dockerfile
# First we use a base image that contains Python 3.14 and uv (a fast alternative to pip) pre-installed,
# this way we don't have to install Python and uv ourselves, which makes the build faster and the image smaller.
FROM ghcr.io/astral-sh/uv:0.9.27-python3.14-trixie-slim

# Default number of workers; can be overridden at runtime with the WORKERS environment variable or in the compose file.
ENV WORKERS=1

# Update package list and install weasyprint dependencies
# We have to install weasyprint dependencies in the Docker image because we use weasyprint in our project to generate PDFs,
# and it requires some system dependencies to work. We could have used a base image that already contains these dependencies,
# but it would have been heavier, so we install only the necessary dependencies on top of our base image.
RUN apt-get update && apt-get install -y \
    weasyprint \
    && rm -rf /var/lib/apt/lists/*

# Set environment variables to optimize Python behavior in production
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV UV_COMPILE_BYTECODE=1

# We create a non-root user to run our application, this is a good security practice to avoid running the application as root,
# which can be dangerous if the application is compromised.
# We choose an arbitrary UID and GID that are not likely to be used by default on other systems (host machine) to avoid conflicts.
# Create non-root user early for better security
# Choose an id that is not likely to be a default one
RUN groupadd --gid 10101 hyperion && \
    useradd --uid 10101 --gid hyperion --shell /bin/bash --create-home hyperion

WORKDIR /hyperion

# First copy only the requirements to leverage Docker cache
COPY requirements.txt .

# Install dependencies using uv (way faster than pip)
RUN uv pip install --system --no-cache -r requirements.txt

# Then copy the rest of the application code
COPY alembic.ini .
COPY pyproject.toml .
COPY assets assets/
COPY migrations migrations/
COPY app app/

# Change ownership of the application directory to the hyperion user
# Otherwise, since we are running the application as the hyperion user,
# it won't have the necessary permissions to read the files in the application directory,
# which will cause the application to crash. By changing the ownership of the application directory to the hyperion user,
# we ensure that the hyperion user has the necessary permissions to read the files and run the application.
RUN chown -R hyperion:hyperion /hyperion

# Switch to non-root user
USER hyperion

# Expose port 8000
EXPOSE 8000

# Use fastapi cli as the entrypoint
# Use sh -c to allow environment variable expansion
ENTRYPOINT ["sh", "-c", "fastapi run --workers $WORKERS --host 0.0.0.0 --port 8000"]
```

::: tip Docker cache

Something very important that we have taken into account when writing our Dockerfile is to optimize it for caching. Docker builds the image layer by layer, and it caches each layer. If a layer has not changed since the last build, Docker will use the cached version of that layer instead of rebuilding it, which makes the build faster.

For example we have put the layer `COPY requirements.txt .`before the layer `COPY app app/` because the dependencies are less likely to change than the application code, so we can leverage the cache for the dependencies layer, which makes the build faster when we are just changing the application code. By the way, installing dependencies is usually the most time-consuming part of the build, so it has a huge impact and it's way better when docker can use the cache for this layer.
:::

## Docker Compose

Docker Compose is a tool that allows us to define and run multi-containers Docker applications. In the `compose.yml` file we can configure the application's **services**, **networks**, and **volumes**. In our project, we use Docker Compose to run our application with others services that it depends on, such as the database and Redis.

There is 2 compose files in our project, one for development and one for production. The main difference between the two is that the development compose file only start the database and Redis services, while the production compose file also starts the application service. So in development, we run the application locally on our machine and we use Docker Compose to run the database and Redis, while in production, we use Docker Compose to run the whole application with its dependencies.

::: tip A useful command for running the application in development

You can use the following command, note the `-f compose.dev.yml` flag to specify that we want to use the development compose file, and the `-d` flag to detach the containers since the database and Redis are running in the background.

```bash
docker compose -f compose.dev.yml up -d
```

