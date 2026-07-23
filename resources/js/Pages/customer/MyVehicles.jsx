import React, { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import CustomerLayout from '@/Layouts/CustomerLayout';
import { Car, Plus, Trash2, Edit2, ShieldCheck, X } from 'lucide-react';

const MyVehicles = ({ vehicles = [] }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editVehicle, setEditVehicle] = useState(null); // null = add mode, object = edit mode

  // ---- Add / Edit form ----
  const form = useForm({
    license_plate: '',
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    color: '',
  });

  const openAddModal = () => {
    setEditVehicle(null);
    form.reset();
    form.clearErrors();
    setModalOpen(true);
  };

  const openEditModal = (v) => {
    setEditVehicle(v);
    form.setData({
      license_plate: v.license_plate,
      brand: v.brand,
      model: v.model,
      year: v.year ?? '',
      color: v.color ?? '',
    });
    form.clearErrors();
    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editVehicle) {
      form.put(route('customer.vehicles.update', editVehicle.id), {
        onSuccess: () => setModalOpen(false),
      });
    } else {
      form.post(route('customer.vehicles.store'), {
        onSuccess: () => { setModalOpen(false); form.reset(); },
      });
    }
  };

  const handleDelete = (vehicleId) => {
    if (!confirm('Hapus kendaraan ini? Tindakan tidak dapat diurungkan.')) return;
    router.delete(route('customer.vehicles.destroy', vehicleId));
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-[#091426]">Manajemen Armada Kendaraan Saya</h1>
          <p className="text-xs text-slate-600 mt-1">
            Daftarkan seluruh unit mobil/motor keluarga atau bisnis Anda.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center space-x-2 rounded-xl bg-[#eb6905] px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#d95d00] transition-colors shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Tambah Kendaraan Baru</span>
        </button>
      </div>

      {/* Vehicles Grid */}
      {vehicles.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-slate-200 p-12 text-center space-y-3">
          <Car className="h-12 w-12 text-slate-300 mx-auto" />
          <p className="text-sm font-semibold text-slate-500">Belum ada kendaraan terdaftar.</p>
          <button onClick={openAddModal} className="inline-flex items-center space-x-1 text-xs font-bold text-[#eb6905] hover:underline">
            <Plus className="h-3.5 w-3.5" />
            <span>Daftarkan Kendaraan Pertama</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((v) => (
            <div key={v.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <span className="rounded-xl bg-slate-900 px-3.5 py-1.5 font-mono text-sm font-bold text-white tracking-widest shadow-sm">
                  {v.license_plate}
                </span>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => openEditModal(v)}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(v.id)}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                    title="Hapus"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-base font-extrabold text-slate-900">{v.brand} {v.model}</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Tahun: {v.year ?? '—'}{v.color ? ` • ${v.color}` : ''}
                </p>
              </div>

              <div className="border-t border-slate-100 pt-3 flex items-center text-xs text-emerald-600 font-semibold space-x-1">
                <ShieldCheck className="h-4 w-4" />
                <span>Terdaftar Resmi</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ADD / EDIT VEHICLE MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <h3 className="text-lg font-bold text-slate-900">
                {editVehicle ? 'Edit Data Kendaraan' : 'Tambah Unit Kendaraan Baru'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* License plate — only editable on add */}
              {!editVehicle && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nomor Polisi *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. B 1234 XYZ"
                    value={form.data.license_plate}
                    onChange={(e) => form.setData('license_plate', e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 font-mono text-xs font-bold text-slate-900 uppercase focus:border-[#eb6905] focus:outline-none"
                  />
                  {form.errors.license_plate && (
                    <p className="text-xs text-rose-600 mt-1">{form.errors.license_plate}</p>
                  )}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Merk / Brand *</label>
                  <input
                    type="text"
                    required
                    placeholder="Toyota / Honda"
                    value={form.data.brand}
                    onChange={(e) => form.setData('brand', e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-xs font-medium text-slate-900 focus:border-[#eb6905] focus:outline-none"
                  />
                  {form.errors.brand && <p className="text-xs text-rose-600 mt-1">{form.errors.brand}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Model / Tipe *</label>
                  <input
                    type="text"
                    required
                    placeholder="Avanza / Vario 150"
                    value={form.data.model}
                    onChange={(e) => form.setData('model', e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-xs font-medium text-slate-900 focus:border-[#eb6905] focus:outline-none"
                  />
                  {form.errors.model && <p className="text-xs text-rose-600 mt-1">{form.errors.model}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tahun Pembuatan</label>
                  <input
                    type="number"
                    min="1990"
                    max={new Date().getFullYear()}
                    value={form.data.year}
                    onChange={(e) => form.setData('year', e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-xs font-medium text-slate-900 focus:border-[#eb6905] focus:outline-none"
                  />
                  {form.errors.year && <p className="text-xs text-rose-600 mt-1">{form.errors.year}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Warna</label>
                  <input
                    type="text"
                    placeholder="Hitam, Putih..."
                    value={form.data.color}
                    onChange={(e) => form.setData('color', e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-xs font-medium text-slate-900 focus:border-[#eb6905] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={form.processing}
                  className="rounded-xl bg-[#eb6905] px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#d95d00] disabled:opacity-60"
                >
                  {form.processing ? 'Menyimpan...' : (editVehicle ? 'Simpan Perubahan' : 'Simpan Kendaraan')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

MyVehicles.layout = (page) => <CustomerLayout children={page} />;

export default MyVehicles;
