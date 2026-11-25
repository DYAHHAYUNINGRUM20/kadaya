import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Users, Images, Bell, MessageSquare, Activity, ShoppingBag,
  LogOut, ShieldCheck, Menu, X
} from 'lucide-react';

const sections = [
  { title: 'UTAMA', items: [
    { label: 'Dashboard', to: '/admin', icon: LayoutDashboard, end: true },
  ]},
  { title: 'KONTEN PORTAL', items: [
    { label: 'Kelola Dokumentasi', to: '/admin/kegiatan', icon: Images },
    { label: 'Kelola Produk UMKM', to: '/admin/produk', icon: ShoppingBag },
    { label: 'Kelola Pengumuman', to: '/admin/pengumuman', icon: Bell },
  ]},
  { title: 'MANAJEMEN & LAYANAN', items: [
    { label: 'Data Pengguna', to: '/admin/pengguna', icon: Users },
    { label: 'Pesan Warga', to: '/admin/pesan', icon: MessageSquare },
    { label: 'Log Aktivitas', to: '/admin/log', icon: Activity },
  ]},
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const SidebarContent = () => (
    <>
      <div className="flex items-center gap-3 px-5 py-6 border-b border-gray-100">
        <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center overflow-hidden shrink-0">
          <img src="/logo-pkk.png" alt="Logo PKK" className="w-full h-full object-contain" />
        </div>
        <div className="min-w-0">
          <div className="font-extrabold text-gray-800 leading-tight">KADAYA</div>
          <div className="text-[11px] tracking-[0.12em] font-bold text-emerald-700 mt-1">PANEL ADMIN</div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-5 space-y-6 overflow-y-auto">
        {sections.map((section) => (
          <div key={section.title}>
            <p className="px-3 mb-2 text-[10px] font-extrabold tracking-[0.16em] text-gray-400">{section.title}</p>
            <div className="space-y-1">
              {section.items.map(({ label, to, icon: Icon, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${isActive ? 'bg-emerald-50 text-emerald-800' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                >
                  <Icon className="w-[18px] h-[18px] shrink-0" />
                  <span>{label}</span>
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-gray-100 p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-700 text-white flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-gray-800 truncate">{user?.nama || 'Admin Kelurahan'}</p>
            <p className="text-xs text-gray-500">Administrator</p>
          </div>
          <button onClick={handleLogout} title="Keluar" className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:text-red-600 hover:bg-red-50" aria-label="Keluar">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#f7f8f6] flex">
      <aside className="hidden md:flex w-[260px] shrink-0 bg-white border-r border-gray-200 min-h-screen flex-col sticky top-0 h-screen">
        <SidebarContent />
      </aside>

      <div className="md:hidden fixed top-0 inset-x-0 z-40 bg-white border-b border-gray-200 h-14 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2 font-extrabold text-gray-800"><ShieldCheck className="w-5 h-5 text-emerald-700"/> KADAYA Admin</div>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 rounded-lg hover:bg-gray-100" aria-label="Buka menu">
          {mobileOpen ? <X className="w-5 h-5"/> : <Menu className="w-5 h-5"/>}
        </button>
      </div>
      {mobileOpen && <div className="md:hidden fixed inset-0 z-50 bg-black/30" onClick={() => setMobileOpen(false)}>
        <aside className="w-[280px] max-w-[85vw] h-full bg-white flex flex-col shadow-xl" onClick={(e) => e.stopPropagation()}><SidebarContent /></aside>
      </div>}

      <main className="min-w-0 flex-1 pt-14 md:pt-0">
        <div className="max-w-[1600px] mx-auto"><Outlet /></div>
      </main>
    </div>
  );
}
