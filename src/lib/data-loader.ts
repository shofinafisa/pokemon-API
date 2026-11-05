import fs from "fs";
import path from "path";
import { Transaction, TransactionStatus } from "@/types/dashboard";
import { FeatureKey } from "@/types/features";

export interface RawInaprocItem {
  nama_instansi?: string;
  nama_satuan_kerja?: string;
  kode_paket?: string;
  kode_rup?: string;
  tahun_anggaran?: string;
  sumber_transaksi?: string;
  sumber_dana?: string;
  nama_penyedia?: string;
  metode_pengadaan?: string;
  jenis_pengadaan?: string;
  nama_paket?: string;
  status_paket?: string;
  tahapan_pengadaan?: string;
  total_nilai?: string;
  nilai_pdn?: string;
  nilai_umk?: string;
  [key: string]: unknown;
}

export interface InaprocDatasetSummary {
  totalRecords: number;
  totalNilai: number;
  totalPdn: number;
  totalUmk: number;
  availableMinistries: string[];
  availableSatkersByMinistry: Record<string, string[]>;
  availableEselonsByMinistry: Record<string, string[]>;
  availableSatkersByEselon: Record<string, string[]>;
  availableMethods: string[];
  availableYears: number[];
}

const DATA_FILE_PATH = path.join(process.cwd(), "data", "data.json");

/**
 * Ekstraksi unit eselon secara dinamis dari nama satuan kerja
 */
export function extractEselonFromSatker(satker: string): string {
  if (!satker) return "Satuan Kerja Mandiri / Lainnya";
  const s = satker.toUpperCase();
  if (s.includes("DJBC") || s.includes("BEA DAN CUKAI") || s.includes("BC ")) return "Direktorat Jenderal Bea dan Cukai";
  if (s.includes("DJP") || s.includes("PAJAK")) return "Direktorat Jenderal Pajak";
  if (s.includes("DJKN") || s.includes("KEKAYAAN NEGARA")) return "Direktorat Jenderal Kekayaan Negara";
  if (s.includes("DJPB") || s.includes("PERBENDAHARAAN")) return "Direktorat Jenderal Perbendaharaan";
  if (s.includes("DJPPR") || s.includes("PEMBIAYAAN DAN RISIKO")) return "Direktorat Jenderal Pengelolaan Pembiayaan dan Risiko";
  if (s.includes("SEKRETARIAT JENDERAL") || s.includes("SETJEN")) return "Sekretariat Jenderal";
  if (s.includes("INSPEKTORAT JENDERAL") || s.includes("ITJEN")) return "Inspektorat Jenderal";
  if (s.includes("BADAN KEBIJAKAN FISKAL") || s.includes("BKF")) return "Badan Kebijakan Fiskal";
  if (s.includes("BPPK") || s.includes("PELATIHAN KEUANGAN") || s.includes("DIKLAT")) return "Badan Pendidikan dan Pelatihan Keuangan";
  return "Satuan Kerja Mandiri / Lainnya";
}

// In-memory cache for fast server responses
let cachedTransactions: Transaction[] | null = null;
let cachedSummary: InaprocDatasetSummary | null = null;
let cachedFileMtime = 0;

/**
 * Pemetaan metode pengadaan Inaproc ke FeatureKey internal
 */
export function mapMetodeToFeatureKey(metode?: string): FeatureKey {
  if (!metode) return "pengadaan_langsung";
  const normalized = metode.trim().toLowerCase();

  if (normalized.includes("pengadaan langsung")) return "pengadaan_langsung";
  if (normalized.includes("e-purchasing") || normalized.includes("epurchasing")) return "e_purchasing";
  if (normalized.includes("penunjukan langsung")) return "penunjukan_langsung";
  if (normalized.includes("tender cepat")) return "tender_cepat";
  if (normalized.includes("tender internasional")) return "tender_internasional";
  if (normalized.includes("tender")) return "tender";
  if (normalized.includes("seleksi")) return "seleksi";
  if (normalized.includes("swakelola")) return "swakelola";
  if (normalized.includes("dikecualikan")) return "dikecualikan";
  if (normalized.includes("darurat")) return "pengadaan_darurat";
  if (normalized.includes("sayembara")) return "sayembara";
  if (normalized.includes("kontes")) return "kontes";

  return "pengadaan_langsung";
}

/**
 * Normalisasi status paket Inaproc ke TransactionStatus
 */
export function mapStatusPaket(status?: string): TransactionStatus {
  if (!status) return "completed";
  const s = status.trim().toUpperCase();

  if (s.includes("SELESAI") || s.includes("COMPLETED")) {
    return "completed";
  }
  if (s.includes("BERJALAN") || s.includes("BERLANGSUNG") || s.includes("PROCESS") || s.includes("ADDENDUM")) {
    return "processing";
  }
  if (s.includes("PAYMENT") || s.includes("SANGGAH") || s.includes("VERIFIKASI")) {
    return "pending";
  }
  return "completed";
}

/**
 * Parsing dan normalisasi 1 record Inaproc menjadi interface Transaction
 */
export function transformRawToTransaction(item: RawInaprocItem, index: number): Transaction {
  const amount = item.total_nilai ? parseFloat(String(item.total_nilai).replace(/[^0-9.-]+/g, "")) || 0 : 0;
  const nilaiPdn = item.nilai_pdn ? parseFloat(String(item.nilai_pdn).replace(/[^0-9.-]+/g, "")) || 0 : 0;
  const nilaiUmk = item.nilai_umk ? parseFloat(String(item.nilai_umk).replace(/[^0-9.-]+/g, "")) || 0 : 0;

  const yearNum = item.tahun_anggaran ? parseInt(item.tahun_anggaran, 10) || 2026 : 2026;
  const dateStr = `${yearNum}-01-15`;

  const instansiName = item.nama_instansi?.trim() || "Instansi Lainnya";
  const satkerName = item.nama_satuan_kerja?.trim() || "Satuan Kerja Umum";
  const metodeStr = item.metode_pengadaan?.trim() || "Pengadaan Langsung";
  const featureKey = mapMetodeToFeatureKey(metodeStr);

  // Deteksi jenis instansi secara dinamis
  let jenisInstansi = "Kementerian";
  const insUpper = instansiName.toUpperCase();
  if (insUpper.includes("KEMENTERIAN") || insUpper.includes("BENDAHARA UMUM NEGARA")) {
    jenisInstansi = "Kementerian";
  } else if (insUpper.includes("LEMBAGA") || insUpper.includes("BADAN")) {
    jenisInstansi = "Lembaga";
  } else if (insUpper.includes("PROVINSI")) {
    jenisInstansi = "Pemerintah Daerah Provinsi";
  } else if (insUpper.includes("KOTA") || insUpper.includes("KABUPATEN")) {
    jenisInstansi = "Pemerintah Daerah Kab/Kota";
  }

  return {
    id: item.kode_paket?.trim() || `tx_${yearNum}_${index + 1}`,
    invoiceNumber: item.kode_rup?.trim() || item.kode_paket?.trim() || `RUP-${yearNum}-${index + 1}`,
    customerName: item.nama_penyedia?.trim() && item.nama_penyedia.trim() !== "-" 
      ? item.nama_penyedia.trim() 
      : "Penyedia Terverifikasi",
    customerEmail: "rekanan@inaproc.id",
    customerAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
    product: item.nama_paket?.trim() || "Paket Pengadaan Barang/Jasa",
    category: item.jenis_pengadaan?.trim() || "Pengadaan Barang",
    procurementMethod: featureKey,
    methodLabel: metodeStr,
    amount,
    status: mapStatusPaket(item.status_paket),
    date: dateStr,
    paymentMethod: item.sumber_dana?.trim() || "APBN",
    jenisInstansi,
    instansi: instansiName,
    satker: satkerName,
    eselon: extractEselonFromSatker(satkerName),
  };
}

/**
 * Muat seluruh dataset dari data/data.json
 * Menggunakan caching berbasis file modified time agar tidak membaca ulang setiap request
 */
export function loadInaprocData(): {
  transactions: Transaction[];
  summary: InaprocDatasetSummary;
} {
  try {
    if (!fs.existsSync(DATA_FILE_PATH)) {
      console.warn(`File ${DATA_FILE_PATH} tidak ditemukan.`);
      return {
        transactions: [],
        summary: {
          totalRecords: 0,
          totalNilai: 0,
          totalPdn: 0,
          totalUmk: 0,
          availableMinistries: [],
          availableSatkersByMinistry: {},
          availableEselonsByMinistry: {},
          availableSatkersByEselon: {},
          availableMethods: [],
          availableYears: [2026],
        },
      };
    }

    const stats = fs.statSync(DATA_FILE_PATH);
    if (cachedTransactions && cachedSummary && cachedFileMtime === stats.mtimeMs) {
      return {
        transactions: cachedTransactions,
        summary: cachedSummary,
      };
    }

    const rawContent = fs.readFileSync(DATA_FILE_PATH, "utf-8");
    const rawItems: RawInaprocItem[] = JSON.parse(rawContent);

    const transactions: Transaction[] = [];
    const ministriesSet = new Set<string>();
    const satkersByMinistry: Record<string, Set<string>> = {};
    const eselonsByMinistry: Record<string, Set<string>> = {};
    const satkersByEselon: Record<string, Set<string>> = {};
    const methodsSet = new Set<string>();
    const yearsSet = new Set<number>();

    let totalNilai = 0;
    let totalPdn = 0;
    let totalUmk = 0;

    for (let i = 0; i < rawItems.length; i++) {
      const item = rawItems[i];
      const tx = transformRawToTransaction(item, i);
      transactions.push(tx);

      if (tx.instansi) {
        ministriesSet.add(tx.instansi);
        if (!satkersByMinistry[tx.instansi]) {
          satkersByMinistry[tx.instansi] = new Set<string>();
        }
        if (!eselonsByMinistry[tx.instansi]) {
          eselonsByMinistry[tx.instansi] = new Set<string>();
        }
        if (tx.satker) {
          satkersByMinistry[tx.instansi].add(tx.satker);
        }
        if (tx.eselon) {
          eselonsByMinistry[tx.instansi].add(tx.eselon);
          if (!satkersByEselon[tx.eselon]) {
            satkersByEselon[tx.eselon] = new Set<string>();
          }
          if (tx.satker) {
            satkersByEselon[tx.eselon].add(tx.satker);
          }
        }
      }

      if (tx.methodLabel) methodsSet.add(tx.methodLabel);

      const yr = parseInt(item.tahun_anggaran || "2026", 10);
      if (yr) yearsSet.add(yr);

      const n = item.total_nilai ? parseFloat(String(item.total_nilai).replace(/[^0-9.-]+/g, "")) || 0 : 0;
      const pdn = item.nilai_pdn ? parseFloat(String(item.nilai_pdn).replace(/[^0-9.-]+/g, "")) || 0 : 0;
      const umk = item.nilai_umk ? parseFloat(String(item.nilai_umk).replace(/[^0-9.-]+/g, "")) || 0 : 0;

      totalNilai += n;
      totalPdn += pdn;
      totalUmk += umk;
    }

    const serializedSatkers: Record<string, string[]> = {};
    for (const [k, v] of Object.entries(satkersByMinistry)) {
      serializedSatkers[k] = Array.from(v).sort();
    }

    const serializedEselons: Record<string, string[]> = {};
    for (const [k, v] of Object.entries(eselonsByMinistry)) {
      serializedEselons[k] = Array.from(v).sort();
    }

    const serializedSatkersByEselon: Record<string, string[]> = {};
    for (const [k, v] of Object.entries(satkersByEselon)) {
      serializedSatkersByEselon[k] = Array.from(v).sort();
    }

    const summary: InaprocDatasetSummary = {
      totalRecords: transactions.length,
      totalNilai,
      totalPdn,
      totalUmk,
      availableMinistries: Array.from(ministriesSet).sort(),
      availableSatkersByMinistry: serializedSatkers,
      availableEselonsByMinistry: serializedEselons,
      availableSatkersByEselon: serializedSatkersByEselon,
      availableMethods: Array.from(methodsSet).sort(),
      availableYears: Array.from(yearsSet).sort((a, b) => a - b),
    };

    cachedTransactions = transactions;
    cachedSummary = summary;
    cachedFileMtime = stats.mtimeMs;

    return { transactions, summary };
  } catch (error) {
    console.error("Gagal memuat dataset Inaproc data/data.json:", error);
    return {
      transactions: cachedTransactions || [],
      summary: cachedSummary || {
        totalRecords: 0,
        totalNilai: 0,
        totalPdn: 0,
        totalUmk: 0,
        availableMinistries: [],
        availableSatkersByMinistry: {},
        availableEselonsByMinistry: {},
        availableSatkersByEselon: {},
        availableMethods: [],
        availableYears: [2026],
      },
    };
  }
}

