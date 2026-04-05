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
DB_SSLMODE=require
# Optional for strict SSL verification (RDS CA bundle path)
# DB_SSL_CA_PATH=/etc/ssl/rds-ca.pem
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

## GitHub Actions Deploy to AWS ECS

Workflow file: `.github/workflows/deploy-ecs.yml`

Required repository Variables:

- `AWS_REGION` (example: `ap-south-1`)
- `ECR_REPOSITORY` (example: `nestjs-postgres-hello`)
- `ECS_CLUSTER` (example: `prod-cluster`)
- `ECS_SERVICE` (example: `nestjs-service`)
- `ECS_TASK_DEFINITION_FAMILY` (example: `nestjs-task`)
- `ECS_CONTAINER_NAME` (container name inside ECS task definition)

Required repository Secret:

- `AWS_ROLE_TO_ASSUME` (IAM Role ARN for GitHub OIDC)

The workflow does this on push to `main`:

1. Builds Docker image
2. Pushes image to ECR
3. Pulls current ECS task definition
4. Registers and runs a one-off ECS task for `npm run migration:run`
5. Replaces container image in service task definition
6. Deploys updated task definition to ECS service

For migration execution, ensure the ECS task definition has permissions and network access to reach the database.