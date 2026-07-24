import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import PasswordInput from '@/Components/PasswordInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.confirm'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="flex min-h-[70vh] items-center justify-center px-4 py-8">
            <div className="w-full max-w-md space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
                <Head title="Konfirmasi Password" />

                <h2 className="text-xl font-extrabold text-[#091426]">Konfirmasi Kata Sandi</h2>

                <p className="text-xs text-slate-600">
                    Area ini memerlukan konfirmasi keamanan. Masukkan kata sandi Anda sebelum melanjutkan.
                </p>

                <form onSubmit={submit} className="space-y-4 pt-2">
                    <div>
                        <InputLabel htmlFor="password" value="Kata Sandi (Password)" className="text-xs font-semibold" />

                        <div className="mt-1">
                            <PasswordInput
                                id="password"
                                name="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="••••••••"
                            />
                        </div>

                        <InputError message={errors.password} className="mt-1 text-xs" />
                    </div>

                    <div className="flex justify-end pt-2">
                        <PrimaryButton disabled={processing} className="bg-[#eb6905] hover:bg-[#d95d00] border-none text-xs px-5 py-2.5 rounded-xl font-bold">
                            Konfirmasi
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </div>
    );
}

ConfirmPassword.layout = (page) => <GuestLayout children={page} />;
