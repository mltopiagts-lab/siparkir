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
  jenis: string;
  area: string;
  tanggal: string;
  waktu: string;
  tarif: number;
  status: 'Parkir' | 'Selesai';
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
