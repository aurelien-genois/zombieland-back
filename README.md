<img src="./public/images/logo.png"
     alt="Logo"
     style="width: 40%" />

# ZombieLandCDA - Backend (REST API)

## 🧟‍♂️ Introduction

The **ZombieLand** application modernizes amusement park management by offering a secure web platform.
It provides an attractive presentation of the park to appeal to young audiences and families while strengthening its national reputation.
Finally, it centralizes ticketing and simplifies online booking, reducing the staff’s workload.

## ⚙️ Technologies

- Node.js v22.18.0
- TypeScript v5.9.2
- Express.js v5.1.0
- Prisma v6.16.1
- Docker v28.3.2
- Swagger v6.2.8
- Stripe v18.5.0

## 🚀 Getting Started

## Docker: **_Run Containers_**

1. **Build and start the container**

   ```bash
   npm run docker:up
   ```

2. **Start in development mode (Hot Reload)**

   ```bash
   npm run docker:up:fast
   ```

## Update BDD Locally

1. **Generate Prisma Client**

   ```bash
   npm run db:generate
   ```

2. **Delete Docker volume (prevent errors with Prisma migrations)**

   ```bash
   docker volume rm zombielandcda-back_zombieland
   ```

## Inside the Container **_Run Prisma_**

1-4 **script reset + generate + seeds**

```bash
npm run docker:db:init
```

1. **Reset the Prisma database**

   ```bash
   npm run docker:db:reset
   ```

2. **Run migrations in development**

   ```bash
   npm run docker:db:migrate:dev
   ```

3. **Generate the Prisma client**

   ```bash
   npm run docker:db:generate
   ```

4. **Seed the database with a user**

   ```bash
   npm run docker:db:seed:orders
   npm run docker:db:seed:activities
   ```

# 🧪 Application Testing

## Unit Tests

```bash
npm run test:unit
```

## Integration Test (spec)

```bash
npm run test:spec
```

### ⚠️ In Case of Errors

Stop the Docker container manually:

```bash
docker stop <container_id_or_name>
docker rm <container_id_or_name>
```

# 📖 API Documentation

The interactive API documentation is available via **Swagger UI**:

👉 [http://localhost:3000/api/api-docs/](http://localhost:3000/api/api-docs/)
