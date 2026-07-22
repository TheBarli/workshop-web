import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { Wrench, Clock, ShieldCheck, Search, ArrowRight, Check } from 'lucide-react';
import { INITIAL_SERVICES } from '../../services/mockData';
import GuestLayout from '@/Layouts/GuestLayout';

const ServicesCatalog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Rutinkan', 'Performa', 'Keselamatan', 'Diagnostik', 'Berat'];

  const filteredServices = INITIAL_SERVICES.filter((service) => {
    const matchesCat = selectedCategory === 'All' || service.category === selectedCategory;
    const matchesSearch =
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.code.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
      
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-6 space-y-2">
        <div className="flex items-center space-x-2 text-xs font-semibold text-[#eb6905]">
          <Wrench className="h-4 w-4" />
          <span>Katalog Jasa & Layanan Bengkel</span>
        </div>
        <h1 className="text-3xl font-extrabold text-[#091426]">Daftar Layanan Perbaikan & Perawatan</h1>
        <p className="text-xs text-slate-600">
          Seluruh pengerjaan dilakukan oleh mekanik berpengalaman dengan standar operasional industri terpercaya.
        </p>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari berdasarkan nama atau kode paket..."
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

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <div
            key={service.id}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="rounded-md bg-slate-100 px-2 py-1 font-mono text-xs font-bold text-slate-700">
                  {service.code}
                </span>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-700 border border-emerald-200">
                  {service.category}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900">{service.name}</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">{service.description}</p>
              </div>

              <div className="flex items-center space-x-4 text-xs text-slate-500 pt-2 border-t border-slate-100">
                <div className="flex items-center space-x-1.5">
                  <Clock className="h-4 w-4 text-[#eb6905]" />
                  <span>Durasi: ~{service.estimated_duration_minutes} mnt</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <span>Garansi</span>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4 mt-4 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-semibold text-slate-400">Estimasi Biaya Jasa</p>
                <p className="text-lg font-extrabold text-[#eb6905]">
                  Rp {service.price.toLocaleString('id-ID')}
                </p>
              </div>

              <Link
                href="/customer/bookings"
                className="flex items-center space-x-1.5 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-[#eb6905] transition-colors"
              >
                <span>Pilih & Booking</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

ServicesCatalog.layout = (page) => <GuestLayout children={page} />;

export default ServicesCatalog;
