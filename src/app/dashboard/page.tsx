"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { AuthGuard } from "@/components/guards/auth-guard";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { MethodIcon } from "@/components/dashboard/method-icon";
import { useFeatures } from "@/context/feature-context";
import { useAuth } from "@/context/auth-context";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  FEATURE_CONFIGS,
  FEATURE_TO_SLUG,
  MOCK_TRANSACTIONS,
} from "@/lib/mock-data";
import { formatShortCurrency } from "@/lib/utils";
import {
  UserCheck,
  Search,
  ArrowRight,
  Layers,
  AlertCircle,
} from "lucide-react";

export default function UserMethodSelectionPage() {
  const { user } = useAuth();
  const { isFeatureEnabled, activeCount, totalCount } = useFeatures();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");

  const categories = [
    "Semua",
    "Pemilihan Langsung",
    "Tender & Kompetisi",
    "E-Katalog",
    "Khusus & Swakelola",
  ];

  // Pre-calculate package count and total amount for each method
  const methodStatsSummary = useMemo(() => {
    const summary: Record<string, { count: number; totalAmount: number }> = {};
    FEATURE_CONFIGS.forEach((cfg) => {
      summary[cfg.key] = { count: 0, totalAmount: 0 };
    });

    MOCK_TRANSACTIONS.forEach((tx) => {
      if (summary[tx.procurementMethod]) {
        summary[tx.procurementMethod].count += 1;
        summary[tx.procurementMethod].totalAmount += tx.amount;
      }
    });

    return summary;
  }, []);

  const filteredMethods = useMemo(() => {
    return FEATURE_CONFIGS.filter((cfg) => {
      const matchSearch =
        cfg.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cfg.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cfg.category.toLowerCase().includes(searchTerm.toLowerCase());

      const matchCategory =
        selectedCategory === "Semua" ? true : cfg.category === selectedCategory;

      return matchSearch && matchCategory;
    });
  }, [searchTerm, selectedCategory]);

  return (
    <AuthGuard allowedRoles={["user", "admin"]}>
      <DashboardShell>
        <div className="space-y-8 pb-10">
          {/* Centered Hero Section */}
          <div className="text-center max-w-3xl mx-auto pt-4 space-y-4">
            <div className="inline-flex items-center gap-2">
              <Badge
                variant="secondary"
                className="gap-1.5 py-1 px-3 bg-emerald-600/10 text-emerald-700 dark:bg-emerald-400/20 dark:text-emerald-300 border border-emerald-500/30 font-semibold text-xs tracking-wider"
              >
                <UserCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                PPK SATKER &bull; INAPROC NASIONAL
              </Badge>
              <span className="text-xs text-slate-400">
                | Status Engine: {activeCount}/{totalCount} Metode Aktif
              </span>
            </div>

            {/* Main Required Title */}
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
              Dashboard Monitoring Pengadaan Nasional
            </h1>

            {/* Main Required Question */}
            <p className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 bg-clip-text text-transparent">
              Mau Tahu tentang Apa?
            </p>

            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
              Selamat datang, <strong className="text-slate-700 dark:text-slate-200">{user?.name || "PPK Satker"}</strong>. Silakan pilih salah satu dari 12 metode pengadaan di bawah ini untuk melihat data analitik, realisasi anggaran, tren bulanan, serta daftar paket pengadaan secara spesifik.
            </p>
          </div>

          {/* Interactive Search & Category Filter Bar */}
          <div className="max-w-4xl mx-auto space-y-3">
            {/* Full-width Search Bar */}
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Cari metode pengadaan (misal: Tender, E-Purchasing, Swakelola)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-10 text-xs rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              <span className="text-[11px] font-medium text-slate-400 shrink-0 flex items-center gap-1 mr-1">
                <Layers className="w-3 h-3 text-blue-500" />
                Kategori:
              </span>
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl font-medium text-xs shrink-0 transition-all cursor-pointer ${
                      isSelected
                        ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs font-semibold"
                        : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 12 Modern Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {filteredMethods.map((cfg) => {
              const slug = FEATURE_TO_SLUG[cfg.key];
              const isEnabled = isFeatureEnabled(cfg.key);
              const stats = methodStatsSummary[cfg.key] || { count: 0, totalAmount: 0 };

              return (
                <Link
                  key={cfg.key}
                  href={`/dashboard/${slug}`}
                  className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs hover:shadow-xl hover:border-blue-500/50 dark:hover:border-blue-500/50 hover:-translate-y-1 transition-all duration-200 cursor-pointer overflow-hidden"
                >
                  {/* Subtle top accent gradient */}
                  <div
                    className="absolute top-0 left-0 right-0 h-1 transition-opacity opacity-75 group-hover:opacity-100"
                    style={{ backgroundColor: cfg.badgeColor }}
                  />

                  <div className="space-y-3.5">
                    {/* Top Row: Icon, Category Badge & Status */}
                    <div className="flex items-center justify-between gap-2">
                      <div
                        className="p-2.5 rounded-xl text-white shadow-md transition-transform group-hover:scale-105 duration-200"
                        style={{ backgroundColor: cfg.badgeColor }}
                      >
                        <MethodIcon name={cfg.iconName} className="w-5 h-5" />
                      </div>

                      <div className="flex items-center gap-1.5">
                        <Badge
                          variant="secondary"
                          className="text-[10px] px-2 py-0.5 font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-0"
                        >
                          {cfg.category}
                        </Badge>

                        {isEnabled ? (
                          <span
                            className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-600 dark:text-emerald-400"
                            title="Metode aktif dan dapat dimonitor"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Aktif
                          </span>
                        ) : (
                          <span
                            className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-500"
                            title="Dinonaktifkan di konsol Admin"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                            Off
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Method Name */}
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {cfg.label}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                        {cfg.description}
                      </p>
                    </div>

                    {/* Quick Stats Pill */}
                    <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-[11px]">
                      <span className="text-slate-500">Estimasi Paket:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {stats.count} Paket &bull; {formatShortCurrency(stats.totalAmount)}
                      </span>
                    </div>
                  </div>

                  {/* Card Bottom Action Link */}
                  <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300">
                    <span>Buka Dashboard {cfg.label}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>

          {filteredMethods.length === 0 && (
            <div className="text-center py-12 space-y-2">
              <AlertCircle className="w-8 h-8 text-slate-400 mx-auto stroke-1" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Tidak ada metode pengadaan yang cocok
              </p>
              <p className="text-xs text-slate-400">
                Silakan ganti kata kunci pencarian atau pilih kategori lain.
              </p>
            </div>
          )}
        </div>
      </DashboardShell>
    </AuthGuard>
  );
}
