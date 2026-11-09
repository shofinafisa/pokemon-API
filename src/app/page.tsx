"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  Sparkles,
  Volume2,
  Copy,
  Check,
  ExternalLink,
  RefreshCw,
  Dna,
  Zap,
  Shield,
  Heart,
  Swords,
  Gauge,
  Layers,
  ChevronRight,
  Info,
  Terminal,
} from "@/components/ui/icons";
import {
  PokemonData,
  POPULAR_POKEMON,
  POKEMON_TYPE_COLORS,
  DITTO_OFFLINE_DATA,
} from "@/lib/pokemon-data";

interface ApiResponse {
  success: boolean;
  source: string;
  url: string;
  responseTimeMs?: number;
  data: PokemonData;
  error?: string;
}

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("ditto");
  const [currentPokemon, setCurrentPokemon] = useState<PokemonData>(DITTO_OFFLINE_DATA);
  const [apiMeta, setApiMeta] = useState<{
    source: string;
    url: string;
    responseTimeMs: number;
  }>({
    source: "Memuat dari PokéAPI...",
    url: "https://pokeapi.co/api/v2/pokemon/ditto",
    responseTimeMs: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isShiny, setIsShiny] = useState(false);
  const [activeTab, setActiveTab] = useState<"stats" | "sprites" | "moves" | "json">("stats");
  const [copiedType, setCopiedType] = useState<"url" | "json" | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPlayingCry, setIsPlayingCry] = useState(false);

  // Fetch Pokemon function
  const fetchPokemon = useCallback(async (query: string) => {
    if (!query.trim()) return;
    setIsLoading(true);
    setErrorMessage(null);

    const startTime = Date.now();

    try {
      const res = await fetch(`/api/pokemon?name=${encodeURIComponent(query.trim().toLowerCase())}`);
      const json: ApiResponse = await res.json();

      if (json.success && json.data) {
        setCurrentPokemon(json.data);
        setApiMeta({
          source: json.source || "PokéAPI Live",
          url: json.url || `https://pokeapi.co/api/v2/pokemon/${query.toLowerCase()}`,
          responseTimeMs: json.responseTimeMs || Date.now() - startTime,
        });
      } else {
        setErrorMessage(json.error || `Pokémon "${query}" tidak ditemukan.`);
      }
    } catch {
      if (query.toLowerCase() === "ditto" || query === "132") {
        setCurrentPokemon(DITTO_OFFLINE_DATA);
        setApiMeta({
          source: "PokéAPI Fallback Cache (Ditto)",
          url: "https://pokeapi.co/api/v2/pokemon/ditto",
          responseTimeMs: Date.now() - startTime,
        });
      } else {
        setErrorMessage("Gagal menghubungkan ke server PokéAPI. Periksa koneksi internet.");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load: Fetch Ditto
  useEffect(() => {
    fetchPokemon("ditto");
  }, [fetchPokemon]);

  // Audio cry player
  const playCry = () => {
    const cryUrl =
      currentPokemon.cries?.latest ||
      `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${currentPokemon.id}.ogg`;

    if (!cryUrl) return;

    try {
      setIsPlayingCry(true);
      const audio = new Audio(cryUrl);
      audio.volume = 0.5;
      audio.onended = () => setIsPlayingCry(false);
      audio.onerror = () => setIsPlayingCry(false);
      audio.play().catch(() => setIsPlayingCry(false));
    } catch {
      setIsPlayingCry(false);
    }
  };

  // Copy helpers
  const handleCopy = (text: string, type: "url" | "json") => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const getStatPercent = (val: number) => Math.min(100, Math.round((val / 200) * 100));

  // Primary type styling
  const primaryType = currentPokemon.types[0]?.type.name || "normal";
  const typeConfig = POKEMON_TYPE_COLORS[primaryType] || POKEMON_TYPE_COLORS.normal;

  // Artwork sprite selection
  const artwork = isShiny
    ? currentPokemon.sprites.other?.["official-artwork"]?.front_shiny ||
      currentPokemon.sprites.front_shiny ||
      currentPokemon.sprites.front_default
    : currentPokemon.sprites.other?.["official-artwork"]?.front_default ||
      currentPokemon.sprites.front_default;

  const totalStats = currentPokemon.stats.reduce((acc, curr) => acc + curr.base_stat, 0);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-purple-600 selection:text-white">
      {/* Top Navbar */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20 ring-1 ring-purple-400/30">
              <span className="text-xl">⚡</span>
            </div>
            <div>
              <h1 className="font-bold text-base sm:text-lg tracking-tight flex items-center gap-2">
                <span>PokéAPI Hub</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 font-medium">
                  Beranda Publik
                </span>
              </h1>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Koneksi langsung ke endpoint resmi PokéAPI v2
              </p>
            </div>
          </div>

          {/* Quick Endpoint Badge & Back Link */}
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/70 border border-slate-700/60 text-xs font-mono text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-slate-400">Endpoint:</span>
              <span className="text-purple-300 truncate max-w-[260px]">{apiMeta.url}</span>
            </div>

            <button
              onClick={() => handleCopy(apiMeta.url, "url")}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700/80 text-xs flex items-center gap-1.5 transition text-slate-200"
              title="Salin URL API"
            >
              {copiedType === "url" ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-medium">Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span className="hidden sm:inline">Salin URL</span>
                </>
              )}
            </button>

            <a
              href="https://pokeapi.co/api/v2/pokemon/ditto"
              target="_blank"
              rel="noreferrer"
              className="p-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-300 text-xs flex items-center gap-1 transition"
              title="Buka JSON Asli di Tab Baru"
            >
              <ExternalLink className="w-4 h-4" />
            </a>


          </div>
        </div>
      </header>

      {/* Hero Search & Controls */}
      <section className="border-b border-slate-800/60 bg-gradient-to-b from-slate-900/40 via-slate-950 to-slate-950 pt-8 pb-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Beranda Tunggal &mdash; Tanpa Halaman Login</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-purple-300 via-pink-200 to-amber-200 bg-clip-text text-transparent">
              Hasil Integrasi PokéAPI: {currentPokemon.name.toUpperCase()}
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto">
              Menampilkan data live langsung dari endpoint resmi PokéAPI (
              <code className="text-purple-300 text-xs bg-purple-950/60 px-1 py-0.5 rounded border border-purple-800/40">
                https://pokeapi.co/api/v2/pokemon/{currentPokemon.name.toLowerCase()}
              </code>
              ).
            </p>
          </div>

          {/* Search bar & quick triggers */}
          <div className="max-w-2xl mx-auto space-y-3">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                fetchPokemon(searchTerm);
              }}
              className="relative flex items-center"
            >
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari Pokémon lain (contoh: ditto, pikachu, charizard, 132)..."
                className="w-full pl-11 pr-28 py-3 rounded-xl bg-slate-900/90 border border-slate-700/80 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition shadow-inner"
              />
              <div className="absolute right-2 flex items-center gap-1.5">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-medium text-xs shadow-md transition disabled:opacity-50 flex items-center gap-1"
                >
                  {isLoading ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <span>Cari</span>
                  )}
                </button>
              </div>
            </form>

            {/* Quick Select Pokémon Chips */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
              <span className="text-xs text-slate-400 mr-1 flex items-center gap-1">
                <Layers className="w-3 h-3 text-slate-500" /> Cepat:
              </span>
              {POPULAR_POKEMON.map((poke) => {
                const isSelected = currentPokemon.name.toLowerCase() === poke.name.toLowerCase();
                return (
                  <button
                    key={poke.name}
                    onClick={() => {
                      setSearchTerm(poke.name);
                      fetchPokemon(poke.name);
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition-all border ${
                      isSelected
                        ? "bg-purple-600 text-white border-purple-400 shadow-md shadow-purple-600/30 scale-105"
                        : "bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    {poke.name === "ditto" ? "✨ Ditto (Default)" : poke.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Status Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-slate-400">Sumber Data:</span>
              <span className="text-emerald-400 font-semibold">{apiMeta.source}</span>
            </div>
            <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px]">
              <span>Latency: <strong className="text-slate-200">{apiMeta.responseTimeMs} ms</strong></span>
              <span>Status: <strong className="text-emerald-400">200 OK</strong></span>
            </div>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-4 rounded-xl bg-rose-950/50 border border-rose-800/60 text-rose-200 text-sm flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{errorMessage}</span>
              </div>
              <button
                onClick={() => fetchPokemon("ditto")}
                className="px-3 py-1 rounded-lg bg-rose-900 hover:bg-rose-800 text-xs font-medium transition"
              >
                Kembali ke Ditto
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Main Content Area */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Hero Pokémon Card */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative rounded-3xl p-6 bg-gradient-to-b from-slate-900/90 to-slate-900/40 border border-slate-800/80 shadow-2xl overflow-hidden backdrop-blur-md">
              <div
                className="absolute -top-24 -left-24 w-72 h-72 rounded-full blur-3xl pointer-events-none opacity-20"
                style={{ backgroundColor: typeConfig.glow }}
              />

              <div className="flex items-start justify-between relative z-10">
                <div>
                  <span className="font-mono text-xs font-semibold text-purple-400 tracking-wider">
                    #{String(currentPokemon.id).padStart(4, "0")}
                  </span>
                  <h3 className="text-3xl font-extrabold capitalize tracking-tight text-white flex items-center gap-2">
                    {currentPokemon.name}
                    {currentPokemon.name === "ditto" && (
                      <span className="text-sm font-normal text-purple-300">メタモン</span>
                    )}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-2">
                    {currentPokemon.types.map((t) => {
                      const tColor = POKEMON_TYPE_COLORS[t.type.name] || POKEMON_TYPE_COLORS.normal;
                      return (
                        <span
                          key={t.type.name}
                          className={`px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border ${tColor.bg} ${tColor.text} ${tColor.border}`}
                        >
                          {t.type.name}
                        </span>
                      );
                    })}
                  </div>
                </div>

                <div className="flex flex-col gap-2 items-end">
                  <button
                    onClick={() => setIsShiny(!isShiny)}
                    className={`px-2.5 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition ${
                      isShiny
                        ? "bg-amber-500/20 border-amber-500/40 text-amber-300 shadow-md shadow-amber-500/20"
                        : "bg-slate-800/80 border-slate-700/80 text-slate-300 hover:bg-slate-700"
                    }`}
                    title="Toggle Shiny Artwork"
                  >
                    <Sparkles className={`w-3.5 h-3.5 ${isShiny ? "text-amber-400 animate-spin" : ""}`} />
                    <span>{isShiny ? "Shiny ✨" : "Normal"}</span>
                  </button>

                  <button
                    onClick={playCry}
                    disabled={isPlayingCry}
                    className="p-2 rounded-xl bg-slate-800/80 hover:bg-purple-900/40 border border-slate-700/80 text-purple-300 hover:text-purple-200 transition"
                    title="Putar Suara Pokémon (Cry)"
                  >
                    <Volume2 className={`w-4 h-4 ${isPlayingCry ? "animate-bounce text-purple-400" : ""}`} />
                  </button>
                </div>
              </div>

              {/* Artwork Display */}
              <div className="relative my-6 flex items-center justify-center min-h-[260px]">
                <div className="w-52 h-52 rounded-full bg-slate-800/50 border border-slate-700/40 flex items-center justify-center absolute">
                  <div className="w-40 h-40 rounded-full bg-slate-900/60 border border-slate-800/60" />
                </div>

                {artwork ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={artwork}
                    alt={currentPokemon.name}
                    className="relative z-10 w-56 h-56 object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)] hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="relative z-10 text-slate-500 text-sm">Tidak ada artwork</div>
                )}
              </div>

              {/* Physical Parameters */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 relative z-10 text-center">
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block">Tinggi</span>
                  <span className="text-sm font-bold text-slate-100">
                    {(currentPokemon.height / 10).toFixed(1)} m
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block">Berat</span>
                  <span className="text-sm font-bold text-slate-100">
                    {(currentPokemon.weight / 10).toFixed(1)} kg
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block">Base EXP</span>
                  <span className="text-sm font-bold text-slate-100">
                    {currentPokemon.base_experience || 101}
                  </span>
                </div>
              </div>
            </div>

            {/* Abilities Box */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Dna className="w-4 h-4 text-purple-400" />
                Kemampuan (Abilities)
              </h4>
              <div className="space-y-2">
                {currentPokemon.abilities.map((item) => (
                  <div
                    key={item.ability.name}
                    className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between"
                  >
                    <div>
                      <span className="font-semibold capitalize text-slate-100 text-sm block">
                        {item.ability.name.replace("-", " ")}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {item.ability.name === "limber"
                          ? "Mencegah Pokémon ini terkena efek Paralisis (Paralysis)."
                          : item.ability.name === "imposter"
                          ? "Langsung bertransformasi menjadi lawan saat memasuki pertempuran."
                          : "Kemampuan unik dari PokéAPI."}
                      </span>
                    </div>
                    {item.is_hidden ? (
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30 font-semibold">
                        Hidden
                      </span>
                    ) : (
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 border border-slate-700 font-medium">
                        Standard
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Detailed Panels */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Tab Navigation */}
            <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800/80 shadow-lg">
              <button
                onClick={() => setActiveTab("stats")}
                className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-medium transition flex items-center justify-center gap-2 ${
                  activeTab === "stats"
                    ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                }`}
              >
                <Gauge className="w-4 h-4" />
                <span>Statistik Dasar</span>
              </button>
              <button
                onClick={() => setActiveTab("sprites")}
                className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-medium transition flex items-center justify-center gap-2 ${
                  activeTab === "sprites"
                    ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>Galeri Sprite</span>
              </button>
              <button
                onClick={() => setActiveTab("moves")}
                className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-medium transition flex items-center justify-center gap-2 ${
                  activeTab === "moves"
                    ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                }`}
              >
                <Swords className="w-4 h-4" />
                <span>Jurus ({currentPokemon.moves.length})</span>
              </button>
              <button
                onClick={() => setActiveTab("json")}
                className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-medium transition flex items-center justify-center gap-2 ${
                  activeTab === "json"
                    ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                }`}
              >
                <Terminal className="w-4 h-4" />
                <span>Raw JSON</span>
              </button>
            </div>

            {/* TAB CONTENT: STATS */}
            {activeTab === "stats" && (
              <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 space-y-6 shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Heart className="w-5 h-5 text-rose-500" />
                      Statistik Dasar (Base Stats)
                    </h3>
                    <p className="text-xs text-slate-400">
                      Nilai parameter tempur dasar Pokémon dari PokéAPI
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono text-slate-400 block">Total Stats</span>
                    <span className="text-xl font-extrabold text-purple-400">{totalStats}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {currentPokemon.stats.map((statItem) => {
                    const rawName = statItem.stat.name;
                    const percent = getStatPercent(statItem.base_stat);

                    let statLabel = rawName.toUpperCase();
                    let statIcon = <Zap className="w-4 h-4 text-amber-400" />;
                    let barColor = "bg-purple-500";

                    if (rawName === "hp") {
                      statLabel = "HP (Health Points)";
                      statIcon = <Heart className="w-4 h-4 text-rose-400" />;
                      barColor = "bg-rose-500";
                    } else if (rawName === "attack") {
                      statLabel = "Attack (Serangan)";
                      statIcon = <Swords className="w-4 h-4 text-amber-400" />;
                      barColor = "bg-amber-500";
                    } else if (rawName === "defense") {
                      statLabel = "Defense (Pertahanan)";
                      statIcon = <Shield className="w-4 h-4 text-blue-400" />;
                      barColor = "bg-blue-500";
                    } else if (rawName === "special-attack") {
                      statLabel = "Sp. Attack (Serangan Khusus)";
                      statIcon = <Zap className="w-4 h-4 text-purple-400" />;
                      barColor = "bg-purple-500";
                    } else if (rawName === "special-defense") {
                      statLabel = "Sp. Defense (Pertahanan Khusus)";
                      statIcon = <Shield className="w-4 h-4 text-indigo-400" />;
                      barColor = "bg-indigo-500";
                    } else if (rawName === "speed") {
                      statLabel = "Speed (Kecepatan)";
                      statIcon = <Gauge className="w-4 h-4 text-emerald-400" />;
                      barColor = "bg-emerald-500";
                    }

                    return (
                      <div key={rawName} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium text-slate-300 flex items-center gap-1.5">
                            {statIcon}
                            {statLabel}
                          </span>
                          <span className="font-mono font-bold text-slate-100">
                            {statItem.base_stat}{" "}
                            <span className="text-slate-500 font-normal">/ 255</span>
                          </span>
                        </div>
                        <div className="w-full h-2.5 rounded-full bg-slate-950 border border-slate-800 overflow-hidden">
                          <div
                            className={`h-full ${barColor} rounded-full transition-all duration-700 shadow-sm`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {currentPokemon.name === "ditto" && (
                  <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-800/40 flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                    <div className="text-xs space-y-1 text-purple-200">
                      <strong className="text-purple-100 font-semibold block">
                        Keunikan Statistik Ditto:
                      </strong>
                      <p className="text-purple-300/90 leading-relaxed">
                        Semua 6 statistik dasar Ditto memiliki nilai persis sama, yaitu <strong>48</strong> (Total 288). Saat menggunakan jurus <em>Transform</em>, Ditto meniru statistik dasar lawan (Attack, Defense, Sp. Atk, Sp. Def, Speed) tetapi mempertahankan nilai HP aslinya!
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT: SPRITES */}
            {activeTab === "sprites" && (
              <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 space-y-6 shadow-xl">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    Koleksi Sprite & Tampilan Visual
                  </h3>
                  <p className="text-xs text-slate-400">
                    Sprite resmi generasi klasik dan modern yang disediakan oleh PokéAPI
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-center space-y-2 flex flex-col items-center">
                    <span className="text-[11px] font-mono text-slate-400">Front Default</span>
                    <div className="w-24 h-24 flex items-center justify-center bg-slate-900/60 rounded-xl border border-slate-800">
                      {currentPokemon.sprites.front_default ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={currentPokemon.sprites.front_default}
                          alt="Front Default"
                          className="w-20 h-20 object-contain image-rendering-pixelated"
                        />
                      ) : (
                        <span className="text-xs text-slate-500">-</span>
                      )}
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-center space-y-2 flex flex-col items-center">
                    <span className="text-[11px] font-mono text-amber-300 flex items-center gap-1 justify-center">
                      <Sparkles className="w-3 h-3" /> Front Shiny
                    </span>
                    <div className="w-24 h-24 flex items-center justify-center bg-slate-900/60 rounded-xl border border-slate-800">
                      {currentPokemon.sprites.front_shiny ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={currentPokemon.sprites.front_shiny}
                          alt="Front Shiny"
                          className="w-20 h-20 object-contain image-rendering-pixelated"
                        />
                      ) : (
                        <span className="text-xs text-slate-500">-</span>
                      )}
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-center space-y-2 flex flex-col items-center">
                    <span className="text-[11px] font-mono text-slate-400">Back Default</span>
                    <div className="w-24 h-24 flex items-center justify-center bg-slate-900/60 rounded-xl border border-slate-800">
                      {currentPokemon.sprites.back_default ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={currentPokemon.sprites.back_default}
                          alt="Back Default"
                          className="w-20 h-20 object-contain image-rendering-pixelated"
                        />
                      ) : (
                        <span className="text-xs text-slate-500">-</span>
                      )}
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-center space-y-2 flex flex-col items-center">
                    <span className="text-[11px] font-mono text-amber-300 flex items-center gap-1 justify-center">
                      <Sparkles className="w-3 h-3" /> Back Shiny
                    </span>
                    <div className="w-24 h-24 flex items-center justify-center bg-slate-900/60 rounded-xl border border-slate-800">
                      {currentPokemon.sprites.back_shiny ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={currentPokemon.sprites.back_shiny}
                          alt="Back Shiny"
                          className="w-20 h-20 object-contain image-rendering-pixelated"
                        />
                      ) : (
                        <span className="text-xs text-slate-500">-</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: MOVES */}
            {activeTab === "moves" && (
              <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 space-y-4 shadow-xl">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Swords className="w-5 h-5 text-purple-400" />
                    Daftar Jurus / Serangan (Moves)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Jurus yang dapat dipelajari oleh {currentPokemon.name}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[360px] overflow-y-auto pr-1">
                  {currentPokemon.moves.length > 0 ? (
                    currentPokemon.moves.map((moveItem) => (
                      <div
                        key={moveItem.move.name}
                        className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <ChevronRight className="w-4 h-4 text-purple-400" />
                          <span className="text-xs font-semibold text-slate-200 capitalize">
                            {moveItem.move.name.replace("-", " ")}
                          </span>
                        </div>
                        <a
                          href={moveItem.move.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[10px] text-purple-400 hover:text-purple-300 font-mono"
                        >
                          Info API
                        </a>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2 text-center py-8 text-xs text-slate-500">
                      Tidak ada daftar jurus tersedia.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB CONTENT: RAW JSON */}
            {activeTab === "json" && (
              <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Terminal className="w-5 h-5 text-emerald-400" />
                      Respon JSON Mentah (Raw PokéAPI Response)
                    </h3>
                    <p className="text-xs text-slate-400">
                      Data payload JSON resmi dari URL PokéAPI
                    </p>
                  </div>
                  <button
                    onClick={() => handleCopy(JSON.stringify(currentPokemon, null, 2), "json")}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700/80 text-xs flex items-center gap-1.5 transition text-slate-200"
                  >
                    {copiedType === "json" ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 font-medium">JSON Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-400" />
                        <span>Salin JSON</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="relative rounded-2xl bg-slate-950 border border-slate-800 p-4 font-mono text-[11px] text-emerald-300/90 overflow-x-auto max-h-[460px] scrollbar-thin">
                  <pre>{JSON.stringify(currentPokemon, null, 2)}</pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer Info */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 py-6 px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-500">
        <div className="max-w-4xl mx-auto space-y-2">
          <p>
            Integrasi <strong>PokéAPI REST v2</strong> &bull; Halaman Beranda Publik Tanpa Login.
          </p>
          <p className="text-[11px] text-slate-400">
            Endpoint API langsung:{" "}
            <a
              href="https://pokeapi.co/api/v2/pokemon/ditto"
              target="_blank"
              rel="noreferrer"
              className="text-purple-400 underline hover:text-purple-300"
            >
              https://pokeapi.co/api/v2/pokemon/ditto
            </a>
          </p>
        </div>
      </footer>
    </main>
  );
}
