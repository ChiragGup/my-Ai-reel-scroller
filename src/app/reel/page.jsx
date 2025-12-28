"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import VideoSwiper from "../compo/Swiper";

export default function ReelUI() {
  const [videos, setVideos] = useState([]); // ✅ always array
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await fetch("/api/video");
        const data = await res.json();

        // ✅ NORMALIZE RESPONSE
        if (Array.isArray(data)) {
          setVideos(data);
        } else if (Array.isArray(data.videos)) {
          setVideos(data.videos);
        } else if (Array.isArray(data.data)) {
          setVideos(data.data);
        } else {
          setVideos([]);
        }
      } catch (err) {
        console.error("❌ Failed to fetch videos:", err);
        setVideos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const handleEdit = (videoId) => {
    router.push(`/upload?id=${videoId}`);
  };

  const handleDelete = async (videoId) => {
    // ✅ Optimistic UI update
    setVideos((prev) => prev.filter((v) => v._id !== videoId));
    await fetch(`/api/video/${videoId}`, { method: "DELETE" });
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center text-white">
        Loading…
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black flex items-center justify-center">
      <div
        className="
          aspect-[9/16]
          h-[92vh]
          max-h-[900px]
          w-full
          max-w-[390px]
          md:max-w-[420px]
          lg:max-w-[460px]
          rounded-xl
          overflow-hidden
          border border-white/10
          bg-black
        "
      >
        <VideoSwiper
          videos={videos}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </main>
  );
}
