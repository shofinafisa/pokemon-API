"use client";

import { Toaster } from "react-hot-toast";

export function AppToaster() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3500,
        style: {
          background: "rgba(15, 23, 42, 0.95)",
          color: "#f8fafc",
          border: "1px solid rgba(51, 65, 85, 0.6)",
          backdropFilter: "blur(12px)",
          borderRadius: "0.875rem",
          padding: "12px 16px",
          fontSize: "13px",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)",
        },
        success: {
          iconTheme: {
            primary: "#10b981",
            secondary: "#ffffff",
          },
        },
        error: {
          iconTheme: {
            primary: "#f43f5e",
            secondary: "#ffffff",
          },
        },
      }}
    />
  );
}

