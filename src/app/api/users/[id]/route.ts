import { NextRequest, NextResponse } from "next/server";
import { deleteUser, updateUser, findUserById } from "@/lib/db/users";
import { verifySessionToken, AUTH_COOKIE_NAME } from "@/lib/auth-jwt";

async function requireAdmin(req: NextRequest) {
  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return null;
  const payload = await verifySessionToken(token);
  if (!payload || payload.role !== "ADMIN") return null;
  return payload;
}

// DELETE: Hapus pengguna berdasarkan ID
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await requireAdmin(req);
    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Akses ditolak. Memerlukan hak akses Administrator." },
        { status: 403 }
      );
    }

    const { id } = params;

    // Cegah admin menghapus akunnya sendiri yang sedang aktif
    if (admin.id === id) {
      return NextResponse.json(
        { success: false, message: "Anda tidak dapat menghapus akun Administrator yang sedang aktif digunakan." },
        { status: 400 }
      );
    }

    const existingUser = findUserById(id);
    if (!existingUser) {
      return NextResponse.json(
        { success: false, message: "Pengguna tidak ditemukan." },
        { status: 404 }
      );
    }

    const deleted = deleteUser(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Gagal menghapus pengguna dari database." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Pengguna ${existingUser.name} (${existingUser.email}) berhasil dihapus.`,
    });
  } catch (error) {
    console.error("DELETE /api/users/[id] Error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan saat menghapus pengguna." },
      { status: 500 }
    );
  }
}

// PUT: Perbarui data pengguna
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await requireAdmin(req);
    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Akses ditolak. Memerlukan hak akses Administrator." },
        { status: 403 }
      );
    }

    const { id } = params;
    const body = await req.json();
    const { name, email, role } = body;

    const updated = updateUser(id, { name, email, role });
    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Pengguna tidak ditemukan atau gagal diperbarui." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Data pengguna berhasil diperbarui.",
      user: updated,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Gagal memperbarui pengguna.";
    return NextResponse.json({ success: false, message: msg }, { status: 400 });
  }
}

