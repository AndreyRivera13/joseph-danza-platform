import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'admin@josephdanza.local';
  await prisma.user.upsert({
    where: { email: adminEmail },
    create: { email: adminEmail, name: 'Admin', role: 'ADMIN' },
    update: {}
  });

  const categorias = [
    { name: 'Salsa', slug: 'salsa' },
    { name: 'Bachata', slug: 'bachata' },
    { name: 'Folclore', slug: 'folclore' }
  ];
  for (const c of categorias) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      create: c,
      update: {}
    });
  }

  const salsa = await prisma.category.findUnique({ where: { slug: 'salsa' } });
  const bachata = await prisma.category.findUnique({ where: { slug: 'bachata' } });

  await prisma.video.createMany({
    data: [
      {
        title: 'Salsa Básica - Pasos 1',
        description: 'Introducción a pasos básicos de salsa.',
        categoryId: salsa?.id ?? null,
        level: 'BASICO',
        published: true,
        muxPlaybackId: 'demo_salsa_1'
      },
      {
        title: 'Bachata Intermedio - Giros',
        description: 'Técnica de giros y conexión en bachata.',
        categoryId: bachata?.id ?? null,
        level: 'INTERMEDIO',
        published: true,
        muxPlaybackId: 'demo_bachata_1'
      }
    ]
  });

  console.log('Seed completo.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });