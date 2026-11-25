import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Users, Plus, Key, CheckCircle2, X, AlertTriangle, ShieldCheck, UserCheck, UserX } from 'lucide-react';

export default function AdminPengguna() {
  const [penggunaList, setPenggunaList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal Buat Akun
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [peran, setPeran] = useState('pengurus_pokja');
  const [pokjaId, setPokjaId] = useState('1');
  const [sandiSementara, setSandiSementara] = useState('Pokja#2026');
  const [saving, setSaving] = useState(false);
  const [hasilBuat, setHasilBuat] = useState(null);

  // Modal Reset Sandi
  const [resetModalUser, setResetModalUser] = useState(null);
  const [resetting, setResetting] = useState(false);
  const [hasilReset, setHasilReset] = useState(null);

  const fetchPengguna = () => {
    setLoading(true);
    api.getAdminPengguna()
      .then(res => setPenggunaList(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPengguna();
  }, []);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.buatAdminPengguna({
        nama,
        email,
        peran,
        pokja_id: peran === 'pengurus_pokja' ? Number(pokjaId) : null,
        kata_sandi_sementara: sandiSementara
      });
      setHasilBuat(res);
      fetchPengguna();
    } catch (err) {
      alert(err.message || 'Gagal membuat akun.');
    } finally {
      setSaving(false);
    }
  };

  const handleResetPassword = async () => {
    if (!resetModalUser) return;
    setResetting(true);
    try {
      const res = await api.resetSandiPengguna(resetModalUser.id);
      setHasilReset(res);
      fetchPengguna();
    } catch (err) {
      alert(err.message || 'Gagal mereset kata sandi.');
    } finally {
      setResetting(false);
    }
  };

  const toggleStatusUser = async (user) => {
    const nextStatus = !user.aktif;
    const confirmText = nextStatus
      ? `Aktifkan kembali akun ${user.nama}?`
      : `Nonaktifkan akun ${user.nama}? Pengguna tidak akan bisa masuk ke sistem.`;
    if (!window.confirm(confirmText)) return;

    try {
      await api.ubahStatusPengguna(user.id, { aktif: nextStatus });
      fetchPengguna();
    } catch (err) {
      alert(err.message || 'Gagal mengubah status akun.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-neutral-500 tracking-tight">
            Manajemen Akun Pengguna
          </h1>
          <p className="text-sm text-neutral-400">
            Kelola akun Admin Kelurahan dan PIC Pengurus Pokja I sampai IV.
          </p>
        </div>

        <button
          onClick={() => {
            setHasilBuat(null);
            setIsCreateModalOpen(true);
          }}
          className="px-6 py-3.5 rounded-2xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-sm shadow-md flex items-center gap-2 transition-colors flex-shrink-0"
        >
          <Plus className="w-5 h-5" />
          <span>Buat Akun Pengguna Baru</span>
        </button>
      </div>

      {/* Tabel Pengguna */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="text-center py-16 text-neutral-400">Memuat daftar pengguna...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-neutral-400 uppercase tracking-wider">
                  <th className="py-4 px-6">Nama & Email</th>
                  <th className="py-4 px-6">Peran & Wilayah Pokja</th>
                  <th className="py-4 px-6">Status Akun</th>
                  <th className="py-4 px-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {penggunaList.map(u => (
                  <tr key={u.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-bold text-neutral-500">{u.nama}</div>
                      <div className="text-xs text-neutral-400">{u.email}</div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                        u.peran === 'admin'
                          ? 'bg-pink-100 text-pink-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {u.peran === 'admin' ? 'Admin Kelurahan' : `Pengurus ${u.pokja_nama || 'Pokja'}`}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
                        u.aktif ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${u.aktif ? 'bg-emerald-600' : 'bg-red-600'}`}></span>
                        {u.aktif ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setHasilReset(null);
                            setResetModalUser(u);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-xs flex items-center gap-1 transition-colors"
                        >
                          <Key className="w-3.5 h-3.5" />
                          <span>Reset Sandi</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => toggleStatusUser(u)}
                          className={`p-1.5 rounded-xl border text-xs font-bold ${
                            u.aktif
                              ? 'border-red-200 text-red-600 hover:bg-red-50'
                              : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'
                          }`}
                          title={u.aktif ? 'Nonaktifkan Akun' : 'Aktifkan Akun'}
                        >
                          {u.aktif ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Buat Akun */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-neutral-500/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-xl font-bold text-neutral-500">Buat Akun Pengguna Baru</h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-neutral-300 hover:text-neutral-500">
                <X className="w-6 h-6" />
              </button>
            </div>

            {hasilBuat ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-emerald-800 text-lg">Akun Berhasil Dibuat!</h4>
                <div className="bg-white p-4 rounded-xl border border-emerald-200 text-left text-xs space-y-1">
                  <p><strong>Nama:</strong> {hasilBuat.data?.nama}</p>
                  <p><strong>Email:</strong> {hasilBuat.data?.email}</p>
                  <p className="text-emerald-800 font-bold pt-1">
                    <strong>Kata Sandi Sementara:</strong> <code className="bg-gray-100 px-2 py-0.5 rounded text-sm">{hasilBuat.sandi_sementara}</code>
                  </p>
                </div>
                <p className="text-xs text-neutral-400">
                  Salin dan berikan kata sandi sementara ini kepada pengurus terkait.
                </p>
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold"
                >
                  Tutup
                </button>
              </div>
            ) : (
              <form onSubmit={handleCreateUser} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-400 mb-1">
                    Nama Lengkap Pengurus *
                  </label>
                  <input
                    type="text"
                    required
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    placeholder="Contoh: Ibu Siti Rahayu (PIC Pokja I)"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-blue-600 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-400 mb-1">
                    Alamat Email Login *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="siti.pokja1@kadaya.local"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:border-blue-600 focus:outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-400 mb-1">
                      Peran Akun *
                    </label>
                    <select
                      value={peran}
                      onChange={(e) => setPeran(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm bg-white"
                    >
                      <option value="pengurus_pokja">Pengurus Pokja</option>
                      <option value="admin">Admin Kelurahan</option>
                    </select>
                  </div>

                  {peran === 'pengurus_pokja' && (
                    <div>
                      <label className="block text-xs font-bold text-neutral-400 mb-1">
                        Pilih Pokja *
                      </label>
                      <select
                        value={pokjaId}
                        onChange={(e) => setPokjaId(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm bg-white"
                      >
                        <option value="1">Pokja I</option>
                        <option value="2">Pokja II</option>
                        <option value="3">Pokja III</option>
                        <option value="4">Pokja IV</option>
                      </select>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-400 mb-1">
                    Kata Sandi Sementara Awal *
                  </label>
                  <input
                    type="text"
                    required
                    value={sandiSementara}
                    onChange={(e) => setSandiSementara(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-mono"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl border border-gray-300 text-sm font-semibold text-neutral-400"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-sm shadow-xs disabled:opacity-50"
                  >
                    {saving ? 'Membuat...' : 'Buat Akun'}
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

      {/* Modal Reset Sandi */}
      {resetModalUser && (
        <div className="fixed inset-0 z-50 bg-neutral-500/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-gray-100 text-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
              <Key className="w-6 h-6" />
            </div>

            {hasilReset ? (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-neutral-500">Kata Sandi Berhasil Direset!</h3>
                <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 text-left text-xs space-y-2">
                  <p>Berikan kata sandi sementara baru ini kepada pengguna:</p>
                  <div className="bg-white p-2.5 rounded-xl border border-amber-300 font-mono font-bold text-center text-base text-neutral-500">
                    {hasilReset.sandi_sementara}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setResetModalUser(null)}
                  className="w-full py-2.5 rounded-xl bg-amber-600 text-white font-bold text-sm"
                >
                  Selesai
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-neutral-500">Reset Kata Sandi Akun</h3>
                <p className="text-sm text-neutral-400">
                  Apakah Anda ingin mereset kata sandi akun <strong>{resetModalUser.nama}</strong> ({resetModalUser.email})? Sistem akan membuatkan sandi acak sementara.
                </p>
                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setResetModalUser(null)}
                    className="px-5 py-2.5 rounded-xl border border-gray-300 text-sm font-semibold text-neutral-400"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    disabled={resetting}
                    onClick={handleResetPassword}
                    className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-sm font-bold shadow-xs"
                  >
                    {resetting ? 'Mereset...' : 'Ya, Reset Sandi'}
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
