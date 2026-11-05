import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, AUTH_COOKIE_NAME, createSessionToken } from "@/lib/auth-jwt";
import { updateUserProfile, changeUserPassword, setUserPassword, findUserById } from "@/lib/db/users";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
    if (!token) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifySessionToken(token);
    if (!payload) {
      return NextResponse.json({ success: false, message: "Invalid session" }, { status: 401 });
    }

    const user = findUserById(payload.id);
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("GET /api/users/profile error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
    if (!token) {
      return NextResponse.json({ success: false, message: "Akses ditolak. Sesi tidak ditemukan." }, { status: 401 });
    }

    const payload = await verifySessionToken(token);
    if (!payload) {
      return NextResponse.json({ success: false, message: "Sesi tidak valid." }, { status: 401 });
    }

    const body = await req.json();
    const { action } = body;

    // Aksi 1: Ubah Profil (Nama, Username, Avatar)
    if (action === "update-profile") {
      const { name, username, avatar } = body;

      if (!name || !name.trim()) {
        return NextResponse.json(
          { success: false, message: "Nama lengkap tidak boleh kosong." },
          { status: 400 }
        );
      }

      const updated = updateUserProfile(payload.id, {
        name: name.trim(),
        username: username?.trim(),
        avatar,
      });

      if (!updated) {
        return NextResponse.json(
          { success: false, message: "Gagal memperbarui profil pengguna." },
          { status: 404 }
        );
      }

      // Perbarui cookie token dengan data terbaru (tanpa avatar base64 agar cookie tetap ringan)
      const newToken = await createSessionToken({
        id: updated.id,
        email: updated.email,
        name: updated.name,
        role: updated.role,
<<<<<<< HEAD
        username: updated.username,
=======


>>>>>>> 3b751f9785030d066145105423356d5f43633f68
      });

      const response = NextResponse.json({
        success: true,
        message: "Profil berhasil diperbarui.",
        user: updated,
      });

      response.cookies.set({
        name: AUTH_COOKIE_NAME,
        value: newToken,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60,
      });

      return response;
    }

    // Aksi 2: Ubah Password
    if (action === "change-password") {
      const { oldPassword, newPassword } = body;

      if (!newPassword) {
        return NextResponse.json(
          { success: false, message: "Password baru wajib diisi." },
          { status: 400 }
        );
      }

      if (newPassword.length < 6) {
        return NextResponse.json(
          { success: false, message: "Password baru minimal 6 karakter." },
          { status: 400 }
        );
      }

      // Jika ada oldPassword, validasi password lama; jika tidak, langsung perbarui
      const result = oldPassword
        ? await changeUserPassword(payload.id, oldPassword, newPassword)
        : await setUserPassword(payload.id, newPassword);

      if (!result.success) {
        return NextResponse.json(
          { success: false, message: result.message },
          { status: 400 }
        );
      }

      return NextResponse.json({
        success: true,
        message: result.message || "Password berhasil diperbarui.",
      });
    }

    return NextResponse.json(
      { success: false, message: "Aksi tidak dikenali." },
      { status: 400 }
    );
  } catch (error) {
    console.error("PUT /api/users/profile error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan pada server saat memperbarui data." },
      { status: 500 }
    );
  }
}

