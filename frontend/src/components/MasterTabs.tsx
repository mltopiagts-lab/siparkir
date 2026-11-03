import { useEffect, useMemo, useState } from 'react';
import { api } from '../api';
import type { Area, Tarif } from '../types';
import { Pagination } from './Pagination';

const PAGE_SIZE = 5;

export function TarifTab({ onChange }: { onChange: () => void }) {
  const [list, setList] = useState<Tarif[]>([]);
  const [jenis, setJenis] = useState('');
  const [biaya, setBiaya] = useState('');
  const [page, setPage] = useState(1);
  const load = async () => setList(await api.tarif.list());
  useEffect(() => { load().catch(console.error); }, []);
  const rows = useMemo(() => list.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE), [list, page]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.tarif.create({ jenis: jenis.trim(), biaya: Number(biaya) });
    setJenis(''); setBiaya(''); await load(); onChange();
  };

  return <section className="tab-section active"><div className="main-layout">
    <aside className="panel"><div className="panel-header"><h2 className="panel-title"><i className="fa-solid fa-tags"></i> Tambah Tarif</h2></div>
      <form onSubmit={submit}>
        <div className="form-group"><label htmlFor="tarifJenis">Jenis Kendaraan</label><div className="input-icon-wrap"><i className="fa-solid fa-car-side"></i><input id="tarifJenis" value={jenis} onChange={e => setJenis(e.target.value)} placeholder="Cth: Sepeda Listrik" required /></div></div>
        <div className="form-group"><label htmlFor="tarifBiaya">Biaya Flat (Rp)</label><div className="input-icon-wrap"><i className="fa-solid fa-money-bill"></i><input id="tarifBiaya" type="number" min="0" value={biaya} onChange={e => setBiaya(e.target.value)} placeholder="2000" required /></div></div>
        <button className="btn btn-primary" type="submit"><i className="fa-solid fa-plus"></i> Simpan Tarif</button>
      </form>
    </aside>
    <div className="panel"><div className="panel-header"><h2 className="panel-title"><i className="fa-solid fa-table-list"></i> Daftar Tarif Kendaraan</h2></div>
      <div className="table-wrap"><table><thead><tr><th>No</th><th>Jenis Kendaraan</th><th>Tarif Flat</th><th>Aksi</th></tr></thead><tbody>
        {rows.length === 0 ? <tr><td colSpan={4} className="empty-state">Belum ada data tarif</td></tr> : rows.map((t, i) => <tr key={t.id}><td data-label="No">{(page - 1) * PAGE_SIZE + i + 1}</td><td data-label="Jenis Kendaraan">{t.jenis}</td><td data-label="Tarif Flat">Rp {Number(t.biaya).toLocaleString('id-ID')}</td><td data-label="Aksi"><button className="btn btn-sm btn-del" aria-label={`Hapus tarif ${t.jenis}`} onClick={() => api.tarif.remove(t.id).then(load).then(onChange)}><i className="fa-solid fa-trash"></i></button></td></tr>)}
      </tbody></table></div>
      <Pagination totalItems={list.length} currentPage={Math.min(page, Math.ceil(list.length / PAGE_SIZE) || 1)} pageSize={PAGE_SIZE} onPageChange={setPage} />
    </div>
  </div></section>;
}

export function AreaTab({ onChange }: { onChange: () => void }) {
  const [list, setList] = useState<Area[]>([]);
  const [nama, setNama] = useState('');
  const [kapasitas, setKapasitas] = useState('');
  const [page, setPage] = useState(1);
  const load = async () => setList(await api.area.list());
  useEffect(() => { load().catch(console.error); }, []);
  const rows = useMemo(() => list.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE), [list, page]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.area.create({ nama: nama.trim(), kapasitas: Number(kapasitas) });
    setNama(''); setKapasitas(''); await load(); onChange();
  };

  return <section className="tab-section active"><div className="main-layout">
    <aside className="panel"><div className="panel-header"><h2 className="panel-title"><i className="fa-solid fa-map-location-dot"></i> Tambah Area</h2></div>
      <form onSubmit={submit}>
        <div className="form-group"><label htmlFor="areaNama">Nama / Kode Area</label><div className="input-icon-wrap"><i className="fa-solid fa-font"></i><input id="areaNama" value={nama} onChange={e => setNama(e.target.value)} placeholder="Cth: Blok D (Timur)" required /></div></div>
        <div className="form-group"><label htmlFor="areaKapasitas">Kapasitas Slot</label><div className="input-icon-wrap"><i className="fa-solid fa-boxes-stacked"></i><input id="areaKapasitas" type="number" min="1" value={kapasitas} onChange={e => setKapasitas(e.target.value)} placeholder="25" required /></div></div>
        <button className="btn btn-primary" type="submit"><i className="fa-solid fa-plus"></i> Simpan Area</button>
      </form>
    </aside>
    <div className="panel"><div className="panel-header"><h2 className="panel-title"><i className="fa-solid fa-warehouse"></i> Daftar Area Parkir</h2></div>
      <div className="table-wrap"><table><thead><tr><th>No</th><th>Area Parkir</th><th>Kapasitas</th><th>Aksi</th></tr></thead><tbody>
        {rows.length === 0 ? <tr><td colSpan={4} className="empty-state">Belum ada data area</td></tr> : rows.map((a, i) => <tr key={a.id}><td data-label="No">{(page - 1) * PAGE_SIZE + i + 1}</td><td data-label="Area Parkir">{a.nama}</td><td data-label="Kapasitas">{a.kapasitas} slot</td><td data-label="Aksi"><button className="btn btn-sm btn-del" aria-label={`Hapus area ${a.nama}`} onClick={() => api.area.remove(a.id).then(load).then(onChange)}><i className="fa-solid fa-trash"></i></button></td></tr>)}
      </tbody></table></div>
      <Pagination totalItems={list.length} currentPage={Math.min(page, Math.ceil(list.length / PAGE_SIZE) || 1)} pageSize={PAGE_SIZE} onPageChange={setPage} />
    </div>
  </div></section>;
}
