import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Plus, Edit, Trash2, Calendar, Clock, MapPin, X, AlertTriangle } from 'lucide-react';

export default function KelolaJadwal() {
  const { user } = useAuth();
  const [jadwalList, setJadwalList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [saving, setSaving] = useState(false);

  // Form State
  const [judul, setJudul] = useState('');
  const [tanggal, setTanggal] = useState(new Date().toISOString().split('T')[0]);
  const [waktuMulai, setWaktuMulai] = useState('08:00');
  const [waktuSelesai, setWaktuSelesai] = useState('11:00');
  const [lokasi, setLokasi] = useState('');
  const [keterangan, setKeterangan] = useState('');
  const [status, setStatus] = useState('akan_datang');

  const fetchJadwal = () => {
    setLoading(true);
    api.getJadwal({ pokja_id: user?.pokja_id })
      .then(res => setJadwalList(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchJadwal();
  }, [user]);

  const openAddModal = () => {
    setEditingItem(null);
    setJudul('');
    setTanggal(new Date().toISOString().split('T')[0]);
    setWaktuMulai('08:00');
    setWaktuSelesai('11:00');
    setLokasi('Balai Kelurahan Kapasmadya Baru');
    setKeterangan('');
    setStatus('akan_datang');
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setJudul(item.judul);
    setTanggal(item.tanggal);
    setWaktuMulai(item.waktu_mulai || '08:00');
    setWaktuSelesai(item.waktu_selesai || '11:00');
    setLokasi(item.lokasi || '');
    setKeterangan(item.keterangan || '');
    setStatus(item.status);
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!judul || !tanggal) {
      alert('Judul agenda dan tanggal wajib diisi.');
      return;
    }

    setSaving(true);
    const payload = {
      judul,
      tanggal,
      waktu_mulai: waktuMulai,
      waktu_selesai: waktuSelesai,
      lokasi,
      keterangan,
      status,
      pokja_id: user?.pokja_id || null
    };

    try {
      if (editingItem) {
        await api.ubahJadwal(editingItem.id, payload);
      } else {
        await api.buatJadwal(payload);
      }
      setIsModalOpen(false);
      fetchJadwal();
    } catch (err) {
      alert(err.message || 'Gagal menyimpan agenda.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    try {
      await api.hapusJadwal(itemToDelete.id);
      setItemToDelete(null);
      fetchJadwal();
    } catch (err) {
      alert(err.message || 'Gagal menghapus jadwal.');
    }
  };

  const formatTanggal = (str) => {
    if (!str) return '';
    const d = new Date(str);
    return d.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-neutral-500 tracking-tight">
            Kelola Agenda & Jadwal Pokja
          </h1>
          <p className="text-sm text-neutral-400">
            Atur jadwal pertemuan, posyandu, dan kegiatan yang akan berlangsung di wilayah Pokja Anda.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md flex items-center gap-2 transition-colors flex-shrink-0"
        >
          <Plus className="w-5 h-5" />
          <span>Tambah Agenda Baru</span>
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-neutral-400">Memuat jadwal agenda...</div>
      ) : jadwalList.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-gray-200 p-8 space-y-3">
          <Calendar className="w-12 h-12 text-neutral-300 mx-auto" />
          <h3 className="text-lg font-bold text-neutral-500">Belum Ada Agenda Terdaftar</h3>
          <p className="text-xs text-neutral-400">Jadwalkan agenda pertemuan agar warga dapat bersiap hadir.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-200 divide-y divide-gray-100 shadow-xs overflow-hidden">
          {jadwalList.map(j => (
            <div key={j.id} className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold ${
                    j.status === 'selesai' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {j.status === 'selesai' ? 'Selesai' : 'Akan Datang'}
                  </span>
                  <span className="text-xs text-neutral-400 font-semibold">{j.pokja_nama}</span>
                </div>

                <h3 className="font-bold text-neutral-500 text-lg leading-snug">
                  {j.judul}
                </h3>

                <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-blue-600" />
                    {formatTanggal(j.tanggal)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    {j.waktu_mulai || '08:00'} - {j.waktu_selesai || 'Selesai'} WIB
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-pink-600" />
                    {j.lokasi || 'Balai Kelurahan'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => openEditModal(j)}
                  className="px-3.5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-neutral-500 font-bold text-xs flex items-center gap-1"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Ubah</span>
                </button>
                <button
                  type="button"
                  onClick={() => setItemToDelete(j)}
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

      {/* Modal Form Jadwal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-neutral-500/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-xl font-bold text-neutral-500">
                {editingItem ? 'Ubah Agenda Kegiatan' : 'Tambah Agenda Kegiatan Baru'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-neutral-300 hover:text-neutral-500">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-400 mb-1">
                  Nama / Judul Agenda *
                </label>
                <input
                  type="text"
                  required
                  value={judul}
                  onChange={(e) => setJudul(e.target.value)}
                  placeholder="Contoh: Posyandu Balita & Lansia RW 02"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-blue-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-400 mb-1">
                  Tanggal Pelaksanaan *
                </label>
                <input
                  type="date"
                  required
                  lang="id"
                  value={tanggal}
                  onChange={(e) => setTanggal(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-blue-600 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-400 mb-1">
                    Waktu Mulai
                  </label>
                  <input
                    type="time"
                    value={waktuMulai}
                    onChange={(e) => setWaktuMulai(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-400 mb-1">
                    Waktu Selesai
                  </label>
                  <input
                    type="time"
                    value={waktuSelesai}
                    onChange={(e) => setWaktuSelesai(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-400 mb-1">
                  Lokasi Pertemuan
                </label>
                <input
                  type="text"
                  value={lokasi}
                  onChange={(e) => setLokasi(e.target.value)}
                  placeholder="Balai RW / Poskeskel"
                  className="w-full px-4 py-2 rounded-xl border border-gray-300 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-400 mb-1">
                  Status Agenda
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-gray-300 text-sm bg-white"
                >
                  <option value="akan_datang">Akan Datang</option>
                  <option value="selesai">Selesai (Sudah Terlaksana)</option>
                  <option value="dibatalkan">Dibatalkan</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-400 mb-1">
                  Keterangan Tambahan
                </label>
                <textarea
                  rows={2}
                  value={keterangan}
                  onChange={(e) => setKeterangan(e.target.value)}
                  placeholder="Barang bawaan, dresscode, info imunisasi..."
                  className="w-full px-4 py-2 rounded-xl border border-gray-300 text-sm"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-gray-300 text-sm font-semibold text-neutral-400"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-xs"
                >
                  {saving ? 'Menyimpan...' : 'Simpan Agenda'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Delete */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 bg-neutral-500/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-gray-100 text-center">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-neutral-500">Hapus Agenda Ini?</h3>
            <p className="text-sm text-neutral-400">
              Apakah Anda yakin ingin menghapus agenda <strong>"{itemToDelete.judul}"</strong>?
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
