import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import PasswordInput from '@/Components/PasswordInput';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';

export default function UpdatePasswordForm({ className = '' }) {
    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                }

                if (errors.current_password) {
                    reset('current_password');
                }
            },
        });
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-base font-bold text-slate-900">
                    Perbarui Kata Sandi
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                    Pastikan akun Anda menggunakan kata sandi yang kuat dan aman.
                </p>
            </header>

            <form onSubmit={updatePassword} className="mt-6 space-y-4 max-w-xl">
                <div>
                    <InputLabel
                        htmlFor="current_password"
                        value="Kata Sandi Saat Ini"
                    />

                    <div className="mt-1">
                        <PasswordInput
                            id="current_password"
                            value={data.current_password}
                            onChange={(e) =>
                                setData('current_password', e.target.value)
                            }
                            autoComplete="current-password"
                            placeholder="••••••••"
                        />
                    </div>

                    <InputError
                        message={errors.current_password}
                        className="mt-1 text-xs"
                    />
                </div>

                <div>
                    <InputLabel htmlFor="password" value="Kata Sandi Baru" />

                    <div className="mt-1">
                        <PasswordInput
                            id="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            autoComplete="new-password"
                            placeholder="Minimal 8 karakter"
                        />
                    </div>

                    <InputError message={errors.password} className="mt-1 text-xs" />
                </div>

                <div>
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Konfirmasi Kata Sandi Baru"
                    />

                    <div className="mt-1">
                        <PasswordInput
                            id="password_confirmation"
                            value={data.password_confirmation}
                            onChange={(e) =>
                                setData('password_confirmation', e.target.value)
                            }
                            autoComplete="new-password"
                            placeholder="Ulangi kata sandi baru"
                        />
                    </div>

                    <InputError
                        message={errors.password_confirmation}
                        className="mt-1 text-xs"
                    />
                </div>

                <div className="flex items-center gap-4 pt-2">
                    <PrimaryButton disabled={processing} className="bg-[#eb6905] hover:bg-[#d95d00] border-none text-xs px-5 py-2.5 rounded-xl font-bold">
                        Simpan Perubahan
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
