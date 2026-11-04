"use client";

import React, { useState, useEffect } from "react";
import { CascadingFilterState } from "@/lib/cascading-filter-data";
import toast from "react-hot-toast";
import {
  Sparkles,
  Download,
  FileText,
  X,
  Loader2,
  Calendar,
  Layers,
  RefreshCw,
  ImageIcon,
} from "lucide-react";

export interface AIInfographicModalProps {
  isOpen: boolean;
  onClose: () => void;
  filterState: CascadingFilterState;
  targetMethodLabel?: string;
  customStats?: {
    totalAmount: number;
    totalPackages: number;
    efficiencyRatio: string;
  };
  // Props arsitektur Data-Driven DOM-to-Image
  imageUrl?: string;
  activePrompt?: string;
  isLoading?: boolean;
  onRegenerate?: () => void;
}

export function AIInfographicModal({
  isOpen,
  onClose,
  filterState,
  targetMethodLabel,
  imageUrl: propImageUrl,
  activePrompt: propActivePrompt,
  isLoading: propIsLoading = false,
  onRegenerate,
}: AIInfographicModalProps) {
  const [isExportingPDF, setIsExportingPDF] = useState(false);

  // Gunakan state dari props atau fallback internal
  const isLoading = propIsLoading;
  const imageUrl = propImageUrl || "";
  const activePrompt = propActivePrompt || "";

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // 1. Logika Unduh PNG: Buat elemen <a> terprogram dengan href={imageUrl} dan download="Infografis.png"
  const handleDownloadPNG = () => {
    if (!imageUrl) {
      toast.error("Gambar infografis belum siap diunduh.");
      return;
    }
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = "Infografis.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Infografis.png berhasil diunduh!", { icon: "📥" });
  };

  // 2. Logika Cetak PDF: Instance jsPDF, konversi Base64 jika perlu, doc.addImage, doc.save("Infografis.pdf")
  const handleExportPDF = async () => {
    if (!imageUrl) {
      toast.error("Gambar infografis belum siap diekspor.");
      return;
    }

    setIsExportingPDF(true);
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      // Karena imageUrl sudah berupa Base64 Data URL dari html2canvas, langsung masukkan ke doc.addImage
      doc.addImage(imageUrl, "PNG", 0, 0, pageWidth, pageHeight);
      doc.save("Infografis.pdf");

      toast.success("Infografis.pdf berhasil disimpan!", { icon: "📄" });
    } catch (error) {
      console.warn("Ekspor via jsPDF gagal, mengalihkan ke dialog cetak browser:", error);
      try {
        const printWindow = window.open("", "_blank");
        if (printWindow) {
          printWindow.document.write(`
            <!DOCTYPE html>
            <html>
              <head>
                <title>Infografis Data Pengadaan</title>
                <style>
                  @page { size: A4 portrait; margin: 0; }
                  body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #fff; }
                  img { max-width: 100%; max-height: 100vh; object-fit: contain; }
                </style>
              </head>
              <body>
                <img src="${imageUrl}" onload="setTimeout(function(){ window.print(); }, 200);" />
              </body>
            </html>
          `);
          printWindow.document.close();
          toast.success("Membuka dialog cetak PDF...", { icon: "📄" });
        } else {
          toast.error("Terjadi kesalahan saat memproses ekspor PDF.");
        }
      } catch (fallbackErr) {
        console.error("Gagal cetak fallback:", fallbackErr);
        toast.error("Terjadi kesalahan saat memproses ekspor PDF.");
      }
    } finally {
      setIsExportingPDF(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl bg-slate-900 border border-slate-800 text-slate-100 shadow-2xl overflow-hidden">
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-indigo-600/30">
              <Sparkles className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                Generate Infografis AI (INAPROC)
                {targetMethodLabel && (
                  <span className="text-xs px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/30 font-semibold">
                    {targetMethodLabel}
                  </span>
                )}
              </h2>
              <p className="text-[11px] text-slate-400">
                Arsitektur Data-Driven DOM-to-Image &bull; Recharts &bull; AI Insights
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Tutup Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Active Filter Parameters Badge */}
          <div className="flex flex-wrap items-center gap-2 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
            <span className="text-slate-400 font-medium mr-1 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-blue-400" />
              Parameter Aktif:
            </span>
            {targetMethodLabel && (
              <span className="px-2 py-0.5 rounded-md bg-blue-900/40 text-blue-300 border border-blue-700/60 font-semibold">
                Metode: {targetMethodLabel}
              </span>
            )}
            <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-200 border border-slate-700/60 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-blue-400" />
              Tahun: <strong>{filterState.yearRange[0]} - {filterState.yearRange[1]}</strong>
            </span>
            {filterState.instansi.length > 0 && (
              <span className="px-2 py-0.5 rounded-md bg-blue-950/60 text-blue-300 border border-blue-800/60 truncate max-w-xs">
                Instansi: {filterState.instansi.join(", ")}
              </span>
            )}
          </div>

          {/* Area Gambar: Spinner / Skeleton saat Loading, atau tag <img> setelah respon */}
          {isLoading ? (
            <div className="min-h-[380px] flex flex-col items-center justify-center p-8 text-center space-y-4 rounded-xl border border-slate-800 bg-slate-950/40">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-xl shadow-blue-500/25 animate-pulse">
                <Loader2 className="w-7 h-7 text-white animate-spin" />
              </div>

              <div className="space-y-1 max-w-sm">
                <h3 className="text-sm font-semibold text-white">
                  Merender Infografis Data-Driven...
                </h3>
                <p className="text-xs text-slate-400">
                  Mengambil AI executive insight dan meng-capture visualisasi grafik Recharts secara presisi
                </p>
              </div>

              {/* Skeleton Placeholder Bar */}
              <div className="w-full max-w-xs space-y-2 pt-2">
                <div className="h-2 bg-slate-800 rounded-full animate-pulse" />
                <div className="h-2 bg-slate-800/60 rounded-full w-5/6 mx-auto animate-pulse" />
              </div>
            </div>
          ) : imageUrl ? (
            <div className="space-y-4">
              {/* Tampilan Tag <img> yang mengambil src dari imageUrl Base64 PNG */}
              <div className="rounded-xl overflow-hidden border border-slate-700/80 shadow-2xl bg-slate-950 flex flex-col items-center justify-center p-3">
                <div className="w-full flex items-center justify-between pb-2 mb-2 border-b border-slate-800/60 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                    <ImageIcon className="w-3.5 h-3.5 text-blue-400" />
                    Pratinjau Poster Infografis (A4 Data-Driven PNG)
                  </span>
                  <span className="text-emerald-400 font-mono text-[10px]">
                    DOM-to-Image 794x1123 px
                  </span>
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageUrl}
                  alt="Poster Infografis Hasil Capture DOM"
                  className="w-full max-w-md h-auto max-h-[48vh] object-contain rounded-lg shadow-md border border-slate-800 select-none"
                />
              </div>

              {/* Box readOnly untuk memvalidasi activePrompt di bawah gambar */}
              {activePrompt && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-blue-400" />
                      Validasi AI Executive Insights & Rekomendasi:
                    </label>
                    <span className="text-[10px] text-emerald-400 font-mono">
                      Analisis Metrik Terverifikasi
                    </span>
                  </div>
                  <textarea
                    readOnly
                    rows={4}
                    value={activePrompt}
                    className="w-full p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] font-sans text-slate-300 leading-relaxed focus:outline-none resize-none select-all shadow-inner"
                  />
                </div>
              )}
            </div>
          ) : null}
        </div>

        {/* Modal Footer Controls */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 px-6 py-3.5 border-t border-slate-800/80 bg-slate-950/60">
          <div>
            {onRegenerate && (
              <button
                type="button"
                onClick={onRegenerate}
                disabled={isLoading}
                className="px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-800/60 hover:bg-slate-800 text-slate-300 text-xs font-medium transition-colors flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                title="Generate ulang infografis"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-blue-400" : ""}`} />
                <span>Generate Ulang</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-800 text-slate-300 text-xs font-medium transition-colors cursor-pointer"
            >
              Tutup
            </button>

            {/* Tombol Cetak / PDF menggunakan jsPDF */}
            <button
              type="button"
              onClick={handleExportPDF}
              disabled={isLoading || !imageUrl || isExportingPDF}
              className="px-4 py-2 rounded-xl border border-rose-500/40 bg-rose-950/40 hover:bg-rose-900/60 text-rose-200 text-xs font-semibold transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
            >
              {isExportingPDF ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <FileText className="w-3.5 h-3.5 text-rose-400" />
              )}
              <span>Cetak PDF</span>
            </button>

            {/* Tombol Unduh PNG menggunakan elemen <a> terprogram */}
            <button
              type="button"
              onClick={handleDownloadPNG}
              disabled={isLoading || !imageUrl}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh PNG</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
