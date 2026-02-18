# Cara Menjalankan Aplikasi FreshFruit

## 1. Jalankan Backend (Go API)

Buka terminal/PowerShell di folder proyek:

```bash
go run .
```

atau jalankan file yang sudah di-build:

```bash
.\kelompok_3.exe
```

Backend akan berjalan di **http://localhost:8080**

### Database
- **Default: SQLite** – Data disimpan di file `fruits.db` di folder proyek. Tidak perlu install apa pun.
- **Opsional MySQL:** Jika ingin pakai MySQL, set env variable sebelum menjalankan:
  ```bash
  # Windows PowerShell
  $env:DB_DSN = "root:password@tcp(127.0.0.1:3306)/kelompok3"
  go run .

  # Atau buat database kelompok3 dulu di MySQL, lalu:
  $env:DB_DSN = "root:@tcp(127.0.0.1:3306)/kelompok3"
  go run .
  ```

---

## 2. Jalankan Frontend (React)

Buka terminal **baru**, lalu:

```bash
cd view
npm install
npm run dev
```

Frontend akan berjalan di **http://localhost:5173**

---

## 3. Cara Mengakses

| Layanan | URL |
|---------|-----|
| **Web Aplikasi (utama)** | http://localhost:5173 |
| **Halaman Home** | http://localhost:5173/ |
| **Halaman Analyze** | http://localhost:5173/add |
| **Halaman About** | http://localhost:5173/about |
| **API Daftar Buah** | http://localhost:8080/api/fruits |
| **API Analyze** | http://localhost:8080/api/analyze (POST) |
| **API Health Check** | http://localhost:8080/api/health |

---

## Urutan Langkah

1. Jalankan **backend** dulu (`go run .` di folder root)
2. Jalankan **frontend** (`npm run dev` di folder `view`)
3. Buka browser ke **http://localhost:5173**
