/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as React from 'react';
import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  LayoutDashboard, 
  Layers, 
  Briefcase, 
  ShieldCheck, 
  CircleUser, 
  LogOut, 
  Menu, 
  X, 
  Search, 
  Filter, 
  FileSpreadsheet, 
  Printer, 
  UserPlus,
  Eye,
  EyeOff,
  MoreVertical,
  Edit,
  Trash2,
  Calendar,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  ChevronRight,
  Info,
  UserCheck,
  Building2,
  TrendingUp,
  PieChart as PieChartIcon
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell,
  Legend
} from 'recharts';
import { 
  INITIAL_ACCOUNTS, 
  INITIAL_PERANGKAT, 
  MASTER_DIVISI, 
  MASTER_JABATAN, 
  type PerangkatDesa, 
  type UserAccount 
} from './types';
import PerangkatModal from './components/PerangkatModal';
import UserModal from './components/UserModal';

// Components
const Toast = ({ title, message, type = 'success', onClose }: { title: string, message: string, type?: 'success' | 'error', onClose: () => void }) => (
  <motion.div 
    initial={{ y: 100, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    exit={{ y: 100, opacity: 0 }}
    className="fixed bottom-5 right-5 bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center z-[200] border border-slate-800"
  >
    {type === 'success' ? <CheckCircle2 className="text-green-400 mr-3 w-5 h-5" /> : <AlertCircle className="text-red-400 mr-3 w-5 h-5" />}
    <div>
      <h4 className="font-bold text-sm">{title}</h4>
      <p className="text-xs text-slate-400 mt-0.5">{message}</p>
    </div>
  </motion.div>
);

export default function App() {
  // Auth State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [loginForm, setLoginForm] = useState({ username: 'admin', password: 'password' });
  const [showLoginPass, setShowLoginPass] = useState(false);
  const [loginError, setLoginError] = useState(false);

  // App State
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [perangkatData, setPerangkatData] = useState<PerangkatDesa[]>(INITIAL_PERANGKAT);
  const [accounts, setAccounts] = useState<UserAccount[]>(INITIAL_ACCOUNTS);
  
  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDivisi, setFilterDivisi] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Toast
  const [toast, setToast] = useState<{ title: string, message: string, type?: 'success' | 'error' } | null>(null);

  // Modals
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingPerangkat, setEditingPerangkat] = useState<PerangkatDesa | null>(null);

  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserAccount | null>(null);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedPerangkat = localStorage.getItem('apd_perangkat_data');
    if (savedPerangkat) setPerangkatData(JSON.parse(savedPerangkat));
    
    const savedAccounts = localStorage.getItem('apd_accounts');
    if (savedAccounts) setAccounts(JSON.parse(savedAccounts));
  }, []);

  // Save data whenever it changes
  useEffect(() => {
    localStorage.setItem('apd_perangkat_data', JSON.stringify(perangkatData));
  }, [perangkatData]);

  useEffect(() => {
    localStorage.setItem('apd_accounts', JSON.stringify(accounts));
  }, [accounts]);

  // Handle Toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Auth Functions
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const found = accounts.find(a => a.username === loginForm.username && a.password === loginForm.password);
    if (found) {
      setCurrentUser(found);
      setIsLoggedIn(true);
      setLoginError(false);
    } else {
      setLoginError(true);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setActiveTab('dashboard');
  };

  // Data Filtering
  const filteredData = useMemo(() => {
    let base = [...perangkatData];
    // Filter by user permissions
    if (currentUser && currentUser.role === 'Admin Desa') {
      base = base.filter(p => p.desa.toLowerCase() === currentUser.wilayah.toLowerCase());
    }
    // Filter by search & selected filters
    return base.filter(p => {
      const matchesSearch = p.nama.toLowerCase().includes(searchQuery.toLowerCase()) || p.nipd.includes(searchQuery);
      const matchesDivisi = !filterDivisi || p.divisi === filterDivisi;
      const matchesStatus = !filterStatus || p.status === filterStatus;
      return matchesSearch && matchesDivisi && matchesStatus;
    });
  }, [perangkatData, currentUser, searchQuery, filterDivisi, filterStatus]);

  // Actions
  const toggleStatus = (id: string) => {
    setPerangkatData(prev => prev.map(p => p.id === id ? { ...p, status: p.status === 'Aktif' ? 'Non-Aktif' : 'Aktif' } : p));
    setToast({ title: 'Status Diperbarui', message: 'Status perangkat berhasil diubah.' });
  };

  const deletePerangkat = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      setPerangkatData(prev => prev.filter(p => p.id !== id));
      setToast({ title: 'Berhasil Dihapus', message: 'Data perangkat telah dihapus.' });
    }
  };

  const handleSavePerangkat = (data: PerangkatDesa) => {
    setPerangkatData(prev => {
      const exists = prev.find(p => p.id === data.id);
      if (exists) {
        return prev.map(p => p.id === data.id ? data : p);
      }
      return [data, ...prev];
    });
    setShowFormModal(false);
    setEditingPerangkat(null);
    setToast({ title: 'Berhasil Disimpan', message: `Data ${data.nama} telah diperbarui.` });
  };

  const handleSaveUser = (data: UserAccount) => {
    setAccounts(prev => {
      const exists = prev.find(a => a.username === data.username);
      if (exists) {
        return prev.map(a => a.username === data.username ? data : a);
      }
      return [...prev, data];
    });
    setShowUserModal(false);
    setEditingUser(null);
    setToast({ title: 'Berhasil Disimpan', message: `Akun ${data.username} telah diperbarui.` });
  };

  const deleteUser = (username: string) => {
    if (username === 'admin') return;
    if (confirm(`Apakah Anda yakin ingin menghapus akun @${username}?`)) {
      setAccounts(prev => prev.filter(a => a.username !== username));
      setToast({ title: 'Berhasil Dihapus', message: 'Akun administrator telah dihapus.' });
    }
  };

  // Login View
  if (!isLoggedIn) {
    return (
      <div className="fixed inset-0 bg-[#e2e8f0] flex flex-col items-center justify-center p-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] overflow-y-auto">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white/80 backdrop-blur-xl p-8 sm:p-10 rounded-[2.5rem] shadow-2xl w-full max-w-md flex flex-col items-center border border-white"
        >
          <div className="w-24 h-24 bg-primary text-white rounded-3xl flex items-center justify-center text-4xl shadow-xl shadow-blue-600/30 mb-6 relative">
            <Smartphone strokeWidth={2.5} size={40} />
            <div className="absolute top-2 right-2 w-3 h-3 bg-green-400 rounded-full border-2 border-primary"></div>
          </div>
          
          <h1 className="text-3xl font-black text-slate-800 tracking-tight text-center">MY APD DIGITAL</h1>
          <p className="text-xs font-bold text-slate-400 tracking-[0.2em] uppercase mt-2 mb-8 border-b border-slate-200 pb-4 w-full text-center">Mamuju Tengah</p>

          <form onSubmit={handleLogin} className="w-full space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 tracking-widest uppercase mb-1.5 ml-1">Username ID</label>
              <input 
                type="text" 
                value={loginForm.username} 
                onChange={e => setLoginForm(p => ({ ...p, username: e.target.value }))}
                className="form-input py-3.5 text-center font-semibold text-base" 
                placeholder="Username Anda..." 
                required 
              />
              <p className="text-[10px] text-slate-400 mt-2 text-center">
                Akun Demo: <span className="font-bold text-slate-500">admin</span> / <span className="font-bold text-slate-500">sekdes_topoyo</span>
              </p>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-500 tracking-widest uppercase mb-1.5 ml-1">Password Digital</label>
              <div className="relative">
                <input 
                  type={showLoginPass ? "text" : "password"} 
                  value={loginForm.password}
                  onChange={e => setLoginForm(p => ({ ...p, password: e.target.value }))}
                  className="form-input py-3.5 text-center font-semibold text-base tracking-widest" 
                  placeholder="••••••••" 
                  required 
                />
                <button 
                  type="button" 
                  onClick={() => setShowLoginPass(!showLoginPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showLoginPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            {loginError && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-red-500 font-semibold text-center mt-2 flex items-center justify-center gap-1"
              >
                <AlertCircle size={12} /> Username atau Password salah!
              </motion.div>
            )}
            <button type="submit" className="w-full bg-primary hover:bg-primary-hover text-white py-4 rounded-2xl font-bold text-sm tracking-wide shadow-lg shadow-blue-600/30 transition-all mt-6">
              MASUK SISTEM
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden">
      {/* Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/50 z-40 md:hidden backdrop-blur-sm" 
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`
        fixed md:relative inset-y-0 left-0 w-64 bg-sidebar text-slate-300 flex flex-col z-50 transition-transform duration-300 no-print
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 flex items-center border-b border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center mr-3 shadow-lg shadow-blue-500/20">
            <Smartphone size={20} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="font-bold text-sm leading-tight text-white tracking-wide uppercase">APD DIGITAL</h1>
            <span className="text-[10px] font-medium text-slate-500 uppercase tracking-widest -mt-1 block">Mamuju Tengah</span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`nav-item w-full ${activeTab === 'dashboard' ? 'active' : ''}`}
          >
            <LayoutDashboard size={20} className="mr-3" />
            <span className="font-semibold text-sm">Dashboard</span>
          </button>
          <button 
            onClick={() => setActiveTab('perangkat')}
            className={`nav-item w-full ${activeTab === 'perangkat' ? 'active' : ''}`}
          >
            <Users size={20} className="mr-3" />
            <span className="font-semibold text-sm">Perangkat Desa</span>
          </button>

          {currentUser?.role === 'Superadmin' && (
            <>
              <div className="pt-6 pb-2 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Pengaturan Pusat</div>
              <button 
                onClick={() => setActiveTab('divisi')}
                className={`nav-item w-full ${activeTab === 'divisi' ? 'active' : ''}`}
              >
                <Layers size={20} className="mr-3" />
                <span className="font-semibold text-sm">Master Divisi</span>
              </button>
              <button 
                onClick={() => setActiveTab('jabatan')}
                className={`nav-item w-full ${activeTab === 'jabatan' ? 'active' : ''}`}
              >
                <Briefcase size={20} className="mr-3" />
                <span className="font-semibold text-sm">Master Jabatan</span>
              </button>
              <button 
                onClick={() => setActiveTab('pengguna')}
                className={`nav-item w-full ${activeTab === 'pengguna' ? 'active' : ''}`}
              >
                <ShieldCheck size={20} className="mr-3" />
                <span className="font-semibold text-sm">Manajemen Akun</span>
              </button>
            </>
          )}

          <div className="pt-6 pb-2 px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Personal</div>
          <button 
            onClick={() => setActiveTab('profil')}
            className={`nav-item w-full ${activeTab === 'profil' ? 'active' : ''}`}
          >
            <CircleUser size={20} className="mr-3" />
            <span className="font-semibold text-sm">Profil Saya</span>
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 text-slate-500 hover:text-red-400 transition-colors group"
          >
            <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
            <span className="ml-3 font-semibold text-sm tracking-wide">Keluar Sistem</span>
          </button>
        </div>
      </aside>

      {/* Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 z-30 no-print">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(true)} className="md:hidden text-slate-500 hover:text-primary">
                <Menu size={24} />
              </button>
              <h2 className="text-xl font-bold text-slate-800 tracking-tight capitalize">
                {activeTab.replace('-', ' ')}
              </h2>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-800 leading-none">{currentUser?.name}</p>
                <p className="text-[10px] font-bold text-primary uppercase tracking-wider mt-1">
                  {currentUser?.role === 'Superadmin' ? 'Superadmin Kabupaten' : `Admin Desa ${currentUser?.wilayah}`}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold text-lg shadow-sm">
                {currentUser?.name.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div 
                key="dashboard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-7xl mx-auto space-y-8"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-black text-slate-800">Ringkasan Statistik</h2>
                    <p className="text-slate-500 text-sm mt-1">Status terkini perangkat desa Kabupaten Mamuju Tengah.</p>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full">
                    <MapPin size={14} className="text-primary" />
                    <span className="text-xs font-bold text-primary uppercase tracking-wider">
                      {currentUser?.role === 'Superadmin' ? 'Kabupaten Mamuju Tengah' : `Wilayah: Desa ${currentUser?.wilayah}`}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex items-center group hover:shadow-md transition-shadow">
                    <div className="w-14 h-14 rounded-2xl bg-blue-50 text-primary flex items-center justify-center text-2xl mr-5 group-hover:scale-110 transition-transform">
                      <Users size={28} />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Perangkat</p>
                      <h3 className="text-3xl font-black text-slate-800">{filteredData.length}</h3>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex items-center group hover:shadow-md transition-shadow">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl mr-5 group-hover:scale-110 transition-transform">
                      <UserCheck size={28} />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Perangkat Aktif</p>
                      <h3 className="text-3xl font-black text-slate-800">{filteredData.filter(p => p.status === 'Aktif').length}</h3>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex items-center group hover:shadow-md transition-shadow">
                    <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center text-2xl mr-5 group-hover:scale-110 transition-transform">
                      <Building2 size={28} />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Divisi</p>
                      <h3 className="text-3xl font-black text-slate-800">{MASTER_DIVISI.length}</h3>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Distribusi Divisi Chart */}
                  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-primary flex items-center justify-center">
                        <TrendingUp size={20} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-800 leading-none">Distribusi Divisi</h3>
                        <p className="text-xs text-slate-400 mt-1">Persebaran perangkat berdasarkan departemen.</p>
                      </div>
                    </div>
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={MASTER_DIVISI.map(div => ({
                          name: div,
                          total: filteredData.filter(p => p.divisi === div).length
                        }))}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis 
                            dataKey="name" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }}
                            dy={10}
                          />
                          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                          <Tooltip 
                            cursor={{ fill: '#f8fafc' }}
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px', fontWeight: 'bold' }}
                          />
                          <Bar 
                            dataKey="total" 
                            fill="#1d4ed8" 
                            radius={[6, 6, 0, 0]} 
                            barSize={32}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Status Keaktifan Chart */}
                  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <PieChartIcon size={20} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-800 leading-none">Status Keaktifan</h3>
                        <p className="text-xs text-slate-400 mt-1">Persentase perangkat yang aktif dalam sistem.</p>
                      </div>
                    </div>
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              { name: 'Aktif', value: filteredData.filter(p => p.status === 'Aktif').length },
                              { name: 'Non-Aktif', value: filteredData.filter(p => p.status === 'Non-Aktif').length }
                            ]}
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            <Cell fill="#10b981" />
                            <Cell fill="#ef4444" />
                          </Pie>
                          <Tooltip 
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px', fontWeight: 'bold' }}
                          />
                          <Legend 
                            verticalAlign="bottom" 
                            height={36} 
                            iconType="circle"
                            formatter={(value) => <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{value}</span>}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-3xl border border-slate-200 p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-2 h-8 bg-primary rounded-full" />
                    <h3 className="text-lg font-bold text-slate-800">Pembaruan Sistem</h3>
                  </div>
                  <div className="space-y-4">
                    {[1, 2].map(i => (
                      <div key={i} className="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors">
                        <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 flex-shrink-0">
                          <Info size={20} />
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-slate-800">Versi 2.1.0 Ready - Optimasi Kecepatan</h4>
                          <p className="text-xs text-slate-500 mt-1 leading-relaxed">Pembaruan sistem keamanan dan sinkronisasi data perangkat desa secara real-time kini lebih stabil untuk seluruh operator desa.</p>
                          <p className="text-[10px] font-bold text-slate-400 mt-2">17 MEI 2026</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'perangkat' && (
              <motion.div 
                key="perangkat"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="max-w-7xl mx-auto space-y-6"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-black text-slate-800">Manajemen Perangkat</h2>
                    <p className="text-slate-500 text-sm mt-1">Daftar lengkap perangkat desa yang terdaftar dalam sistem.</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
                      <FileSpreadsheet size={16} className="text-emerald-500" /> Export Excel
                    </button>
                    <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
                      <Printer size={16} /> Cetak
                    </button>
                    <button 
                      onClick={() => {
                        setEditingPerangkat(null);
                        setShowFormModal(true);
                      }}
                      className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary-hover shadow-lg shadow-blue-500/20 transition-all active:scale-95"
                    >
                      <UserPlus size={16} /> Tambah Baru
                    </button>
                  </div>
                </div>

                {/* Filters */}
                <div className="bg-white p-4 rounded-3xl border border-slate-200 flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="text" 
                      placeholder="Cari Nama atau NIPD..." 
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-4 py-3 placeholder-slate-400 text-sm focus:ring-2 focus:ring-primary/10 transition-all font-medium"
                    />
                  </div>
                  <div className="flex gap-2">
                    <select 
                      value={filterDivisi}
                      onChange={e => setFilterDivisi(e.target.value)}
                      className="bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-bold text-slate-600 focus:ring-2 focus:ring-primary/10 cursor-pointer"
                    >
                      <option value="">Semua Divisi</option>
                      {MASTER_DIVISI.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                    <select 
                      value={filterStatus}
                      onChange={e => setFilterStatus(e.target.value)}
                      className="bg-slate-50 border-none rounded-2xl px-4 py-3 text-sm font-bold text-slate-600 focus:ring-2 focus:ring-primary/10 cursor-pointer"
                    >
                      <option value="">Semua Status</option>
                      <option value="Aktif">Aktif</option>
                      <option value="Non-Aktif">Non-Aktif</option>
                    </select>
                  </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[1000px]">
                      <thead>
                        <tr className="bg-slate-50/50 border-b border-slate-100 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">
                          <th className="px-8 py-5">Profil & NIPD</th>
                          <th className="px-8 py-5">Jabatan & Divisi</th>
                          <th className="px-8 py-5">Lokasi Tugas</th>
                          <th className="px-8 py-5">Kontak</th>
                          <th className="px-8 py-5">Status</th>
                          <th className="px-8 py-5 text-right no-print">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {filteredData.map((peg, idx) => (
                          <motion.tr 
                            key={peg.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="group hover:bg-slate-50/80 transition-colors"
                          >
                            <td className="px-8 py-5">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold text-lg border border-primary/10 overflow-hidden">
                                  {peg.nama.charAt(0)}
                                </div>
                                <div>
                                  <div className="font-bold text-slate-800 text-sm">{peg.nama}</div>
                                  <div className="text-[11px] font-bold text-slate-400 tracking-wider mt-0.5">{peg.nipd}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-8 py-5">
                              <div className="font-bold text-slate-700 text-sm">{peg.jabatan}</div>
                              <div className="text-xs font-semibold text-slate-400 mt-0.5">{peg.divisi}</div>
                            </td>
                            <td className="px-8 py-5">
                              <div className="flex items-center gap-1.5 font-bold text-slate-700 text-sm">
                                <MapPin size={12} className="text-slate-300" />
                                Desa {peg.desa}
                              </div>
                              <div className="text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-wider">Kec. {peg.kecamatan}</div>
                            </td>
                            <td className="px-8 py-5">
                              <div className="flex items-center gap-2 text-slate-600 text-sm font-medium">
                                <Smartphone size={14} className="text-slate-400" /> {peg.hp}
                              </div>
                              <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                                <Mail size={12} /> {peg.email}
                              </div>
                            </td>
                            <td className="px-8 py-5">
                              <button 
                                onClick={() => toggleStatus(peg.id)}
                                className={`
                                px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all active:scale-95
                                ${peg.status === 'Aktif' 
                                  ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                                  : 'bg-red-50 text-red-600 border-red-100'}
                                `}
                              >
                                {peg.status}
                              </button>
                            </td>
                            <td className="px-8 py-5 text-right no-print">
                              <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                  onClick={() => {
                                    setEditingPerangkat(peg);
                                    setShowFormModal(true);
                                  }}
                                  className="p-2.5 text-slate-400 hover:text-primary hover:bg-blue-50 rounded-xl transition-all"
                                >
                                  <Edit size={18} />
                                </button>
                                <button 
                                  onClick={() => deletePerangkat(peg.id)}
                                  className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {filteredData.length === 0 && (
                    <div className="p-20 text-center flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                        <Search size={32} className="text-slate-300" />
                      </div>
                      <h4 className="font-bold text-slate-400">Data tidak ditemukan</h4>
                      <p className="text-xs text-slate-300 mt-1">Coba gunakan kata kunci pencarian yang berbeda.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'divisi' && (
              <motion.div 
                key="divisi"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-3xl mx-auto space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-black text-slate-800">Daftar Divisi</h2>
                </div>
                <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-3 shadow-sm">
                  {MASTER_DIVISI.map(d => (
                    <div key={d} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl group hover:border-primary/20 hover:bg-white transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-primary shadow-sm">
                          <Layers size={18} />
                        </div>
                        <span className="font-bold text-slate-700 tracking-tight">{d}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'jabatan' && (
              <motion.div 
                key="jabatan"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-3xl mx-auto space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-black text-slate-800">Daftar Jabatan</h2>
                </div>
                <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-3 shadow-sm">
                  {MASTER_JABATAN.map(j => (
                    <div key={j} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl group hover:border-primary/20 hover:bg-white transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-primary shadow-sm">
                          <Briefcase size={18} />
                        </div>
                        <span className="font-bold text-slate-700 tracking-tight">{j}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'pengguna' && (
              <motion.div 
                key="pengguna"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="max-w-7xl mx-auto space-y-6"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-black text-slate-800">Manajemen Pengguna</h2>
                    <p className="text-slate-500 text-sm mt-1">Kelola akses administrator tingkat kabupaten dan desa.</p>
                  </div>
                  <button 
                    onClick={() => {
                      setEditingUser(null);
                      setShowUserModal(true);
                    }}
                    className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary-hover shadow-lg shadow-blue-500/20 transition-all active:scale-95"
                  >
                    <ShieldCheck size={16} /> Tambah Admin / User
                  </button>
                </div>

                <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[1000px]">
                      <thead>
                        <tr className="bg-slate-50/50 border-b border-slate-100 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">
                          <th className="px-8 py-5">Nama / Username</th>
                          <th className="px-8 py-5">Level Akses</th>
                          <th className="px-8 py-5">Wilayah Tugas</th>
                          <th className="px-8 py-5">Email</th>
                          <th className="px-8 py-5 text-right">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {accounts.map((acc, idx) => (
                          <motion.tr 
                            key={acc.username}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="group hover:bg-slate-50/80 transition-colors"
                          >
                            <td className="px-8 py-5">
                              <div className="font-bold text-slate-800 text-sm">{acc.name}</div>
                              <div className="text-[11px] font-bold text-slate-400 tracking-wider mt-0.5">@{acc.username}</div>
                            </td>
                            <td className="px-8 py-5">
                              <span className={`
                                px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border
                                ${acc.role === 'Superadmin' 
                                  ? 'bg-purple-50 text-purple-600 border-purple-100' 
                                  : 'bg-blue-50 text-blue-600 border-blue-100'}
                              `}>
                                {acc.role}
                              </span>
                            </td>
                            <td className="px-8 py-5">
                              <div className="flex items-center gap-1.5 font-bold text-slate-700 text-sm">
                                {acc.role === 'Superadmin' ? 'Seluruh Kabupaten' : `Desa ${acc.wilayah}`}
                              </div>
                            </td>
                            <td className="px-8 py-5 text-sm text-slate-500 font-medium">
                              {acc.email}
                            </td>
                            <td className="px-8 py-5 text-right">
                              <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                  onClick={() => {
                                    setEditingUser(acc);
                                    setShowUserModal(true);
                                  }}
                                  className="p-2.5 text-slate-400 hover:text-primary hover:bg-blue-50 rounded-xl transition-all"
                                >
                                  <Edit size={18} />
                                </button>
                                <button 
                                  disabled={acc.username === 'admin'}
                                  onClick={() => deleteUser(acc.username)}
                                  className={`p-2.5 rounded-xl transition-all ${acc.username === 'admin' ? 'text-slate-200 cursor-not-allowed' : 'text-slate-400 hover:text-red-500 hover:bg-red-50'}`}
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'profil' && (
              <motion.div 
                key="profil"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-2xl mx-auto"
              >
                <div className="bg-white rounded-[2.5rem] border border-slate-200 p-10 overflow-hidden relative shadow-sm">
                  {/* Decorative element */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[5rem]" />
                  
                  <div className="flex flex-col items-center mb-10">
                    <div className="w-24 h-24 bg-primary text-white rounded-[2rem] flex items-center justify-center text-4xl font-black shadow-2xl shadow-blue-500/30 mb-6 relative border-4 border-white">
                      {currentUser?.name.charAt(0)}
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-lg border-4 border-white shadow-sm flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                      </div>
                    </div>
                    <div className="text-center">
                      <h3 className="text-2xl font-black text-slate-800 tracking-tight">{currentUser?.name}</h3>
                      <p className="text-sm font-bold text-primary mt-1 uppercase tracking-widest">{currentUser?.role}</p>
                    </div>
                  </div>

                  <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 tracking-widest uppercase mb-2 ml-1">Nama Tampilan</label>
                        <input type="text" value={currentUser?.name} className="form-input" disabled />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 tracking-widest uppercase mb-2 ml-1">Username ID</label>
                        <input type="text" value={currentUser?.username} className="form-input" disabled />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 tracking-widest uppercase mb-2 ml-1">Alamat Email</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                        <input type="email" value={currentUser?.email} className="form-input pl-12" disabled />
                      </div>
                    </div>
                    <hr className="border-slate-100" />
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 tracking-widest uppercase mb-2 ml-1">Keamanan Password</label>
                      <button type="button" className="w-full flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:border-primary/20 transition-all group">
                        <div className="flex items-center gap-3">
                          <ShieldCheck size={20} className="text-primary" />
                          <span className="text-sm font-bold text-slate-600">Ganti Password Digital</span>
                        </div>
                        <ChevronRight size={18} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                    <div className="pt-4">
                      <button className="w-full h-14 bg-primary text-white rounded-2xl font-bold text-sm tracking-wide shadow-xl shadow-blue-500/20 hover:bg-primary-hover transition-all active:scale-[0.98]">
                        Simpan Perubahan
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Toast Portal */}
      <AnimatePresence>
        {toast && (
          <Toast 
            title={toast.title} 
            message={toast.message} 
            type={toast.type}
            onClose={() => setToast(null)} 
          />
        )}
      </AnimatePresence>

      {/* Modals Portal */}
      <AnimatePresence>
        {showFormModal && (
          <PerangkatModal 
            isOpen={showFormModal}
            onClose={() => setShowFormModal(false)}
            onSave={handleSavePerangkat}
            editingData={editingPerangkat}
            isAdminDesa={currentUser?.role === 'Admin Desa'}
            wilayahTugas={currentUser?.wilayah || ''}
          />
        )}
        {showUserModal && (
          <UserModal 
            isOpen={showUserModal}
            onClose={() => setShowUserModal(false)}
            onSave={handleSaveUser}
            editingData={editingUser}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
