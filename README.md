# AI-Powered B2B Data Sync Pipeline

A web application that synchronizes product data between two businesses (Business A and Business B) and uses AI to clean, sort, and describe that data.

The goal is to make work between companies faster and reduce human mistakes.

# AI-Powered B2B Data Sync Pipeline

A web application that synchronizes product data between two businesses (Business A and Business B) and uses AI to clean, sort, and describe that data.

The goal is to make work between companies faster and reduce human mistakes.

## Status

🚧 **Work in progress.** Phase 1 is complete (project setup, TypeScript basics, unit tests). The API, database, sync logic, AI features, and dashboard are not built yet. This README is updated as features are added.

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
    products.ts        # product validation and cleaning rules
    products.test.ts   # unit tests for those rules
```

## Getting started

Requirements: Node.js 22 or newer, and npm.

```bash
cd backend
npm install
npm test
```

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
