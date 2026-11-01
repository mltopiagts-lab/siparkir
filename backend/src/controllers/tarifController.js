const tarifModel = require('../models/tarifModel');

/* =========================================================
 *  Helper: standard response biar konsisten
 * ========================================================= */
const success = (res, code, message, data = null) =>
  res.status(code).json({ success: true, message, data });

const fail = (res, code, message, error = null) =>
  res.status(code).json({ success: false, message, error });

/* =========================================================
 *  GET /api/tarif — semua data tarif
 * ========================================================= */
const getAllTarif = async (req, res) => {
  try {
    const list = await tarifModel.findAllTarif();
    success(res, 200, 'Berhasil mengambil semua tarif', list);
  } catch (error) {
    console.error('[getAllTarif]', error);
    fail(res, 500, 'Server Error', error.message);
  }
};

/* =========================================================
 *  GET /api/tarif/:id — satu data tarif by id
 * ========================================================= */
const getTarifById = async (req, res) => {
  try {
    const item = await tarifModel.findTarifById(req.params.id);
    if (!item) return fail(res, 404, 'Tarif tidak ditemukan');
    success(res, 200, 'Berhasil mengambil tarif', item);
  } catch (error) {
    console.error('[getTarifById]', error);
    fail(res, 500, 'Server Error', error.message);
  }
};

/* =========================================================
 *  POST /api/tarif — tambah data tarif baru
 * ========================================================= */
const createTarif = async (req, res) => {
  try {
    const { jenis, biaya } = req.body;

    if (!jenis || jenis.trim() === '') {
      return fail(res, 400, 'Validasi gagal', 'jenis wajib diisi');
    }
    if (biaya === undefined || biaya === null || isNaN(biaya) || Number(biaya) < 0) {
      return fail(res, 400, 'Validasi gagal', 'biaya harus berupa angka >= 0');
    }

    const created = await tarifModel.createTarif({
      jenis: jenis.trim(),
      biaya: Number(biaya),
    });
    success(res, 201, 'Tarif berhasil dibuat', created);
  } catch (error) {
    console.error('[createTarif]', error);
    fail(res, 500, 'Server Error', error.message);
  }
};

/* =========================================================
 *  PUT /api/tarif/:id — update data tarif
 * ========================================================= */
const updateTarif = async (req, res) => {
  try {
    const { id } = req.params;
    const { jenis, biaya } = req.body;

    if (biaya !== undefined && (isNaN(biaya) || Number(biaya) < 0)) {
      return fail(res, 400, 'Validasi gagal', 'biaya harus berupa angka >= 0');
    }

    const updated = await tarifModel.updateTarif(id, {
      ...(jenis !== undefined && { jenis: jenis.trim() }),
      ...(biaya !== undefined && { biaya: Number(biaya) }),
    });

    if (!updated) return fail(res, 404, 'Tarif tidak ditemukan');
    success(res, 200, 'Tarif berhasil diupdate', updated);
  } catch (error) {
    console.error('[updateTarif]', error);
    fail(res, 500, 'Server Error', error.message);
  }
};

/* =========================================================
 *  DELETE /api/tarif/:id — hapus data tarif
 * ========================================================= */
const deleteTarif = async (req, res) => {
  try {
    const deleted = await tarifModel.deleteTarif(req.params.id);
    if (!deleted) return fail(res, 404, 'Tarif tidak ditemukan');
    success(res, 200, 'Tarif berhasil dihapus');
  } catch (error) {
    console.error('[deleteTarif]', error);
    fail(res, 500, 'Server Error', error.message);
  }
};

module.exports = {
  getAllTarif,
  getTarifById,
  createTarif,
  updateTarif,
  deleteTarif,
};
