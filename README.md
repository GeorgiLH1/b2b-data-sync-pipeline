# AI-Powered B2B Data Sync Pipeline

A web application that synchronizes product data between two businesses (Business A and Business B) and uses AI to clean, sort, and describe that data.

The goal is to make work between companies faster and reduce human mistakes.

## Status

🚧 **Work in progress.** Phases 1 to 3 are complete: project setup, tests, a working API, validated configuration, and a PostgreSQL database with Prisma. Fetching data from the businesses, the sync logic, AI features, and the dashboard are not built yet.

## Planned features

- Fetch product data from the Business A API
- Fetch product data from the Business B API
- Check incoming data with strict rules and reject records that are invalid
- Use AI to find suspicious records (wrong, duplicate, or low-quality data) and give a reason
- Use AI to clean the data (fix text and categories)
- Check the AI's output again with rules before saving it
- Use AI to write or improve product descriptions
- Keep a log of every sync, including errors
- Show results in a dashboard that users can use easily

Already done: products are stored in PostgreSQL and served through a REST API.

## Tech stack

- **Backend:** Node.js, TypeScript, Express, Zod (validation)
- **Database:** PostgreSQL 17 (in Docker), Prisma
- **Testing and quality:** Vitest, supertest, Prettier
- **Planned:** React dashboard, an AI model for cleaning and categorizing data

## Getting started

Requirements: Node.js 22 or newer, npm, and Docker Desktop.

```bash
# 1. Start the database (from the project root)
cp .env.example .env              # first time only, then set your own password
docker compose up -d

# 2. Set up and run the backend
cd backend
cp .env.example .env              # first time only, use the same password as above
npm install
npm run db:generate               # builds the typed database client
npm run db:migrate                # creates the tables
npm run db:seed                   # adds sample products
npm run dev                       # starts the API
```

On Windows PowerShell, use `Copy-Item` instead of `cp`.

The API is then available at http://localhost:3000/api/health

## API

The backend runs on port 3000 by default.

| Method | Path                | Description                                           |
| ------ | ------------------- | ----------------------------------------------------- |
| GET    | `/api/health`       | Health check                                          |
| GET    | `/api/products`     | List products (optional `?category=` filter)          |
| GET    | `/api/products/:id` | One product (400 for an invalid id, 404 if not found) |

Unknown routes return `404` and unexpected errors return `500`, both as JSON. Error responses never include internal details, which are only written to the server log.

## Database

PostgreSQL runs in a Docker container defined in `docker-compose.yml`. Data is kept in a Docker volume.

```bash
docker compose up -d       # start the database
docker compose ps          # check that it is running and healthy
docker compose down        # stop it (data is kept)
docker compose down -v     # stop it AND delete all data
```

The tables are described in `backend/prisma/schema.prisma`, and every change to them is recorded as a migration in `backend/prisma/migrations/`. Migrations are committed to git. The generated database client (`backend/src/generated/`) is not, and is rebuilt with `npm run db:generate`.

Current tables:

- `products`: `source` and `external_id` (together unique, so a later sync can update a product instead of duplicating it), `title`, `category`, `price` (exact decimal), and timestamps.

## Configuration

Settings are read from environment variables and validated at startup. The server refuses to start if a setting is missing or wrong.

| Variable       | Default       | Description                                                   |
| -------------- | ------------- | ------------------------------------------------------------- |
| `PORT`         | `3000`        | Port the server listens on (1 to 65535)                       |
| `NODE_ENV`     | `development` | One of `development`, `test`, `production`                    |
| `DATABASE_URL` | (required)    | PostgreSQL connection string, must start with `postgresql://` |

There are two local `.env` files, both ignored by git. Each has a committed `.env.example` template:

- project root `.env`: used by Docker Compose (`POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`, `POSTGRES_PORT`)
- `backend/.env`: used by the backend (`DATABASE_URL`), which must match the Docker settings

## Project structure

```text
docker-compose.yml          # PostgreSQL container
.env.example                # template for the Docker settings
backend/
  .env.example              # template for the backend settings
  prisma.config.ts          # Prisma tool configuration
  prisma/
    schema.prisma           # database tables
    migrations/             # history of database changes
  src/
    server.ts               # starts the server: reads config, connects, listens
    app.ts                  # builds the Express app from its dependencies
    config.ts               # validates settings from environment variables
    db.ts                   # creates the database client
    middleware.ts           # JSON 404 and 500 handlers
    products.ts             # product validation and cleaning rules
    products/
      repository.ts         # ProductRepository interface and Prisma implementation
      in-memory-repository.ts  # array-based implementation used in tests
    routes/
      products.ts           # /api/products endpoints
    scripts/
      seed.ts               # inserts sample products
    *.test.ts               # unit and API tests
```

## Development commands

Run these in the `backend` folder:

| Command                | What it does                                       |
| ---------------------- | -------------------------------------------------- |
| `npm run dev`          | Starts the API and restarts it when files change   |
| `npm test`             | Runs the tests once                                |
| `npm run test:watch`   | Reruns the tests when files change                 |
| `npm run typecheck`    | Checks the TypeScript types                        |
| `npm run format`       | Formats the code with Prettier                     |
| `npm run format:check` | Checks the formatting without changing files       |
| `npm run db:generate`  | Rebuilds the typed database client from the schema |
| `npm run db:migrate`   | Applies schema changes to the database             |
| `npm run db:seed`      | Inserts or updates sample products                 |

Before every commit, `npm test`, `npm run typecheck`, and `npm run format:check` should all pass.

## Decisions

- **Validation and cleaning are separate.** `isValid` only checks a record, and `cleanProduct` fixes cosmetic problems such as extra spaces. A product with spaces around its title is valid and gets cleaned, not rejected.
- **Rules first, AI second.** Plain code rejects obviously broken data. AI handles judgment tasks, and its output is checked by code again before saving.
- **Dependencies are passed in.** `loadConfig` receives the environment, and `createApp` receives a `ProductRepository`. Tests can then supply their own input or an in-memory repository, so they need no database and no real environment.
- **One source of truth for the database.** The Prisma schema defines the tables, and migrations record every change.
- **Prices are exact decimals** in the database (`NUMERIC(10,2)`), and converted to numbers only when sent through the API.
- **Prisma 7 (stable).** The newer 8.x line is still a release candidate and is not used.
- **No ESLint yet.** `typescript-eslint` does not support TypeScript 7 at the time of writing. It will be added when it does.
