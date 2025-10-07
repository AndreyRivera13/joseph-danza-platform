import { NextRequest, NextResponse } from 'next/server';
import Mux from '@mux/mux-node';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'INSTRUCTOR')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { title, description, categoryId, level } = await req.json();

  const muxTokenId = process.env.MUX_TOKEN_ID!;
  const muxTokenSecret = process.env.MUX_TOKEN_SECRET!;
  const mux = new Mux({ tokenId: muxTokenId, tokenSecret: muxTokenSecret });

  const video = await prisma.video.create({
    data: {
      title,
      description,
      categoryId: categoryId ?? null,
      level: level ?? 'BASICO',
      published: false,
      instructorId: undefined
    }
  });

  const upload = await mux.video.uploads.create({
    cors_origin: process.env.NEXT_PUBLIC_APP_URL || '*',
    new_asset_settings: {
      playback_policy: ['public'],
      passthrough: video.id
    }
  });

  return NextResponse.json({
    uploadUrl: upload.url,
    uploadId: upload.id,
    videoId: video.id
  });
}