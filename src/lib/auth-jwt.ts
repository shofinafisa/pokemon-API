import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "enterprise-super-secret-jwt-key-2026-inaproc";
const key = new TextEncoder().encode(JWT_SECRET);

export const AUTH_COOKIE_NAME = "auth_token";

export interface SessionPayload {
  id: string;
  email: string;
  name: string;
  role: "ADMIN" | "USER";
  [key: string]: unknown;
}

/**
 * Buat JWT session token dengan payload identitas dan role pengguna.
 */
export async function createSessionToken(payload: SessionPayload): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(key);
}

/**
 * Verifikasi JWT token dan kembalikan payload sesi.
 */
export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, key);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

