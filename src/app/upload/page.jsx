import { Suspense } from "react";
import UploadClient from "./UploadClient";

export default function UploadPage() {
  return (
    <Suspense fallback={<UploadSkeleton />}>
      <UploadClient />
    </Suspense>
  );
}

function UploadSkeleton() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <p className="text-gray-500">Loading upload page…</p>
    </main>
  );
}
