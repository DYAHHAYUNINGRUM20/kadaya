import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { 
  BarChart3, Users, Calendar, ShoppingBag, TrendingUp, 
  Sparkles, Award, ShieldCheck, HeartHandshake 
} from 'lucide-react';

export default function Statistik() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getStatistikPublik()
      .then(res => setData(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header */}
      <div className="max-w-3xl space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 text-blue-800 font-bold text-xs md:text-sm">
          <BarChart3 className="w-4 h-4" />
          <span>Indikator Capaian & Transparansi Program PKK</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-neutral-500 tracking-tight">
          Statistik Capaian & Dampak PKK
        </h1>
        <p className="text-base md:text-lg text-neutral-400">
          Data kuantitatif keterlibatan perempuan, dokumentasi kerja Pokja, dan pertumbuhan ekonomi UMKM warga di Kelurahan Kapasmadya Baru, Surabaya.
        </p>
      </div>

      {/* Top 3 Summary Cards */}
      {data?.ringkasan && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Calendar className="w-6 h-6" />
            </div>
            <span className="text-4xl md:text-5xl font-extrabold text-neutral-500 block pt-2">
              {data.ringkasan.total_kegiatan}
            </span>
            <h3 className="font-bold text-neutral-500 text-lg">Total Kegiatan Terdokumentasi</h3>
            <p className="text-xs text-neutral-400">Terdata rapi di seluruh Pokja I sampai IV</p>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center font-bold">
              <Users className="w-6 h-6" />
            </div>
            <span className="text-4xl md:text-5xl font-extrabold text-neutral-500 block pt-2">
              {data.ringkasan.total_peserta}+
            </span>
            <h3 className="font-bold text-neutral-500 text-lg">Total Partisipasi Perempuan & Warga</h3>
            <p className="text-xs text-neutral-400">Ibu-ibu dan kader yang aktif dalam pembinaan</p>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <span className="text-4xl md:text-5xl font-extrabold text-neutral-500 block pt-2">
              {data.ringkasan.total_produk}
            </span>
            <h3 className="font-bold text-neutral-500 text-lg">Produk UMKM Terpromosikan</h3>
            <p className="text-xs text-neutral-400">Karya mandiri yang siap dipesan langsung ke pengrajin</p>
          </div>
        </div>
      )}

      {/* Capaian per Pokja */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200 shadow-xs space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-neutral-500">Capaian Dokumentasi & Produk per Pokja</h2>
          <p className="text-sm text-neutral-400">Persebaran aktivitas dan karya masing-masing kelompok kerja.</p>
        </div>

        {data?.per_pokja && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.per_pokja.map(item => (
              <div
                key={item.pokja_id}
                className="bg-gray-50 rounded-2xl p-6 border border-gray-200 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span
                    className="text-xs font-bold px-3 py-1 rounded-full text-white"
                    style={{ backgroundColor: item.pokja_warna }}
                  >
                    {item.pokja_nama}
                  </span>
                  <span className="text-xs text-neutral-400 font-semibold">{item.pokja_singkatan}</span>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex justify-between items-center text-sm border-b border-gray-200 pb-2">
                    <span className="text-neutral-400">Kegiatan Terbit:</span>
                    <strong className="text-neutral-500 text-base">{item.total_kegiatan}</strong>
                  </div>
                  <div className="flex justify-between items-center text-sm border-b border-gray-200 pb-2">
                    <span className="text-neutral-400">Total Peserta:</span>
                    <strong className="text-blue-600 text-base">{item.total_peserta} org</strong>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-neutral-400">Produk UMKM:</span>
                    <strong className="text-pink-600 text-base">{item.total_produk} item</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Capaian Bulanan */}
      {data?.bulanan && data.bulanan.length > 0 && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-neutral-500">Aktivitas Bulanan (12 Bulan Terakhir)</h2>
              <p className="text-sm text-neutral-400">Tren kegiatan dan keikutsertaan masyarakat.</p>
            </div>
            <TrendingUp className="w-6 h-6 text-blue-600" />
          </div>

          <div className="space-y-3">
            {data.bulanan.map((b, idx) => {
              const maxKegiatan = Math.max(...data.bulanan.map(x => x.jumlah_kegiatan), 1);
              const percentage = Math.round((b.jumlah_kegiatan / maxKegiatan) * 100);
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs sm:text-sm font-semibold text-neutral-500">
                    <span>{b.label_bulan || b.bulan_tahun}</span>
                    <span>{b.jumlah_kegiatan} Kegiatan &bull; {b.total_peserta} Peserta</span>
                  </div>
                  <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary-400 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(percentage, 10)}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SDGs 5 Full Banner removed */}
    </div>
  );
}
