import React, { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { mockApi } from '../../services/mockApi';
import CustomerLayout from '@/Layouts/CustomerLayout';
import { History, Calendar, Search, ArrowRight, ChevronRight } from 'lucide-react';

const ServiceHistory = () => {
  const { auth } = usePage().props;
  const user = auth?.user;
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const data = await mockApi.getBookings(user?.id || 1);
        setBookings(data);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [user]);

  const filteredBookings = bookings.filter(
    (b) =>
      b.booking_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.license_plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.vehicle_model.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      
      {/* Header */}
      <div className="border-b border-slate-200 pb-6 space-y-2">
        <div className="flex items-center space-x-2 text-xs font-semibold text-[#eb6905]">
          <History className="h-4 w-4" />
          <span>Rekam Medis Kendaraan & Riwayat Servis</span>
        </div>
        <h1 className="text-2xl font-extrabold text-[#091426]">Riwayat Booking & Perbaikan Kendaraan</h1>
        <p className="text-xs text-slate-600">
          Seluruh pencatatan perbaikan dan transaksi tersimpan selamanya dalam database.
        </p>
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
      <div className="space-y-4">
        {filteredBookings.map((b) => (
          <div
            key={b.id}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs hover:shadow-md transition-shadow space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <span className="font-mono text-xs font-bold bg-slate-900 text-white px-2.5 py-1 rounded-lg">
                  {b.booking_code}
                </span>
                <span className="font-bold text-xs text-slate-900">{b.license_plate} ({b.vehicle_model})</span>
              </div>
              <span className="inline-block rounded-full bg-indigo-50 px-2.5 py-0.5 text-[10px] font-bold text-indigo-700 uppercase border border-indigo-200">
                Status: {b.status}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <p className="text-slate-500 font-medium">Jadwal Perbaikan:</p>
                <p className="font-bold text-slate-900 mt-0.5">{b.booking_date} Pukul {b.booking_time}</p>
              </div>
              <div>
                <p className="text-slate-500 font-medium">Layanan Perbaikan:</p>
                <p className="font-bold text-slate-900 mt-0.5 truncate">
                  {b.services.map((s) => s.name).join(', ')}
                </p>
              </div>
              <div className="flex items-center justify-end">
                <Link
                  href={`/customer/bookings/${b.id}`}
                  className="flex items-center space-x-1 font-bold text-[#eb6905] hover:underline"
                >
                  <span>Lihat Detail Tracking</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

ServiceHistory.layout = (page) => <CustomerLayout children={page} />;

export default ServiceHistory;
