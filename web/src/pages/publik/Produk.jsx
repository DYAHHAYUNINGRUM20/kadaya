import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { 
  ShoppingBag, Phone, User, MapPin, Tag, Search, Filter, 
  MessageCircle, ExternalLink, Sparkles, HeartHandshake, Info, CheckCircle 
} from 'lucide-react';

export default function Produk() {
  const [produkList, setProdukList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPokja, setSelectedPokja] = useState('');
  const [search, setSearch] = useState('');
  const [selectedProductForModal, setSelectedProductForModal] = useState(null);

  // Form pesan modal state
  const [namaPengirim, setNamaPengirim] = useState('');
  const [kontakPengirim, setKontakPengirim] = useState('');
  const [pesan, setPesan] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [pesanTerkirim, setPesanTerkirim] = useState(false);

  const fetchProduk = () => {
    setLoading(true);
    const params = {};
    if (selectedPokja) params.pokja = selectedPokja;
    if (search) params.search = search;

    api.getProdukPublik(params)
      .then(res => setProdukList(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProduk();
  }, [selectedPokja]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProduk();
  };

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(number);
  };

  // Bersihkan format nomor telepon untuk wa.me link
  const getCleanWaNumber = (phone) => {
    if (!phone) return '';
    let cleaned = phone.replace(/[^0-9]/g, '');
    if (cleaned.startsWith('0')) {
      cleaned = '62' + cleaned.substring(1);
    }
    return cleaned;
  };

  // Buka WhatsApp langsung dengan template pesan otomatis
  const handleHubungiWa = (prod) => {
    const cleanWa = getCleanWaNumber(prod.no_telepon);
    const text = encodeURIComponent(
      `Halo Ibu ${prod.nama_pemilik}, saya tertarik dengan produk "${prod.nama}" yang saya lihat di etalase website KADAYA PKK Kelurahan Kapasmadya Baru. Apakah produk ini masih tersedia untuk saya pesan? Terima kasih.`
    );
    window.open(`https://wa.me/${cleanWa}?text=${text}`, '_blank');
  };

  // Buka modal form kontak alternatif
  const openModalPesan = (prod) => {
    setSelectedProductForModal(prod);
    setPesan(`Halo pengurus PKK, saya ingin menanyakan pemesanan produk "${prod.nama}" milik Ibu ${prod.nama_pemilik}. Mohon bantuannya.`);
    setPesanTerkirim(false);
  };

  const handleKirimPesan = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.kirimPesanKontak({
        nama_pengirim: namaPengirim,
        kontak_pengirim: kontakPengirim,
        jenis: 'pesanan_produk',
        produk_id: selectedProductForModal?.id,
        pesan: pesan
      });
      setPesanTerkirim(true);
      setNamaPengirim('');
      setKontakPengirim('');
      setTimeout(() => {
        setSelectedProductForModal(null);
        setPesanTerkirim(false);
      }, 2500);
    } catch (err) {
      alert(err.message || 'Gagal mengirim pesan.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* 1. Header & SDGs 5 Badge */}
      <div className="max-w-3xl space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-100 text-pink-700 font-bold text-xs md:text-sm">
          <Sparkles className="w-4 h-4" />
          <span>Pemberdayaan Ekonomi & Kemandirian Perempuan PKK (UP2K)</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-neutral-500 tracking-tight">
          Etalase Karya & UMKM Anggota
        </h1>
        <p className="text-base md:text-lg text-neutral-400">
          Pameran produk buatan tangan dan olahan pangan sehat karya ibu-ibu anggota PKK dan kader UP2K Kelurahan Kapasmadya Baru, Surabaya.
        </p>
      </div>

      {/* 2. Banner Pemberitahuan Jual Beli di Luar Platform (Sesuai Rancangan User) */}
      <div className="bg-primary-200 border-2 border-pink-200 rounded-3xl p-6 md:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center gap-5">
        <div className="w-14 h-14 rounded-2xl bg-pink-600 text-white flex items-center justify-center font-bold flex-shrink-0 shadow-md">
          <Info className="w-7 h-7" />
        </div>
        <div className="space-y-1.5 flex-1">
          <h2 className="text-lg md:text-xl font-bold text-neutral-500">
            Jual Beli Dilakukan Langsung di Luar Platform (Non-Transaksi)
          </h2>
          <p className="text-sm md:text-base text-neutral-400 leading-relaxed">
            Platform web <strong>KADAYA</strong> berfungsi murni sebagai <em>media etalase dan promosi digital</em> untuk mendukung kemandirian ekonomi perempuan PKK. Transaksi pemesanan, pembayaran, dan pengiriman barang dilakukan <strong>langsung dengan ibu pemilik produk</strong> melalui WhatsApp atau telepon yang tertera pada setiap kartu produk.
          </p>
        </div>
      </div>

      {/* 3. Search & Filter Pokja Bar */}
      <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          
          {/* Filter Pokja */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <span className="text-xs font-bold text-neutral-400 uppercase mr-1">Filter Pokja:</span>
            <button
              onClick={() => setSelectedPokja('')}
              className={`px-4 py-2 rounded-xl text-xs md:text-sm font-semibold transition-colors ${
                !selectedPokja ? 'bg-neutral-500 text-white' : 'bg-gray-100 text-neutral-400 hover:bg-gray-200'
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setSelectedPokja('2')}
              className={`px-4 py-2 rounded-xl text-xs md:text-sm font-semibold transition-colors ${
                selectedPokja === '2' ? 'bg-pink-600 text-white' : 'bg-pink-50 text-pink-700 hover:bg-pink-100'
              }`}
            >
              Pokja II (UP2K)
            </button>
            <button
              onClick={() => setSelectedPokja('3')}
              className={`px-4 py-2 rounded-xl text-xs md:text-sm font-semibold transition-colors ${
                selectedPokja === '3' ? 'bg-sky-600 text-white' : 'bg-sky-50 text-sky-700 hover:bg-sky-100'
              }`}
            >
              Pokja III (Pangan B2SA)
            </button>
            <button
              onClick={() => setSelectedPokja('4')}
              className={`px-4 py-2 rounded-xl text-xs md:text-sm font-semibold transition-colors ${
                selectedPokja === '4' ? 'bg-rose-600 text-white' : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
              }`}
            >
              Pokja IV (Herbal)
            </button>
          </div>

          {/* Search box */}
          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-neutral-300 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari produk / nama pengrajin..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-blue-600 focus:outline-hidden"
            />
          </form>

        </div>
      </div>

      {/* 4. Grid Kartu Produk */}
      {loading ? (
        <div className="text-center py-20 text-neutral-400">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-pink-600 border-t-transparent mb-3"></div>
          <p>Memuat etalase produk anggota PKK...</p>
        </div>
      ) : produkList.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-gray-200 p-8 space-y-4">
          <div className="w-16 h-16 rounded-full bg-gray-100 text-neutral-300 flex items-center justify-center mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-neutral-500">Tidak Ada Produk yang Ditemukan</h3>
          <p className="text-neutral-400 text-sm max-w-md mx-auto">
            Coba ganti kata kunci pencarian atau pilih kategori Pokja lainnya.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {produkList.map(prod => (
            <div
              key={prod.id}
              className="bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-lg transition-all flex flex-col group"
            >
              {/* Product Image */}
              <div className="relative h-60 bg-gray-100 overflow-hidden">
                <img
                  src={prod.foto_url}
                  alt={prod.nama}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span
                  className="absolute top-3 left-3 text-xs font-bold px-3 py-1.5 rounded-full text-white shadow-xs"
                  style={{ backgroundColor: prod.pokja_warna }}
                >
                  {prod.pokja_nama}
                </span>
                <span className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md text-neutral-500 font-extrabold text-base px-3.5 py-1.5 rounded-xl shadow-md border border-gray-200">
                  {formatRupiah(prod.harga)}
                  <span className="text-xs font-normal text-neutral-400"> /{prod.satuan}</span>
                </span>
              </div>

              {/* Product Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                <div className="space-y-2">
                  <h3 className="font-extrabold text-neutral-500 text-xl leading-snug">
                    {prod.nama}
                  </h3>
                  <p className="text-neutral-400 text-sm line-clamp-3 leading-relaxed">
                    {prod.deskripsi || 'Produk unggulan anggota PKK Kelurahan Kapasmadya Baru.'}
                  </p>
                </div>

                {/* Box Khusus Informasi Pemilik Produk & Kontak WhatsApp (Sesuai Permintaan User) */}
                <div className="bg-pink-50/70 rounded-2xl p-4 border border-pink-200/80 space-y-2 text-xs md:text-sm">
                  <div className="flex items-center gap-2 text-neutral-500 font-bold">
                    <User className="w-4 h-4 text-pink-600 flex-shrink-0" />
                    <span>Pemilik: {prod.nama_pemilik}</span>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-500 font-semibold">
                    <Phone className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>No. WhatsApp: {prod.no_telepon}</span>
                  </div>
                  {prod.alamat_pemilik && (
                    <div className="flex items-center gap-2 text-neutral-400">
                      <MapPin className="w-4 h-4 text-blue-500 flex-shrink-0" />
                      <span>{prod.alamat_pemilik}</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="space-y-2 pt-2">
                  <button
                    onClick={() => handleHubungiWa(prod)}
                    className="w-full py-3.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-sm md:text-base flex items-center justify-center gap-2 shadow-xs transition-colors"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>Pesan via WhatsApp</span>
                  </button>

                  <button
                    onClick={() => openModalPesan(prod)}
                    className="w-full py-2.5 px-4 rounded-xl border border-gray-300 hover:bg-gray-50 text-neutral-400 font-semibold text-xs md:text-sm flex items-center justify-center gap-2 transition-colors"
                  >
                    <span>Tanya Produk Ini</span>
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Tanya Produk via Form Pesan */}
      {selectedProductForModal && (
        <div className="fixed inset-0 z-50 bg-neutral-500/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-gray-100">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-pink-600 uppercase">Tanya Produk</span>
                <h3 className="text-xl font-bold text-neutral-500 mt-1">
                  {selectedProductForModal.nama}
                </h3>
                <p className="text-xs text-neutral-400">
                  Karya: {selectedProductForModal.nama_pemilik} ({selectedProductForModal.no_telepon})
                </p>
              </div>
              <button
                onClick={() => setSelectedProductForModal(null)}
                className="text-neutral-300 hover:text-neutral-500 font-bold text-xl"
              >
                &times;
              </button>
            </div>

            {pesanTerkirim ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-2">
                <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-emerald-800 text-lg">Pesan Berhasil Dikirim!</h4>
                <p className="text-xs text-emerald-700">
                  Pengurus PKK akan segera meneruskan pertanyaan Anda kepada ibu pemilik produk.
                </p>
              </div>
            ) : (
              <form onSubmit={handleKirimPesan} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-400 mb-1">
                    Nama Anda *
                  </label>
                  <input
                    type="text"
                    required
                    value={namaPengirim}
                    onChange={(e) => setNamaPengirim(e.target.value)}
                    placeholder="Contoh: Ibu Rina / Bpk. Fajar"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-blue-600 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-400 mb-1">
                    Nomor WhatsApp / Kontak Anda *
                  </label>
                  <input
                    type="text"
                    required
                    value={kontakPengirim}
                    onChange={(e) => setKontakPengirim(e.target.value)}
                    placeholder="Contoh: 0812-3456-7890"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-blue-600 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-400 mb-1">
                    Pesan / Pertanyaan Anda *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={pesan}
                    onChange={(e) => setPesan(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-blue-600 focus:outline-hidden"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedProductForModal(null)}
                    className="px-5 py-2.5 rounded-xl border border-gray-300 text-sm font-semibold text-neutral-400 hover:bg-gray-100"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-xs disabled:opacity-50"
                  >
                    {submitting ? 'Mengirim...' : 'Kirim Pesan'}
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
