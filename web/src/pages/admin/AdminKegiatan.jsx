import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { Eye, EyeOff, Edit, Trash2, Calendar, Users, MapPin, Plus, AlertTriangle } from 'lucide-react';

export default function AdminKegiatan() {
  const [kegiatanList, setKegiatanList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [itemToDelete, setItemToDelete] = useState(null);

  const fetchKegiatan = () => {
    setLoading(true);
    api.getKegiatan()
      .then(res => setKegiatanList(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchKegiatan();
  }, []);

  const handleToggleStatus = async (item) => {
    const nextStatus = item.status === 'terbit' ? 'disembunyikan' : 'terbit';
    try {
      await api.ubahStatusKegiatan(item.id, nextStatus);
      fetchKegiatan();
    } catch (err) {
      alert(err.message || 'Gagal mengubah status kegiatan.');
    }
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    try {
      await api.hapusKegiatan(itemToDelete.id);
      setItemToDelete(null);
      fetchKegiatan();
    } catch (err) {
      alert(err.message || 'Gagal menghapus kegiatan.');
    }
  };

  const formatTanggal = (str) => {
    if (!str) return '';
    const d = new Date(str);
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-neutral-500 tracking-tight">
            Moderasi Seluruh Dokumentasi Kegiatan
          </h1>
          <p className="text-sm text-neutral-400">
            Tinjau dan kelola publikasi dokumentasi dari seluruh Pokja I sampai IV.
          </p>
        </div>

        <Link
          to="/dashboard/kegiatan/baru"
          className="px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md flex items-center gap-2 transition-colors flex-shrink-0"
        >
          <Plus className="w-5 h-5" />
          <span>Unggah Kegiatan Baru</span>
        </Link>
      </div>

      <div className="bg-white rounded-3xl border border-gray-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="text-center py-16 text-neutral-400">Memuat dokumentasi kegiatan...</div>
        ) : kegiatanList.length === 0 ? (
          <div className="text-center py-16 text-neutral-400">Belum ada dokumentasi.</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {kegiatanList.map(keg => (
              <div key={keg.id} className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-gray-50/60 transition-colors">
                <div className="flex items-center gap-4">
                  <img
                    src={keg.foto_sampul}
                    alt={keg.judul}
                    className="w-20 h-20 rounded-2xl object-cover bg-gray-100 flex-shrink-0"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className="text-xs font-bold px-2.5 py-0.5 rounded-full text-white"
                        style={{ backgroundColor: keg.pokja_warna }}
                      >
                        {keg.pokja_nama}
                      </span>
                      <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold ${
                        keg.status === 'terbit'
                          ? 'bg-emerald-100 text-emerald-800'
                          : keg.status === 'disembunyikan'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {keg.status === 'terbit' ? 'Tayang di Publik' : keg.status === 'disembunyikan' ? 'Disembunyikan' : 'Draf'}
                      </span>
                      <span className="text-xs text-neutral-400">&bull; {formatTanggal(keg.tanggal)}</span>
                    </div>

                    <h3 className="font-bold text-neutral-500 text-base sm:text-lg leading-snug">
                      {keg.judul}
                    </h3>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-400">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-pink-600" />
                        {keg.lokasi || 'Balai Kelurahan'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-blue-600" />
                        {keg.jumlah_peserta} Orang Peserta
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center">
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(keg)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
                      keg.status === 'terbit'
                        ? 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                        : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                    }`}
                  >
                    {keg.status === 'terbit' ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{keg.status === 'terbit' ? 'Sembunyikan' : 'Tayangkan'}</span>
                  </button>

                  <Link
                    to={`/dashboard/kegiatan/${keg.id}/ubah`}
                    className="px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-neutral-500 font-bold text-xs flex items-center gap-1"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Ubah</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => setItemToDelete(keg)}
                    className="p-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold"
                    title="Hapus Kegiatan"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Hapus */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 bg-neutral-500/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-gray-100 text-center">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-neutral-500">Hapus Dokumentasi Kegiatan?</h3>
            <p className="text-sm text-neutral-400">
              Apakah Anda yakin ingin menghapus <strong>"{itemToDelete.judul}"</strong>?
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setItemToDelete(null)}
                className="px-5 py-2.5 rounded-xl border border-gray-300 text-sm font-semibold text-neutral-400"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="px-6 py-2.5 rounded-xl bg-red-600 text-white text-sm font-bold"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
