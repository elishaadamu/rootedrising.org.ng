const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const mappings = [
    { from: 'article', to: 'Articles' },
    { from: 'Article', to: 'Articles' },
    { from: 'poem', to: 'Poems' },
    { from: 'Poem', to: 'Poems' },
    { from: 'campaign', to: 'Campaigns' },
    { from: 'Campaign', to: 'Campaigns' },
    { from: 'story', to: 'Story' }
  ];

  for (const { from, to } of mappings) {
    const result = await prisma.post.updateMany({
      where: { section: from },
      data: { section: to }
    });
    if (result.count > 0) {
      console.log(`Updated ${result.count} posts from '${from}' to '${to}'.`);
    }
  }

  console.log('Database normalization complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
