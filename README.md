# ZombieLandCDA-back

Sprint 1

## Migration Prisma

Si ajout/modification du "schema.prisma",
il faut lancer la commande dans le container "zombieland-api"
car seul ce container à accès à la BDD PostgreSql :

```sh
docker exec -it zombieland-api sh
/app # npm run db:migrate:dev
```

=> grâce à la synchronisation du volume Docker du container, le fichier de migration sera récupéré en local et pourra être versionné

## Debug docker

`docker logs zombieland-api`

## Erreurs de migrations Prisma

Prisma log dans la table `_prisma_migrations`
En cas d'erreur lire le log correspondant et modifier les fichiers sql de migration en conséquence

supprimer le volume du service zombieland-db
`docker volume rm zombielandcda-back_zombieland`
`docker volume ls` pour lister les volumes
