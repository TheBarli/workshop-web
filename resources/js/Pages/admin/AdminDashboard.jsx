import React from 'react';
import { Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
  CalendarCheck,
  ClipboardList,
  TrendingUp,
  AlertTriangle,
  Clock,
  ShoppingCart,
} from 'lucide-react';

const STATUS_BADGE = {
  pending:     { label: 'Menunggu',          cls: 'bg-amber-50 text-amber-800 border-amber-200' },
  confirmed:   { label: 'Dikonfirmasi',      cls: 'bg-blue-50 text-blue-800 border-blue-200' },
  in_progress: { label: 'Dikerjakan',        cls: 'bg-indigo-50 text-indigo-800 border-indigo-200' },
  completed:   { label: 'Selesai',           cls: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
  cancelled:   { label: 'Dibatalkan',        cls: 'bg-rose-50 text-rose-800 border-rose-200' },
};

const AdminDashboard = ({ stats = {}, recentBookings = [] }) => {
  const {
    totalBookings  = 0,
    activeQueue    = 0,
    totalCustomers = 0,
    totalRevenue   = 0,
  } = stats;

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#091426]">Monitoring Operasional Bengkel Real-Time</h1>
          <p className="text-xs text-slate-500 mt-1">
            Ringkasan antrean booking, status mekanik, dan transaksi kasir hari ini.
          </p>
        </div>
        <Link
          href="/admin/pos"
          className="flex items-center space-x-2 rounded-xl bg-[#eb6905] px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#d95d00]"
        >
          <ShoppingCart className="h-4 w-4" />
          <span>Terminal POS Kasir</span>
        </Link>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Antrean Aktif</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <CalendarCheck className="h-5 w-5" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-extrabold text-slate-900">{activeQueue} Unit</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Pending &amp; in-progress</p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Total Booking</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <ClipboardList className="h-5 w-5" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-extrabold text-slate-900">{totalBookings}</p>
            <p className="text-[11px] text-indigo-600 font-semibold mt-0.5">Semua waktu</p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Total Pelanggan</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <AlertTriangle className="h-5 w-5" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-extrabold text-slate-900">{totalCustomers}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Terdaftar di sistem</p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Total Omzet (Paid)</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div>
            <p className="text-xl font-extrabold text-emerald-600">
              Rp {Number(totalRevenue).toLocaleString('id-ID')}
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">Transaksi lunas</p>
          </div>
        </div>
      </div>

      {/* RECENT BOOKINGS TABLE */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
            <Clock className="h-4 w-4 text-[#eb6905]" />
            <span>Booking Terbaru</span>
          </h3>
          <Link href="/admin/schedule" className="text-xs font-bold text-[#eb6905] hover:underline">
            Kelola Antrean →
          </Link>
        </div>

        <div className="divide-y divide-slate-100">
          {recentBookings.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-8">Belum ada booking.</p>
          ) : (
            recentBookings.map((b) => (
              <div key={b.id} className="flex items-center justify-between px-6 py-3 hover:bg-slate-50 text-xs transition-colors">
                <div className="space-y-0.5">
                  <span className="font-mono font-bold text-slate-900">{b.booking_code}</span>
                  <p className="text-slate-600">
                    {b.vehicle?.license_plate} — {b.customer?.name}
                  </p>
                  <p className="text-slate-400 text-[11px]">
                    {new Date(b.scheduled_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  {b.mechanic && (
                    <span className="text-[11px] text-slate-500">🔧 {b.mechanic.name}</span>
                  )}
                  <span className={`font-bold text-[10px] px-2.5 py-1 rounded border ${STATUS_BADGE[b.status]?.cls ?? 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                    {STATUS_BADGE[b.status]?.label ?? b.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
};

AdminDashboard.layout = (page) => <AdminLayout children={page} />;

export default AdminDashboard;
