import React, { useState } from 'react';
import { usePage, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Users, Search, Shield, UserCheck, UserX, AlertCircle, Filter, Trash2, UserMinus } from 'lucide-react';

const ROLE_BADGES = {
  owner:    'bg-purple-100 text-purple-800 border-purple-200',
  admin:    'bg-blue-100 text-blue-800 border-blue-200',
  mechanic: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  customer: 'bg-emerald-100 text-emerald-800 border-emerald-200',
};

const ROLE_LABELS = {
  owner:    'Owner (Pemilik)',
  admin:    'Admin / Kasir',
  mechanic: 'Mekanik Specialist',
  customer: 'Customer (Pelanggan)',
};

const STATUS_BADGES = {
  active:    'bg-emerald-50 text-emerald-700 border-emerald-200',
  inactive:  'bg-amber-50 text-amber-700 border-amber-200',
  suspended: 'bg-rose-50 text-rose-700 border-rose-200',
};

const STATUS_LABELS = {
  active:    'Aktif',
  inactive:  'Non-Aktif',
  suspended: 'Ditangguhkan (Kick)',
};

const UserManagement = ({ users = { data: [] }, filters = {} }) => {
  const { auth } = usePage().props;
  const currentUser = auth?.user;
  const isOwnerUser = currentUser?.role === 'owner';

  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [roleFilter, setRoleFilter] = useState(filters.role || '');
  const [updatingId, setUpdatingId] = useState(null);
  const [deleteModalUser, setDeleteModalUser] = useState(null);

  const handleSearch = (e) => {
    e.preventDefault();
    router.get(
      route('owner.users'),
      { search: searchTerm, role: roleFilter },
      { preserveState: true, replace: true }
    );
  };

  const handleRoleFilterChange = (newRole) => {
    setRoleFilter(newRole);
    router.get(
      route('owner.users'),
      { search: searchTerm, role: newRole },
      { preserveState: true, replace: true }
    );
  };

  const handleRoleChange = (userId, newRole) => {
    setUpdatingId(userId);
    router.patch(
      route('owner.users.role', userId),
      { role: newRole },
      { onFinish: () => setUpdatingId(null) }
    );
  };

  const handleStatusChange = (userId, newStatus) => {
    setUpdatingId(userId);
    router.patch(
      route('owner.users.status', userId),
      { status: newStatus },
      { onFinish: () => setUpdatingId(null) }
    );
  };

  const handleDeleteUser = () => {
    if (!deleteModalUser) return;
    setUpdatingId(deleteModalUser.id);
    router.delete(route('owner.users.destroy', deleteModalUser.id), {
      onSuccess: () => setDeleteModalUser(null),
      onFinish: () => setUpdatingId(null),
    });
  };

  const userList = users.data || [];

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#091426]">Manajemen Role &amp; Hak Akses Pengguna</h1>
          <p className="text-xs text-slate-500 mt-1">
            Kelola peran hak akses akun (Owner, Admin, Mekanik, Customer), tangguhkan (Kick), atau hapus akun pengguna.
          </p>
        </div>

        {/* Filter & Search */}
        <form onSubmit={handleSearch} className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama atau email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:border-[#eb6905] focus:outline-none w-48 sm:w-56"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => handleRoleFilterChange(e.target.value)}
            className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 focus:border-[#eb6905] focus:outline-none"
          >
            <option value="">Semua Role</option>
            <option value="owner">Owner</option>
            <option value="admin">Admin</option>
            <option value="mechanic">Mekanik</option>
            <option value="customer">Customer</option>
          </select>

          <button
            type="submit"
            className="rounded-xl bg-[#eb6905] px-3.5 py-2 text-xs font-bold text-white hover:bg-[#d95d00]"
          >
            Cari
          </button>
        </form>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-left font-bold text-slate-700">Pengguna</th>
                <th className="px-4 py-3 text-left font-bold text-slate-700">Kontak</th>
                <th className="px-4 py-3 text-center font-bold text-slate-700">Role (Hak Akses)</th>
                <th className="px-4 py-3 text-center font-bold text-slate-700">Status Akun</th>
                <th className="px-4 py-3 text-center font-bold text-slate-700">Aksi (Owner Control)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {userList.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    Tidak ada akun ditemukan.
                  </td>
                </tr>
              ) : (
                userList.map((userItem) => {
                  const isSelf = userItem.is_self;
                  const isTargetOwner = userItem.role === 'owner';
                  const isTargetAdmin = userItem.role === 'admin';
                  const isCurrentAdmin = currentUser?.role === 'admin';
                  const isCurrentOwner = currentUser?.role === 'owner';

                  // Hierarchy Guard:
                  // 1. Cannot manage self
                  // 2. Cannot manage Owner (Owner is untouchable)
                  // 3. Admin cannot manage another Admin
                  const canManageUser = !isSelf && !isTargetOwner && !(isCurrentAdmin && isTargetAdmin);

                  return (
                    <tr key={userItem.id} className="hover:bg-slate-50 transition-colors">
                      
                      {/* User Info */}
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-3">
                          <img
                            src={userItem.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                            alt={userItem.name}
                            className="h-9 w-9 rounded-full object-cover border border-slate-200 shrink-0"
                          />
                          <div>
                            <div className="font-bold text-slate-900 flex items-center space-x-1.5">
                              <span>{userItem.name}</span>
                              {userItem.is_self && (
                                <span className="rounded bg-slate-900 text-white px-1.5 py-0.2 text-[9px] font-bold">Saya</span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500">{userItem.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="px-4 py-3 text-slate-600 font-medium">
                        {userItem.phone_number || '—'}
                      </td>

                      {/* Role selector */}
                      <td className="px-4 py-3 text-center">
                        {!canManageUser ? (
                          <span className={`inline-block rounded px-2.5 py-1 text-[11px] font-bold border ${ROLE_BADGES[userItem.role]}`}>
                            {ROLE_LABELS[userItem.role] ?? userItem.role}
                          </span>
                        ) : (
                          <select
                            value={userItem.role}
                            disabled={updatingId === userItem.id}
                            onChange={(e) => handleRoleChange(userItem.id, e.target.value)}
                            className={`rounded-lg border px-2.5 py-1 text-xs font-bold focus:outline-none cursor-pointer ${ROLE_BADGES[userItem.role]}`}
                          >
                            <option value="customer">Customer (Pelanggan)</option>
                            <option value="mechanic">Mechanic (Mekanik)</option>
                            {isCurrentOwner && (
                              <>
                                <option value="admin">Admin / Kasir</option>
                                <option value="owner">Owner (Pemilik)</option>
                              </>
                            )}
                          </select>
                        )}
                      </td>

                      {/* Status selector */}
                      <td className="px-4 py-3 text-center">
                        {!canManageUser ? (
                          <span className={`inline-block rounded px-2.5 py-1 text-[11px] font-bold border ${STATUS_BADGES[userItem.status]}`}>
                            {STATUS_LABELS[userItem.status] ?? userItem.status}
                          </span>
                        ) : (
                          <select
                            value={userItem.status}
                            disabled={updatingId === userItem.id}
                            onChange={(e) => handleStatusChange(userItem.id, e.target.value)}
                            className={`rounded-lg border px-2.5 py-1 text-xs font-bold focus:outline-none cursor-pointer ${STATUS_BADGES[userItem.status]}`}
                          >
                            <option value="active">Aktif</option>
                            <option value="inactive">Non-Aktif</option>
                            <option value="suspended">Ditangguhkan (Kick)</option>
                          </select>
                        )}
                      </td>

                      {/* Action Column */}
                      <td className="px-4 py-3 text-center">
                        {!canManageUser ? (
                          <span className="text-[10px] font-bold">
                            {isSelf ? (
                              <span className="text-slate-400">— Akun Sendiri —</span>
                            ) : isTargetOwner ? (
                              <span className="rounded bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5">👑 Owner (Kasta Tertinggi)</span>
                            ) : (
                              <span className="text-slate-400">— Sesama Admin —</span>
                            )}
                          </span>
                        ) : (
                          <div className="flex items-center justify-center space-x-1.5">
                            {/* Kick / Suspend Button */}
                            <button
                              onClick={() => handleStatusChange(userItem.id, userItem.status === 'suspended' ? 'active' : 'suspended')}
                              disabled={updatingId === userItem.id}
                              className={`rounded-lg px-2 py-1 text-[10px] font-bold border transition-colors flex items-center space-x-1 ${
                                userItem.status === 'suspended'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                  : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                              }`}
                              title={userItem.status === 'suspended' ? 'Aktifkan Kembali' : 'Kick / Tangguhkan Akun Ini'}
                            >
                              <UserMinus className="h-3 w-3" />
                              <span>{userItem.status === 'suspended' ? 'Un-Kick' : 'Kick / Suspend'}</span>
                            </button>

                            <button
                              onClick={() => setDeleteModalUser(userItem)}
                              disabled={updatingId === userItem.id}
                              className="rounded-lg bg-rose-50 border border-rose-200 px-2 py-1 text-[10px] font-bold text-rose-700 hover:bg-rose-100 transition-colors flex items-center space-x-1"
                              title="Hapus Akun Permanen"
                            >
                              <Trash2 className="h-3 w-3 text-rose-600" />
                              <span>Hapus</span>
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Links */}
        {users.links && users.links.length > 3 && (
          <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3 bg-slate-50">
            <div className="text-xs text-slate-500">
              Menampilkan {users.from || 0} - {users.to || 0} dari {users.total || 0} akun
            </div>
            <div className="flex items-center space-x-1">
              {users.links.map((link, idx) => (
                <button
                  key={idx}
                  disabled={!link.url}
                  onClick={() => link.url && router.get(link.url)}
                  dangerouslySetInnerHTML={{ __html: link.label }}
                  className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
                    link.active
                      ? 'bg-[#eb6905] text-white font-bold'
                      : link.url
                      ? 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                      : 'text-slate-400 cursor-not-allowed'
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Delete User Modal */}
      {deleteModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center space-x-3 text-rose-600">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-100 shrink-0">
                <AlertCircle className="h-5 w-5 text-rose-600" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Konfirmasi Hapus / Kick</h3>
            </div>

            <p className="text-xs text-slate-600">
              Apakah Anda (Owner) yakin ingin menghapus atau mengeluarkan akun <strong>{deleteModalUser.name}</strong> ({deleteModalUser.email}) dari sistem? Akun ini tidak dapat digunakan lagi.
            </p>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteModalUser(null)}
                className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDeleteUser}
                className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-rose-700"
              >
                Ya, Hapus Akun
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

UserManagement.layout = (page) => <AdminLayout children={page} />;

export default UserManagement;
