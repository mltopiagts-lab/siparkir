require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initializeDatabase } = require('./src/config/mysql');
const testRoutes = require('./src/routes/test');
const productRoutes = require('./src/routes/productRoutes');
const tarifRoutes = require('./src/routes/tarifRoutes');
const areaRoutes = require('./src/routes/areaRoutes');
const transaksiRoutes = require('./src/routes/transaksiRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

/* Middleware */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* Root route */
app.get('/', (req, res) => {
  res.json({
    message: '🚀 SiParkir API is running (MySQL)',
    endpoints: {
      'GET    /api/tarif':              'Ambil semua tarif parkir',
      'POST   /api/tarif':              'Tambah tarif parkir',
      'PUT    /api/tarif/:id':          'Update tarif parkir',
      'DELETE /api/tarif/:id':          'Hapus tarif parkir',
      'GET    /api/area':               'Ambil semua area parkir',
      'POST   /api/area':               'Tambah area parkir',
      'PUT    /api/area/:id':           'Update area parkir',
      'DELETE /api/area/:id':           'Hapus area parkir',
      'GET    /api/transaksi':          'Ambil semua transaksi parkir',
      'GET    /api/transaksi/laporan':  'Laporan keuangan (filter ?mulai=&selesai=)',
      'POST   /api/transaksi':          'Catat tiket kendaraan masuk',
      'PUT    /api/transaksi/:id':      'Update status keluar kendaraan',
      'DELETE /api/transaksi/:id':      'Hapus transaksi parkir',
    },
  });
});

/* Routes */
app.use('/api/test', testRoutes);
app.use('/api/products', productRoutes);
app.use('/api/tarif', tarifRoutes);
app.use('/api/area', areaRoutes);
app.use('/api/transaksi', transaksiRoutes);

/* 404 */
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Endpoint tidak ditemukan' });
});

/* Start */
if (require.main === module) {
  (async () => {
    try {
      await initializeDatabase();
    } catch (err) {
      console.error('⚠️ Peringatan inisialisasi MySQL:', err.message);
    }
    app.listen(PORT, () => {
      console.log(`🚀 Server: http://localhost:${PORT}`);
    });
  })();
}

module.exports = app;
