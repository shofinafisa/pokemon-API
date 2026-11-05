import * as XLSX from "xlsx";
import { Transaction } from "@/types/dashboard";

/**
 * Ekspor data paket pengadaan ke format Excel (.xlsx) standar OOXML
 * Kompatibel 100% dengan Microsoft Excel, LibreOffice, dan Google Sheets.
 */
export function exportTransactionsToExcel(
  transactions: Transaction[],
  filename = "laporan_pengadaan_inaproc.xlsx"
) {
  // 1. Petakan data transaksi ke array of objects dengan label header resmi
  const data = transactions.map((t) => ({
    "Kode RUP": t.invoiceNumber,
    "Instansi / Satuan Kerja": t.customerName,
    "Nama Paket Pengadaan": t.product,
    "Kategori Pengadaan": t.category,
    "Metode Pengadaan": t.methodLabel || t.procurementMethod,
    "Pagu / Nilai Realisasi (Rp)": t.amount,
    "Status": t.status,
    "Tanggal Penetapan": t.date,
    "Sumber Anggaran": t.paymentMethod || "-",
  }));

  // Buat worksheet dari json
  const worksheet = XLSX.utils.json_to_sheet(data);

  // Set lebar kolom yang proporsional dan rapi
  worksheet["!cols"] = [
    { wch: 15 }, // Kode RUP
    { wch: 42 }, // Instansi / Satker
    { wch: 48 }, // Nama Paket Pengadaan
    { wch: 22 }, // Kategori
    { wch: 26 }, // Metode Pengadaan
    { wch: 24 }, // Nilai Realisasi (Rp)
    { wch: 15 }, // Status
    { wch: 18 }, // Tanggal Penetapan
    { wch: 20 }, // Sumber Anggaran
  ];

  // Buat workbook baru dan masukkan sheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Paket Pengadaan");

  // Generate buffer biner bertipe XLSX (PKZip OOXML)
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  const finalFilename = filename.endsWith(".xlsx") ? filename : `${filename}.xlsx`;
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", finalFilename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Ekspor data paket pengadaan ke format CSV (.csv) dengan UTF-8 BOM dan header berbahasa Indonesia
 */
export function exportTransactionsToCSV(
  transactions: Transaction[],
  filename = "laporan_pengadaan_inaproc.csv"
) {
  const headers = [
    "Kode RUP",
    "Instansi / Satker",
    "Nama Paket Pengadaan",
    "Kategori",
    "Metode Pengadaan",
    "Nilai Pagu (Rp)",
    "Status Paket",
    "Tanggal Penetapan",
    "Sumber Anggaran",
  ];

  const rows = transactions.map((t) => [
    t.invoiceNumber,
    `"${(t.customerName || "").replace(/"/g, '""')}"`,
    `"${(t.product || "").replace(/"/g, '""')}"`,
    `"${(t.category || "").replace(/"/g, '""')}"`,
    `"${(t.methodLabel || t.procurementMethod || "").replace(/"/g, '""')}"`,
    t.amount.toString(),
    t.status,
    t.date,
    `"${(t.paymentMethod || "-").replace(/"/g, '""')}"`,
  ]);

  const csvContent =
    "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename.endsWith(".csv") ? filename : `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Cetak dokumen ringkasan dashboard resmi atau simpan sebagai PDF
 */
export function exportSummaryReportPDF() {
  window.print();
}
