const { dbRun, dbGet, dbAll } = require('../middlewares_helpers/mysql_helpers');

/* =============== READ (all) =============== */
const findAllTarif = async () => {
  return await dbAll('SELECT * FROM tarif ORDER BY id ASC');
};

/* =============== READ (by id) =============== */
const findTarifById = async (id) => {
  return await dbGet('SELECT * FROM tarif WHERE id = ?', [id]);
};

/* =============== CREATE =============== */
const createTarif = async (body) => {
  const query = `
    INSERT INTO tarif (jenis, biaya)
    VALUES (?, ?)
  `;
  const values = [body.jenis, body.biaya];

  const { lastID } = await dbRun(query, values);
  return await findTarifById(lastID);
};

/* =============== UPDATE =============== */
const updateTarif = async (id, body) => {
  const existing = await findTarifById(id);
  if (!existing) return null;

  const query = `
    UPDATE tarif
    SET jenis = ?, biaya = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;
  const values = [
    body.jenis ?? existing.jenis,
    body.biaya ?? existing.biaya,
    id,
  ];

  await dbRun(query, values);
  return await findTarifById(id);
};

/* =============== DELETE =============== */
const deleteTarif = async (id) => {
  const { changes } = await dbRun('DELETE FROM tarif WHERE id = ?', [id]);
  return changes > 0;
};

module.exports = {
  findAllTarif,
  findTarifById,
  createTarif,
  updateTarif,
  deleteTarif,
};
