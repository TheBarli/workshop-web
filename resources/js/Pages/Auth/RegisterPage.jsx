import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import { Wrench, Mail, Lock, User, Phone, UserPlus, AlertCircle } from 'lucide-react';
import GuestLayout from '@/Layouts/GuestLayout';

const RegisterPage = () => {

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone_number: '',
    password: '',
    password_confirmation: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.password_confirmation) {
      setError('Konfirmasi password tidak cocok.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      router.post('/register', formData, {
        onError: (errors) => {
          setError(Object.values(errors)[0] || 'Registrasi gagal. Silakan coba lagi.');
        },
        onFinish: () => setLoading(false)
      });
    } catch (err) {
      setError('Registrasi gagal. Silakan coba lagi.');
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[85vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#091426] text-[#eb6905] shadow-lg">
            <Wrench className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-[#091426]">Pendaftaran Akun Pelanggan</h2>
          <p className="text-xs text-slate-500">
            Daftarkan diri Anda untuk menikmati kemudahan booking servis otomotif online.
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
            <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Lengkap</label>
            <div className="relative">
              <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Budi Santoso"
                className="w-full rounded-xl border border-slate-300 bg-slate-50 pl-10 pr-4 py-2.5 text-xs font-medium text-slate-900 placeholder-slate-400 focus:border-[#eb6905] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Alamat Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="budi@example.com"
                className="w-full rounded-xl border border-slate-300 bg-slate-50 pl-10 pr-4 py-2.5 text-xs font-medium text-slate-900 placeholder-slate-400 focus:border-[#eb6905] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Nomor WhatsApp (Aktif)</label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="tel"
                name="phone_number"
                required
                value={formData.phone_number}
                onChange={handleChange}
                placeholder="081234567890"
                className="w-full rounded-xl border border-slate-300 bg-slate-50 pl-10 pr-4 py-2.5 text-xs font-medium text-slate-900 placeholder-slate-400 focus:border-[#eb6905] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Kata Sandi (Password)</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Minimal 8 karakter"
                className="w-full rounded-xl border border-slate-300 bg-slate-50 pl-10 pr-4 py-2.5 text-xs font-medium text-slate-900 placeholder-slate-400 focus:border-[#eb6905] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Konfirmasi Kata Sandi</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="password"
                name="password_confirmation"
                required
                value={formData.password_confirmation}
                onChange={handleChange}
                placeholder="Ulangi kata sandi"
                className="w-full rounded-xl border border-slate-300 bg-slate-50 pl-10 pr-4 py-2.5 text-xs font-medium text-slate-900 placeholder-slate-400 focus:border-[#eb6905] focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center space-x-2 rounded-xl bg-[#eb6905] py-3 text-xs font-bold text-white shadow-lg hover:bg-[#d95d00] transition-colors disabled:opacity-50"
          >
            {loading ? (
              <span className="animate-pulse">Mendaftarkan Akun...</span>
            ) : (
              <>
                <UserPlus className="h-4 w-4" />
                <span>Daftar Akun Baru</span>
              </>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-slate-500">
          Sudah memiliki akun?{' '}
          <Link href="/login" className="font-bold text-[#eb6905] hover:underline">
            Masuk Sekarang
          </Link>
        </div>

      </div>
    </div>
  );
};

RegisterPage.layout = (page) => <GuestLayout children={page} />;

export default RegisterPage;
