import prisma from '@/lib/prisma';
import Hero from '@/components/Hero';
import CarouselRow from '@/components/CarouselRow';

export const dynamic = 'force-dynamic';

export default async function CatalogPage() {
  try {
    const videos = await prisma.video.findMany({
      where: { published: true },
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });

    if (!videos.length) {
      return (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Catálogo</h2>
          <p className="text-zinc-400">No hay videos publicados aún.</p>
        </div>
      );
    }

    const heroRaw = videos[0]!; // ← no puede ser undefined tras el guard

    const hero = {
      id: heroRaw.id,
      title: heroRaw.title,
      description: heroRaw.description ?? null,
      muxPlaybackId: heroRaw.muxPlaybackId ?? null,
    };

    const novedades = videos.slice(0, 12);
    const basico = videos.filter((v) => v.level === 'BASICO').slice(0, 18);
    const intermedio = videos.filter((v) => v.level === 'INTERMEDIO').slice(0, 18);
    const avanzado = videos.filter((v) => v.level === 'AVANZADO').slice(0, 18);

    const byCategory = new Map<string, typeof videos>();
    for (const v of videos) {
      const key = v.category?.name ?? 'Otros';
      if (!byCategory.has(key)) byCategory.set(key, []);
      byCategory.get(key)!.push(v);
    }

    return (
      <div className="space-y-10">
        <Hero video={hero} />

        <CarouselRow title="Novedades" videos={novedades} />
        <CarouselRow title="Nivel básico" videos={basico} />
        <CarouselRow title="Nivel intermedio" videos={intermedio} />
        <CarouselRow title="Nivel avanzado" videos={avanzado} />

        {[...byCategory.entries()].map(([cat, items]) => (
          <CarouselRow key={cat} title={cat} videos={items.slice(0, 18)} />
        ))}
      </div>
    );
  } catch (e) {
    console.error(e);
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Catálogo</h1>
        <p className="text-red-500">No fue posible cargar el catálogo.</p>
      </div>
    );
  }
}