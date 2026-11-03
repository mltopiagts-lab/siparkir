import { useEffect, useState } from 'react';
import { api } from './api';
import { AreaTab, TarifTab } from './components/MasterTabs';
import type { Area, Tarif } from './types';

type Tab = 'tarif' | 'area';

const tabs: { id: Tab; label: string; icon: string }[] = [
  { id: 'tarif', label: 'Tarif', icon: 'fa-solid fa-tags' },
  { id: 'area', label: 'Area', icon: 'fa-solid fa-map-location-dot' },
];

function App() {
  const [tab, setTab] = useState<Tab>('tarif');
  const [clock, setClock] = useState(new Date());
  const [tarifList, setTarifList] = useState<Tarif[]>([]);
  const [areaList, setAreaList] = useState<Area[]>([]);
  const [apiError, setApiError] = useState('');

  const loadMasterData = async () => {
    try {
      const [tarif, area] = await Promise.all([api.tarif.list(), api.area.list()]);
      setTarifList(tarif);
      setAreaList(area);
      setApiError('');
    } catch (err) {
      setApiError((err as Error).message || 'Tidak dapat terhubung ke API.');
    }
  };

  useEffect(() => {
    loadMasterData();
    const timer = window.setInterval(() => setClock(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="container">
      <header className="topbar">
        <div className="brand">
          <div className="brand-icon" aria-hidden="true"><i className="fa-solid fa-square-parking"></i></div>
          <div className="brand-text"><h1>SiParkir</h1><p>Sistem Manajemen Parkir Kendaraan</p></div>
        </div>
        <div className="clock-pill"><i className="fa-regular fa-clock" aria-hidden="true"></i><span>{clock.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span></div>
      </header>

      {/* Ringkasan Master Data */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
        <article className="stat-card stat-blue">
          <div className="stat-info">
            <div className="stat-label">Total Kategori Tarif</div>
            <div className="stat-val">{tarifList.length}</div>
          </div>
          <div className="stat-icon"><i className="fa-solid fa-tags"></i></div>
        </article>
        <article className="stat-card stat-green">
          <div className="stat-info">
            <div className="stat-label">Total Area Parkir</div>
            <div className="stat-val">{areaList.length}</div>
          </div>
          <div className="stat-icon"><i className="fa-solid fa-map-location-dot"></i></div>
        </article>
      </div>

      <nav className="nav-tabs" aria-label="Menu Aplikasi">
        {tabs.map((item) => (
          <button key={item.id} className={`nav-btn ${tab === item.id ? 'active' : ''}`} onClick={() => setTab(item.id)}>
            <i className={item.icon}></i><span>{item.label}</span>
          </button>
        ))}
      </nav>

      {apiError && <div className="api-error" role="alert"><i className="fa-solid fa-triangle-exclamation"></i> API belum tersambung: {apiError}</div>}

      {tab === 'tarif' && <TarifTab onChange={loadMasterData} />}
      {tab === 'area' && <AreaTab onChange={loadMasterData} />}
    </div>
  );
}

export default App;
