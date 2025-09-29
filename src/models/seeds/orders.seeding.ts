import { Prisma } from "@prisma/client";
import { prisma } from "../index.js";
import { faker } from "@faker-js/faker";

async function main() {
  console.log("🚀 Seed start");

  // 1) Nettoyage (enfants -> parents)
  await prisma.token.deleteMany().catch(() => {});
  await prisma.orderLine.deleteMany().catch(() => {});
  await prisma.order.deleteMany().catch(() => {});
  await prisma.product.deleteMany().catch(() => {});
  await prisma.user.deleteMany().catch(() => {});
  await prisma.role.deleteMany().catch(() => {});

  // 2) Rôles
  const adminRole = await prisma.role.create({ data: { name: "admin" } });
  const userRole = await prisma.role.create({ data: { name: "member" } });

  // 3) Utilisateurs fixes (admin)
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
        is_active: true,
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
    skipDuplicates: true,
  });

  // 4) 200 users "member"
  const fakeUsers = Array.from({ length: 200 }).map(() => ({
    firstname: faker.person.firstName(),
    lastname: faker.person.lastName(),
    email: faker.internet.email().toLowerCase(),
    password: "$2b$10$KIXFakeHashForAllUsersXDlG93o7I7v/nmnyvT9flD1qFk",
    is_active: faker.datatype.boolean(),
    phone: faker.phone.number("+336########"),
    birthday: faker.date.birthdate({ min: 1960, max: 2005, mode: "year" }),
    last_login: faker.datatype.boolean()
      ? faker.date.recent({ days: 30 })
      : null,
    role_id: userRole.id,
  }));

  const seen = new Set();
  const deduped = fakeUsers.filter((u) => {
    if (seen.has(u.email)) return false;
    seen.add(u.email);
    return true;
  });

  for (let i = 0; i < deduped.length; i += 100) {
    await prisma.user.createMany({
      data: deduped.slice(i, i + 100),
      skipDuplicates: true,
    });
  }

  console.log(`👥 Users créés (member): ${deduped.length}`);

  // 5) Produits fixes (billets)
  const products = await prisma.product.createMany({
    data: [
      { name: "Adulte", price: 50, status: "published" },
      { name: "Etudiant", price: 40, status: "published" },
      { name: "Enfant", price: 30, status: "published" },
    ],
    skipDuplicates: true,
  });

  const productList = await prisma.product.findMany();
  console.log(`🎟️ Produits créés: ${productList.length}`);

  // 6) Commandes pour les 200 "member"
  const members = await prisma.user.findMany({
    where: { role_id: userRole.id },
    select: { id: true },
  });

  const paymentMethods = ["card", "cash", "paypal"];
  const ordersToCreate = [];

  for (const u of members) {
    const orderNb = faker.number.int({ min: 0, max: 3 }); // 0–3 commandes
    for (let i = 0; i < orderNb; i++) {
      const visit_date = faker.date.soon({ days: 60 });
      const status = faker.helpers.arrayElement([
        "pending",
        "confirmed",
        "canceled",
        "refund",
      ]);
      const vat = new Prisma.Decimal(
        faker.helpers.arrayElement(["05.50", "10.00", "20.00"])
      );
      const ticket_code = faker.string.alphanumeric(10).toUpperCase();
      const payment_method = faker.helpers.arrayElement(paymentMethods);

      const lineCount = faker.number.int({ min: 1, max: 4 });
      const chosenProducts = faker.helpers.arrayElements(
        productList,
        lineCount
      );

      const lines = chosenProducts.map((p) => ({
        unit_price: p.price,
        quantity: faker.number.int({ min: 1, max: 3 }),
        product_id: p.id,
      }));

      ordersToCreate.push({
        status,
        visit_date,
        vat,
        payment_method,
        user_id: u.id,
        ticket_code,
        lines,
      });
    }
  }

  console.log(`🧾 Commandes à créer: ${ordersToCreate.length}`);

  // Création en batch
  for (let i = 0; i < ordersToCreate.length; i += 50) {
    const batch = ordersToCreate.slice(i, i + 50);

    const createdOrders = await prisma.$transaction(
      batch.map((o) =>
        prisma.order.create({
          data: {
            status: o.status,
            visit_date: o.visit_date,
            vat: o.vat,
            payment_method: o.payment_method,
            user_id: o.user_id,
            ticket_code: o.ticket_code,
          },
          select: { id: true },
        })
      )
    );

    const allLines = [];
    batch.forEach((o, idx) => {
      const orderId = createdOrders[idx].id;
      o.lines.forEach((l) => {
        allLines.push({
          order_id: orderId,
          product_id: l.product_id,
          unit_price: l.unit_price,
          quantity: l.quantity,
        });
      });
    });

    if (allLines.length) {
      await prisma.orderLine.createMany({ data: allLines });
    }
  }

  const [ordersCount, linesCount] = await Promise.all([
    prisma.order.count(),
    prisma.orderLine.count(),
  ]);

  console.log(
    `✅ Seed OK — Orders: ${ordersCount} | OrderLines: ${linesCount}`
  );
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
