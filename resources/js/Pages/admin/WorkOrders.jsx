import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { ClipboardList, Wrench, CheckCircle2, Car, Search } from 'lucide-react';

const STATUS_BADGE = {
  pending:     { label: 'Menunggu',          cls: 'bg-amber-50 text-amber-800 border-amber-200' },
  confirmed:   { label: 'Dikonfirmasi',      cls: 'bg-blue-50 text-blue-800 border-blue-200' },
  in_progress: { label: 'Sedang Dikerjakan', cls: 'bg-indigo-50 text-indigo-800 border-indigo-200' },
  completed:   { label: 'Selesai',           cls: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
  cancelled:   { label: 'Dibatalkan',        cls: 'bg-rose-50 text-rose-800 border-rose-200' },
};

const WorkOrders = ({ workOrders = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const filtered = workOrders.filter((b) => {
    const term = searchTerm.toLowerCase();
    return (
      b.booking_code?.toLowerCase().includes(term) ||
      b.vehicle?.license_plate?.toLowerCase().includes(term) ||
      b.customer?.name?.toLowerCase().includes(term)
    );
  });

  const handleStatusChange = (bookingId, newStatus) => {
    setUpdatingId(bookingId);
    router.patch(
      route('admin.bookings.status', bookingId),
      { status: newStatus },
      { onFinish: () => setUpdatingId(null) }
    );
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#091426]">Work Orders — Pengerjaan Mekanik</h1>
          <p className="text-xs text-slate-500 mt-1">Pantau dan perbarui status pengerjaan setiap unit kendaraan.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari kode, plat, atau pelanggan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:border-[#eb6905] focus:outline-none w-64"
          />
        </div>
      </div>

      {/* Cards */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-slate-200 p-12 text-center space-y-2">
          <ClipboardList className="h-10 w-10 text-slate-300 mx-auto" />
          <p className="text-sm text-slate-500">Tidak ada work order ditemukan.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map((booking) => (
            <div key={booking.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4 hover:shadow-md transition-shadow">
              {/* Card header */}
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold bg-slate-900 text-white px-2.5 py-1 rounded-lg">
                      {booking.booking_code}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${STATUS_BADGE[booking.status]?.cls ?? 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                      {STATUS_BADGE[booking.status]?.label ?? booking.status}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1 text-xs text-slate-600">
                    <Car className="h-3.5 w-3.5" />
                    <span className="font-bold">{booking.vehicle?.license_plate}</span>
                    <span>({booking.vehicle?.brand} {booking.vehicle?.model})</span>
                  </div>
                  <p className="text-xs text-slate-500">Pelanggan: <strong>{booking.customer?.name}</strong></p>
                  {booking.mechanic && (
                    <p className="text-xs text-indigo-600 font-semibold">🔧 Mekanik: {booking.mechanic.name}</p>
                  )}
                </div>
              </div>

              {/* Service items */}
              {booking.items && booking.items.length > 0 && (
                <div className="rounded-xl bg-slate-50 border border-slate-100 p-3 text-xs space-y-1">
                  <p className="font-semibold text-slate-700 mb-1.5">Layanan:</p>
                  {booking.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-slate-600">
                      <span>• {item.service?.name}</span>
                      <span className="font-semibold">Rp {Number(item.subtotal).toLocaleString('id-ID')}</span>
                    </div>
                  ))}
                </div>
              )}

              {booking.complaint_notes && (
                <p className="text-[11px] text-slate-500 italic border-t border-slate-100 pt-2">
                  Keluhan: "{booking.complaint_notes}"
                </p>
              )}

              {/* Status actions */}
              <div className="flex items-center space-x-2 pt-2 border-t border-slate-100">
                {booking.status === 'pending' && (
                  <button
                    onClick={() => handleStatusChange(booking.id, 'confirmed')}
                    disabled={updatingId === booking.id}
                    className="flex-1 rounded-lg bg-blue-600 py-1.5 text-xs font-bold text-white hover:bg-blue-700 disabled:opacity-50"
                  >
                    Konfirmasi
                  </button>
                )}
                {booking.status === 'confirmed' && (
                  <button
                    onClick={() => handleStatusChange(booking.id, 'in_progress')}
                    disabled={updatingId === booking.id}
                    className="flex-1 rounded-lg bg-indigo-600 py-1.5 text-xs font-bold text-white hover:bg-indigo-700 disabled:opacity-50"
                  >
                    <Wrench className="h-3.5 w-3.5 inline mr-1" />
                    Mulai Kerjakan
                  </button>
                )}
                {booking.status === 'in_progress' && (
                  <button
                    onClick={() => handleStatusChange(booking.id, 'completed')}
                    disabled={updatingId === booking.id}
                    className="flex-1 rounded-lg bg-emerald-600 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-50"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 inline mr-1" />
                    Tandai Selesai
                  </button>
                )}
                {(booking.status === 'completed' || booking.status === 'cancelled') && (
                  <span className="text-xs text-slate-400 italic">Tidak ada aksi tersedia</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

WorkOrders.layout = (page) => <AdminLayout children={page} />;

export default WorkOrders;
