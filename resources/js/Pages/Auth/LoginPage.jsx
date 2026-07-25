import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import { Wrench, Mail, Lock, LogIn, AlertCircle } from 'lucide-react';
import GuestLayout from '@/Layouts/GuestLayout';

import PasswordInput from '@/Components/PasswordInput';

const LoginPage = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
