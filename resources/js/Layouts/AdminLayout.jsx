import React, { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import {
  Wrench,
  LayoutDashboard,
  CalendarCheck,
  ClipboardList,
  ShoppingCart,
  PackageSearch,
  BarChart3,
  LogOut,
  ChevronRight,
  UserCheck,
  Bell,
  ShieldAlert,
} from 'lucide-react';

const AdminLayout = ({ children }) => {
  const page = usePage();
  const { auth } = page.props;
  const user = auth?.user;
  const [collapsed, setCollapsed] = useState(false);
  const currentPath = new URL(page.url, window.location.origin).pathname;

  const isActive = (path) => currentPath === path;

  const getRoleBadge = (role) => {
    switch (role) {
      case 'owner':
        return { name: 'Owner Bengkel', color: 'bg-purple-500 text-white' };
      case 'mechanic':
        return { name: 'Mekanik Specialist', color: 'bg-indigo-500 text-white' };
      default:
        return { name: 'Admin / Kasir', color: 'bg-blue-500 text-white' };
    }
  };

  const roleInfo = getRoleBadge(user?.role || 'admin');

  return (
    <div className="flex min-h-screen bg-[#0b1c30] text-slate-100">
      
      {/* Admin Sidebar Container */}
      <aside
        className={`flex flex-col border-r border-slate-800 bg-[#091426] transition-all duration-300 ${
          collapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Sidebar Brand Header */}
        <div className="flex h-16 items-center justify-between border-b border-slate-800 px-4">
          <Link href="/" className="flex items-center space-x-3 overflow-hidden">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#eb6905] text-white shadow-md">
              <Wrench className="h-5 w-5" />
            </div>
            {!collapsed && (
              <div className="truncate">
                <span className="text-base font-bold text-white tracking-tight">Bengkel Stelle</span>
                <span className="ml-1 text-[10px] font-extrabold text-[#eb6905] uppercase">PANEL</span>
              </div>
            )}
          </Link>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <ChevronRight className={`h-4 w-4 transform transition-transform ${collapsed ? '' : 'rotate-180'}`} />
          </button>
        </div>

        {/* User Role Card */}
        <div className="border-b border-slate-800 p-3">
          <div className="flex items-center space-x-3 rounded-xl bg-slate-900/80 p-2.5 border border-slate-800">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
              alt={user?.name}
              className="h-9 w-9 rounded-full object-cover border border-slate-700 shrink-0"
            />
            {!collapsed && (
              <div className="truncate text-xs">
                <p className="font-bold text-white truncate">{user?.name}</p>
                <span className={`inline-block mt-0.5 rounded px-1.5 py-0.5 text-[9px] font-extrabold ${roleInfo.color}`}>
                  {roleInfo.name}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Menu Items */}
        <nav className="flex-1 space-y-1 p-3">
          <Link
            href="/admin/dashboard"
            className={`flex items-center space-x-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all ${
              isActive('/admin/dashboard')
                ? 'bg-[#eb6905] text-white shadow-lg shadow-[#eb6905]/20'
                : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <LayoutDashboard className="h-4 w-4 shrink-0" />
            {!collapsed && <span>Monitoring Dashboard</span>}
          </Link>

          <Link
            href="/admin/schedule"
            className={`flex items-center space-x-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all ${
              isActive('/admin/schedule')
                ? 'bg-[#eb6905] text-white shadow-lg shadow-[#eb6905]/20'
                : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <CalendarCheck className="h-4 w-4 shrink-0" />
            {!collapsed && <span>Slot & Queue Management</span>}
          </Link>

          <Link
            href="/admin/work-orders"
            className={`flex items-center space-x-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all ${
              isActive('/admin/work-orders')
                ? 'bg-[#eb6905] text-white shadow-lg shadow-[#eb6905]/20'
                : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <ClipboardList className="h-4 w-4 shrink-0" />
            {!collapsed && <span>Work Orders (Mekanik)</span>}
          </Link>

          <Link
            href="/admin/pos"
            className={`flex items-center space-x-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all ${
              isActive('/admin/pos')
                ? 'bg-[#eb6905] text-white shadow-lg shadow-[#eb6905]/20'
                : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <ShoppingCart className="h-4 w-4 shrink-0 text-amber-400" />
            {!collapsed && <span>POS Kasir & Thermal Print</span>}
          </Link>

          <Link
            href="/admin/inventory"
            className={`flex items-center space-x-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all ${
              isActive('/admin/inventory')
                ? 'bg-[#eb6905] text-white shadow-lg shadow-[#eb6905]/20'
                : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <PackageSearch className="h-4 w-4 shrink-0" />
            {!collapsed && <span>Inventory & Stock Control</span>}
          </Link>

          <Link
            href="/admin/reports"
            className={`flex items-center space-x-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all ${
              isActive('/admin/reports')
                ? 'bg-[#eb6905] text-white shadow-lg shadow-[#eb6905]/20'
                : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <BarChart3 className="h-4 w-4 shrink-0 text-emerald-400" />
            {!collapsed && <span>Laporan Keuangan & Analytics</span>}
          </Link>
        </nav>

        {/* Sidebar Footer Controls */}
        <div className="border-t border-slate-800 p-3 space-y-2">
          <Link
            href="/customer/dashboard"
            className="flex items-center justify-center space-x-2 rounded-xl bg-slate-800/60 px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            <span>Portal Customer</span>
          </Link>
          <button
            onClick={() => {
              router.post('/logout');
            }}
            className="flex w-full items-center justify-center space-x-2 rounded-xl bg-rose-500/10 px-3 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/20"
          >
            <LogOut className="h-4 w-4" />
            {!collapsed && <span>Keluar</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-x-hidden">
        
        {/* Top Panel Navbar */}
        <header className="flex h-16 items-center justify-between border-b border-slate-800 bg-[#091426]/90 px-6 backdrop-blur-md">
          <div className="flex items-center space-x-3">
            <span className="rounded-md bg-[#eb6905]/20 px-2 py-1 text-[11px] font-extrabold text-[#eb6905] border border-[#eb6905]/30">
              OPERATIONAL PANEL
            </span>
            <span className="text-xs text-slate-400 hidden sm:inline">
              Bengkel Stelle System v1.0.0
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-xs bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>System Live • Redis Queue Active</span>
            </div>

            <button className="relative rounded-lg bg-slate-900 p-2 text-slate-400 hover:text-white border border-slate-800">
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-[#eb6905] text-[9px] font-bold text-white">
                3
              </span>
            </button>
          </div>
        </header>

        {/* Page Content View */}
        <main className="flex-1 bg-[#f8f9ff] text-slate-900 p-6 overflow-y-auto">
          {children}
        </main>
      </div>

    </div>
  );
};

export default AdminLayout;
