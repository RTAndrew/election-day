# Docker

Run backend, PostgreSQL, and frontend with Docker Compose.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and Docker Compose

## Quick start

From the project root:

```bash
docker compose up --build
```

- **Frontend:** http://localhost:3000  
- **Backend API:** http://localhost:8080  
- **PostgreSQL:** localhost:5432 (user: `election`, password: `election`, database: `election`)

## Services

| Service   | Port | Description                    |
|----------|------|--------------------------------|
| frontend | 3000 | Vite + TanStack Start (SSR)    |
| backend  | 8080 | Fastify API                    |
| db       | 5432 | PostgreSQL 16                  |

## Configuration

- Backend uses `DATABASE_URL` set in `docker-compose.yml` to connect to the `db` service.
- Frontend is built with `VITE_API_URL=http://localhost:8080/` so the browser can reach the API. To use a different API URL (e.g. production), set the `VITE_API_URL` build arg when building the frontend image.

## Commands

```bash
# Build and start in foreground
docker compose up --build

# Start in background
docker compose up -d --build

# View logs
docker compose logs -f

# Stop
docker compose down

# Stop and remove database volume
docker compose down -v
```
