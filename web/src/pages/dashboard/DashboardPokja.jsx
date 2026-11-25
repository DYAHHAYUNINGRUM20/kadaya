import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { 
  Plus, Edit, Trash2, Calendar, Users, ShoppingBag, 
  Sparkles, CheckCircle2, AlertTriangle, ArrowRight, BookOpen 
} from 'lucide-react';

export default function DashboardPokja() {
  const { user } = useAuth();
  const [kegiatanList, setKegiatanList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchKegiatan = () => {
    setLoading(true);
    api.getKegiatan({ pokja_id: user?.pokja_id })
      .then(res => setKegiatanList(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (user) {
      fetchKegiatan();
    }
  }, [user]);

  const handleDelete = async () => {
    if (!itemToDelete) return;
    setDeleting(true);
    try {
      await api.hapusKegiatan(itemToDelete.id);
      setItemToDelete(null);
      fetchKegiatan();
    } catch (err) {
      alert(err.message || 'Gagal menghapus kegiatan.');
    } finally {
      setDeleting(false);
    }
  };

  const formatTanggal = (str) => {
    if (!str) return '';
    const d = new Date(str);
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* 1. Sapaan Ramah & Header */}
      <div className="bg-primary-500 text-white rounded-3xl p-6 sm:p-10 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-pink-200" />
            <span>Dashboard Pengurus Pokja &bull; Kapasmadya Berdaya</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Selamat Datang, {user?.nama}!
          </h1>
          <p className="text-blue-100 text-sm sm:text-base max-w-xl">
            Kelola arsip dokumentasi, karya UMKM anggota binaan, dan jadwal agenda untuk wilayah <strong>Pokja {user?.pokja_id || 'Anda'}</strong>.
          </p>
        </div>

        <Link
          to="/dashboard/kegiatan/baru"
          className="px-6 py-4 rounded-2xl bg-white text-blue-700 hover:bg-blue-50 font-bold text-base shadow-md flex items-center gap-2 flex-shrink-0 transition-transform hover:scale-105"
        >
          <Plus className="w-5 h-5 text-pink-600" />
          <span>Unggah Dokumentasi Baru</span>
        </Link>
      </div>

      {/* 2. Panduan 3 Langkah Bergambar (Sesuai Syarat Desain Ramah Literasi Digital) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-neutral-500 font-extrabold text-lg sm:text-xl">
          <BookOpen className="w-6 h-6 text-blue-600" />
          <h2>Panduan Praktis 3 Langkah Mengunggah Dokumentasi</h2>
        </div>
        <p className="text-sm text-neutral-400">
          Dirancang sederhana dan ramah untuk ibu-ibu pengurus PKK agar tidak kesulitan mendata kegiatan warga:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          
          <div className="bg-blue-50/60 rounded-2xl p-5 border border-blue-200/60 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
              1
            </div>
            <h3 className="font-bold text-neutral-500 text-base">Tekan Tombol Unggah</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Tekan tombol putih besar "Unggah Dokumentasi Baru" di bagian atas halaman ini.
            </p>
          </div>

          <div className="bg-pink-50/60 rounded-2xl p-5 border border-pink-200/60 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-pink-600 text-white flex items-center justify-center font-bold text-sm">
              2
            </div>
            <h3 className="font-bold text-neutral-500 text-base">Isi 3 Kolom Wajib</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Cukup masukkan <strong>Judul Kegiatan</strong> dan pilih <strong>Tanggal</strong> di kalender (Pokja terisi otomatis).
            </p>
          </div>

          <div className="bg-emerald-50/60 rounded-2xl p-5 border border-emerald-200/60 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
              3
            </div>
            <h3 className="font-bold text-neutral-500 text-base">Simpan Dokumentasi</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Tekan tombol hijau "Simpan & Terbitkan" agar kegiatan langsung tampil rapi di website publik warga!
            </p>
          </div>

        </div>
      </div>

      {/* 3. Tombol Aksi Cepat Menu Kelola */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Link
          to="/dashboard/kegiatan/baru"
          className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs hover:border-blue-500 transition-colors flex items-center justify-between group"
        >
          <div className="space-y-1">
            <span className="text-xs font-bold text-blue-600 uppercase">Dokumentasi</span>
            <h3 className="font-bold text-neutral-500 text-lg">Tambah Kegiatan</h3>
            <p className="text-xs text-neutral-400">Arsipkan foto dan ringkasan</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Plus className="w-6 h-6" />
          </div>
        </Link>

        <Link
          to="/dashboard/produk"
          className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs hover:border-pink-500 transition-colors flex items-center justify-between group"
        >
          <div className="space-y-1">
            <span className="text-xs font-bold text-pink-600 uppercase">Karya UP2K</span>
            <h3 className="font-bold text-neutral-500 text-lg">Kelola Produk UMKM</h3>
            <p className="text-xs text-neutral-400">Atur produk & kontak pemilik</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </Link>

        <Link
          to="/dashboard/jadwal"
          className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs hover:border-emerald-500 transition-colors flex items-center justify-between group"
        >
          <div className="space-y-1">
            <span className="text-xs font-bold text-emerald-600 uppercase">Agenda Warga</span>
            <h3 className="font-bold text-neutral-500 text-lg">Kelola Jadwal Pokja</h3>
            <p className="text-xs text-neutral-400">Tambah agenda & tautan</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Calendar className="w-6 h-6" />
          </div>
        </Link>
      </div>

      {/* 4. Daftar Dokumentasi Pokja Saya */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-500">
              Dokumentasi Kegiatan Pokja Saya ({kegiatanList.length})
            </h2>
            <p className="text-xs text-neutral-400">
              Daftar kegiatan yang telah Anda unggah ke dalam sistem KADAYA.
            </p>
          </div>
          <Link
            to="/dashboard/kegiatan/baru"
            className="px-4 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Unggah Baru</span>
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12 text-neutral-400">Memuat arsip dokumentasi...</div>
        ) : kegiatanList.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <Calendar className="w-12 h-12 text-neutral-300 mx-auto" />
            <h3 className="font-bold text-neutral-500 text-lg">Belum Ada Dokumentasi Kegiatan</h3>
            <p className="text-xs text-neutral-400">Mulai unggah dokumentasi perdana Pokja Anda sekarang.</p>
            <Link
              to="/dashboard/kegiatan/baru"
              className="inline-block px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold"
            >
              Unggah Dokumentasi Sekarang
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {kegiatanList.map(keg => (
              <div key={keg.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src={keg.foto_sampul}
                    alt={keg.judul}
                    className="w-16 h-16 rounded-2xl object-cover bg-gray-100 flex-shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold ${
                        keg.status === 'terbit' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {keg.status === 'terbit' ? 'Terbit' : 'Draf'}
                      </span>
                      <span className="text-xs text-neutral-400">{formatTanggal(keg.tanggal)}</span>
                    </div>
                    <h3 className="font-bold text-neutral-500 text-base leading-snug">
                      {keg.judul}
                    </h3>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      Lokasi: {keg.lokasi || 'Balai Kelurahan'} &bull; {keg.jumlah_peserta} Peserta
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <Link
                    to={`/dashboard/kegiatan/${keg.id}/ubah`}
                    className="px-3.5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-neutral-500 font-bold text-xs flex items-center gap-1"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Ubah</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => setItemToDelete(keg)}
                    className="px-3.5 py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 font-bold text-xs flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Hapus</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Konfirmasi Hapus Kegiatan */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 bg-neutral-500/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-gray-100">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-xl font-bold text-neutral-500">Konfirmasi Hapus Dokumentasi</h3>
              <p className="text-sm text-neutral-400">
                Apakah Anda yakin ingin menghapus dokumentasi <strong>"{itemToDelete.judul}"</strong>? Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setItemToDelete(null)}
                className="px-5 py-2.5 rounded-xl border border-gray-300 text-sm font-semibold text-neutral-400 hover:bg-gray-100"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleDelete}
                className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold shadow-xs disabled:opacity-50"
              >
                {deleting ? 'Menghapus...' : 'Ya, Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
