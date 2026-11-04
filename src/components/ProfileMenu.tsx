"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import toast from "react-hot-toast";
import {
  User as UserIcon,
  Lock,
  LogOut,
  Camera,
  Eye,
  EyeOff,
  ChevronDown,
  X,
  Check,
  Loader2,
  Sparkles,
  Upload,
} from "lucide-react";

export interface ProfileMenuProps {
  initialName?: string;
  initialRole?: string;
  initialEmail?: string;
  initialUsername?: string;
  initialAvatar?: string;
  onUpdateProfile?: (data: { name: string; username: string; avatar: string }) => void;
  onUpdatePassword?: (data: { newPass: string }) => void;
  onLogout?: () => void;
  className?: string;
}

export function ProfileMenu({
  initialName = "Sarah Jenkins",
  initialRole = "Professional Data Analyst",
  initialEmail = "sarah.jenkins@inaproc.id",
  initialUsername = "sarah.jenkins",
  initialAvatar = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
  onUpdateProfile,
  onUpdatePassword,
  onLogout,
  className = "",
}: ProfileMenuProps) {
  const router = useRouter();
  const auth = useAuth();
  const currentUser = auth?.user;

  // Mount state untuk React Portal (agar modal dirender langsung di document.body)
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // 1. Profil State Terpadu (Prioritas: auth user jika ada, fallback ke prop/default Sarah Jenkins)
  const [name, setName] = useState(currentUser?.name || initialName);
  const [roleTitle] = useState(currentUser?.title || initialRole);
  const [email] = useState(currentUser?.email || initialEmail);
  const [username, setUsername] = useState(currentUser?.username || initialUsername);
  const [avatar, setAvatar] = useState(currentUser?.avatar || initialAvatar);

  // Sync dengan auth context bila berubah
  useEffect(() => {
    if (currentUser) {
      if (currentUser.name) setName(currentUser.name);
      if (currentUser.avatar) setAvatar(currentUser.avatar);
      if (currentUser.username) setUsername(currentUser.username);
    }
  }, [currentUser]);

  // 2. Dropdown Popover State & Ref
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 3. Modal Ubah Profil State
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [editName, setEditName] = useState(name);
  const [editUsername, setEditUsername] = useState(username);
  const [previewImage, setPreviewImage] = useState(avatar);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 4. Modal Ubah Password State (Hanya Password Baru & Konfirmasi)
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  // Click Outside Listener untuk Popover Dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  // Escape Key Listener untuk menutup Dropdown dan Modal
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        if (isProfileModalOpen) setIsProfileModalOpen(false);
        if (isPasswordModalOpen) setIsPasswordModalOpen(false);
        if (isDropdownOpen) setIsDropdownOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isProfileModalOpen, isPasswordModalOpen, isDropdownOpen]);

  // Buka Modal Ubah Profil
  const handleOpenProfileModal = () => {
    setIsDropdownOpen(false);
    setEditName(name);
    setEditUsername(username);
    setPreviewImage(avatar);
    setIsProfileModalOpen(true);
  };

  // Buka Modal Ubah Password
  const handleOpenPasswordModal = () => {
    setIsDropdownOpen(false);
    setNewPassword("");
    setConfirmPassword("");
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    setIsPasswordModalOpen(true);
  };

  // Handle Logout
  const handleLogoutAction = async () => {
    setIsDropdownOpen(false);
    if (onLogout) {
      onLogout();
      return;
    }
    if (auth?.logout) {
      await auth.logout();
      toast.success("Berhasil keluar dari sesi.", { icon: "👋" });
      router.replace("/login");
    } else {
      toast.success("Berhasil keluar dari sesi.", { icon: "👋" });
      router.replace("/login");
    }
  };

  // Handler Unggah File Foto Lokal
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Ukuran file foto maksimal 5MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setPreviewImage(reader.result);
          toast.success("Foto profil berhasil dipilih!", { icon: "📸" });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Simpan Perubahan Profil
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) {
      toast.error("Nama lengkap tidak boleh kosong.");
      return;
    }
    if (!editUsername.trim()) {
      toast.error("Username tidak boleh kosong.");
      return;
    }

    setIsSavingProfile(true);
    try {
      if (currentUser?.id) {
        const res = await fetch("/api/users/profile", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "update-profile",
            name: editName.trim(),
            username: editUsername.trim(),
            avatar: previewImage,
          }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.message || "Gagal memperbarui profil.");
        }
      }

      setName(editName.trim());
      setUsername(editUsername.trim());
      setAvatar(previewImage);

      if (onUpdateProfile) {
        onUpdateProfile({
          name: editName.trim(),
          username: editUsername.trim(),
          avatar: previewImage,
        });
      }

      if (auth?.refreshUser) {
        auth.refreshUser();
      }

      toast.success("Profil berhasil diperbarui!", { icon: "✅" });
      setIsProfileModalOpen(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan.";
      toast.error(msg);
    } finally {
      setIsSavingProfile(false);
    }
  };

  // 3. Logika Submit Password: Handler handlePasswordChange
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword) {
      toast.error("Password baru wajib diisi.");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password baru minimal 6 karakter.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Konfirmasi password baru tidak cocok.");
      return;
    }

    setIsSavingPassword(true);
    try {
      if (currentUser?.id) {
        const res = await fetch("/api/users/profile", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "change-password",
            newPassword,
          }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.message || "Gagal memperbarui password.");
        }
      }

      if (onUpdatePassword) {
        onUpdatePassword({ newPass: newPassword });
      }

      // 4. Feedback UX:
      // - Tutup modal secara otomatis
      setIsPasswordModalOpen(false);
      // - Reset state input menjadi kosong
      setNewPassword("");
      setConfirmPassword("");
      setShowNewPassword(false);
      setShowConfirmPassword(false);
      // - Tampilkan notifikasi toast ringan
      toast.success("Password berhasil diperbarui", { icon: "🔒" });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal mengubah password.";
      toast.error(msg);
    } finally {
      setIsSavingPassword(false);
    }
  };

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      {/* 1. TOMBOL TRIGGER PROFIL:
          - Foto "Sarah Jenkins", nama, dan peran
          - cursor-pointer
          - efek hover bg-slate-50
      */}
      <button
        type="button"
        onClick={() => setIsDropdownOpen((prev) => !prev)}
        className="flex items-center gap-2.5 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border border-transparent hover:border-slate-200/80 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 group"
        aria-expanded={isDropdownOpen}
        aria-haspopup="true"
        aria-label="Menu Akun Pengguna"
      >
        {/* Foto Profil Bundar */}
        <div className="relative h-9 w-9 shrink-0">
          <Image
            src={avatar}
            alt={name}
            width={36}
            height={36}
            unoptimized
            className="h-9 w-9 rounded-full object-cover ring-2 ring-blue-500/20 group-hover:ring-blue-500/40 transition-all shadow-xs"
          />
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
        </div>

        {/* Nama & Peran */}
        <div className="hidden sm:block text-left">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate max-w-[140px]">
              {name}
            </span>
          </div>
          <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 truncate max-w-[140px] leading-tight">
            {roleTitle}
          </p>
        </div>

        {/* Chevron Icon */}
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-transform duration-200 ${
            isDropdownOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* 2. DROPDOWN MENU (POPOVER):
          - Melayang di bawah profil
          - Animasi halus
          - shadow-lg, border border-slate-200, bg-white
          - Struktur: Header read-only (Nama & Email), border-t, Ubah Profil, Ubah Password, border-t, Keluar
      */}
      {isDropdownOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-1.5 z-50 origin-top-right animate-in fade-in zoom-in-95 duration-150 focus:outline-none"
        >
          {/* Header Read-only: Nama & Email Pengguna */}
          <div className="px-4 py-3 select-none">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                {name}
              </span>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[9px] font-semibold tracking-wider uppercase">
                <Sparkles className="w-2.5 h-2.5" />
                Analyst
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5 font-normal">
              {email}
            </p>
          </div>

          {/* Garis Pemisah */}
          <div className="border-t border-slate-100 dark:border-slate-800 my-1" />

          {/* Opsi: Ubah Profil (ikon user) */}
          <button
            type="button"
            role="menuitem"
            onClick={handleOpenProfileModal}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/70 transition-colors text-left cursor-pointer group"
          >
            <div className="p-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 group-hover:text-blue-600 transition-colors">
              <UserIcon className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <span className="font-medium">Ubah Profil</span>
              <p className="text-[10px] text-slate-400">Nama, username &amp; foto</p>
            </div>
          </button>

          {/* Opsi: Ubah Password (ikon lock) */}
          <button
            type="button"
            role="menuitem"
            onClick={handleOpenPasswordModal}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/70 transition-colors text-left cursor-pointer group"
          >
            <div className="p-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 group-hover:text-blue-600 transition-colors">
              <Lock className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <span className="font-medium">Ubah Password</span>
              <p className="text-[10px] text-slate-400">Keamanan akun Anda</p>
            </div>
          </button>

          {/* Garis Pemisah */}
          <div className="border-t border-slate-100 dark:border-slate-800 my-1" />

          {/* Opsi: Keluar (ikon logout dengan text-red-600) */}
          <button
            type="button"
            role="menuitem"
            onClick={handleLogoutAction}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors text-left cursor-pointer group"
          >
            <div className="p-1 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 group-hover:bg-red-200/60 dark:group-hover:bg-red-900/50 transition-colors">
              <LogOut className="w-4 h-4" />
            </div>
            <span className="font-medium">Keluar</span>
          </button>
        </div>
      )}

      {/* 3. MODAL UBAH PROFIL:
          - Dirender via createPortal langsung ke document.body agar tidak terpotong oleh containing block / backdrop-blur header
          - Berada persis di tengah layar (vertically & horizontally centered)
          - Tombol klik foto tersambung langsung membuka dialog file foto lokal
      */}
      {mounted &&
        isProfileModalOpen &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-profile-title"
              className="relative w-full max-w-md my-auto max-h-[90vh] overflow-y-auto rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl animate-in zoom-in-95 duration-200"
            >
              {/* Modal Header */}
              <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
                <div>
                  <h3 id="modal-profile-title" className="text-base font-bold text-slate-900 dark:text-slate-100">
                    Ubah Profil
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Perbarui identitas profil Data Analyst Anda
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsProfileModalOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  aria-label="Tutup"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleSaveProfile} className="p-6 space-y-5">
                {/* Fitur Unggah Foto Profil (Lokal) */}
                <div className="flex flex-col items-center space-y-3">
                  <input
                    type="file"
                    id="upload-foto"
                    ref={fileInputRef}
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />

                  {/* Foto Profil Bundar yang bisa diklik */}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-slate-200 dark:border-slate-700 shadow-md cursor-pointer group ring-4 ring-blue-500/10 hover:ring-blue-500/30 transition-all select-none"
                    title="Klik untuk memilih foto dari perangkat Anda"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={previewImage}
                      alt="Pratinjau Foto Profil"
                      className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                    />

                    {/* Overlay Ikon Kamera saat di-hover */}
                    <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center text-white">
                      <Camera className="w-6 h-6 mb-1 text-white animate-pulse" />
                      <span className="text-[10px] font-semibold tracking-wide">Ubah Foto</span>
                    </div>
                  </div>

                  {/* Tombol Interaktif Tambahan untuk Unggah Foto */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer shadow-2xs"
                  >
                    <Upload className="w-3.5 h-3.5 text-blue-500" />
                    <span>Pilih Foto dari Komputer</span>
                  </button>

                  <p className="text-[11px] text-slate-400 text-center">
                    Klik foto atau tombol di atas untuk memilih foto lokal (JPG/PNG maks. 5MB)
                  </p>
                </div>

                {/* Input Nama Lengkap */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Contoh: Sarah Jenkins"
                    required
                    className="w-full h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-xs"
                  />
                </div>

                {/* Input Username */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Username
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3.5 text-xs text-slate-400 font-semibold select-none">
                      @
                    </span>
                    <input
                      type="text"
                      value={editUsername}
                      onChange={(e) => setEditUsername(e.target.value)}
                      placeholder="sarah.jenkins"
                      required
                      className="w-full h-10 pl-8 pr-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-xs"
                    />
                  </div>
                </div>

                {/* Footer Buttons: Batal & Simpan */}
                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsProfileModalOpen(false)}
                    disabled={isSavingProfile}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingProfile}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:scale-98 transition-all shadow-sm cursor-pointer disabled:opacity-50"
                  >
                    {isSavingProfile ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Menyimpan...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Simpan</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}

      {/* 4. MODAL UBAH PASSWORD:
          - Dirender via createPortal langsung ke document.body
          - Berada persis di tengah layar
          - 2 input password (Password Baru & Konfirmasi) dengan toggle visibility
      */}
      {mounted &&
        isPasswordModalOpen &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-password-title"
              className="relative w-full max-w-md my-auto max-h-[90vh] overflow-y-auto rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl animate-in zoom-in-95 duration-200"
            >
              {/* Modal Header */}
              <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
                <div>
                  <h3 id="modal-password-title" className="text-base font-bold text-slate-900 dark:text-slate-100">
                    Ubah Password
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Pastikan kata sandi baru Anda kuat dan aman
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  aria-label="Tutup"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handlePasswordChange} className="p-6 space-y-4">
                {/* 1. Input: Masukkan Password Baru */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Masukkan Password Baru
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Minimal 6 karakter"
                      required
                      minLength={6}
                      className="w-full h-10 pl-3.5 pr-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                      aria-label={showNewPassword ? "Sembunyikan password" : "Lihat password"}
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* 2. Input: Konfirmasi Password Baru */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Konfirmasi Password Baru
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Ulangi password baru"
                      required
                      minLength={6}
                      className="w-full h-10 pl-3.5 pr-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                      aria-label={showConfirmPassword ? "Sembunyikan password" : "Lihat password"}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Footer Buttons: Batal & Simpan */}
                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsPasswordModalOpen(false)}
                    disabled={isSavingPassword}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingPassword}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:scale-98 transition-all shadow-sm cursor-pointer disabled:opacity-50"
                  >
                    {isSavingPassword ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Menyimpan...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Simpan</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}

export default ProfileMenu;
