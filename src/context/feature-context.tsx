"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
  useMemo,
} from "react";
import { FeatureKey, FeatureFlags, FeatureContextType, YearRange } from "@/types/features";
import { Transaction } from "@/types/dashboard";
import { FEATURE_CONFIGS, calculateDynamicStats } from "@/lib/mock-data";
import {
  CascadingFilterState,
  INITIAL_CASCADING_FILTER,
} from "@/lib/cascading-filter-data";

const FEATURE_STORAGE_KEY = "inaproc_procurement_methods_v2";
const YEAR_STORAGE_KEY = "inaproc_year_range_v1";

const MIN_YEAR = 2020;
const MAX_YEAR = 2026;
const DEFAULT_YEAR_RANGE: YearRange = [MIN_YEAR, MAX_YEAR];

const DEFAULT_FLAGS: FeatureFlags = FEATURE_CONFIGS.reduce((acc, curr) => {
  acc[curr.key] = curr.defaultEnabled;
  return acc;
}, {} as FeatureFlags);

const FeatureContext = createContext<FeatureContextType | undefined>(undefined);

export function FeatureProvider({ children }: { children: ReactNode }) {
  const [features, setFeatures] = useState<FeatureFlags>(DEFAULT_FLAGS);
  const [yearRange, setYearRangeState] = useState<YearRange>(DEFAULT_YEAR_RANGE);
  const [cascadingFilter, setCascadingFilterState] = useState<CascadingFilterState>({
    ...INITIAL_CASCADING_FILTER,
    yearRange: DEFAULT_YEAR_RANGE,
  });

  // Dynamic Dataset State from data/data.json
  const [rawTransactions, setRawTransactions] = useState<Transaction[]>([]);
  const [availableMinistries, setAvailableMinistries] = useState<string[]>([]);
  const [availableSatkersByMinistry, setAvailableSatkersByMinistry] = useState<Record<string, string[]>>({});
  const [availableEselonsByMinistry, setAvailableEselonsByMinistry] = useState<Record<string, string[]>>({});
  const [availableSatkersByEselon, setAvailableSatkersByEselon] = useState<Record<string, string[]>>({});
  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);

  const reloadProcurementData = useCallback(async () => {
    try {
      setIsLoadingData(true);
      const res = await fetch("/api/procurement-data");
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.transactions)) {
          setRawTransactions(json.transactions);
          if (json.summary) {
            setAvailableMinistries(json.summary.availableMinistries || []);
            setAvailableSatkersByMinistry(json.summary.availableSatkersByMinistry || {});
            setAvailableEselonsByMinistry(json.summary.availableEselonsByMinistry || {});
            setAvailableSatkersByEselon(json.summary.availableSatkersByEselon || {});
          }
        }
      }
    } catch (err) {
      console.error("Gagal mengambil data pengadaan:", err);
    } finally {
      setIsLoadingData(false);
    }
  }, []);

  useEffect(() => {
    reloadProcurementData();
  }, [reloadProcurementData]);

  // Load from localStorage on mount & safely validate
  useEffect(() => {
    try {
      // Load feature flags
      const stored = localStorage.getItem(FEATURE_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const merged: FeatureFlags = { ...DEFAULT_FLAGS };
        (Object.keys(DEFAULT_FLAGS) as FeatureKey[]).forEach((key) => {
          if (typeof parsed[key] === "boolean") {
            merged[key] = parsed[key];
          }
        });
        setFeatures(merged);
      } else {
        localStorage.setItem(FEATURE_STORAGE_KEY, JSON.stringify(DEFAULT_FLAGS));
      }

      // Load year range
      const storedYears = localStorage.getItem(YEAR_STORAGE_KEY);
      if (storedYears) {
        const parsedYears = JSON.parse(storedYears);
        if (
          Array.isArray(parsedYears) &&
          parsedYears.length === 2 &&
          typeof parsedYears[0] === "number" &&
          typeof parsedYears[1] === "number" &&
          parsedYears[0] <= parsedYears[1]
        ) {
          const clamped: YearRange = [
            Math.max(MIN_YEAR, parsedYears[0]),
            Math.min(MAX_YEAR, parsedYears[1]),
          ];
          setYearRangeState(clamped);
          setCascadingFilterState((prev) => ({ ...prev, yearRange: clamped }));
        }
      }
    } catch (e) {
      console.error("Failed to load settings from localStorage", e);
    }
  }, []);

  // Listen for storage events (cross-tab sync only)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === FEATURE_STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setFeatures((prev) => ({
            ...prev,
            ...parsed,
          }));
        } catch (err) {
          console.error("Failed to sync feature storage change", err);
        }
      } else if (e.key === YEAR_STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed) && parsed.length === 2) {
            const clamped: YearRange = [parsed[0], parsed[1]];
            setYearRangeState(clamped);
            setCascadingFilterState((prev) => ({ ...prev, yearRange: clamped }));
          }
        } catch (err) {
          console.error("Failed to sync year storage change", err);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const setYearRange = useCallback((newRange: YearRange) => {
    const validStart = Math.max(MIN_YEAR, Math.min(newRange[0], newRange[1]));
    const validEnd = Math.min(MAX_YEAR, Math.max(newRange[0], newRange[1]));
    const clamped: YearRange = [validStart, validEnd];
    setYearRangeState(clamped);
    setCascadingFilterState((prev) => ({ ...prev, yearRange: clamped }));
    try {
      localStorage.setItem(YEAR_STORAGE_KEY, JSON.stringify(clamped));
    } catch (e) {
      console.error("Failed to persist year range", e);
    }
  }, []);

  const setCascadingFilter = useCallback(
    (next: CascadingFilterState) => {
      setCascadingFilterState(next);
      if (
        next.yearRange &&
        (next.yearRange[0] !== yearRange[0] || next.yearRange[1] !== yearRange[1])
      ) {
        setYearRangeState(next.yearRange);
        try {
          localStorage.setItem(YEAR_STORAGE_KEY, JSON.stringify(next.yearRange));
        } catch (e) {
          console.error("Failed to persist year range", e);
        }
      }
    },
    [yearRange]
  );

  const resetCascadingFilter = useCallback(() => {
    const resetState: CascadingFilterState = {
      yearRange: DEFAULT_YEAR_RANGE,
      jenisInstansi: [],
      instansi: [],
      eselon: [],
      satker: [],
    };
    setCascadingFilterState(resetState);
    setYearRangeState(DEFAULT_YEAR_RANGE);
    try {
      localStorage.setItem(YEAR_STORAGE_KEY, JSON.stringify(DEFAULT_YEAR_RANGE));
    } catch (e) {
      console.error("Failed to save default year range", e);
    }
  }, []);

  const toggleFeature = useCallback((key: FeatureKey) => {
    setFeatures((prev) => {
      const nextVal = !prev[key];
      const updated: FeatureFlags = {
        ...prev,
        [key]: nextVal,
      };
      try {
        localStorage.setItem(FEATURE_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error("Failed to persist feature flags", e);
      }
      return updated;
    });
  }, []);

  const setFeature = useCallback((key: FeatureKey, enabled: boolean) => {
    setFeatures((prev) => {
      const updated: FeatureFlags = {
        ...prev,
        [key]: enabled,
      };
      try {
        localStorage.setItem(FEATURE_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error("Failed to persist feature flags", e);
      }
      return updated;
    });
  }, []);

  const enableAll = useCallback(() => {
    const updated: FeatureFlags = {} as FeatureFlags;
    (Object.keys(DEFAULT_FLAGS) as FeatureKey[]).forEach((k) => {
      updated[k] = true;
    });
    setFeatures(updated);
    try {
      localStorage.setItem(FEATURE_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to persist feature flags", e);
    }
  }, []);

  const disableAll = useCallback(() => {
    const updated: FeatureFlags = {} as FeatureFlags;
    (Object.keys(DEFAULT_FLAGS) as FeatureKey[]).forEach((k) => {
      updated[k] = false;
    });
    setFeatures(updated);
    try {
      localStorage.setItem(FEATURE_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to persist feature flags", e);
    }
  }, []);

  const resetToDefaults = useCallback(() => {
    setFeatures(DEFAULT_FLAGS);
    resetCascadingFilter();
    try {
      localStorage.setItem(FEATURE_STORAGE_KEY, JSON.stringify(DEFAULT_FLAGS));
    } catch (e) {
      console.error("Failed to save defaults to storage", e);
    }
  }, [resetCascadingFilter]);

  const activeMethods = useMemo(
    () => (Object.keys(features) as FeatureKey[]).filter((k) => Boolean(features[k])),
    [features]
  );
  const activeCount = activeMethods.length;
  const totalCount = Object.keys(DEFAULT_FLAGS).length;

  const isFeatureEnabled = useCallback(
    (key: FeatureKey): boolean => {
      return Boolean(features[key]);
    },
    [features]
  );

  // Core Real-Time Filter Engine: calculates filteredTransactions and stats
  const { filteredTransactions, totalAmount, totalPackages, avgAmount, efficiencyRatio } =
    useMemo(() => {
      return calculateDynamicStats(
        activeMethods,
        yearRange,
        {
          jenisInstansi: cascadingFilter.jenisInstansi,
          instansi: cascadingFilter.instansi,
          eselon: cascadingFilter.eselon,
          satker: cascadingFilter.satker,
        },
        rawTransactions
      );
    }, [activeMethods, yearRange, cascadingFilter, rawTransactions]);

  const filteredStats = useMemo(
    () => ({
      totalAmount,
      totalPackages,
      avgAmount,
      efficiencyRatio,
    }),
    [totalAmount, totalPackages, avgAmount, efficiencyRatio]
  );

  return (
    <FeatureContext.Provider
      value={{
        features,
        isFeatureEnabled,
        toggleFeature,
        setFeature,
        enableAll,
        disableAll,
        resetToDefaults,
        activeCount,
        totalCount,
        activeMethods,
        yearRange,
        setYearRange,
        minYear: MIN_YEAR,
        maxYear: MAX_YEAR,
        cascadingFilter,
        setCascadingFilter,
        resetCascadingFilter,
        filteredTransactions,
        filteredStats,
        availableMinistries,
        availableSatkersByMinistry,
        availableEselonsByMinistry,
        availableSatkersByEselon,
        isLoadingData,
        rawTransactions,
        reloadProcurementData,
      }}
    >
      {children}
    </FeatureContext.Provider>
  );
}

export function useFeatures() {
  const context = useContext(FeatureContext);
  if (!context) {
    throw new Error("useFeatures must be used within a FeatureProvider");
  }
  return context;
}
