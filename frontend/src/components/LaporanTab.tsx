import { useEffect, useMemo, useState } from 'react';
import { api } from '../api';
import type { LaporanStats } from '../types';
import { Pagination } from './Pagination';

const PAGE_SIZE = 5;

export function LaporanTab() {
  const [mulai, setMulai] = useState('');
  const [selesai, setSelesai] = useState('');
  const [data, setData] = useState<LaporanStats>({ total_transaksi: 0, total_pendapatan: 0, transaksi: [] });
  const [page, setPage] = useState(1);

  const load = async (m = mulai, s = selesai) => {
    try {
      setData(await api.transaksi.laporan(m, s));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { load().catch(console.error); }, []);

  const totalPages = Math.ceil(data.transaksi.length / PAGE_SIZE) || 1;
  const currentPage = Math.min(page, totalPages);
  const rows = useMemo(() => data.transaksi.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE), [data.transaksi, currentPage]);

  return (
    <section className="tab-section active">
      <div className="panel">
        <div className="panel-header"><h2 className="panel-title"><i className="fa-solid fa-file-invoice-dollar"></i> Laporan Keuangan Parkir</h2></div>
        <div className="toolbar">
          <div className="date-field"><label htmlFor="tglMulai">Tanggal Mulai</label><input type="date" id="tglMulai" value={mulai} onChange={e => setMulai(e.target.value)} /></div>
          <div className="date-field"><label htmlFor="tglSelesai">Tanggal Selesai</label><input type="date" id="tglSelesai" value={selesai} onChange={e => setSelesai(e.target.value)} /></div>
          <button className="btn btn-primary" style={{ width: 'auto', height: 38 }} onClick={() => { setPage(1); load(mulai, selesai); }}><i className="fa-solid fa-filter"></i> Terapkan Filter</button>
          <button className="btn btn-out" style={{ width: 'auto', height: 38 }} onClick={() => { setMulai(''); setSelesai(''); setPage(1); load('', ''); }}><i className="fa-solid fa-rotate-left"></i> Reset</button>
        </div>

        <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', marginBottom: 16 }}>
          <article className="stat-card stat-amber">
            <div className="stat-info"><div className="stat-label">Total Pemasukan (Sesuai Filter)</div><div className="stat-val">Rp {Number(data.total_pendapatan || 0).toLocaleString('id-ID')}</div></div>
            <div className="stat-icon"><i className="fa-solid fa-coins"></i></div>
          </article>
          <article className="stat-card stat-blue">
            <div className="stat-info"><div className="stat-label">Jumlah Transaksi</div><div className="stat-val">{data.total_transaksi}</div></div>
            <div className="stat-icon"><i className="fa-solid fa-receipt"></i></div>
          </article>
        </div>

        <div className="table-wrap">
          <table>
            <thead><tr><th>Tanggal</th><th>Plat</th><th>Jenis</th><th>Area</th><th>Status</th><th>Tarif Masuk</th></tr></thead>
            <tbody>
              {rows.length === 0 ? <tr><td colSpan={6} className="empty-state">Belum ada transaksi pada rentang ini</td></tr> : rows.map(t => (
                <tr key={t.id}>
                  <td data-label="Tanggal">{t.tanggal}</td>
                  <td data-label="Plat"><span className="plate-badge">{t.plat}</span></td>
                  <td data-label="Jenis">{t.jenis}</td>
                  <td data-label="Area">{t.area}</td>
                  <td data-label="Status"><span className={`badge ${t.status === 'Parkir' ? 'badge-parkir' : 'badge-selesai'}`}>{t.status}</span></td>
                  <td data-label="Tarif Masuk">Rp {Number(t.tarif).toLocaleString('id-ID')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination totalItems={data.transaksi.length} currentPage={currentPage} pageSize={PAGE_SIZE} onPageChange={setPage} />
      </div>
    </section>
  );
}
