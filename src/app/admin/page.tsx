"use client";

import React from "react";
import { AuthGuard } from "@/components/guards/auth-guard";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { FeatureManagementPanel } from "@/components/admin/feature-management-panel";
import { KPIMetrics } from "@/components/dashboard/kpi-metrics";
import { DynamicChartGrid } from "@/components/dashboard/dynamic-chart-grid";
import { TransactionsTable } from "@/components/dashboard/transactions-table";
import { ExportControls } from "@/components/dashboard/export-controls";
import { DateFilter } from "@/components/dashboard/date-filter";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Activity } from "lucide-react";

export default function AdminPage() {
  return (
    <AuthGuard allowedRoles={["ADMIN", "admin"]}>
      <DashboardShell>
        {/* Admin Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="default" className="gap-1.5 py-1 px-3 bg-blue-600 text-white border-0 font-semibold text-xs tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5" />
                ADMINISTRATOR LKPP CONSOLE
              </Badge>
              <span className="text-xs text-slate-400">| Pusat Kendali INAPROC</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mt-2">
              INAPROC Procurement Control Center & Feature Toggle
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Sebagai Administrator LKPP, Anda memiliki kendali langsung atas 12 metode pengadaan. Modul yang diaktifkan/dinonaktifkan akan seketika menyelaraskan data pada akun User (PPK Satker).
            </p>
          </div>

          <div className="flex items-center gap-3">
            <DateFilter />
            <ExportControls />
          </div>
        </div>

        {/* Feature Toggle Management Control Panel */}
        <section aria-label="Feature Management Controls">
          <FeatureManagementPanel />
        </section>

        {/* Live Admin Analytics Preview (Reflects live active toggles) */}
        <div className="pt-4 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-500" />
              <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                Pratinjau Langsung Data Pengadaan
              </h2>
            </div>
            <span className="text-xs text-slate-400">
              *Perubahan Switch di atas seketika mengubah analitik di bawah ini dan di dashboard User.
            </span>
          </div>

          {/* KPI Cards */}
          <KPIMetrics />

          {/* Dynamic Charts (Line/Area and Donut) */}
          <DynamicChartGrid />

          {/* Full Transactions Table */}
          <TransactionsTable />
        </div>
      </DashboardShell>
    </AuthGuard>
  );
}
