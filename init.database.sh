    #!/bin/bash

    echo ">> Resetting database migrations..."
    docker exec -it zombieland-api npm run db:migrate:reset

    echo ">> Running development migrations..."
    docker exec -it zombieland-api npm run db:migrate:dev

    echo ">> Generating database files..."
    docker exec -it zombieland-api npm run db:generate

    echo ">>Seeding the database..."
    docker exec -it zombieland-api npm run db:seed

    echo ">> Generating Prisma client..."
    npx prisma generate --schema=./src/models/schema.prisma

    echo ">> Database initialization complete."