import { after, before, beforeEach } from "node:test";
import path from "node:path";
import { $ } from "zx";
import { Server } from "node:http";
import { app } from "../../src/app.js";
import { prisma } from "../../src/models/index.js";

console.log("=================================================");

// ================================================================================
// Objectif de ce fichier : mettre en place l'environnement des tests d'intégration

// === AVANT de lancer les test ===
// Créer une BDD de test (zombieland-test-db)
// Charger les variables d'environnement (.env.test) à l'aide du flag --env-file
// Créer les tables dans cette BDD de test (run les migrations)
// Lancer le serveur Express

// === Entre chaque test ===
// On vide les tables

// === APRES les tests ===
// Deconnecter le code de la BDD
// Eteindre le serveur Express
// Supprimer la BDD
// ================================================================================

// Serveur HTTP (de test)
let server: Server;

// Hook before : s'exécute une fois avant l'ensemble des tests
before(async () => {
  // Lancer la BDD via un docker compose
  const composeFileAbsolutePath = path.resolve(
    import.meta.dirname,
    "compose.test.yml"
  );
  await $`docker compose -f ${composeFileAbsolutePath} -p zombieland-test-db up -d`;
  await $`sleep 3`; // Attendre une petite seconde pour s'assurer qu'elle tourne bien

  // Créer les tables dans cette BDD
  const prismaSchemaAbsolutePath = path.resolve(
    import.meta.dirname,
    "../../src/models/schema.prisma"
  );
  await $`npx prisma db push --schema=${prismaSchemaAbsolutePath}`;

  console.log("===POUR TESTS===", process.env.PORT);
  // On lance un serveur de test
  server = app.listen(process.env.PORT);
});

// Hook beforeEach : s'exécute une fois avant chaque test
beforeEach(async () => {
  await truncateTables();
});

// Hook after : s'exécute une fois après l'ensemble des tests
after(async () => {
  // On éteint le serveur HTTP
  server.close();

  // On deconnecte la connexion à la BDD
  await prisma.$disconnect();

  // On éteint la base de données de test
  await $`docker compose -p zombieland-test-db down`;
});

async function truncateTables() {
  // https://stackoverflow.com/questions/3327312/how-can-i-drop-all-the-tables-in-a-postgresql-database
  await prisma.$executeRawUnsafe(`
    DO $$ DECLARE
      r RECORD;
    BEGIN
      FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
        EXECUTE 'TRUNCATE TABLE "' || r.tablename || '" RESTART IDENTITY CASCADE';
      END LOOP;
    END $$;
  `);
}
