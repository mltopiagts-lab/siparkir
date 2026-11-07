const transaksiModel = require('../models/transaksiModel');
const tarifModel = require('../models/tarifModel');
const areaModel = require('../models/areaModel');

/* =========================================================
 *  Helper: standard response biar konsisten
 * ========================================================= */
const success = (res, code, message, data = null) =>
  res.status(code).json({ success: true, message, data });

const fail = (res, code, message, error = null) =>
  res.status(code).json({ success: false, message, error });

/* =========================================================
 *  GET /api/transaksi — semua transaksi (filterable)
 * ========================================================= */
const getAllTransaksi = async (req, res) => {
  try {
    const list = await transaksiModel.findAllTransaksi(req.query);
    success(res, 200, 'Berhasil mengambil semua transaksi', list);
  } catch (error) {
    console.error('[getAllTransaksi]', error);
    fail(res, 500, 'Server Error', error.message);
  }
};

/* =========================================================
 *  GET /api/transaksi/laporan — rekap laporan keuangan
 * ========================================================= */
const getLaporan = async (req, res) => {
  try {
    const { mulai, selesai } = req.query;
    const [stats, rows] = await Promise.all([
      transaksiModel.getLaporanStats({ mulai, selesai }),
      transaksiModel.findAllTransaksi({ mulai, selesai }),
    ]);

    success(res, 200, 'Berhasil mengambil laporan keuangan', {
      total_transaksi: Number(stats?.total_transaksi || 0),
      total_pendapatan: Number(stats?.total_pendapatan || 0),
      transaksi: rows,
    });
  } catch (error) {
    console.error('[getLaporan]', error);
    fail(res, 500, 'Server Error', error.message);
  }
};

/* =========================================================
 *  GET /api/transaksi/:id — detail satu transaksi
 * ========================================================= */
const getTransaksiById = async (req, res) => {
  try {
    const item = await transaksiModel.findTransaksiById(req.params.id);
    if (!item) return fail(res, 404, 'Transaksi tidak ditemukan');
    success(res, 200, 'Berhasil mengambil transaksi', item);
  } catch (error) {
    console.error('[getTransaksiById]', error);
    fail(res, 500, 'Server Error', error.message);
  }
};

/* =========================================================
 *  POST /api/transaksi — catat tiket masuk
 * ========================================================= */
const createTransaksi = async (req, res) => {
  try {
    const { plat, id_tarif, id_area, tanggal, waktu } = req.body;

    if (!plat || plat.trim() === '') {
      return fail(res, 400, 'Validasi gagal', 'plat wajib diisi');
    }
    if (!id_tarif || !id_area) {
      return fail(res, 400, 'Validasi gagal', 'id_tarif dan id_area wajib diisi');
    }

    const [tarifRef, areaRef] = await Promise.all([
      tarifModel.findTarifById(Number(id_tarif)),
      areaModel.findAreaById(Number(id_area)),
    ]);

    if (!tarifRef) {
      return fail(res, 404, 'Validasi gagal', 'id_tarif tidak ditemukan pada master tarif');
    }
    if (!areaRef) {
      return fail(res, 404, 'Validasi gagal', 'id_area tidak ditemukan pada master area');
    }

    const cleanPlat = plat.trim().toUpperCase();
    const active = await transaksiModel.findActiveByPlat(cleanPlat);
    if (active) {
      return fail(res, 409, 'Validasi gagal', 'Kendaraan dengan plat ini masih berstatus Parkir');
    }

    const now = new Date();
    const created = await transaksiModel.createTransaksi({
      plat: cleanPlat,
      id_tarif: tarifRef.id,
      id_area: areaRef.id,
      tanggal: tanggal || now.toISOString().slice(0, 10),
      waktu: waktu || now.toTimeString().slice(0, 5),
      tarif: Number(tarifRef.biaya),
      status: 'Parkir',
    });

    success(res, 201, 'Transaksi parkir berhasil dibuat', created);
  } catch (error) {
    console.error('[createTransaksi]', error);
    fail(res, 500, 'Server Error', error.message);
  }
};

/* =========================================================
 *  PUT /api/transaksi/:id — update status kendaraan keluar
 * ========================================================= */
const updateTransaksi = async (req, res) => {
  try {
    const status = req.body.status || 'Selesai';
    const updated = await transaksiModel.updateStatusTransaksi(req.params.id, status);
    if (!updated) return fail(res, 404, 'Transaksi tidak ditemukan');
    success(res, 200, 'Status transaksi berhasil diupdate', updated);
  } catch (error) {
    console.error('[updateTransaksi]', error);
    fail(res, 500, 'Server Error', error.message);
  }
};

/* =========================================================
 *  DELETE /api/transaksi/:id — hapus transaksi
 * ========================================================= */
const deleteTransaksi = async (req, res) => {
  try {
    const deleted = await transaksiModel.deleteTransaksi(req.params.id);
    if (!deleted) return fail(res, 404, 'Transaksi tidak ditemukan');
    success(res, 200, 'Transaksi berhasil dihapus');
  } catch (error) {
    console.error('[deleteTransaksi]', error);
    fail(res, 500, 'Server Error', error.message);
  }
};

module.exports = {
  getAllTransaksi,
  getLaporan,
  getTransaksiById,
  createTransaksi,
  updateTransaksi,
  deleteTransaksi,
};
