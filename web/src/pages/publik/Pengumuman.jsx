import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Bell, Calendar, Sparkles } from 'lucide-react';

export default function Pengumuman() {
  const [pengumuman, setPengumuman] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getPengumumanPublik()
      .then(res => setPengumuman(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const formatTanggal = (str) => {
    if (!str) return '';
    const d = new Date(str);
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 text-amber-800 font-bold text-xs md:text-sm">
          <Bell className="w-4 h-4" />
          <span>Keterbukaan Informasi Publik Warga</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-neutral-500 tracking-tight">
          Papan Pengumuman Warga
        </h1>
        <p className="text-base md:text-lg text-neutral-400">
          Kabar dan instruksi penting terkini seputar pelayanan balita, lansia, bansos, dan kegiatan PKK di Kelurahan Kapasmadya Baru.
        </p>
      </div>

      {/* List Pengumuman */}
      {loading ? (
        <div className="text-center py-20 text-neutral-400">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-amber-600 border-t-transparent mb-3"></div>
          <p>Memuat papan pengumuman...</p>
        </div>
      ) : pengumuman.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-gray-200 p-8 space-y-2">
          <Bell className="w-12 h-12 text-neutral-300 mx-auto" />
          <h3 className="text-lg font-bold text-neutral-500">Belum ada pengumuman aktif saat ini</h3>
          <p className="text-sm text-neutral-400">Pengumuman penting akan ditayangkan di sini.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {pengumuman.map(item => (
            <div
              key={item.id}
              className={`rounded-3xl p-6 sm:p-8 border shadow-xs transition-shadow ${
                item.penting
                  ? 'bg-amber-50/70 border-amber-300'
                  : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2">
                  {item.penting && (
                    <span className="bg-amber-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-2xs">
                      <Sparkles className="w-3 h-3" />
                      Penting
                    </span>
                  )}
                  <span className="text-xs bg-gray-100 text-neutral-400 font-medium px-3 py-1 rounded-full">
                    Tayang s.d {formatTanggal(item.tayang_sampai)}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs text-neutral-400">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Diterbitkan: {formatTanggal(item.tayang_mulai)}</span>
                </div>
              </div>

              <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-500 mb-3">
                {item.judul}
              </h2>

              <p className="text-neutral-400 text-base md:text-lg leading-relaxed whitespace-pre-line">
                {item.isi}
              </p>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
