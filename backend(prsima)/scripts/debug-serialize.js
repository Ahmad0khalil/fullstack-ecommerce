import 'dotenv/config';
import { prisma } from '../lib/prisma.js';
import { serialize } from '../utils/serialize.js';

async function main() {
  const product = await prisma.product.findFirst({
    include: { category: { select: { name: true } } },
  });
  console.log('created_at type:', typeof product.created_at, product.created_at?.constructor?.name);
  console.log('is Date:', product.created_at instanceof Date);
  console.log('serialized product:', JSON.stringify(serialize({
    ...product,
    category_name: product.category?.name ?? null,
    category: undefined,
  }), null, 2));
  await prisma.$disconnect();
}

main();
