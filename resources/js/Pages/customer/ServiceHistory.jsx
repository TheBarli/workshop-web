import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import CustomerLayout from '@/Layouts/CustomerLayout';
import { History, Search, ChevronRight, Trash2 } from 'lucide-react';

const STATUS_BADGE = {
  pending:     { label: 'Menunggu',          cls: 'bg-amber-50 text-amber-700 border-amber-200' },
  confirmed:   { label: 'Dikonfirmasi',      cls: 'bg-blue-50 text-blue-700 border-blue-200' },
  in_progress: { label: 'Sedang Dikerjakan', cls: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  completed:   { label: 'Selesai',           cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  cancelled:   { label: 'Dibatalkan',        cls: 'bg-rose-50 text-rose-700 border-rose-200' },
};

const ServiceHistory = ({ bookings = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBookings = bookings.filter((b) => {
    const term = searchTerm.toLowerCase();
    return (
      b.booking_code?.toLowerCase().includes(term) ||
      b.vehicle?.license_plate?.toLowerCase().includes(term) ||
      b.vehicle?.brand?.toLowerCase().includes(term) ||
      b.vehicle?.model?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">

      {/* Header */}
      <div className="border-b border-slate-200 pb-6 space-y-2">
        <div className="flex items-center space-x-2 text-xs font-semibold text-[#eb6905]">
          <History className="h-4 w-4" />
          <span>Rekam Medis Kendaraan &amp; Riwayat Servis</span>
        </div>
        <h1 className="text-2xl font-extrabold text-[#091426]">Riwayat Booking &amp; Perbaikan Kendaraan</h1>
        <p className="text-xs text-slate-600">Seluruh pencatatan perbaikan dan transaksi tersimpan dalam database.</p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="Cari kode booking atau plat nomor..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-xl border border-slate-300 bg-white pl-10 pr-4 py-2 text-xs font-medium text-slate-900 focus:border-[#eb6905] focus:outline-none"
        />
      </div>

      {/* History List */}
      {filteredBookings.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-slate-200 p-12 text-center space-y-2">
          <History className="h-10 w-10 text-slate-300 mx-auto" />
          <p className="text-sm text-slate-500">
            {searchTerm ? 'Tidak ada hasil yang cocok.' : 'Belum ada riwayat booking.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((b) => (
            <div key={b.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:shadow-md transition-shadow space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs font-bold bg-slate-900 text-white px-2.5 py-1 rounded-lg">
                    {b.booking_code}
                  </span>
                  <span className="font-bold text-xs text-slate-900">
                    {b.vehicle?.license_plate} ({b.vehicle?.brand} {b.vehicle?.model})
                  </span>
                </div>
                <span className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase border ${STATUS_BADGE[b.status]?.cls ?? 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                  {STATUS_BADGE[b.status]?.label ?? b.status}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <p className="text-slate-500 font-medium">Jadwal Perbaikan:</p>
                  <p className="font-bold text-slate-900 mt-0.5">
                    {new Date(b.scheduled_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500 font-medium">Layanan Perbaikan:</p>
                  <p className="font-bold text-slate-900 mt-0.5 truncate">
                    {b.items && b.items.length > 0
                      ? b.items.map((item) => item.service?.name).filter(Boolean).join(', ')
                      : '—'}
                  </p>
                </div>
                <div className="flex items-center justify-end space-x-3">
                  <button
                    onClick={() => {
                      if (confirm('Hapus riwayat booking ini?')) {
                        router.delete(route('customer.bookings.destroy', b.id));
                      }
                    }}
                    className="flex items-center space-x-1 text-slate-400 hover:text-rose-600 transition-colors"
                    title="Hapus Booking"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Hapus</span>
                  </button>
                  <Link
                    href={`/customer/bookings/${b.id}`}
                    className="flex items-center space-x-1 font-bold text-[#eb6905] hover:underline"
                  >
                    <span>Lihat Detail</span>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

ServiceHistory.layout = (page) => <CustomerLayout children={page} />;

export default ServiceHistory;
