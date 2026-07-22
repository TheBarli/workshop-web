import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { mockApi } from '../../services/mockApi';
import AdminLayout from '@/Layouts/AdminLayout';
import {
  LayoutDashboard,
  CalendarCheck,
  ClipboardList,
  ShoppingCart,
  PackageSearch,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  Users,
  CheckCircle2,
  Clock,
  Car,
} from 'lucide-react';

const AdminDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [workOrders, setWorkOrders] = useState([]);
  const [spareparts, setSpareparts] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      try {
        const b = await mockApi.getBookings();
        const wo = await mockApi.getWorkOrders();
        const sp = await mockApi.getSpareparts();
        const inv = await mockApi.getInvoices();
        setBookings(b);
        setWorkOrders(wo);
        setSpareparts(sp);
        setInvoices(inv);
      } finally {
        setLoading(false);
      }
    };
    loadAll();
  }, []);

  const totalRevenue = invoices.reduce((acc, curr) => acc + curr.grand_total, 0);
  const criticalStockCount = spareparts.filter((p) => p.stock <= p.min_stock).length;
  const activeQueueCount = bookings.filter((b) => ['pending', 'confirmed', 'in_progress'].includes(b.status)).length;

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#091426]">Monitoring Operasional Bengkel Real-Time</h1>
          <p className="text-xs text-slate-500 mt-1">
            Ringkasan antrean booking, status pit bays mekanik, dan transaksi kasir hari ini.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Link
            href="/admin/pos"
            className="flex items-center space-x-2 rounded-xl bg-[#eb6905] px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#d95d00]"
          >
            <ShoppingCart className="h-4 w-4" />
            <span>Terminal POS Kasir</span>
          </Link>
        </div>
      </div>

      {/* TOP KPI SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Antrean Aktif Hari Ini</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <CalendarCheck className="h-5 w-5" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-extrabold text-slate-900">{activeQueueCount} Unit</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Sisa slot terkonfirmasi</p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Pengerjaan Mekanik (WO)</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <ClipboardList className="h-5 w-5" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-extrabold text-slate-900">{workOrders.length} WO</p>
            <p className="text-[11px] text-indigo-600 font-semibold mt-0.5">Sedang di pit bays</p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Stok Kritikal Gudang</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <AlertTriangle className="h-5 w-5" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-extrabold text-amber-600">{criticalStockCount} SKU</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Stok dibawah threshold minimum</p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Omzet Transaksi Kasir</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div>
            <p className="text-xl font-extrabold text-emerald-600">
              Rp {totalRevenue.toLocaleString('id-ID')}
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">Sudah termasuk PPN 11%</p>
          </div>
        </div>

      </div>

      {/* LIVE QUEUE & WORK ORDERS SUMMARY */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* LIVE ANTREAN */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <Clock className="h-4 w-4 text-[#eb6905]" />
              <span>Antrean Check-In Masuk Hari Ini</span>
            </h3>
            <Link href="/admin/schedule" className="text-xs font-bold text-[#eb6905] hover:underline">
              Lihat Semua Slot →
            </Link>
          </div>

          <div className="space-y-3">
            {bookings.slice(0, 4).map((b) => (
              <div key={b.id} className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
                <div>
                  <span className="font-mono font-bold text-slate-900">{b.booking_code}</span>
                  <p className="font-bold text-slate-800 mt-0.5">{b.license_plate} ({b.user_name})</p>
                  <p className="text-slate-500 text-[11px]">Jam: {b.booking_time}</p>
                </div>
                <span className={`font-bold text-[10px] px-2.5 py-1 rounded border ${
                  b.status === 'sedang_dikerjakan' || b.status === 'in_progress'
                    ? 'bg-blue-50 text-blue-800 border-blue-200'
                    : b.status === 'selesai' || b.status === 'completed'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : b.status === 'diambil' || b.status === 'picked_up'
                    ? 'bg-purple-50 text-purple-800 border-purple-200'
                    : 'bg-amber-50 text-amber-800 border-amber-200'
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
            ))}
          </div>
        </div>

        {/* WORK ORDER MEKANIK */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <ClipboardList className="h-4 w-4 text-indigo-600" />
              <span>Pengerjaan Mekanik Aktif (Pit Bays)</span>
            </h3>
            <Link href="/admin/work-orders" className="text-xs font-bold text-[#eb6905] hover:underline">
              Kanban Board →
            </Link>
          </div>

          <div className="space-y-3">
            {workOrders.map((wo) => (
              <div key={wo.id} className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-slate-900">{wo.work_order_number}</span>
                  <span className="font-bold text-[10px] text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded">
                    {wo.status}
                  </span>
                </div>
                <p className="font-semibold text-slate-800">{wo.license_plate} • Mekanik: {wo.mechanic_name}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

AdminDashboard.layout = (page) => <AdminLayout children={page} />;

export default AdminDashboard;
