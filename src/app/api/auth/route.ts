import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { findUserByEmailWithPassword } from "@/lib/db/users";
import { createSessionToken, verifySessionToken, AUTH_COOKIE_NAME } from "@/lib/auth-jwt";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email dan kata sandi wajib diisi." },
        { status: 400 }
      );
    }

    const user = findUserByEmailWithPassword(email);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Kredensial tidak valid. Akun tidak ditemukan." },
        { status: 401 }
      );
    }

    // Bandingkan password plaintext dengan hashed password di database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: "Kata sandi salah. Silakan periksa kembali." },
        { status: 401 }
      );
    }

    // Buat JWT Token dengan payload role ('ADMIN' | 'USER')
    const token = await createSessionToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    const response = NextResponse.json({
      success: true,
      message: "Autentikasi berhasil.",
      role: user.role,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

    // Pasang HttpOnly cookie untuk middleware dan sesi SSR
    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 hari
    });

    return response;
  } catch (error) {
    console.error("Login API Error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan server internal." },
      { status: 500 }
    );
  }
}

// GET: Ambil sesi pengguna saat ini berdasarkan JWT cookie
export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const payload = await verifySessionToken(token);
    if (!payload) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: payload.id,
        email: payload.email,
        name: payload.name,
        role: payload.role,
      },
    });
  } catch (error) {
    console.error("Auth verify API Error:", error);
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}

// DELETE: Hapus sesi (Logout)
export async function DELETE() {
  const response = NextResponse.json({
    success: true,
    message: "Berhasil keluar dari sesi.",
  });

  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return response;
}

