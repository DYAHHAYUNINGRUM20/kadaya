import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { 
  Calendar, MapPin, Users, Share2, Copy, Check, ArrowLeft, 
  ExternalLink, Sparkles 
} from 'lucide-react';

export default function DetailKegiatan() {
  const { id } = useParams();
  const [kegiatan, setKegiatan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    api.getKegiatanDetail(id)
      .then(res => setKegiatan(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  const formatTanggal = (str) => {
    if (!str) return '';
    const d = new Date(str);
    return d.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  };

  const handleShareWa = () => {
    const text = encodeURIComponent(`*${kegiatan.judul}*\nDokumentasi kegiatan PKK Kelurahan Kapasmadya Baru (${kegiatan.pokja_nama}).\n\nBaca selengkapnya di: ${window.location.href}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-neutral-400">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent mb-3"></div>
        <p>Memuat dokumentasi kegiatan...</p>
      </div>
    );
  }

  if (!kegiatan) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-neutral-500">Dokumentasi Tidak Ditemukan</h2>
        <p className="text-neutral-400">Dokumentasi ini mungkin telah dihapus atau belum diterbitkan.</p>
        <Link to="/kegiatan" className="inline-flex items-center gap-2 text-blue-600 font-bold">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Arsip Kegiatan
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Back link */}
      <div>
        <Link
          to="/kegiatan"
          className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-400 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Daftar Arsip Kegiatan</span>
        </Link>
      </div>

      {/* Header Info */}
      <header className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className="text-xs font-bold px-3 py-1.5 rounded-full text-white shadow-2xs"
            style={{ backgroundColor: kegiatan.pokja_warna }}
          >
            {kegiatan.pokja_nama} ({kegiatan.pokja_singkatan})
          </span>
          <span className="text-xs bg-gray-100 text-neutral-400 px-3 py-1.5 rounded-full font-medium">
            Dokumentasi Resmi PKK
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-neutral-500 leading-tight">
          {kegiatan.judul}
        </h1>

        <div className="flex flex-wrap items-center gap-6 text-sm text-neutral-400 pt-2 border-b border-gray-100 pb-6">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-600" />
            <span>{formatTanggal(kegiatan.tanggal)}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-pink-600" />
            <span>{kegiatan.lokasi || 'Balai Kelurahan Kapasmadya Baru'}</span>
          </div>
          {kegiatan.jumlah_peserta != null && (
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-600" />
              <span>{kegiatan.jumlah_peserta} Orang Peserta</span>
            </div>
          )}
        </div>
      </header>

      {/* Hero Image */}
      <div className="rounded-3xl overflow-hidden shadow-md max-h-[500px] bg-gray-100 border border-gray-200">
        <img
          src={kegiatan.foto_sampul}
          alt={kegiatan.judul}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Uraian Dokumentasi */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200 shadow-xs space-y-6">
        <h2 className="text-2xl font-bold text-neutral-500">Ringkasan Kegiatan</h2>
        <div className="prose prose-lg text-neutral-400 max-w-none leading-relaxed whitespace-pre-line text-base md:text-lg">
          {kegiatan.ringkasan || 'Tidak ada uraian ringkasan tambahan untuk dokumentasi ini.'}
        </div>

        {kegiatan.tautan_sosmed && (
          <div className="pt-6 border-t border-gray-100">
            <a
              href={kegiatan.tautan_sosmed}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-pink-600 hover:text-pink-700 font-semibold bg-pink-50 px-4 py-2.5 rounded-xl transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Lihat Unggahan Asli di Media Sosial PKK</span>
            </a>
          </div>
        )}
      </div>

      {/* Galeri Foto Kegiatan */}
      {kegiatan.galeri && kegiatan.galeri.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-neutral-500">Galeri Foto Dokumentasi</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {kegiatan.galeri.map(foto => (
              <div key={foto.id} className="rounded-2xl overflow-hidden border border-gray-200 bg-gray-100 shadow-2xs group">
                <img
                  src={foto.url}
                  alt={foto.keterangan || 'Foto kegiatan'}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {foto.keterangan && (
                  <div className="p-3 bg-white text-xs text-neutral-400 font-medium">
                    {foto.keterangan}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bagikan Tombol (Share) */}
      <div className="bg-primary-200 rounded-3xl p-6 md:p-8 border border-blue-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-neutral-500 text-lg">Bagikan Dokumentasi Ini</h3>
          <p className="text-sm text-neutral-400">Sebarkan informasi kegiatan positif PKK kepada warga dan keluarga di WhatsApp.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={handleShareWa}
            className="flex-1 sm:flex-none px-6 py-3 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xs transition-colors"
          >
            <Share2 className="w-4 h-4" />
            <span>Bagikan ke WhatsApp</span>
          </button>
          <button
            onClick={handleCopyLink}
            className="px-4 py-3 rounded-2xl bg-white border border-gray-300 hover:bg-gray-50 text-neutral-500 font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Tersalin!' : 'Salin Tautan'}</span>
          </button>
        </div>
      </div>

    </article>
  );
}
