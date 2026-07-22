import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
  Wrench,
  Calendar,
  ShieldCheck,
  Zap,
  Clock,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  PhoneCall,
  Search,
  Star,
  Users,
  Award,
} from 'lucide-react';
import { INITIAL_SERVICES, INITIAL_SPAREPARTS } from '../../services/mockData';

import GuestLayout from '@/Layouts/GuestLayout';

const LandingPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['All', 'Rutinkan', 'Performa', 'Keselamatan', 'Diagnostik'];

  const filteredServices = INITIAL_SERVICES.filter((service) => {
    const matchesCategory = selectedCategory === 'All' || service.category === selectedCategory;
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) || service.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-16 pb-16">

      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#091426] via-[#101f38] to-[#1e293b] pt-16 pb-24 text-white">
        {/* Decorative Grid Lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293d_1px,transparent_1px),linear-gradient(to_bottom,#1f293d_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">

            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7 space-y-6"
            >
              <div className="inline-flex items-center space-x-2 rounded-full border border-[#eb6905]/40 bg-[#eb6905]/10 px-4 py-1.5 text-xs font-semibold text-[#eb6905] backdrop-blur-md">
                <Sparkles className="h-4 w-4" />
                <span>Next-Gen Workshop Management System</span>
              </div>

              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-white leading-tight">
                Servis Kendaraan Tanpa Antre dengan <span className="text-[#eb6905]">Bengkel Stelle</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
                Digitalisasi seluruh reservasi perbaikan online, inspeksi mekanik real-time, transparansi estimasi biaya via WhatsApp, hingga garansi suku cadang original 100%.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
                <Link
                  href="/customer/bookings"
                  className="flex items-center justify-center space-x-2 rounded-xl bg-[#eb6905] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#eb6905]/30 hover:bg-[#d95d00] transition-all transform hover:-translate-y-0.5"
                >
                  <Calendar className="h-5 w-5" />
                  <span>Booking Servis Online Sekarang</span>
                </Link>

                <Link
                  href="/services"
                  className="flex items-center justify-center space-x-2 rounded-xl border border-slate-700 bg-slate-900/60 px-6 py-3.5 text-sm font-bold text-slate-200 hover:bg-slate-800 hover:text-white transition-all backdrop-blur-md"
                >
                  <span>Lihat Paket Layanan</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              {/* Key Trust Stats */}
              <div className="grid grid-cols-3 gap-4 border-t border-slate-800 pt-8 mt-6">
                <div>
                  <p className="text-2xl font-extrabold text-white sm:text-3xl">45%</p>
                  <p className="text-xs text-slate-400">Pengurangan Durasi Tunggu</p>
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-emerald-400 sm:text-3xl">99.5%</p>
                  <p className="text-xs text-slate-400">Akurasi Stok Suku Cadang</p>
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-[#eb6905] sm:text-3xl">4.9 / 5</p>
                  <p className="text-xs text-slate-400">Kepuasan Pelanggan (CSAT)</p>
                </div>
              </div>
            </motion.div>

            {/* Right Card / Visual Showcase */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-5"
            >
              <div className="rounded-2xl border border-slate-700/80 bg-slate-900/90 p-6 shadow-2xl backdrop-blur-xl space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">Live Slot Operational Status</h3>
                      <p className="text-xs text-slate-400">Hari ini: 08.00 - 16.00 WIB</p>
                    </div>
                  </div>
                  <span className="flex items-center space-x-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Tersedia</span>
                  </span>
                </div>

                {/* Quick Booking Preview Widget */}
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-slate-300">Slot Terpopuler Hari Ini:</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 text-center">
                      <p className="text-xs font-semibold text-slate-400">09:00 WIB</p>
                      <p className="text-xs font-bold text-emerald-400 mt-1">Sisa 2 Slot</p>
                    </div>
                    <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 text-center">
                      <p className="text-xs font-semibold text-slate-400">10:00 WIB</p>
                      <p className="text-xs font-bold text-emerald-400 mt-1">Sisa 4 Slot</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl bg-slate-950/80 p-4 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <span>Estimasi Pengerjaan Rutin:</span>
                    <span className="font-bold text-white">30 - 45 Menit</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <span>Notifikasi Update:</span>
                    <span className="font-bold text-[#eb6905]">WhatsApp Official</span>
                  </div>
                </div>

                <Link
                  href="/customer/bookings"
                  className="flex w-full items-center justify-center space-x-2 rounded-xl bg-[#eb6905] py-3 text-xs font-bold text-white hover:bg-[#d95d00] transition-colors"
                >
                  <span>Pilih Jam & Booking Sekarang</span>
                </Link>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* FEATURE HIGHLIGHTS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 max-w-2xl mx-auto mb-12">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700 border border-slate-200">
            Mengapa Memilih Bengkel Stelle?
          </span>
          <h2 className="text-3xl font-extrabold text-[#091426]">
            Solusi Servis Otomotif Modern Berbasis Teknologi Digital
          </h2>
          <p className="text-sm text-slate-600">
            Kami mengeliminasi keraguan, antrean panjang, dan ketidakjelasan biaya dengan transparansi penuh.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#eb6905]/10 text-[#eb6905]">
              <Calendar className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">1. Sistem Slot Booking Real-Time</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Pilih tanggal, jam, dan jenis servis kendaraan dari HP dalam kurang dari 2 menit. Kepastian slot tanpa membuang waktu mengantre di bengkel.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
              <Zap className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">2. Link Persetujuan WhatsApp</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Jika mekanik menemukan sparepart aus saat pembongkaran, rincian biaya langsung dikirim ke WhatsApp Anda untuk disetujui (*Approve/Reject*) sebelum pengerjaan diproses.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">3. Rekam Medis Servis Digital</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Seluruh riwayat perbaikan, oli yang digunakan, dan pergantian suku cadang tersimpan selamanya dalam akun kendaraan Anda.
            </p>
          </div>

        </div>
      </section>

      {/* LIVE SERVICES CATALOG PREVIEW */}
      <section className="bg-slate-100 py-16 border-y border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-[#091426]">Pilihan Paket & Layanan Servis</h2>
              <p className="text-xs text-slate-600">Transparansi harga jasa standar bengkel resmi terpercaya.</p>
            </div>

            {/* Search & Filter */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari layanan..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="rounded-xl border border-slate-300 bg-white pl-9 pr-4 py-2 text-xs font-medium text-slate-800 placeholder-slate-400 focus:border-[#eb6905] focus:outline-none"
                />
              </div>

              <div className="flex items-center space-x-1 overflow-x-auto">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors ${selectedCategory === cat
                        ? 'bg-[#091426] text-white shadow-sm'
                        : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-[11px] font-bold text-slate-700">
                      {service.code}
                    </span>
                    <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                      {service.category}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900">{service.name}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{service.description}</p>
                </div>

                <div className="border-t border-slate-100 pt-4 mt-4 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-semibold text-slate-400">Estimasi Harga Jasa</p>
                    <p className="text-base font-extrabold text-[#eb6905]">
                      Rp {service.price.toLocaleString('id-ID')}
                    </p>
                  </div>

                  <Link
                    href="/customer/bookings"
                    className="flex items-center space-x-1 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-[#eb6905] transition-colors"
                  >
                    <span>Pilih Layanan</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* CTA BANNER */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-[#091426] to-[#1e293b] p-8 md:p-12 text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 border border-slate-800">
          <div className="space-y-3 max-w-xl">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Siap Melakukan Servis Kendaraan Anda Hari Ini?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Daftarkan unit kendaraan Anda sekarang dan dapatkan kepastian slot perbaikan tanpa perlu menelepon bengkel.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link
              href="/register"
              className="rounded-xl bg-[#eb6905] px-6 py-3.5 text-xs font-bold text-white shadow-lg hover:bg-[#d95d00] transition-colors text-center"
            >
              Daftar Akun Gratis
            </Link>
            <Link
              href="/customer/bookings"
              className="rounded-xl border border-slate-700 bg-slate-900 px-6 py-3.5 text-xs font-bold text-slate-200 hover:bg-slate-800 transition-colors text-center"
            >
              Langsung Booking Servis
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

LandingPage.layout = (page) => <GuestLayout children={page} />;

export default LandingPage;
