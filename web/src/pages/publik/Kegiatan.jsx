import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { Search, Calendar, MapPin, Users, Filter, X, ChevronRight, RotateCcw } from 'lucide-react';

export default function Kegiatan() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = useState([]);
  const [meta, setMeta] = useState({ halaman: 1, total: 0, total_halaman: 1 });
  const [loading, setLoading] = useState(true);

  // Filter states
  const qParam = searchParams.get('q') || '';
  const pokjaParam = searchParams.get('pokja') || '';
  const tanggalParam = searchParams.get('tanggal') || '';
  const halamanParam = searchParams.get('halaman') || '1';

  const [qInput, setQInput] = useState(qParam);
  const [selectedPokja, setSelectedPokja] = useState(pokjaParam);
  const [selectedTanggal, setSelectedTanggal] = useState(tanggalParam);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (qParam) params.q = qParam;
    if (pokjaParam) params.pokja = pokjaParam;
    if (tanggalParam) params.tanggal = tanggalParam;
    if (halamanParam) params.halaman = halamanParam;

    api.getKegiatanPublik(params)
      .then(res => {
        setData(res.data);
        setMeta(res.meta);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [qParam, pokjaParam, tanggalParam, halamanParam]);

  const applyFilters = (newQ, newPokja, newTanggal, page = 1) => {
    const nextParams = {};
    if (newQ) nextParams.q = newQ;
    if (newPokja) nextParams.pokja = newPokja;
    if (newTanggal) nextParams.tanggal = newTanggal;
    if (page > 1) nextParams.halaman = page.toString();
    setSearchParams(nextParams);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    applyFilters(qInput, selectedPokja, selectedTanggal, 1);
  };

  const handlePokjaChange = (pokjaId) => {
    setSelectedPokja(pokjaId);
    applyFilters(qInput, pokjaId, selectedTanggal, 1);
  };

  const handleTanggalChange = (e) => {
    const val = e.target.value;
    setSelectedTanggal(val);
    applyFilters(qInput, selectedPokja, val, 1);
  };

  const setTanggalHariIni = () => {
    const today = new Date().toISOString().split('T')[0];
    setSelectedTanggal(today);
    applyFilters(qInput, selectedPokja, today, 1);
  };

  const clearTanggal = () => {
    setSelectedTanggal('');
    applyFilters(qInput, selectedPokja, '', 1);
  };

  const resetAllFilters = () => {
    setQInput('');
    setSelectedPokja('');
    setSelectedTanggal('');
    setSearchParams({});
  };

  const formatTanggal = (str) => {
    if (!str) return '';
    const d = new Date(str);
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Title */}
      <div className="max-w-3xl space-y-3">
        <h1 className="text-3xl md:text-5xl font-extrabold text-neutral-500 tracking-tight">
          Arsip Dokumentasi Kegiatan
        </h1>
        <p className="text-base md:text-lg text-neutral-400">
          Temukan kembali rekaman jejak kegiatan Pokja I sampai IV secara seragam, terstruktur, dan mudah dicari berdasarkan kata kunci, Pokja, atau tanggal kalender.
        </p>
      </div>

      {/* Filter Box */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-200 shadow-sm space-y-6">
        
        {/* Row 1: Search Form */}
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-neutral-300 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={qInput}
              onChange={(e) => setQInput(e.target.value)}
              placeholder="Cari berdasarkan judul, lokasi, atau ringkasan kegiatan..."
              className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-300 text-base focus:border-blue-600 focus:outline-hidden text-neutral-500"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base flex items-center justify-center gap-2 transition-colors flex-shrink-0"
          >
            <span>Cari</span>
          </button>
        </form>

        {/* Row 2: Filter Pokja & Kalender Tanggal */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-4 border-t border-gray-100 items-start">
          
          {/* Pokja Buttons */}
          <div className="lg:col-span-7 space-y-2">
            <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider">
              Filter Kelompok Kerja (Pokja):
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handlePokjaChange('')}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                  !selectedPokja
                    ? 'bg-neutral-500 text-white shadow-xs'
                    : 'bg-gray-100 text-neutral-400 hover:bg-gray-200'
                }`}
              >
                Semua Pokja
              </button>
              <button
                type="button"
                onClick={() => handlePokjaChange('1')}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                  selectedPokja === '1'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                }`}
              >
                Pokja I
              </button>
              <button
                type="button"
                onClick={() => handlePokjaChange('2')}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                  selectedPokja === '2'
                    ? 'bg-pink-600 text-white shadow-xs'
                    : 'bg-pink-50 text-pink-700 hover:bg-pink-100'
                }`}
              >
                Pokja II
              </button>
              <button
                type="button"
                onClick={() => handlePokjaChange('3')}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                  selectedPokja === '3'
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'bg-sky-50 text-sky-700 hover:bg-sky-100'
                }`}
              >
                Pokja III
              </button>
              <button
                type="button"
                onClick={() => handlePokjaChange('4')}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                  selectedPokja === '4'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                }`}
              >
                Pokja IV
              </button>
            </div>
          </div>

          {/* Kalender Tanggal (Sesuai Desain & Readme) */}
          <div className="lg:col-span-5 space-y-2">
            <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider">
              Filter Kalender Tanggal:
            </label>
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="date"
                  lang="id"
                  value={selectedTanggal}
                  onChange={handleTanggalChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-blue-600 focus:outline-hidden text-neutral-500 font-medium"
                />
              </div>
              <button
                type="button"
                onClick={setTanggalHariIni}
                className="px-3.5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-neutral-400 text-xs font-bold whitespace-nowrap transition-colors"
              >
                Hari Ini
              </button>
              {selectedTanggal && (
                <button
                  type="button"
                  onClick={clearTanggal}
                  title="Hapus filter tanggal"
                  className="p-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 text-xs font-bold transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

        </div>

        {/* Active Filter Indicators */}
        {(qParam || pokjaParam || tanggalParam) && (
          <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3 text-sm">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-neutral-400 text-xs font-medium">Filter Aktif:</span>
              {qParam && (
                <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-1 rounded-full font-medium">
                  Kata Kunci: "{qParam}"
                </span>
              )}
              {pokjaParam && (
                <span className="bg-pink-100 text-pink-800 text-xs px-2.5 py-1 rounded-full font-medium">
                  Pokja {pokjaParam}
                </span>
              )}
              {tanggalParam && (
                <span className="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-1 rounded-full font-medium">
                  Tanggal: {formatTanggal(tanggalParam)}
                </span>
              )}
            </div>
            <button
              onClick={resetAllFilters}
              className="text-xs text-red-600 hover:text-red-800 font-bold flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Semua Filter</span>
            </button>
          </div>
        )}

      </div>

      {/* Grid Hasil Kegiatan */}
      {loading ? (
        <div className="text-center py-20 text-neutral-400">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent mb-3"></div>
          <p>Mencari arsip dokumentasi kegiatan...</p>
        </div>
      ) : data.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-gray-200 p-8 space-y-4">
          <div className="w-16 h-16 rounded-full bg-gray-100 text-neutral-300 flex items-center justify-center mx-auto">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-neutral-500">Tidak Ada Dokumentasi yang Cocok</h3>
          <p className="text-neutral-400 text-sm max-w-md mx-auto">
            Coba ganti kata kunci pencarian, pilih Pokja lain, atau bersihkan filter tanggal.
          </p>
          <button
            onClick={resetAllFilters}
            className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700"
          >
            Tampilkan Semua Kegiatan
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="text-sm text-neutral-400 font-medium">
            Ditemukan <strong>{meta.total}</strong> dokumentasi kegiatan:
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.map(keg => (
              <div
                key={keg.id}
                className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-xs hover:shadow-md transition-shadow flex flex-col group"
              >
                <div className="relative h-52 overflow-hidden bg-gray-100">
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
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-neutral-300 font-medium">
                      <Calendar className="w-4 h-4 text-neutral-400" />
                      <span>{formatTanggal(keg.tanggal)}</span>
                    </div>
                    <h3 className="font-bold text-neutral-500 text-xl leading-snug">
                      {keg.judul}
                    </h3>
                    <p className="text-sm text-neutral-400 line-clamp-3">
                      {keg.ringkasan || 'Tidak ada ringkasan.'}
                    </p>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-gray-100 text-xs text-neutral-400">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-pink-500" />
                        <span className="truncate max-w-[150px]">{keg.lokasi || 'Balai Kelurahan'}</span>
                      </span>
                      <span className="flex items-center gap-1 font-semibold text-neutral-500">
                        <Users className="w-4 h-4 text-blue-500" />
                        {keg.jumlah_peserta} Peserta
                      </span>
                    </div>

                    <Link
                      to={`/kegiatan/${keg.id}`}
                      className="w-full py-3 rounded-xl bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-600 font-bold text-sm flex items-center justify-center gap-2 transition-colors"
                    >
                      <span>Lihat Dokumentasi Lengkap</span>
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {meta.total_halaman > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">
              {Array.from({ length: meta.total_halaman }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => applyFilters(qInput, selectedPokja, selectedTanggal, page)}
                  className={`w-11 h-11 rounded-xl text-sm font-bold transition-colors ${
                    meta.halaman === page
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white border border-gray-200 text-neutral-400 hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
