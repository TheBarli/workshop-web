import { usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import CustomerLayout from '@/Layouts/CustomerLayout';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import AvatarUploadForm from './Partials/AvatarUploadForm';
import { User, Lock, Trash2, Camera } from 'lucide-react';

export default function Edit({ mustVerifyEmail, status }) {
    const { auth } = usePage().props;
    const user = auth?.user;
    const isAdminSide = ['admin', 'mechanic', 'owner'].includes(user?.role);

    const sections = [
        {
            id: 'avatar',
            icon: Camera,
            label: 'Foto Profil',
            color: 'text-[#eb6905]',
            bg: 'bg-orange-50',
            content: <AvatarUploadForm status={status} />,
        },
        {
            id: 'info',
            icon: User,
            label: 'Informasi Akun',
            color: 'text-blue-600',
            bg: 'bg-blue-50',
            content: (
                <UpdateProfileInformationForm
                    mustVerifyEmail={mustVerifyEmail}
                    status={status}
                />
            ),
        },
        {
            id: 'password',
            icon: Lock,
            label: 'Ubah Password',
            color: 'text-emerald-600',
            bg: 'bg-emerald-50',
            content: <UpdatePasswordForm />,
        },
        {
            id: 'danger',
            icon: Trash2,
            label: 'Hapus Akun',
            color: 'text-rose-600',
            bg: 'bg-rose-50',
            content: <DeleteUserForm />,
            danger: true,
        },
    ];

    const content = (
        <>
            <Head title="Profil Saya" />

            <div className="space-y-6 max-w-4xl mx-auto">
                {/* Page header */}
                <div className="border-b border-slate-200 pb-4">
                    <h1 className="text-2xl font-extrabold text-[#091426]">Profil Saya</h1>
                    <p className="mt-1 text-xs text-slate-500">
                        Kelola informasi akun, foto profil, keamanan password, dan detail akun Anda.
                    </p>
                </div>

                {/* Sections */}
                {sections.map(({ id, icon: Icon, label, color, bg, content: sectionContent, danger }) => (
                    <div
                        key={id}
                        className={`rounded-2xl border bg-white shadow-xs overflow-hidden ${
                            danger ? 'border-rose-200' : 'border-slate-200'
                        }`}
                    >
                        {/* Section header bar */}
                        <div
                            className={`flex items-center space-x-3 px-4 sm:px-6 py-3.5 sm:py-4 border-b ${
                                danger ? 'border-rose-100 bg-rose-50/40' : 'border-slate-100 bg-slate-50/60'
                            }`}
                        >
                            <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${bg} shrink-0`}>
                                <Icon className={`h-4 w-4 ${color}`} />
                            </div>
                            <h2
                                className={`text-sm font-bold ${
                                    danger ? 'text-rose-700' : 'text-slate-800'
                                }`}
                            >
                                {label}
                            </h2>
                        </div>

                        {/* Section body */}
                        <div className="px-4 sm:px-6 py-4 sm:py-6">{sectionContent}</div>
                    </div>
                ))}
            </div>
        </>
    );

    return content;
}

Edit.layout = (page) => {
    const user = page.props?.auth?.user;
    const isAdminSide = ['admin', 'mechanic', 'owner'].includes(user?.role);
    if (isAdminSide) {
        return <AdminLayout children={page} />;
    }
    return <CustomerLayout children={page} />;
};
