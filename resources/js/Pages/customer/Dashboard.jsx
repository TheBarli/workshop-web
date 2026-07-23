import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import CustomerLayout from '@/Layouts/CustomerLayout';
import {
  Car,
  Calendar,
  Clock,
  Wrench,
  Plus,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

const STATUS_MAP = {
  pending:     { label: 'Menunggu Konfirmasi', cls: 'bg-amber-100 text-amber-800' },
  confirmed:   { label: 'Dikonfirmasi',        cls: 'bg-blue-100 text-blue-800' },
  in_progress: { label: 'Sedang Dikerjakan',   cls: 'bg-indigo-100 text-indigo-800' },
  completed:   { label: 'Selesai',             cls: 'bg-emerald-100 text-emerald-800' },
  cancelled:   { label: 'Dibatalkan',          cls: 'bg-rose-100 text-rose-800' },
};

const CustomerDashboard = ({ recentBookings = [], vehicles = [] }) => {
  const { auth } = usePage().props;
  const user = auth?.user;

  const activeBooking = recentBookings.find((b) =>
    ['pending', 'confirmed', 'in_progress'].includes(b.status)
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">

      {/* Welcome Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#091426] via-[#101f38] to-[#1e293b] p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-slate-800">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 rounded-full bg-[#eb6905]/20 px-3 py-1 text-xs font-semibold text-[#eb6905] border border-[#eb6905]/30">
            <span>Portal Pelanggan Bengkel Stelle</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Selamat Datang, {user?.name || 'Pelanggan'}! 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Kelola unit kendaraan, buat reservasi servis online, dan pantau status pengerjaan secara real-time.
          </p>
        </div>

        <Link
          href="/customer/bookings"
          className="flex items-center space-x-2 rounded-xl bg-[#eb6905] px-5 py-3 text-xs font-bold text-white shadow-lg hover:bg-[#d95d00] transition-all transform hover:-translate-y-0.5 shrink-0"
        >
          <Calendar className="h-4 w-4" />
          <span>Buat Booking Baru</span>
        </Link>
      </div>

      {/* ACTIVE BOOKING HIGHLIGHT */}
      {activeBooking && (
        <div className="rounded-2xl border border-indigo-200 bg-gradient-to-r from-indigo-50/90 to-blue-50/90 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="flex h-3 w-3 rounded-full bg-indigo-600 animate-ping" />
              <h3 className="text-sm font-bold text-indigo-950">Status Reservasi Aktif Saat Ini</h3>
            </div>
            <span className="font-mono text-xs font-bold text-indigo-900 bg-white px-2.5 py-1 rounded-lg border border-indigo-200 shadow-xs">
              {activeBooking.booking_code}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white/80 backdrop-blur-md p-4 rounded-xl border border-indigo-100 text-xs">
            <div>
              <p className="text-slate-500 font-medium">Kendaraan</p>
              <p className="font-bold text-slate-900 mt-0.5">
                {activeBooking.vehicle?.license_plate} ({activeBooking.vehicle?.brand} {activeBooking.vehicle?.model})
              </p>
            </div>
            <div>
              <p className="text-slate-500 font-medium">Jadwal Servis</p>
              <p className="font-bold text-slate-900 mt-0.5">
                {new Date(activeBooking.scheduled_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
              </p>
            </div>
            <div>
              <p className="text-slate-500 font-medium">Status Pengerjaan</p>
              <span className={`inline-block mt-0.5 rounded-full px-2.5 py-0.5 font-bold uppercase text-[10px] ${STATUS_MAP[activeBooking.status]?.cls ?? 'bg-slate-100 text-slate-700'}`}>
                {STATUS_MAP[activeBooking.status]?.label ?? activeBooking.status}
              </span>
            </div>
            <div className="flex items-center justify-end">
              <Link
                href={`/customer/bookings/${activeBooking.id}`}
                className="flex items-center space-x-1 font-bold text-[#eb6905] hover:underline"
              >
                <span>Lihat Detail Tracking</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT: VEHICLES */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#091426] flex items-center space-x-2">
              <Car className="h-5 w-5 text-[#eb6905]" />
              <span>Kendaraan Terdaftar ({vehicles.length})</span>
            </h2>
            <Link
              href="/customer/vehicles"
              className="text-xs font-semibold text-[#eb6905] hover:underline flex items-center space-x-1"
            >
              <span>Kelola Kendaraan</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {vehicles.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-slate-200 p-8 text-center space-y-3">
              <Car className="h-10 w-10 text-slate-300 mx-auto" />
              <p className="text-sm text-slate-500">Belum ada kendaraan terdaftar.</p>
              <Link href="/customer/vehicles" className="inline-flex items-center space-x-1 text-xs font-bold text-[#eb6905] hover:underline">
                <Plus className="h-3.5 w-3.5" />
                <span>Tambah Kendaraan Pertama</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {vehicles.map((v) => (
                <div key={v.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:shadow-md transition-all space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="rounded-lg bg-slate-900 px-3 py-1 font-mono text-xs font-bold text-white tracking-wider">
                      {v.license_plate}
                    </span>
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-700 border border-slate-200">
                      {v.year}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{v.brand} {v.model}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{v.color && `Warna: ${v.color}`}</p>
                  </div>
                  <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
                    <span className="text-[11px] text-emerald-600 font-medium flex items-center space-x-1">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      <span>Terdaftar</span>
                    </span>
                    <Link href="/customer/bookings" className="text-xs font-bold text-[#eb6905] hover:underline">
                      + Booking Servis
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: RECENT BOOKINGS */}
        <div className="space-y-6">
          <h2 className="text-lg font-bold text-[#091426] flex items-center space-x-2">
            <Clock className="h-5 w-5 text-indigo-600" />
            <span>Riwayat Booking Terakhir</span>
          </h2>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
            {recentBookings.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-6">Belum ada riwayat booking.</p>
            ) : (
              recentBookings.slice(0, 3).map((b) => (
                <div key={b.id} className="border-b border-slate-100 pb-3 last:border-0 last:pb-0 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-slate-900">{b.booking_code}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${STATUS_MAP[b.status]?.cls ?? 'bg-slate-100 text-slate-700'}`}>
                      {STATUS_MAP[b.status]?.label ?? b.status}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-slate-700">
                    {b.vehicle?.license_plate} — {new Date(b.scheduled_at).toLocaleDateString('id-ID')}
                  </p>
                </div>
              ))
            )}

            <Link
              href="/customer/history"
              className="block w-full text-center rounded-xl bg-slate-100 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-200 transition-colors"
            >
              Lihat Seluruh Riwayat Servis
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

CustomerDashboard.layout = (page) => <CustomerLayout children={page} />;

export default CustomerDashboard;
