import Link from 'next/link';
import Image from 'next/image';

type Props = {
  id: string;
  title: string;
  level: string;
  thumbnailUrl?: string | null;
};

export default function VideoCard({ id, title, level, thumbnailUrl }: Props) {
  const thumb = thumbnailUrl || `https://image.mux.com/${id}/thumbnail.png?time=5`;

  return (
    <Link href={`/video/${id}`} className="group block border rounded-lg overflow-hidden hover:shadow-md transition">
      <div className="relative w-full aspect-video bg-gray-100">
        <Image src={thumb} alt={title} fill className="object-cover" />
      </div>
      <div className="p-3">
        <h3 className="font-semibold group-hover:text-brand-700">{title}</h3>
        <p className="text-sm text-gray-500">{level}</p>
      </div>
    </Link>
  );
}