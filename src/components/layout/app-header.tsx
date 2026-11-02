"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { useFeatures } from "@/context/feature-context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import {
  ShieldCheck,
  UserCheck,
  LogOut,
  Sliders,
  Settings,
  LayoutDashboard,
} from "lucide-react";

export function AppHeader() {
  const { user, role, logout } = useAuth();
  const { activeCount, totalCount } = useFeatures();
  const router = useRouter();
  const pathname = usePathname();

  const isAdmin = role?.toUpperCase() === "ADMIN";

  const handleLogout = async () => {
    await logout();
    toast.success("Berhasil keluar dari sesi.", { icon: "👋" });
    router.replace("/login");
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 sm:px-6 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95 transition-all">
      {/* Brand & Breadcrumb */}
      <div className="flex items-center gap-3">
        <Link href={isAdmin ? "/admin" : "/dashboard"} className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20 font-bold text-xs tracking-wider group-hover:scale-105 transition-transform">
            LKPP
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100">
                INAPROC
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400">
                Nasional
              </span>
            </div>
            <p className="text-[10px] text-slate-400 -mt-0.5">Sistem Pengadaan Secara Elektronik</p>
          </div>
        </Link>

        {/* Feature status badge */}
        <div className="hidden lg:flex items-center pl-4 border-l border-slate-200 dark:border-slate-800 text-xs text-slate-500">
          <Sliders className="w-3.5 h-3.5 mr-1.5 text-blue-500" />
          <span>Metode Aktif:</span>
          <span className="ml-1 font-semibold text-slate-700 dark:text-slate-300">
            {activeCount}/{totalCount} Metode
          </span>
        </div>
      </div>

      {/* User Session & Role Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Navigation Links for Admin */}
        {isAdmin && (
          <div className="flex items-center gap-1.5 mr-1 sm:mr-2">
            <Link href="/admin">
              <Button
                variant={pathname === "/admin" ? "default" : "ghost"}
                size="sm"
                className={`h-8 px-2.5 text-xs gap-1.5 ${
                  pathname === "/admin"
                    ? "bg-blue-600 text-white"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Pusat Kendali</span>
              </Button>
            </Link>

            <Link href="/admin/settings">
              <Button
                variant={pathname.startsWith("/admin/settings") ? "default" : "ghost"}
                size="sm"
                className={`h-8 px-2.5 text-xs gap-1.5 ${
                  pathname.startsWith("/admin/settings")
                    ? "bg-blue-600 text-white"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <Settings className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Pengaturan</span>
              </Button>
            </Link>
          </div>
        )}

        {/* Role Badge */}
        {isAdmin ? (
          <Badge
            variant="default"
            className="hidden sm:inline-flex items-center gap-1.5 py-1 px-2.5 bg-blue-600/10 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300 border border-blue-500/30"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span className="font-semibold text-xs tracking-wide">ADMINISTRATOR</span>
          </Badge>
        ) : (
          <Badge
            variant="secondary"
            className="hidden sm:inline-flex items-center gap-1.5 py-1 px-2.5 bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 border border-emerald-500/30"
          >
            <UserCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="font-semibold text-xs tracking-wide">USER (PPK SATKER)</span>
          </Badge>
        )}

        {/* User Profile Capsule */}
        {user && (
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
            {user.avatar ? (
              <Image
                src={user.avatar}
                alt={user.name}
                width={32}
                height={32}
                unoptimized
                className="h-8 w-8 rounded-full object-cover border border-slate-200 dark:border-slate-700"
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white">
                {user.name.charAt(0)}
              </div>
            )}
            <div className="hidden lg:block text-left">
              <p className="text-xs font-semibold leading-tight text-slate-800 dark:text-slate-200">
                {user.name}
              </p>
              <p className="text-[10px] text-slate-400 leading-tight truncate max-w-[130px]">
                {user.email}
              </p>
            </div>
          </div>
        )}

        {/* Logout Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="h-8 px-2 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
          title="Logout dari aplikasi"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline ml-1.5">Keluar</span>
        </Button>
      </div>
    </header>
  );
}
