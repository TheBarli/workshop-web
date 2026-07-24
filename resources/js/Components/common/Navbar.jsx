import React, { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import {
  Wrench,
  User,
  LogOut,
  Calendar,
  Package,
  FileText,
  Shield,
  Menu,
  X,
  ChevronDown,
  LayoutDashboard,
  Car,
  Receipt,
  UserCheck,
} from 'lucide-react';

const Navbar = () => {
  const page = usePage();
  const { auth } = page.props;
  const user = auth?.user;
  const isAuthenticated = !!user;

  const logout = () => {
    router.post('/logout');
  };

  const switchRole = (role) => {
    router.post('/switch-role', { role });
  };
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const currentPath = new URL(page.url, window.location.origin).pathname;

  const isActive = (path) => currentPath === path;

  const handleRoleChange = (role) => {
    switchRole(role);
    setRoleDropdownOpen(false);
    setMobileMenuOpen(false);
    if (role === 'customer') router.visit('/customer/dashboard');
    else if (role === 'mechanic') router.visit('/admin/schedule');
    else if (role === 'admin') router.visit('/admin/dashboard');
    else if (role === 'owner') router.visit('/admin/reports');
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'owner':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'admin':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'mechanic':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      default:
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8 relative">

        {/* Brand Logo */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#091426] to-[#1e293b] text-white shadow-md shadow-slate-900/10 transition-transform duration-200 group-hover:scale-105">
            <Wrench className="h-5 w-5 text-[#eb6905]" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-[#091426]">
              Bengkel <span className="text-[#eb6905]">Stelle</span>
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links (Centered) */}
        <nav className="hidden items-center space-x-1 md:flex md:absolute md:left-1/2 md:-translate-x-1/2">
          <Link
            href="/"
            className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${isActive('/') ? 'bg-slate-100 text-[#091426]' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
          >
            Beranda
          </Link>
          <Link
            href="/services"
            className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${isActive('/services') ? 'bg-slate-100 text-[#091426]' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
          >
            Layanan Servis
          </Link>
          <Link
            href="/spareparts"
            className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${isActive('/spareparts') ? 'bg-slate-100 text-[#091426]' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
          >
            Katalog Sparepart
          </Link>

          {isAuthenticated && (
            <>
              {user?.role === 'customer' && (
                <>
                  <Link
                    href="/customer/dashboard"
                    className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${isActive('/customer/dashboard') ? 'bg-slate-100 text-[#091426]' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                  >
                    Dashboard Saya
                  </Link>
                  <Link
                    href="/customer/bookings"
                    className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${isActive('/customer/bookings') ? 'bg-slate-100 text-[#091426]' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                  >
                    Booking Servis
                  </Link>
                </>
              )}

              {['admin', 'owner', 'mechanic'].includes(user?.role) && (
                <Link
                  href={user?.role === 'mechanic' ? '/admin/schedule' : user?.role === 'owner' ? '/admin/reports' : '/admin/dashboard'}
                  className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800 transition-colors flex items-center space-x-1.5"
                >
                  <LayoutDashboard className="h-4 w-4 text-[#eb6905]" />
                  <span>Admin Workbench</span>
                </Link>
              )}
            </>
          )}
        </nav>

        {/* Right Action Controls: Quick Role Switcher + Profile */}
        <div className="hidden items-center space-x-3 md:flex">

          {/* DEMO ROLE SWITCHER WIDGET */}
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center space-x-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
              title="Klik untuk mensimulasikan role tampilan (Demo Switcher)"
            >
              <UserCheck className="h-3.5 w-3.5 text-[#eb6905]" />
              <span>Role:</span>
              <span className={`capitalize rounded px-1.5 py-0.5 border ${getRoleBadgeColor(user?.role || 'guest')}`}>
                {user?.role || 'Guest'}
              </span>
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </button>

            {roleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-xl z-50">
                <div className="px-2 py-1 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                  Simulasi Tampilan Role (Demo)
                </div>
                <button
                  onClick={() => handleRoleChange('customer')}
                  className={`w-full text-left px-3 py-2 text-xs rounded-lg font-medium flex items-center justify-between ${user?.role === 'customer' ? 'bg-emerald-50 text-emerald-800 font-bold' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                >
                  <span>Customer (Pelanggan)</span>
                  {user?.role === 'customer' && <span className="h-2 w-2 rounded-full bg-emerald-500"></span>}
                </button>
                <button
                  onClick={() => handleRoleChange('mechanic')}
                  className={`w-full text-left px-3 py-2 text-xs rounded-lg font-medium flex items-center justify-between ${user?.role === 'mechanic' ? 'bg-indigo-50 text-indigo-800 font-bold' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                >
                  <span>Mechanic (Mekanik)</span>
                  {user?.role === 'mechanic' && <span className="h-2 w-2 rounded-full bg-indigo-500"></span>}
                </button>
                <button
                  onClick={() => handleRoleChange('admin')}
                  className={`w-full text-left px-3 py-2 text-xs rounded-lg font-medium flex items-center justify-between ${user?.role === 'admin' ? 'bg-blue-50 text-blue-800 font-bold' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                >
                  <span>Admin / Kasir</span>
                  {user?.role === 'admin' && <span className="h-2 w-2 rounded-full bg-blue-500"></span>}
                </button>
                <button
                  onClick={() => handleRoleChange('owner')}
                  className={`w-full text-left px-3 py-2 text-xs rounded-lg font-medium flex items-center justify-between ${user?.role === 'owner' ? 'bg-purple-50 text-purple-800 font-bold' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                >
                  <span>Owner (Pemilik Bengkel)</span>
                  {user?.role === 'owner' && <span className="h-2 w-2 rounded-full bg-purple-500"></span>}
                </button>
              </div>
            )}
          </div>

          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center space-x-2 rounded-full border border-slate-200 bg-white p-1 pr-3 hover:bg-slate-50 transition-colors"
              >
                <img
                  src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                  alt={user?.name}
                  className="h-8 w-8 rounded-full object-cover border border-slate-200"
                />
                <span className="text-xs font-semibold text-slate-800 max-w-[100px] truncate">
                  {user?.name}
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl z-50">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900 truncate">{user?.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      router.visit('/profile');
                    }}
                    className="flex w-full items-center space-x-2 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 text-left"
                  >
                    <User className="h-4 w-4 text-slate-400" />
                    <span>Profil Saya</span>
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      setProfileDropdownOpen(false);
                    }}
                    className="flex w-full items-center space-x-2 rounded-lg px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50"
                  >
                    <LogOut className="h-4 w-4 text-rose-500" />
                    <span>Keluar (Logout)</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link
                href="/login"
                className="rounded-lg px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Masuk
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-[#eb6905] px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#d95d00] transition-colors"
              >
                Daftar Akun
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-slate-200 bg-white p-4 md:hidden space-y-4">
          
          {/* Mobile User Profile Card */}
          {isAuthenticated && (
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center space-x-3 truncate">
                <img
                  src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                  alt={user?.name}
                  className="h-10 w-10 rounded-full object-cover border border-slate-200 shrink-0"
                />
                <div className="truncate text-xs">
                  <p className="font-bold text-slate-900 truncate">{user?.name}</p>
                  <span className={`inline-block mt-0.5 rounded px-1.5 py-0.5 text-[10px] font-bold border ${getRoleBadgeColor(user?.role)}`}>
                    {user?.role}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  router.visit('/profile');
                }}
                className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-100 shrink-0"
                title="Profil Saya"
              >
                <User className="h-4 w-4 text-[#eb6905]" />
              </button>
            </div>
          )}

          {/* Navigation Links */}
          <div className="flex flex-col space-y-1">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Beranda
            </Link>
            <Link
              href="/services"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Layanan Servis
            </Link>
            <Link
              href="/spareparts"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Katalog Sparepart
            </Link>

            {isAuthenticated && (
              <>
                <Link
                  href="/customer/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Dashboard Customer
                </Link>
                <Link
                  href="/customer/bookings"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Booking Servis
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    router.visit('/profile');
                  }}
                  className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center justify-between w-full text-left"
                >
                  <span>Profil Saya</span>
                  <User className="h-4 w-4 text-slate-400" />
                </button>

                {['admin', 'owner', 'mechanic'].includes(user?.role) && (
                  <Link
                    href={user?.role === 'mechanic' ? '/admin/schedule' : user?.role === 'owner' ? '/admin/reports' : '/admin/dashboard'}
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-xl bg-slate-900 px-3.5 py-2.5 text-sm font-bold text-white flex items-center justify-between mt-2"
                  >
                    <span>Admin Workbench</span>
                    <LayoutDashboard className="h-4 w-4 text-[#eb6905]" />
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Mobile Role Switcher Demo Widget */}
          {isAuthenticated && (
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Simulasi Role (Demo Mobile):
              </p>
              <div className="grid grid-cols-2 gap-1.5 text-xs">
                <button
                  onClick={() => handleRoleChange('customer')}
                  className={`p-2 rounded-xl text-left font-medium border ${user?.role === 'customer' ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold' : 'bg-slate-50 text-slate-700 border-slate-200'}`}
                >
                  👤 Customer
                </button>
                <button
                  onClick={() => handleRoleChange('mechanic')}
                  className={`p-2 rounded-xl text-left font-medium border ${user?.role === 'mechanic' ? 'bg-indigo-50 text-indigo-800 border-indigo-300 font-bold' : 'bg-slate-50 text-slate-700 border-slate-200'}`}
                >
                  🛠️ Mekanik
                </button>
                <button
                  onClick={() => handleRoleChange('admin')}
                  className={`p-2 rounded-xl text-left font-medium border ${user?.role === 'admin' ? 'bg-blue-50 text-blue-800 border-blue-300 font-bold' : 'bg-slate-50 text-slate-700 border-slate-200'}`}
                >
                  💳 Admin/Kasir
                </button>
                <button
                  onClick={() => handleRoleChange('owner')}
                  className={`p-2 rounded-xl text-left font-medium border ${user?.role === 'owner' ? 'bg-purple-50 text-purple-800 border-purple-300 font-bold' : 'bg-slate-50 text-slate-700 border-slate-200'}`}
                >
                  📈 Owner
                </button>
              </div>
            </div>
          )}

          {/* Footer Auth Buttons */}
          <div className="pt-2 border-t border-slate-100">
            {isAuthenticated ? (
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="flex w-full items-center justify-center space-x-2 rounded-xl bg-rose-50 p-2.5 text-xs font-bold text-rose-600 border border-rose-200"
              >
                <LogOut className="h-4 w-4" />
                <span>Keluar (Logout)</span>
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-xl border border-slate-200 bg-white py-2.5 text-center text-xs font-bold text-slate-700"
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-xl bg-[#eb6905] py-2.5 text-center text-xs font-bold text-white shadow-sm"
                >
                  Daftar Akun
                </Link>
              </div>
            )}
          </div>

        </div>
      )}
    </header>
  );
};

export default Navbar;
