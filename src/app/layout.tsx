import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/auth-context";
import { FeatureProvider } from "@/context/feature-context";
import { ToastProvider } from "@/components/ui/toast";
import { AppToaster } from "@/components/ui/app-toaster";

export const metadata: Metadata = {
  title: "DataPulse Enterprise | Dynamic Feature Toggle Dashboard",
  description:
    "Enterprise Data Dashboard dengan Unified Login, Dynamic Feature Toggle Engine, dan Role-Based Access Control.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 antialiased selection:bg-blue-500 selection:text-white">
        <AuthProvider>
          <FeatureProvider>
            <ToastProvider>
              <AppToaster />
              {children}
            </ToastProvider>
          </FeatureProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
