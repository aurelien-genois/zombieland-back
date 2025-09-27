import { prisma } from "./index.js";
import { faker } from "@faker-js/faker";

async function main() {
  // Nettoyage de la base
  await prisma.token.deleteMany();
  await prisma.user.deleteMany();
  await prisma.role.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.category.deleteMany();
  await prisma.product.deleteMany();

  // Création des rôles
  const adminRole = await prisma.role.create({
    data: { name: "admin" },
  });
  const userRole = await prisma.role.create({
    data: { name: "member" },
  });

  // Création de quelques utilisateurs fixes
  await prisma.user.createMany({
    data: [
      {
        firstname: "Michel",
        lastname: "Zombie",
        email: "michel@zombie.com",
        password:
          "$2b$10$L1uJRrojE9mzjFfCmF43pOZAbltzzOG/.HSgbRAIFB4gBEYArzW7a",
        is_active: true,
        phone: "+33612345678",
        birthday: new Date("1995-05-12"),
        last_login: new Date(),
        role_id: adminRole.id,
      },
      {
        firstname: "Aurélien",
        lastname: "Zombie",
        email: "aurelien@zombie.com",
        password:
          "$2b$10$mOvf9oNbtRsuxoT5YLVhC.ZefQoa3IPtBgH963ixKHmWvUViZHnau",
        is_active: false,
        phone: "+33687654321",
        birthday: new Date("1990-10-22"),
        last_login: null,
        role_id: adminRole.id,
      },
      {
        firstname: "Loic",
        lastname: "Zombie",
        email: "loic@zombie.com",
        password:
          "$2b$10$96WSOMYdgeOKz1qIzjss9.R/2URXgtrTYQuZ/HitQEXM/zWmea/Mm",
        is_active: true,
        phone: "+33612345678",
        birthday: new Date("1995-05-12"),
        last_login: new Date(),
        role_id: adminRole.id,
      },
      {
        firstname: "Wilfried",
        lastname: "Zombie",
        email: "wilfried@zombie.com",
        password:
          "$2b$10$4kzwNfna84ImsKz04OrCnOeXdJPQBnpgfc1z4DmoxM/NZFOQKZ9si",
        is_active: true,
        phone: "+33612345678",
        birthday: new Date("1995-05-12"),
        last_login: new Date(),
        role_id: adminRole.id,
      },
    ],
  });

  // Génération de 200 utilisateurs avec faker
  const fakeUsers = Array.from({ length: 200 }).map(() => ({
    firstname: faker.person.firstName(),
    lastname: faker.person.lastName(),
    email: faker.internet.email(),
    password: "$2b$10$KIXFakeHashForAllUsersXDlG93o7I7v/nmnyvT9flD1qFk", // un mot de passe hashé par défaut
    is_active: faker.datatype.boolean(),
    phone: faker.phone.number("+336########"),
    birthday: faker.date.birthdate({ min: 1960, max: 2005, mode: "year" }),
    last_login: faker.datatype.boolean()
      ? faker.date.recent({ days: 30 })
      : null,
    role_id: userRole.id,
  }));

  await prisma.user.createMany({
    data: fakeUsers,
  });

  console.log("✅ Base peuplée avec 200 utilisateurs fake + comptes fixes");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
