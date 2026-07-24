import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Calendar, Clock, CheckCircle2, UserCheck, Wrench, Car, Filter, XCircle } from 'lucide-react';

const STATUS_BADGE = {
  pending:     'bg-amber-50 text-amber-800 border-amber-200',
  confirmed:   'bg-blue-50 text-blue-800 border-blue-200',
  in_progress: 'bg-indigo-50 text-indigo-800 border-indigo-200',
  completed:   'bg-emerald-50 text-emerald-800 border-emerald-200',
  cancelled:   'bg-rose-50 text-rose-800 border-rose-200',
};

const STATUS_LABEL = {
  pending:     'Menunggu',
  confirmed:   'Dikonfirmasi',
  in_progress: 'Dikerjakan',
  completed:   'Selesai',
  cancelled:   'Dibatalkan',
};

const QueueManagement = ({ queue = [], mechanics = [] }) => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [updatingId, setUpdatingId] = useState(null);

  const filteredQueue = activeFilter === 'all'
    ? queue
    : queue.filter((b) => b.status === activeFilter);

  const handleUpdateStatus = (bookingId, newStatus, mechanicId = null) => {
    setUpdatingId(bookingId);
    const data = { status: newStatus };
    if (mechanicId) data.mechanic_id = mechanicId;
    router.patch(
      route('admin.bookings.status', bookingId),
      data,
      { onFinish: () => setUpdatingId(null) }
    );
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#091426]">Manajemen Antrean &amp; Jadwal Slot</h1>
          <p className="text-xs text-slate-500 mt-1">
            Kelola antrean reservasi, konfirmasi slot, tugaskan mekanik, atau batalkan antrean.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-1 text-xs">
          <Filter className="h-4 w-4 text-slate-400 mr-1 shrink-0" />
          {['all', 'pending', 'confirmed', 'in_progress', 'completed', 'cancelled'].map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                activeFilter === f ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {f === 'all' ? 'Semua' : STATUS_LABEL[f]}
            </button>
          ))}
        </div>
      </div>

      {/* Queue Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="divide-y divide-slate-100">
          {filteredQueue.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <CheckCircle2 className="h-10 w-10 text-slate-300 mx-auto" />
              <p className="text-sm text-slate-500">Tidak ada antrean untuk filter ini.</p>
            </div>
          ) : (
            filteredQueue.map((booking) => (
              <div key={booking.id} className="p-5 space-y-3 hover:bg-slate-50 transition-colors">
                {/* Row header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold bg-slate-900 text-white px-2.5 py-1 rounded-lg">
                        {booking.booking_code}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${STATUS_BADGE[booking.status] ?? 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                        {STATUS_LABEL[booking.status] ?? booking.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 mt-1">
                      <span className="flex items-center space-x-1">
                        <Car className="h-3.5 w-3.5" />
                        <span>{booking.vehicle?.license_plate} ({booking.vehicle?.brand} {booking.vehicle?.model})</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{new Date(booking.scheduled_at).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })}</span>
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">Pelanggan: <strong>{booking.customer?.name}</strong></p>
                  </div>

                  {/* Status update controls */}
                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    {/* Mechanic assignment */}
                    {mechanics.length > 0 && booking.status !== 'completed' && booking.status !== 'cancelled' && (
                      <select
                        defaultValue={booking.mechanic_id ?? ''}
                        onChange={(e) => handleUpdateStatus(booking.id, booking.status, e.target.value || null)}
                        className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 focus:border-[#eb6905] focus:outline-none"
                      >
                        <option value="">— Pilih Mekanik</option>
                        {mechanics.map((m) => (
                          <option key={m.id} value={m.id}>{m.name}</option>
                        ))}
                      </select>
                    )}

                    {/* Action Buttons */}
                    {booking.status === 'pending' && (
                      <button
                        onClick={() => handleUpdateStatus(booking.id, 'confirmed')}
                        disabled={updatingId === booking.id}
                        className="flex items-center space-x-1 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-700 disabled:opacity-50"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Konfirmasi</span>
                      </button>
                    )}
                    {booking.status === 'confirmed' && (
                      <button
                        onClick={() => handleUpdateStatus(booking.id, 'in_progress')}
                        disabled={updatingId === booking.id}
                        className="flex items-center space-x-1 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-indigo-700 disabled:opacity-50"
                      >
                        <Wrench className="h-3.5 w-3.5" />
                        <span>Mulai Kerjakan</span>
                      </button>
                    )}
                    {booking.status === 'in_progress' && (
                      <button
                        onClick={() => handleUpdateStatus(booking.id, 'completed')}
                        disabled={updatingId === booking.id}
                        className="flex items-center space-x-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-50"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Tandai Selesai</span>
                      </button>
                    )}

                    {/* Tombol Membatalkan Antrian */}
                    {booking.status !== 'completed' && booking.status !== 'cancelled' && (
                      <button
                        onClick={() => {
                          if (confirm(`Apakah Anda yakin ingin membatalkan antrean ${booking.booking_code}?`)) {
                            handleUpdateStatus(booking.id, 'cancelled');
                          }
                        }}
                        disabled={updatingId === booking.id}
                        className="flex items-center space-x-1 rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-100 disabled:opacity-50 transition-colors"
                        title="Batalkan Antrean Ini"
                      >
                        <XCircle className="h-3.5 w-3.5 text-rose-600" />
                        <span>Batalkan Antrean</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Items */}
                {booking.items && booking.items.length > 0 && (
                  <div className="rounded-xl bg-slate-50 border border-slate-100 px-4 py-2 text-xs text-slate-600 space-y-0.5">
                    {booking.items.map((item) => (
                      <div key={item.id} className="flex justify-between">
                        <span>• {item.service?.name}</span>
                        <span className="font-semibold">Rp {Number(item.subtotal).toLocaleString('id-ID')}</span>
                      </div>
                    ))}
                  </div>
                )}

                {booking.complaint_notes && (
                  <p className="text-[11px] text-slate-500 italic">Keluhan: "{booking.complaint_notes}"</p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

QueueManagement.layout = (page) => <AdminLayout children={page} />;

export default QueueManagement;
