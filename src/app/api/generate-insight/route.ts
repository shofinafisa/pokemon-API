import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));

    // Ambil parameter data metrik dan filter dari payload
    const realisasi = body.realisasi || body.totalRealisasi || "Rp 145 Jt";
    const paket = body.paket || body.totalPaket || "1 Paket";
    const efisiensi = body.efisiensi || body.efficiencyRatio || "Hemat 7,55%";
    const metode = body.metode || body.targetMethod || "Pengadaan Langsung";
    const instansi = body.instansi || "Seluruh Instansi Nasional";
    const tahun = body.tahun || "2020 – 2026";

    // Simulasi jeda komputasi AI insight
    await new Promise((resolve) => setTimeout(resolve, 600));

    // 3 Poin terstruktur sesuai format referensi LKPP
    const point1Text = `Realisasi anggaran ${tahun} pada ${instansi.toLowerCase()} mencapai ${realisasi} melalui ${paket} ${metode}. Efisiensi ${efisiensi} menandakan penyerapan terukur serta negosiasi harga dan kompetisi penyedia yang efektif, baik pada tahap pengumuman maupun e-katalog.`;

    const point2Text = `Pemanfaatan instrumen pengadaan menunjukkan komitmen satker terhadap akuntabilitas dan efisiensi belanja publik. Penjadwalan yang konsisten menekan deviasi antara RUP dan realisasi kontrak, sehingga mencegah SiLPA yang tidak produktif.`;

    const point3Text = `PPK dan UKPBJ disarankan terus mengonsolidasikan paket pada komoditas serupa untuk memperkuat daya tawar pemerintah. Percepat e-purchasing di awal semester berikutnya agar penyerapan tidak menumpuk di akhir tahun anggaran.`;

    const structuredInsights = [
      {
        number: 1,
        title: "Capaian Realisasi",
        text: point1Text,
      },
      {
        number: 2,
        title: "Akuntabilitas Belanja",
        text: point2Text,
      },
      {
        number: 3,
        title: "Rekomendasi Strategis",
        text: point3Text,
      },
    ];

    const fullInsight = `1. Capaian Realisasi\n${point1Text}\n\n2. Akuntabilitas Belanja\n${point2Text}\n\n3. Rekomendasi Strategis\n${point3Text}`;

    return NextResponse.json({
      success: true,
      insight: fullInsight,
      paragraphs: [point1Text, point2Text, point3Text],
      structuredInsights,
      metadata: {
        realisasi,
        paket,
        efisiensi,
        metode,
        instansi,
        tahun,
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error in /api/generate-insight:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan saat memproses analisis teks AI.",
      },
      { status: 500 }
    );
  }
}
