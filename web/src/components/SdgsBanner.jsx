import React from 'react';
import { Sparkles, TrendingUp, Users, ShieldCheck } from 'lucide-react';

export default function SdgsBanner({ compact = false }) {
  if (compact) {
    return (
      <div className="bg-primary-200 border border-blue-200 rounded-2xl p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm flex-shrink-0">
            PKK
          </div>
          <div>
            <h4 className="font-semibold text-neutral-500 text-sm md:text-base">Gerakan Nasional Keluarga Pelopor Perubahan</h4>
            <p className="text-xs text-neutral-400">Pemberdayaan keluarga melalui pembinaan karakter, pendidikan, ekonomi, ketahanan pangan, dan kesehatan.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-primary-500 text-white rounded-3xl p-6 md:p-8 shadow-lg relative overflow-hidden">
      <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
      <div className="relative z-10">
        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs md:text-sm font-semibold mb-4">
          <Sparkles className="w-4 h-4 text-pink-200" />
          Komitmen Bersama Menuju Indonesia Maju
        </div>

        <h2 className="text-2xl md:text-3xl font-extrabold mb-3 tracking-tight">
          Gerakan Nasional Keluarga Pelopor Perubahan
        </h2>
        
        <p className="text-blue-100 text-base md:text-lg max-w-3xl mb-8 leading-relaxed">
          KADAYA (Kapasmadya Berdaya) menjadi wadah terpadu kader dan warga Kelurahan Kapasmadya Baru untuk meningkatkan ketahanan keluarga, mencetak generasi unggul, dan membangun kemandirian ekonomi.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-5 border border-white/10">
            <div className="w-10 h-10 rounded-xl bg-white text-blue-600 flex items-center justify-center font-bold mb-3 shadow-xs">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-lg mb-1">Kepemimpinan Perempuan</h3>
            <p className="text-sm text-blue-100 leading-snug">
              Memperlihatkan peran aktif perempuan dalam struktur PKK, Pokja I sampai IV, serta kader penggerak Posyandu di lingkungan RT/RW.
            </p>
          </div>

          <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-5 border border-white/10">
            <div className="w-10 h-10 rounded-xl bg-white text-pink-600 flex items-center justify-center font-bold mb-3 shadow-xs">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-lg mb-1">Kemandirian Ekonomi UP2K</h3>
            <p className="text-sm text-blue-100 leading-snug">
              Etalase produk UMKM karya anggota PKK menampilkan nama pemilik dan kontak WhatsApp langsung untuk transaksi mandiri warga.
            </p>
          </div>

          <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-5 border border-white/10">
            <div className="w-10 h-10 rounded-xl bg-white text-neutral-700 flex items-center justify-center font-bold mb-3 shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-lg mb-1">Tata Kelola & Digitalisasi</h3>
            <p className="text-sm text-blue-100 leading-snug">
              Dokumentasi terstruktur, transparansi informasi kegiatan, serta kemudahan akses publikasi bagi seluruh pengurus dan warga.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
