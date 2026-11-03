"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import toast from "react-hot-toast";
import {
  X,
  Upload,
  Camera,
  Check,
  RefreshCcw,
  Sparkles,
  Link as LinkIcon,
  Loader2,
  User as UserIcon,
} from "lucide-react";

export const AVATAR_PRESETS = [
  {
    id: "preset-admin-1",
    label: "Executive (Pria)",
    url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
  },
  {
    id: "preset-user-1",
    label: "PPK (Wanita)",
    url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80",
  },
  {
    id: "preset-auditor-1",
    label: "Auditor (Pria)",
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
  },
  {
    id: "preset-female-2",
    label: "Manajerial (Wanita)",
    url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80",
  },
  {
    id: "preset-male-2",
    label: "Analis Pengadaan",
    url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80",
  },
  {
    id: "preset-female-3",
    label: "Pokja (Wanita)",
    url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80",
  },
  {
    id: "preset-male-3",
    label: "Inspektorat",
    url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80",
  },
  {
    id: "preset-female-4",
    label: "Satker Daerah",
    url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80",
  },
];

interface EditAvatarModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUser?: {
    id: string;
    name: string;
    email: string;
    role?: string;
    avatar?: string;
  } | null;
  onSaveSuccess?: (userId: string, newAvatar: string) => void;
}

export function EditAvatarModal({
  isOpen,
  onClose,
  targetUser,
  onSaveSuccess,
}: EditAvatarModalProps) {
  const { user: currentUser, updateUserAvatar } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Active target user is either the passed target or the logged-in user
  const effectiveUser = targetUser || currentUser;

  const [previewAvatar, setPreviewAvatar] = useState<string>("");
  const [customUrl, setCustomUrl] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"preset" | "upload" | "url">("preset");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen && effectiveUser) {
      setPreviewAvatar(effectiveUser.avatar || "");
      setCustomUrl("");
    }
  }, [isOpen, effectiveUser]);

  if (!isOpen || !effectiveUser) return null;

  // Handle local file upload (converts to base64 data URL)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Format file harus berupa gambar (JPG, PNG, GIF, WebP).");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Ukuran file maksimal 2 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setPreviewAvatar(result);
        toast.success("Foto berhasil dimuat. Klik 'Simpan Foto' untuk menerapkan.", { icon: "📷" });
      }
    };
    reader.onerror = () => {
      toast.error("Gagal membaca file gambar.");
    };
    reader.readAsDataURL(file);
  };

  const handleApplyUrl = () => {
    if (!customUrl.trim()) {
      toast.error("Silakan masukkan URL gambar terlebih dahulu.");
      return;
    }
    setPreviewAvatar(customUrl.trim());
    toast.success("URL gambar berhasil diterapkan ke pratinjau!");
  };

  const handleResetToDefault = () => {
    const defaultUrl =
      effectiveUser.role?.toUpperCase() === "ADMIN"
        ? AVATAR_PRESETS[0].url
        : AVATAR_PRESETS[1].url;
    setPreviewAvatar(defaultUrl);
    toast.success("Pratinjau dikembalikan ke avatar default.");
  };

  const handleSave = async () => {
    if (!previewAvatar) {
      toast.error("Foto profil tidak boleh kosong.");
      return;
    }

    setIsSaving(true);
    try {
      // If we are editing another target user (from Admin Settings Table)
      if (targetUser && targetUser.id !== currentUser?.id) {
        const res = await fetch(`/api/users/${targetUser.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ avatar: previewAvatar }),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          toast.success(`Foto profil untuk ${targetUser.name} berhasil diperbarui!`, { icon: "📸" });
          if (onSaveSuccess) onSaveSuccess(targetUser.id, previewAvatar);
          onClose();
        } else {
          toast.error(data.message || "Gagal memperbarui foto profil.");
        }
      } else {
        // Editing current user
        const success = await updateUserAvatar(previewAvatar);
        if (success) {
          toast.success("Foto profil akun Anda berhasil diperbarui!", { icon: "📸" });
          if (onSaveSuccess) onSaveSuccess(effectiveUser.id, previewAvatar);
          onClose();
        } else {
          toast.error("Gagal memperbarui foto profil.");
        }
      }
    } catch {
      toast.error("Terjadi kesalahan saat menyimpan foto profil.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Edit Foto Profil
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Ubah foto profil untuk akun <strong className="text-slate-700 dark:text-slate-200">{effectiveUser.name}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Live Preview Card */}
          <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-2xl bg-gradient-to-br from-blue-50/80 via-indigo-50/40 to-slate-50 dark:from-blue-950/20 dark:via-slate-900 dark:to-slate-900 border border-blue-100 dark:border-blue-900/30">
            <div className="relative group shrink-0">
              <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-blue-500/30 shadow-lg bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                {previewAvatar ? (
                  <Image
                    src={previewAvatar}
                    alt={effectiveUser.name}
                    width={96}
                    height={96}
                    unoptimized
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <UserIcon className="w-10 h-10 text-slate-400" />
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-blue-600 text-white shadow-md">
                <Sparkles className="w-3 h-3" />
              </div>
            </div>

            <div className="space-y-1.5 text-center sm:text-left flex-1 min-w-0">
              <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 truncate">
                  {effectiveUser.name}
                </h4>
                <Badge
                  variant="secondary"
                  className="text-[10px] px-2 py-0.5 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border-0"
                >
                  {effectiveUser.role?.toUpperCase() === "ADMIN" ? "ADMINISTRATOR" : "PPK SATKER"}
                </Badge>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                {effectiveUser.email}
              </p>
              <div className="pt-1 flex items-center justify-center sm:justify-start gap-2">
                <button
                  type="button"
                  onClick={handleResetToDefault}
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors cursor-pointer"
                >
                  <RefreshCcw className="w-3 h-3" />
                  <span>Kembalikan Default</span>
                </button>
              </div>
            </div>
          </div>

          {/* Tab Selector for Selection Mode */}
          <div className="space-y-3">
            <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setActiveTab("preset")}
                className={`flex-1 py-1.5 px-3 rounded-lg font-medium transition-all cursor-pointer ${
                  activeTab === "preset"
                    ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs font-semibold"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                Koleksi Avatar
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("upload")}
                className={`flex-1 py-1.5 px-3 rounded-lg font-medium transition-all cursor-pointer ${
                  activeTab === "upload"
                    ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs font-semibold"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                Upload Foto
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("url")}
                className={`flex-1 py-1.5 px-3 rounded-lg font-medium transition-all cursor-pointer ${
                  activeTab === "url"
                    ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs font-semibold"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                Tautan URL
              </button>
            </div>

            {/* TAB 1: Preset Avatars */}
            {activeTab === "preset" && (
              <div className="space-y-2">
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Pilih salah satu avatar profesional resmi INAPROC / LKPP di bawah ini:
                </p>
                <div className="grid grid-cols-4 gap-3 pt-1">
                  {AVATAR_PRESETS.map((preset) => {
                    const isSelected = previewAvatar === preset.url;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => setPreviewAvatar(preset.url)}
                        className={`group relative flex flex-col items-center gap-1.5 p-2 rounded-2xl border transition-all cursor-pointer ${
                          isSelected
                            ? "border-blue-600 bg-blue-50/60 dark:bg-blue-950/30 ring-2 ring-blue-500/30"
                            : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900"
                        }`}
                      >
                        <div className="relative w-12 h-12 rounded-full overflow-hidden shadow-xs">
                          <Image
                            src={preset.url}
                            alt={preset.label}
                            width={48}
                            height={48}
                            unoptimized
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
                          />
                          {isSelected && (
                            <div className="absolute inset-0 bg-blue-600/30 flex items-center justify-center">
                              <Check className="w-4 h-4 text-white drop-shadow-md stroke-[3]" />
                            </div>
                          )}
                        </div>
                        <span className="text-[10px] font-medium text-slate-600 dark:text-slate-300 text-center truncate max-w-full">
                          {preset.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 2: Upload File */}
            {activeTab === "upload" && (
              <div className="space-y-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/png, image/jpeg, image/jpg, image/webp, image/gif"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center justify-center gap-3 p-8 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-400 bg-slate-50/50 dark:bg-slate-800/30 hover:bg-blue-50/30 dark:hover:bg-blue-950/20 transition-all cursor-pointer text-center"
                >
                  <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 shadow-xs">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      Klik untuk memilih foto dari komputer
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Format didukung: JPG, PNG, WebP atau GIF (Maks. 2 MB)
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: Custom URL */}
            {activeTab === "url" && (
              <div className="space-y-3">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block">
                  Alamat URL Gambar Langsung
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <LinkIcon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="url"
                      placeholder="https://contoh.com/foto-profil.jpg"
                      value={customUrl}
                      onChange={(e) => setCustomUrl(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={handleApplyUrl}
                    variant="outline"
                    className="text-xs rounded-xl h-9 px-3 border-slate-300 dark:border-slate-700"
                  >
                    Terapkan
                  </Button>
                </div>
                <p className="text-[11px] text-slate-400">
                  Pastikan URL dapat diakses secara publik dan menggunakan format gambar yang valid.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2.5 px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={isSaving}
            className="text-xs rounded-xl h-9 px-4 text-slate-600 dark:text-slate-400"
          >
            Batal
          </Button>

          <Button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="bg-blue-600 hover:bg-blue-500 text-white text-xs rounded-xl shadow-md shadow-blue-500/20 h-9 px-5 gap-1.5 cursor-pointer font-semibold"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Simpan Foto Profil</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

