'use client';

import '@mux/mux-player/themes/classic.css';
import 'media-chrome/dist/media-chrome.css';
import { MuxPlayer } from '@mux/mux-player-react';

export default function Player({ playbackId }: { playbackId: string }) {
  return (
    <div className="w-full aspect-video rounded-lg overflow-hidden bg-black">
      <MuxPlayer
        streamType="on-demand"
        playbackId={playbackId}
        autoPlay={false}
        controls
        theme="classic"
        accentColor="#7a4dff"
      />
    </div>
  );
}