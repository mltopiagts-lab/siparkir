import { useEffect, useMemo, useState } from 'react';
import { api } from '../api';
import type { Area, Tarif, Transaksi } from '../types';
import { Pagination } from './Pagination';

const PAGE_SIZE = 5;

export function TransaksiTab({ tarifList, areaList }: { tarifList: Tarif[]; areaList: Area[] }) {
  const [list, setList] = useState<Transaksi[]>([]);
  const [plat, setPlat] = useState('');
  const [jenis, setJenis] = useState('');
  const [area, setArea] = useState('');
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('ALL');
  const [page, setPage] = useState(1);

  const load = async () => {
    try {
      setList(await api.transaksi.list());
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (!jenis && tarifList[0]) setJenis(tarifList[0].jenis);
  }, [jenis, tarifList]);

  useEffect(() => {
    if (!area && areaList[0]) setArea(areaList[0].nama);
  }, [area, areaList]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return list.filter(
      (t) =>
        (t.plat.toLowerCase().includes(query) || t.area.toLowerCase().includes(query)) &&
        (status === 'ALL' || t.status === status),
    );
  }, [list, q, status]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE) || 1;
  const currentPage = Math.min(page, totalPages);
  const rows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const stats = useMemo(() => {
    const aktif = list.filter((t) => t.status === 'Parkir').length;
    const selesai = list.filter((t) => t.status === 'Selesai').length;
    const pendapatan = list.reduce((acc, t) => acc + Number(t.tarif || 0), 0);
    return { aktif, selesai, pendapatan, total: list.length };
  }, [list]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const selectedTarif = tarifList.find((t) => t.jenis === jenis);
    const now = new Date();
    try {
      await api.transaksi.create({
        plat: plat.trim().toUpperCase(),
        jenis,
        area,
        tanggal: now.toISOString().slice(0, 10),
        waktu: now.toTimeString().slice(0, 5),
        tarif: selectedTarif?.biaya ?? 0,
      });
      setPlat('');
      await load();
    } catch (err) {
      alert((err as Error).message);
    }
  };

  return (
    <section className="tab-section active">
      <div className="stats-grid" aria-label="Ringkasan parkir">
        <article className="stat-card stat-blue">
          <div className="stat-info"><div className="stat-label">Sedang Parkir</div><div className="stat-val">{stats.aktif}</div></div>
          <div className="stat-icon"><i className="fa-solid fa-car-side"></i></div>
        </article>
        <article className="stat-card stat-green">
          <div className="stat-info"><div className="stat-label">Sudah Keluar</div><div className="stat-val">{stats.selesai}</div></div>
          <div className="stat-icon"><i className="fa-solid fa-circle-check"></i></div>
        </article>
        <article className="stat-card stat-amber">
          <div className="stat-info"><div className="stat-label">Total Pendapatan</div><div className="stat-val">Rp {stats.pendapatan.toLocaleString('id-ID')}</div></div>
          <div className="stat-icon"><i className="fa-solid fa-wallet"></i></div>
        </article>
        <article className="stat-card stat-slate">
          <div className="stat-info"><div className="stat-label">Total Transaksi</div><div className="stat-val">{stats.total}</div></div>
          <div className="stat-icon"><i className="fa-solid fa-receipt"></i></div>
        </article>
      </div>

      <div className="main-layout">
        <aside className="panel">
          <div className="panel-header"><h2 className="panel-title"><i className="fa-solid fa-ticket"></i> Tiket Masuk</h2></div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="plat">Plat Nomor Kendaraan</label>
              <div className="input-icon-wrap">
                <i className="fa-solid fa-car"></i>
                <input id="plat" className="input-plate" value={plat} onChange={(e) => setPlat(e.target.value)} placeholder="B 1234 XYZ" required />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="jenis">Jenis Kendaraan</label>
              <div className="input-icon-wrap">
                <i className="fa-solid fa-truck-pickup"></i>
                <select id="jenis" value={jenis} onChange={(e) => setJenis(e.target.value)}>
                  {tarifList.map((t) => (
                    <option key={t.id} value={t.jenis}>{t.jenis} — Rp {Number(t.biaya).toLocaleString('id-ID')}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="area">Area Parkir</label>
              <div className="input-icon-wrap">
                <i className="fa-solid fa-location-dot"></i>
                <select id="area" value={area} onChange={(e) => setArea(e.target.value)}>
                  {areaList.map((a) => (
                    <option key={a.id} value={a.nama}>{a.nama}</option>
                  ))}
                </select>
              </div>
            </div>
            <button className="btn btn-primary" type="submit"><i className="fa-solid fa-plus"></i> Catat Kendaraan Masuk</button>
          </form>
        </aside>

        <div className="panel">
          <div className="panel-header"><h2 className="panel-title"><i className="fa-solid fa-list-ul"></i> Data Transaksi Parkir</h2></div>
          <div className="toolbar">
            <input className="search-box" type="search" value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} placeholder="Cari plat atau area..." />
            <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
              <option value="ALL">Semua Status</option>
              <option value="Parkir">Sedang Parkir</option>
              <option value="Selesai">Sudah Keluar</option>
            </select>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Plat</th><th>Jenis</th><th>Area</th><th>Waktu</th><th>Tarif</th><th>Status</th><th>Aksi</th></tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr><td colSpan={7} className="empty-state">Belum ada data transaksi</td></tr>
                ) : (
                  rows.map((t) => (
                    <tr key={t.id}>
                      <td data-label="Plat"><span className="plate-badge">{t.plat}</span></td>
                      <td data-label="Jenis">{t.jenis}</td>
                      <td data-label="Area">{t.area}</td>
                      <td data-label="Waktu">{t.tanggal} {t.waktu}</td>
                      <td data-label="Tarif">Rp {Number(t.tarif).toLocaleString('id-ID')}</td>
                      <td data-label="Status">
                        <span className={`badge ${t.status === 'Parkir' ? 'badge-parkir' : 'badge-selesai'}`}>{t.status}</span>
                      </td>
                      <td data-label="Aksi">
                        <div className="actions">
                          {t.status === 'Parkir' && (
                            <button className="btn btn-sm btn-out" onClick={() => api.transaksi.update(t.id, { status: 'Selesai' }).then(load)}>
                              <i className="fa-solid fa-right-from-bracket"></i> Keluar
                            </button>
                          )}
                          <button className="btn btn-sm btn-del" onClick={() => api.transaksi.remove(t.id).then(load)}>
                            <i className="fa-solid fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <Pagination totalItems={filtered.length} currentPage={currentPage} pageSize={PAGE_SIZE} onPageChange={setPage} />
        </div>
      </div>
    </section>
  );
}
