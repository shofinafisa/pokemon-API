"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AuthGuard } from "@/components/guards/auth-guard";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { useAuth } from "@/context/auth-context";
import { useFeatures } from "@/context/feature-context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import {
  User as UserIcon,
  Users,
  Settings as SettingsIcon,
  ShieldCheck,
  UserPlus,
  Trash2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertTriangle,
  Loader2,
  Search,
  CheckCircle2,
  Server,
  KeyRound,
  Database,
  RefreshCw,
  X,
  Building,
} from "lucide-react";

interface UserItem {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "USER";
  createdAt: string;
  updatedAt: string;
}

export default function AdminSettingsPage() {
  const { user: currentAdmin, refreshUser } = useAuth();
  const { activeCount, totalCount } = useFeatures();

  // Active Tab
  const [activeTab, setActiveTab] = useState<"profile" | "users" | "system">("users");

  // Profile Form State
  const [profileName, setProfileName] = useState("");
  const [profileEmail, setProfileEmail] = useState("");
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Users Management State
  const [usersList, setUsersList] = useState<UserItem[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Create User Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [newUserRole, setNewUserRole] = useState<"ADMIN" | "USER">("USER");
  const [showPassword, setShowPassword] = useState(false);
  const [isCreatingUser, setIsCreatingUser] = useState(false);

  // Delete Confirm Dialog State
  const [userToDelete, setUserToDelete] = useState<UserItem | null>(null);
  const [isDeletingUser, setIsDeletingUser] = useState(false);

  // Initialize Profile form when currentAdmin loads
  useEffect(() => {
    if (currentAdmin) {
      setProfileName(currentAdmin.name || "");
      setProfileEmail(currentAdmin.email || "");
    }
  }, [currentAdmin]);

  // Fetch Users List
  const fetchUsers = useCallback(async () => {
    setIsLoadingUsers(true);
    try {
      const res = await fetch("/api/users", { cache: "no-store" });
      const data = await res.json();
      if (res.ok && data.success) {
        setUsersList(data.users || []);
      } else {
        toast.error(data.message || "Gagal memuat daftar pengguna.");
      }
    } catch {
      toast.error("Gagal terhubung ke API Manajemen Pengguna.");
    } finally {
      setIsLoadingUsers(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Handle Update Profile
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAdmin?.id) return;

    if (!profileName.trim() || !profileEmail.trim()) {
      toast.error("Nama dan email tidak boleh kosong.");
      return;
    }

    setIsUpdatingProfile(true);
    try {
      const res = await fetch(`/api/users/${currentAdmin.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profileName,
          email: profileEmail,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Profil Administrator berhasil diperbarui!", { icon: "✅" });
        await refreshUser();
        fetchUsers();
      } else {
        toast.error(data.message || "Gagal memperbarui profil.");
      }
    } catch {
      toast.error("Terjadi kesalahan saat menyimpan data profil.");
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  // Handle Add New User
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newUserName.trim() || !newUserEmail.trim() || !newUserPassword) {
      toast.error("Semua field wajib diisi.");
      return;
    }

    if (newUserPassword.length < 6) {
      toast.error("Kata sandi minimal 6 karakter.");
      return;
    }

    setIsCreatingUser(true);
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newUserName,
          email: newUserEmail,
          password: newUserPassword,
          role: newUserRole,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(`Pengguna ${newUserName} berhasil ditambahkan!`, { icon: "🎉" });
        // Reset form & close modal
        setNewUserName("");
        setNewUserEmail("");
        setNewUserPassword("");
        setNewUserRole("USER");
        setIsAddModalOpen(false);
        fetchUsers();
      } else {
        toast.error(data.message || "Gagal menambahkan pengguna.");
      }
    } catch {
      toast.error("Terjadi kesalahan server saat membuat pengguna.");
    } finally {
      setIsCreatingUser(false);
    }
  };

  // Handle Confirm Delete User
  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    setIsDeletingUser(true);
    try {
      const res = await fetch(`/api/users/${userToDelete.id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(`Pengguna ${userToDelete.name} berhasil dihapus dari sistem.`, { icon: "🗑️" });
        setUserToDelete(null);
        fetchUsers();
      } else {
        toast.error(data.message || "Gagal menghapus pengguna.");
      }
    } catch {
      toast.error("Terjadi kesalahan server saat menghapus data.");
    } finally {
      setIsDeletingUser(false);
    }
  };

  // Filtered users by search query
  const filteredUsers = usersList.filter((u) => {
    const q = searchQuery.toLowerCase();
    return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.role.toLowerCase().includes(q);
  });

  return (
    <AuthGuard allowedRoles={["ADMIN", "admin"]}>
      <DashboardShell>
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <Badge
                  variant="default"
                  className="gap-1.5 py-1 px-3 bg-blue-600 text-white border-0 font-semibold text-xs tracking-wider"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  ADMINISTRATOR CONSOLE
                </Badge>
                <span className="text-xs text-slate-400">| Pengaturan & Akses</span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mt-2">
                Pengaturan Sistem & Manajemen Pengguna
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Kelola profil administrator, hak akses pengguna (RBAC), dan konfigurasi keamanan sistem INAPROC.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={fetchUsers}
                className="h-9 px-3 text-xs gap-1.5 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                title="Segarkan data pengguna"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingUsers ? "animate-spin" : ""}`} />
                <span>Segarkan</span>
              </Button>
            </div>
          </div>

          {/* Main Layout with Sidebar / Tabs Navigation */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-3">
              <div className="bg-white dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3 shadow-xs space-y-1">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-3 py-2">
                  Menu Pengaturan
                </p>

                <button
                  type="button"
                  onClick={() => setActiveTab("users")}
                  className={`w-full flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    activeTab === "users"
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Users className="w-4 h-4" />
                    <span>Manajemen Pengguna</span>
                  </div>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                      activeTab === "users"
                        ? "bg-blue-700 text-white"
                        : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    {usersList.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("profile")}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    activeTab === "profile"
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                  }`}
                >
                  <UserIcon className="w-4 h-4" />
                  <span>Profil Saya</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("system")}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    activeTab === "system"
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                  }`}
                >
                  <Server className="w-4 h-4" />
                  <span>Sistem & Keamanan</span>
                </button>
              </div>

              {/* Status Summary Card */}
              <div className="mt-4 bg-gradient-to-br from-blue-950/40 via-slate-900/60 to-slate-900/90 border border-blue-500/20 rounded-2xl p-4 text-xs space-y-2.5">
                <div className="flex items-center gap-2 text-blue-400 font-semibold">
                  <KeyRound className="w-4 h-4" />
                  <span>Status Hak Akses</span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Sistem beroperasi dengan kontrol otentikasi berbasis JWT (Role-Based Access Control).
                </p>
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Metode Pengadaan:</span>
                  <span className="font-semibold text-emerald-400">{activeCount}/{totalCount} Aktif</span>
                </div>
              </div>
            </div>

            {/* Content Area */}
            <div className="lg:col-span-9 space-y-5">
              {/* TAB 1: MANAJEMEN PENGGUNA */}
              {activeTab === "users" && (
                <div className="bg-white dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-5">
                  {/* Top Action Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                        Daftar Pengguna Sistem
                      </h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Kelola akun pengguna, hak akses role (ADMIN / USER), dan kredensial terdaftar.
                      </p>
                    </div>

                    <Button
                      onClick={() => setIsAddModalOpen(true)}
                      className="bg-blue-600 hover:bg-blue-500 text-white text-xs gap-1.5 rounded-xl shadow-md shadow-blue-500/20 cursor-pointer h-9 px-3.5"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>Tambah Pengguna Baru</span>
                    </Button>
                  </div>

                  {/* Search Bar */}
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Cari berdasarkan nama, email, atau role..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* Users Table */}
                  <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                    <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                      <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
                        <tr>
                          <th className="py-3 px-4">Nama Pengguna</th>
                          <th className="py-3 px-4">Alamat Email</th>
                          <th className="py-3 px-4">Role / Hak Akses</th>
                          <th className="py-3 px-4 text-center">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                        {isLoadingUsers ? (
                          <tr>
                            <td colSpan={4} className="py-8 text-center text-slate-400">
                              <div className="flex items-center justify-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                                <span>Memuat data pengguna dari database...</span>
                              </div>
                            </td>
                          </tr>
                        ) : filteredUsers.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="py-8 text-center text-slate-400">
                              Tidak ada pengguna yang cocok dengan pencarian Anda.
                            </td>
                          </tr>
                        ) : (
                          filteredUsers.map((u) => {
                            const isSelf = currentAdmin?.id === u.id;
                            const isAdminRole = u.role === "ADMIN";

                            return (
                              <tr
                                key={u.id}
                                className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                              >
                                <td className="py-3.5 px-4 font-medium text-slate-900 dark:text-slate-100">
                                  <div className="flex items-center gap-2.5">
                                    <div
                                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 ${
                                        isAdminRole
                                          ? "bg-gradient-to-tr from-blue-600 to-indigo-600"
                                          : "bg-emerald-600"
                                      }`}
                                    >
                                      {u.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                      <p className="font-semibold">{u.name}</p>
                                      <p className="text-[10px] text-slate-400">ID: {u.id}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-3.5 px-4">
                                  <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                    <span>{u.email}</span>
                                  </div>
                                </td>
                                <td className="py-3.5 px-4">
                                  {isAdminRole ? (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30">
                                      <ShieldCheck className="w-3.5 h-3.5" />
                                      ADMIN
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                                      <UserIcon className="w-3.5 h-3.5" />
                                      USER
                                    </span>
                                  )}
                                </td>
                                <td className="py-3.5 px-4 text-center">
                                  {isSelf ? (
                                    <span className="text-[11px] text-slate-400 italic">
                                      Akun Anda
                                    </span>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => setUserToDelete(u)}
                                      className="inline-flex items-center justify-center p-2 rounded-lg text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-transparent hover:border-rose-500/20 transition-all cursor-pointer"
                                      title={`Hapus pengguna ${u.name}`}
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  )}
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 2: PROFIL SAYA */}
              {activeTab === "profile" && (
                <div className="bg-white dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                      Profil Administrator
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Informasi akun administrator Anda yang tersimpan di sistem basis data.
                    </p>
                  </div>

                  <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-xl">
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-xl font-bold text-white shadow-md shadow-blue-500/20">
                        {profileName ? profileName.charAt(0).toUpperCase() : "A"}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                            {profileName || "Administrator"}
                          </h3>
                          <Badge variant="default" className="text-[10px] bg-blue-600 py-0.5">
                            ADMIN
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-400">{profileEmail}</p>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                        Nama Lengkap
                      </label>
                      <input
                        type="text"
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        required
                        className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                        Alamat Email
                      </label>
                      <input
                        type="email"
                        value={profileEmail}
                        onChange={(e) => setProfileEmail(e.target.value)}
                        required
                        className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                        Role / Tingkat Otoritas
                      </label>
                      <input
                        type="text"
                        value="ADMINISTRATOR (Full Access to Control Center & Feature Toggle)"
                        disabled
                        className="w-full px-3.5 py-2.5 bg-slate-100 dark:bg-slate-800/20 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-400 cursor-not-allowed"
                      />
                    </div>

                    <div className="pt-2">
                      <Button
                        type="submit"
                        disabled={isUpdatingProfile}
                        className="bg-blue-600 hover:bg-blue-500 text-white text-xs rounded-xl shadow-md shadow-blue-500/20 cursor-pointer h-9 px-4"
                      >
                        {isUpdatingProfile ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                            <span>Menyimpan Perubahan...</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                            <span>Simpan Perubahan Profil</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </div>
              )}

              {/* TAB 3: SISTEM & KEAMANAN */}
              {activeTab === "system" && (
                <div className="bg-white dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                      Konfigurasi Sistem & Arsitektur
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Spesifikasi lingkungan aplikasi dan keamanan autentikasi.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-2">
                      <div className="flex items-center gap-2 text-blue-500 font-semibold text-xs">
                        <Database className="w-4 h-4" />
                        <span>Skema Basis Data (Prisma / Drizzle)</span>
                      </div>
                      <p className="text-xs text-slate-400">
                        Tabel <code className="text-blue-400">User</code> memiliki kolom terverifikasi: <br />
                        <span className="text-slate-300 font-mono text-[11px]">id, email, password (bcrypt hash), name, role (ADMIN | USER)</span>.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-2">
                      <div className="flex items-center gap-2 text-indigo-500 font-semibold text-xs">
                        <KeyRound className="w-4 h-4" />
                        <span>Keamanan Autentikasi JWT</span>
                      </div>
                      <p className="text-xs text-slate-400">
                        Token JWT di-sign menggunakan algoritma HS256 dengan HttpOnly cookie <code className="text-indigo-400">auth_token</code> dan perlindungan rute terpusat di Next.js Middleware.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-2">
                      <div className="flex items-center gap-2 text-emerald-500 font-semibold text-xs">
                        <Building className="w-4 h-4" />
                        <span>Smart Role-Based Routing</span>
                      </div>
                      <p className="text-xs text-slate-400">
                        Otomatisasi rute: Login akun <strong className="text-blue-400">ADMIN</strong> dialihkan ke <code className="text-blue-400">/admin</code>, sedangkan <strong className="text-emerald-400">USER</strong> ke <code className="text-emerald-400">/dashboard</code>.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-2">
                      <div className="flex items-center gap-2 text-amber-500 font-semibold text-xs">
                        <SettingsIcon className="w-4 h-4" />
                        <span>Dynamic Feature Toggle Engine</span>
                      </div>
                      <p className="text-xs text-slate-400">
                        Kendali modul aktif secara real-time tersinkronisasi langsung ke akun User (PPK Satker).
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* MODAL: TAMBAH PENGGUNA BARU */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl max-w-md w-full space-y-5 text-slate-100 relative">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-blue-600/15 border border-blue-500/25 text-blue-400">
                    <UserPlus className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Tambah Pengguna Baru</h3>
                    <p className="text-[11px] text-slate-400">Masukkan data kredensial akun pengguna</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateUser} className="space-y-3.5">
                {/* Input Nama */}
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-slate-300">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Rian Pratama (PPK)"
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-800/60 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Input Email */}
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-slate-300">
                    Alamat Email
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      placeholder="rian@dashboard.com"
                      value={newUserEmail}
                      onChange={(e) => setNewUserEmail(e.target.value)}
                      required
                      className="w-full pl-9 pr-3 py-2 bg-slate-800/60 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Input Password */}
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-slate-300">
                    Kata Sandi (Hashed otomatis saat disimpan)
                  </label>
                  <div className="relative">
                    <Lock className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Minimal 6 karakter"
                      value={newUserPassword}
                      onChange={(e) => setNewUserPassword(e.target.value)}
                      required
                      className="w-full pl-9 pr-9 py-2 bg-slate-800/60 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Input Role */}
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-slate-300">
                    Role / Hak Akses
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setNewUserRole("USER")}
                      className={`p-2.5 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        newUserRole === "USER"
                          ? "bg-emerald-950/60 border-emerald-500/60 text-emerald-300 shadow-sm"
                          : "bg-slate-800/40 border-slate-700 text-slate-400 hover:bg-slate-800"
                      }`}
                    >
                      <UserIcon className="w-3.5 h-3.5" />
                      <span>USER (PPK)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setNewUserRole("ADMIN")}
                      className={`p-2.5 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        newUserRole === "ADMIN"
                          ? "bg-blue-950/60 border-blue-500/60 text-blue-300 shadow-sm"
                          : "bg-slate-800/40 border-slate-700 text-slate-400 hover:bg-slate-800"
                      }`}
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>ADMIN</span>
                    </button>
                  </div>
                </div>

                {/* Modal Footer Buttons */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsAddModalOpen(false)}
                    className="text-xs text-slate-400 hover:text-white"
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    disabled={isCreatingUser}
                    className="bg-blue-600 hover:bg-blue-500 text-white text-xs rounded-xl shadow-md shadow-blue-500/20 cursor-pointer h-9 px-4"
                  >
                    {isCreatingUser ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                        <span>Menyimpan...</span>
                      </>
                    ) : (
                      <span>Simpan Pengguna</span>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* DIALOG KONFIRMASI HAPUS PENGGUNA (SweetAlert Style Dialog) */}
        {userToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
            <div className="bg-slate-900 border border-rose-900/60 rounded-2xl p-6 shadow-2xl max-w-sm w-full space-y-4 text-slate-100 text-center animate-in zoom-in-95 duration-150">
              <div className="w-12 h-12 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-6 h-6" />
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">Konfirmasi Hapus Pengguna</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Apakah Anda yakin ingin menghapus akun{" "}
                  <strong className="text-white">{userToDelete.name}</strong> ({userToDelete.email})?
                  Tindakan ini permanen dan menghapus kredensial dari basis data.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isDeletingUser}
                  onClick={() => setUserToDelete(null)}
                  className="border-slate-700 text-xs text-slate-300 hover:bg-slate-800 cursor-pointer rounded-xl"
                >
                  Batal
                </Button>
                <Button
                  type="button"
                  disabled={isDeletingUser}
                  onClick={handleDeleteUser}
                  className="bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-xl shadow-md shadow-rose-600/30 cursor-pointer h-9 px-4"
                >
                  {isDeletingUser ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                      <span>Menghapus...</span>
                    </>
                  ) : (
                    <span>Ya, Hapus Pengguna</span>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </DashboardShell>
    </AuthGuard>
  );
}

