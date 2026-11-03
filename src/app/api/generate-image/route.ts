import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    // Tangkap filters dari req.json()
    const filters = body.filters || body || {};

    // Normalisasi parameter filter
    const tahun = filters.tahun
      ? filters.tahun
      : Array.isArray(filters.yearRange)
      ? `${filters.yearRange[0]} - ${filters.yearRange[1]}`
      : "2024";

    const instansi = Array.isArray(filters.instansi)
      ? filters.instansi.length > 0
        ? filters.instansi.join(", ")
        : "Semua Instansi"
      : filters.instansi || "Semua Instansi";

    const metode =
      filters.metode ||
      filters.targetMethod ||
      filters.targetMethodLabel ||
      "Semua Metode Pengadaan";

    // Master Prompt Template sesuai spesifikasi
    const masterPromptTemplate =
      "Buatkan gambar poster infografis visual modern ringkasan pengadaan barang/jasa pemerintah. Tahun: {{tahun}}, Instansi: {{instansi}}, Metode: {{metode}}. Tampilkan metrik utama dalam tata letak visual yang rapi dan elegan.";

    // Interpolasi placeholder {{...}} dengan data filter
    const finalPrompt = masterPromptTemplate
      .replace("{{tahun}}", String(tahun))
      .replace("{{instansi}}", String(instansi))
      .replace("{{metode}}", String(metode));

    // Simulasi loading AI selama 2 detik (2000ms)
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Kembalikan respons JSON sesuai format yang diminta
    return NextResponse.json({
      success: true,
      imageUrl: "https://via.placeholder.com/800x1131.png?text=Simulasi+Infografis+PNG",
      finalPrompt: finalPrompt,
    });
  } catch (error) {
    console.error("Mock API generate-image Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan pada server saat memproses generate infografis.",
      },
      { status: 500 }
    );
  }
}
