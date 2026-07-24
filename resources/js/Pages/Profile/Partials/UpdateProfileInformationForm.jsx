import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name || '',
            email: user.email || '',
            phone_number: user.phone_number || '',
        });

    const submit = (e) => {
        e.preventDefault();

        patch(route('profile.update'));
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-base font-bold text-slate-900">
                    Informasi Profil Akun
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                    Perbarui nama lengkap, alamat email, dan nomor WhatsApp akun Anda.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-4 max-w-xl">
                <div>
                    <InputLabel htmlFor="name" value="Nama Lengkap" className="text-xs font-semibold" />

                    <TextInput
                        id="name"
                        className="mt-1 block w-full text-xs"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        isFocused
                        autoComplete="name"
                    />

                    <InputError className="mt-1 text-xs" message={errors.name} />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="Alamat Email" className="text-xs font-semibold" />

                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full text-xs"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value.toLowerCase())}
                        required
                        autoComplete="username"
                    />

                    <InputError className="mt-1 text-xs" message={errors.email} />
                </div>

                <div>
                    <InputLabel htmlFor="phone_number" value="Nomor WhatsApp / Telepon" className="text-xs font-semibold" />

                    <TextInput
                        id="phone_number"
                        type="tel"
                        className="mt-1 block w-full text-xs"
                        value={data.phone_number}
                        onChange={(e) => setData('phone_number', e.target.value)}
                        placeholder="081234567890"
                    />

                    <InputError className="mt-1 text-xs" message={errors.phone_number} />
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="mt-2 text-xs text-slate-800">
                            Alamat email Anda belum diverifikasi.
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="ml-1 rounded-md text-xs text-[#eb6905] underline hover:text-[#d95d00]"
                            >
                                Klik di sini untuk mengirim ulang email verifikasi.
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 text-xs font-medium text-emerald-600">
                                Tautan verifikasi baru telah dikirim ke email Anda.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4 pt-2">
                    <PrimaryButton disabled={processing} className="bg-[#eb6905] hover:bg-[#d95d00] border-none text-xs px-5 py-2.5 rounded-xl font-bold">
                        Simpan Profil
                    </PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-xs font-semibold text-emerald-600">
                            Berhasil disimpan.
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
