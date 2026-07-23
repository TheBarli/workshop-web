import React, { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Package, Search, Plus, AlertTriangle, X } from 'lucide-react';

const SparepartsInventory = ({ inventory = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const form = useForm({
    code:              '',
    name:              '',
    category:          'sparepart',
    price:             0,
    stock:             0,
    estimated_minutes: 0,
    description:       '',
  });

  const filteredParts = inventory.filter((p) => {
    const term = searchTerm.toLowerCase();
    return (
      p.name?.toLowerCase().includes(term) ||
      p.code?.toLowerCase().includes(term)
    );
  });

  const handleAddPart = (e) => {
    e.preventDefault();
    form.post(route('admin.services.store'), {
      onSuccess: () => { setModalOpen(false); form.reset(); },
    });
  };

  const handleStockUpdate = (id, currentStock) => {
    const next = prompt('Masukkan jumlah stok fisik baru:', currentStock);
    if (next !== null && !isNaN(next) && next !== '') {
      router.patch(route('admin.services.update', id), { stock: Number(next) });
    }
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#091426]">Inventaris Suku Cadang</h1>
          <p className="text-xs text-slate-500 mt-1">Kelola stok dan harga suku cadang bengkel.</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama atau kode..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:border-[#eb6905] focus:outline-none w-52"
            />
          </div>
          <button
            onClick={() => { setModalOpen(true); form.reset(); form.clearErrors(); }}
            className="flex items-center space-x-2 rounded-xl bg-[#eb6905] px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#d95d00] transition-colors shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span>Tambah Item</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <table className="w-full text-xs">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 text-left font-bold text-slate-700">Kode</th>
              <th className="px-4 py-3 text-left font-bold text-slate-700">Nama Item</th>
              <th className="px-4 py-3 text-right font-bold text-slate-700">Harga</th>
              <th className="px-4 py-3 text-center font-bold text-slate-700">Stok</th>
              <th className="px-4 py-3 text-center font-bold text-slate-700">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredParts.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-10 text-center text-slate-400">
                  {searchTerm ? 'Tidak ada hasil.' : 'Belum ada item inventaris.'}
                </td>
              </tr>
            ) : (
              filteredParts.map((part) => (
                <tr key={part.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-slate-700">{part.code}</td>
                  <td className="px-4 py-3 font-semibold text-slate-900">{part.name}</td>
                  <td className="px-4 py-3 text-right font-bold text-slate-800">
                    Rp {Number(part.price).toLocaleString('id-ID')}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-block rounded-full px-2.5 py-0.5 font-bold text-[10px] ${
                      part.stock <= 5 ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {part.stock} unit
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleStockUpdate(part.id, part.stock)}
                      className="rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-[11px] font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      Update Stok
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ADD PART MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <h3 className="text-lg font-bold text-slate-900">Tambah Item Baru</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddPart} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Kode Item *</label>
                  <input
                    type="text"
                    required
                    placeholder="SP-001"
                    value={form.data.code}
                    onChange={(e) => form.setData('code', e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-mono font-bold text-slate-900 uppercase focus:border-[#eb6905] focus:outline-none"
                  />
                  {form.errors.code && <p className="text-xs text-rose-600 mt-1">{form.errors.code}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Kategori</label>
                  <select
                    value={form.data.category}
                    onChange={(e) => form.setData('category', e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-900 focus:border-[#eb6905] focus:outline-none"
                  >
                    <option value="sparepart">Suku Cadang</option>
                    <option value="service">Layanan Servis</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Item *</label>
                <input
                  type="text"
                  required
                  placeholder="Oli Mesin SAE 10W-40"
                  value={form.data.name}
                  onChange={(e) => form.setData('name', e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-900 focus:border-[#eb6905] focus:outline-none"
                />
                {form.errors.name && <p className="text-xs text-rose-600 mt-1">{form.errors.name}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Harga (Rp) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={form.data.price}
                    onChange={(e) => form.setData('price', e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-900 focus:border-[#eb6905] focus:outline-none"
                  />
                  {form.errors.price && <p className="text-xs text-rose-600 mt-1">{form.errors.price}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Stok Awal *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={form.data.stock}
                    onChange={(e) => form.setData('stock', e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-900 focus:border-[#eb6905] focus:outline-none"
                  />
                  {form.errors.stock && <p className="text-xs text-rose-600 mt-1">{form.errors.stock}</p>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Deskripsi</label>
                <textarea
                  rows="2"
                  value={form.data.description}
                  onChange={(e) => form.setData('description', e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-900 focus:border-[#eb6905] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-200">
                <button type="button" onClick={() => setModalOpen(false)} className="rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100">
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={form.processing}
                  className="rounded-xl bg-[#eb6905] px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#d95d00] disabled:opacity-60"
                >
                  {form.processing ? 'Menyimpan...' : 'Simpan Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

SparepartsInventory.layout = (page) => <AdminLayout children={page} />;

export default SparepartsInventory;
