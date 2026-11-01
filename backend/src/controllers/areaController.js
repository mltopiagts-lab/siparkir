const areaModel = require('../models/areaModel');

/* =========================================================
 *  Helper: standard response biar konsisten
 * ========================================================= */
const success = (res, code, message, data = null) =>
  res.status(code).json({ success: true, message, data });

const fail = (res, code, message, error = null) =>
  res.status(code).json({ success: false, message, error });

/* =========================================================
 *  GET /api/area — semua data area
 * ========================================================= */
const getAllArea = async (req, res) => {
  try {
    const list = await areaModel.findAllArea();
    success(res, 200, 'Berhasil mengambil semua area', list);
  } catch (error) {
    console.error('[getAllArea]', error);
    fail(res, 500, 'Server Error', error.message);
  }
};

/* =========================================================
 *  GET /api/area/:id — satu data area by id
 * ========================================================= */
const getAreaById = async (req, res) => {
  try {
    const item = await areaModel.findAreaById(req.params.id);
    if (!item) return fail(res, 404, 'Area tidak ditemukan');
    success(res, 200, 'Berhasil mengambil area', item);
  } catch (error) {
    console.error('[getAreaById]', error);
    fail(res, 500, 'Server Error', error.message);
  }
};

/* =========================================================
 *  POST /api/area — tambah data area baru
 * ========================================================= */
const createArea = async (req, res) => {
  try {
    const { nama, kapasitas } = req.body;

    if (!nama || nama.trim() === '') {
      return fail(res, 400, 'Validasi gagal', 'nama wajib diisi');
    }
    if (kapasitas !== undefined && (!Number.isInteger(Number(kapasitas)) || Number(kapasitas) < 1)) {
      return fail(res, 400, 'Validasi gagal', 'kapasitas harus bilangan bulat >= 1');
    }

    const created = await areaModel.createArea({
      nama: nama.trim(),
      kapasitas: kapasitas === undefined ? 1 : Number(kapasitas),
    });
    success(res, 201, 'Area berhasil dibuat', created);
  } catch (error) {
    console.error('[createArea]', error);
    fail(res, 500, 'Server Error', error.message);
  }
};

/* =========================================================
 *  PUT /api/area/:id — update data area
 * ========================================================= */
const updateArea = async (req, res) => {
  try {
    const { nama, kapasitas } = req.body;
    if (kapasitas !== undefined && (!Number.isInteger(Number(kapasitas)) || Number(kapasitas) < 1)) {
      return fail(res, 400, 'Validasi gagal', 'kapasitas harus bilangan bulat >= 1');
    }

    const updated = await areaModel.updateArea(req.params.id, {
      ...(nama !== undefined && { nama: nama.trim() }),
      ...(kapasitas !== undefined && { kapasitas: Number(kapasitas) }),
    });
    if (!updated) return fail(res, 404, 'Area tidak ditemukan');
    success(res, 200, 'Area berhasil diupdate', updated);
  } catch (error) {
    console.error('[updateArea]', error);
    fail(res, 500, 'Server Error', error.message);
  }
};

/* =========================================================
 *  DELETE /api/area/:id — hapus data area
 * ========================================================= */
const deleteArea = async (req, res) => {
  try {
    const deleted = await areaModel.deleteArea(req.params.id);
    if (!deleted) return fail(res, 404, 'Area tidak ditemukan');
    success(res, 200, 'Area berhasil dihapus');
  } catch (error) {
    console.error('[deleteArea]', error);
    fail(res, 500, 'Server Error', error.message);
  }
};

module.exports = {
  getAllArea,
  getAreaById,
  createArea,
  updateArea,
  deleteArea,
};
