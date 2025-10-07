import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Player from '@/components/Player';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

type Props = { params: { id: string } };

export default async function VideoPage({ params }: Props) {
  const session = await getServerSession(authOptions);

  const video = await prisma.video.findFirst({
    where: {
      OR: [{ id: params.id }, { muxPlaybackId: params.id }],
      published: true
    }
  });

  if (!video) notFound();

  const isStaff = session?.user?.role === 'ADMIN' || session?.user?.role === 'INSTRUCTOR';

  return (
    <div className="grid gap-6">
      <h1 className="text-2xl font-bold">{video.title}</h1>
      {video.muxPlaybackId ? (
        <Player playbackId={video.muxPlaybackId} />
      ) : (
        <div className="aspect-video bg-gray-200 rounded grid place-items-center">Procesando...</div>
      )}
      <p className="text-gray-700">{video.description}</p>
    </div>
  );
}