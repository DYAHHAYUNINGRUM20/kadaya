import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-neutral-500 text-white pt-14 md:pt-18 pb-12 border-t border-neutral-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 mb-12">
          
          {/* Kolom 1: Profil Brand */}
          <div className="space-y-4 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3">
              <img
                src="/logo-pkk.png"
                alt="Logo PKK"
                className="w-11 h-11 object-contain drop-shadow-sm"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <div className="flex flex-col">
                <span className="font-black text-2xl sm:text-3xl tracking-tight leading-none">KADAYA</span>
                <span className="text-xs sm:text-sm text-neutral-300 font-semibold tracking-wide mt-0.5">Kapasmadya Berdaya</span>
              </div>
            </div>
            <p className="text-sm sm:text-base text-neutral-200 leading-relaxed">
              Platform web terpadu Tim Penggerak PKK Kelurahan Kapasmadya Baru, Surabaya. Membantu publikasi program kerja, dokumentasi kegiatan Pokja, etalase karya UMKM binaan, dan keterbukaan informasi warga.
            </p>
            <div className="inline-flex items-center gap-2 bg-white/10 text-neutral-200 text-xs sm:text-sm px-3.5 py-2 rounded-xl border border-white/10 font-semibold">
              <Sparkles className="w-4 h-4 text-pink-400 flex-shrink-0" />
              <span>Gerakan Keluarga Pelopor Perubahan</span>
            </div>
          </div>

          {/* Kolom 2: Tautan Halaman */}
          <div>
            <h4 className="text-lg font-bold text-white mb-4 tracking-wide pb-1 border-b border-neutral-400/50 inline-block">
              Peta Halaman
            </h4>
            <ul className="space-y-2.5 text-sm sm:text-base text-neutral-200">
              <li><Link to="/" className="hover:text-blue-300 transition-colors">Beranda</Link></li>
              <li><Link to="/profil-pengurus" className="hover:text-blue-300 transition-colors">Profil Tim Penggerak PKK</Link></li>
              <li><Link to="/kegiatan" className="hover:text-blue-300 transition-colors">Arsip Kegiatan Pokja I - IV</Link></li>
              <li><Link to="/produk" className="hover:text-blue-300 transition-colors">Etalase Produk Anggota (UP2K)</Link></li>
              <li><Link to="/jadwal" className="hover:text-blue-300 transition-colors">Jadwal & Agenda Kegiatan</Link></li>
              <li><Link to="/pengumuman" className="hover:text-blue-300 transition-colors">Pengumuman Terkini</Link></li>
              <li><Link to="/statistik" className="hover:text-blue-300 transition-colors">Statistik Capaian Program</Link></li>
              <li><Link to="/kontak" className="hover:text-blue-300 transition-colors">Hubungi Pengurus / Relawan</Link></li>
            </ul>
          </div>

          {/* Kolom 3: Pokja I - IV */}
          <div>
            <h4 className="text-lg font-bold text-white mb-4 tracking-wide pb-1 border-b border-neutral-400/50 inline-block">
              Kelompok Kerja (Pokja)
            </h4>
            <ul className="space-y-3.5 text-sm sm:text-base text-neutral-200">
              <li className="flex items-start gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 mt-2 flex-shrink-0"></span>
                <span><strong className="text-white">Pokja I:</strong> Karakter, PAAR, & Gotong Royong</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-pink-500 mt-2 flex-shrink-0"></span>
                <span><strong className="text-white">Pokja II:</strong> Pendidikan & Ekonomi Keluarga (UP2K)</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-400 mt-2 flex-shrink-0"></span>
                <span><strong className="text-white">Pokja III:</strong> Ketahanan Pangan & AKU HATINYA PKK</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 mt-2 flex-shrink-0"></span>
                <span><strong className="text-white">Pokja IV:</strong> Kesehatan, Lingkungan, & Posyandu</span>
              </li>
            </ul>
          </div>

          {/* Kolom 4: Alamat & Kontak */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h4 className="text-lg font-bold text-white mb-4 tracking-wide pb-1 border-b border-neutral-400/50 inline-block">
              Sekretariat PKK
            </h4>
            <ul className="space-y-3.5 text-sm sm:text-base text-neutral-200">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-pink-400 flex-shrink-0 mt-1" />
                <span className="leading-relaxed">Jl. Kapas Madya II No. 54, Kel. Kapasmadya Baru, Kec. Tambaksari, Kota Surabaya, Jawa Timur 60134</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <span>(031) 5150-1234 / WA: 0896-9964-4162</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-rose-400 flex-shrink-0" />
                <span className="break-all">pkk.kapasmadyabaru@surabaya.go.id</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-neutral-400/60 flex flex-col sm:flex-row items-center justify-between text-xs sm:text-sm text-neutral-300 gap-4 text-center sm:text-left">
          <p>
            &copy; {new Date().getFullYear()} KADAYA &bull; Tim Penggerak PKK Kelurahan Kapasmadya Baru, Kota Surabaya | All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
