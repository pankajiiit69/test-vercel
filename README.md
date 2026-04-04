# NestJS + TypeORM PostgreSQL Check

Minimal NestJS app to validate PostgreSQL access against a `users` table using TypeORM.

## Environment Variables

Create a `.env` file in the project root with:

```bash
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=postgres
DB_SYNCHRONIZE=false
```

## Run

```bash
npm install
npm run start:dev
```

## Migrations

Create a new blank migration:

```bash
npm run migration:create
```

Generate migration from entity changes:

```bash
npm run migration:generate
```

Run pending migrations:

```bash
npm run migration:run
```

Revert last migration:

```bash
npm run migration:revert
```

## Endpoints

- `GET /` -> hello world response
- `GET /users/check-db` -> checks DB access and returns users count