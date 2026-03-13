import prisma from './lib/prisma';

async function test() {
  try {
    const users = await prisma.user.findMany();
    console.log('Users:', users);
  } catch (err) {
    console.error('Error:', err);
  }
}

test();
