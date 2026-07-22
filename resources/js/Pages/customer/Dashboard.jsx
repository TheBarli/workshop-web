import React, { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import CustomerLayout from '@/Layouts/CustomerLayout';
import { mockApi } from '../../services/mockApi';
import {
  Car,
  Calendar,
  Clock,
  Wrench,
  Plus,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

const CustomerDashboard = () => {
  const { auth } = usePage().props;
  const user = auth?.user;
  const [vehicles, setVehicles] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const vData = await mockApi.getVehicles(user?.id || 1);
        const bData = await mockApi.getBookings(user?.id || 1);
        setVehicles(vData);
        setBookings(bData);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const activeBooking = bookings.find((b) => ['pending', 'confirmed', 'in_progress'].includes(b.status));

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

      {/* ACTIVE BOOKING HIGHLIGHT (IF ANY) */}
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
              <p className="font-bold text-slate-900 mt-0.5">{activeBooking.license_plate} ({activeBooking.vehicle_model})</p>
            </div>
            <div>
              <p className="text-slate-500 font-medium">Jadwal Servis</p>
              <p className="font-bold text-slate-900 mt-0.5">{activeBooking.booking_date} Jam {activeBooking.booking_time}</p>
            </div>
            <div>
              <p className="text-slate-500 font-medium">Status Pengerjaan</p>
              <span className="inline-block mt-0.5 rounded-full bg-indigo-100 px-2.5 py-0.5 font-bold text-indigo-800 uppercase text-[10px]">
                {activeBooking.status}
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
        
        {/* LEFT COLUMN: VEHICLES SECTION */}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {vehicles.map((v) => (
              <div
                key={v.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:shadow-md transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-lg bg-slate-900 px-3 py-1 font-mono text-xs font-bold text-white tracking-wider">
                    {v.license_plate}
                  </span>
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-700 border border-slate-200">
                    {v.type}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-900">{v.brand} {v.model}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Tahun {v.manufacture_year} • {v.engine_capacity} CC</p>
                </div>

                <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
                  <span className="text-[11px] text-emerald-600 font-medium flex items-center space-x-1">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>Terverifikasi</span>
                  </span>
                  <Link
                    href="/customer/bookings"
                    className="text-xs font-bold text-[#eb6905] hover:underline"
                  >
                    + Booking Servis
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: QUICK HISTORY SUMMARY */}
        <div className="space-y-6">
          <h2 className="text-lg font-bold text-[#091426] flex items-center space-x-2">
            <Clock className="h-5 w-5 text-indigo-600" />
            <span>Riwayat Booking Terakhir</span>
          </h2>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
            {bookings.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-6">Belum ada riwayat booking.</p>
            ) : (
              bookings.slice(0, 3).map((b) => (
                <div key={b.id} className="border-b border-slate-100 pb-3 last:border-0 last:pb-0 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-slate-900">{b.booking_code}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      b.status === 'sedang_dikerjakan' || b.status === 'in_progress'
                        ? 'bg-blue-100 text-blue-800'
                        : b.status === 'selesai' || b.status === 'completed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : b.status === 'diambil' || b.status === 'picked_up'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {b.status === 'sedang_dikerjakan' || b.status === 'in_progress'
                        ? 'Sedang Dikerjakan'
                        : b.status === 'selesai' || b.status === 'completed'
                        ? 'Selesai'
                        : b.status === 'diambil' || b.status === 'picked_up'
                        ? 'Diambil'
                        : 'Mengantri'}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-slate-700">{b.license_plate} - {b.booking_date}</p>
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
