export interface PokemonStat {
  base_stat: number;
  effort: number;
  stat: {
    name: string;
    url: string;
  };
}

export interface PokemonAbility {
  ability: {
    name: string;
    url: string;
  };
  is_hidden: boolean;
  slot: number;
}

export interface PokemonType {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

export interface PokemonSprites {
  front_default: string | null;
  front_shiny: string | null;
  back_default?: string | null;
  back_shiny?: string | null;
  other?: {
    "official-artwork"?: {
      front_default?: string | null;
      front_shiny?: string | null;
    };
    home?: {
      front_default?: string | null;
      front_shiny?: string | null;
    };
    showdown?: {
      front_default?: string | null;
      front_shiny?: string | null;
    };
  };
}

export interface PokemonMove {
  move: {
    name: string;
    url: string;
  };
}

export interface PokemonSpeciesInfo {
  flavor_text?: string;
  genus?: string;
  generation?: string;
  egg_groups?: string[];
  capture_rate?: number;
  base_happiness?: number;
}

export interface PokemonData {
  id: number;
  name: string;
  base_experience: number;
  height: number;
  weight: number;
  order: number;
  is_default: boolean;
  abilities: PokemonAbility[];
  stats: PokemonStat[];
  types: PokemonType[];
  sprites: PokemonSprites;
  species_info?: PokemonSpeciesInfo;
  cries?: {
    latest?: string;
    legacy?: string;
  };
  moves: PokemonMove[];
}

export const POPULAR_POKEMON: { name: string; id: number; color: string }[] = [
  { name: "ditto", id: 132, color: "from-purple-500 to-pink-500" },
  { name: "pikachu", id: 25, color: "from-amber-400 to-yellow-500" },
  { name: "charizard", id: 6, color: "from-orange-500 to-red-600" },
  { name: "bulbasaur", id: 1, color: "from-emerald-500 to-teal-600" },
  { name: "squirtle", id: 7, color: "from-blue-400 to-cyan-500" },
  { name: "gengar", id: 94, color: "from-purple-700 to-indigo-900" },
  { name: "eevee", id: 133, color: "from-amber-600 to-yellow-700" },
  { name: "mewtwo", id: 150, color: "from-fuchsia-600 to-purple-800" },
  { name: "snorlax", id: 143, color: "from-slate-600 to-teal-800" },
  { name: "lucario", id: 448, color: "from-sky-500 to-blue-700" },
];

export const POKEMON_TYPE_COLORS: Record<string, { bg: string; text: string; border: string; glow: string }> = {
  normal: { bg: "bg-stone-500/20", text: "text-stone-300", border: "border-stone-500/40", glow: "rgba(168, 168, 120, 0.4)" },
  fire: { bg: "bg-red-500/20", text: "text-red-300", border: "border-red-500/40", glow: "rgba(240, 128, 48, 0.4)" },
  water: { bg: "bg-blue-500/20", text: "text-blue-300", border: "border-blue-500/40", glow: "rgba(104, 144, 240, 0.4)" },
  electric: { bg: "bg-amber-400/20", text: "text-amber-300", border: "border-amber-400/40", glow: "rgba(248, 208, 48, 0.4)" },
  grass: { bg: "bg-emerald-500/20", text: "text-emerald-300", border: "border-emerald-500/40", glow: "rgba(120, 200, 80, 0.4)" },
  ice: { bg: "bg-cyan-400/20", text: "text-cyan-300", border: "border-cyan-400/40", glow: "rgba(152, 216, 216, 0.4)" },
  fighting: { bg: "bg-orange-700/20", text: "text-orange-300", border: "border-orange-600/40", glow: "rgba(192, 48, 40, 0.4)" },
  poison: { bg: "bg-purple-600/20", text: "text-purple-300", border: "border-purple-500/40", glow: "rgba(160, 64, 160, 0.4)" },
  ground: { bg: "bg-amber-600/20", text: "text-amber-200", border: "border-amber-600/40", glow: "rgba(224, 192, 104, 0.4)" },
  flying: { bg: "bg-indigo-400/20", text: "text-indigo-300", border: "border-indigo-400/40", glow: "rgba(168, 144, 240, 0.4)" },
  psychic: { bg: "bg-pink-500/20", text: "text-pink-300", border: "border-pink-500/40", glow: "rgba(248, 88, 136, 0.4)" },
  bug: { bg: "bg-lime-500/20", text: "text-lime-300", border: "border-lime-500/40", glow: "rgba(168, 184, 32, 0.4)" },
  rock: { bg: "bg-stone-600/20", text: "text-stone-200", border: "border-stone-600/40", glow: "rgba(184, 160, 56, 0.4)" },
  ghost: { bg: "bg-purple-900/30", text: "text-purple-300", border: "border-purple-600/40", glow: "rgba(112, 88, 152, 0.4)" },
  dragon: { bg: "bg-violet-700/20", text: "text-violet-300", border: "border-violet-600/40", glow: "rgba(112, 56, 248, 0.4)" },
  dark: { bg: "bg-zinc-800/40", text: "text-zinc-300", border: "border-zinc-700/50", glow: "rgba(112, 88, 72, 0.4)" },
  steel: { bg: "bg-slate-400/20", text: "text-slate-300", border: "border-slate-400/40", glow: "rgba(184, 184, 208, 0.4)" },
  fairy: { bg: "bg-pink-400/20", text: "text-pink-200", border: "border-pink-400/40", glow: "rgba(238, 153, 172, 0.4)" },
};

export const DITTO_OFFLINE_DATA: PokemonData = {
  id: 132,
  name: "ditto",
  base_experience: 101,
  height: 3,
  weight: 40,
  order: 214,
  is_default: true,
  species_info: {
    flavor_text:
      "Dapat menyalin kode genetik lawan dan secara instan mengubah dirinya menjadi duplikat lawan yang sempurna.",
    genus: "Transform Pokémon",
    generation: "Generasi I (Kanto)",
    egg_groups: ["Ditto (Universal)"],
    capture_rate: 35,
    base_happiness: 70,
  },
  abilities: [
    {
      ability: {
        name: "limber",
        url: "https://pokeapi.co/api/v2/ability/7/",
      },
      is_hidden: false,
      slot: 1,
    },
    {
      ability: {
        name: "imposter",
        url: "https://pokeapi.co/api/v2/ability/148/",
      },
      is_hidden: true,
      slot: 3,
    },
  ],
  stats: [
    { base_stat: 48, effort: 1, stat: { name: "hp", url: "https://pokeapi.co/api/v2/stat/1/" } },
    { base_stat: 48, effort: 0, stat: { name: "attack", url: "https://pokeapi.co/api/v2/stat/2/" } },
    { base_stat: 48, effort: 0, stat: { name: "defense", url: "https://pokeapi.co/api/v2/stat/3/" } },
    { base_stat: 48, effort: 0, stat: { name: "special-attack", url: "https://pokeapi.co/api/v2/stat/4/" } },
    { base_stat: 48, effort: 0, stat: { name: "special-defense", url: "https://pokeapi.co/api/v2/stat/5/" } },
    { base_stat: 48, effort: 0, stat: { name: "speed", url: "https://pokeapi.co/api/v2/stat/6/" } },
  ],
  types: [
    {
      slot: 1,
      type: {
        name: "normal",
        url: "https://pokeapi.co/api/v2/type/1/",
      },
    },
  ],
  sprites: {
    front_default: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/132.png",
    front_shiny: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/132.png",
    back_default: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/132.png",
    back_shiny: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/shiny/132.png",
    other: {
      "official-artwork": {
        front_default: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/132.png",
        front_shiny: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/132.png",
      },
      home: {
        front_default: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/132.png",
        front_shiny: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/shiny/132.png",
      },
      showdown: {
        front_default: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/132.gif",
        front_shiny: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/shiny/132.gif",
      },
    },
  },
  cries: {
    latest: "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/132.ogg",
    legacy: "https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/legacy/132.ogg",
  },
  moves: [
    {
      move: {
        name: "transform",
        url: "https://pokeapi.co/api/v2/move/144/",
      },
    },
  ],
};
