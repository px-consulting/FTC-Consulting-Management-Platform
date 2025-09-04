"use client";

import { useState } from "react";

export default function YouTubePlayer({ videoId, className }) {
  const [play, setPlay] = useState(false);
  const thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  return (
    <div className={`relative aspect-video w-full ${className ?? ""}`}>
      {play ? (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlay(true)}
          className="absolute inset-0 h-full w-full"
          aria-label="Play video"
        >
          <img src={thumbnail} alt="Video thumbnail" className="h-full w-full object-cover" />
        </button>
      )}
    </div>
  );
}
