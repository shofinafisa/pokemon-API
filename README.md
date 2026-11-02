# INAPROC Dashboard - Pengadaan Barang dan Jasa Pemerintah (LKPP)

Dashboard analitik data pengadaan barang dan jasa pemerintah berbasis Next.js 14 (App Router), TypeScript, dan Tailwind CSS dengan **Dynamic Feature Toggle Engine** untuk 12 Metode Pengadaan INAPROC / LKPP.

---

## 🚀 Fitur Utama

### 1. Unified Authentication & Role-Based Routing
- **Satu Pintu Masuk (Unified Login):** Sistem mengenali peran pengguna (*Admin LKPP* atau *User / PPK Satker*).
- **Auto-Redirection & Auth Guards:** Halaman dilindungi oleh `AuthGuard`. Admin diarahkan ke `/admin`, sedangkan Standard User diarahkan ke `/dashboard`.
- **Quick Demo Credentials:** Tombol sekali klik di halaman login untuk mengisi kredensial Admin atau User secara instan.
- **Quick Role Switcher:** Tombol pengubah role instan di navigasi atas untuk mempermudah demonstrasi dan pengujian antarmuka.

### 2. Halaman Utama Pemilihan Metode Pengadaan (`/dashboard`)
Halaman gerbang utama bagi **User (PPK Satker)** sebelum masuk ke dashboard analitik:
- **Judul Terpusat:** *“Dashboard Monitoring Pengadaan Nasional”*
- **Pertanyaan Pengarah:** *“Mau Tahu tentang Apa?”*
- **12 Kartu Metode Modern:** Menampilkan 12 metode pengadaan LKPP dengan ikon, kategori, estimasi paket real-time, dan status aktif.
- **Pencarian & Filter Kategori:** Mempermudah penelusuran metode berdasarkan kata kunci dan kategori (Pemilihan Langsung, Tender & Kompetisi, E-Katalog, Khusus & Swakelola).
- **Navigasi Sekali Klik:** Mengarahkan ke masing-masing dashboard spesifik metode pengadaan.
- **Banner Ringkasan Nasional:** Banner di bagian bawah untuk akses langsung ke Dashboard Komprehensif (`/dashboard/all`) yang menyajikan akumulasi seluruh 12 metode.

### 3. 12 Halaman Dashboard Khusus Metode Pengadaan (`/dashboard/[method]`)
Setiap metode pengadaan memiliki halaman dashboard tersendiri dengan tata letak dan visual yang konsisten:
1. `/dashboard/penunjukan-langsung` — Penunjukan Langsung
2. `/dashboard/pengadaan-langsung` — Pengadaan Langsung
3. `/dashboard/e-purchasing` — E-Purchasing
4. `/dashboard/swakelola` — Swakelola
5. `/dashboard/sayembara` — Sayembara
6. `/dashboard/kontes` — Kontes
7. `/dashboard/tender` — Tender
8. `/dashboard/tender-cepat` — Tender Cepat
9. `/dashboard/tender-internasional` — Tender Internasional
10. `/dashboard/pengadaan-darurat` — Pengadaan Darurat
11. `/dashboard/seleksi` — Seleksi
12. `/dashboard/dikecualikan` — Dikecualikan
- **Tombol Kembali:** *“Kembali ke Pilihan Metode”* untuk berpindah ke halaman utama `/dashboard`.
- **Filter Bertingkat & Dual Range Slider:** Sinkronisasi rentang tahun, jenis instansi, instansi, eselon, dan satker.
- **Metrik KPI & Grafik Dinamis:** Data disaring khusus untuk metode yang sedang aktif.
- **Tabel Paket & Ekspor:** Pencarian, pagination, ekspor Excel, CSV, PDF, dan Generate Infografis AI.

### 4. Feature Toggle Engine: 12 Metode Pengadaan LKPP / INAPROC
Admin dapat mengaktifkan atau menonaktifkan 12 metode pengadaan secara instan via tombol On/Off (Switch) di `/admin`:
1. **Penunjukan Langsung**
2. **Pengadaan Langsung**
3. **E-Purchasing**
4. **Swakelola**
5. **Sayembara**
6. **Kontes**
7. **Tender**
8. **Tender Cepat**
9. **Tender Internasional**
10. **Pengadaan Darurat**
11. **Seleksi**
12. **Dikecualikan**

---

## 🔑 Kredensial Demo

| Peran (Role) | Alamat Email | Kata Sandi | Akses Halaman |
| :--- | :--- | :--- | :--- |
| **Administrator LKPP** | `admin@dashboard.com` | `admin123` | `/admin` (Kontrol 12 Metode + Data Lengkap) |
| **PPK Satker (User)** | `user@dashboard.com` | `user123` | `/dashboard` (Pemilihan Metode & 12 Dashboard Spesifik) |

---

## 🛠️ Menjalankan Aplikasi

```bash
npm run dev
```

Buka `http://localhost:3000` (atau port yang aktif) di browser Anda.
