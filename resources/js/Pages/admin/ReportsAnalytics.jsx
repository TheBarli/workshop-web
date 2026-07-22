import React, { useState, useEffect } from 'react';
import { mockApi } from '../../services/mockApi';
import AdminLayout from '@/Layouts/AdminLayout';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from 'recharts';
import { BarChart3, TrendingUp, Download, Calendar, DollarSign, Award, FileSpreadsheet } from 'lucide-react';

const ReportsAnalytics = () => {
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const inv = await mockApi.getInvoices();
      setInvoices(inv);
    };
    loadData();
  }, []);

  const revenueData = [
    { month: 'Jan', omzet: 45000000, bookings: 110 },
    { month: 'Feb', omzet: 52000000, bookings: 135 },
    { month: 'Mar', omzet: 61000000, bookings: 160 },
    { month: 'Apr', omzet: 58000000, bookings: 145 },
    { month: 'Mei', omzet: 75000000, bookings: 190 },
    { month: 'Jun', omzet: 89000000, bookings: 220 },
    { month: 'Jul', omzet: 104000000, bookings: 270 },
  ];

  const serviceDistributionData = [
    { name: 'Ganti Oli & Berkala', total: 145 },
    { name: 'Tune Up Injector', total: 92 },
    { name: 'Servis Rem Depan/Belakang', total: 78 },
    { name: 'Diagnostik ECU', total: 45 },
    { name: 'Overhaul Mesin', total: 12 },
  ];

  const handleExportExcel = () => {
    alert('Laporan omzet transaksi kasir terunduh dalam format Excel (.xlsx) [FR-006]');
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#091426]">Executive Analytics & Laporan Keuangan (Owner)</h1>
          <p className="text-xs text-slate-500 mt-1">
            Analisis tren pendapatan, volume unit perbaikan, & performa bisnis harian/bulanan.
          </p>
        </div>

        <button
          onClick={handleExportExcel}
          className="flex items-center space-x-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-700 transition-colors"
        >
          <FileSpreadsheet className="h-4 w-4" />
          <span>Ekspor Laporan Excel (.xlsx) [FR-006]</span>
        </button>
      </div>

      {/* REVENUE TREND LINE CHART */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Grafik Tren Pertumbuhan Omzet Keuangan (2026)</h3>
            <p className="text-xs text-slate-500">Agregasi pendapatan kotor + PPN 11% dari kasir POS.</p>
          </div>
          <span className="flex items-center space-x-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            <TrendingUp className="h-4 w-4" />
            <span>+28.4% YoY Growth</span>
          </span>
        </div>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="colorOmzet" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#eb6905" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#eb6905" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} tickFormatter={(value) => `${value / 1000000}M`} />
              <Tooltip
                formatter={(value) => [`Rp ${value.toLocaleString('id-ID')}`, 'Omzet']}
                contentStyle={{ borderRadius: '12px', borderColor: '#e2e8f0', fontSize: '12px' }}
              />
              <Area type="monotone" dataKey="omzet" stroke="#eb6905" strokeWidth={3} fillOpacity={1} fill="url(#colorOmzet)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* TOP SERVICES BAR CHART */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Distribusi Jasa Servis Terlaris</h3>
          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={serviceDistributionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '12px' }} />
                <Bar dataKey="total" fill="#091426" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* RECENT INVOICES AUDIT */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Audit Trail Transaksi Kasir Terakhir</h3>
          <div className="space-y-3">
            {invoices.map((inv) => (
              <div key={inv.id} className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
                <div>
                  <span className="font-mono font-bold text-slate-900">{inv.invoice_number}</span>
                  <p className="font-semibold text-slate-800 mt-0.5">{inv.license_plate} - {inv.customer_name}</p>
                </div>
                <div className="text-right">
                  <p className="font-extrabold text-emerald-600">Rp {inv.grand_total.toLocaleString('id-ID')}</p>
                  <p className="text-[10px] text-slate-400 font-mono">{inv.paid_at.substring(0, 10)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

ReportsAnalytics.layout = (page) => <AdminLayout children={page} />;

export default ReportsAnalytics;
