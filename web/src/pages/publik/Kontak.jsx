import React, { useState } from 'react';
import { api } from '../../services/api';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, MessageSquare, HeartHandshake } from 'lucide-react';

export default function Kontak() {
  const [formData, setFormData] = useState({
    nama_pengirim: '',
    kontak_pengirim: '',
    jenis: 'pertanyaan',
    pesan: '',
    website_url: '' // honeypot
  });
  const [submitting, setSubmitting] = useState(false);
  const [sukses, setSukses] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');
    try {
      await api.kirimPesanKontak(formData);
      setSukses(true);
      setFormData({
        nama_pengirim: '',
        kontak_pengirim: '',
        jenis: 'pertanyaan',
        pesan: '',
        website_url: ''
      });
    } catch (err) {
      setErrorMsg(err.message || 'Gagal mengirim pesan.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header */}
      <div className="max-w-3xl space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-100 text-pink-700 font-bold text-xs md:text-sm">
          <MessageSquare className="w-4 h-4" />
          <span>Layanan Informasi & Aspirasi Warga</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-neutral-500 tracking-tight">
          Hubungi Pengurus PKK
        </h1>
        <p className="text-base md:text-lg text-neutral-400">
          Punya pertanyaan seputar kegiatan, ingin memesan produk karya anggota, atau bersemangat menjadi relawan muda? Kirimkan pesan Anda kepada pengurus.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Info Alamat & Kontak (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs space-y-6">
            <h2 className="text-xl font-bold text-neutral-500">Sekretariat TP PKK</h2>

            <div className="space-y-5 text-sm text-neutral-400">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-neutral-500">Alamat Kantor</h4>
                  <p className="mt-0.5 leading-relaxed">
                    Jl. Kapas Madya II No. 54, Kel. Kapasmadya Baru, Kec. Tambaksari, Kota Surabaya, Jawa Timur 60134
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-neutral-500">Telepon / WhatsApp</h4>
                  <p className="mt-0.5">0896-9964-4162 (Sekretariat)</p>
                  <a
                    href="https://wa.me/6289699644162?text=Halo%20Pengurus%20PKK%20Kapasmadya%20Baru"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-1 text-xs font-bold text-emerald-600 hover:underline"
                  >
                    Chat langsung ke WhatsApp PKK &rarr;
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-neutral-500">Surat Elektronik (Email)</h4>
                  <p className="mt-0.5">pkk.kapasmadyabaru@surabaya.go.id</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-neutral-500">Jam Layanan Kantor</h4>
                  <p className="mt-0.5">Senin - Jumat: 08.00 - 15.30 WIB</p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-xs text-blue-900 leading-relaxed">
              <strong>Catatan untuk Calon Pembeli Produk:</strong> Transaksi jual beli produk dilakukan langsung dengan ibu pemilik produk. Form kontak ini dapat digunakan jika Anda ingin meminta bantuan pengurus untuk menghubungi pembuat karya.
            </div>
          </div>
        </div>

        {/* Form Kontak (7 cols) */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200 shadow-sm space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-neutral-500">Formulir Pesan & Aspirasi</h2>
              <p className="text-sm text-neutral-400">Pesan Anda akan masuk ke kotak masuk admin kelurahan dan diteruskan ke Pokja terkait.</p>
            </div>

            {sukses && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h3 className="font-bold text-emerald-800 text-lg">Pesan Anda Berhasil Terkirim!</h3>
                <p className="text-sm text-emerald-700">
                  Terima kasih atas partisipasi dan kepedulian Anda. Pengurus PKK Kelurahan Kapasmadya Baru akan segera menindaklanjuti pesan ini.
                </p>
                <button
                  type="button"
                  onClick={() => setSukses(false)}
                  className="mt-3 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
                >
                  Kirim Pesan Lainnya
                </button>
              </div>
            )}

            {errorMsg && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-sm">
                {errorMsg}
              </div>
            )}

            {!sukses && (
              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Honeypot field (hidden from real users) */}
                <input
                  type="text"
                  name="website_url"
                  value={formData.website_url}
                  onChange={handleChange}
                  tabIndex="-1"
                  autoComplete="off"
                  className="hidden"
                />

                <div>
                  <label className="block text-sm font-bold text-neutral-400 mb-1.5">
                    Nama Lengkap Anda *
                  </label>
                  <input
                    type="text"
                    name="nama_pengirim"
                    required
                    value={formData.nama_pengirim}
                    onChange={handleChange}
                    placeholder="Contoh: Ibu Tri Wahyuni / Bpk. Rudi"
                    className="w-full px-4 py-3 rounded-2xl border border-gray-300 text-base focus:border-blue-600 focus:outline-hidden text-neutral-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-neutral-400 mb-1.5">
                    Nomor WhatsApp atau Email Aktif *
                  </label>
                  <input
                    type="text"
                    name="kontak_pengirim"
                    required
                    value={formData.kontak_pengirim}
                    onChange={handleChange}
                    placeholder="Contoh: 0812-9876-5432"
                    className="w-full px-4 py-3 rounded-2xl border border-gray-300 text-base focus:border-blue-600 focus:outline-hidden text-neutral-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-neutral-400 mb-1.5">
                    Kategori Keperluan Pesan *
                  </label>
                  <select
                    name="jenis"
                    value={formData.jenis}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-300 text-base focus:border-blue-600 focus:outline-hidden text-neutral-500 bg-white"
                  >
                    <option value="pertanyaan">Pertanyaan Umum Seputar PKK</option>
                    <option value="pesanan_produk">Pertanyaan / Pesanan Produk UMKM</option>
                    <option value="relawan">Ingin Bergabung Sebagai Relawan</option>
                    <option value="lainnya">Lainnya</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-neutral-400 mb-1.5">
                    Isi Pesan / Pertanyaan / Aspirasi *
                  </label>
                  <textarea
                    name="pesan"
                    rows={4}
                    required
                    value={formData.pesan}
                    onChange={handleChange}
                    placeholder="Tuliskan pesan Anda secara jelas dan santun..."
                    className="w-full px-4 py-3 rounded-2xl border border-gray-300 text-base focus:border-blue-600 focus:outline-hidden text-neutral-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-base shadow-md flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                  <Send className="w-5 h-5" />
                  <span>{submitting ? 'Sedang Mengirim Pesan...' : 'Kirim Pesan Sekarang'}</span>
                </button>

              </form>
            )}

          </div>
        </div>

      </div>

    </div>
  );
}
