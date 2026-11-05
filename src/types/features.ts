import { CascadingFilterState } from "@/lib/cascading-filter-data";
import { Transaction } from "./dashboard";

export type FeatureKey =
  | "penunjukan_langsung"
  | "pengadaan_langsung"
  | "e_purchasing"
  | "swakelola"
  | "sayembara"
  | "kontes"
  | "tender"
  | "tender_cepat"
  | "tender_internasional"
  | "pengadaan_darurat"
  | "seleksi"
  | "dikecualikan";

export interface FeatureMetadata {
  key: FeatureKey;
  label: string;
  description: string;
  category: "Pemilihan Langsung" | "Tender & Kompetisi" | "E-Katalog" | "Khusus & Swakelola";
  iconName: string;
  badgeColor?: string;
  defaultEnabled: boolean;
}

export type FeatureFlags = Record<FeatureKey, boolean>;

export type YearRange = [number, number];

export interface FeatureContextType {
  features: FeatureFlags;
  isFeatureEnabled: (key: FeatureKey) => boolean;
  toggleFeature: (key: FeatureKey) => void;
  setFeature: (key: FeatureKey, enabled: boolean) => void;
  enableAll: () => void;
  disableAll: () => void;
  resetToDefaults: () => void;
  activeCount: number;
  totalCount: number;
  activeMethods: FeatureKey[];
  yearRange: YearRange;
  setYearRange: (range: YearRange) => void;
  minYear: number;
  maxYear: number;
  cascadingFilter: CascadingFilterState;
  setCascadingFilter: (filter: CascadingFilterState) => void;
  resetCascadingFilter: () => void;
  filteredTransactions: Transaction[];
  filteredStats: {
    totalAmount: number;
    totalPackages: number;
    avgAmount: number;
    efficiencyRatio: string;
  };
  availableMinistries?: string[];
  availableSatkersByMinistry?: Record<string, string[]>;
  availableEselonsByMinistry?: Record<string, string[]>;
  availableSatkersByEselon?: Record<string, string[]>;
  isLoadingData?: boolean;
  rawTransactions?: Transaction[];
  reloadProcurementData?: () => Promise<void>;
}
