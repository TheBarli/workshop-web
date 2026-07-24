import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { Package, Search, CheckCircle2, AlertTriangle, ArrowRight, Wrench } from 'lucide-react';
import { INITIAL_SPAREPARTS } from '../../services/mockData';
import GuestLayout from '@/Layouts/GuestLayout';

const SPAREPART_IMAGES = {
  'SP-001': 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=500', // Oli Mesin
  'SP-002': 'https://images.unsplash.com/photo-1558442074-3c19857bc1dc?w=500', // Kampas Rem
  'SP-003': 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=500', // Busi Iridium
  'SP-004': 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=500', // Filter Oli
  'SP-005': 'https://images.unsplash.com/photo-1578844251758-2f71da64c96f?w=500', // Akumulator / Aki
  'SP-006': 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=500', // Ban Mobil
};

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=500';

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
      
      {/* Header Banner */}
      <div className="space-y-4">
        <div className="border-b border-slate-200 pb-4 space-y-2">
          <div className="flex items-center space-x-2 text-xs font-semibold text-[#eb6905]">
            <Package className="h-4 w-4" />
            <span>Katalog Suku Cadang Bengkel</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#091426]">Katalog Suku Cadang &amp; Sparepart Original</h1>
          <p className="text-xs text-slate-600">
            Daftar stok suku cadang resmi terlengkap beserta gambar visual dan informasi ketersediaan stok.
          </p>
        </div>

        {/* Ketentuan Pembelian BR-005 Notice */}
        <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-4 text-amber-900 flex items-start space-x-3 text-xs shadow-xs">
          <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">Ketentuan Pembelian &amp; Pemasangan Suku Cadang [BR-005]:</p>
            <p className="text-slate-700 leading-relaxed">
              Seluruh suku cadang diprioritaskan untuk reservasi penggantian fisik di lokasi bengkel agar terjamin keaslian dan presisi garansinya. Harga sudah termasuk konsultasi mekanik.
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
            placeholder="Cari kode SKU atau nama sparepart..."
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

      {/* Spareparts Grid with Product Images */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredParts.map((part) => {
          const imgUrl = SPAREPART_IMAGES[part.part_code] || DEFAULT_IMAGE;
          return (
            <div
              key={part.id}
              className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              {/* Product Image & Badges */}
              <div className="relative h-48 bg-slate-100 overflow-hidden">
                <img
                  src={imgUrl}
                  alt={part.name}
                  className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                />
                <div className="absolute top-3 left-3 flex items-center space-x-2">
                  <span className="rounded-lg bg-slate-900/90 backdrop-blur-xs px-2.5 py-1 font-mono text-[10px] font-bold text-white shadow-md">
                    {part.part_code}
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <span className="rounded-full bg-white/90 backdrop-blur-xs px-3 py-1 text-[10px] font-bold text-slate-800 shadow-md border border-slate-200">
                    {part.category}
                  </span>
                </div>
              </div>

              {/* Product Details */}
              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-slate-900 leading-snug">{part.name}</h3>

                  <div className="flex items-center space-x-2 text-xs">
                    <span className="text-slate-500">Stok Gudang:</span>
                    {part.stock > part.min_stock ? (
                      <span className="inline-flex items-center space-x-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-emerald-700 font-bold border border-emerald-200">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                        <span>Tersedia ({part.stock} Unit)</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-amber-800 font-bold border border-amber-200">
                        <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                        <span>Stok Menipis ({part.stock} Unit Left)</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-4 mt-3 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-semibold text-slate-400">Harga Unit Resmi</p>
                    <p className="text-lg font-extrabold text-[#eb6905]">
                      Rp {part.selling_price.toLocaleString('id-ID')}
                    </p>
                  </div>

                  <Link
                    href="/customer/bookings"
                    className="flex items-center space-x-1.5 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-[#eb6905] transition-colors"
                  >
                    <Package className="h-3.5 w-3.5 text-[#eb6905]" />
                    <span>Pesan / Reservasi Sparepart</span>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};

SparepartsCatalog.layout = (page) => <GuestLayout children={page} />;

export default SparepartsCatalog;
