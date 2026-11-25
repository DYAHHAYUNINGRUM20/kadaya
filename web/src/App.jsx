import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AdminLayout from './components/AdminLayout';

// Halaman Publik
import Beranda from './pages/publik/Beranda';
import ProfilPkk from './pages/publik/ProfilPkk';
import Kegiatan from './pages/publik/Kegiatan';
import DetailKegiatan from './pages/publik/DetailKegiatan';
import Produk from './pages/publik/Produk';
import Jadwal from './pages/publik/Jadwal';
import Pengumuman from './pages/publik/Pengumuman';
import Statistik from './pages/publik/Statistik';
import Kontak from './pages/publik/Kontak';

// Halaman Auth
import Login from './pages/auth/Login';

// Halaman Dashboard Pengurus Pokja
import DashboardPokja from './pages/dashboard/DashboardPokja';
import FormKegiatan from './pages/dashboard/FormKegiatan';
import KelolaProduk from './pages/dashboard/KelolaProduk';
import KelolaJadwal from './pages/dashboard/KelolaJadwal';

// Halaman Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminPengguna from './pages/admin/AdminPengguna';
import AdminKegiatan from './pages/admin/AdminKegiatan';
import AdminPengumuman from './pages/admin/AdminPengumuman';
import AdminPesan from './pages/admin/AdminPesan';
import AdminLog from './pages/admin/AdminLog';

// Layout Utama (dengan Navbar & Footer)
function MainLayout() {
  const location = useLocation();
  if (location.pathname.startsWith('/admin')) return <Outlet />;
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

// Pelindung Hak Akses Berdasarkan Peran
function RequireRole({ allowedRoles, children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-neutral-400">
        Memeriksa sesi login...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/masuk" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.peran)) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-3xl border border-red-200 text-center space-y-4">
        <h2 className="text-2xl font-bold text-red-600">Akses Ditolak (403)</h2>
        <p className="text-sm text-neutral-400">
          Akun Anda tidak memiliki hak akses ke halaman ini.
        </p>
        <Navigate to={user.peran === 'admin' ? '/admin' : '/dashboard'} replace />
      </div>
    );
  }

  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            
            {/* Rute Publik */}
            <Route path="/" element={<Beranda />} />
            <Route path="/profil-pengurus" element={<ProfilPkk />} />
            <Route path="/kegiatan" element={<Kegiatan />} />
            <Route path="/kegiatan/:id" element={<DetailKegiatan />} />
            <Route path="/produk" element={<Produk />} />
            <Route path="/jadwal" element={<Jadwal />} />
            <Route path="/pengumuman" element={<Pengumuman />} />
            <Route path="/statistik" element={<Statistik />} />
            <Route path="/kontak" element={<Kontak />} />

            {/* Rute Auth */}
            <Route path="/masuk" element={<Login />} />

            {/* Rute Dashboard Pengurus Pokja & Admin */}
            <Route
              path="/dashboard"
              element={
                <RequireRole allowedRoles={['pengurus_pokja', 'admin']}>
                  <DashboardPokja />
                </RequireRole>
              }
            />
            <Route
              path="/dashboard/kegiatan/baru"
              element={
                <RequireRole allowedRoles={['pengurus_pokja', 'admin']}>
                  <FormKegiatan />
                </RequireRole>
              }
            />
            <Route
              path="/dashboard/kegiatan/:id/ubah"
              element={
                <RequireRole allowedRoles={['pengurus_pokja', 'admin']}>
                  <FormKegiatan />
                </RequireRole>
              }
            />
            <Route
              path="/dashboard/produk"
              element={
                <RequireRole allowedRoles={['pengurus_pokja', 'admin']}>
                  <KelolaProduk />
                </RequireRole>
              }
            />
            <Route
              path="/dashboard/jadwal"
              element={
                <RequireRole allowedRoles={['pengurus_pokja', 'admin']}>
                  <KelolaJadwal />
                </RequireRole>
              }
            />

            {/* Rute Khusus Admin Kelurahan */}
            <Route element={<AdminLayout />}>
            <Route
              path="/admin"
              element={
                <RequireRole allowedRoles={['admin']}>
                  <AdminDashboard />
                </RequireRole>
              }
            />
            <Route
              path="/admin/pengguna"
              element={
                <RequireRole allowedRoles={['admin']}>
                  <AdminPengguna />
                </RequireRole>
              }
            />
            <Route
              path="/admin/kegiatan"
              element={
                <RequireRole allowedRoles={['admin']}>
                  <AdminKegiatan />
                </RequireRole>
              }
            />
            <Route
              path="/admin/produk"
              element={
                <RequireRole allowedRoles={['admin']}>
                  <KelolaProduk />
                </RequireRole>
              }
            />
            <Route
              path="/admin/pengumuman"
              element={
                <RequireRole allowedRoles={['admin']}>
                  <AdminPengumuman />
                </RequireRole>
              }
            />
            <Route
              path="/admin/pesan"
              element={
                <RequireRole allowedRoles={['admin']}>
                  <AdminPesan />
                </RequireRole>
              }
            />
            <Route
              path="/admin/log"
              element={
                <RequireRole allowedRoles={['admin']}>
                  <AdminLog />
                </RequireRole>
              }
            />
            </Route>

            {/* Catch-all 404 */}
            <Route
              path="*"
              element={
                <div className="max-w-md mx-auto my-24 p-8 bg-white rounded-3xl border border-gray-200 text-center space-y-4">
                  <h2 className="text-3xl font-extrabold text-neutral-500">404</h2>
                  <p className="text-neutral-400 text-base">Halaman yang Anda tuju tidak ditemukan.</p>
                  <a href="/" className="inline-block px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm">
                    Kembali ke Beranda
                  </a>
                </div>
              }
            />

          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
