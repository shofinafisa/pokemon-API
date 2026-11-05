"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { User, UserRole, AuthContextType } from "@/types/auth";

const AUTH_STORAGE_KEY = "enterprise_dashboard_session";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(AUTH_STORAGE_KEY);
        if (stored) return JSON.parse(stored);
      } catch {}
    }
    return null;
  });
  const [role, setRole] = useState<UserRole | null>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(AUTH_STORAGE_KEY);
        if (stored) return JSON.parse(stored).role;
      } catch {}
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(AUTH_STORAGE_KEY);
        if (stored) return false;
      } catch {}
    }
    return true;
  });

  // Helper avatar fallback
  const getAvatar = (name: string, roleVal: string, existingAvatar?: string) => {
    if (existingAvatar) return existingAvatar;
    return roleVal.toUpperCase() === "ADMIN"
      ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
      : "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80";
  };

  const refreshUser = useCallback(async () => {
    try {
      const res = await fetch("/api/auth", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && data.user) {
          const userWithAvatar: User = {
            ...data.user,
            avatar: data.user.avatar || getAvatar(data.user.name, data.user.role),
            title: data.user.role === "ADMIN" ? "Administrator LKPP" : "PPK Satker",
          };
          setUser(userWithAvatar);
          setRole(data.user.role);
          try {
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userWithAvatar));
          } catch {
            // Ignore localStorage errors
          }
          return;
        }
      }
    } catch (e) {
      console.warn("Could not fetch active session from API, falling back to local storage", e);
    }

    // Fallback localStorage jika offline/SSR initial
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const parsed: User = JSON.parse(stored);
        setUser(parsed);
        setRole(parsed.role);
      }
    } catch {
      // Ignore
    }
  }, []);

  // Initialize session on mount
  useEffect(() => {
    refreshUser().finally(() => {
      setIsLoading(false);
    });
  }, [refreshUser]);

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string; role?: UserRole }> => {
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        return {
          success: false,
          error: data.message || "Email atau kata sandi tidak valid.",
        };
      }

      const authenticatedUser: User = {
        ...data.user,
        avatar: data.user.avatar || getAvatar(data.user.name, data.user.role),
        title: data.user.role === "ADMIN" ? "Administrator LKPP" : "PPK Satker",
      };

      setUser(authenticatedUser);
      setRole(data.role);

      try {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authenticatedUser));
      } catch {
        // Ignore
      }

      return {
        success: true,
        role: data.role,
      };
    } catch (error) {
      console.error("Login process error:", error);
      return {
        success: false,
        error: "Koneksi ke server gagal. Pastikan server aktif.",
      };
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth", { method: "DELETE" });
    } catch (e) {
      console.error("Logout request error:", e);
    }
    setUser(null);
    setRole(null);
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch {
      // Ignore
    }
  };

  const switchRole = (newRole: UserRole) => {
    const isTargetAdmin = newRole.toUpperCase() === "ADMIN";
    const dummyUser: User = {
      id: isTargetAdmin ? "usr_admin_inaproc_01" : "usr_satker_ppk_02",
      name: isTargetAdmin ? "Alexander Vance (Admin)" : "Sarah Jenkins (PPK Satker)",
      email: isTargetAdmin ? "admin@dashboard.com" : "user@dashboard.com",
      role: newRole,
      title: isTargetAdmin ? "Administrator LKPP" : "PPK Satker",
      avatar: getAvatar(isTargetAdmin ? "Alexander Vance" : "Sarah Jenkins", newRole),
    };
    setUser(dummyUser);
    setRole(newRole);
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(dummyUser));
    } catch {
      // Ignore
    }
  };

  const updateUserAvatar = async (avatarUrl: string): Promise<boolean> => {
    if (!user) return false;
    try {
      await fetch(`/api/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatar: avatarUrl }),
      });

      const updatedUser: User = {
        ...user,
        avatar: avatarUrl,
      };
      setUser(updatedUser);
      try {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedUser));
      } catch {
        // Ignore
      }

      return true;
    } catch (err) {
      console.error("Failed to update avatar on server:", err);
      const updatedUser: User = {
        ...user,
        avatar: avatarUrl,
      };
      setUser(updatedUser);
      try {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedUser));
      } catch {
        // Ignore
      }
      return true;
    }
  };

  const updateProfile = (newName: string, newUsername?: string, newAvatar?: string) => {
    if (!user) return;
    const updatedUser: User = {
      ...user,
      name: newName,
      username: newUsername || user.username,
      avatar: newAvatar || user.avatar,
    };
    setUser(updatedUser);
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedUser));
    } catch {
      // Ignore
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        switchRole,
        refreshUser,
        updateUserAvatar,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
