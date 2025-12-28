"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import FileUpload from "../compo/FileUpload";

export default function UploadClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const videoId = searchParams.get("id");
  const isEdit = Boolean(videoId);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [thumbnailUploaded, setThumbnailUploaded] = useState(false);

  // Load data in edit mode
  useEffect(() => {
    if (!isEdit) return;

    (async () => {
      try {
        const res = await fetch(`/api/video/${videoId}`);
        const data = await res.json();

        setTitle(data.title);
        setDescription(data.description);
        setVideoUrl(data.videoUrl);
        setThumbnailUrl(data.thumbnailUrl);
        setThumbnailUploaded(true);
      } catch {
        toast.error("Failed to load reel");
      }
    })();
  }, [isEdit, videoId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !thumbnailUploaded) {
      toast.error("Fill all required fields");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        isEdit ? `/api/video/${videoId}` : `/api/video`,
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            description,
            videoUrl,
            thumbnailUrl,
          }),
        }
      );

      if (!res.ok) throw new Error();

      toast.success(isEdit ? "Reel updated" : "Reel uploaded");
      router.push("/reel");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-6 sm:p-8 grid gap-6"
      >
        {/* TITLE */}
        <h1 className="text-2xl sm:text-3xl font-bold text-black">
          {isEdit ? "Edit Reel" : "Upload Reel"}
        </h1>

        {/* INPUT: TITLE */}
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="
            w-full
            border
            border-gray-300
            rounded-lg
            px-4
            py-3
            text-black
            placeholder-gray-500
            focus:outline-none
            focus:ring-2
            focus:ring-purple-500
          "
        />

        {/* TEXTAREA: DESCRIPTION */}
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          rows={4}
          className="
            w-full
            border
            border-gray-300
            rounded-lg
            px-4
            py-3
            text-black
            placeholder-gray-500
            resize-none
            focus:outline-none
            focus:ring-2
            focus:ring-purple-500
          "
        />

        {/* VIDEO UPLOAD */}
        {!isEdit && (
          <div className="space-y-2">
            <p className="text-sm font-semibold text-black">Upload Video</p>
            <FileUpload
              fileType="video"
              onSuccess={(res) => setVideoUrl(res.videoUrl)}
            />
          </div>
        )}

        {/* THUMBNAIL UPLOAD */}
        <div className="space-y-2">
          <p className="text-sm font-semibold text-black">Upload Thumbnail</p>
          <FileUpload
            fileType="image"
            onSuccess={(res) => {
              setThumbnailUrl(res.url);
              setThumbnailUploaded(true);
            }}
          />
        </div>

        {/* SUBMIT BUTTON */}
        <button
          disabled={loading}
          className="
            w-full
            bg-purple-600
            hover:bg-purple-700
            text-white
            py-3
            rounded-lg
            font-semibold
            transition
            disabled:opacity-50
          "
        >
          {loading ? "Saving..." : isEdit ? "Save Changes" : "Upload"}
        </button>
      </form>
    </main>
  );
}
