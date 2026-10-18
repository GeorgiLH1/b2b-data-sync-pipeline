# AI-Powered B2B Data Sync Pipeline

A web application that synchronizes product data between two businesses (Business A and Business B) and uses AI to clean, sort, and describe that data.

The goal is to make work between companies faster and reduce human mistakes.

## Status

🚧 **Work in progress.** Phases 1 and 2 are complete (project setup, TypeScript basics, unit tests, API). Database, sync logic, AI features, and dashboard are not built yet.

## API

The backend runs on port 3000 by default (`npm run dev` in the `backend` folder).

| Method | Path                | Description                                           |
| ------ | ------------------- | ----------------------------------------------------- |
| GET    | `/api/health`       | Health check                                          |
| GET    | `/api/products`     | List products (optional `?category=` filter)          |
| GET    | `/api/products/:id` | One product (400 for an invalid id, 404 if not found) |

Unknown routes return `404` and unexpected errors return `500`, both as JSON.

## Configuration

Settings are read from environment variables and validated at startup.

| Variable   | Default       | Description                                |
| ---------- | ------------- | ------------------------------------------ |
| `PORT`     | `3000`        | Port the server listens on (1 to 65535)    |
| `NODE_ENV` | `development` | One of `development`, `test`, `production` |

## Planned features

- Fetch product data from the Business A API
- Fetch product data from the Business B API
- Check incoming data with strict rules and reject records that are invalid
- Use AI to find suspicious records (wrong, duplicate, or low-quality data) and give a reason
- Use AI to clean the data (fix text and categories)
- Check the AI's output again with rules before saving it
- Use AI to write or improve product descriptions
- Save everything in a PostgreSQL database
- Keep a log of every sync, including errors
- Show results in a dashboard that users can use easily

## Tech stack (planned)

- **Backend:** Node.js, TypeScript, Express
- **Database:** PostgreSQL, Prisma
- **Frontend:** React
- **Tools:** Docker, Git, Vitest, Prettier

## Project structure

```text
backend/
  src/
    server.ts            # starts the server (reads config, listens on a port)
    app.ts               # the Express app: routes and middleware
    config.ts            # validates settings from environment variables
    middleware.ts        # JSON 404 and 500 handlers
    products.ts          # product validation and cleaning rules
    routes/
      products.ts        # /api/products endpoints
    *.test.ts            # unit and API tests
```

## Getting started

Requirements: Node.js 22 or newer, and npm.

```bash
cd backend
npm install
npm test
npm run dev
```

The API is then available at http://localhost:3000/api/health

## Development commands

Run these in the `backend` folder:

| Command                | What it does                                 |
| ---------------------- | -------------------------------------------- |
| `npm test`             | Runs the unit tests once                     |
| `npm run test:watch`   | Reruns the tests when files change           |
| `npm run typecheck`    | Checks the TypeScript types                  |
| `npm run format`       | Formats the code with Prettier               |
| `npm run format:check` | Checks the formatting without changing files |

Before every commit, `npm test`, `npm run typecheck`, and `npm run format:check` should all pass.

## Decisions

- **Validation and cleaning are separate.** `isValid` only checks a record, and `cleanProduct` fixes cosmetic problems such as extra spaces. A product with spaces around its title is valid and gets cleaned, not rejected.
- **Rules first, AI second.** Plain code rejects obviously broken data. AI handles judgment tasks, and its output is checked by code again before saving.
- **No ESLint yet.** `typescript-eslint` does not support TypeScript 7 at the time of writing. It will be added when it does.
