const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const pamphlets = [
    {
      title: "World Day of Justice",
      image: "world-day-of-justice.png",
      content: "We believe in inclusion and equality 📍 <br> Let’s support the rights of equality for all.<br> Gender, racism, language barriers, culture and religion only make life beautiful in diversity.",
      url: "https://www.instagram.com/p/DGTL0qNCFPD/?igsh=MWdqZmpmczc4NG1raQ=="
    },
    {
      title: "Timber Or Tomorrow",
      image: "timber-tomorrow.png",
      content: "Join the fight against Deforestation!",
      url: "https://www.instagram.com/p/DGAYw0Dokae/?igsh=NGJ3ZThwM3lqYTNi"
    },
    {
      title: "Water not Oil",
      image: "water-not-oil.png",
      content: "How oil pollution leads to water scarcity for children in the Niger Delta...",
      url: "https://www.instagram.com/p/DEhPsijIVSb/?igsh=MWZwOTZnZnc0czFpcg=="
    }
  ];

  for (const p of pamphlets) {
    await prisma.pamphlet.upsert({
      where: { id: p.title.toLowerCase().replace(/ /g, '-') }, // just a fake ID for upsert, or better, use a findFirst
      update: p,
      create: {
        ...p,
        id: p.title.toLowerCase().replace(/ /g, '-')
      }
    });
  }

  console.log('Pamphlets seeded!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
