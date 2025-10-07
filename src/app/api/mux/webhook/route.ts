import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (body?.type === 'video.asset.ready') {
    const assetId = body.data.id as string;
    const playbackId = body.data.playback_ids?.[0]?.id as string | undefined;
    const passthrough = body.data.passthrough as string | undefined;

    if (passthrough) {
      await prisma.video.update({
        where: { id: passthrough },
        data: {
          muxAssetId: assetId,
          muxPlaybackId: playbackId
        }
      });
    }
  }

  return NextResponse.json({ received: true });
}