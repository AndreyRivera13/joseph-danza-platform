import Image from 'next/image';
import Link from 'next/link';

type Props = {
  video: {
    id: string;
    title: string;
    description?: string | null;
    muxPlaybackId?: string | null;
  };
};

const isValidMuxId = (id?: string | null) =>
  !!id && id.length > 10 && !id.startsWith('demo_');

const muxPoster = (playbackId?: string | null, w = 1600, h = 900) =>
  isValidMuxId(playbackId)
    ? `https://image.mux.com/${playbackId}/thumbnail.webp?time=1&width=${w}&height=${h}&fit_mode=preserve`
    : `https://picsum.photos/${w}/${h}`;

export default function Hero({ video }: Props) {
  const poster = muxPoster(video.muxPlaybackId);

  return (
    <section className="relative mb-8 overflow-hidden rounded-xl bg-black">
      <div className="relative aspect-[16/9] w-full">
        <Image
          src={poster}
          alt={video.title}
          fill
          className="object-cover opacity-80"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6 md:p-10 text-white max-w-2xl">
          <h1 className="text-2xl md:text-4xl font-bold">{video.title}</h1>
          {video.description ? (
            <p className="mt-3 line-clamp-3 text-white/80">{video.description}</p>
          ) : null}
          <div className="mt-6 flex gap-3">
            <Link
              href={`/video/${video.id}`}
              className="inline-flex items-center rounded-md bg-white px-4 py-2 font-semibold text-black hover:bg-white/90"
            >
              Reproducir
            </Link>
            <Link
              href="/catalog"
              className="inline-flex items-center rounded-md bg-white/10 px-4 py-2 font-semibold text-white hover:bg-white/20"
            >
              Ver más
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}