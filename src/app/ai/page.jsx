"use client";

import { useState } from "react";

export default function AIPage() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const MAX_CHARS = 300;

  const askAI = async () => {
    if (!prompt.trim() || loading) return;

    setLoading(true);
    setResponse("");

    try {
      // 1️⃣ Call Gemini
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Give reel caption + hashtags only:\n${prompt}`,
        }),
      });

      const data = await res.json();
      setResponse(data.text || "No response generated.");

      // 2️⃣ Save prompt to MongoDB
      await fetch("/api/aiPrompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userPrompt: prompt }),
      });

    } catch {
      setResponse("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="w-full max-w-xl bg-white/5 p-6 rounded-3xl space-y-5">
        <h1 className="text-2xl font-bold text-white text-center">
          🤖 Reel AI Assistant
        </h1>

        <textarea
          value={prompt}
          onChange={(e) =>
            setPrompt(e.target.value.slice(0, MAX_CHARS))
          }
          rows={4}
          placeholder="Describe your reel idea…"
          className="w-full p-3 rounded-xl bg-black text-white border border-gray-700"
        />

        <div className="flex justify-between text-xs text-gray-400">
          <span>Max {MAX_CHARS} chars</span>
          <span>{prompt.length}/{MAX_CHARS}</span>
        </div>

        <button
          onClick={askAI}
          disabled={loading || !prompt.trim()}
          className="w-full py-3 rounded-xl bg-purple-600 text-white disabled:opacity-50"
        >
          {loading ? "Thinking…" : "✨ Generate Caption"}
        </button>

        {response && (
          <div className="bg-black p-4 rounded-xl text-white whitespace-pre-wrap">
            {response}
          </div>
        )}
      </div>
    </main>
  );
}
