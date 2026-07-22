import React from 'react';
import { Link } from '@inertiajs/react';
import { Wrench, Phone, Mail, MapPin, Clock, ShieldCheck, Award } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-slate-200 bg-[#091426] text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          
          {/* Brand & Summary */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eb6905] text-white shadow-lg">
                <Wrench className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Bengkel <span className="text-[#eb6905]">Stelle</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Platform sistem manajemen bengkel otomotif terpadu. Mendigitalisasi reservasi servis online, penugasan mekanik real-time, POS kasir, dan audit stok persediaan.
            </p>
            <div className="flex items-center space-x-3 text-xs text-slate-300">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Garansi Pengerjaan & Suku Cadang Original 100%</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Navigasi Utama</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/" className="hover:text-white transition-colors">Beranda</Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white transition-colors">Katalog Layanan Servis</Link>
              </li>
              <li>
                <Link href="/spareparts" className="hover:text-white transition-colors">Katalog Suku Cadang</Link>
              </li>
              <li>
                <Link href="/customer/bookings" className="hover:text-white transition-colors">Online Booking Servis</Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition-colors">Portal Kasir & Admin</Link>
              </li>
            </ul>
          </div>

          {/* Jam Operasional */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Jam Operasional Bengkel</h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-[#eb6905]" />
                <span>Senin - Sabtu: 08.00 - 16.00 WIB</span>
              </div>
              <p className="pl-6 text-[11px] text-slate-500">Interval Slot: 08:00, 09:00, 10:00, 11:00, 13:00, 14:00, 15:00, 16:00 WIB</p>
              <p className="pl-6 text-[11px] font-semibold text-rose-400">Minggu & Hari Libur Nasional: TUTUP</p>
            </div>
          </div>

          {/* Kontak & Lokasi */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Kontak Bengkel Central</h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-[#eb6905] shrink-0 mt-0.5" />
                <span>Jl. Raya Automotive No. 88, Central Bengkel District, Jakarta Selatan</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-emerald-400" />
                <span>WhatsApp Official: 0812-3456-7890</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-blue-400" />
                <span>support@stelle.id</span>
              </div>
            </div>
          </div>

        </div>

        <div className="mt-8 border-t border-slate-800 pt-6 text-center text-xs text-slate-500 flex flex-col md:flex-row items-center justify-between">
          <p>© 2026 Bengkel Stelle Management System. Powered by React 19 & Laravel 12 Architecture.</p>
          <p className="mt-2 md:mt-0 text-[11px] text-slate-400">Terdaftar & Terverifikasi Joint Engineering Board</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
