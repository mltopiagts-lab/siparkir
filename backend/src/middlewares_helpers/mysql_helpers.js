const { db } = require('../config/mysql');

const dbRun = async (query, params = []) => {
  const [result] = await db.execute(query, params);
  return {
    lastID: result.insertId,
    changes: result.affectedRows,
  };
};

const dbGet = async (query, params = []) => {
  const [rows] = await db.execute(query, params);
  return rows[0] || null;
};

const dbAll = async (query, params = []) => {
  const [rows] = await db.execute(query, params);
  return rows;
};

module.exports = {
  dbRun,
  dbGet,
  dbAll,
};
