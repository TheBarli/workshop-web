import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import Navbar from '../Components/common/Navbar';
import Footer from '../Components/common/Footer';
import { LayoutDashboard, Car, Calendar, History, User } from 'lucide-react';

const CustomerLayout = ({ children }) => {
  const page = usePage();
  const currentPath = new URL(page.url, window.location.origin).pathname;
  const isActive = (path) => currentPath === path;

  return (
    <div className="flex min-h-screen flex-col bg-[#f8f9ff]">
      <Navbar />

      {/* Customer Sub Header Navigation Bar */}
      <div className="border-b border-slate-200 bg-white shadow-xs">
        <div className="mx-auto flex max-w-7xl items-center space-x-1 px-4 py-2 overflow-x-auto">
          <Link
            href="/customer/dashboard"
            className={`flex items-center space-x-2 rounded-lg px-3.5 py-2 text-xs font-semibold whitespace-nowrap transition-colors ${isActive('/customer/dashboard')
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>Dashboard</span>
          </Link>
          <Link
            href="/customer/vehicles"
            className={`flex items-center space-x-2 rounded-lg px-3.5 py-2 text-xs font-semibold whitespace-nowrap transition-colors ${isActive('/customer/vehicles')
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
          >
            <Car className="h-4 w-4" />
            <span>Kendaraan Saya</span>
          </Link>
          <Link
            href="/customer/bookings"
            className={`flex items-center space-x-2 rounded-lg px-3.5 py-2 text-xs font-semibold whitespace-nowrap transition-colors ${isActive('/customer/bookings')
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
          >
            <Calendar className="h-4 w-4 text-[#eb6905]" />
            <span>Booking Servis</span>
          </Link>
          <Link
            href="/customer/history"
            className={`flex items-center space-x-2 rounded-lg px-3.5 py-2 text-xs font-semibold whitespace-nowrap transition-colors ${isActive('/customer/history')
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
          >
            <History className="h-4 w-4" />
            <span>Riwayat & Tracking Servis</span>
          </Link>
        </div>
      </div>

      <main className="flex-1 pb-12">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default CustomerLayout;
