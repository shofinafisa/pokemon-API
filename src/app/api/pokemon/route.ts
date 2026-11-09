import { NextRequest, NextResponse } from "next/server";
import { DITTO_OFFLINE_DATA, POPULAR_POKEMON } from "@/lib/pokemon-data";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const rawQuery = searchParams.get("name") || searchParams.get("query") || "ditto";
  const query = rawQuery.trim().toLowerCase();

  const startTime = Date.now();
  const pokeApiUrl = `https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(query)}`;

  // 1. Try Live PokéAPI Endpoint
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(pokeApiUrl, {
      signal: controller.signal,
      headers: {
        Accept: "application/json",
      },
    });
    clearTimeout(timeoutId);

    const contentType = res.headers.get("content-type") || "";
    if (res.ok && contentType.includes("application/json")) {
      const data = await res.json();
      return NextResponse.json({
        success: true,
        source: "PokéAPI Live (https://pokeapi.co)",
        url: pokeApiUrl,
        responseTimeMs: Date.now() - startTime,
        data,
      });
    }
  } catch {
    // Fall through to mirror
  }

  // 2. Fallback to GitHub PokeAPI Data Mirror (Bypasses FortiGuard / Game filter blocks)
  try {
    let pokemonId: number | null = null;
    if (/^\d+$/.test(query)) {
      pokemonId = parseInt(query, 10);
    } else {
      const found = POPULAR_POKEMON.find((p) => p.name.toLowerCase() === query);
      if (found) {
        pokemonId = found.id;
      } else if (query === "ditto") {
        pokemonId = 132;
      }
    }

    if (pokemonId) {
      const mirrorUrl = `https://raw.githubusercontent.com/PokeAPI/api-data/master/data/api/v2/pokemon/${pokemonId}/index.json`;
      const mirrorRes = await fetch(mirrorUrl);
      if (mirrorRes.ok) {
        const data = await mirrorRes.json();
        return NextResponse.json({
          success: true,
          source: "PokéAPI Mirror (GitHub Data)",
          url: pokeApiUrl,
          mirrorUrl,
          responseTimeMs: Date.now() - startTime,
          data,
        });
      }
    }
  } catch {
    // Fall through to embedded static data
  }

  // 3. Fallback to embedded Ditto dataset
  if (query === "ditto" || query === "132") {
    return NextResponse.json({
      success: true,
      source: "PokéAPI Cached Data (Ditto Verified)",
      url: pokeApiUrl,
      responseTimeMs: Date.now() - startTime,
      data: DITTO_OFFLINE_DATA,
    });
  }

  return NextResponse.json(
    {
      success: false,
      error: `Pokémon "${rawQuery}" tidak ditemukan atau koneksi terblokir oleh firewall lokal.`,
      url: pokeApiUrl,
    },
    { status: 404 }
  );
}

