import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Activity, Clock, User, Shield } from 'lucide-react';

export default function AdminLog() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAdminLog()
      .then(res => setLogs(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const formatTanggal = (str) => {
    if (!str) return '';
    const d = new Date(str);
    return d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      <div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-neutral-500 tracking-tight">
          Jejak Audit Log Aktivitas Sistem
        </h1>
        <p className="text-sm text-neutral-400">
          Catatan otomatis seluruh aktivitas tulis data, login, moderasi, dan perubahan di sistem KADAYA.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-gray-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="text-center py-16 text-neutral-400">Memuat log aktivitas...</div>
        ) : logs.length === 0 ? (
          <div className="text-center py-16 text-neutral-400">Belum ada catatan aktivitas.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-neutral-400 uppercase tracking-wider">
                  <th className="py-4 px-6">Waktu Kejadian</th>
                  <th className="py-4 px-6">Pelaku / Pengguna</th>
                  <th className="py-4 px-6">Aksi & Entitas</th>
                  <th className="py-4 px-6">Rincian Perubahan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs sm:text-sm">
                {logs.map(l => (
                  <tr key={l.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="py-4 px-6 text-neutral-400 whitespace-nowrap">
                      {formatTanggal(l.dibuat_pada)}
                    </td>
                    <td className="py-4 px-6 font-semibold text-neutral-500 whitespace-nowrap">
                      {l.nama_pengguna || 'Pengguna ID ' + l.pengguna_id}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        l.aksi === 'CREATE' || l.aksi === 'CREATE_USER'
                          ? 'bg-emerald-100 text-emerald-800'
                          : l.aksi === 'DELETE'
                          ? 'bg-red-100 text-red-800'
                          : l.aksi === 'LOGIN'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {l.aksi} &bull; {l.entitas}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-neutral-400">
                      {l.rincian || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
