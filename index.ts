import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not set');
}

const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Running query...');
  const user = await prisma.user.create({
    data: {
      name: 'Alice',
      email: `alice_${Date.now()}@prisma.io`, // unique email
      password: 'password123', // schema requires password
    },
  });

  console.log('User created:', user);
  
  const users = await prisma.user.findMany();
  console.log('All Users:', users);
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });
