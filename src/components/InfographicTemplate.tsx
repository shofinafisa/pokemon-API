"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  TrendingUp,
  Package,
  ShieldCheck,
  Award,
} from "lucide-react";

export interface StructuredInsightItem {
  number: number;
  title: string;
  text: string;
}

export interface InfographicTemplateProps {
  id?: string;
  totalRealisasi?: string;
  totalPaket?: string;
  efisiensi?: string;
  tahun?: string;
  instansi?: string;
  metode?: string;
  insight?: string;
  paragraphs?: string[];
  structuredInsights?: StructuredInsightItem[];
  trendData?: { month: string; percentage: number }[];
  categoryData?: { name: string; value: number; color: string }[];
}

// 12 Bulan Indeks Nilai Realisasi terhadap Puncak (Januari - Desember) sesuai referensi desain
const DEFAULT_TREND_DATA = [
  { month: "Jan", percentage: 18 },
  { month: "Feb", percentage: 25 },
  { month: "Mar", percentage: 32 },
  { month: "Apr", percentage: 28 },
  { month: "Mei", percentage: 38 },
  { month: "Jun", percentage: 46 },
  { month: "Jul", percentage: 42 },
  { month: "Agu", percentage: 55 },
  { month: "Sep", percentage: 65 },
  { month: "Okt", percentage: 72 },
  { month: "Nov", percentage: 84 },
  { month: "Des", percentage: 100 },
];

// Color palette kategori pengadaan sesuai referensi desain
const DEFAULT_CATEGORY_DATA = [
  { name: "Pengadaan Barang", value: 35, color: "#F6C358" },       // Kuning / Gold
  { name: "Pekerjaan Konstruksi", value: 40, color: "#6BA5E7" },   // Biru Soft
  { name: "Jasa Konsultansi", value: 15, color: "#6EE7B7" },       // Mint Green
  { name: "Jasa Lainnya", value: 10, color: "#FCA5A5" },           // Coral / Salmon
];

export function InfographicTemplate({
  id = "infographic-template",
  totalRealisasi = "Rp 145 Jt",
  totalPaket = "1 Paket",
  efisiensi = "Hemat 7,55%",
  tahun = "2020 – 2026",
  instansi = "Seluruh Instansi Nasional",
  metode = "Pengadaan Langsung",
  insight,
  paragraphs,
  structuredInsights: propStructuredInsights,
  trendData = DEFAULT_TREND_DATA,
  categoryData = DEFAULT_CATEGORY_DATA,
}: InfographicTemplateProps) {
  // Format 3 poin wawasan & rekomendasi eksekutif
  const fallbackPoint1 = `Realisasi anggaran ${tahun} pada ${instansi.toLowerCase()} mencapai ${totalRealisasi} melalui ${totalPaket} ${metode}. Efisiensi ${efisiensi} menandakan penyerapan terukur serta negosiasi harga dan kompetisi penyedia yang efektif, baik pada tahap pengumuman maupun e-katalog.`;
  const fallbackPoint2 = `Pemanfaatan instrumen pengadaan menunjukkan komitmen satker terhadap akuntabilitas dan efisiensi belanja publik. Penjadwalan yang konsisten menekan deviasi antara RUP dan realisasi kontrak, sehingga mencegah SiLPA yang tidak produktif.`;
  const fallbackPoint3 = `PPK dan UKPBJ disarankan terus mengonsolidasikan paket pada komoditas serupa untuk memperkuat daya tawar pemerintah. Percepat e-purchasing di awal semester berikutnya agar penyerapan tidak menumpuk di akhir tahun anggaran.`;

  const structuredList: StructuredInsightItem[] =
    propStructuredInsights && propStructuredInsights.length >= 3
      ? propStructuredInsights
      : paragraphs && paragraphs.length >= 3
      ? [
          { number: 1, title: "Capaian Realisasi", text: paragraphs[0] },
          { number: 2, title: "Akuntabilitas Belanja", text: paragraphs[1] },
          { number: 3, title: "Rekomendasi Strategis", text: paragraphs[2] },
        ]
      : [
          { number: 1, title: "Capaian Realisasi", text: fallbackPoint1 },
          { number: 2, title: "Akuntabilitas Belanja", text: fallbackPoint2 },
          { number: 3, title: "Rekomendasi Strategis", text: fallbackPoint3 },
        ];

  const currentDateFormatted = new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div
      id={id}
      style={{
        width: "794px",
        height: "1123px",
        minWidth: "794px",
        minHeight: "1123px",
      }}
      className="bg-[#EEF2F6] text-slate-800 box-border font-sans flex flex-col justify-between overflow-hidden select-none relative"
    >
      {/* 1. TOP NAVY BLUE HEADER BANNER */}
      <div className="bg-[#244371] text-white px-8 pt-7 pb-6 rounded-b-[2.25rem] shadow-sm space-y-4">
        {/* Top Navbar Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white text-[#244371] font-black text-xs px-2.5 py-1.5 rounded-xl shadow-xs tracking-wider">
              LKPP
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold tracking-tight text-white">
                  INAPROC
                </span>
                <span className="bg-[#416296] text-white text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wider uppercase">
                  Nasional
                </span>
              </div>
              <p className="text-[11px] text-blue-200/90 font-normal -mt-0.5">
                Lembaga Kebijakan Pengadaan Barang/Jasa Pemerintah RI
              </p>
            </div>
          </div>

          <div className="text-right">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-white text-[11px] font-medium backdrop-blur-xs">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Laporan Terverifikasi</span>
            </div>
            <p className="text-[10px] text-blue-200/80 mt-1 font-medium">
              {currentDateFormatted}
            </p>
          </div>
        </div>

        {/* Big Title */}
        <div className="space-y-0.5 pt-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-blue-200/80">
            RINGKASAN EKSEKUTIF
          </p>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Pengadaan Barang/Jasa
          </h1>
        </div>

        {/* 3 Parameter Badges in Header */}
        <div className="grid grid-cols-3 gap-3 pt-1">
          {/* Badge 1: Periode */}
          <div className="bg-white/10 backdrop-blur-xs border border-white/10 rounded-xl px-4 py-2.5">
            <p className="text-[9px] uppercase font-semibold text-blue-200/70 tracking-wider">
              PERIODE
            </p>
            <p className="text-xs font-bold text-white mt-0.5 leading-normal overflow-visible">
              {tahun}
            </p>
          </div>

          {/* Badge 2: Cakupan Instansi */}
          <div className="bg-white/10 backdrop-blur-xs border border-white/10 rounded-xl px-4 py-2.5">
            <p className="text-[9px] uppercase font-semibold text-blue-200/70 tracking-wider">
              CAKUPAN INSTANSI
            </p>
            <p className="text-xs font-bold text-white mt-0.5 leading-normal overflow-visible" title={instansi}>
              {instansi.length > 34 ? `${instansi.slice(0, 32)}...` : instansi}
            </p>
          </div>

          {/* Badge 3: Metode */}
          <div className="bg-white/10 backdrop-blur-xs border border-white/10 rounded-xl px-4 py-2.5">
            <p className="text-[9px] uppercase font-semibold text-blue-200/70 tracking-wider">
              METODE
            </p>
            <p className="text-xs font-bold text-white mt-0.5 leading-normal overflow-visible">
              {metode}
            </p>
          </div>
        </div>
      </div>

      {/* 2. MAIN BODY CONTENT */}
      <div className="px-8 py-4 flex-1 flex flex-col justify-between space-y-3.5">
        {/* ROW 1: 3 METRIC CARDS */}
        <div className="grid grid-cols-3 gap-3.5">
          {/* Card 1: Total Realisasi */}
          <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200/70 flex flex-col justify-between h-[105px]">
            <div className="flex items-center justify-between text-slate-500 text-[11px] font-semibold">
              <span>Total Realisasi</span>
              <div className="p-1.5 rounded-xl bg-[#EEF4FF] text-[#2563EB]">
                <TrendingUp className="w-3.5 h-3.5" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900 tracking-tight">
                {totalRealisasi}
              </div>
              <p className="text-[10px] text-slate-500 font-normal">
                Belanja terserap akuntabel
              </p>
            </div>
          </div>

          {/* Card 2: Total Paket Selesai */}
          <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200/70 flex flex-col justify-between h-[105px]">
            <div className="flex items-center justify-between text-slate-500 text-[11px] font-semibold">
              <span>Total Paket Selesai</span>
              <div className="p-1.5 rounded-xl bg-[#EEF4FF] text-[#2563EB]">
                <Package className="w-3.5 h-3.5" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900 tracking-tight">
                {totalPaket}
              </div>
              <p className="text-[10px] text-slate-500 font-normal">
                RUP terpenuhi
              </p>
            </div>
          </div>

          {/* Card 3: Efisiensi Anggaran (Navy Card with White Text) */}
          <div className="bg-[#244371] text-white rounded-2xl p-4 shadow-sm border border-[#244371] flex flex-col justify-between h-[105px]">
            <div className="flex items-center justify-between text-blue-100/90 text-[11px] font-semibold">
              <span>Efisiensi Anggaran</span>
              <div className="p-1.5 rounded-xl bg-white/15 text-white">
                <Award className="w-3.5 h-3.5" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-black text-white tracking-tight">
                {efisiensi}
              </div>
              <p className="text-[10px] text-blue-200/80 font-normal">
                Penghematan kompetitif
              </p>
            </div>
          </div>
        </div>

        {/* ROW 2: 2 VISUALIZATION CARDS */}
        <div className="grid grid-cols-2 gap-3.5">
          {/* Card Left: Tren Realisasi Belanja Bulanan */}
          <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200/70 flex flex-col justify-between h-[230px]">
            <div>
              <h3 className="text-xs font-bold text-slate-900">
                Tren Realisasi Belanja Bulanan
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Indeks nilai realisasi terhadap puncak, Januari – Desember
              </p>
            </div>

            <div className="w-[335px] h-[160px] -ml-2 -mb-2">
              <AreaChart
                width={335}
                height={160}
                data={trendData}
                margin={{ top: 15, right: 15, left: -20, bottom: 8 }}
              >
                <defs>
                  <linearGradient id="inaprocAreaFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#41699F" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#41699F" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#F1F5F9"
                />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 8, fill: "#94a3b8" }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  domain={[0, 100]}
                  ticks={[0, 25, 50, 75, 100]}
                  tickFormatter={(v) => `${v}%`}
                  tick={{ fontSize: 8, fill: "#94a3b8" }}
                />
                <Area
                  type="monotone"
                  dataKey="percentage"
                  stroke="#41699F"
                  strokeWidth={2.2}
                  fillOpacity={1}
                  fill="url(#inaprocAreaFill)"
                  isAnimationActive={false}
                  dot={(dotProps) => {
                    // Beri highlight dot pada titik Desember (terakhir)
                    if (dotProps.index === trendData.length - 1) {
                      return (
                        <circle
                          key={dotProps.index}
                          cx={dotProps.cx}
                          cy={dotProps.cy}
                          r={4.5}
                          fill="#41699F"
                          stroke="#244371"
                          strokeWidth={2}
                        />
                      );
                    }
                    return <React.Fragment key={dotProps.index} />;
                  }}
                />
              </AreaChart>
            </div>
          </div>

          {/* Card Right: Distribusi Kategori Donut Chart */}
          <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200/70 flex flex-col justify-between h-[230px]">
            <div>
              <h3 className="text-xs font-bold text-slate-900">
                Distribusi Kategori
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Proporsi nilai pengadaan per kategori
              </p>
            </div>

            {/* Donut Chart with Centered Number Overlay */}
            <div className="relative w-full h-[115px] flex items-center justify-center -mt-1">
              <PieChart width={220} height={115}>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={36}
                  outerRadius={54}
                  paddingAngle={3}
                  isAnimationActive={false}
                >
                  {categoryData.map((entry, idx) => (
                    <Cell
                      key={`cell-${idx}`}
                      fill={entry.color}
                      stroke="#ffffff"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
              </PieChart>

              {/* Angka & teks di tengah lubang donut */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-lg font-black text-slate-800 leading-none">
                  {categoryData.length}
                </span>
                <span className="text-[9px] text-slate-400 font-medium">
                  kategori
                </span>
              </div>
            </div>

            {/* Custom 2-Column Legend */}
            <div className="grid grid-cols-2 gap-x-3 gap-y-2 pt-1 text-[10px] text-slate-700">
              {categoryData.map((cat, idx) => (
                <div key={idx} className="flex items-center gap-1.5 min-w-0">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="font-medium leading-normal whitespace-nowrap overflow-visible">
                    {cat.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ROW 3: WAWASAN & REKOMENDASI EKSEKUTIF */}
        <div className="space-y-2.5">
          {/* Header Title + Badge */}
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">
              Wawasan &amp; Rekomendasi Eksekutif
            </h2>
            <span className="bg-[#E2E8F0] text-slate-700 font-semibold text-[10px] px-3 py-1 rounded-full">
              LKPP Intelligence Engine
            </span>
          </div>

          {/* 3 Numbered Cards in Grid */}
          <div className="grid grid-cols-3 gap-3">
            {structuredList.map((item) => (
              <div
                key={item.number}
                className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200/70 flex flex-col space-y-2 min-h-[175px]"
              >
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-[#244371] text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                    {item.number}
                  </div>
                  <h3 className="font-bold text-xs text-slate-900 leading-normal overflow-visible">
                    {item.title}
                  </h3>
                </div>
                <p className="text-[10px] text-slate-600 leading-relaxed text-justify font-normal flex-1">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. FOOTER SECTION */}
      <div className="px-8 py-3.5 border-t border-slate-200/80 flex items-center justify-between text-slate-500 text-[10px]">
        <div>
          <p className="font-bold text-slate-700 text-[10px] leading-normal">
            Sistem Informasi Pengadaan Nasional &bull; INAPROC LKPP RI
          </p>
          <p className="text-[9px] text-slate-400 leading-normal">
            Data dihasilkan secara otomatis berdasarkan basis data transaksi terverifikasi.
          </p>
        </div>

        <div className="text-right font-mono text-[9px] text-slate-400 space-y-1">
          <p className="leading-normal">DOC-ID: INA-MW0CU7Z1</p>
          <p className="leading-normal">STATUS: RESMI / VALID</p>
        </div>
      </div>
    </div>
  );
}

export default InfographicTemplate;
