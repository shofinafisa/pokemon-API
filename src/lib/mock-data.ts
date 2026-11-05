import { User } from "@/types/auth";
import { FeatureKey, FeatureMetadata } from "@/types/features";
import { KPICardData, SalesMonthlyData, CategoryData, Transaction } from "@/types/dashboard";

export const DEMO_USERS: Record<string, { password: string; user: User }> = {
  "admin@dashboard.com": {
    password: "admin123",
    user: {
      id: "usr_admin_001",
      name: "Alexander Vance",
      email: "admin@dashboard.com",
      role: "admin",
      title: "Kepala Pusat Pengelolaan Pengadaan (Admin LKPP)",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256",
    },
  },
  "user@dashboard.com": {
    password: "user123",
    user: {
      id: "usr_member_002",
      name: "Sarah Jenkins",
      email: "user@dashboard.com",
      role: "user",
      title: "Pejabat Pembuat Komitmen (PPK Satker)",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=256",
    },
  },
};

export const FEATURE_CONFIGS: FeatureMetadata[] = [
  {
    key: "penunjukan_langsung",
    label: "Penunjukan Langsung",
    description: "Metode pemilihan Penyedia barang/jasa dalam keadaan tertentu tanpa kompetisi terbuka sesuai regulasi LKPP.",
    category: "Pemilihan Langsung",
    iconName: "UserCheck",
    badgeColor: "#3b82f6",
    defaultEnabled: true,
  },
  {
    key: "pengadaan_langsung",
    label: "Pengadaan Langsung",
    description: "Pengadaan Barang/Konstruksi/Jasa Lainnya s.d. Rp 200 juta, atau Jasa Konsultansi s.d. Rp 100 juta.",
    category: "Pemilihan Langsung",
    iconName: "FileCheck2",
    badgeColor: "#6366f1",
    defaultEnabled: true,
  },
  {
    key: "e_purchasing",
    label: "E-Purchasing",
    description: "Tata cara pembelian barang/jasa melalui Katalog Elektronik LKPP (E-Katalog Nasional, Sektoral, & Lokal).",
    category: "E-Katalog",
    iconName: "ShoppingCart",
    badgeColor: "#10b981",
    defaultEnabled: true,
  },
  {
    key: "swakelola",
    label: "Swakelola",
    description: "Pengadaan yang direncanakan, dikerjakan, dan diawasi sendiri oleh K/L/PD atau kelompok masyarakat binaan.",
    category: "Khusus & Swakelola",
    iconName: "Building2",
    badgeColor: "#14b8a6",
    defaultEnabled: true,
  },
  {
    key: "sayembara",
    label: "Sayembara",
    description: "Metode pemilihan Penyedia untuk pekerjaan yang menghasilkan gagasan, kreativitas, seni, atau desain arsitektur.",
    category: "Tender & Kompetisi",
    iconName: "Award",
    badgeColor: "#f59e0b",
    defaultEnabled: true,
  },
  {
    key: "kontes",
    label: "Kontes",
    description: "Metode pemilihan Penyedia untuk barang yang tidak mempunyai harga pasar pasti dan dinilai berdasar kriteria juri.",
    category: "Tender & Kompetisi",
    iconName: "Trophy",
    badgeColor: "#ea580c",
    defaultEnabled: true,
  },
  {
    key: "tender",
    label: "Tender",
    description: "Metode pemilihan Penyedia Barang/Pekerjaan Konstruksi/Jasa Lainnya terbuka secara kompetitif di atas Rp 200 juta.",
    category: "Tender & Kompetisi",
    iconName: "Gavel",
    badgeColor: "#8b5cf6",
    defaultEnabled: true,
  },
  {
    key: "tender_cepat",
    label: "Tender Cepat",
    description: "Tender singkat otomatis berbasis database kualifikasi SIKaP untuk barang/jasa yang terstandarisasi.",
    category: "Tender & Kompetisi",
    iconName: "Zap",
    badgeColor: "#06b6d4",
    defaultEnabled: true,
  },
  {
    key: "tender_internasional",
    label: "Tender Internasional",
    description: "Pengadaan berskala global yang didanai pinjaman/hibah luar negeri (PHLN) atau bernilai di atas ambang Perpres.",
    category: "Tender & Kompetisi",
    iconName: "Globe",
    badgeColor: "#0284c7",
    defaultEnabled: true,
  },
  {
    key: "pengadaan_darurat",
    label: "Pengadaan Darurat",
    description: "Penanganan tanggap darurat bencana alam, non-alam, dan krisis untuk kecepatan pemulihan keselamatan publik.",
    category: "Khusus & Swakelola",
    iconName: "AlertTriangle",
    badgeColor: "#ef4444",
    defaultEnabled: true,
  },
  {
    key: "seleksi",
    label: "Seleksi",
    description: "Metode pemilihan Penyedia untuk Jasa Konsultansi bernilai di atas Rp 100 juta dengan evaluasi mutu & biaya.",
    category: "Tender & Kompetisi",
    iconName: "SearchCode",
    badgeColor: "#a855f7",
    defaultEnabled: true,
  },
  {
    key: "dikecualikan",
    label: "Dikecualikan",
    description: "Pengadaan pada Badan Layanan Umum (BLU), tarif resmi pemerintah, atau riset strategis yang dikecualikan.",
    category: "Khusus & Swakelola",
    iconName: "ShieldAlert",
    badgeColor: "#64748b",
    defaultEnabled: true,
  },
];

export const MOCK_KPIS_BASE: KPICardData[] = [
  {
    id: "kpi-revenue",
    title: "Total Nilai Realisasi Pengadaan",
    value: "Rp 184,8 Miliar",
    numericValue: 184850000000,
    change: 14.8,
    trend: "up",
    subtitle: "Realisasi APBN/APBD berjalan",
    iconName: "dollar",
  },
  {
    id: "kpi-orders",
    title: "Total Paket Pengadaan",
    value: "1.428 Paket",
    numericValue: 1428,
    change: 8.4,
    trend: "up",
    subtitle: "Paket terverifikasi SPSE / SiRUP",
    iconName: "shopping-bag",
  },
  {
    id: "kpi-conversion",
    title: "Efisiensi Nilai Pengadaan",
    value: "11,84%",
    numericValue: 11.84,
    change: 2.1,
    trend: "up",
    subtitle: "Rasio penghematan HPS vs Kontrak",
    iconName: "percent",
  },
  {
    id: "kpi-aov",
    title: "Rata-rata Nilai Paket Kontrak",
    value: "Rp 129,4 Juta",
    numericValue: 129400000,
    change: 5.6,
    trend: "up",
    subtitle: "Rata-rata nilai per paket aktif",
    iconName: "trending-up",
  },
];

export const MOCK_SALES_TREND_BASE: SalesMonthlyData[] = [
  { month: "Jan", revenue: 8400000000, orders: 82, growth: 5.2 },
  { month: "Feb", revenue: 9200000000, orders: 89, growth: 9.5 },
  { month: "Mar", revenue: 14500000000, orders: 121, growth: 14.1 },
  { month: "Apr", revenue: 11800000000, orders: 94, growth: -6.7 },
  { month: "May", revenue: 16400000000, orders: 132, growth: 16.3 },
  { month: "Jun", revenue: 19800000000, orders: 154, growth: 12.2 },
  { month: "Jul", revenue: 15100000000, orders: 118, growth: -5.4 },
  { month: "Aug", revenue: 18600000000, orders: 141, growth: 12.4 },
  { month: "Sep", revenue: 21200000000, orders: 158, growth: 4.4 },
  { month: "Oct", revenue: 24800000000, orders: 172, growth: 11.2 },
  { month: "Nov", revenue: 21200000000, orders: 148, growth: -3.8 },
  { month: "Dec", revenue: 26850000000, orders: 189, growth: 13.3 },
];

export const MOCK_CATEGORIES_BASE: CategoryData[] = [
  { key: "e_purchasing", name: "E-Purchasing", value: 52400000000, orders: 480, color: "#10b981", percentage: 28 },
  { key: "tender", name: "Tender", value: 46200000000, orders: 210, color: "#8b5cf6", percentage: 25 },
  { key: "swakelola", name: "Swakelola", value: 24500000000, orders: 140, color: "#14b8a6", percentage: 13 },
  { key: "pengadaan_langsung", name: "Pengadaan Langsung", value: 18200000000, orders: 280, color: "#6366f1", percentage: 10 },
  { key: "tender_cepat", name: "Tender Cepat", value: 14800000000, orders: 95, color: "#06b6d4", percentage: 8 },
  { key: "penunjukan_langsung", name: "Penunjukan Langsung", value: 9400000000, orders: 62, color: "#3b82f6", percentage: 5 },
  { key: "seleksi", name: "Seleksi", value: 7200000000, orders: 45, color: "#a855f7", percentage: 4 },
  { key: "tender_internasional", name: "Tender Internasional", value: 5400000000, orders: 12, color: "#0284c7", percentage: 3 },
  { key: "pengadaan_darurat", name: "Pengadaan Darurat", value: 3200000000, orders: 24, color: "#ef4444", percentage: 2 },
  { key: "sayembara", name: "Sayembara", value: 1450000000, orders: 8, color: "#f59e0b", percentage: 1 },
  { key: "kontes", name: "Kontes", value: 1100000000, orders: 10, color: "#ea580c", percentage: 1 },
  { key: "dikecualikan", name: "Dikecualikan", value: 1000000000, orders: 18, color: "#64748b", percentage: 1 },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: "pkt-1001",
    invoiceNumber: "RUP-2026-001",
    customerName: "Kementerian Pekerjaan Umum dan Perumahan Rakyat (PUPR)",
    customerEmail: "satker.jalan@pupr.go.id",
    customerAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=128",
    product: "Pembangunan Jembatan Gantung Penghubung Antar Desa Wilayah III",
    category: "Pekerjaan Konstruksi",
    procurementMethod: "tender",
    methodLabel: "Tender",
    amount: 14500000000,
    status: "completed",
    date: "2026-10-25",
    paymentMethod: "APBN 2026 (Rupiah Murni)",
    jenisInstansi: "Kementerian",
    instansi: "Kementerian Pekerjaan Umum dan Perumahan Rakyat (PUPR)",
    eselon: "Direktorat Jenderal Bina Marga",
    satker: "Balai Pelaksanaan Jalan Nasional Wilayah I",
  },
  {
    id: "pkt-1002",
    invoiceNumber: "RUP-2026-002",
    customerName: "Kementerian Kesehatan RI",
    customerEmail: "ppk.alkes@kemkes.go.id",
    customerAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=128",
    product: "Pengadaan Alat Ventilator & Monitoring ICU Rumah Sakit Rujukan",
    category: "Barang",
    procurementMethod: "e_purchasing",
    methodLabel: "E-Purchasing",
    amount: 8200000000,
    status: "completed",
    date: "2026-10-24",
    paymentMethod: "E-Katalog Nasional (APBN)",
    jenisInstansi: "Kementerian",
    instansi: "Kementerian Kesehatan",
    eselon: "Direktorat Jenderal Pelayanan Kesehatan",
    satker: "Biro Pengadaan dan Pengelolaan BMN Kemkes",
  },
  {
    id: "pkt-1003",
    invoiceNumber: "RUP-2026-003",
    customerName: "Pemerintah Provinsi DKI Jakarta (Dinas Pendidikan)",
    customerEmail: "sarpras@disdik.jakarta.go.id",
    customerAvatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=128",
    product: "Renovasi Gedung Laboratorium Komputer SMK Negeri Jakarta Timur",
    category: "Pekerjaan Konstruksi",
    procurementMethod: "tender_cepat",
    methodLabel: "Tender Cepat",
    amount: 3850000000,
    status: "processing",
    date: "2026-10-23",
    paymentMethod: "APBD 2026 DKI Jakarta",
    jenisInstansi: "Pemerintah Daerah Provinsi",
    instansi: "Pemerintah Provinsi DKI Jakarta",
    eselon: "Dinas Pendidikan Provinsi DKI Jakarta",
    satker: "Suban Pengadaan Wilayah Jakarta Timur",
  },
  {
    id: "pkt-1004",
    invoiceNumber: "RUP-2026-004",
    customerName: "Badan Nasional Penanggulangan Bencana (BNPB)",
    customerEmail: "tanggap.darurat@bnpb.go.id",
    customerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=128",
    product: "Penyediaan Tenda Pengungsian & Logistik Tanggap Bencana Gempa",
    category: "Barang",
    procurementMethod: "pengadaan_darurat",
    methodLabel: "Pengadaan Darurat",
    amount: 2480000000,
    status: "completed",
    date: "2026-10-22",
    paymentMethod: "Dana Siap Pakai (DSP BNPB)",
    jenisInstansi: "Lembaga",
    instansi: "Badan Nasional Penanggulangan Bencana (BNPB)",
    eselon: "Kedeputian Bidang Logistik dan Peralatan",
    satker: "Satker Tanggap Darurat Bencana",
  },
  {
    id: "pkt-1005",
    invoiceNumber: "RUP-2026-005",
    customerName: "Kementerian Komunikasi dan Informatika (Kominfo)",
    customerEmail: "it.infrastruktur@kominfo.go.id",
    customerAvatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=128",
    product: "Pengembangan Core Backbone Jaringan Serat Optik Wilayah 3T",
    category: "Pekerjaan Konstruksi",
    procurementMethod: "tender_internasional",
    methodLabel: "Tender Internasional",
    amount: 28500000000,
    status: "pending",
    date: "2026-10-21",
    paymentMethod: "Pinjaman Hibah Luar Negeri (PHLN)",
    jenisInstansi: "Kementerian",
    instansi: "Kementerian Komunikasi dan Informatika",
    eselon: "Badan Aksesibilitas Telekomunikasi dan Informasi (BAKTI)",
    satker: "Satker Infrastruktur Serat Optik 3T",
  },
  {
    id: "pkt-1006",
    invoiceNumber: "RUP-2026-006",
    customerName: "Dinas Pertanian dan Ketahanan Pangan Pemprov Jatim",
    customerEmail: "poktan.binaan@jatimprov.go.id",
    customerAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=128",
    product: "Pembuatan Saluran Irigasi Tersier Berbasis Partisipasi Poktan",
    category: "Pekerjaan Konstruksi",
    procurementMethod: "swakelola",
    methodLabel: "Swakelola",
    amount: 1250000000,
    status: "completed",
    date: "2025-08-20",
    paymentMethod: "Swakelola Tipe IV (APBD)",
    jenisInstansi: "Pemerintah Daerah Provinsi",
    instansi: "Pemerintah Provinsi Jawa Timur",
    eselon: "Dinas Pertanian dan Ketahanan Pangan",
    satker: "Unit Pengelola Sarana Pertanian Terpadu",
  },
  {
    id: "pkt-1007",
    invoiceNumber: "RUP-2024-007",
    customerName: "Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi",
    customerEmail: "diktiristek@kemdikbud.go.id",
    customerAvatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=128",
    product: "Sayembara Konsep Desain Arsitektur Kompleks Galeri Budaya Nusantara",
    category: "Jasa Konsultansi",
    procurementMethod: "sayembara",
    methodLabel: "Sayembara",
    amount: 750000000,
    status: "completed",
    date: "2024-06-19",
    paymentMethod: "APBN 2024 Ditjen Kebudayaan",
    jenisInstansi: "Kementerian",
    instansi: "Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi",
    eselon: "Direktorat Jenderal Kebudayaan",
    satker: "Galeri Budaya Nusantara",
  },
  {
    id: "pkt-1008",
    invoiceNumber: "RUP-2024-008",
    customerName: "Kementerian Perhubungan RI (Ditjen Hubla)",
    customerEmail: "navigasi.laut@dephub.go.id",
    customerAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=128",
    product: "Pengadaan Perangkat Radar AIS Khusus Pelabuhan Perintis",
    category: "Barang",
    procurementMethod: "penunjukan_langsung",
    methodLabel: "Penunjukan Langsung",
    amount: 1850000000,
    status: "completed",
    date: "2024-03-18",
    paymentMethod: "APBN 2024 DIPA Hubla",
    jenisInstansi: "Kementerian",
    instansi: "Kementerian Perhubungan",
    eselon: "Direktorat Jenderal Perhubungan Laut",
    satker: "Distrik Navigasi Tanjung Priok",
  },
  {
    id: "pkt-1009",
    invoiceNumber: "RUP-2023-009",
    customerName: "Badan Perencanaan Pembangunan Nasional (Bappenas)",
    customerEmail: "kajian.makro@bappenas.go.id",
    customerAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=128",
    product: "Kajian Komprehensif Evaluasi Dampak Sosial Ekonomi Infrastruktur",
    category: "Jasa Konsultansi",
    procurementMethod: "seleksi",
    methodLabel: "Seleksi",
    amount: 2150000000,
    status: "processing",
    date: "2023-11-17",
    paymentMethod: "APBN 2023 Bappenas",
    jenisInstansi: "Lembaga",
    instansi: "Badan Perencanaan Pembangunan Nasional (Bappenas)",
    eselon: "Kedeputian Bidang Ekonomi",
    satker: "Biro Perencanaan dan Kerja Sama Teknik",
  },
  {
    id: "pkt-1010",
    invoiceNumber: "RUP-2023-010",
    customerName: "Sekretariat DPRD Kota Bandung",
    customerEmail: "umum@dprd.bandung.go.id",
    customerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=128",
    product: "Pengadaan Komputer PC & Printer Ruang Komisi DPRD Kota Bandung",
    category: "Barang",
    procurementMethod: "pengadaan_langsung",
    methodLabel: "Pengadaan Langsung",
    amount: 145000000,
    status: "completed",
    date: "2023-05-16",
    paymentMethod: "APBD 2023 Kota Bandung",
    jenisInstansi: "Pemerintah Daerah Kab/Kota",
    instansi: "Pemerintah Kota Bandung",
    eselon: "Sekretariat DPRD",
    satker: "Bagian Umum dan Perlengkapan",
  },
  {
    id: "pkt-1011",
    invoiceNumber: "RUP-2022-011",
    customerName: "Lembaga Kebijakan Pengadaan Barang/Jasa Pemerintah (LKPP)",
    customerEmail: "inaproc@lkpp.go.id",
    customerAvatar: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=128",
    product: "Pengembangan Modul Integrasi Big Data Monitoring Pengadaan Nasional",
    category: "Jasa Lainnya",
    procurementMethod: "kontes",
    methodLabel: "Kontes",
    amount: 450000000,
    status: "completed",
    date: "2022-09-15",
    paymentMethod: "APBN 2022 LKPP",
    jenisInstansi: "Lembaga",
    instansi: "Lembaga Kebijakan Pengadaan Barang/Jasa Pemerintah (LKPP)",
    eselon: "Kedeputian Bidang Monitoring-Evaluasi dan Pengembangan Sistem Informasi",
    satker: "Direktorat Pengembangan Sistem Pengadaan Secara Elektronik",
  },
  {
    id: "pkt-1012",
    invoiceNumber: "RUP-2022-012",
    customerName: "Rumah Sakit Umum Pusat Dr. Cipto Mangunkusumo (BLU RSCM)",
    customerEmail: "logistik@rscm.co.id",
    customerAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=128",
    product: "Penyediaan Reagen Laboratorium Khusus Patologi Anatomi Terintegrasi",
    category: "Barang",
    procurementMethod: "dikecualikan",
    methodLabel: "Dikecualikan",
    amount: 1980000000,
    status: "completed",
    date: "2022-04-14",
    paymentMethod: "Pendapatan BLU RSCM",
    jenisInstansi: "Kementerian",
    instansi: "Kementerian Kesehatan",
    eselon: "Direktorat Jenderal Pelayanan Kesehatan",
    satker: "Unit Layanan Pengadaan RSCM",
  },
  {
    id: "pkt-1013",
    invoiceNumber: "RUP-2021-013",
    customerName: "Kementerian Kelautan dan Perikanan (KKP)",
    customerEmail: "sarpras.nelayan@kkp.go.id",
    customerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=128",
    product: "Pengadaan Kapal Patroli Pengawas Sumber Daya Kelautan",
    category: "Barang",
    procurementMethod: "tender",
    methodLabel: "Tender",
    amount: 18900000000,
    status: "completed",
    date: "2021-08-13",
    paymentMethod: "APBN 2021 Ditjen PSDKP",
    jenisInstansi: "Kementerian",
    instansi: "Kementerian Kelautan dan Perikanan",
    eselon: "Direktorat Jenderal PSDKP",
    satker: "Pangkalan PSDKP Benoa",
  },
  {
    id: "pkt-1014",
    invoiceNumber: "RUP-2021-014",
    customerName: "Pemerintah Kota Surabaya (Dinas Kesehatan)",
    customerEmail: "farmasi@surabaya.go.id",
    customerAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=128",
    product: "Pengadaan Obat-obatan Esensial Puskesmas Melalui E-Katalog",
    category: "Barang",
    procurementMethod: "e_purchasing",
    methodLabel: "E-Purchasing",
    amount: 4750000000,
    status: "completed",
    date: "2021-03-12",
    paymentMethod: "E-Katalog Lokal Surabaya",
    jenisInstansi: "Pemerintah Daerah Kab/Kota",
    instansi: "Pemerintah Kota Surabaya",
    eselon: "Dinas Kesehatan Kota Surabaya",
    satker: "UPTD Pengelolaan Obat dan Farmasi",
  },
  {
    id: "pkt-1015",
    invoiceNumber: "RUP-2020-015",
    customerName: "Badan Meteorologi, Klimatologi, dan Geofisika (BMKG)",
    customerEmail: "seismologi@bmkg.go.id",
    customerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=128",
    product: "Pemeliharaan Berkala Jaringan Sensor Seismograf & Accelerograph",
    category: "Jasa Lainnya",
    procurementMethod: "penunjukan_langsung",
    methodLabel: "Penunjukan Langsung",
    amount: 1120000000,
    status: "completed",
    date: "2020-10-11",
    paymentMethod: "APBN 2020 DIPA BMKG",
    jenisInstansi: "Lembaga",
    instansi: "Badan Meteorologi, Klimatologi, dan Geofisika (BMKG)",
    eselon: "Kedeputian Bidang Geofisika",
    satker: "Pusat Seismologi Teknik",
  },
  {
    id: "pkt-1016",
    invoiceNumber: "RUP-2020-016",
    customerName: "Kementerian Pertahanan RI",
    customerEmail: "logistik@kemhan.go.id",
    customerAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=128",
    product: "Pengadaan Sistem Komunikasi Satelit Taktis Terenkripsi Militer",
    category: "Barang",
    procurementMethod: "dikecualikan",
    methodLabel: "Dikecualikan",
    amount: 32000000000,
    status: "completed",
    date: "2020-05-10",
    paymentMethod: "Alpalhankam Khusus (Dikecualikan)",
    jenisInstansi: "Kementerian",
    instansi: "Kementerian Pertahanan",
    eselon: "Badan Sarana Pertahanan (Baranahan)",
    satker: "Pusat Pengadaan Baranahan",
  },
];

export interface CascadingFilterInput {
  jenisInstansi?: string[];
  instansi?: string[];
  eselon?: string[];
  satker?: string[];
}

export function filterTransactionsList(
  transactions: Transaction[],
  filters: {
    activeKeys?: FeatureKey[];
    yearRange?: [number, number];
    cascading?: CascadingFilterInput;
  }
): Transaction[] {
  const { activeKeys, yearRange = [2020, 2026], cascading } = filters;
  const activeSet = activeKeys ? new Set(activeKeys) : null;
  const [minY, maxY] = yearRange;

  const jenisFilter = cascading?.jenisInstansi || [];
  const instansiFilter = cascading?.instansi || [];
  const eselonFilter = cascading?.eselon || [];
  const satkerFilter = cascading?.satker || [];

  return transactions.filter((tx) => {
    // 1. Procurement method
    if (activeSet && !activeSet.has(tx.procurementMethod)) {
      return false;
    }

    // 2. Year range
    const txYear = parseInt(tx.date.substring(0, 4), 10);
    if (txYear < minY || txYear > maxY) {
      return false;
    }

    // 3. Jenis Instansi (Multiple choice: if selected, must match one)
    if (jenisFilter.length > 0) {
      if (!tx.jenisInstansi || !jenisFilter.includes(tx.jenisInstansi)) {
        return false;
      }
    }

    // 4. Instansi (Multiple choice: if selected, must match one)
    if (instansiFilter.length > 0) {
      if (!tx.instansi || !instansiFilter.includes(tx.instansi)) {
        return false;
      }
    }

    // 5. Eselon (Multiple choice: if selected, must match one)
    if (eselonFilter.length > 0) {
      if (!tx.eselon || !eselonFilter.includes(tx.eselon)) {
        return false;
      }
    }

    // 6. Satker (Multiple choice: if selected, must match one)
    if (satkerFilter.length > 0) {
      if (!tx.satker || !satkerFilter.includes(tx.satker)) {
        return false;
      }
    }

    return true;
  });
}

// Helper to calculate dynamic dashboard stats based on active procurement methods, year range, cascading filters, and custom transaction list
export function calculateDynamicStats(
  activeKeys: FeatureKey[],
  yearRange?: [number, number],
  cascading?: CascadingFilterInput,
  transactionsList?: Transaction[]
) {
  const source = transactionsList && transactionsList.length > 0 ? transactionsList : MOCK_TRANSACTIONS;
  const filtered = filterTransactionsList(source, {
    activeKeys,
    yearRange,
    cascading,
  });

  const totalAmount = filtered.reduce((acc, curr) => acc + curr.amount, 0);
  const totalPackages = filtered.length;
  const avgAmount = totalPackages > 0 ? Math.round(totalAmount / totalPackages) : 0;
  const efficiencyRatio = totalPackages > 0 ? (7.15 + (totalPackages % 4) * 0.4).toFixed(2) : "0.00";

  return {
    filteredTransactions: filtered,
    totalAmount,
    totalPackages,
    avgAmount,
    efficiencyRatio,
  };
}


export const METHOD_SLUGS: Record<string, FeatureKey> = {
  "penunjukan-langsung": "penunjukan_langsung",
  "pengadaan-langsung": "pengadaan_langsung",
  "e-purchasing": "e_purchasing",
  "swakelola": "swakelola",
  "sayembara": "sayembara",
  "kontes": "kontes",
  "tender": "tender",
  "tender-cepat": "tender_cepat",
  "tender-internasional": "tender_internasional",
  "pengadaan-darurat": "pengadaan_darurat",
  "seleksi": "seleksi",
  "dikecualikan": "dikecualikan",
  "penunjukan_langsung": "penunjukan_langsung",
  "pengadaan_langsung": "pengadaan_langsung",
  "e_purchasing": "e_purchasing",
  "tender_cepat": "tender_cepat",
  "tender_internasional": "tender_internasional",
  "pengadaan_darurat": "pengadaan_darurat",
};

export const FEATURE_TO_SLUG: Record<FeatureKey, string> = {
  penunjukan_langsung: "penunjukan-langsung",
  pengadaan_langsung: "pengadaan-langsung",
  e_purchasing: "e-purchasing",
  swakelola: "swakelola",
  sayembara: "sayembara",
  kontes: "kontes",
  tender: "tender",
  tender_cepat: "tender-cepat",
  tender_internasional: "tender-internasional",
  pengadaan_darurat: "pengadaan-darurat",
  seleksi: "seleksi",
  dikecualikan: "dikecualikan",
};

export function getMethodConfigBySlug(slug: string): FeatureMetadata | undefined {
  const normalized = slug.trim().toLowerCase();
  const key = METHOD_SLUGS[normalized];
  if (!key) return undefined;
  return FEATURE_CONFIGS.find((cfg) => cfg.key === key);
}
