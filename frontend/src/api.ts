import type { ApiResponse, Area, CreateTransaksiPayload, LaporanStats, Tarif, Transaksi } from './types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  });
  const body = (await response.json()) as ApiResponse<T>;
  if (!response.ok || !body.success) {
    throw new Error(body.error || body.message || 'Permintaan API gagal');
  }
  return body.data;
}

export const api = {
  transaksi: {
    list: (query = '') => request<Transaksi[]>(`/transaksi${query ? `?${query}` : ''}`),
    create: (data: CreateTransaksiPayload) =>
      request<Transaksi>('/transaksi', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: number, data: Partial<Transaksi>) =>
      request<Transaksi>(`/transaksi/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    remove: (id: number) => request<void>(`/transaksi/${id}`, { method: 'DELETE' }),
    laporan: (mulai: string, selesai: string) => {
      const params = new URLSearchParams();
      if (mulai) params.set('mulai', mulai);
      if (selesai) params.set('selesai', selesai);
      return request<LaporanStats>(`/transaksi/laporan?${params.toString()}`);
    },
  },
  tarif: {
    list: () => request<Tarif[]>('/tarif'),
    create: (data: Omit<Tarif, 'id'>) => request<Tarif>('/tarif', { method: 'POST', body: JSON.stringify(data) }),
    remove: (id: number) => request<void>(`/tarif/${id}`, { method: 'DELETE' }),
  },
  area: {
    list: () => request<Area[]>('/area'),
    create: (data: Omit<Area, 'id'>) => request<Area>('/area', { method: 'POST', body: JSON.stringify(data) }),
    remove: (id: number) => request<void>(`/area/${id}`, { method: 'DELETE' }),
  },
};
