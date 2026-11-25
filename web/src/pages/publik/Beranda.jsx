import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import SdgsBanner from '../../components/SdgsBanner';
import { 
  Search, ArrowRight, Calendar, MapPin, Users, Sparkles, 
  ShoppingBag, Bell, ChevronRight, HeartHandshake, Eye
} from 'lucide-react';

export default function Beranda() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.getBeranda()
      .then(res => setData(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/kegiatan?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/kegiatan');
    }
  };

  const formatTanggal = (str) => {
    if (!str) return '';
    const d = new Date(str);
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <div className="space-y-10 pb-16">
      
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-primary-200 pt-10 pb-10 md:pt-14 md:pb-12 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto space-y-5">
            
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-blue-100/80 text-blue-800 text-sm font-semibold border border-blue-200 shadow-2xs">
              <Sparkles className="w-4 h-4 text-pink-600" />
              <span>Portal Terpadu PKK Kelurahan Kapasmadya Baru</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-neutral-900 tracking-tight leading-tight">
              Kapasmadya Berdaya: <br />
              <span className="bg-primary-500 bg-clip-text text-transparent">
                Perempuan Maju, Warga Sejahtera
              </span>
            </h1>

            <p className="text-lg md:text-xl text-neutral-600 max-w-2xl mx-auto leading-relaxed">
              Dokumentasi terpusat kegiatan Pokja I sampai IV, etalase karya UMKM binaan anggota, serta jadwal dan pengumuman untuk seluruh masyarakat Kapasmadya Baru.
            </p>

            {/* Quick Search Bar */}
            <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto pt-2">
              <div className="relative flex items-center shadow-lg rounded-2xl overflow-hidden bg-white border-2 border-blue-300 focus-within:border-blue-600 transition-colors">
                <Search className="w-6 h-6 text-neutral-300 ml-4 flex-shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari kegiatan (contoh: Posyandu, Pelatihan Kemasan, PAAR)..."
                  className="w-full py-4 px-4 text-base md:text-lg focus:outline-hidden text-neutral-500 placeholder-neutral-300"
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 md:px-8 py-4 font-semibold text-base flex-shrink-0 flex items-center gap-2 transition-colors"
                >
                  <span>Cari</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </form>

            {/* Pilihan Pokja Cepat */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-2 md:gap-3 text-sm">
              <span className="text-neutral-400 font-medium">Jelajahi Pokja:</span>
              <Link to="/kegiatan?pokja=1" className="px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold border border-blue-200">
                Pokja I
              </Link>
              <Link to="/kegiatan?pokja=2" className="px-3.5 py-1.5 rounded-full bg-pink-50 text-pink-700 hover:bg-pink-100 font-semibold border border-pink-200">
                Pokja II
              </Link>
              <Link to="/kegiatan?pokja=3" className="px-3.5 py-1.5 rounded-full bg-sky-50 text-sky-700 hover:bg-sky-100 font-semibold border border-sky-200">
                Pokja III
              </Link>
              <Link to="/kegiatan?pokja=4" className="px-3.5 py-1.5 rounded-full bg-rose-50 text-rose-700 hover:bg-rose-100 font-semibold border border-rose-200">
                Pokja IV
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* 2. SDGs 5 Section Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SdgsBanner />
      </section>

      {/* 3. Ringkasan Angka Statistik */}
      {data?.statistik && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Calendar className="w-8 h-8" />
              </div>
              <div>
                <span className="text-3xl md:text-4xl font-extrabold text-neutral-800">
                  {data.statistik.total_kegiatan}
                </span>
                <p className="text-base font-semibold text-neutral-600">Kegiatan Terdokumentasi</p>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center font-bold">
                <Users className="w-8 h-8" />
              </div>
              <div>
                <span className="text-3xl md:text-4xl font-extrabold text-neutral-800">
                  {data.statistik.total_peserta}+
                </span>
                <p className="text-base font-semibold text-neutral-600">Partisipasi Warga & Kader</p>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div>
                <span className="text-3xl md:text-4xl font-extrabold text-neutral-800">
                  {data.statistik.total_produk}
                </span>
                <p className="text-base font-semibold text-neutral-600">Produk UMKM Perempuan (UP2K)</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. Pengumuman Aktif */}
      {data?.pengumuman_aktif && data.pengumuman_aktif.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-amber-50 border-2 border-amber-200 rounded-3xl p-6 md:p-8">
            <div className="flex items-center gap-3 text-amber-800 font-bold text-lg mb-4">
              <Bell className="w-6 h-6 text-amber-600" />
              <h3>Pengumuman Penting Warga</h3>
            </div>
            <div className="space-y-4">
              {data.pengumuman_aktif.map(p => (
                <div key={p.id} className="bg-white p-5 rounded-2xl border border-amber-200/60 shadow-2xs">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <h4 className="font-bold text-neutral-500 text-lg">{p.judul}</h4>
                    <span className="text-xs bg-amber-100 text-amber-800 px-3 py-1 rounded-full font-medium">
                      Sampai {formatTanggal(p.tayang_sampai)}
                    </span>
                  </div>
                  <p className="text-neutral-400 text-sm md:text-base leading-relaxed">{p.isi}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. Dokumentasi Kegiatan Terbaru */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-blue-600 font-bold text-sm tracking-wide uppercase mb-1">
              <span>Arsip Pokja</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-neutral-500">
              Dokumentasi Kegiatan Terbaru
            </h2>
          </div>
          <Link
            to="/kegiatan"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-base group"
          >
            <span>Buka Semua Arsip</span>
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {data?.kegiatan_terbaru?.map(keg => (
            <div
              key={keg.id}
              className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-xs hover:shadow-md transition-shadow flex flex-col group"
            >
              <div className="relative h-48 overflow-hidden bg-gray-100">
                <img
                  src={keg.foto_sampul}
                  alt={keg.judul}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span
                  className="absolute top-3 left-3 text-xs font-bold px-3 py-1.5 rounded-full text-white shadow-xs"
                  style={{ backgroundColor: keg.pokja_warna }}
                >
                  {keg.pokja_nama}
                </span>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-neutral-300 font-medium">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{formatTanggal(keg.tanggal)}</span>
                  </div>
                  <h3 className="font-bold text-neutral-500 text-lg leading-snug line-clamp-2">
                    {keg.judul}
                  </h3>
                  <p className="text-sm text-neutral-400 line-clamp-2">
                    {keg.ringkasan || 'Tidak ada ringkasan.'}
                  </p>
                </div>
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-neutral-400">
                  {keg.jumlah_peserta != null && (
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4 text-blue-500" />
                      {keg.jumlah_peserta} Peserta
                    </span>
                  )}
                  <Link
                    to={`/kegiatan/${keg.id}`}
                    className="font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    <span>Detail</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Agenda & Jadwal Terdekat */}
      {data?.jadwal_terdekat && data.jadwal_terdekat.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-primary-200 rounded-3xl p-6 md:p-10 border border-blue-100">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-neutral-500">
                  Agenda & Jadwal Kegiatan Mendatang
                </h2>
                <p className="text-sm text-neutral-400 mt-1">
                  Mari hadir dan berpartisipasi dalam setiap agenda kebaikan warga.
                </p>
              </div>
              <Link
                to="/jadwal"
                className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center gap-1"
              >
                <span>Lihat Seluruh Jadwal</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {data.jadwal_terdekat.map(j => (
                <div key={j.id} className="bg-white rounded-2xl p-6 shadow-2xs border border-blue-100 space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className="text-xs font-bold px-3 py-1 rounded-full text-white"
                      style={{ backgroundColor: j.pokja_warna }}
                    >
                      {j.pokja_nama}
                    </span>
                    <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2.5 py-0.5 rounded-full">
                      Akan Datang
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-neutral-500 text-lg leading-tight mb-2">
                      {j.judul}
                    </h3>
                    <p className="text-xs text-neutral-400">{j.keterangan || 'Kegiatan berkala warga.'}</p>
                  </div>
                  <div className="space-y-1.5 text-xs text-neutral-400 border-t border-gray-100 pt-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-500" />
                      <span>{formatTanggal(j.tanggal)} ({j.waktu_mulai || '08:00'} WIB)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-pink-500" />
                      <span className="truncate">{j.lokasi || 'Balai Kelurahan'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 7. Banner Aksi UMKM Etalase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-secondary-400 text-white rounded-3xl p-8 md:p-12 shadow-lg flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">
              Dukungan Ekonomi Perempuan &bull; Usaha Peningkatan Pendapatan Keluarga (UP2K)
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Etalase Karya & UMKM Binaan PKK Kapasmadya Baru
            </h2>
            <p className="text-pink-100 text-base leading-relaxed">
              Dukung kemandirian usaha ibu-ibu PKK! Lihat aneka keripik tempe sagu, kain ecoprint, sirup telang segar, sambal bajak rumahan, hingga tas anyaman ramah lingkungan. Anda dapat langsung memesan via WhatsApp ke ibu pengrajin pemilik produk.
            </p>
          </div>
          <Link
            to="/produk"
            className="px-8 py-4 rounded-2xl bg-white text-pink-700 hover:bg-pink-50 font-bold text-base md:text-lg shadow-md flex-shrink-0 flex items-center gap-2 transition-transform hover:scale-105"
          >
            <ShoppingBag className="w-5 h-5" />
            <span>Lihat Etalase Produk</span>
          </Link>
        </div>
      </section>

    </div>
  );
}
