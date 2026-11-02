import React from "react";
import { MethodDashboardView } from "@/components/dashboard/method-dashboard-view";

interface MethodPageProps {
  params: {
    method: string;
  };
}

export function generateStaticParams() {
  return [
    { method: "penunjukan-langsung" },
    { method: "pengadaan-langsung" },
    { method: "e-purchasing" },
    { method: "swakelola" },
    { method: "sayembara" },
    { method: "kontes" },
    { method: "tender" },
    { method: "tender-cepat" },
    { method: "tender-internasional" },
    { method: "pengadaan-darurat" },
    { method: "seleksi" },
    { method: "dikecualikan" },
    { method: "all" },
  ];
}

export default function MethodPage({ params }: MethodPageProps) {
  return <MethodDashboardView methodSlug={params.method} />;
}
