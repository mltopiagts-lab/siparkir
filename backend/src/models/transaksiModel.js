const { dbRun, dbGet, dbAll } = require('../middlewares_helpers/mysql_helpers');

const BASE_SELECT = `
  SELECT
    t.id,
    t.plat,
    t.id_tarif,
    tr.jenis,
    t.id_area,
    a.nama AS area,
    t.tanggal,
    t.waktu,
    t.tarif,
    t.status,
    t.created_at,
    t.updated_at
  FROM transaksi t
  INNER JOIN tarif tr ON t.id_tarif = tr.id
  INNER JOIN area a ON t.id_area = a.id
`;

/* =============== READ (all / filtered) =============== */
const findAllTransaksi = async ({ status, q, mulai, selesai } = {}) => {
  let query = `${BASE_SELECT} WHERE 1=1`;
  const params = [];

  if (status && status !== 'ALL') {
    query += ' AND t.status = ?';
    params.push(status);
  }
  if (q && q.trim()) {
    query += ' AND (t.plat LIKE ? OR a.nama LIKE ? OR tr.jenis LIKE ?)';
    const term = `%${q.trim()}%`;
    params.push(term, term, term);
  }
  if (mulai) {
    query += ' AND t.tanggal >= ?';
    params.push(mulai);
  }
  if (selesai) {
    query += ' AND t.tanggal <= ?';
    params.push(selesai);
  }

  query += ' ORDER BY t.id DESC';
  return await dbAll(query, params);
};

/* =============== READ (by id) =============== */
const findTransaksiById = async (id) => {
  return await dbGet(`${BASE_SELECT} WHERE t.id = ?`, [id]);
};

/* =============== CHECK ACTIVE PLAT =============== */
const findActiveByPlat = async (plat) => {
  return await dbGet(
    'SELECT * FROM transaksi WHERE plat = ? AND status = "Parkir"',
    [plat]
  );
};

/* =============== CREATE =============== */
const createTransaksi = async (body) => {
  const query = `
    INSERT INTO transaksi (plat, id_tarif, id_area, tanggal, waktu, tarif, status)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [
    body.plat,
    body.id_tarif,
    body.id_area,
    body.tanggal,
    body.waktu,
    body.tarif,
    body.status || 'Parkir',
  ];

  const { lastID } = await dbRun(query, values);
  return await findTransaksiById(lastID);
};

/* =============== UPDATE STATUS (Keluar) =============== */
const updateStatusTransaksi = async (id, status = 'Selesai') => {
  const existing = await findTransaksiById(id);
  if (!existing) return null;

  await dbRun(
    'UPDATE transaksi SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [status, id]
  );
  return await findTransaksiById(id);
};

/* =============== DELETE =============== */
const deleteTransaksi = async (id) => {
  const { changes } = await dbRun('DELETE FROM transaksi WHERE id = ?', [id]);
  return changes > 0;
};

/* =============== LAPORAN STATS =============== */
const getLaporanStats = async ({ mulai, selesai } = {}) => {
  let query = `
    SELECT
      COUNT(*) AS total_transaksi,
      COALESCE(SUM(tarif), 0) AS total_pendapatan
    FROM transaksi
    WHERE 1=1
  `;
  const params = [];

  if (mulai) {
    query += ' AND tanggal >= ?';
    params.push(mulai);
  }
  if (selesai) {
    query += ' AND tanggal <= ?';
    params.push(selesai);
  }

  return await dbGet(query, params);
};

module.exports = {
  findAllTransaksi,
  findTransaksiById,
  findActiveByPlat,
  createTransaksi,
  updateStatusTransaksi,
  deleteTransaksi,
  getLaporanStats,
};
