# PokéAPI Explorer - Pokémon Hub (Ditto Showcase)

Aplikasi eksplorasi data Pokémon interaktif berbasis **Next.js 14**, **Tailwind CSS**, dan **PokéAPI REST API v2**. Halaman beranda tunggal (Single Page Application) langsung terhubung dengan PokéAPI tanpa memerlukan halaman login.

## 🚀 Fitur Utama

- **Koneksi Langsung ke PokéAPI v2**:
  - Endpoint resmi: `https://pokeapi.co/api/v2/pokemon/ditto`
  - Fallback cerdas ke GitHub Data Mirror & embedded cache jika koneksi/firewall lokal membatasi domain `pokeapi.co`.
- **Beranda Tunggal Publik**: Akses instan langsung ke data Pokémon tanpa hambatan login.
- **Visualisasi Karakter**:
  - Official Artwork resolusi tinggi dari Pokémon HOME.
  - Mode Normal vs Shiny ✨ toggle.
  - Galeri sprite klasik (Front & Back).
  - Pemutar suara tangisan (*cry*) Pokémon langsung dari PokéAPI.
- **Pemeriksaan Statistik Tempur (Base Stats)**:
  - 6 parameter tempur dasar: HP, Attack, Defense, Special Attack, Special Defense, Speed, dan Total Base Stats.
- **Detail Kemampuan (Abilities)**:
  - Limber (kebal paralisis) dan Imposter (Hidden Ability).
- **Raw JSON Viewer**:
  - Tab data payload JSON asli dari PokéAPI dengan tombol salin cepat.
- **Pencarian Pokémon**:
  - Tombol cepat untuk Pokémon populer (Pikachu, Charizard, Gengar, Mewtwo, dll.) serta input pencarian bebas.

## 🛠️ Cara Menjalankan

1. Jalankan development server:
   ```bash
   npm run dev
   ```
   atau klik dua kali berkas `run.bat`.

2. Buka di peramban:
   [http://localhost:3000](http://localhost:3000)
