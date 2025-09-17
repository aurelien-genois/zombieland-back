import { prisma } from "./index.js";

async function main() {
  await prisma.token.deleteMany();
  await prisma.user.deleteMany();
  await prisma.role.deleteMany();

  const adminRole = await prisma.role.create({
    data: { name: "admin" },
  });
  const userRole = await prisma.role.create({
    data: { name: "user" },
  });

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

  console.log("4 users inserted !");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
