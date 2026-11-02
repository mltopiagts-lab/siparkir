# SiParkir — Backend REST API (Node.js + Express + MySQL)

REST API manajemen parkir menggunakan **Node.js**, **Express.js**, dan **MySQL** (`mysql2`). Struktur kode mempertahankan pola arsitektur MVC, konsistensi helper database, dan gaya dokumentasi dari project referensi (`base_server`).

## Fitur

- **Tarif Parkir**: CRUD jenis kendaraan dan tarif flat.
- **Area Parkir**: CRUD nama blok/area beserta kapasitas slot.
- **Transaksi Parkir**: Catat kendaraan masuk, validasi plat aktif, status keluar kendaraan, dan riwayat.
- **Laporan Keuangan**: Rekap total transaksi & total pendapatan dengan filter rentang tanggal (`?mulai=YYYY-MM-DD&selesai=YYYY-MM-DD`).

## Teknologi

- [Node.js](https://nodejs.org/) — runtime JavaScript.
- [Express.js](https://expressjs.com/) — framework REST API.
- [mysql2](https://www.npmjs.com/package/mysql2) — driver MySQL Promise Pool.
- [dotenv](https://www.npmjs.com/package/dotenv) — membaca environment variables.
- [cors](https://www.npmjs.com/package/cors) — akses lintas domain frontend.

## Struktur Project

```text
siparkir/
├── server.js
├── .env.example
├── package.json
├── src/
│   ├── config/
│   │   └── mysql.js
│   ├── controllers/
│   │   ├── tarifController.js
│   │   ├── areaController.js
│   │   ├── transaksiController.js
│   │   └── productController.js
│   ├── models/
│   │   ├── tarifModel.js
│   │   ├── areaModel.js
│   │   ├── transaksiModel.js
│   │   └── productModel.js
│   ├── routes/
│   │   ├── tarifRoutes.js
│   │   ├── areaRoutes.js
│   │   ├── transaksiRoutes.js
│   │   ├── productRoutes.js
│   │   └── test.js
│   ├── middlewares_helpers/
│   │   └── mysql_helpers.js
│   └── sql_scripts/
│       └── init_mysql.sql
```

## Instalasi & Menjalankan Server

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Database MySQL

Buat database `siparkir` dan jalankan skrip SQL:

```bash
mysql -u root -p < src/sql_scripts/init_mysql.sql
```

### 3. Konfigurasi `.env`

Salin `.env.example` ke `.env`:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=rahasia
DB_NAME=siparkir
```

### 4. Jalankan Server

```bash
npm start
# atau development dengan auto-reload:
npm run dev
```

Server akan aktif di:

```text
http://localhost:3000
```

## API Endpoints

### 1. Tarif Parkir (`/api/tarif`)

| Method | Endpoint | Fungsi |
|---|---|---|
| GET | `/api/tarif` | Mengambil seluruh master tarif |
| GET | `/api/tarif/:id` | Mengambil satu tarif by ID |
| POST | `/api/tarif` | Menambah jenis tarif baru |
| PUT | `/api/tarif/:id` | Mengubah nominal tarif |
| DELETE | `/api/tarif/:id` | Menghapus tarif |

**Body POST / PUT:**
```json
{
  "jenis": "Sepeda Listrik",
  "biaya": 1500
}
```

### 2. Area Parkir (`/api/area`)

| Method | Endpoint | Fungsi |
|---|---|---|
| GET | `/api/area` | Mengambil seluruh area parkir |
| GET | `/api/area/:id` | Mengambil detail area by ID |
| POST | `/api/area` | Menambah area parkir |
| PUT | `/api/area/:id` | Mengubah kapasitas / nama area |
| DELETE | `/api/area/:id` | Menghapus area parkir |

**Body POST / PUT:**
```json
{
  "nama": "Blok D (VIP)",
  "kapasitas": 15
}
```

### 3. Transaksi Parkir (`/api/transaksi`)

| Method | Endpoint | Fungsi |
|---|---|---|
| GET | `/api/transaksi` | Mengambil transaksi (`?status=Parkir&q=B1234`) |
| GET | `/api/transaksi/laporan` | Rekap laporan keuangan (`?mulai=2026-05-01&selesai=2026-05-31`) |
| GET | `/api/transaksi/:id` | Mengambil satu transaksi by ID |
| POST | `/api/transaksi` | Catat kendaraan masuk (tiket baru) |
| PUT | `/api/transaksi/:id` | Update status kendaraan keluar |
| DELETE | `/api/transaksi/:id` | Hapus riwayat transaksi |

**Body POST (Tiket Masuk):**
```json
{
  "plat": "B 1234 XYZ",
  "jenis": "Mobil",
  "area": "Blok A (Depan)",
  "tarif": 5000
}
```

**Body PUT (Keluar):**
```json
{
  "status": "Selesai"
}
```

## Format Respons Standar

**Berhasil:**
```json
{
  "success": true,
  "message": "Transaksi parkir berhasil dibuat",
  "data": {
    "id": 1,
    "plat": "B 1234 XYZ",
    "status": "Parkir"
  }
}
```

**Gagal:**
```json
{
  "success": false,
  "message": "Validasi gagal",
  "error": "Kendaraan dengan plat ini masih berstatus Parkir"
}
```

## Anggota Kelompok

1. Keane Hebert — 231121320
2. Steven Wijaya — 231120674
3. Reinaldo Ebert Winata — 231120270
