/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  UserPen, 
  UserPlus, 
  Image as ImageIcon, 
  Save, 
  MapPin, 
  Smartphone, 
  Mail, 
  Calendar,
  Building2
} from 'lucide-react';
import { type PerangkatDesa, MASTER_DIVISI, MASTER_JABATAN } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: PerangkatDesa) => void;
  editingData: PerangkatDesa | null;
  isAdminDesa: boolean;
  wilayahTugas: string;
}

export default function PerangkatModal({ isOpen, onClose, onSave, editingData, isAdminDesa, wilayahTugas }: Props) {
  const [formData, setFormData] = useState<Partial<PerangkatDesa>>({
    status: 'Aktif',
    kabupaten: 'Mamuju Tengah',
    provinsi: 'Sulawesi Barat'
  });
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  useEffect(() => {
    if (editingData) {
      setFormData(editingData);
      setPhotoPreview(editingData.photo || null);
    } else {
      setFormData({
        status: 'Aktif',
        kabupaten: 'Mamuju Tengah',
        provinsi: 'Sulawesi Barat',
        desa: isAdminDesa ? wilayahTugas : '',
        kecamatan: isAdminDesa ? wilayahTugas : '' // Mocking kec = desa for demo
      });
      setPhotoPreview(null);
    }
  }, [editingData, isOpen, isAdminDesa, wilayahTugas]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setPhotoPreview(base64);
        setFormData(prev => ({ ...prev, photo: base64 }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nipd || !formData.nama || !formData.divisi || !formData.jabatan) return;
    
    onSave({
      ...formData as PerangkatDesa,
      id: formData.id || Date.now().toString()
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
      />
      
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="bg-white rounded-[2.5rem] w-full max-w-5xl shadow-2xl flex flex-col relative overflow-hidden max-h-[90vh]"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-2xl bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors z-10"
        >
          <X size={20} />
        </button>

        <div className="px-8 py-6 flex items-center border-b border-slate-100 shrink-0">
          <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-blue-500/20 mr-4">
            {editingData ? <UserPen size={24} /> : <UserPlus size={24} />}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              {editingData ? 'Edit Data Perangkat' : 'Tambah Perangkat Baru'}
            </h2>
            <p className="text-xs text-slate-400 font-medium">Lengkapi informasi biodata dan penugasan desa.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Sidebar: Photo */}
            <div className="w-full lg:w-64 shrink-0 flex flex-col items-center">
              <div className="relative w-48 h-56 rounded-[2.5rem] bg-slate-50 flex items-center justify-center mb-6 border-2 border-dashed border-slate-200 overflow-hidden group">
                {photoPreview ? (
                  <img src={photoPreview} className="w-full h-full object-cover" alt="Preview" />
                ) : (
                  <div className="flex flex-col items-center text-slate-300">
                    <ImageIcon size={48} strokeWidth={1} />
                    <span className="text-[10px] uppercase font-bold tracking-tight mt-2">Belum ada foto</span>
                  </div>
                )}
                
                <input 
                  type="file" 
                  id="photoInput" 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleFileChange}
                />
                
                <button 
                  type="button"
                  onClick={() => document.getElementById('photoInput')?.click()}
                  className="absolute bottom-4 right-4 w-12 h-12 bg-primary text-white rounded-2xl shadow-xl flex items-center justify-center border-4 border-white hover:scale-110 transition-transform active:scale-95"
                >
                  <ImageIcon size={20} />
                </button>
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Pas Foto Perangkat (.jpg / .png)</p>
            </div>

            {/* Main Fields */}
            <div className="flex-1 space-y-10">
              {/* Section 1 */}
              <section>
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-1.5 h-4 bg-primary rounded-full" />
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Identitas Utama</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide ml-1">NIPD / Nomor Induk</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Contoh: 1987..."
                      value={formData.nipd || ''}
                      onChange={e => setFormData(p => ({ ...p, nipd: e.target.value }))}
                      className="form-input" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide ml-1">Nama Lengkap</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Sesuai KTP"
                      value={formData.nama || ''}
                      onChange={e => setFormData(p => ({ ...p, nama: e.target.value }))}
                      className="form-input" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide ml-1">Divisi Kerja</label>
                    <select 
                      required
                      value={formData.divisi || ''}
                      onChange={e => setFormData(p => ({ ...p, divisi: e.target.value }))}
                      className="form-input"
                    >
                      <option value="">Pilih Divisi</option>
                      {MASTER_DIVISI.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide ml-1">Jabatan Perangkat</label>
                    <select 
                      required
                      value={formData.jabatan || ''}
                      onChange={e => setFormData(p => ({ ...p, jabatan: e.target.value }))}
                      className="form-input"
                    >
                      <option value="">Pilih Jabatan</option>
                      {MASTER_JABATAN.map(j => <option key={j} value={j}>{j}</option>)}
                    </select>
                  </div>
                </div>
              </section>

              {/* Section 2 */}
              <section>
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-1.5 h-4 bg-emerald-500 rounded-full" />
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Penugasan & Lokasi</h3>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="space-y-2 col-span-2 md:col-span-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide ml-1">Nama Desa</label>
                    <input 
                      type="text" 
                      required
                      readOnly={isAdminDesa}
                      value={formData.desa || ''}
                      onChange={e => setFormData(p => ({ ...p, desa: e.target.value }))}
                      placeholder="Desa..."
                      className={`form-input ${isAdminDesa ? 'bg-slate-100 italic' : ''}`}
                    />
                  </div>
                  <div className="space-y-2 col-span-2 md:col-span-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide ml-1">Kecamatan</label>
                    <input 
                      type="text" 
                      required
                      value={formData.kecamatan || ''}
                      onChange={e => setFormData(p => ({ ...p, kecamatan: e.target.value }))}
                      placeholder="Kecamatan..."
                      className="form-input" 
                    />
                  </div>
                  <div className="space-y-2 col-span-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide ml-1">Kabupaten</label>
                    <input type="text" value={formData.kabupaten} readOnly className="form-input bg-slate-100" />
                  </div>
                  <div className="space-y-2 col-span-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide ml-1">Provinsi</label>
                    <input type="text" value={formData.provinsi} readOnly className="form-input bg-slate-100" />
                  </div>
                </div>
              </section>

              {/* Section 3 */}
              <section>
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-1.5 h-4 bg-amber-500 rounded-full" />
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Kontak & Kepegawaian</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide ml-1">Nomor HP / WA</label>
                    <div className="relative">
                      <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                      <input 
                        type="text" 
                        required
                        placeholder="08..."
                        value={formData.hp || ''}
                        onChange={e => setFormData(p => ({ ...p, hp: e.target.value }))}
                        className="form-input pl-12" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2 col-span-1 md:col-span-2">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide ml-1">Alamat Email</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                      <input 
                        type="email" 
                        placeholder="email@desa.go.id"
                        value={formData.email || ''}
                        onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                        className="form-input pl-12" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide ml-1">Tgl Masuk Tugas</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                      <input 
                        type="date" 
                        required
                        value={formData.tglMasuk || ''}
                        onChange={e => setFormData(p => ({ ...p, tglMasuk: e.target.value }))}
                        className="form-input pl-12" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide ml-1">Status Jabatan</label>
                    <select 
                      required
                      value={formData.status || 'Aktif'}
                      onChange={e => setFormData(p => ({ ...p, status: e.target.value as any }))}
                      className="form-input font-bold text-primary"
                    >
                      <option value="Aktif">Aktif</option>
                      <option value="Non-Aktif">Non-Aktif</option>
                    </select>
                  </div>
                </div>
              </section>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-8 mt-10 border-t border-slate-100">
            <button 
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors"
            >
              Batalkan
            </button>
            <button 
              type="submit"
              className="px-10 py-3 bg-primary text-white rounded-2xl font-bold text-sm shadow-xl shadow-blue-500/20 flex items-center gap-2 hover:bg-primary-hover active:scale-95 transition-all"
            >
              <Save size={18} /> {editingData ? 'Update Data' : 'Simpan Perangkat'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
