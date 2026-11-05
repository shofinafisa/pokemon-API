"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  CascadingFilterState,
  JENIS_INSTANSI_LIST,
  getInstansiOptions,
  getEselonOptions,
  getSatkerOptions,
} from "@/lib/cascading-filter-data";
import { DateFilter } from "@/components/dashboard/date-filter";
import { RotateCcw, ChevronDown, Calendar, Search, X } from "lucide-react";
import { useFeatures } from "@/context/feature-context";

interface MultiSelectDropdownProps {
  label: string;
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  disabled?: boolean;
  placeholder?: string;
  searchable?: boolean;
  autoSortSelectedFirst?: boolean;
}

function MultiSelectDropdown({
  label,
  options,
  selected,
  onChange,
  disabled = false,
  placeholder = "Semua",
  searchable = true,
  autoSortSelectedFirst = false,
}: MultiSelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Auto focus search input when opened
  useEffect(() => {
    if (isOpen) {
      setSearchTerm("");
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Options sorting and filtering
  // When autoSortSelectedFirst is true:
  // - Checked items appear at the very top (sorted alphabetically)
  // - Unchecked items appear below (sorted alphabetically)
  // - When user unchecks an item, it moves back to the unchecked group
  const displayedOptions = useMemo(() => {
    const matching = searchTerm.trim()
      ? options.filter((opt) => opt.toLowerCase().includes(searchTerm.toLowerCase()))
      : options;

    if (!autoSortSelectedFirst) {
      return matching;
    }

    return [...matching].sort((a, b) => {
      const aSelected = selected.includes(a);
      const bSelected = selected.includes(b);

      if (aSelected && !bSelected) return -1;
      if (!aSelected && bSelected) return 1;

      return a.localeCompare(b);
    });
  }, [options, selected, searchTerm, autoSortSelectedFirst]);

  const handleSelectAll = () => {
    if (searchTerm.trim()) {
      // Add all currently filtered options to selected without duplicates
      const newSet = new Set([...selected, ...displayedOptions]);
      onChange(Array.from(newSet));
    } else {
      onChange([...options]);
    }
  };

  const handleClear = () => {
    if (searchTerm.trim()) {
      // Remove only the displayed options from selected
      const displayedSet = new Set(displayedOptions);
      onChange(selected.filter((item) => !displayedSet.has(item)));
    } else {
      onChange([]);
    }
  };

  const toggleOption = (opt: string) => {
    if (selected.includes(opt)) {
      onChange(selected.filter((item) => item !== opt));
    } else {
      onChange([...selected, opt]);
    }
  };

  return (
    <div className="relative flex-1 min-w-[140px] sm:min-w-[160px]" ref={containerRef}>
      <label className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block mb-1">
        {label}
      </label>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full h-9 px-3 rounded-xl border text-xs font-medium flex items-center justify-between gap-1.5 transition-all text-left shadow-2xs ${
          disabled
            ? "bg-slate-100 dark:bg-slate-800/50 text-slate-400 border-slate-200 dark:border-slate-800 cursor-not-allowed"
            : selected.length > 0
            ? "border-blue-500/50 bg-blue-50/50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-300 font-semibold"
            : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60"
        }`}
      >
        <span className="truncate">
          {selected.length === 0
            ? placeholder
            : selected.length === 1
            ? selected[0]
            : `${selected.length} Terpilih`}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Popover Checklist Dropdown with Search */}
      {isOpen && !disabled && (
        <div className="absolute left-0 top-full mt-1.5 z-40 w-72 sm:w-80 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden flex flex-col text-xs animate-in fade-in zoom-in-95 duration-150">
          {/* Search Header Bar */}
          <div className="p-2.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/60 space-y-2">
            {searchable && (
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder={`Cari ${label.toLowerCase()}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-7 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}

            <div className="flex items-center justify-between text-[11px] px-0.5">
              <button
                type="button"
                onClick={handleSelectAll}
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium cursor-pointer"
              >
                Pilih Semua {searchTerm ? `(${displayedOptions.length})` : ""}
              </button>
              <div className="flex items-center gap-2">
                {selected.length > 0 && (
                  <span className="text-[10px] text-slate-400 font-normal">
                    {selected.length} dipilih
                  </span>
                )}
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* Options Checklist List */}
          <div className="overflow-y-auto p-1.5 space-y-0.5 flex-1 max-h-56">
            {displayedOptions.length === 0 ? (
              <div className="py-6 px-3 text-center space-y-1">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Tidak ditemukan
                </p>
                <p className="text-[10px] text-slate-400">
                  Tidak ada {label.toLowerCase()} yang sesuai &ldquo;{searchTerm}&rdquo;
                </p>
              </div>
            ) : (
              displayedOptions.map((opt) => {
                const isChecked = selected.includes(opt);
                return (
                  <label
                    key={opt}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleOption(opt)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5 cursor-pointer shrink-0"
                    />
                    <span
                      className={`text-xs break-words leading-tight ${
                        isChecked
                          ? "font-semibold text-slate-900 dark:text-slate-100"
                          : "text-slate-600 dark:text-slate-300"
                      }`}
                    >
                      {opt}
                    </span>
                  </label>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

interface CascadingFilterBarProps {
  filterState: CascadingFilterState;
  onChange: (next: CascadingFilterState) => void;
  onReset: () => void;
}

export function CascadingFilterBar({
  filterState,
  onChange,
  onReset,
}: CascadingFilterBarProps) {
  const {
    availableMinistries,
    availableSatkersByMinistry,
    availableEselonsByMinistry,
    availableSatkersByEselon,
  } = useFeatures();

  // 1. Instansi options dinamis dari data.json (atau fallback mock)
  const instansiOptions = useMemo(() => {
    if (availableMinistries && availableMinistries.length > 0) {
      if (filterState.jenisInstansi.length === 0) {
        return availableMinistries;
      }
      return availableMinistries.filter((ins) => {
        const u = ins.toUpperCase();
        return filterState.jenisInstansi.some((j) => {
          if (j === "Kementerian") return u.includes("KEMENTERIAN") || u.includes("BENDAHARA UMUM NEGARA");
          if (j === "Lembaga") return u.includes("LEMBAGA") || u.includes("BADAN");
          if (j === "Pemerintah Daerah Provinsi") return u.includes("PROVINSI");
          if (j === "Pemerintah Daerah Kab/Kota") return u.includes("KOTA") || u.includes("KABUPATEN");
          return true;
        });
      });
    }
    return getInstansiOptions(filterState.jenisInstansi);
  }, [availableMinistries, filterState.jenisInstansi]);

  // 2. Eselon options dinamis
  const eselonOptions = useMemo(() => {
    if (availableEselonsByMinistry && Object.keys(availableEselonsByMinistry).length > 0) {
      if (filterState.instansi.length > 0) {
        const set = new Set<string>();
        filterState.instansi.forEach((ins) => {
          (availableEselonsByMinistry[ins] || []).forEach((es) => set.add(es));
        });
        return Array.from(set).sort();
      }
      const allEselons = new Set<string>();
      Object.values(availableEselonsByMinistry).forEach((list) => {
        list.forEach((es) => allEselons.add(es));
      });
      return Array.from(allEselons).sort();
    }
    return getEselonOptions(filterState.instansi);
  }, [availableEselonsByMinistry, filterState.instansi]);

  // 3. Satker options dinamis
  const satkerOptions = useMemo(() => {
    if (availableSatkersByMinistry && Object.keys(availableSatkersByMinistry).length > 0) {
      if (filterState.eselon.length > 0 && availableSatkersByEselon) {
        const set = new Set<string>();
        filterState.eselon.forEach((es) => {
          (availableSatkersByEselon[es] || []).forEach((s) => set.add(s));
        });
        return Array.from(set).sort();
      }
      if (filterState.instansi.length > 0) {
        const set = new Set<string>();
        filterState.instansi.forEach((ins) => {
          (availableSatkersByMinistry[ins] || []).forEach((s) => set.add(s));
        });
        return Array.from(set).sort();
      }
      const allSatkers = new Set<string>();
      Object.values(availableSatkersByMinistry).forEach((list) => {
        list.forEach((s) => allSatkers.add(s));
      });
      return Array.from(allSatkers).sort();
    }
    return getSatkerOptions(filterState.eselon);
  }, [availableSatkersByMinistry, availableSatkersByEselon, filterState.eselon, filterState.instansi]);

  const isYearFiltered =
    filterState.yearRange[0] !== 2020 || filterState.yearRange[1] !== 2026;

  const hasActiveFilters =
    filterState.jenisInstansi.length > 0 ||
    filterState.instansi.length > 0 ||
    filterState.eselon.length > 0 ||
    filterState.satker.length > 0 ||
    isYearFiltered;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-xs transition-all">
      {/* Filter Row */}
      <div className="flex flex-wrap lg:flex-nowrap items-end gap-2.5">
        {/* Dual Range Slider: Rentang Tahun */}
        <div className="relative flex-1 min-w-[170px] sm:min-w-[190px]">
          <label className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block mb-1 flex items-center gap-1">
            <Calendar className="w-3 h-3 text-blue-500" />
            Rentang Tahun
          </label>
          <DateFilter
            value={filterState.yearRange}
            onChange={(newRange) =>
              onChange({
                ...filterState,
                yearRange: newRange,
              })
            }
            align="left"
            buttonClassName="w-full justify-between"
          />
        </div>

        {/* Multiple Choice: Jenis Instansi */}
        <MultiSelectDropdown
          label="Jenis Instansi"
          options={JENIS_INSTANSI_LIST}
          selected={filterState.jenisInstansi}
          onChange={(jenis) =>
            onChange({
              ...filterState,
              jenisInstansi: jenis,
              instansi: [],
              eselon: [],
              satker: [],
            })
          }
          placeholder="Semua Jenis"
          searchable={true}
          autoSortSelectedFirst={false}
        />

        {/* Multiple Choice: Instansi (dengan Fitur Search & Auto-Sort Selected First) */}
        <MultiSelectDropdown
          label="Instansi"
          options={instansiOptions}
          selected={filterState.instansi}
          onChange={(ins) =>
            onChange({
              ...filterState,
              instansi: ins,
              eselon: [],
              satker: [],
            })
          }
          placeholder="Semua Instansi"
          searchable={true}
          autoSortSelectedFirst={true}
        />

        {/* Multiple Choice: Eselon I / II (dengan Fitur Search & Auto-Sort Selected First) */}
        <MultiSelectDropdown
          label="Eselon I / II"
          options={eselonOptions}
          selected={filterState.eselon}
          onChange={(es) =>
            onChange({
              ...filterState,
              eselon: es,
              satker: [],
            })
          }
          placeholder="Semua Eselon"
          searchable={true}
          autoSortSelectedFirst={true}
        />

        {/* Multiple Choice: Satker (dengan Fitur Search & Auto-Sort Selected First) */}
        <MultiSelectDropdown
          label="Satker"
          options={satkerOptions}
          selected={filterState.satker}
          onChange={(stk) =>
            onChange({
              ...filterState,
              satker: stk,
            })
          }
          placeholder="Semua Satker"
          searchable={true}
          autoSortSelectedFirst={true}
        />

        {/* Reset Filter Button */}
        <button
          type="button"
          onClick={onReset}
          disabled={!hasActiveFilters}
          className="h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-1.5 text-xs font-medium transition-all shrink-0 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed mb-0"
          title="Reset semua filter"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
}
