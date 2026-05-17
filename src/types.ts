/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface PerangkatDesa {
  id: string;
  nipd: string;
  nama: string;
  divisi: string;
  jabatan: string;
  tglMasuk: string;
  status: 'Aktif' | 'Non-Aktif';
  email: string;
  hp: string;
  desa: string;
  kecamatan: string;
  kabupaten: string;
  provinsi: string;
  photo?: string | null;
}

export interface UserAccount {
  username: string;
  name: string;
  email: string;
  role: 'Superadmin' | 'Admin Desa';
  wilayah: string;
  password?: string;
}

export const INITIAL_ACCOUNTS: UserAccount[] = [
  { username: 'admin', name: 'Admin Kabupaten', email: 'superadmin@mamujutengah.go.id', role: 'Superadmin', wilayah: 'Semua', password: 'password' },
  { username: 'sekdes_topoyo', name: 'Sekdes Topoyo', email: 'sekdes.topoyo@desa.go.id', role: 'Admin Desa', wilayah: 'Topoyo', password: 'password' },
  { username: 'sekdes_tobadak', name: 'Sekdes Tobadak', email: 'sekdes.tobadak@desa.go.id', role: 'Admin Desa', wilayah: 'Tobadak', password: 'password' }
];

export const INITIAL_PERANGKAT: PerangkatDesa[] = [
  { 
    id: '1', 
    nipd: '198705872018052006', 
    nama: 'Ardiansyah Yusuf', 
    divisi: 'Pemerintahan', 
    jabatan: 'Sekretaris Desa', 
    tglMasuk: '2018-05-20', 
    status: 'Aktif', 
    email: 'ardiansyah@topoyo.desa.go.id', 
    hp: '081234567890', 
    desa: 'Topoyo', 
    kecamatan: 'Topoyo', 
    kabupaten: 'Mamuju Tengah', 
    provinsi: 'Sulawesi Barat' 
  },
  { 
    id: '2', 
    nipd: '199008452015020002', 
    nama: 'Andi Wijaya', 
    divisi: 'Keuangan', 
    jabatan: 'Kepala Urusan (Kaur)', 
    tglMasuk: '2015-02-01', 
    status: 'Aktif', 
    email: 'andi.w@tobadak.desa.go.id', 
    hp: '085311223344', 
    desa: 'Tobadak', 
    kecamatan: 'Tobadak', 
    kabupaten: 'Mamuju Tengah', 
    provinsi: 'Sulawesi Barat' 
  },
  { 
    id: '3', 
    nipd: '199201012020010003', 
    nama: 'Siti Aminah', 
    divisi: 'Kesejahteraan', 
    jabatan: 'Kepala Seksie (Kasi)', 
    tglMasuk: '2020-01-15', 
    status: 'Non-Aktif', 
    email: 'siti@topoyo.desa.go.id', 
    hp: '081999888777', 
    desa: 'Topoyo', 
    kecamatan: 'Topoyo', 
    kabupaten: 'Mamuju Tengah', 
    provinsi: 'Sulawesi Barat' 
  }
];

export const MASTER_DIVISI = ['Pemerintahan', 'Keuangan', 'Pembangunan', 'Kesejahteraan', 'Umum'];
export const MASTER_JABATAN = ['Sekretaris Desa', 'Kepala Urusan (Kaur)', 'Kepala Seksie (Kasi)'];
