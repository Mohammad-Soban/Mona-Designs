// HeroVideo.tsx
import React from "react";

const HeroVideo = () => (
  <section className="w-full h-[60vh] flex items-center justify-center bg-black">
    <video
      src="/static/hero_video.mp4"
      autoPlay
      loop
      muted
      playsInline
      className="w-full h-full object-cover rounded-lg shadow-lg"
    />
  </section>
);

export default HeroVideo;
