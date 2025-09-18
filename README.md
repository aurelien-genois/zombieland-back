# ZombieLandCDA-back

### Docker: **_Run Containers_**

1. **Build and start the container**

   ```bash
   npm run docker:up
   ```

2. **Start in development mode (Hot Reload)**

   ```bash
   npm run docker:up:fast
   ```

### Inside the Container: **_Run Prisma_**

1. **Reset the Prisma database**

   ```bash
   npm run docker:db:migrate:reset
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
   npm run docker:db:seed
   ```
