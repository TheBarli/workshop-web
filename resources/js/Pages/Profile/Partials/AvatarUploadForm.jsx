import React, { useState } from 'react';
import { useForm, usePage, router } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import { Camera, Check } from 'lucide-react';

export default function AvatarUploadForm({ status, className = '' }) {
  const user = usePage().props.auth.user;
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  const currentAvatar = user.avatar
    ? (user.avatar.startsWith('http') ? user.avatar : `/storage/${user.avatar}`)
    : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150';

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Pilih file foto terlebih dahulu.');
      return;
    }

    setProcessing(true);
    setError('');

    const formData = new FormData();
    formData.append('avatar', selectedFile);

    router.post(route('profile.avatar'), formData, {
      onSuccess: () => {
        setPreview(null);
        setSelectedFile(null);
      },
      onError: (errors) => {
        setError(errors.avatar || 'Gagal mengunggah foto profil.');
      },
      onFinish: () => setProcessing(false),
    });
  };

  return (
    <section className={className}>
      <header>
        <h2 className="text-base font-bold text-slate-900">
          Foto Profil
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Unggah foto profil baru Anda (Format: JPG, PNG, WEBP. Maksimal 2MB).
        </p>
      </header>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4 max-w-xl">
        <div className="flex items-center space-x-5">
          {/* Avatar Preview */}
          <div className="relative">
            <img
              src={preview || currentAvatar}
              alt={user.name}
              className="h-20 w-20 rounded-full object-cover border-2 border-[#eb6905] shadow-md"
            />
            <label
              htmlFor="avatar-input"
              className="absolute bottom-0 right-0 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-[#eb6905] text-white shadow-md hover:bg-[#d95d00] transition-transform hover:scale-110"
              title="Pilih foto baru"
            >
              <Camera className="h-4 w-4" />
            </label>
          </div>

          <div className="space-y-1 text-xs">
            <input
              id="avatar-input"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              className="hidden"
            />
            <label
              htmlFor="avatar-input"
              className="inline-block rounded-xl border border-slate-300 bg-white px-3 py-1.5 font-bold text-slate-700 hover:bg-slate-50 cursor-pointer shadow-2xs"
            >
              Pilih Foto Baru
            </label>
            <p className="text-[11px] text-slate-400">
              {selectedFile ? selectedFile.name : 'Belum ada file dipilih'}
            </p>
          </div>
        </div>

        {error && <InputError message={error} className="text-xs" />}

        {status === 'avatar-updated' && (
          <p className="text-xs font-semibold text-emerald-600 flex items-center space-x-1">
            <Check className="h-4 w-4" />
            <span>Foto profil berhasil diperbarui.</span>
          </p>
        )}

        {selectedFile && (
          <div className="pt-2">
            <PrimaryButton disabled={processing} className="bg-[#eb6905] hover:bg-[#d95d00] border-none text-xs px-5 py-2.5 rounded-xl font-bold">
              {processing ? 'Mengunggah...' : 'Simpan Foto Profil'}
            </PrimaryButton>
          </div>
        )}
      </form>
    </section>
  );
}
