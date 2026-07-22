import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { Package, Search, ShieldAlert, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { INITIAL_SPAREPARTS } from '../../services/mockData';
import GuestLayout from '@/Layouts/GuestLayout';

const SparepartsCatalog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Pelumas', 'Filter', 'Pengereman', 'Pengapian'];

  const filteredParts = INITIAL_SPAREPARTS.filter((part) => {
    const matchesCat = selectedCategory === 'All' || part.category === selectedCategory;
    const matchesSearch =
      part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      part.part_code.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
      
      {/* Header & BR-005 Notice Banner */}
      <div className="space-y-4">
        <div className="border-b border-slate-200 pb-4 space-y-2">
          <div className="flex items-center space-x-2 text-xs font-semibold text-[#eb6905]">
            <Package className="h-4 w-4" />
            <span>Katalog Suku Cadang Bengkel</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#091426]">Informasi Suku Cadang & Spareparts</h1>
          <p className="text-xs text-slate-600">
            Katalog stok suku cadang original yang tersedia di gudang Bengkel Stelle.
          </p>
        </div>

        {/* BR-005 Business Rule Notice */}
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-900 flex items-start space-x-3 text-xs">
          <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">Ketentuan Pembelian Suku Cadang [BR-005]:</p>
            <p className="text-slate-700">
              Suku cadang diprioritaskan untuk pengerjaan servis fisik di bengkel dan <strong>tidak dapat dibeli secara retail online lepas</strong> tanpa membawa unit kendaraan. Seluruh harga tercantum adalah harga resmi pemasangan di lokasi.
            </p>
          </div>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari SKU atau nama sparepart..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-slate-50 pl-10 pr-4 py-2 text-xs font-medium text-slate-900 placeholder-slate-400 focus:border-[#eb6905] focus:outline-none"
          />
        </div>

        <div className="flex items-center space-x-1.5 overflow-x-auto w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-xl px-3.5 py-2 text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Spareparts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredParts.map((part) => (
          <div
            key={part.id}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="rounded-md bg-slate-100 px-2 py-1 font-mono text-xs font-bold text-slate-700">
                  {part.part_code}
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold text-slate-700 border border-slate-200">
                  {part.category}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900">{part.name}</h3>

              <div className="flex items-center space-x-2 text-xs">
                <span>Status Stok Gudang:</span>
                {part.stock > part.min_stock ? (
                  <span className="inline-flex items-center space-x-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-emerald-700 font-bold border border-emerald-200">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Tersedia ({part.stock} Unit)</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center space-x-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-amber-800 font-bold border border-amber-200">
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                    <span>Stok Tipis ({part.stock} Unit Left)</span>
                  </span>
                )}
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4 mt-4 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-semibold text-slate-400">Harga Resmi Unit</p>
                <p className="text-lg font-extrabold text-[#eb6905]">
                  Rp {part.selling_price.toLocaleString('id-ID')}
                </p>
              </div>

              <Link
                href="/customer/bookings"
                className="flex items-center space-x-1.5 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-[#eb6905] transition-colors"
              >
                <span>Booking Servis</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

SparepartsCatalog.layout = (page) => <GuestLayout children={page} />;

export default SparepartsCatalog;
