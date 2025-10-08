'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';

type Video = {
  id: string;
  title: string;
  muxPlaybackId?: string | null;
};

type Props = {
  title: string;
  videos: Video[];
};

const isValidMuxId = (id?: string | null) =>
  !!id && id.length > 10 && !id.startsWith('demo_');

const muxThumb = (playbackId?: string | null, w = 400, h = 225) =>
  isValidMuxId(playbackId)
    ? `https://image.mux.com/${playbackId}/thumbnail.webp?time=1&width=${w}&height=${h}&fit_mode=preserve`
    : `https://picsum.photos/${w}/${h}`;

export default function CarouselRow({ title, videos }: Props) {
  const scroller = useRef<HTMLDivElement>(null);

  const scrollBy = (dx: number) => {
    scroller.current?.scrollBy({ left: dx, behavior: 'smooth' });
  };

  if (!videos?.length) return null;

  return (
    <section className="mb-8">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold">{title}</h2>
        <div className="hidden gap-2 md:flex">
          <button
            onClick={() => scrollBy(-800)}
            className="rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            aria-label="Anterior"
          >
            ‹
          </button>
          <button
            onClick={() => scrollBy(800)}
            className="rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            aria-label="Siguiente"
          >
            ›
          </button>
        </div>
      </div>

      <div
        ref={scroller}
        className="flex gap-3 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2"
      >
        {videos.map((v) => (
          <Link
            key={v.id}
            href={`/video/${v.id}`}
            className="group relative w-[56vw] sm:w-[36vw] md:w-[24vw] lg:w-[18vw] xl:w-[14vw] shrink-0 snap-start"
          >
            <div className="relative aspect-[16/9] overflow-hidden rounded-md bg-zinc-900">
              <Image
                src={muxThumb(v.muxPlaybackId)}
                alt={v.title}
                fill
                sizes="(max-width: 640px) 56vw, (max-width: 768px) 36vw, (max-width: 1024px) 24vw, (max-width: 1280px) 18vw, 14vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <p className="mt-2 truncate text-sm text-zinc-300 group-hover:text-white">
              {v.title}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}