import "dotenv/config";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Inserts 3 sample Contact rows with created_at timestamps spread across
 * the past two weeks so the new Contacts page has something to render.
 *
 * Picks the first user in the DB so the test data attaches to whoever is
 * actively using the admin panel.
 */
async function main() {
  const user = await prisma.user.findFirst({
    orderBy: { id: "asc" },
  });

  if (!user) {
    console.error("No user found in DB — cannot seed contacts.");
    process.exit(1);
  }

  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;

  const rows = [
    {
      name: "Aisha Khan",
      email: "aisha.khan@example.com",
      subject: "Interested in collaborating on an ML project",
      message:
        "Hi! I came across your portfolio through your dashboard analytics writeup. " +
        "I'm working on a recommendation engine and would love to chat about the " +
        "approach you used for your last project. Let me know if you have 20 minutes " +
        "this week.",
      is_read: false,
      created_at: new Date(now - 1 * day),
    },
    {
      name: "Daniel Pereira",
      email: "daniel.p@studio-northwind.io",
      subject: "Freelance opportunity — backend (Node + Prisma)",
      message:
        "We're a small product studio looking for a backend dev to help finish a " +
        "Prisma + Postgres migration. Project is roughly 4-6 weeks, fully remote, " +
        "and pays at top-of-market rates. Your work on PortOS looks exactly like " +
        "what we need. Available for a call?",
      is_read: true,
      created_at: new Date(now - 5 * day),
    },
    {
      name: "Mei Tanaka",
      email: "mei@hellomei.dev",
      subject: "Question about your auth setup",
      message:
        "Hey, big fan of the soft-delete pattern you wrote about. Quick question: " +
        "how are you handling the refresh-token rotation when the browser is offline? " +
        "I tried a similar setup last month and ran into a race condition between " +
        "the focus listener and the refresh interceptor.",
      is_read: false,
      created_at: new Date(now - 12 * day),
    },
  ];

  for (const row of rows) {
    await prisma.contact.create({
      data: {
        user_id: user.id,
        ...row,
      },
    });
  }

  console.log(
    `Seeded ${rows.length} contact(s) for user "${user.email}" (id ${user.id}).`
  );
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
