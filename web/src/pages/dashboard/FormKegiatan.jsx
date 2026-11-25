import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { ArrowLeft, Save, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

export default function FormKegiatan() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();

  const [judul, setJudul] = useState('');
  const [tanggal, setTanggal] = useState(new Date().toISOString().split('T')[0]);
  const [pokjaId, setPokjaId] = useState(user?.pokja_id || 1);
  const [ringkasan, setRingkasan] = useState('');
  const [lokasi, setLokasi] = useState('');
  const [jumlahPeserta, setJumlahPeserta] = useState(0);
  const [tautanSosmed, setTautanSosmed] = useState('');
  const [fotoSampul, setFotoSampul] = useState('https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?w=800&q=80');

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [errorMsg, setErrorMsg] = useState('');
  const [suksesMsg, setSuksesMsg] = useState('');

  // Sample photo options for easy selection by mothers
  const samplePhotos = [
    { label: 'Parenting / Pertemuan Warga', url: 'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?w=800&q=80' },
    { label: 'Kerja Bakti Lingkungan', url: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=800&q=80' },
    { label: 'Pelatihan UMKM / Keterampilan', url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80' },
    { label: 'Panen Sayur Hidroponik (Pangan)', url: 'https://images.unsplash.com/photo-1592417817098-8f3d6910cb34?w=800&q=80' },
    { label: 'Posyandu Balita & Lansia', url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&q=80' }
  ];

  useEffect(() => {
    if (isEdit) {
      api.getKegiatanDetail(id)
        .then(res => {
          const k = res.data;
          setJudul(k.judul);
          setTanggal(k.tanggal);
          setPokjaId(k.pokja_id);
          setRingkasan(k.ringkasan || '');
          setLokasi(k.lokasi || '');
          setJumlahPeserta(k.jumlah_peserta || 0);
          setTautanSosmed(k.tautan_sosmed || '');
          setFotoSampul(k.foto_sampul || '');
        })
        .catch(err => setErrorMsg(err.message || 'Gagal memuat detail kegiatan.'))
        .finally(() => setFetching(false));
    } else {
      // Baca draft sessionStorage jika ada
      const savedDraft = sessionStorage.getItem('kadaya_draft_kegiatan');
      if (savedDraft) {
        try {
          const parsed = JSON.parse(savedDraft);
          if (parsed.judul) setJudul(parsed.judul);
          if (parsed.ringkasan) setRingkasan(parsed.ringkasan);
          if (parsed.lokasi) setLokasi(parsed.lokasi);
        } catch (e) {}
      }
    }
  }, [id, isEdit]);

  // Simpan draft berkala ke sessionStorage
  useEffect(() => {
    if (!isEdit && (judul || ringkasan)) {
      sessionStorage.setItem('kadaya_draft_kegiatan', JSON.stringify({ judul, ringkasan, lokasi }));
    }
  }, [judul, ringkasan, lokasi, isEdit]);

  const handleSubmit = async (status = 'terbit') => {
    setErrorMsg('');
    setSuksesMsg('');

    if (!judul.trim() || !tanggal || !pokjaId) {
      setErrorMsg('Tiga kolom wajib diisi: Judul kegiatan, Tanggal, dan Pokja.');
      return;
    }

    setLoading(true);
    const payload = {
      judul: judul.trim(),
      tanggal,
      pokja_id: Number(pokjaId),
      ringkasan,
      lokasi,
      jumlah_peserta: Number(jumlahPeserta),
      tautan_sosmed: tautanSosmed,
      foto_sampul: fotoSampul,
      status
    };

    try {
      if (isEdit) {
        await api.ubahKegiatan(id, payload);
        setSuksesMsg('Dokumentasi berhasil diperbarui.');
      } else {
        await api.buatKegiatan(payload);
        sessionStorage.removeItem('kadaya_draft_kegiatan');
        setSuksesMsg(status === 'draft' ? 'Dokumentasi tersimpan sebagai draf.' : 'Dokumentasi berhasil diterbitkan di website publik.');
      }
      setTimeout(() => {
        if (isAdmin) {
          navigate('/admin/kegiatan');
        } else {
          navigate('/dashboard');
        }
      }, 1500);
    } catch (err) {
      setErrorMsg(err.message || 'Gagal menyimpan dokumentasi.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="text-center py-20 text-neutral-400">Memuat formulir kegiatan...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* Back button */}
      <div>
        <Link
          to={isAdmin ? '/admin/kegiatan' : '/dashboard'}
          className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-400 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Dashboard</span>
        </Link>
      </div>

      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Formulir Catatan Seragam Dokumentasi Pokja</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-neutral-500 tracking-tight">
          {isEdit ? 'Ubah Dokumentasi Kegiatan' : 'Unggah Dokumentasi Kegiatan Baru'}
        </h1>
        <p className="text-sm text-neutral-400">
          Isi 3 kolom wajib di bawah ini. Ringkasan dan foto opsional dapat Anda tambahkan kapan saja.
        </p>
      </div>

      {suksesMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-5 py-4 rounded-2xl flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600" />
          <span className="font-semibold text-sm">{suksesMsg} Mengalihkan kembali ke dashboard...</span>
        </div>
      )}

      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-2xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600" />
          <span className="text-sm">{errorMsg}</span>
        </div>
      )}

      {/* Form Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200 shadow-sm space-y-8">
        
        {/* BAGIAN 1: TIGA ISIAN WAJIB */}
        <div className="space-y-6">
          <div className="border-b border-gray-100 pb-3">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block">Langkah 1</span>
            <h2 className="text-lg font-bold text-neutral-500">3 Kolom Wajib Diisi</h2>
          </div>

          {/* 1. Judul Kegiatan */}
          <div>
            <label className="block text-sm font-bold text-neutral-500 mb-1.5">
              1. Judul Kegiatan *
            </label>
            <input
              type="text"
              required
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
              placeholder="Contoh: Pelatihan Pola Asuh Anak & Remaja (PAAR Cinta)"
              className="w-full px-4 py-3 rounded-2xl border-2 border-gray-300 text-base focus:border-blue-600 focus:outline-hidden text-neutral-500 font-medium"
            />
          </div>

          {/* 2. Tanggal (Kalender Input) & 3. Pokja */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-neutral-500 mb-1.5">
                2. Tanggal Kegiatan (Kalender) *
              </label>
              <input
                type="date"
                required
                lang="id"
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border-2 border-gray-300 text-base focus:border-blue-600 focus:outline-hidden text-neutral-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-neutral-500 mb-1.5">
                3. Kelompok Kerja (Pokja) *
              </label>
              {isAdmin ? (
                <select
                  value={pokjaId}
                  onChange={(e) => setPokjaId(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-gray-300 text-base focus:border-blue-600 focus:outline-hidden text-neutral-500 bg-white"
                >
                  <option value="1">Pokja I - Penghayatan Pancasila & Gotong Royong</option>
                  <option value="2">Pokja II - Pendidikan, Keterampilan & UP2K</option>
                  <option value="3">Pokja III - Ketahanan Pangan (B2SA & Hidroponik)</option>
                  <option value="4">Pokja IV - Kesehatan Posyandu & Lingkungan Hidup</option>
                </select>
              ) : (
                <input
                  type="text"
                  disabled
                  value={`Pokja ${user?.pokja_id || 1} (Terkunci Otomatis untuk Akun Anda)`}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-100 text-base text-neutral-400 font-medium cursor-not-allowed"
                />
              )}
            </div>
          </div>
        </div>

        {/* BAGIAN 2: KOLOM TAMBAHAN (OPSIONAL) */}
        <div className="space-y-6 pt-4 border-t border-gray-100">
          <div className="border-b border-gray-100 pb-3">
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block">Langkah 2</span>
            <h2 className="text-lg font-bold text-neutral-500">Informasi Tambahan (Opsional)</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-neutral-400 mb-1.5">
                Lokasi Pelaksanaan
              </label>
              <input
                type="text"
                value={lokasi}
                onChange={(e) => setLokasi(e.target.value)}
                placeholder="Contoh: Balai RW 03 / Pendopo Kelurahan"
                className="w-full px-4 py-3 rounded-2xl border border-gray-300 text-sm focus:border-blue-600 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-400 mb-1.5">
                Jumlah Partisipasi Peserta (Orang)
              </label>
              <input
                type="number"
                min="0"
                value={jumlahPeserta}
                onChange={(e) => setJumlahPeserta(e.target.value)}
                placeholder="0"
                className="w-full px-4 py-3 rounded-2xl border border-gray-300 text-sm focus:border-blue-600 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-400 mb-1.5">
              Ringkasan Cerita / Catatan Kegiatan
            </label>
            <textarea
              rows={4}
              value={ringkasan}
              onChange={(e) => setRingkasan(e.target.value)}
              placeholder="Ceritakan jalannya kegiatan, narasumber yang hadir, serta antusiasme ibu-ibu warga..."
              className="w-full px-4 py-3 rounded-2xl border border-gray-300 text-sm focus:border-blue-600 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-400 mb-1.5">
              Tautan Unggahan Lama di Media Sosial (Instagram / Facebook)
            </label>
            <input
              type="url"
              value={tautanSosmed}
              onChange={(e) => setTautanSosmed(e.target.value)}
              placeholder="https://instagram.com/p/..."
              className="w-full px-4 py-3 rounded-2xl border border-gray-300 text-sm focus:border-blue-600 focus:outline-hidden"
            />
          </div>

          {/* Foto Sampul */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-neutral-400">
              Foto Sampul Dokumentasi (Pilih Sampel Cepat atau Masukkan URL Foto)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {samplePhotos.map((samp, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setFotoSampul(samp.url)}
                  className={`p-2 rounded-xl border text-left text-xs transition-all ${
                    fotoSampul === samp.url
                      ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-600'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <img src={samp.url} alt={samp.label} className="w-full h-16 object-cover rounded-lg mb-1" />
                  <span className="line-clamp-1 font-medium">{samp.label}</span>
                </button>
              ))}
            </div>

            <input
              type="text"
              value={fotoSampul}
              onChange={(e) => setFotoSampul(e.target.value)}
              placeholder="Atau tempelkan URL foto lain di sini..."
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-xs focus:border-blue-600 focus:outline-hidden"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-end gap-3">
          <button
            type="button"
            disabled={loading}
            onClick={() => handleSubmit('draft')}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl border-2 border-gray-300 hover:bg-gray-100 font-bold text-neutral-400 text-sm transition-colors"
          >
            Simpan Sebagai Draf
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={() => handleSubmit('terbit')}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-base shadow-md flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            <span>{loading ? 'Menyimpan...' : 'Simpan & Terbitkan Dokumentasi'}</span>
          </button>
        </div>

      </div>

    </div>
  );
}
