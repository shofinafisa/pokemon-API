// Skema Database Drizzle ORM
// Tabel: User dengan kolom id, email, password (hashed), name, dan role ('ADMIN' | 'USER')

export const RoleEnum = ["ADMIN", "USER"] as const;
export type Role = (typeof RoleEnum)[number];

export interface UserTable {
  id: string;
  email: string;
  password: string; // bcrypt hash
  name: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
}

// Format Drizzle SQLite Table Definition:
/*
import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  role: text("role", { enum: ["ADMIN", "USER"] }).notNull().default("USER"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});
*/

