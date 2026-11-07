const mysql = require('mysql2/promise');

const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'siparkir',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  decimalNumbers: true,
  dateStrings: true,
});

const initializeDatabase = async () => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS tarif (
      id INT AUTO_INCREMENT PRIMARY KEY,
      jenis VARCHAR(50) NOT NULL UNIQUE,
      biaya DECIMAL(10,2) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);
  await db.query(`
    CREATE TABLE IF NOT EXISTS area (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nama VARCHAR(100) NOT NULL UNIQUE,
      kapasitas INT NOT NULL DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);
  await db.query(`
    CREATE TABLE IF NOT EXISTS products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      price DECIMAL(10,2) NOT NULL,
      stock INT DEFAULT 0,
      category VARCHAR(100),
      description TEXT,
      is_available TINYINT(1) DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);
  await db.query(`
    CREATE TABLE IF NOT EXISTS test_logs (
      id INT AUTO_INCREMENT PRIMARY KEY,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);
  await db.query(`
    CREATE TABLE IF NOT EXISTS transaksi (
      id INT AUTO_INCREMENT PRIMARY KEY,
      plat VARCHAR(20) NOT NULL,
      id_tarif INT NOT NULL,
      id_area INT NOT NULL,
      tanggal DATE NOT NULL,
      waktu TIME NOT NULL,
      tarif DECIMAL(10,2) NOT NULL,
      status ENUM('Parkir','Selesai') NOT NULL DEFAULT 'Parkir',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_transaksi_tanggal (tanggal),
      INDEX idx_transaksi_status (status),
      CONSTRAINT fk_transaksi_tarif FOREIGN KEY (id_tarif) REFERENCES tarif(id) ON UPDATE CASCADE ON DELETE RESTRICT,
      CONSTRAINT fk_transaksi_area FOREIGN KEY (id_area) REFERENCES area(id) ON UPDATE CASCADE ON DELETE RESTRICT
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  // Migrasi otomatis jika tabel transaksi lama masih memakai kolom jenis & area
  const [cols] = await db.query('SHOW COLUMNS FROM transaksi');
  const colNames = cols.map((c) => c.Field);
  if (colNames.includes('jenis') && !colNames.includes('id_tarif')) {
    await db.query('ALTER TABLE transaksi ADD COLUMN id_tarif INT NULL AFTER plat, ADD COLUMN id_area INT NULL AFTER id_tarif');
    await db.query(`
      UPDATE transaksi t
      LEFT JOIN tarif tr ON t.jenis = tr.jenis
      LEFT JOIN area a ON t.area = a.nama
      SET t.id_tarif = COALESCE(tr.id, (SELECT id FROM tarif ORDER BY id ASC LIMIT 1)),
          t.id_area = COALESCE(a.id, (SELECT id FROM area ORDER BY id ASC LIMIT 1))
    `);
    await db.query('ALTER TABLE transaksi MODIFY COLUMN id_tarif INT NOT NULL, MODIFY COLUMN id_area INT NOT NULL');
    await db.query('ALTER TABLE transaksi DROP COLUMN jenis, DROP COLUMN area');
    await db.query('ALTER TABLE transaksi ADD CONSTRAINT fk_transaksi_tarif FOREIGN KEY (id_tarif) REFERENCES tarif(id) ON UPDATE CASCADE ON DELETE RESTRICT');
    await db.query('ALTER TABLE transaksi ADD CONSTRAINT fk_transaksi_area FOREIGN KEY (id_area) REFERENCES area(id) ON UPDATE CASCADE ON DELETE RESTRICT');
  }

  console.log('✅ Tabel MySQL SiParkir siap');
};

module.exports = { db, initializeDatabase };
