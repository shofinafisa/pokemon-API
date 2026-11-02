"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthGuard } from "@/components/guards/auth-guard";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { KPIMetrics } from "@/components/dashboard/kpi-metrics";
import { DynamicChartGrid } from "@/components/dashboard/dynamic-chart-grid";
import { TransactionsTable } from "@/components/dashboard/transactions-table";
import { ExportControls } from "@/components/dashboard/export-controls";
import { CascadingFilterBar } from "@/components/dashboard/cascading-filter-bar";
import { AIInfographicModal } from "@/components/dashboard/ai-infographic-modal";
import { MethodIcon } from "@/components/dashboard/method-icon";
import { useFeatures } from "@/context/feature-context";
import { useAuth } from "@/context/auth-context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  getMethodConfigBySlug,
  calculateDynamicStats,
} from "@/lib/mock-data";
import {
  INITIAL_CASCADING_FILTER,
  CascadingFilterState,
} from "@/lib/cascading-filter-data";
import {
  UserCheck,
  ArrowLeft,
  ShieldAlert,
  ChevronRight,
} from "lucide-react";

interface MethodDashboardViewProps {
  methodSlug: string;
}

export function MethodDashboardView({ methodSlug }: MethodDashboardViewProps) {
  const router = useRouter();
  const { user } = useAuth();
  const {
    isFeatureEnabled,
    yearRange: globalYearRange,
  } = useFeatures();

  const isAll = methodSlug.toLowerCase() === "all" || methodSlug.toLowerCase() === "nasional";

  useEffect(() => {
    if (isAll) {
      router.replace("/dashboard");
    }
  }, [isAll, router]);

  const methodConfig = useMemo(() => {
    if (isAll) return null;
    return getMethodConfigBySlug(methodSlug);
  }, [methodSlug, isAll]);

  // Local cascading filter state for this method dashboard
  const [filterState, setFilterState] = useState<CascadingFilterState>({
    ...INITIAL_CASCADING_FILTER,
    yearRange: globalYearRange,
  });
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  // If redirecting from old "all" path
  if (isAll) {
    return null;
  }

  // If slug is invalid
  if (!methodConfig) {
    return (
      <AuthGuard allowedRoles={["user", "admin"]}>
        <DashboardShell>
          <div className="max-w-xl mx-auto my-16 text-center space-y-4 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 mx-auto flex items-center justify-center">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Metode Pengadaan Tidak Ditemukan
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Metode pengadaan dengan identifier &ldquo;{methodSlug}&rdquo; tidak terdaftar pada regulasi INAPROC.
            </p>
            <div className="pt-2">
              <Button
                size="sm"
                onClick={() => router.push("/dashboard")}
                className="bg-blue-600 hover:bg-blue-500 text-white text-xs gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Kembali ke Pilihan Metode
              </Button>
            </div>
          </div>
        </DashboardShell>
      </AuthGuard>
    );
  }

  const isEnabled = isFeatureEnabled(methodConfig.key);
  const targetKey = methodConfig.key;
  const targetLabel = methodConfig.label;

  // Real-time dynamic calculation for this method
  const targetKeysArray = [targetKey];

  const { filteredTransactions, totalAmount, totalPackages, avgAmount, efficiencyRatio } =
    useMemo(() => {
      return calculateDynamicStats(targetKeysArray, filterState.yearRange, {
        jenisInstansi: filterState.jenisInstansi,
        instansi: filterState.instansi,
        eselon: filterState.eselon,
        satker: filterState.satker,
      });
    }, [targetKeysArray, filterState]);

  const methodStats = useMemo(
    () => ({
      totalAmount,
      totalPackages,
      avgAmount,
      efficiencyRatio,
    }),
    [totalAmount, totalPackages, avgAmount, efficiencyRatio]
  );

  const resetFilters = () => {
    setFilterState({
      ...INITIAL_CASCADING_FILTER,
      yearRange: [2020, 2026],
    });
  };

  return (
    <AuthGuard allowedRoles={["user", "admin"]}>
      <DashboardShell>
        <div className="space-y-5">
          {/* Top Breadcrumb & Back Navigation Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-1 border-b border-slate-200/80 dark:border-slate-800 text-xs">
            {/* Back Button & Breadcrumbs */}
            <div className="flex items-center gap-2 flex-wrap">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 font-semibold shadow-2xs transition-all cursor-pointer group"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-blue-500 group-hover:-translate-x-0.5 transition-transform" />
                <span>Kembali ke Pilihan Metode</span>
              </Link>

              <div className="hidden sm:flex items-center gap-1.5 text-slate-400">
                <span>/</span>
                <Link
                  href="/dashboard"
                  className="hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                >
                  Dashboard
                </Link>
                <ChevronRight className="w-3 h-3 text-slate-400" />
                <span className="font-semibold text-slate-800 dark:text-slate-100 truncate max-w-[200px]">
                  {targetLabel}
                </span>
              </div>
            </div>
          </div>

          {/* Header Banner & Action Tools (Export & AI Infographic) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 transition-all">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge
                  variant="secondary"
                  className="gap-1.5 py-0.5 px-2.5 bg-emerald-600/10 text-emerald-700 dark:bg-emerald-400/20 dark:text-emerald-300 border border-emerald-500/30 font-semibold text-[11px]"
                >
                  <UserCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  PPK SATKER &bull; INAPROC
                </Badge>

                <Badge
                  variant="outline"
                  className="gap-1.5 py-0.5 px-2.5 font-semibold text-[11px]"
                  style={{
                    borderColor: `${methodConfig.badgeColor}40`,
                    backgroundColor: `${methodConfig.badgeColor}15`,
                    color: methodConfig.badgeColor,
                  }}
                >
                  <MethodIcon name={methodConfig.iconName} className="w-3 h-3" />
                  <span>{methodConfig.category}</span>
                </Badge>
              </div>

              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2 flex-wrap">
                <span>Dashboard Monitoring Pengadaan Nasional</span>
                <span className="text-slate-400 font-light">&bull;</span>
                <span className="text-blue-600 dark:text-blue-400">{targetLabel}</span>
              </h1>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                Selamat datang, <strong className="text-slate-700 dark:text-slate-200">{user?.name || "PPK Satker"}</strong>. Menampilkan analitik realisasi dan paket pengadaan khusus metode <strong className="text-slate-700 dark:text-slate-200">{targetLabel}</strong> secara real-time.
              </p>
            </div>

            {/* Action Tools: Export controls & Infografis AI */}
            <div className="flex items-center gap-2 shrink-0">
              <ExportControls
                onGenerateAI={() => setIsAIModalOpen(true)}
                customTransactions={filteredTransactions}
                filenamePrefix={`laporan_pengadaan_${methodSlug}`}
              />
            </div>
          </div>

          {/* Legal / Regulation Overview Info Box (for this method) */}
          <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-gradient-to-r from-blue-50/50 via-slate-50 to-white dark:from-slate-900 dark:via-slate-900 dark:to-slate-800/80 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-start sm:items-center gap-3">
              <div
                className="p-2.5 rounded-xl shrink-0 text-white shadow-md"
                style={{ backgroundColor: methodConfig.badgeColor }}
              >
                <MethodIcon name={methodConfig.iconName} className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-slate-900 dark:text-slate-100 text-xs">
                    Ketentuan Regulasi LKPP: {methodConfig.label}
                  </h4>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium">
                    Perpres Pengadaan
                  </span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                  {methodConfig.description}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 sm:border-l sm:border-slate-200 dark:sm:border-slate-800 sm:pl-4">
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block">Status Fitur:</span>
                <span
                  className={`text-[11px] font-bold ${
                    isEnabled ? "text-emerald-600 dark:text-emerald-400" : "text-amber-500"
                  }`}
                >
                  {isEnabled ? "Aktif & Terbuka" : "Dinonaktifkan Admin"}
                </span>
              </div>
            </div>
          </div>

          {/* Cascading Filter Bar: Rentang Tahun (Dual Range Slider) + Multi-Choice Dropdowns */}
          <CascadingFilterBar
            filterState={filterState}
            onChange={setFilterState}
            onReset={resetFilters}
          />

          {/* Modal Preview Infografis AI */}
          <AIInfographicModal
            isOpen={isAIModalOpen}
            onClose={() => setIsAIModalOpen(false)}
            filterState={filterState}
            targetMethodLabel={targetLabel}
            customStats={methodStats}
          />

          {/* If the method is disabled by Admin LKPP via Feature Toggle Engine */}
          {!isEnabled ? (
            <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 p-12 text-center space-y-4 bg-white/50 dark:bg-slate-900/30">
              <div className="inline-flex p-4 rounded-full bg-amber-500/10 text-amber-500">
                <ShieldAlert className="w-10 h-10" />
              </div>
              <div className="max-w-md mx-auto space-y-1">
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Metode Pengadaan Sedang Dinonaktifkan oleh Administrator LKPP
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Modul &ldquo;{targetLabel}&rdquo; saat ini dalam status nonaktif pada konsol Feature Toggle LKPP. Silakan pilih metode lain atau hubungi Admin LKPP untuk mengaktifkannya.
                </p>
              </div>
              <div className="pt-2 flex items-center justify-center gap-2">
                <Button
                  size="sm"
                  onClick={() => router.push("/dashboard")}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Pilih Metode Lain
                </Button>
              </div>
            </div>
          ) : (
            /* Visualisasi & Data Table (Terkorelasi Real-Time dengan Filter) */
            <div className="space-y-5">
              {/* Kartu Metrik KPI Khusus Metode Ini */}
              <section aria-label="Metrik Utama">
                <KPIMetrics
                  customStats={methodStats}
                  subtitleMethod={targetLabel}
                  yearRange={filterState.yearRange}
                />
              </section>

              {/* Grafik Tren & Donut Chart Khusus Metode Ini */}
              <section aria-label="Visualisasi Grafik">
                <DynamicChartGrid
                  customTransactions={filteredTransactions}
                  customStats={methodStats}
                  yearRange={filterState.yearRange}
                  isSingleMethod={true}
                  targetMethodLabel={targetLabel}
                />
              </section>

              {/* Tabel Dataset Paket Pengadaan Khusus Metode Ini */}
              <section aria-label="Tabel Dataset">
                <TransactionsTable
                  customTransactions={filteredTransactions}
                  targetMethodLabel={targetLabel}
                  yearRange={filterState.yearRange}
                />
              </section>
            </div>
          )}
        </div>
      </DashboardShell>
    </AuthGuard>
  );
}
