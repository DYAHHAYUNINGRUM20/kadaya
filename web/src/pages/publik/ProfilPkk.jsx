import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { 
  Users, BookOpen, Target, Compass, Briefcase, FileText, 
  ChevronDown, ChevronUp, ChevronRight, Search, 
  ShieldCheck, Heart, Sparkles, Scale, Award, 
  List, LayoutGrid
} from 'lucide-react';

export default function ProfilPkk() {
  const [activeTab, setActiveTab] = useState('anggota'); // anggota, peraturan, visi-misi, asas, tujuan, program-kerja
  const [pengurus, setPengurus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchMember, setSearchMember] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'cards'
  const [openAccordion, setOpenAccordion] = useState(3); // index 0-3 for program kerja

  useEffect(() => {
    api.getProfilPengurus()
      .then(res => setPengurus(res.data || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  // Factual members data based on official Kelurahan Kapasmadya Baru
  const dataAnggotaResmi = [
    { no: 1, jabatan: 'Ketua PKK', nama: 'WORO RENIE TRISYANTI', alamat: 'MEDOKAN ASRI UTARA II BLOK G NO.20D -', kategori: 'Pimpinan' },
    { no: 2, jabatan: 'Wakil PKK', nama: 'SITI KHADIJAH', alamat: 'KAPAS BARU 7/26', kategori: 'Pimpinan' },
    { no: 3, jabatan: 'Sekretaris PKK', nama: 'YULIANA MARTI WAHYUDI', alamat: 'KAPAS LOR WETAN 3/8', kategori: 'Sekretariat' },
    { no: 4, jabatan: 'Sekretaris PKK', nama: 'HILWA JAUDAH', alamat: 'KAPAS BARU 11/6', kategori: 'Sekretariat' },
    { no: 5, jabatan: 'Bendahara PKK', nama: 'YULI YUSWANDARI, SE', alamat: 'KARANGGAYAM NO.25', kategori: 'Keuangan' },
    { no: 6, jabatan: 'Ketua Pokja I', nama: 'DRA. HJ. SRI WAHYUNI', alamat: 'KAPAS BARU 4/12', kategori: 'Pokja I' },
    { no: 7, jabatan: 'Ketua Pokja II', nama: 'TRI ASTUTI, S.PD', alamat: 'KAPAS MADYA II/54', kategori: 'Pokja II' },
    { no: 8, jabatan: 'Ketua Pokja III', nama: 'NURUL AINI', alamat: 'KAPAS MADYA 3B/18', kategori: 'Pokja III' },
    { no: 9, jabatan: 'Ketua Pokja IV', nama: 'BIDAN DEWI LESTARI, AMD.KEB', alamat: 'KAPAS MADYA BARU IV/21', kategori: 'Pokja IV' },
    { no: 10, jabatan: 'Anggota Pokja I', nama: 'SITI AMINAH', alamat: 'KAPAS BARU 8/15', kategori: 'Pokja I' },
    { no: 11, jabatan: 'Anggota Pokja II', nama: 'RATNA DEWI', alamat: 'KAPAS LOR 2/30', kategori: 'Pokja II' },
    { no: 12, jabatan: 'Anggota Pokja III', nama: 'SRI MULYANI', alamat: 'KAPAS MADYA 1/10', kategori: 'Pokja III' },
    { no: 13, jabatan: 'Anggota Pokja IV', nama: 'WARSINI', alamat: 'KAPAS BARU 9/4', kategori: 'Pokja IV' },
  ];

  // Filtered members for Table search
  const filteredMembers = dataAnggotaResmi.filter(m => 
    m.nama.toLowerCase().includes(searchMember.toLowerCase()) ||
    m.jabatan.toLowerCase().includes(searchMember.toLowerCase()) ||
    m.alamat.toLowerCase().includes(searchMember.toLowerCase())
  );

  const totalPages = Math.ceil(filteredMembers.length / entriesPerPage);
  const displayedMembers = filteredMembers.slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage);

  // Tab definitions matching kelurahan portal
  const menuTabs = [
    { id: 'anggota', label: 'Anggota PKK Kelurahan', icon: Users },
    { id: 'peraturan', label: 'Peraturan dan Panduan Umum', icon: FileText },
    { id: 'visi-misi', label: 'Visi dan Misi', icon: Target },
    { id: 'asas', label: 'Asas-Asas Gerakan PKK', icon: Scale },
    { id: 'tujuan', label: 'Tujuan dan Sasaran', icon: Compass },
    { id: 'program-kerja', label: 'Program Kerja Pokja', icon: Briefcase },
  ];

  // Factual Program Kerja data
  const programKerjaList = [
    {
      title: '1. Pembinaan Karakter Keluarga',
      pokja: 'Pokja I',
      unggulan: 'Pola Asuh Anak dan Remaja di Era Digital (PAAREDI)',
      color: '#2563EB',
      items: [
        'Keluarga Indonesia Sejahtera dan Harmonis (KISAH).',
        'Keluarga Indonesia Sehat Tanpa Narkoba (KRISAN).',
        'Keluarga Indonesia Sadar Administrasi Kependudukan (KISAK).',
        'Keluarga Indonesia Anti Trafficking (KIAT).',
        'Keluarga Indonesia Lindungi Anak dari Kekerasan Seksual (KILAS).',
        'Pembinaan Kesadaran Bela Negara (PKBN).'
      ]
    },
    {
      title: '2. Pendidikan & Peningkatan Ekonomi Keluarga',
      pokja: 'Pokja II',
      unggulan: 'Gerakan Keluarga Indonesia dalam Peningkatan Kualitas Pendidikan dan Pengolahan Ekonomi.',
      color: '#DB2777',
      items: [
        'Gerakan/ Kampanye Wajib Membaca dengan memanfaatkan Taman Bacaan Masyarakat/ Perpustakaan Desa/ Kelurahan.',
        'Tambahan Ekstra Kurikuler/Integrasi dalam Kurikulum/ Mata Pelajaran Anak Usia Sekolah dengan materi Materi Keluarga Berkualitas Menjadi Alternatif.',
        'Penguatan Ekonomi Keluarga Melalui Pemanfaatan Potensi Sumber Daya yang dimiliki.',
        'Pengembangan Usaha Peningkatan Pendapatan Keluarga (UP2PK).',
        'Pembentukan/ Pengembangan Toko PKK.'
      ]
    },
    {
      title: '3. Penguatan Ketahanan Keluarga',
      pokja: 'Pokja III',
      unggulan: 'Gerakan Amalkan dan Kukuhkan Halaman Asri, Teratur, Indah dan Nyaman (AKU HATINYA) PKK mendukung penanggulangan Covid-19 dan Penurunan Angka Stunting.',
      color: '#0284C7',
      items: [
        'Pengembangan Kampung AKU HATINYA PKK Berciri Khas Daerah dengan Tanaman Unggulan Bernilai Ekonomi Tinggi.',
        'Kampanye dan Memasyarakatkan Program Diversifikasi Pangan dan Pemanfaatan Pangan Lokal sebagai Upaya Mengurangi Angka Stunting.',
        'Kampanye aku cinta produk Indonesia (dalam rangka pengembangan kain dan pakaian khas daerah).',
        'Mendorong Pengembangan Rumah Sehat Layak Huni dan Tata Laksana Rumah Tangga.'
      ]
    },
    {
      title: '4. Kesehatan Keluarga dan Lingkungan',
      pokja: 'Pokja IV',
      unggulan: 'Keluarga Sehat Tanggap & Tangguh Bencana.',
      color: '#E11D48',
      items: [
        'Peningkatan kesadaran gizi keluarga untuk pencegahan dan penurunan angka stunting.',
        'Peningkatan Kesehatan masyarakat desa atau kelurahan dengan perubahan perilaku hidup bersih dan sehat (PHBS) keluarga.',
        'Pencegahan dan penurunan angka kematian ibu, bayi, dan balita.',
        'Mewujudkan keluarga yang tanggap dan Tangguh terhadap bencana rumah tangga.',
        'Mewujudkan Desa/Kelurahan yang tanggap dan Tangguh dalam tata laksanaan penanganan darurat bencana alam.',
        'Meningkatkan komitmen masyarakat guna menjaga kelestarian lingkungan hidup untuk mewujudkan Desa/Kelurahan yang aman, nyaman, bersih dan sehat.',
        'Peningkatan Keluarga Berencana menuju Keluarga yang sehat dan berkualitas.',
        'Keluarga yang tangguh dalam perencanaan keuangan sehat.',
        'Peningkatan Kesehatan pasangan usia subur (PUS).'
      ]
    }
  ];

  return (
    <div className="min-h-screen pb-24">
      
      {/* 1. Header Banner Kelurahan Kapasmadya Baru */}
      <section className="bg-primary-500 text-white pt-14 pb-20 px-4 sm:px-6 lg:px-8 shadow-sm">
        <div className="max-w-7xl mx-auto text-center space-y-4">
          <div className="inline-block px-5 py-1.5 rounded-full bg-amber-400 text-neutral-900 font-extrabold text-xs sm:text-sm tracking-wider uppercase shadow-xs">
            PKK
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight">
            Kelurahan Kapasmadya Baru Surabaya
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Temukan data kemasyarakatan lengkap Kelurahan Kapasmadya Baru Surabaya! Data LPMK, hingga RT RW, semua informasi disajikan secara jelas dan mudah diakses.
          </p>
        </div>
      </section>

      {/* 2. Sub-Heading Profil PKK */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-md border border-gray-100 text-center max-w-4xl mx-auto space-y-3">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-neutral-800 tracking-tight">
            Pemberdayaan dan Kesejahteraan Keluarga (PKK)
          </h2>
          <p className="text-base sm:text-lg text-neutral-600 leading-relaxed max-w-3xl mx-auto">
            Bergerak bersama Pemberdayaan dan Kesejahteraan Keluarga (PKK) Kelurahan kami! Program ini hadir untuk memberdayakan keluarga, meningkatkan kesejahteraan, dan menciptakan lingkungan yang lebih sehat, harmonis, dan mandiri.
          </p>
        </div>
      </div>

      {/* 3. Main Two-Column Layout (Sidebar Menu & Right Content) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        
        {/* Mobile Navigation Selector (Android Friendly Horizontal Scroll) */}
        <div className="lg:hidden mb-6">
          <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
            {menuTabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setCurrentPage(1);
                  }}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-bold whitespace-nowrap transition-all shadow-xs flex-shrink-0 ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-blue-200'
                      : 'bg-white text-neutral-600 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Sidebar Menu (Desktop) */}
          <aside className="hidden lg:block lg:col-span-4 space-y-6">
            
            {/* PKK Emblem Box */}
            <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm text-center flex flex-col items-center justify-center">
              <div className="w-48 h-48 mb-4 flex items-center justify-center relative">
                <img
                  src="/logo-pkk.png"
                  alt="Lambang PKK"
                  className="w-full h-full object-contain filter drop-shadow-md"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = `
                      <div class="w-40 h-40 rounded-full bg-blue-600 text-white flex flex-col items-center justify-center font-bold text-center p-3 shadow-md border-4 border-yellow-400">
                        <span class="text-xs uppercase tracking-widest text-yellow-300">TP PKK</span>
                        <span class="text-base font-extrabold">KAPASMADYA BARU</span>
                      </div>
                    `;
                  }}
                />
              </div>
              <h3 className="font-extrabold text-neutral-800 text-xl tracking-tight">
                TIM PENGGERAK PKK
              </h3>
              <p className="text-sm text-neutral-500 font-medium mt-0.5">
                Kelurahan Kapasmadya Baru, Surabaya
              </p>
            </div>

            {/* Menu List */}
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden p-2.5 space-y-1.5">
              {menuTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setCurrentPage(1);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-base font-bold text-left transition-all ${
                      isActive 
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-neutral-600 hover:text-neutral-900 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-blue-600'}`} />
                      <span>{tab.label}</span>
                    </div>
                    <ChevronRight className={`w-5 h-5 transition-transform ${isActive ? 'text-white translate-x-1' : 'text-gray-300'}`} />
                  </button>
                );
              })}
            </div>

          </aside>

          {/* Right Content Area */}
          <main className="lg:col-span-8 bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8 md:p-10 space-y-8">
            
            {/* Breadcrumb Header */}
            <div className="border-b border-gray-100 pb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-base sm:text-lg font-extrabold text-neutral-800">
                <ChevronRight className="w-5 h-5 text-blue-600" />
                <span>
                  {menuTabs.find(t => t.id === activeTab)?.label}
                </span>
              </div>
              
              {activeTab === 'anggota' && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewMode('table')}
                    className={`px-3 py-1.5 rounded-xl text-sm font-bold flex items-center gap-1.5 transition-colors ${
                      viewMode === 'table' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-neutral-600 hover:bg-gray-200'
                    }`}
                    title="Tampilan Tabel Resmi"
                  >
                    <List className="w-4 h-4" />
                    <span>Tabel</span>
                  </button>
                  <button
                    onClick={() => setViewMode('cards')}
                    className={`px-3 py-1.5 rounded-xl text-sm font-bold flex items-center gap-1.5 transition-colors ${
                      viewMode === 'cards' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-neutral-600 hover:bg-gray-200'
                    }`}
                    title="Tampilan Kartu Foto"
                  >
                    <LayoutGrid className="w-4 h-4" />
                    <span>Kartu</span>
                  </button>
                </div>
              )}
            </div>

            {/* TAB 1: ANGGOTA PKK KELURAHAN */}
            {activeTab === 'anggota' && (
              <div className="space-y-6 animate-fadeIn">
                
                {/* Search & Entries Controls */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-2.5 text-sm sm:text-base text-neutral-600 font-medium">
                    <span>Tampilkan</span>
                    <select
                      value={entriesPerPage}
                      onChange={(e) => {
                        setEntriesPerPage(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                      className="bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-sm sm:text-base font-semibold text-neutral-700 focus:outline-none focus:border-blue-600"
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>Semua</option>
                    </select>
                    <span>data per halaman</span>
                  </div>

                  <div className="relative w-full sm:w-72">
                    <Search className="w-5 h-5 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Cari nama, jabatan, alamat..."
                      value={searchMember}
                      onChange={(e) => {
                        setSearchMember(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full bg-gray-50 border border-gray-300 rounded-xl pl-10 pr-3.5 py-2.5 text-sm sm:text-base focus:outline-none focus:border-blue-600 text-neutral-800"
                    />
                  </div>
                </div>

                {viewMode === 'table' ? (
                  /* Data Table matching official Kelurahan Website */
                  <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-2xs">
                    <table className="w-full text-left text-sm sm:text-base">
                      <thead className="bg-gray-50 text-neutral-700 font-extrabold uppercase tracking-wider text-xs sm:text-sm border-b border-gray-200">
                        <tr>
                          <th className="py-4 px-4 w-16 text-center">No</th>
                          <th className="py-4 px-4">Jabatan</th>
                          <th className="py-4 px-4">Nama</th>
                          <th className="py-4 px-4">Alamat</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {displayedMembers.length > 0 ? (
                          displayedMembers.map((m) => (
                            <tr key={m.no} className="hover:bg-blue-50/50 transition-colors">
                              <td className="py-4 px-4 text-center font-bold text-neutral-500">
                                {m.no}.
                              </td>
                              <td className="py-4 px-4 font-bold text-neutral-800">
                                <span className="inline-block px-3 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs sm:text-sm font-bold">
                                  {m.jabatan}
                                </span>
                              </td>
                              <td className="py-4 px-4 font-extrabold text-neutral-800 tracking-tight text-sm sm:text-base">
                                {m.nama}
                              </td>
                              <td className="py-4 px-4 text-neutral-600 font-medium text-sm sm:text-base">
                                {m.alamat}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={4} className="py-10 text-center text-neutral-500 text-base">
                              Tidak ada data anggota yang cocok dengan pencarian.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  /* Visual Photo Cards Mode */
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {displayedMembers.map((m) => (
                      <div key={m.no} className="bg-gray-50 p-5 rounded-2xl border border-gray-200 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs sm:text-sm font-bold px-3 py-1 rounded-full bg-blue-100 text-blue-700">
                            {m.jabatan}
                          </span>
                          <span className="text-sm text-neutral-400 font-bold">No. {m.no}</span>
                        </div>
                        <h4 className="font-extrabold text-neutral-800 text-lg">{m.nama}</h4>
                        <p className="text-sm text-neutral-600 flex items-start gap-1.5 leading-relaxed">
                          <span className="font-semibold text-neutral-700">Alamat:</span> {m.alamat}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Pagination Controls */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm sm:text-base text-neutral-500 pt-3 border-t border-gray-100">
                  <div>
                    Menampilkan {filteredMembers.length > 0 ? (currentPage - 1) * entriesPerPage + 1 : 0} hingga {Math.min(currentPage * entriesPerPage, filteredMembers.length)} dari {filteredMembers.length} entri
                  </div>
                  {totalPages > 1 && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-3.5 py-1.5 rounded-xl border border-gray-300 text-sm font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        Sebelumnya
                      </button>
                      <span className="px-3.5 py-1.5 rounded-xl bg-blue-600 text-white text-sm font-bold">
                        {currentPage} / {totalPages}
                      </span>
                      <button
                        onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-3.5 py-1.5 rounded-xl border border-gray-300 text-sm font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        Berikutnya
                      </button>
                    </div>
                  )}
                </div>

                {/* Photo Grid of Board Members if available */}
                {pengurus.length > 0 && (
                  <div className="pt-8 border-t border-gray-200 space-y-4">
                    <h3 className="font-extrabold text-xl text-neutral-800">
                      Galeri Foto Profil Pengurus
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {pengurus.slice(0, 4).map(p => (
                        <div key={p.id} className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-200 text-center">
                          <img src={p.foto_url} alt={p.nama} className="w-full h-40 object-cover" />
                          <div className="p-3.5">
                            <span className="text-xs font-bold text-blue-600 block truncate">{p.jabatan}</span>
                            <h4 className="font-bold text-sm text-neutral-800 truncate mt-0.5">{p.nama}</h4>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* TAB 2: PERATURAN DAN PANDUAN UMUM */}
            {activeTab === 'peraturan' && (
              <div className="space-y-10 animate-fadeIn">
                
                {/* 1. Bagian Peraturan */}
                <div className="space-y-5">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100 text-blue-700 text-xs sm:text-sm font-bold">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Dasar Hukum & Peraturan Perundang-undangan</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-neutral-800 tracking-tight">
                    Peraturan Resmi Gerakan PKK
                  </h3>

                  <div className="space-y-4">
                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-2.5 hover:border-blue-300 transition-colors">
                      <div className="flex items-center gap-2.5">
                        <span className="px-3 py-1 rounded-full bg-blue-600 text-white text-xs sm:text-sm font-bold">
                          Undang-Undang
                        </span>
                        <span className="text-xs sm:text-sm text-neutral-500 font-semibold">UU RI No. 23 Tahun 2014</span>
                      </div>
                      <h4 className="font-bold text-neutral-800 text-base sm:text-lg leading-snug">
                        Undang-Undang Nomor 23 Tahun 2014 tentang Pemerintahan Daerah
                      </h4>
                      <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
                        (Lembaran Negara Republik Indonesia Tahun 2014 Nomor 244, Tambahan Lembaran Negara Republik Indonesia Nomor 5587), sebagaimana telah diubah beberapa kali terakhir dengan Undang-Undang Nomor 9 Tahun 2015 tentang Perubahan Kedua atas Undang-Undang Nomor 23 Tahun 2014 tentang Pemerintahan Daerah (Lembar Negara Republik Indonesia Tahun 2015 Nomor 58, Tambahan Lembaran Negara Republik Indonesia Nomor 5679).
                      </p>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-2.5 hover:border-blue-300 transition-colors">
                      <div className="flex items-center gap-2.5">
                        <span className="px-3 py-1 rounded-full bg-primary-500 text-white text-xs sm:text-sm font-bold">
                          Peraturan Presiden
                        </span>
                        <span className="text-xs sm:text-sm text-neutral-500 font-semibold">Perpres No. 99 Tahun 2017</span>
                      </div>
                      <h4 className="font-bold text-neutral-800 text-base sm:text-lg leading-snug">
                        Peraturan Presiden Nomor 99 Tahun 2017 tentang Gerakan Pemberdayaan dan Kesejahteraan Keluarga
                      </h4>
                      <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
                        (Lembaran Negara Republik Indonesia Tahun 2017 Nomor 226). Mengatur kedudukan, tugas pokok, dan fungsi Gerakan PKK secara nasional.
                      </p>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-2.5 hover:border-blue-300 transition-colors">
                      <div className="flex items-center gap-2.5">
                        <span className="px-3 py-1 rounded-full bg-emerald-600 text-white text-xs sm:text-sm font-bold">
                          Permendagri
                        </span>
                        <span className="text-xs sm:text-sm text-neutral-500 font-semibold">Permendagri No. 36 Tahun 2020</span>
                      </div>
                      <h4 className="font-bold text-neutral-800 text-base sm:text-lg leading-snug">
                        Peraturan Menteri Dalam Negeri Nomor 36 Tahun 2020
                      </h4>
                      <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
                        Tentang Peraturan Pelaksanaan Peraturan Presiden Nomor 99 Tahun 2017 tentang Gerakan Pemberdayaan dan Kesejahteraan Keluarga (Lembaran Negara Republik Indonesia Tahun 2020 Nomor 580).
                      </p>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-2.5 hover:border-blue-300 transition-colors">
                      <div className="flex items-center gap-2.5">
                        <span className="px-3 py-1 rounded-full bg-primary-500 text-white text-xs sm:text-sm font-bold">
                          Kepmendagri
                        </span>
                        <span className="text-xs sm:text-sm text-neutral-500 font-semibold">Kepmendagri No. 411.4 – 4946 Tahun 2021</span>
                      </div>
                      <h4 className="font-bold text-neutral-800 text-base sm:text-lg leading-snug">
                        Keputusan Menteri Dalam Negeri Nomor 411.4 – 4946 Tahun 2021
                      </h4>
                      <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
                        Tentang Pengesahan Keputusan Ketua Umum Tim Penggerak PKK tentang Hasil Rapat Kerja Nasional IX PKK Tahun 2021.
                      </p>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-2.5 hover:border-blue-300 transition-colors">
                      <div className="flex items-center gap-2.5">
                        <span className="px-3 py-1 rounded-full bg-rose-600 text-white text-xs sm:text-sm font-bold">
                          Keputusan Ketum TP PKK
                        </span>
                        <span className="text-xs sm:text-sm text-neutral-500 font-semibold">No. 15/KEP/PKK.PST/VIII/2021</span>
                      </div>
                      <h4 className="font-bold text-neutral-800 text-base sm:text-lg leading-snug">
                        Keputusan Ketua Umum Tim Penggerak PKK Nomor 15/KEP/PKK.PST/VIII/2021 Tahun 2021
                      </h4>
                      <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
                        Tentang Hasil Rapat Kerja Nasional IX PKK Tahun 2021 sebagai pedoman operasional seluruh jenjang Tim Penggerak PKK.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 2. Bagian Panduan Umum */}
                <div className="space-y-5 pt-6 border-t border-gray-200">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-800 text-xs sm:text-sm font-bold">
                    <BookOpen className="w-4 h-4" />
                    <span>Buku Pedoman Resmi Gerakan PKK</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-neutral-800 tracking-tight">
                    Panduan Umum Gerakan PKK
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div className="bg-primary-200 p-6 rounded-2xl border border-blue-200 space-y-3.5 flex flex-col justify-between">
                      <div className="space-y-2.5">
                        <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-xs">
                          <BookOpen className="w-6 h-6" />
                        </div>
                        <h4 className="font-extrabold text-neutral-800 text-lg leading-snug">
                          Buku Rencana Induk Gerakan PKK
                        </h4>
                        <p className="text-sm text-neutral-500 font-medium">Periode Tahun 2021-2024</p>
                      </div>
                      <span className="text-xs sm:text-sm text-blue-700 font-bold bg-blue-100/90 px-3 py-1.5 rounded-xl inline-block text-center">
                        Arah Kebijakan Strategis
                      </span>
                    </div>

                    <div className="bg-secondary-100 p-6 rounded-2xl border border-pink-200 space-y-3.5 flex flex-col justify-between">
                      <div className="space-y-2.5">
                        <div className="w-12 h-12 rounded-xl bg-pink-600 text-white flex items-center justify-center font-bold shadow-xs">
                          <Target className="w-6 h-6" />
                        </div>
                        <h4 className="font-extrabold text-neutral-800 text-lg leading-snug">
                          Buku Strategi Gerakan PKK
                        </h4>
                        <p className="text-sm text-neutral-500 font-medium">Pedoman Penerapan Lapangan</p>
                      </div>
                      <span className="text-xs sm:text-sm text-pink-700 font-bold bg-pink-100/90 px-3 py-1.5 rounded-xl inline-block text-center">
                        Implementasi Program
                      </span>
                    </div>

                    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-6 rounded-2xl border border-emerald-200 space-y-3.5 flex flex-col justify-between">
                      <div className="space-y-2.5">
                        <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-xs">
                          <FileText className="w-6 h-6" />
                        </div>
                        <h4 className="font-extrabold text-neutral-800 text-lg leading-snug">
                          Buku Juknis Tata Kelola Kelembagaan
                        </h4>
                        <p className="text-sm text-neutral-500 font-medium">Petunjuk Teknis Kelembagaan PKK</p>
                      </div>
                      <span className="text-xs sm:text-sm text-emerald-700 font-bold bg-emerald-100/90 px-3 py-1.5 rounded-xl inline-block text-center">
                        Standar Operasional
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* TAB 3: VISI DAN MISI */}
            {activeTab === 'visi-misi' && (
              <div className="space-y-10 animate-fadeIn">
                
                {/* Hero Box Visi */}
                <div className="bg-primary-500 text-white p-7 sm:p-10 rounded-3xl shadow-sm space-y-4">
                  <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold">
                    <Target className="w-4 h-4 text-amber-300" />
                    <span>Visi Gerakan PKK 2024</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-black leading-snug tracking-tight">
                    "Terwujudnya Keluarga Sehat, Cerdas, Berdaya, Beriman dan Bertaqwa Menuju Indonesia Maju di Tahun 2024"
                  </h3>
                </div>

                {/* Penjelasan Makna Visi */}
                <div className="space-y-5">
                  <h4 className="font-black text-neutral-800 text-xl tracking-tight">Makna Indikator Visi:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    
                    <div className="bg-blue-50/70 p-6 rounded-2xl border border-blue-200 space-y-2">
                      <h5 className="font-bold text-blue-700 text-lg flex items-center gap-2.5">
                        <Heart className="w-5 h-5 flex-shrink-0" />
                        Keluarga Sehat
                      </h5>
                      <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
                        Diartikan keluarga yang setiap individunya berada dalam kondisi yang sejahtera, baik dari segi fisik maupun mental, sehingga dapat hidup normal secara sosial dan ekonomi di tengah masyarakat lainnya.
                      </p>
                    </div>

                    <div className="bg-pink-50/70 p-6 rounded-2xl border border-pink-200 space-y-2">
                      <h5 className="font-bold text-pink-700 text-lg flex items-center gap-2.5">
                        <BookOpen className="w-5 h-5 flex-shrink-0" />
                        Cerdas
                      </h5>
                      <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
                        Diartikan terpenuhinya pendidikan dan penguasaan keterampilan yang dibutuhkan dalam mengolah potensi yang dimiliki serta dapat mengakses layanan dasar pendidikan.
                      </p>
                    </div>

                    <div className="bg-sky-50/70 p-6 rounded-2xl border border-sky-200 space-y-2">
                      <h5 className="font-bold text-sky-700 text-lg flex items-center gap-2.5">
                        <Sparkles className="w-5 h-5 flex-shrink-0" />
                        Berdaya
                      </h5>
                      <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
                        Diartikan kemampuan untuk mengolah potensi sumberdaya yang dimiliki dengan memanfaatkan teknologi sesuai perkembangan masyarakat.
                      </p>
                    </div>

                    <div className="bg-emerald-50/70 p-6 rounded-2xl border border-emerald-200 space-y-2">
                      <h5 className="font-bold text-emerald-700 text-lg flex items-center gap-2.5">
                        <ShieldCheck className="w-5 h-5 flex-shrink-0" />
                        Beriman dan Bertaqwa
                      </h5>
                      <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
                        Diartikan sebagai terwujudnya pribadi yang menerapkan prinsip Ketuhanan Yang Maha Esa dan menjalankan ajaran agama dan kepercayaan masing-masing.
                      </p>
                    </div>

                  </div>
                </div>

                {/* 4 Agenda Prioritas RPJMN */}
                <div className="bg-amber-50/80 p-7 rounded-2xl border border-amber-200 space-y-3.5">
                  <h4 className="font-extrabold text-amber-900 text-lg flex items-center gap-2.5">
                    <Award className="w-6 h-6 text-amber-600" />
                    4 Agenda Prioritas RPJMN 2020–2024
                  </h4>
                  <p className="text-sm sm:text-base text-neutral-700 leading-relaxed">
                    Untuk mewujudkan keluarga sehat, cerdas, dan berdaya dilakukan melalui 4 agenda prioritas mendorong pemenuhan Rencana Pembangunan Jangka Menengah Nasional (RPJMN) 2020–2024:
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                    <div className="bg-white p-3.5 rounded-xl text-center font-bold text-sm sm:text-base text-neutral-800 border border-amber-200 shadow-2xs">
                      1. Ketahanan Ekonomi
                    </div>
                    <div className="bg-white p-3.5 rounded-xl text-center font-bold text-sm sm:text-base text-neutral-800 border border-amber-200 shadow-2xs">
                      2. Revolusi Mental
                    </div>
                    <div className="bg-white p-3.5 rounded-xl text-center font-bold text-sm sm:text-base text-neutral-800 border border-amber-200 shadow-2xs">
                      3. Layanan Dasar
                    </div>
                    <div className="bg-white p-3.5 rounded-xl text-center font-bold text-sm sm:text-base text-neutral-800 border border-amber-200 shadow-2xs">
                      4. Lingkungan Hidup
                    </div>
                  </div>
                </div>

                {/* 5 Butir Misi */}
                <div className="space-y-5 pt-4 border-t border-gray-200">
                  <h4 className="font-black text-neutral-800 text-xl tracking-tight">Misi Tim Penggerak PKK:</h4>
                  <div className="space-y-3.5">
                    {[
                      'Membentuk Karakter Keluarga Melalui Pola Asuh yang Sesuai dengan Nilai Dasar Pancasila.',
                      'Meningkatkan Pendidikan dan Ekonomi Keluarga.',
                      'Memperkuat Ketahanan Keluarga melalui Pemenuhan Pangan, Sandang, Rumah Sehat Layak Huni serta Tata Laksana Rumah Tangga.',
                      'Meningkatkan Kesehatan, Kelestarian Lingkungan Hidup dan Perencanaan Sehat.',
                      'Modernisasi Organisasi PKK dengan Memanfaatkan Teknologi Informasi.'
                    ].map((misi, idx) => (
                      <div key={idx} className="bg-gray-50 p-5 rounded-2xl border border-gray-200 flex items-start gap-4">
                        <span className="w-8 h-8 rounded-xl bg-blue-600 text-white font-black text-sm flex items-center justify-center flex-shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <p className="text-sm sm:text-base text-neutral-800 font-semibold leading-relaxed">
                          {misi}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Gerakan Nasional Footer */}
                  <div className="bg-primary-200 p-6 rounded-2xl border border-blue-200 text-sm sm:text-base text-neutral-700 leading-relaxed font-medium">
                    Kelima Misi tersebut di atas dirangkum dalam satu Gerakan Nasional yaitu <strong className="text-neutral-900">Gerakan Nasional Keluarga Pelopor Perubahan</strong> yang dilaksanakan oleh segenap jajaran Tim Penggerak PKK di semua jenjang, Kementerian/Lembaga terkait, Pemerintah Daerah serta mitra kerja Tim Penggerak PKK lainnya.
                  </div>
                </div>

              </div>
            )}

            {/* TAB 4: ASAS-ASAS GERAKAN PKK */}
            {activeTab === 'asas' && (
              <div className="space-y-8 animate-fadeIn">
                <div className="space-y-2.5">
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-neutral-800 tracking-tight">
                    Asas-Asas Gerakan PKK
                  </h3>
                  <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
                    Untuk mewujudkan visi dan misi tersebut, maka diperlukan asas-asas yang menjadi nilai dalam pelaksanaan Gerakan PKK:
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {[
                    {
                      nama: 'Transparansi',
                      deskripsi: 'Adanya keterbukaan informasi mengenai sistem pengorganisasian Gerakan PKK sehingga dapat diakses oleh masyarakat.',
                      color: 'border-l-blue-600'
                    },
                    {
                      nama: 'Partisipatif',
                      deskripsi: 'Adanya ruang bagi masyarakat untuk berpartisipasi atau keterlibatan masyarakat dalam Gerakan PKK.',
                      color: 'border-l-pink-600'
                    },
                    {
                      nama: 'Akuntabilitas',
                      deskripsi: 'Adanya orientasi Gerakan PKK dalam upaya mencapai sasaran yang dapat dipertanggungjawabkan sehingga menjauhkan dari potensi penyalahgunaan dan penyimpangan.',
                      color: 'border-l-primary-500'
                    },
                    {
                      nama: 'Kearifan Lokal',
                      deskripsi: 'Adanya upaya untuk menjunjung tinggi dan menerapkan budaya lokal setempat dalam setiap Gerakan PKK.',
                      color: 'border-l-amber-600'
                    },
                    {
                      nama: 'Responsif',
                      deskripsi: 'Adanya upaya untuk cepat tanggap terhadap permasalahan yang dihadapi dan kebutuhan dari pengurus dan Kader PKK secara khusus, maupun masyarakat secara umum.',
                      color: 'border-l-rose-600'
                    },
                    {
                      nama: 'Kemitraan',
                      deskripsi: 'Adanya ruang untuk berkolaborasi dengan stakeholders (para pemangku kepentingan atau mitra kerja) lain, baik dari lingkup kementerian/lembaga, pemerintah daerah, maupun dari organisasi non pemerintah.',
                      color: 'border-l-emerald-600'
                    }
                  ].map((asas, i) => (
                    <div key={i} className={`bg-gray-50 p-6 rounded-2xl border border-gray-200 border-l-4 ${asas.color} space-y-2.5 shadow-2xs`}>
                      <h4 className="font-black text-neutral-800 text-lg">{asas.nama}</h4>
                      <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
                        {asas.deskripsi}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 5: TUJUAN DAN SASARAN */}
            {activeTab === 'tujuan' && (
              <div className="space-y-8 animate-fadeIn">
                <div className="space-y-2.5">
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-neutral-800 tracking-tight">
                    Tujuan dan Sasaran Gerakan PKK
                  </h3>
                  <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
                    Untuk mewujudkan Visi dan Misi Gerakan PKK, maka Tujuan dan Sasaran yang akan dicapai adalah terlaksananya 10 Program Pokok PKK secara terpadu:
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    'Terlaksananya Program Penghayatan dan Pengamalan Pancasila',
                    'Terlaksananya Program Gotong Royong Masyarakat',
                    'Terlaksananya Program Pangan bagi keluarga',
                    'Terlaksananya Program Sandang bagi keluarga',
                    'Terlaksananya Program pemenuhan Perumahan dan Tata Laksana Rumah Tangga',
                    'Terlaksananya Program Pendidikan dan Keterampilan bagi keluarga',
                    'Terlaksananya Program Kesehatan',
                    'Terlaksananya Program Pengembangan Kehidupan Berkoperasi',
                    'Terlaksananya Program Kelestarian Lingkungan Hidup',
                    'Terlaksananya Program Perencanaan Sehat'
                  ].map((prog, idx) => (
                    <div key={idx} className="bg-gray-50 p-5 rounded-2xl border border-gray-200 flex items-center gap-3.5 shadow-2xs">
                      <span className="w-9 h-9 rounded-xl bg-blue-600 text-white font-black text-sm flex items-center justify-center flex-shrink-0">
                        {idx + 1}
                      </span>
                      <span className="font-bold text-neutral-800 text-sm sm:text-base leading-snug">
                        {prog}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 6: PROGRAM KERJA (ACCORDION SESUAI WEBSITE KELURAHAN) */}
            {activeTab === 'program-kerja' && (
              <div className="space-y-8 animate-fadeIn">
                <div className="space-y-2.5">
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-neutral-800 tracking-tight">
                    Program Kerja Pokja I - IV (2021-2024)
                  </h3>
                  <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
                    Program kerja kelompok kerja yang diturunkan dari Rapat Kerja Nasional IX PKK untuk diterapkan secara terpadu di wilayah Kelurahan Kapasmadya Baru.
                  </p>
                </div>

                {/* Accordion List matching Image 3 */}
                <div className="space-y-4">
                  {programKerjaList.map((pokjaItem, idx) => {
                    const isOpen = openAccordion === idx;
                    return (
                      <div
                        key={idx}
                        className="rounded-2xl border border-gray-200 overflow-hidden shadow-2xs transition-all"
                      >
                        {/* Accordion Header */}
                        <button
                          onClick={() => setOpenAccordion(isOpen ? -1 : idx)}
                          className={`w-full flex items-center justify-between p-5 sm:p-6 text-left transition-colors font-bold text-base sm:text-lg lg:text-xl ${
                            isOpen 
                              ? 'bg-primary-200/80 text-primary-600 border-b border-primary-200'
                              : 'bg-white text-neutral-800 hover:bg-gray-50'
                          }`}
                        >
                          <span className="font-extrabold tracking-tight">{pokjaItem.title}</span>
                          {isOpen ? (
                            <ChevronUp className="w-6 h-6 text-primary-500 flex-shrink-0" />
                          ) : (
                            <ChevronDown className="w-6 h-6 text-gray-400 flex-shrink-0" />
                          )}
                        </button>

                        {/* Accordion Content */}
                        {isOpen && (
                          <div className="p-6 sm:p-7 bg-white space-y-4 animate-fadeIn">
                            <div className="bg-blue-50/70 p-4.5 rounded-xl border border-blue-200/80">
                              <span className="font-semibold text-sm sm:text-base text-neutral-700">
                                Program unggulan 2021-2024:{' '}
                                <strong className="text-blue-700 font-extrabold">{pokjaItem.unggulan}</strong>
                              </span>
                            </div>

                            <ol className="list-decimal list-inside space-y-2.5 text-sm sm:text-base text-neutral-600 pl-1 leading-relaxed">
                              {pokjaItem.items.map((item, itemIdx) => (
                                <li key={itemIdx} className="leading-relaxed">
                                  <span className="text-neutral-800 font-medium">{item}</span>
                                </li>
                              ))}
                            </ol>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </main>

        </div>
      </div>

    </div>
  );
}
