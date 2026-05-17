/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  ShieldCheck, 
  Mail, 
  Key, 
  MapPin, 
  Save, 
  Eye, 
  EyeOff,
  User
} from 'lucide-react';
import { type UserAccount } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: UserAccount) => void;
  editingData: UserAccount | null;
}

export default function UserModal({ isOpen, onClose, onSave, editingData }: Props) {
  const [formData, setFormData] = useState<Partial<UserAccount>>({
    role: 'Admin Desa',
    wilayah: ''
  });
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    if (editingData) {
      setFormData(editingData);
    } else {
      setFormData({
        role: 'Admin Desa',
        wilayah: '',
        password: 'password'
      });
    }
    setShowPass(false);
  }, [editingData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username || !formData.name || !formData.email || !formData.password || !formData.wilayah) return;
    
    onSave(formData as UserAccount);
  };

  const handleRoleChange = (role: 'Superadmin' | 'Admin Desa') => {
    setFormData(prev => ({ 
      ...prev, 
      role, 
      wilayah: role === 'Superadmin' ? 'Semua' : (prev.wilayah === 'Semua' ? '' : prev.wilayah)
    }));
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
        className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl flex flex-col relative overflow-hidden"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-2xl bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors z-10"
        >
          <X size={20} />
        </button>

        <div className="px-8 py-6 flex items-center border-b border-slate-100 shrink-0">
          <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-blue-500/20 mr-4">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              {editingData ? 'Edit Akun Pengguna' : 'Tambah Akun Baru'}
            </h2>
            <p className="text-xs text-slate-400 font-medium">Kelola hak akses dan identitas administrator sistem.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-8 py-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Username ID <span className="text-red-500">*</span></label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                <input 
                  type="text" 
                  required
                  readOnly={!!editingData}
                  placeholder="Contoh: sekdes_karossa"
                  value={formData.username || ''}
                  onChange={e => setFormData(p => ({ ...p, username: e.target.value.toLowerCase() }))}
                  className={`form-input pl-12 ${editingData ? 'bg-slate-100 cursor-not-allowed' : ''}`}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Nama Lengkap <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                required
                placeholder="Contoh: Ahmad Subardjo"
                value={formData.name || ''}
                onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                className="form-input" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Email <span className="text-red-500">*</span></label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                <input 
                  type="email" 
                  required
                  placeholder="ahmad@desa.go.id"
                  value={formData.email || ''}
                  onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                  className="form-input pl-12" 
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Password <span className="text-red-500">*</span></label>
              <div className="relative">
                <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                <input 
                  type={showPass ? "text" : "password"} 
                  required
                  placeholder="••••••••"
                  value={formData.password || ''}
                  onChange={e => setFormData(p => ({ ...p, password: e.target.value }))}
                  className="form-input px-12" 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Level Akses <span className="text-red-500">*</span></label>
              <div className="flex gap-2">
                <button 
                  type="button"
                  onClick={() => handleRoleChange('Admin Desa')}
                  className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold border transition-all ${formData.role === 'Admin Desa' ? 'bg-primary/5 border-primary text-primary' : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'}`}
                >
                  Admin Desa
                </button>
                <button 
                  type="button"
                  onClick={() => handleRoleChange('Superadmin')}
                  className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold border transition-all ${formData.role === 'Superadmin' ? 'bg-purple-50 border-purple-500 text-purple-600' : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'}`}
                >
                  Superadmin
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Wilayah Tugas <span className="text-red-500">*</span></label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                <input 
                  type="text" 
                  required
                  readOnly={formData.role === 'Superadmin'}
                  placeholder={formData.role === 'Superadmin' ? 'Semua' : 'Nama Desa...'}
                  value={formData.wilayah || ''}
                  onChange={e => setFormData(p => ({ ...p, wilayah: e.target.value }))}
                  className={`form-input pl-12 ${formData.role === 'Superadmin' ? 'bg-slate-100 italic' : ''}`}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
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
              <Save size={18} /> Simpan Akun
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
