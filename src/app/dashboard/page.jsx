"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function DashboardPage() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchMyVideos = async () => {
      try {
        const res = await fetch("/api/video/me");

        if (!res.ok) {
          setVideos([]);
          return;
        }

        const data = await res.json();
        setVideos(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("❌ Dashboard fetch error:", error);
        setVideos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMyVideos();
  }, []);

  const handleEdit = (videoId) => {
    router.push(`/upload?id=${videoId}`);
  };

  const handleDelete = async (videoId) => {
    const prevVideos = videos;

    // optimistic update
    setVideos((prev) => prev.filter((v) => v._id !== videoId));

    try {
      const res = await fetch(`/api/video/${videoId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        setVideos(prevVideos); // rollback
      }
    } catch (error) {
      console.error("❌ Delete error:", error);
      setVideos(prevVideos);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading your videos...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pt-24 px-4 sm:px-6 lg:px-10">
      {/* HEADER */}
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800">
          Your Dashboard
        </h1>
        <p className="text-gray-600 mt-1">
          Manage all videos uploaded by you
        </p>
      </div>

      {/* VIDEO GRID */}
      {videos.length > 0 && (
        <div
          className="
            max-w-7xl mx-auto grid gap-6
            grid-cols-1
            sm:grid-cols-2
            md:grid-cols-3
            xl:grid-cols-4
          "
        >
          {videos.map((video) => (
            <div
              key={video._id}
              className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
            >
              <div className="relative w-full h-44">
                <Image
                  src={video.thumbnailUrl}
                  alt={video.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="p-4 space-y-2">
                <h3 className="font-bold text-gray-800 line-clamp-1">
                  {video.title}
                </h3>

                <p className="text-sm text-gray-500">
                  Uploaded on{" "}
                  {new Date(video.createdAt).toLocaleDateString()}
                </p>

                <div className="flex gap-2 pt-3">
                  <button
                    onClick={() => handleEdit(video._id)}
                    className="flex-1 bg-purple-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-purple-700"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(video._id)}
                    className="flex-1 bg-red-500 text-white py-2 rounded-lg text-sm font-semibold hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* EMPTY STATE */}
      {videos.length === 0 && (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
          <p className="text-gray-500 text-lg">
            You haven’t uploaded any videos yet
          </p>

          <Link href="/upload">
            <button className="mt-4 bg-purple-600 text-white px-6 py-3 rounded-full font-bold hover:bg-purple-700 transition">
              Upload Your First Video
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}
