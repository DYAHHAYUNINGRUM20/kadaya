import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { 
  Plus, Edit, Trash2, ShoppingBag, Phone, User, MapPin, 
  Sparkles, CheckCircle2, AlertTriangle, X 
} from 'lucide-react';

export default function KelolaProduk() {
  const { user } = useAuth();
  const [produkList, setProdukList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [saving, setSaving] = useState(false);

  // Form State
  const [nama, setNama] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [harga, setHarga] = useState('');
  const [satuan, setSatuan] = useState('pcs');
  const [namaPemilik, setNamaPemilik] = useState('');
  const [noTelepon, setNoTelepon] = useState('');
  const [alamatPemilik, setAlamatPemilik] = useState('');
  const [fotoUrl, setFotoUrl] = useState('https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=600&q=80');
  const [selectedPokja, setSelectedPokja] = useState('2');

  const fetchProduk = () => {
    setLoading(true);
    api.getProduk(user?.peran === 'admin' ? {} : { pokja_id: user?.pokja_id })
      .then(res => setProdukList(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProduk();
  }, [user]);

  const openAddModal = () => {
    setEditingItem(null);
    setNama('');
    setDeskripsi('');
    setHarga('');
    setSatuan('pcs');
    setNamaPemilik('');
    setNoTelepon('');
    setAlamatPemilik('RT 02 / RW 03, Kapasmadya Baru');
    setFotoUrl('https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=600&q=80');
    setSelectedPokja(String(user?.pokja_id || 2));
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setNama(item.nama);
    setDeskripsi(item.deskripsi || '');
    setHarga(item.harga);
    setSatuan(item.satuan || 'pcs');
    setNamaPemilik(item.nama_pemilik);
    setNoTelepon(item.no_telepon);
    setAlamatPemilik(item.alamat_pemilik || '');
    setFotoUrl(item.foto_url);
    setSelectedPokja(String(item.pokja_id || user?.pokja_id || 2));
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!nama || !namaPemilik || !noTelepon) {
      alert('Nama produk, Nama ibu pemilik, dan Nomor WhatsApp wajib diisi.');
      return;
    }

    setSaving(true);
    const payload = {
      nama,
      pokja_id: user?.peran === 'admin' ? Number(selectedPokja) : user?.pokja_id,
      deskripsi,
      harga: Number(harga) || 0,
      satuan,
      nama_pemilik: namaPemilik,
      no_telepon: noTelepon,
      alamat_pemilik: alamatPemilik,
      foto_url: fotoUrl
    };

    try {
      if (editingItem) {
        await api.ubahProduk(editingItem.id, payload);
      } else {
        await api.buatProduk(payload);
      }
      setIsModalOpen(false);
      fetchProduk();
    } catch (err) {
      alert(err.message || 'Gagal menyimpan produk.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    try {
      await api.hapusProduk(itemToDelete.id);
      setItemToDelete(null);
      fetchProduk();
    } catch (err) {
      alert(err.message || 'Gagal menghapus produk.');
    }
  };

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(number);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Kemandirian Ekonomi Perempuan &bull; UP2K PKK</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-neutral-500 tracking-tight">
            Kelola Etalase Produk UMKM Pokja
          </h1>
          <p className="text-sm text-neutral-400">
            Daftarkan karya dan produk olahan ibu-ibu anggota PKK lengkap dengan kontak WhatsApp pemilik.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-6 py-3.5 rounded-2xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-sm shadow-md flex items-center gap-2 transition-colors flex-shrink-0"
        >
          <Plus className="w-5 h-5" />
          <span>Tambah Produk Baru</span>
        </button>
      </div>

      {/* Grid Produk */}
      {loading ? (
        <div className="text-center py-20 text-neutral-400">Memuat produk Pokja...</div>
      ) : produkList.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-gray-200 p-8 space-y-3">
          <ShoppingBag className="w-12 h-12 text-neutral-300 mx-auto" />
          <h3 className="text-lg font-bold text-neutral-500">Belum Ada Produk UMKM Terdaftar</h3>
          <p className="text-xs text-neutral-400">Tekan tombol Tambah Produk Baru untuk mempromosikan karya ibu-ibu warga.</p>
          <button
            onClick={openAddModal}
            className="px-5 py-2.5 rounded-xl bg-pink-600 text-white font-bold text-xs"
          >
            Tambah Produk Sekarang
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {produkList.map(prod => (
            <div
              key={prod.id}
              className="bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-xs flex flex-col justify-between group"
            >
              <div>
                <div className="h-48 relative overflow-hidden bg-gray-100">
                  <img
                    src={prod.foto_url}
                    alt={prod.nama}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute bottom-3 right-3 bg-white/95 px-3 py-1 rounded-xl text-sm font-extrabold text-neutral-500 border border-gray-200 shadow-xs">
                    {formatRupiah(prod.harga)}
                    <span className="text-xs font-normal text-neutral-400"> /{prod.satuan}</span>
                  </span>
                </div>

                <div className="p-6 space-y-3">
                  <h3 className="font-bold text-neutral-500 text-lg leading-snug">
                    {prod.nama}
                  </h3>
                  <p className="text-xs text-neutral-400 line-clamp-2">
                    {prod.deskripsi || 'Produk unggulan anggota PKK.'}
                  </p>

                  <div className="p-3 bg-pink-50 rounded-xl space-y-1.5 text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-neutral-500">
                      <User className="w-3.5 h-3.5 text-pink-600" />
                      <span>{prod.nama_pemilik}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-neutral-400">
                      <Phone className="w-3.5 h-3.5 text-emerald-600" />
                      <span>WA: {prod.no_telepon}</span>
                    </div>
                    {prod.alamat_pemilik && (
                      <div className="flex items-center gap-1.5 text-neutral-400">
                        <MapPin className="w-3.5 h-3.5 text-blue-500" />
                        <span>{prod.alamat_pemilik}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0 flex items-center justify-end gap-2 border-t border-gray-100 mt-4 pt-4">
                <button
                  type="button"
                  onClick={() => openEditModal(prod)}
                  className="px-3.5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-neutral-500 font-bold text-xs flex items-center gap-1"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Ubah</span>
                </button>
                <button
                  type="button"
                  onClick={() => setItemToDelete(prod)}
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

      {/* Modal Tambah / Ubah Produk */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-neutral-500/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-gray-100 my-8">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-xl font-bold text-neutral-500">
                {editingItem ? 'Ubah Data Produk UMKM' : 'Tambah Produk UMKM Baru'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-neutral-300 hover:text-neutral-500">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              {user?.peran === 'admin' && (
                <div>
                  <label className="block text-xs font-bold text-neutral-400 mb-1">Kelompok Kerja (Pokja) *</label>
                  <select required value={selectedPokja} onChange={(e) => setSelectedPokja(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm bg-white focus:border-blue-600 focus:outline-hidden">
                    <option value="1">Pokja I</option>
                    <option value="2">Pokja II</option>
                    <option value="3">Pokja III</option>
                    <option value="4">Pokja IV</option>
                  </select>
                </div>
              )}
              <div>
                <label className="block text-xs font-bold text-neutral-400 mb-1">
                  Nama Produk *
                </label>
                <input
                  type="text"
                  required
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Contoh: Keripik Tempe Sagu Renyah"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-blue-600 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-400 mb-1">
                    Harga (Rupiah) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={harga}
                    onChange={(e) => setHarga(e.target.value)}
                    placeholder="15000"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-blue-600 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-400 mb-1">
                    Satuan Penjualan
                  </label>
                  <input
                    type="text"
                    value={satuan}
                    onChange={(e) => setSatuan(e.target.value)}
                    placeholder="bungkus 250gr / helai / toples"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-blue-600 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Data Pemilik (Mandatory) */}
              <div className="bg-pink-50/70 p-4 rounded-2xl border border-pink-200/80 space-y-3">
                <span className="text-xs font-bold text-pink-700 uppercase block">
                  Identitas Pemilik Produk (Kader UP2K PKK) *
                </span>

                <div>
                  <label className="block text-xs font-bold text-neutral-500 mb-1">
                    Nama Ibu Pemilik / Pengrajin *
                  </label>
                  <input
                    type="text"
                    required
                    value={namaPemilik}
                    onChange={(e) => setNamaPemilik(e.target.value)}
                    placeholder="Contoh: Ibu Siti Aminah (Kader UP2K)"
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 text-sm bg-white focus:border-blue-600 focus:outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-neutral-500 mb-1">
                      Nomor Telepon / WhatsApp Pemilik *
                    </label>
                    <input
                      type="text"
                      required
                      value={noTelepon}
                      onChange={(e) => setNoTelepon(e.target.value)}
                      placeholder="0812-3456-7890"
                      className="w-full px-4 py-2 rounded-xl border border-gray-300 text-sm bg-white focus:border-blue-600 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-500 mb-1">
                      Alamat / RT Domisili
                    </label>
                    <input
                      type="text"
                      value={alamatPemilik}
                      onChange={(e) => setAlamatPemilik(e.target.value)}
                      placeholder="RT 02 / RW 03"
                      className="w-full px-4 py-2 rounded-xl border border-gray-300 text-sm bg-white focus:border-blue-600 focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-400 mb-1">
                  Deskripsi Singkat Produk
                </label>
                <textarea
                  rows={2}
                  value={deskripsi}
                  onChange={(e) => setDeskripsi(e.target.value)}
                  placeholder="Kelebihan produk, bahan baku alami, rasa gurih, dsb..."
                  className="w-full px-4 py-2 rounded-xl border border-gray-300 text-sm focus:border-blue-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-400 mb-1">
                  URL Foto Produk
                </label>
                <input
                  type="text"
                  value={fotoUrl}
                  onChange={(e) => setFotoUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-4 py-2 rounded-xl border border-gray-300 text-xs focus:border-blue-600 focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-gray-300 text-sm font-semibold text-neutral-400 hover:bg-gray-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-sm shadow-xs disabled:opacity-50"
                >
                  {saving ? 'Menyimpan...' : 'Simpan Produk'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 bg-neutral-500/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-gray-100">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-bold text-neutral-500">Hapus Produk Ini?</h3>
              <p className="text-sm text-neutral-400">
                Apakah Anda yakin ingin menghapus produk <strong>"{itemToDelete.nama}"</strong> dari etalase?
              </p>
            </div>
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
                className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold shadow-xs"
              >
                Ya, Hapus Produk
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
