"use client";

import React, { useState } from "react";
import { AuthGuard } from "@/components/guards/auth-guard";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { FeatureManagementPanel } from "@/components/admin/feature-management-panel";
import { KPIMetrics } from "@/components/dashboard/kpi-metrics";
import { DynamicChartGrid } from "@/components/dashboard/dynamic-chart-grid";
import { TransactionsTable } from "@/components/dashboard/transactions-table";
import { ExportControls } from "@/components/dashboard/export-controls";
import { DateFilter } from "@/components/dashboard/date-filter";
import { AIInfographicModal } from "@/components/dashboard/ai-infographic-modal";
import { InfographicTemplate, StructuredInsightItem } from "@/components/InfographicTemplate";
import { useFeatures } from "@/context/feature-context";
import { formatShortCurrency, formatNumber } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import toast from "react-hot-toast";
import { ShieldCheck, Activity } from "lucide-react";

export default function AdminPage() {
  const { filteredStats, filteredTransactions, yearRange, cascadingFilter } = useFeatures();

  // State untuk arsitektur Data-Driven DOM-to-Image di Admin Console
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState("");
  const [generatedInsight, setGeneratedInsight] = useState("");
  const [generatedStructuredInsights, setGeneratedStructuredInsights] = useState<StructuredInsightItem[]>([]);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const handleGenerateInfographic = async () => {
    setIsAIModalOpen(true);
    setIsGeneratingAI(true);
    setGeneratedImageUrl("");

    try {
      const payload = {
        realisasi: formatShortCurrency(filteredStats.totalAmount),
        paket: `${formatNumber(filteredStats.totalPackages)} Paket`,
        efisiensi: `Hemat ${filteredStats.efficiencyRatio}%`,
        tahun: `${yearRange[0]} – ${yearRange[1]}`,
        instansi:
          cascadingFilter.instansi && cascadingFilter.instansi.length > 0
            ? cascadingFilter.instansi.join(", ")
            : "Seluruh Instansi Nasional (Admin LKPP)",
        metode: "Rekapitulasi Nasional 12 Metode Pengadaan",
      };

      // a. Lakukan fetch ke /api/generate-insight
      const res = await fetch("/api/generate-insight", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Gagal mengambil analisis AI.");

      const data = await res.json();
      const insightText = data.insight || "";

      // b. Masukkan teks ke state template
      setGeneratedInsight(insightText);
      if (Array.isArray(data.structuredInsights) && data.structuredInsights.length > 0) {
        setGeneratedStructuredInsights(data.structuredInsights);
      }

      // c. Tunggu grafik selesai dirender
      await new Promise((resolve) => setTimeout(resolve, 400));

      // d. html2canvas capture
      const element = document.getElementById("admin-infographic-template");
      if (element) {
        const html2canvas = (await import("html2canvas")).default;
        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          backgroundColor: "#EEF2F6",
          logging: false,
          width: 794,
          height: 1123,
          windowWidth: 794,
          windowHeight: 1123,
          x: 0,
          y: 0,
          scrollX: 0,
          scrollY: 0,
        });

        // e. Ambil DataURL Base64 PNG
        const base64Png = canvas.toDataURL("image/png");
        setGeneratedImageUrl(base64Png);
        toast.success("Infografis AI berhasil di-generate dari data dashboard!", { icon: "📊" });
      }
    } catch (err) {
      console.error("Gagal capture infografis:", err);
      toast.error("Terjadi kesalahan saat memproses infografis DOM-to-Image.");
    } finally {
      setIsGeneratingAI(false);
    }
  };

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
            <ExportControls onGenerateAI={handleGenerateInfographic} customTransactions={filteredTransactions} />
          </div>
        </div>

        {/* Feature Toggle Management Control Panel */}
        <section aria-label="Feature Management Controls">
          <FeatureManagementPanel />
        </section>

        {/* Modal Preview Infografis AI */}
        <AIInfographicModal
          isOpen={isAIModalOpen}
          onClose={() => setIsAIModalOpen(false)}
          filterState={cascadingFilter}
          targetMethodLabel="Rekapitulasi Nasional 12 Metode"
          imageUrl={generatedImageUrl}
          activePrompt={generatedInsight}
          isLoading={isGeneratingAI}
          onRegenerate={handleGenerateInfographic}
        />

        {/* Hidden React Component: InfographicTemplate di background DOM */}
        <div
          className="fixed left-0 top-0 pointer-events-none overflow-hidden"
          aria-hidden="true"
          style={{
            position: "fixed",
            left: 0,
            top: 0,
            zIndex: -9999,
            width: "794px",
            height: "1123px",
            pointerEvents: "none",
          }}
        >
          <InfographicTemplate
            id="admin-infographic-template"
            totalRealisasi={formatShortCurrency(filteredStats.totalAmount)}
            totalPaket={`${formatNumber(filteredStats.totalPackages)} Paket`}
            efisiensi={`Hemat ${filteredStats.efficiencyRatio}%`}
            tahun={`${yearRange[0]} – ${yearRange[1]}`}
            instansi={
              cascadingFilter.instansi && cascadingFilter.instansi.length > 0
                ? cascadingFilter.instansi.join(", ")
                : "Seluruh Instansi Nasional (Pusat LKPP)"
            }
            metode="Konsolidasi 12 Metode Nasional"
            insight={generatedInsight}
            structuredInsights={
              generatedStructuredInsights.length > 0
                ? generatedStructuredInsights
                : undefined
            }
          />
        </div>

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
