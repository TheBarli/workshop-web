import React, { useState, useEffect } from 'react';
import { mockApi } from '../../services/mockApi';
import AdminLayout from '@/Layouts/AdminLayout';
import { Package, Search, Plus, AlertTriangle, CheckCircle2, Edit2, X } from 'lucide-react';

const SparepartsInventory = () => {
  const [spareparts, setSpareparts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const [newPart, setNewPart] = useState({
    name: '',
    category: 'General',
    stock: 10,
    min_stock: 5,
    purchase_price: 50000,
    selling_price: 75000,
  });

  const loadParts = async () => {
    setLoading(true);
    try {
      const data = await mockApi.getSpareparts();
      setSpareparts(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadParts();
  }, []);

  const handleStockUpdate = async (id, currentStock) => {
    const next = prompt('Masukkan jumlah stok fisik baru:', currentStock);
    if (next !== null && !isNaN(next)) {
      await mockApi.updateSparepartStock(id, next);
      loadParts();
    }
  };

  const handleAddPart = async (e) => {
    e.preventDefault();
    await mockApi.addSparepart(newPart);
    setModalOpen(false);
    loadParts();
  };

  const filteredParts = spareparts.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.part_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#091426]">Manajemen Inventaris & Stock Control</h1>
          <p className="text-xs text-slate-500 mt-1">
            Pengelolaan data master suku cadang, penyesuaian stok gudang, & peringatan stok minimum.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center space-x-2 rounded-xl bg-[#eb6905] px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#d95d00]"
        >
          <Plus className="h-4 w-4" />
          <span>Tambah Master Part</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="Cari SKU atau nama sparepart..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-xl border border-slate-300 bg-white pl-10 pr-4 py-2 text-xs font-medium text-slate-900 focus:border-[#eb6905] focus:outline-none"
        />
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 uppercase font-bold border-b border-slate-200">
              <tr>
                <th className="p-3">SKU Part Code</th>
                <th className="p-3">Nama Sparepart</th>
                <th className="p-3">Kategori</th>
                <th className="p-3 text-center">Stok Gudang</th>
                <th className="p-3">Harga Beli (HPP)</th>
                <th className="p-3">Harga Jual</th>
                <th className="p-3 text-right">Aksi Stock Adjustment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredParts.map((p) => {
                const isLow = p.stock <= p.min_stock;
                return (
                  <tr key={p.id} className="hover:bg-slate-50 font-medium">
                    <td className="p-3 font-mono font-bold text-slate-900">{p.part_code}</td>
                    <td className="p-3 font-bold text-slate-900">{p.name}</td>
                    <td className="p-3">{p.category}</td>
                    <td className="p-3 text-center">
                      <span className={`px-3 py-1 rounded-full font-bold text-xs inline-block ${isLow ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                        {p.stock}
                      </span>
                    </td>
                    <td className="p-3 text-slate-500">Rp {p.purchase_price.toLocaleString('id-ID')}</td>
                    <td className="p-3 font-extrabold text-[#eb6905]">Rp {p.selling_price.toLocaleString('id-ID')}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleStockUpdate(p.id, p.stock)}
                        className="rounded-lg bg-slate-100 px-3 py-1.5 font-bold text-slate-700 hover:bg-slate-200"
                      >
                        Adjust Stok
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD MASTER PART MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <h3 className="text-base font-bold text-slate-900">Tambah Master Sparepart Baru</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddPart} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Sparepart</label>
                <input
                  type="text"
                  required
                  value={newPart.name}
                  onChange={(e) => setNewPart({ ...newPart, name: e.target.value })}
                  placeholder="e.g. Kampas Rem Depan Avanza"
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 p-2.5 font-medium text-slate-900 focus:border-[#eb6905] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Stok Awal</label>
                  <input
                    type="number"
                    required
                    value={newPart.stock}
                    onChange={(e) => setNewPart({ ...newPart, stock: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 p-2.5 font-medium text-slate-900 focus:border-[#eb6905] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Min Threshold</label>
                  <input
                    type="number"
                    required
                    value={newPart.min_stock}
                    onChange={(e) => setNewPart({ ...newPart, min_stock: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 p-2.5 font-medium text-slate-900 focus:border-[#eb6905] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Harga Beli HPP</label>
                  <input
                    type="number"
                    required
                    value={newPart.purchase_price}
                    onChange={(e) => setNewPart({ ...newPart, purchase_price: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 p-2.5 font-medium text-slate-900 focus:border-[#eb6905] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Harga Jual</label>
                  <input
                    type="number"
                    required
                    value={newPart.selling_price}
                    onChange={(e) => setNewPart({ ...newPart, selling_price: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 p-2.5 font-medium text-slate-900 focus:border-[#eb6905] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#eb6905] px-5 py-2 font-bold text-white shadow-md hover:bg-[#d95d00]"
                >
                  Simpan Part
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
