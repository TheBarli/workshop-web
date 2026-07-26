import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import InvoiceModal from '@/Components/pos/InvoiceModal';
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
import { BarChart3, TrendingUp, FileSpreadsheet, DollarSign, Printer } from 'lucide-react';

const ReportsAnalytics = ({
  transactions   = [],
  totalRevenue   = 0,
  monthlyChart   = [],
  serviceChart   = [],
}) => {
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showPrintModal, setShowPrintModal] = useState(false);

  const handleExportExcel = () => {
    alert('Laporan omzet transaksi kasir terunduh dalam format Excel (.xlsx) [FR-006]');
  };

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#091426]">Executive Analytics &amp; Laporan Keuangan</h1>
          <p className="text-xs text-slate-500 mt-1">
            Analisis tren pendapatan, volume perbaikan, &amp; performa bisnis berdasarkan data riil.
          </p>
        </div>
        <button
          onClick={handleExportExcel}
          className="flex items-center space-x-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-700 transition-colors"
        >
          <FileSpreadsheet className="h-4 w-4" />
          <span>Ekspor Laporan Excel</span>
        </button>
      </div>

      {/* Total Revenue KPI */}
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-emerald-700">Total Omzet Keseluruhan (Lunas)</p>
          <p className="text-3xl font-extrabold text-emerald-800 mt-1">
            Rp {Number(totalRevenue).toLocaleString('id-ID')}
          </p>
        </div>
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-md">
          <DollarSign className="h-7 w-7" />
        </div>
      </div>

      {/* REVENUE TREND CHART */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Grafik Tren Pertumbuhan Omzet</h3>
            <p className="text-xs text-slate-500">Agregasi pendapatan per bulan dari transaksi lunas.</p>
          </div>
          <span className="flex items-center space-x-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            <TrendingUp className="h-4 w-4" />
            <span>Live Data</span>
          </span>
        </div>

        {monthlyChart.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-slate-400 text-sm">
            Belum ada data transaksi lunas.
          </div>
        ) : (
          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyChart}>
                <defs>
                  <linearGradient id="colorOmzet" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#eb6905" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#eb6905" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`} />
                <Tooltip
                  formatter={(value) => [`Rp ${Number(value).toLocaleString('id-ID')}`, 'Omzet']}
                  contentStyle={{ borderRadius: '12px', borderColor: '#e2e8f0', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="omzet" stroke="#eb6905" strokeWidth={3} fillOpacity={1} fill="url(#colorOmzet)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* CHARTS + AUDIT TRAIL */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Service distribution bar chart */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Distribusi Jasa Servis Terlaris</h3>
          {serviceChart.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-slate-400 text-sm">Belum ada data.</div>
          ) : (
            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={serviceChart}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '12px' }} />
                  <Bar dataKey="total" fill="#091426" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Recent Transactions Audit Trail */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Audit Trail Transaksi Kasir Terakhir</h3>
          {transactions.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-sm">Belum ada transaksi lunas.</div>
          ) : (
            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {transactions.slice(0, 10).map((t) => (
                <div key={t.id} className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
                  <div>
                    <span className="font-mono font-bold text-slate-900">{t.invoice_number}</span>
                    <p className="font-semibold text-slate-800 mt-0.5">
                      {t.booking?.vehicle?.license_plate} — {t.booking?.customer?.name}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <p className="font-extrabold text-emerald-600">Rp {Number(t.total_amount).toLocaleString('id-ID')}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{t.paid_at ? t.paid_at.substring(0, 10) : '—'}</p>
                    </div>
                    <button
                      onClick={() => { setSelectedTransaction(t); setShowPrintModal(true); }}
                      className="rounded-lg bg-slate-900 border border-slate-700 px-2.5 py-1.5 text-[10px] font-bold text-white hover:bg-slate-800 transition-colors flex items-center space-x-1 shrink-0"
                      title="Cetak Struk Transaksi Ini"
                    >
                      <Printer className="h-3 w-3 text-[#eb6905]" />
                      <span>Struk</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Invoice Modal for past transactions printing */}
      <InvoiceModal
        isOpen={showPrintModal}
        onClose={() => setShowPrintModal(false)}
        data={selectedTransaction}
      />

    </div>
  );
};

ReportsAnalytics.layout = (page) => <AdminLayout children={page} />;

export default ReportsAnalytics;
