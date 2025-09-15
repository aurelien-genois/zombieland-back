import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

async function main() {
  await prisma.user.createMany({
    data: [
      {
        firstname: "Alice",
        lastname: "Dupont",
        email: "alice.dupont@example.com",
        password: "hashed_password_1",
        is_active: true,
        phone: "+33612345678",
        birthday: new Date("1995-05-12"),
        last_login: new Date(),
      },
      {
        firstname: "Bob",
        lastname: "Martin",
        email: "bob.martin@example.com",
        password: "hashed_password_2",
        is_active: false,
        phone: "+33687654321",
        birthday: new Date("1990-10-22"),
        last_login: null,
      },
    ],
  });

  console.log("✅ 2 users inserted !");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
