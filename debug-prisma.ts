import prisma from "./lib/prisma";

async function main() {
  console.log("Keys on prisma object:", Object.keys(prisma));
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
