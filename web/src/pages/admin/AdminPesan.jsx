import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { MessageSquare, Phone, CheckCircle2, Clock, Send, MessageCircle, ShoppingBag } from 'lucide-react';

export default function AdminPesan() {
  const [pesanList, setPesanList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  const fetchPesan = () => {
    setLoading(true);
    const params = statusFilter ? { status: statusFilter } : {};
    api.getAdminPesan(params)
      .then(res => setPesanList(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPesan();
  }, [statusFilter]);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await api.ubahStatusPesan(id, { status: newStatus });
      fetchPesan();
    } catch (err) {
      alert(err.message || 'Gagal mengubah status pesan.');
    }
  };

  const getCleanWa = (contact) => {
    if (!contact) return '';
    let cleaned = contact.replace(/[^0-9]/g, '');
    if (cleaned.startsWith('0')) {
      cleaned = '62' + cleaned.substring(1);
    }
    return cleaned;
  };

  const handleBalasWhatsApp = (item) => {
    const cleanWa = getCleanWa(item.kontak_pengirim);
    if (!cleanWa || cleanWa.length < 8) {
      alert('Kontak pengirim berupa email atau nomor tidak valid untuk WhatsApp. Silakan balas via email.');
      return;
    }
    const text = encodeURIComponent(
      `Halo Ibu/Bpk ${item.nama_pengirim}, kami dari Pengurus PKK Kelurahan Kapasmadya Baru menindaklanjuti pesan Anda terkait "${item.pesan.substring(0, 50)}...".`
    );
    window.open(`https://wa.me/${cleanWa}?text=${text}`, '_blank');
    handleUpdateStatus(item.id, 'dibalas');
  };

  const formatTanggal = (str) => {
    if (!str) return '';
    const d = new Date(str);
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      <div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-neutral-500 tracking-tight">
          Kotak Masuk Pesan Warga
        </h1>
        <p className="text-sm text-neutral-400">
          Kelola pertanyaan, pesanan produk binaan UP2K, serta pendaftaran relawan warga.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 pb-4">
        <button
          onClick={() => setStatusFilter('')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${
            !statusFilter ? 'bg-pink-600 text-white' : 'bg-gray-100 text-neutral-400 hover:bg-gray-200'
          }`}
        >
          Semua Pesan
        </button>
        <button
          onClick={() => setStatusFilter('baru')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${
            statusFilter === 'baru' ? 'bg-pink-600 text-white' : 'bg-pink-50 text-pink-700 hover:bg-pink-100'
          }`}
        >
          Pesan Baru
        </button>
        <button
          onClick={() => setStatusFilter('dibaca')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${
            statusFilter === 'dibaca' ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
          }`}
        >
          Sudah Dibaca
        </button>
        <button
          onClick={() => setStatusFilter('selesai')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${
            statusFilter === 'selesai' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
          }`}
        >
          Selesai Ditindaklanjuti
        </button>
      </div>

      {/* List Pesan */}
      {loading ? (
        <div className="text-center py-20 text-neutral-400">Memuat pesan warga...</div>
      ) : pesanList.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-gray-200 p-8 space-y-2">
          <MessageSquare className="w-12 h-12 text-neutral-300 mx-auto" />
          <h3 className="text-lg font-bold text-neutral-500">Tidak ada pesan pada filter ini</h3>
        </div>
      ) : (
        <div className="space-y-4">
          {pesanList.map(item => (
            <div
              key={item.id}
              className={`rounded-3xl p-6 border shadow-xs transition-all space-y-4 ${
                item.status === 'baru'
                  ? 'bg-pink-50/50 border-pink-200'
                  : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full uppercase ${
                    item.jenis === 'pesanan_produk'
                      ? 'bg-pink-100 text-pink-800'
                      : item.jenis === 'relawan'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-neutral-500'
                  }`}>
                    {item.jenis === 'pesanan_produk' ? 'Pesanan Produk' : item.jenis === 'relawan' ? 'Relawan' : 'Pertanyaan'}
                  </span>

                  <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                    item.status === 'baru'
                      ? 'bg-red-100 text-red-800 font-bold'
                      : item.status === 'selesai'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-gray-100 text-neutral-400'
                  }`}>
                    Status: {item.status}
                  </span>
                </div>

                <span className="text-xs text-neutral-300">{formatTanggal(item.dibuat_pada)}</span>
              </div>

              <div>
                <div className="font-extrabold text-neutral-500 text-lg">
                  {item.nama_pengirim}
                  <span className="text-xs font-normal text-neutral-400 ml-2">({item.kontak_pengirim})</span>
                </div>
                <p className="text-neutral-400 text-sm sm:text-base leading-relaxed mt-2 whitespace-pre-line bg-white/80 p-4 rounded-2xl border border-gray-100">
                  "{item.pesan}"
                </p>
              </div>

              {item.produk_nama && (
                <div className="p-3 bg-white rounded-xl border border-pink-200 text-xs flex items-center gap-2 text-pink-900 font-medium">
                  <ShoppingBag className="w-4 h-4 text-pink-600 flex-shrink-0" />
                  <span>Tertaut Produk: <strong>{item.produk_nama}</strong> (Pemilik: {item.produk_pemilik} - WA: {item.produk_kontak})</span>
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => handleBalasWhatsApp(item)}
                  className="px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Balas via WhatsApp</span>
                </button>

                <div className="flex items-center gap-2">
                  {item.status !== 'selesai' && (
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(item.id, 'selesai')}
                      className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Tandai Selesai</span>
                    </button>
                  )}
                  {item.status === 'baru' && (
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(item.id, 'dibaca')}
                      className="px-3.5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-neutral-500 font-bold text-xs"
                    >
                      Tandai Dibaca
                    </button>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
