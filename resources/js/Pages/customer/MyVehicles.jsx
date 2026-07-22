import React, { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { mockApi } from '../../services/mockApi';
import CustomerLayout from '@/Layouts/CustomerLayout';
import { Car, Plus, Trash2, CheckCircle2, ShieldCheck, X } from 'lucide-react';

const MyVehicles = () => {
  const { auth } = usePage().props;
  const user = auth?.user;
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const [newVehicle, setNewVehicle] = useState({
    license_plate: '',
    brand: 'Toyota',
    model: '',
    manufacture_year: 2022,
    engine_capacity: 1500,
    type: 'Mobil',
  });

  const loadVehicles = async () => {
    setLoading(true);
    try {
      const data = await mockApi.getVehicles(user?.id || 1);
      setVehicles(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVehicles();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await mockApi.addVehicle({
      ...newVehicle,
      user_id: user?.id || 1,
    });
    setModalOpen(false);
    setNewVehicle({
      license_plate: '',
      brand: 'Toyota',
      model: '',
      manufacture_year: 2022,
      engine_capacity: 1500,
      type: 'Mobil',
    });
    loadVehicles();
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-[#091426]">Manajemen Armada Kendaraan Saya</h1>
          <p className="text-xs text-slate-600 mt-1">
            Daftarkan seluruh unit mobil/motor keluarga atau bisnis Anda [BR-002].
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center space-x-2 rounded-xl bg-[#eb6905] px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#d95d00] transition-colors shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Tambah Kendaraan Baru</span>
        </button>
      </div>

      {/* Vehicles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map((v) => (
          <div
            key={v.id}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <span className="rounded-xl bg-slate-900 px-3.5 py-1.5 font-mono text-sm font-bold text-white tracking-widest shadow-sm">
                {v.license_plate}
              </span>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
                {v.type}
              </span>
            </div>

            <div>
              <h3 className="text-base font-extrabold text-slate-900">{v.brand} {v.model}</h3>
              <p className="text-xs text-slate-500 mt-1">
                Tahun Pembuatan: {v.manufacture_year} • Kapasitas: {v.engine_capacity} CC
              </p>
            </div>

            <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center space-x-1 text-emerald-600 font-semibold">
                <ShieldCheck className="h-4 w-4" />
                <span>Terdaftar Resmi</span>
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ADD VEHICLE MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <h3 className="text-lg font-bold text-slate-900">Tambah Unit Kendaraan Baru</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nomor Polisi (Plat Nomor)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. B 1234 XYZ"
                  value={newVehicle.license_plate}
                  onChange={(e) => setNewVehicle({ ...newVehicle, license_plate: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 font-mono text-xs font-bold text-slate-900 placeholder-slate-400 uppercase focus:border-[#eb6905] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Jenis Kendaraan</label>
                  <select
                    value={newVehicle.type}
                    onChange={(e) => setNewVehicle({ ...newVehicle, type: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-xs font-medium text-slate-900 focus:border-[#eb6905] focus:outline-none"
                  >
                    <option value="Mobil">Mobil</option>
                    <option value="Motor">Motor</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Merk / Brand</label>
                  <input
                    type="text"
                    required
                    placeholder="Toyota / Honda / Yamaha"
                    value={newVehicle.brand}
                    onChange={(e) => setNewVehicle({ ...newVehicle, brand: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-xs font-medium text-slate-900 focus:border-[#eb6905] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Model / Tipe Spesoifikasi</label>
                <input
                  type="text"
                  required
                  placeholder="Avanza Veloz 1.5 AT / Vario 150"
                  value={newVehicle.model}
                  onChange={(e) => setNewVehicle({ ...newVehicle, model: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-xs font-medium text-slate-900 focus:border-[#eb6905] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tahun Pembuatan</label>
                  <input
                    type="number"
                    required
                    min="1990"
                    max="2026"
                    value={newVehicle.manufacture_year}
                    onChange={(e) => setNewVehicle({ ...newVehicle, manufacture_year: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-xs font-medium text-slate-900 focus:border-[#eb6905] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Kapasitas Mesin (CC)</label>
                  <input
                    type="number"
                    required
                    placeholder="1500"
                    value={newVehicle.engine_capacity}
                    onChange={(e) => setNewVehicle({ ...newVehicle, engine_capacity: e.target.value })}
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
                  className="rounded-xl bg-[#eb6905] px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#d95d00]"
                >
                  Simpan Kendaraan
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
