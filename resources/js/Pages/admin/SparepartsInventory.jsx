import React, { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Package, Search, Plus, Edit, Trash2, X, AlertTriangle } from 'lucide-react';

const SparepartsInventory = ({ inventory = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedPart, setSelectedPart] = useState(null);

  // Form for Adding
  const addForm = useForm({
    code: '',
    name: '',
    category: 'sparepart',
    price: 0,
    stock: 0,
    estimated_minutes: 0,
    description: '',
  });

  // Form for Editing
  const editForm = useForm({
    name: '',
    price: 0,
    stock: 0,
    category: 'sparepart',
    description: '',
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
    addForm.post(route('admin.services.store'), {
      onSuccess: () => {
        setAddModalOpen(false);
        addForm.reset();
      },
    });
  };

  const handleOpenEdit = (part) => {
    setSelectedPart(part);
    editForm.setData({
      name: part.name || '',
      price: part.price || 0,
      stock: part.stock || 0,
      category: part.category || 'sparepart',
      description: part.description || '',
    });
    editForm.clearErrors();
    setEditModalOpen(true);
  };

  const handleEditPart = (e) => {
    e.preventDefault();
    if (!selectedPart) return;
    editForm.patch(route('admin.services.update', selectedPart.id), {
      onSuccess: () => {
        setEditModalOpen(false);
        setSelectedPart(null);
      },
    });
  };

  const handleOpenDelete = (part) => {
    setSelectedPart(part);
    setDeleteModalOpen(true);
  };

  const handleDeletePart = () => {
    if (!selectedPart) return;
    router.delete(route('admin.services.destroy', selectedPart.id), {
      onSuccess: () => {
        setDeleteModalOpen(false);
        setSelectedPart(null);
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#091426]">Inventaris Suku Cadang</h1>
          <p className="text-xs text-slate-500 mt-1">Kelola stok, harga, dan item inventaris suku cadang bengkel.</p>
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
            onClick={() => {
              addForm.reset();
              addForm.clearErrors();
              setAddModalOpen(true);
            }}
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
                  {searchTerm ? 'Tidak ada hasil penelusuran.' : 'Belum ada item inventaris.'}
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
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 font-bold text-[10px] ${
                        part.stock <= 5 ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {part.stock} unit
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        onClick={() => handleOpenEdit(part)}
                        className="flex items-center space-x-1 rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-[11px] font-bold text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors"
                        title="Edit Item / Harga"
                      >
                        <Edit className="h-3.5 w-3.5" />
                        <span>Edit Harga / Detail</span>
                      </button>
                      <button
                        onClick={() => handleOpenDelete(part)}
                        className="flex items-center space-x-1 rounded-lg border border-rose-200 bg-rose-50 px-2 py-1 text-[11px] font-bold text-rose-700 hover:bg-rose-100 transition-colors"
                        title="Hapus Item"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Hapus</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ADD ITEM MODAL */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <h3 className="text-lg font-bold text-slate-900">Tambah Item Baru</h3>
              <button onClick={() => setAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
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
                    value={addForm.data.code}
                    onChange={(e) => addForm.setData('code', e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-mono font-bold text-slate-900 uppercase focus:border-[#eb6905] focus:outline-none"
                  />
                  {addForm.errors.code && <p className="text-xs text-rose-600 mt-1">{addForm.errors.code}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Kategori</label>
                  <select
                    value={addForm.data.category}
                    onChange={(e) => addForm.setData('category', e.target.value)}
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
                  value={addForm.data.name}
                  onChange={(e) => addForm.setData('name', e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-900 focus:border-[#eb6905] focus:outline-none"
                />
                {addForm.errors.name && <p className="text-xs text-rose-600 mt-1">{addForm.errors.name}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Harga (Rp) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={addForm.data.price}
                    onChange={(e) => addForm.setData('price', e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-900 focus:border-[#eb6905] focus:outline-none"
                  />
                  {addForm.errors.price && <p className="text-xs text-rose-600 mt-1">{addForm.errors.price}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Stok Awal *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={addForm.data.stock}
                    onChange={(e) => addForm.setData('stock', e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-900 focus:border-[#eb6905] focus:outline-none"
                  />
                  {addForm.errors.stock && <p className="text-xs text-rose-600 mt-1">{addForm.errors.stock}</p>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Deskripsi</label>
                <textarea
                  rows="2"
                  value={addForm.data.description}
                  onChange={(e) => addForm.setData('description', e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-900 focus:border-[#eb6905] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={addForm.processing}
                  className="rounded-xl bg-[#eb6905] px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#d95d00] disabled:opacity-60"
                >
                  {addForm.processing ? 'Menyimpan...' : 'Simpan Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT ITEM / EDIT HARGA MODAL */}
      {editModalOpen && selectedPart && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Edit Harga &amp; Detail Item</h3>
                <p className="text-xs text-slate-500 font-mono">Kode: {selectedPart.code}</p>
              </div>
              <button onClick={() => setEditModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleEditPart} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Item *</label>
                <input
                  type="text"
                  required
                  value={editForm.data.name}
                  onChange={(e) => editForm.setData('name', e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-900 focus:border-[#eb6905] focus:outline-none"
                />
                {editForm.errors.name && <p className="text-xs text-rose-600 mt-1">{editForm.errors.name}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Harga Baru (Rp) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={editForm.data.price}
                    onChange={(e) => editForm.setData('price', e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-900 focus:border-[#eb6905] focus:outline-none"
                  />
                  {editForm.errors.price && <p className="text-xs text-rose-600 mt-1">{editForm.errors.price}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Stok Fisik *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={editForm.data.stock}
                    onChange={(e) => editForm.setData('stock', e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-900 focus:border-[#eb6905] focus:outline-none"
                  />
                  {editForm.errors.stock && <p className="text-xs text-rose-600 mt-1">{editForm.errors.stock}</p>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Deskripsi</label>
                <textarea
                  rows="2"
                  value={editForm.data.description}
                  onChange={(e) => editForm.setData('description', e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-900 focus:border-[#eb6905] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={editForm.processing}
                  className="rounded-xl bg-[#eb6905] px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#d95d00] disabled:opacity-60"
                >
                  {editForm.processing ? 'Menyimpan...' : 'Perbarui Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteModalOpen && selectedPart && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center space-x-3 text-rose-600">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-100">
                <AlertTriangle className="h-5 w-5 text-rose-600" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Konfirmasi Hapus</h3>
            </div>

            <p className="text-xs text-slate-600">
              Apakah Anda yakin ingin menghapus barang <strong>{selectedPart.name}</strong> ({selectedPart.code}) dari inventaris? Tindakan ini tidak dapat dibatalkan.
            </p>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteModalOpen(false)}
                className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDeletePart}
                className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-rose-700"
              >
                Ya, Hapus Item
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

SparepartsInventory.layout = (page) => <AdminLayout children={page} />;

export default SparepartsInventory;
