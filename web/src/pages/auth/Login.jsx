import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogIn, Eye, EyeOff, Lock, Mail, ShieldAlert, Sparkles } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await login(email, password);
      if (res.pengguna.peran === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Email atau kata sandi salah.');
    } finally {
      setLoading(false);
    }
  };

  const setDemoAccount = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrorMsg('');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-3xl bg-primary-500 text-white flex items-center justify-center font-extrabold text-3xl mx-auto shadow-md">
            K
          </div>
          <h1 className="text-3xl font-extrabold text-neutral-500 tracking-tight">
            Masuk Pengurus KADAYA
          </h1>
          <p className="text-sm text-neutral-400">
            Portal Kelola PKK Kelurahan Kapasmadya Baru Surabaya
          </p>
        </div>

        {/* Card Form */}
        <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm space-y-6">
          
          {errorMsg && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-sm flex items-start gap-2">
              <ShieldAlert className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
                Alamat Email Pengurus *
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-neutral-300 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@kadaya.local"
                  className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-300 text-base focus:border-blue-600 focus:outline-hidden text-neutral-500"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider">
                  Kata Sandi *
                </label>
              </div>
              <div className="relative">
                <Lock className="w-5 h-5 text-neutral-300 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi..."
                  className="w-full pl-12 pr-12 py-3 rounded-2xl border border-gray-300 text-base focus:border-blue-600 focus:outline-hidden text-neutral-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-300 hover:text-neutral-500"
                  tabIndex="-1"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-base shadow-md flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              <LogIn className="w-5 h-5" />
              <span>{loading ? 'Memeriksa Kredensial...' : 'Masuk ke Dashboard'}</span>
            </button>
          </form>

          <p className="text-center text-xs text-neutral-300 leading-relaxed pt-2 border-t border-gray-100">
            Lupa kata sandi? Hubungi <strong>Admin Kelurahan</strong> untuk mereset kata sandi akun Anda.
          </p>

        </div>

        {/* Demo Accounts Quick-Fill (Untuk Penguji & Dosen Pengampu) */}
        <div className="bg-blue-50/70 border border-blue-200 rounded-3xl p-5 space-y-3 text-xs">
          <div className="flex items-center gap-2 font-bold text-blue-900">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>Akun Demo Cepat (Klik untuk Isi Otomatis):</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setDemoAccount('admin@kadaya.local', 'Admin#2026')}
              className="p-2.5 rounded-xl bg-white border border-blue-200 text-left hover:bg-blue-100 font-semibold text-blue-900 transition-colors"
            >
              👑 <strong>Admin</strong>
              <span className="block text-[11px] text-neutral-400 font-normal">admin@kadaya.local</span>
            </button>
            <button
              type="button"
              onClick={() => setDemoAccount('pokja1@kadaya.local', 'Pokja#2026')}
              className="p-2.5 rounded-xl bg-white border border-blue-200 text-left hover:bg-blue-100 font-semibold text-blue-900 transition-colors"
            >
              🌸 <strong>Pokja I</strong>
              <span className="block text-[11px] text-neutral-400 font-normal">pokja1@kadaya.local</span>
            </button>
            <button
              type="button"
              onClick={() => setDemoAccount('pokja2@kadaya.local', 'Pokja#2026')}
              className="p-2.5 rounded-xl bg-white border border-blue-200 text-left hover:bg-blue-100 font-semibold text-pink-900 transition-colors"
            >
              🛍️ <strong>Pokja II (UP2K)</strong>
              <span className="block text-[11px] text-neutral-400 font-normal">pokja2@kadaya.local</span>
            </button>
            <button
              type="button"
              onClick={() => setDemoAccount('pokja3@kadaya.local', 'Pokja#2026')}
              className="p-2.5 rounded-xl bg-white border border-blue-200 text-left hover:bg-blue-100 font-semibold text-sky-900 transition-colors"
            >
              🌱 <strong>Pokja III (Pangan)</strong>
              <span className="block text-[11px] text-neutral-400 font-normal">pokja3@kadaya.local</span>
            </button>
          </div>
          <p className="text-center text-[11px] text-blue-700 italic">
            Sandi demo: <code>Admin#2026</code> / <code>Pokja#2026</code>
          </p>
        </div>

      </div>
    </div>
  );
}
