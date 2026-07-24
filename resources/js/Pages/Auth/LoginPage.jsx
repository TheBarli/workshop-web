import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import { Wrench, Mail, Lock, LogIn, AlertCircle, Sparkles } from 'lucide-react';
import GuestLayout from '@/Layouts/GuestLayout';

import PasswordInput from '@/Components/PasswordInput';

const LoginPage = () => {

  const [email, setEmail] = useState('budi@stelle.id');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    router.post('/login', { email, password }, {
      onError: (errors) => {
        setError(Object.values(errors)[0] || 'Login gagal. Periksa kembali email dan kata sandi Anda.');
      },
      onFinish: () => setLoading(false)
    });
  };

  const handleQuickDemo = (demoEmail, demoRole) => {
    setEmail(demoEmail);
    setPassword('password123');
  };

  return (
    <div className="flex min-h-[85vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#091426] text-[#eb6905] shadow-lg">
            <Wrench className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-[#091426]">Masuk Akun Bengkel Stelle</h2>
          <p className="text-xs text-slate-500">
            Akses portal pelanggan, booking servis online, atau dashboard operasional.
          </p>
        </div>

        {/* Quick Demo Switcher Buttons */}
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 space-y-2">
          <div className="flex items-center space-x-1 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5 text-[#eb6905]" />
            <span>Klik Akun Demo Instan (Pengujian UI):</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5 text-[11px]">
            <button
              type="button"
              onClick={() => handleQuickDemo('budi@stelle.id', 'customer')}
              className="rounded-lg bg-white p-1.5 font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 border border-slate-200 text-left truncate"
            >
              👤 Customer (Budi)
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('agus.mechanic@stelle.id', 'mechanic')}
              className="rounded-lg bg-white p-1.5 font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-800 border border-slate-200 text-left truncate"
            >
              🛠️ Mekanik (Agus)
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('siti.admin@stelle.id', 'admin')}
              className="rounded-lg bg-white p-1.5 font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-800 border border-slate-200 text-left truncate"
            >
              💳 Admin (Siti)
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('owner@stelle.id', 'owner')}
              className="rounded-lg bg-white p-1.5 font-medium text-slate-700 hover:bg-purple-50 hover:text-purple-800 border border-slate-200 text-left truncate"
            >
              📈 Owner (Hendra)
            </button>
          </div>
        </div>

        {error && (
          <div className="flex items-center space-x-2 rounded-xl bg-rose-50 p-3 text-xs font-semibold text-rose-700 border border-rose-200">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email Terdaftar</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value.toLowerCase())}
                placeholder="nama@email.com"
                className="w-full rounded-xl border border-slate-300 bg-slate-50 pl-10 pr-4 py-2.5 text-xs font-medium text-slate-900 placeholder-slate-400 focus:border-[#eb6905] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Kata Sandi (Password)</label>
            <PasswordInput
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center space-x-2 rounded-xl bg-[#eb6905] py-3 text-xs font-bold text-white shadow-lg hover:bg-[#d95d00] transition-colors disabled:opacity-50"
          >
            {loading ? (
              <span className="animate-pulse">Memproses Login...</span>
            ) : (
              <>
                <LogIn className="h-4 w-4" />
                <span>Masuk Sekarang</span>
              </>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-slate-500">
          Belum memiliki akun customer?{' '}
          <Link href="/register" className="font-bold text-[#eb6905] hover:underline">
            Daftar Akun Baru
          </Link>
        </div>

      </div>
    </div>
  );
};

LoginPage.layout = (page) => <GuestLayout children={page} />;

export default LoginPage;
