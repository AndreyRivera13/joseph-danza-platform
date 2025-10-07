import { prisma } from '@/lib/prisma';
import VideoCard from '@/components/VideoCard';

export default async function CatalogPage() {
  const videos = await prisma.video.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    take: 24
  });

  return (
    <div className="grid gap-6">
      <h2 className="text-2xl font-bold">Catálogo</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {videos.map(v => (
          <VideoCard key={v.id} id={v.muxPlaybackId ?? v.id} title={v.title} level={v.level} thumbnailUrl={v.thumbnailUrl ?? undefined} />
        ))}
      </div>
    </div>
  );
}