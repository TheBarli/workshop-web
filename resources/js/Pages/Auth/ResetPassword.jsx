import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import PasswordInput from '@/Components/PasswordInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';

export default function ResetPassword({ token, email }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <div className="flex min-h-[70vh] items-center justify-center px-4 py-8">
            <div className="w-full max-w-md space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
                <Head title="Reset Password" />
                <h2 className="text-xl font-extrabold text-[#091426]">Atur Ulang Kata Sandi</h2>

                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <InputLabel htmlFor="email" value="Alamat Email" className="text-xs font-semibold" />

                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="mt-1 block w-full text-xs"
                            autoComplete="username"
                            onChange={(e) => setData('email', e.target.value.toLowerCase())}
                        />

                        <InputError message={errors.email} className="mt-1 text-xs" />
                    </div>

                    <div>
                        <InputLabel htmlFor="password" value="Kata Sandi Baru" className="text-xs font-semibold" />

                        <div className="mt-1">
                            <PasswordInput
                                id="password"
                                name="password"
                                value={data.password}
                                autoComplete="new-password"
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="Minimal 8 karakter"
                            />
                        </div>

                        <InputError message={errors.password} className="mt-1 text-xs" />
                    </div>

                    <div>
                        <InputLabel
                            htmlFor="password_confirmation"
                            value="Konfirmasi Kata Sandi Baru"
                            className="text-xs font-semibold"
                        />

                        <div className="mt-1">
                            <PasswordInput
                                id="password_confirmation"
                                name="password_confirmation"
                                value={data.password_confirmation}
                                autoComplete="new-password"
                                onChange={(e) =>
                                    setData('password_confirmation', e.target.value)
                                }
                                placeholder="Ulangi kata sandi baru"
                            />
                        </div>

                        <InputError
                            message={errors.password_confirmation}
                            className="mt-1 text-xs"
                        />
                    </div>

                    <div className="pt-2 flex justify-end">
                        <PrimaryButton disabled={processing} className="bg-[#eb6905] hover:bg-[#d95d00] border-none text-xs px-5 py-2.5 rounded-xl font-bold">
                            Reset Password
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </div>
    );
}

ResetPassword.layout = (page) => <GuestLayout children={page} />;
