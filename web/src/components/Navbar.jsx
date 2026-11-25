import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, LogIn, LayoutDashboard, Shield, LogOut } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navLinks = [
    { label: 'Beranda', to: '/' },
    { label: 'Profil PKK', to: '/profil-pengurus' },
    { label: 'Kegiatan Pokja', to: '/kegiatan' },
    { label: 'Etalase Produk', to: '/produk' },
    { label: 'Jadwal', to: '/jadwal' },
    { label: 'Pengumuman', to: '/pengumuman' },
    { label: 'Statistik', to: '/statistik' },
    { label: 'Kontak', to: '/kontak' },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      {/* Top micro banner */}
      <div className="bg-primary-500 text-white text-xs sm:text-sm py-1.5 px-4 text-center font-medium tracking-wide">
        🌸 Portal Resmi PKK Kelurahan Kapasmadya Baru, Surabaya &bull; Mengabdi untuk Warga, Berdaya Bersama
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 xl:px-8">
        <div className="flex items-center justify-between min-h-[68px] gap-3">
          
          {/* Logo Brand */}
          <Link to="/" className="flex items-center gap-2.5 group focus:outline-none flex-shrink-0 min-w-[176px]">
            <div className="w-11 h-11 rounded-xl bg-primary-500 p-1 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform flex-shrink-0">
              <img
                src="/logo-pkk.png"
                alt="Logo PKK"
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = '<span class="text-white font-extrabold text-xl">K</span>';
                }}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-2xl text-neutral-800 tracking-tight leading-none">
                  KADAYA
                </span>
              </div>
              <p className="text-xs text-neutral-600 font-semibold mt-0.5 leading-tight max-w-[118px]">PKK Kapasmadya Baru</p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex flex-1 items-center justify-center gap-0 xl:gap-1 min-w-0">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-2.5 py-2 rounded-lg text-[13px] xl:text-sm font-semibold transition-colors whitespace-nowrap ${
                  isActive(link.to)
                    ? 'bg-blue-50 text-blue-600 font-bold'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-gray-100'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Auth Button Desktop */}
          <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
            {user ? (
              <div className="flex items-center gap-2">
                {isAdmin ? (
                  <Link
                    to="/admin"
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-sm shadow-sm transition-colors whitespace-nowrap"
                  >
                    <Shield className="w-4 h-4" />
                    Panel Admin
                  </Link>
                ) : (
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-sm transition-colors whitespace-nowrap"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard Pokja
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  title="Keluar Akun"
                  className="p-2.5 rounded-xl text-neutral-400 hover:text-red-600 hover:bg-red-50 border border-gray-200 transition-colors flex items-center justify-center"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/masuk"
                className="flex items-center gap-2 px-3 py-2 rounded-xl border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-bold text-sm transition-all whitespace-nowrap"
              >
                <LogIn className="w-4 h-4" />
                Masuk Pengurus
              </Link>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="flex lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-neutral-500 hover:text-neutral-600 hover:bg-gray-100 transition-colors"
              aria-label="Buka menu navigasi"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white/98 backdrop-blur-md px-4 pt-3 pb-6 space-y-1.5 shadow-xl animate-fadeIn">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setIsOpen(false)}
              className={`block px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                isActive(link.to)
                  ? 'bg-blue-50 text-blue-600 font-bold'
                  : 'text-neutral-400 hover:bg-gray-50'
              }`}
            >
              {link.label}
            </Link>
          ))}

          <div className="pt-3 mt-2 border-t border-gray-200">
            {user ? (
              <div className="space-y-2">
                {isAdmin ? (
                  <Link
                    to="/admin"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-pink-600 text-white font-semibold text-sm shadow-sm"
                  >
                    <Shield className="w-4 h-4" />
                    Panel Admin Kelurahan
                  </Link>
                ) : (
                  <Link
                    to="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm shadow-sm"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard Pengurus Pokja
                  </Link>
                )}
                <button
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-red-200 text-red-600 font-semibold text-sm hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Keluar Akun
                </button>
              </div>
            ) : (
              <Link
                to="/masuk"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm shadow-sm hover:bg-blue-700 transition-colors"
              >
                <LogIn className="w-4 h-4" />
                Masuk Pengurus PKK
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
