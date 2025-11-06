import { Outlet } from "react-router-dom";
import { Suspense } from "react";
import Navbar from "@/shared/components/Navbar";
import Loading from "@/shared/components/Loading";

export default function App() {
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <Navbar />
      <main className="container mx-auto p-4">
        <Suspense fallback={<Loading />}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
}
