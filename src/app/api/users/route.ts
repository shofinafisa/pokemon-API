import { NextRequest, NextResponse } from "next/server";
import { getAllUsers, createUser } from "@/lib/db/users";
import { verifySessionToken, AUTH_COOKIE_NAME } from "@/lib/auth-jwt";

// Helper verifikasi admin
async function requireAdmin(req: NextRequest) {
  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return null;
  const payload = await verifySessionToken(token);
  if (!payload || payload.role !== "ADMIN") return null;
  return payload;
}

// GET: Daftar semua pengguna (khusus admin)
export async function GET(req: NextRequest) {
  try {
    const admin = await requireAdmin(req);
    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Akses ditolak. Memerlukan hak akses Administrator." },
        { status: 403 }
      );
    }

    const users = getAllUsers();
    return NextResponse.json({ success: true, users });
  } catch (error) {
    console.error("GET /api/users Error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal mengambil data pengguna." },
      { status: 500 }
    );
  }
}

// POST: Tambah Pengguna Baru (Nama, Email, Password, Role)
export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdmin(req);
    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Akses ditolak. Memerlukan hak akses Administrator." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { name, email, password, role } = body;

    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { success: false, message: "Seluruh kolom (Nama, Email, Password, Role) wajib diisi." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: "Kata sandi minimal harus 6 karakter." },
        { status: 400 }
      );
    }

    if (!["ADMIN", "USER"].includes(role)) {
      return NextResponse.json(
        { success: false, message: "Role harus berupa 'ADMIN' atau 'USER'." },
        { status: 400 }
      );
    }

    const newUser = await createUser({
      name,
      email,
      password,
      role,
    });

    return NextResponse.json(
      {
        success: true,
        message: `Pengguna ${newUser.name} berhasil ditambahkan ke database.`,
        user: newUser,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Gagal menambahkan pengguna.";
    return NextResponse.json({ success: false, message: msg }, { status: 400 });
  }
}

