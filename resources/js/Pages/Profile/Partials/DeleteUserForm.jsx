import DangerButton from '@/Components/DangerButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import PasswordInput from '@/Components/PasswordInput';
import { useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function DeleteUserForm({ className = '' }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);

        clearErrors();
        reset();
    };

    return (
        <section className={`space-y-4 ${className}`}>
            <header>
                <h2 className="text-base font-bold text-rose-700">
                    Hapus Akun Permanen
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                    Setelah akun Anda dihapus, seluruh data dan riwayat pada akun ini akan dihapus secara permanen.
                </p>
            </header>

            <DangerButton onClick={confirmUserDeletion} className="rounded-xl text-xs font-bold px-4 py-2.5">
                Hapus Akun Saya
            </DangerButton>

            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <form onSubmit={deleteUser} className="p-6 space-y-4">
                    <h2 className="text-base font-bold text-slate-900">
                        Apakah Anda yakin ingin menghapus akun ini?
                    </h2>

                    <p className="text-xs text-slate-600">
                        Seluruh data akun akan dihapus permanen. Masukkan kata sandi Anda untuk mengonfirmasi tindakan ini.
                    </p>

                    <div>
                        <InputLabel
                            htmlFor="password"
                            value="Kata Sandi (Password)"
                            className="text-xs font-semibold"
                        />

                        <div className="mt-1">
                            <PasswordInput
                                id="password"
                                name="password"
                                value={data.password}
                                onChange={(e) =>
                                    setData('password', e.target.value)
                                }
                                placeholder="Masukkan password Anda"
                            />
                        </div>

                        <InputError
                            message={errors.password}
                            className="mt-1 text-xs"
                        />
                    </div>

                    <div className="flex justify-end space-x-3 pt-2">
                        <SecondaryButton onClick={closeModal} className="rounded-xl text-xs font-semibold">
                            Batal
                        </SecondaryButton>

                        <DangerButton className="rounded-xl text-xs font-bold" disabled={processing}>
                            Hapus Permanen
                        </DangerButton>
                    </div>
                </form>
            </Modal>
        </section>
    );
}
