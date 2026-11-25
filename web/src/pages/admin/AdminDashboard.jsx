import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { 
  Shield, Users, MessageSquare, Bell, FileText, Activity, 
  ChevronRight, CheckCircle2, AlertCircle, ShoppingBag 
} from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAdminStatistik()
      .then(res => setStats(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Header */}
      <div className="bg-secondary-400 text-white rounded-3xl p-8 sm:p-10 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-semibold">
            <Shield className="w-3.5 h-3.5" />
            <span>Hak Akses Admin Utama Kelurahan Kapasmadya Baru</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Panel Administrator KADAYA
          </h1>
          <p className="text-pink-100 text-sm sm:text-base max-w-xl">
            Pusat kendali akun pengguna, moderasi dokumentasi seluruh Pokja, pesan masuk warga, pengumuman, dan audit log sistem.
          </p>
        </div>
      </div>

      {/* Stats Counter Grid */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link
            to="/admin/pesan"
            className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs hover:border-pink-500 transition-colors space-y-2 block"
          >
            <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center font-bold">
              <MessageSquare className="w-5 h-5" />
            </div>
            <span className="text-3xl font-extrabold text-neutral-500 block">
              {stats.pesan_baru}
            </span>
            <h3 className="font-bold text-neutral-500 text-sm">Pesan Baru Masuk</h3>
            <p className="text-xs text-neutral-400">Pertanyaan & pesanan produk warga</p>
          </Link>

          <Link
            to="/admin/kegiatan"
            className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs hover:border-blue-500 transition-colors space-y-2 block"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-3xl font-extrabold text-neutral-500 block">
              {stats.total_kegiatan}
            </span>
            <h3 className="font-bold text-neutral-500 text-sm">Total Dokumentasi Terbit</h3>
            <p className="text-xs text-neutral-400">Di seluruh Pokja I sampai IV</p>
          </Link>

          <Link
            to="/admin/pengguna"
            className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs hover:border-primary-400 transition-colors space-y-2 block"
          >
            <div className="w-10 h-10 rounded-xl bg-primary-200 text-primary-500 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-3xl font-extrabold text-neutral-500 block">
              {stats.total_pengguna}
            </span>
            <h3 className="font-bold text-neutral-500 text-sm">Akun Terdaftar</h3>
            <p className="text-xs text-neutral-400">Admin & PIC Pengurus Pokja</p>
          </Link>

          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <span className="text-3xl font-extrabold text-neutral-500 block">
              {stats.total_produk}
            </span>
            <h3 className="font-bold text-neutral-500 text-sm">Produk UMKM Aktif</h3>
            <p className="text-xs text-neutral-400">Etalase karya ibu-ibu anggota</p>
          </div>
        </div>
      )}

      {/* Navigasi Modul Admin */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-neutral-500">Menu Manajemen Admin</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <Link
            to="/admin/pengguna"
            className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs hover:shadow-md transition-shadow space-y-3 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-pink-100 text-pink-700 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-neutral-500 group-hover:text-pink-600 transition-colors">
              Manajemen Akun Pengguna
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Buat akun PIC Pokja, nonaktifkan akun, dan reset kata sandi sementara.
            </p>
          </Link>

          <Link
            to="/admin/kegiatan"
            className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs hover:shadow-md transition-shadow space-y-3 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-neutral-500 group-hover:text-blue-600 transition-colors">
              Moderasi Seluruh Dokumentasi
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Tinjau dokumentasi kegiatan seluruh Pokja, sembunyikan atau tampilkan konten.
            </p>
          </Link>

          <Link
            to="/admin/pesan"
            className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs hover:shadow-md transition-shadow space-y-3 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-neutral-500 group-hover:text-emerald-600 transition-colors">
              Kotak Masuk Pesan Warga
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Baca aspirasi warga, pertanyaan produk UMKM, dan balas langsung via WhatsApp.
            </p>
          </Link>

          <Link
            to="/admin/pengumuman"
            className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs hover:shadow-md transition-shadow space-y-3 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
              <Bell className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-neutral-500 group-hover:text-amber-600 transition-colors">
              Kelola Pengumuman
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Pasang pengumuman penting, atur masa tayang informasi kepada masyarakat.
            </p>
          </Link>

          <Link
            to="/admin/log"
            className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs hover:shadow-md transition-shadow space-y-3 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-gray-100 text-neutral-500 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-neutral-500 group-hover:text-neutral-500 transition-colors">
              Jejak Audit Log Aktivitas
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Rekam jejak keamanan: siapa yang menambah, mengubah, atau menghapus data.
            </p>
          </Link>

        </div>
      </div>

    </div>
  );
}
