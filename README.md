# SiParkir

Aplikasi manajemen parkir untuk mencatat kendaraan masuk dan keluar serta mengelola data parkir.

## Fitur

- Pencatatan transaksi kendaraan masuk dan keluar.
- Pengelolaan tarif dan area parkir.
- Laporan keuangan berdasarkan rentang tanggal.
- Frontend web responsif berbasis React.js dan backend REST API berbasis Node.js, Express, dan MySQL.

## Anggota Kelompok

1. Keane Hebert — 231121320
2. Steven Wijaya — 231120674
3. Reinaldo Ebert Winata — 231120270

## Panduan Menjalankan Aplikasi

### 1. Prasyarat Sistem
- Node.js (v18+)
- MySQL Server

### 2. Konfigurasi Database
1. Buat database `siparkir` dan impor skema awal:
   ```bash
   mysql -u root -p < backend/src/sql_scripts/init_mysql.sql
   ```
2. Salin file environment backend dan sesuaikan kredensial MySQL:
   ```bash
   cp backend/.env.example backend/.env
   ```
   Isi file `backend/.env`:
   ```env
   PORT=3000
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=password_kamu
   DB_NAME=siparkir
   ```

### 3. Menjalankan Backend (REST API)
```bash
cd backend
npm install
npm start
```
Server berjalan di `http://localhost:3000`.

### 4. Menjalankan Frontend (React TypeScript)
Buka terminal baru:
```bash
cd frontend
npm install
npm run dev
```
Buka browser di alamat yang tampil pada terminal (umumnya `http://localhost:5173`).
