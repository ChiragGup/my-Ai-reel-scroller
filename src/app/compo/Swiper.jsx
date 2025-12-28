"use client";

import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel, Keyboard } from "swiper/modules";
import VideoCompo from "./VideoCompo";
import "swiper/css";

export default function VideoSwiper({ videos = [], onEdit, onDelete }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(false);

  // 🛡️ HARD SAFETY CHECK
  if (!Array.isArray(videos)) {
    console.error("❌ VideoSwiper expected array, got:", videos);
    return null;
  }

  if (videos.length === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center text-gray-400">
        No reels available
      </div>
    );
  }

  return (
    <Swiper
      direction="vertical"
      slidesPerView={1}
      mousewheel
      keyboard
      modules={[Mousewheel, Keyboard]}
      onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
      className="h-full w-full"
    >
      {videos.map((video, index) => (
        <SwiperSlide key={video._id} className="h-full">
          <VideoCompo
            video={video}
            isActive={index === activeIndex}
            soundEnabled={soundEnabled}
            setSoundEnabled={setSoundEnabled}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
