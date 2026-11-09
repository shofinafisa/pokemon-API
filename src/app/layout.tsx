import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/ui/toast";

export const metadata: Metadata = {
  title: "PokéAPI Hub | Pokémon Ditto Explorer",
  description:
    "Aplikasi integrasi PokéAPI REST v2 untuk menampilkan data lengkap Pokémon Ditto dengan visualisasi statistik, kemampuan, galeri sprite, dan respon raw JSON.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-purple-600 selection:text-white">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
