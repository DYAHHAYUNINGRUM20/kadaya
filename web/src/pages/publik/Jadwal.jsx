import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { Calendar, Clock, MapPin, ChevronRight, CheckCircle2 } from 'lucide-react';

export default function Jadwal() {
  const [jadwalList, setJadwalList] = useState([]);
  const [statusFilter, setStatusFilter] = useState('akan_datang');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.getJadwalPublik({ status: statusFilter })
      .then(res => setJadwalList(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [statusFilter]);

  const formatTanggal = (str) => {
    if (!str) return '';
    const d = new Date(str);
    return d.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Header */}
      <div className="max-w-3xl space-y-3">
        <h1 className="text-3xl md:text-5xl font-extrabold text-neutral-500 tracking-tight">
          Jadwal & Agenda Kegiatan PKK
        </h1>
        <p className="text-base md:text-lg text-neutral-400">
          Ikuti agenda pertemuan rutin, Posyandu, pelatihan keterampilan, dan kegiatan gotong royong warga di Kelurahan Kapasmadya Baru.
        </p>
      </div>

      {/* Tabs Filter Status */}
      <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
        <button
          onClick={() => setStatusFilter('akan_datang')}
          className={`px-5 py-2.5 rounded-2xl text-sm font-bold transition-colors ${
            statusFilter === 'akan_datang'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white border border-gray-200 text-neutral-400 hover:bg-gray-100'
          }`}
        >
          Agenda Akan Datang
        </button>
        <button
          onClick={() => setStatusFilter('selesai')}
          className={`px-5 py-2.5 rounded-2xl text-sm font-bold transition-colors ${
            statusFilter === 'selesai'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white border border-gray-200 text-neutral-400 hover:bg-gray-100'
          }`}
        >
          Sudah Terlaksana
        </button>
      </div>

      {/* Grid Jadwal */}
      {loading ? (
        <div className="text-center py-20 text-neutral-400">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent mb-3"></div>
          <p>Memuat jadwal agenda...</p>
        </div>
      ) : jadwalList.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-gray-200 p-8 space-y-2">
          <Calendar className="w-12 h-12 text-neutral-300 mx-auto" />
          <h3 className="text-lg font-bold text-neutral-500">Tidak ada agenda pada kategori ini</h3>
          <p className="text-sm text-neutral-400">Silakan periksa kembali beberapa waktu ke depan.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jadwalList.map(j => (
            <div
              key={j.id}
              className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-5"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className="text-xs font-bold px-3 py-1 rounded-full text-white"
                    style={{ backgroundColor: j.pokja_warna }}
                  >
                    {j.pokja_nama}
                  </span>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                      j.status === 'selesai'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {j.status === 'selesai' ? 'Selesai' : 'Akan Datang'}
                  </span>
                </div>

                <div>
                  <h3 className="font-extrabold text-neutral-500 text-xl leading-snug">
                    {j.judul}
                  </h3>
                  <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                    {j.keterangan || 'Kegiatan pengabdian masyarakat PKK Kapasmadya Baru.'}
                  </p>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-gray-100 text-xs text-neutral-400">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span className="font-medium text-neutral-500">{formatTanggal(j.tanggal)}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span>{j.waktu_mulai || '08:00'} - {j.waktu_selesai || 'Selesai'} WIB</span>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-pink-600 flex-shrink-0" />
                  <span className="truncate">{j.lokasi || 'Balai Kelurahan Kapasmadya Baru'}</span>
                </div>

                {j.kegiatan_id && (
                  <Link
                    to={`/kegiatan/${j.kegiatan_id}`}
                    className="mt-2 w-full py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Lihat Dokumentasi Selesai</span>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
