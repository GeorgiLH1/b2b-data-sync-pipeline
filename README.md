# AI-Powered B2B Data Sync Pipeline

A web application that synchronizes product data between two businesses (Business A and Business B) and uses AI to clean, sort, and describe that data.

The goal is to make work between companies faster and reduce human mistakes.

## Status

🚧 **Work in progress.** Nothing is working yet. This project is being built step by step, and this README will be updated as features are added.

## Planned features

- Fetch product data from the Business A API
- Fetch product data from the Business B API
- Check incoming data with strict rules and reject records that are invalid
- Use AI to find suspicious records (wrong, duplicate, or low-quality data) and give a reason
- Use AI to clean the data (fix text and categories)
- Check the AI's output again with rules before saving it
- Use AI to sort products into categories
- Use AI to write or improve product descriptions
- Save everything in a PostgreSQL database
- Keep a log of every sync, including errors
- Show results in a dashboard that users can use easily

## Tech stack (planned)

- **Backend:** Node.js, TypeScript, Express
- **Database:** PostgreSQL, Prisma
- **Frontend:** React
- **Tools:** Docker, Git