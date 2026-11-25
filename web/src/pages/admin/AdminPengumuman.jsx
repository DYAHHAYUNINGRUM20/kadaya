import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Plus, Edit, Trash2, Bell, Sparkles, X, AlertTriangle } from 'lucide-react';

export default function AdminPengumuman() {
  const [pengumumanList, setPengumumanList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [saving, setSaving] = useState(false);

  // Form State
  const [judul, setJudul] = useState('');
  const [isi, setIsi] = useState('');
  const [penting, setPenting] = useState(false);
  const [tayangMulai, setTayangMulai] = useState(new Date().toISOString().split('T')[0]);
  const [tayangSampai, setTayangSampai] = useState(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );

  const fetchPengumuman = () => {
    setLoading(true);
    api.getAdminPengumuman()
      .then(res => setPengumumanList(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPengumuman();
  }, []);

  const openAddModal = () => {
    setEditingItem(null);
    setJudul('');
    setIsi('');
    setPenting(false);
    setTayangMulai(new Date().toISOString().split('T')[0]);
    setTayangSampai(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setJudul(item.judul);
    setIsi(item.isi);
    setPenting(item.penting);
    setTayangMulai(item.tayang_mulai);
    setTayangSampai(item.tayang_sampai);
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!judul || !isi) {
      alert('Judul dan isi pengumuman wajib diisi.');
      return;
    }
    setSaving(true);
    const payload = { judul, isi, penting, tayang_mulai: tayangMulai, tayang_sampai: tayangSampai };
    try {
      if (editingItem) {
        await api.ubahAdminPengumuman(editingItem.id, payload);
      } else {
        await api.buatAdminPengumuman(payload);
      }
      setIsModalOpen(false);
      fetchPengumuman();
    } catch (err) {
      alert(err.message || 'Gagal menyimpan pengumuman.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    try {
      await api.hapusAdminPengumuman(itemToDelete.id);
      setItemToDelete(null);
      fetchPengumuman();
    } catch (err) {
      alert(err.message || 'Gagal menghapus pengumuman.');
    }
  };

  const formatTanggal = (str) => {
    if (!str) return '';
    const d = new Date(str);
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-neutral-500 tracking-tight">
            Kelola Pengumuman Warga
          </h1>
          <p className="text-sm text-neutral-400">
            Publikasikan pengumuman penting, jadwal imunisasi, dan informasi dinas terkait.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-6 py-3.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-md flex items-center gap-2 transition-colors flex-shrink-0"
        >
          <Plus className="w-5 h-5" />
          <span>Buat Pengumuman Baru</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-gray-200 divide-y divide-gray-100 shadow-xs overflow-hidden">
        {loading ? (
          <div className="text-center py-16 text-neutral-400">Memuat pengumuman...</div>
        ) : pengumumanList.length === 0 ? (
          <div className="text-center py-16 text-neutral-400">Belum ada pengumuman.</div>
        ) : (
          pengumumanList.map(item => (
            <div key={item.id} className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {item.penting && (
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 uppercase flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Penting
                    </span>
                  )}
                  <span className="text-xs text-neutral-400">
                    Masa Tayang: {formatTanggal(item.tayang_mulai)} s.d {formatTanggal(item.tayang_sampai)}
                  </span>
                </div>
                <h3 className="font-bold text-neutral-500 text-lg leading-snug">
                  {item.judul}
                </h3>
                <p className="text-xs text-neutral-400 line-clamp-2">
                  {item.isi}
                </p>
              </div>

              <div className="flex items-center gap-2 self-end md:self-center">
                <button
                  type="button"
                  onClick={() => openEditModal(item)}
                  className="px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-neutral-500 font-bold text-xs flex items-center gap-1"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Ubah</span>
                </button>
                <button
                  type="button"
                  onClick={() => setItemToDelete(item)}
                  className="p-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-neutral-500/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-xl font-bold text-neutral-500">
                {editingItem ? 'Ubah Pengumuman' : 'Buat Pengumuman Baru'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-neutral-300 hover:text-neutral-500">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-400 mb-1">
                  Judul Pengumuman *
                </label>
                <input
                  type="text"
                  required
                  value={judul}
                  onChange={(e) => setJudul(e.target.value)}
                  placeholder="Contoh: Jadwal Posyandu Balita Bulan November"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-blue-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-400 mb-1">
                  Isi Pengumuman *
                </label>
                <textarea
                  rows={4}
                  required
                  value={isi}
                  onChange={(e) => setIsi(e.target.value)}
                  placeholder="Tuliskan isi pengumuman secara rinci..."
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-blue-600 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-400 mb-1">
                    Tayang Mulai *
                  </label>
                  <input
                    type="date"
                    required
                    value={tayangMulai}
                    onChange={(e) => setTayangMulai(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-400 mb-1">
                    Tayang Sampai *
                  </label>
                  <input
                    type="date"
                    required
                    value={tayangSampai}
                    onChange={(e) => setTayangSampai(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="pentingCheck"
                  checked={penting}
                  onChange={(e) => setPenting(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-gray-300"
                />
                <label htmlFor="pentingCheck" className="text-xs font-bold text-neutral-500 cursor-pointer">
                  Tandai Sebagai Pengumuman Penting / Mendesak
                </label>
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
                  className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-xs disabled:opacity-50"
                >
                  {saving ? 'Menyimpan...' : 'Simpan Pengumuman'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Hapus */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 bg-neutral-500/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-gray-100 text-center">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-neutral-500">Hapus Pengumuman?</h3>
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
