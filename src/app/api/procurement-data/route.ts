import { NextRequest, NextResponse } from "next/server";
import { loadInaprocData } from "@/lib/data-loader";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const instansiFilter = searchParams.get("instansi");
    const methodFilter = searchParams.get("metode");

    const { transactions, summary } = loadInaprocData();

    let filtered = transactions;

    if (instansiFilter && instansiFilter !== "all") {
      filtered = filtered.filter(
        (tx) => tx.instansi?.toLowerCase() === instansiFilter.toLowerCase()
      );
    }

    if (methodFilter && methodFilter !== "all") {
      filtered = filtered.filter(
        (tx) => tx.procurementMethod === methodFilter || tx.methodLabel.toLowerCase() === methodFilter.toLowerCase()
      );
    }

    return NextResponse.json({
      success: true,
      summary: {
        ...summary,
        filteredCount: filtered.length,
        filteredNilai: filtered.reduce((acc, t) => acc + t.amount, 0),
      },
      transactions: filtered,
    });
  } catch (error) {
    console.error("GET /api/procurement-data error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal mengambil data pengadaan Inaproc." },
      { status: 500 }
    );
  }
}

