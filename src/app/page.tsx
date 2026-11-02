"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { Loader2 } from "lucide-react";

export default function IndexPage() {
  const { role, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.replace("/login");
      } else if (role?.toUpperCase() === "ADMIN") {
        router.replace("/admin");
      } else {
        router.replace("/dashboard");
      }
    }
  }, [isLoading, isAuthenticated, role, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-slate-100">
      <div className="flex items-center gap-3 px-6 py-4 rounded-xl bg-slate-800/80 border border-slate-700/60 shadow-xl backdrop-blur-sm">
        <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
        <span className="text-sm font-medium tracking-wide">Mengarahkan Sesi Pengguna...</span>
      </div>
    </div>
  );
}
