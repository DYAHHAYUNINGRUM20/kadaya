const BASE_URL = '/api';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('kadaya_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const contentType = response.headers.get('content-type');
  let data = null;
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    const errorMsg = data && data.pesan ? data.pesan : `Terjadi kesalahan (Kode: ${response.status})`;
    const error = new Error(errorMsg);
    error.status = response.status;
    error.kode = data && data.kode ? data.kode : 'ERROR';
    throw error;
  }

  return data;
}

export const api = {
  // Auth
  masuk: (email, kata_sandi) => request('/auth/masuk', { method: 'POST', body: JSON.stringify({ email, kata_sandi }) }),
  keluar: () => request('/auth/keluar', { method: 'POST' }),
  getSaya: () => request('/auth/saya'),
  ubahSandi: (data) => request('/auth/sandi', { method: 'PATCH', body: JSON.stringify(data) }),

  // Publik
  getBeranda: () => request('/publik/beranda'),
  getKegiatanPublik: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/publik/kegiatan?${q}`);
  },
  getKegiatanDetail: (id) => request(`/publik/kegiatan/${id}`),
  getProfilPengurus: () => request('/publik/profil-pengurus'),
  getProdukPublik: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/publik/produk?${q}`);
  },
  getJadwalPublik: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/publik/jadwal?${q}`);
  },
  getPengumumanPublik: () => request('/publik/pengumuman'),
  getStatistikPublik: () => request('/publik/statistik'),
  kirimPesanKontak: (data) => request('/publik/pesan', { method: 'POST', body: JSON.stringify(data) }),

  // Kegiatan (Dashboard & Admin)
  getKegiatan: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/kegiatan?${q}`);
  },
  buatKegiatan: (data) => request('/kegiatan', { method: 'POST', body: JSON.stringify(data) }),
  ubahKegiatan: (id, data) => request(`/kegiatan/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  hapusKegiatan: (id) => request(`/kegiatan/${id}`, { method: 'DELETE' }),

  // Produk (Dashboard & Admin)
  getProduk: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/produk?${q}`);
  },
  buatProduk: (data) => request('/produk', { method: 'POST', body: JSON.stringify(data) }),
  ubahProduk: (id, data) => request(`/produk/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  hapusProduk: (id) => request(`/produk/${id}`, { method: 'DELETE' }),

  // Jadwal (Dashboard & Admin)
  getJadwal: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/jadwal?${q}`);
  },
  buatJadwal: (data) => request('/jadwal', { method: 'POST', body: JSON.stringify(data) }),
  ubahJadwal: (id, data) => request(`/jadwal/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  hapusJadwal: (id) => request(`/jadwal/${id}`, { method: 'DELETE' }),

  // Admin
  getAdminStatistik: () => request('/admin/statistik'),
  getAdminPengguna: () => request('/admin/pengguna'),
  buatAdminPengguna: (data) => request('/admin/pengguna', { method: 'POST', body: JSON.stringify(data) }),
  resetSandiPengguna: (id) => request(`/admin/pengguna/${id}/reset-sandi`, { method: 'POST' }),
  ubahStatusPengguna: (id, data) => request(`/admin/pengguna/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  getAdminPesan: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/admin/pesan?${q}`);
  },
  ubahStatusPesan: (id, data) => request(`/admin/pesan/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  ubahStatusKegiatan: (id, status) => request(`/admin/kegiatan/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  getAdminPengumuman: () => request('/admin/pengumuman'),
  buatAdminPengumuman: (data) => request('/admin/pengumuman', { method: 'POST', body: JSON.stringify(data) }),
  ubahAdminPengumuman: (id, data) => request(`/admin/pengumuman/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  hapusAdminPengumuman: (id) => request(`/admin/pengumuman/${id}`, { method: 'DELETE' }),
  getAdminLog: () => request('/admin/log'),
};
