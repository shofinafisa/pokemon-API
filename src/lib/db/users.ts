import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";

export type Role = "ADMIN" | "USER";

export interface DbUser {
  id: string;
  email: string;
  password: string; // Hashed password
  name: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "users.json");

// Default initial seed users with pre-hashed passwords ('admin123' and 'user123')
const INITIAL_USERS: DbUser[] = [
  {
    id: "usr_admin_inaproc_01",
    email: "admin@dashboard.com",
    password: "$2b$10$wr4aM/2B4sffxDHh2CepdO2UjyV4rE3CmlIMb5IQUeSGVLkp/cLBS", // hash for 'admin123'
    name: "Alexander Vance (Admin LKPP)",
    role: "ADMIN",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "usr_satker_ppk_02",
    email: "user@dashboard.com",
    password: "$2b$10$LiiB8tkTyW.V9ZoGH9aNhuGIonsdSvGZowUYNVNJ2XD0OFbagkaWW", // hash for 'user123'
    name: "Sarah Jenkins (PPK Satker)",
    role: "USER",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "usr_auditor_bpkp_03",
    email: "auditor@inaproc.id",
    password: "$2b$10$LiiB8tkTyW.V9ZoGH9aNhuGIonsdSvGZowUYNVNJ2XD0OFbagkaWW", // hash for 'user123'
    name: "Budi Santoso (Auditor BPKP)",
    role: "USER",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

function sanitizeUser(user: DbUser): Omit<DbUser, "password"> {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

function ensureStorage(): DbUser[] {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(INITIAL_USERS, null, 2), "utf-8");
      return INITIAL_USERS;
    }
    const data = fs.readFileSync(DATA_FILE, "utf-8");
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(INITIAL_USERS, null, 2), "utf-8");
      return INITIAL_USERS;
    }
    return parsed;
  } catch (error) {
    console.error("Database storage read error:", error);
    return INITIAL_USERS;
  }
}

function persistStorage(users: DbUser[]) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2), "utf-8");
  } catch (error) {
    console.error("Database storage write error:", error);
  }
}

export function getAllUsers(): Omit<DbUser, "password">[] {
  const users = ensureStorage();
  return users.map(sanitizeUser);
}

export function findUserByEmailWithPassword(email: string): DbUser | null {
  const users = ensureStorage();
  const normalized = email.trim().toLowerCase();
  const user = users.find((u) => u.email.toLowerCase() === normalized);
  return user || null;
}

export function findUserById(id: string): Omit<DbUser, "password"> | null {
  const users = ensureStorage();
  const user = users.find((u) => u.id === id);
  if (!user) return null;
  return sanitizeUser(user);
}

export async function createUser(data: {
  name: string;
  email: string;
  password: string;
  role: Role;
}): Promise<Omit<DbUser, "password">> {
  const users = ensureStorage();
  const normalizedEmail = data.email.trim().toLowerCase();

  const existing = users.find((u) => u.email.toLowerCase() === normalizedEmail);
  if (existing) {
    throw new Error("Email sudah terdaftar dalam sistem.");
  }

  // Hash password using bcryptjs
  const hashedPassword = await bcrypt.hash(data.password, 10);
  const newUser: DbUser = {
    id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name: data.name.trim(),
    email: normalizedEmail,
    password: hashedPassword,
    role: data.role === "ADMIN" ? "ADMIN" : "USER",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  users.push(newUser);
  persistStorage(users);

  return sanitizeUser(newUser);
}

export function deleteUser(id: string): boolean {
  const users = ensureStorage();
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) {
    return false;
  }
  users.splice(index, 1);
  persistStorage(users);
  return true;
}

export function updateUser(
  id: string,
  data: Partial<{ name: string; email: string; role: Role }>
): Omit<DbUser, "password"> | null {
  const users = ensureStorage();
  const user = users.find((u) => u.id === id);
  if (!user) return null;

  if (data.name !== undefined) user.name = data.name.trim();
  if (data.email !== undefined) {
    const normalized = data.email.trim().toLowerCase();
    const collision = users.find((u) => u.email.toLowerCase() === normalized && u.id !== id);
    if (collision) {
      throw new Error("Email sudah digunakan oleh akun lain.");
    }
    user.email = normalized;
  }
  if (data.role !== undefined) user.role = data.role;
  user.updatedAt = new Date().toISOString();

  persistStorage(users);
  return sanitizeUser(user);
}
