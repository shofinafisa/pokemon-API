"use client";

import React, { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { UserRole } from "@/types/auth";
import { ShieldAlert, Loader2 } from "lucide-react";

interface AuthGuardProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
  redirectTo?: string;
}

export function AuthGuard({
  children,
  allowedRoles,
  redirectTo = "/login",
}: AuthGuardProps) {
  const { role, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.replace(redirectTo);
      } else if (allowedRoles && role) {
        const currentRoleUpper = role.toUpperCase();
        const allowedUpper = allowedRoles.map((r) => r.toUpperCase());
        if (!allowedUpper.includes(currentRoleUpper)) {
          // If logged in as user trying to access admin, redirect to dashboard
          if (currentRoleUpper === "USER") {
            router.replace("/dashboard");
          } else {
            router.replace("/admin");
          }
        }
      }
    }
  }, [isLoading, isAuthenticated, role, allowedRoles, redirectTo, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-slate-100">
        <div className="flex items-center gap-3 px-6 py-4 rounded-xl bg-slate-800/80 border border-slate-700/60 shadow-xl backdrop-blur-sm">
          <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
          <span className="text-sm font-medium tracking-wide">Memverifikasi Sesi Akses...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (allowedRoles && role) {
    const currentRoleUpper = role.toUpperCase();
    const allowedUpper = allowedRoles.map((r) => r.toUpperCase());
    if (!allowedUpper.includes(currentRoleUpper)) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-slate-100 p-6">
          <div className="max-w-md w-full p-8 rounded-2xl bg-slate-800 border border-red-500/20 shadow-2xl text-center space-y-4">
            <div className="inline-flex p-3 rounded-full bg-red-500/10 text-red-400">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-white">Akses Ditolak (Unauthorized)</h2>
            <p className="text-sm text-slate-400">
              Akun Anda dengan role <strong className="text-slate-200 uppercase">{role}</strong> tidak memiliki otorisasi untuk mengakses halaman ini.
            </p>
            <button
              onClick={() => router.push(role.toUpperCase() === "ADMIN" ? "/admin" : "/dashboard")}
              className="w-full py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-all cursor-pointer"
            >
              Kembali ke Dashboard Utama
            </button>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
}
