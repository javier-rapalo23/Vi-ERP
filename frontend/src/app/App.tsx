import { Outlet } from "react-router-dom";
import { Suspense } from "react";
import Navbar from "@/shared/components/Navbar";
import Loading from "@/shared/components/Loading";
import ThemeInitializer from "@/shared/components/ThemeInitializer";

export default function App() {
  return (
    <>
      <ThemeInitializer />
      <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors">
        <Navbar />
        <main className="container mx-auto p-4">
          <Suspense fallback={<Loading />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </>
  );
}
