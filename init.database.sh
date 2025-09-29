#!/bin/bash

set -e  # le script s'arrête dès qu'une commande renvoie une erreur

echo ">> Resetting database migrations..."
if docker exec -it zombieland-api npm run db:migrate:reset; then
  echo "Reset OK"
else
  echo "Reset failed"
  exit 1
fi

echo ">> Running development migrations..."
if docker exec -it zombieland-api npm run db:migrate:dev; then
  echo "Migrations OK"
else
  echo "Migrations failed"
  exit 1
fi

echo ">> Generating database files..."
if docker exec -it zombieland-api npm run db:generate; then
  echo "Generate OK"
else
  echo "Generate failed"
  exit 1
fi

echo ">> Generating Prisma client..."
if npx prisma generate --schema=./src/models/schema.prisma; then
  echo "Prisma client generated"
else
  echo "Prisma generate failed"
  exit 1
fi

echo ">> Seeding the database..."
if docker exec -it zombieland-api npm run db:seed:orders; then
  echo "Seed OK"
else
  echo "Seed failed"
  exit 1
fi

echo ">> Seeding the database..."
if docker exec -it zombieland-api npm run db:seed:activities; then
  echo "Seed OK"
else
  echo "Seed failed"
  exit 1
fi


echo "Database initialization complete."
