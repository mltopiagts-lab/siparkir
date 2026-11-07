export interface Tarif {
  id: number;
  jenis: string;
  biaya: number;
}

export interface Area {
  id: number;
  nama: string;
  kapasitas: number;
}

export interface Transaksi {
  id: number;
  plat: string;
  id_tarif: number;
  jenis: string;
  id_area: number;
  area: string;
  tanggal: string;
  waktu: string;
  tarif: number;
  status: 'Parkir' | 'Selesai';
}

export interface CreateTransaksiPayload {
  plat: string;
  id_tarif: number;
  id_area: number;
  tanggal?: string;
  waktu?: string;
}

export interface LaporanStats {
  total_transaksi: number;
  total_pendapatan: number;
  transaksi: Transaksi[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error?: string;
}
