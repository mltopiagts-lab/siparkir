const { dbRun, dbGet, dbAll } = require('../middlewares_helpers/mysql_helpers');

/* =============== READ (all) =============== */
const findAllArea = async () => {
  return await dbAll('SELECT * FROM area ORDER BY id ASC');
};

/* =============== READ (by id) =============== */
const findAreaById = async (id) => {
  return await dbGet('SELECT * FROM area WHERE id = ?', [id]);
};

/* =============== CREATE =============== */
const createArea = async (body) => {
  const query = `
    INSERT INTO area (nama, kapasitas)
    VALUES (?, ?)
  `;
  const values = [body.nama, body.kapasitas ?? 1];

  const { lastID } = await dbRun(query, values);
  return await findAreaById(lastID);
};

/* =============== UPDATE =============== */
const updateArea = async (id, body) => {
  const existing = await findAreaById(id);
  if (!existing) return null;

  const query = `
    UPDATE area
    SET nama = ?, kapasitas = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;
  const values = [
    body.nama ?? existing.nama,
    body.kapasitas ?? existing.kapasitas,
    id,
  ];

  await dbRun(query, values);
  return await findAreaById(id);
};

/* =============== DELETE =============== */
const deleteArea = async (id) => {
  const { changes } = await dbRun('DELETE FROM area WHERE id = ?', [id]);
  return changes > 0;
};

module.exports = {
  findAllArea,
  findAreaById,
  createArea,
  updateArea,
  deleteArea,
};
