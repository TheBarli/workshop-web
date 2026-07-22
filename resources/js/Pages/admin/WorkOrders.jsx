import React, { useState, useEffect } from 'react';
import { mockApi } from '../../services/mockApi';
import AdminLayout from '@/Layouts/AdminLayout';
import {
  ClipboardList,
  Wrench,
  Plus,
  CheckCircle2,
  AlertCircle,
  X,
  Play,
  Check,
  Send,
} from 'lucide-react';

const WorkOrders = () => {
  const [workOrders, setWorkOrders] = useState([]);
  const [spareparts, setSpareparts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State for Proposing Parts
  const [selectedWO, setSelectedWO] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [mechanicNotes, setMechanicNotes] = useState('');
  const [proposedItems, setProposedItems] = useState([]);

  const loadData = async () => {
    setLoading(true);
    try {
      const woData = await mockApi.getWorkOrders();
      const spData = await mockApi.getSpareparts();
      setWorkOrders(woData);
      setSpareparts(spData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openProposeModal = (wo) => {
    setSelectedWO(wo);
    setMechanicNotes(wo.mechanic_notes || '');
    setProposedItems(
      wo.proposed_spareparts && wo.proposed_spareparts.length > 0
        ? wo.proposed_spareparts
        : [{ sparepart_id: spareparts[0]?.id || 1, name: spareparts[0]?.name || '', qty: 1, unit_price: spareparts[0]?.selling_price || 0, approval_status: 'proposed' }]
    );
    setModalOpen(true);
  };

  const handleAddProposedRow = () => {
    const defaultPart = spareparts[0];
    setProposedItems([
      ...proposedItems,
      {
        sparepart_id: defaultPart.id,
        name: defaultPart.name,
        qty: 1,
        unit_price: defaultPart.selling_price,
        approval_status: 'proposed',
      },
    ]);
  };

  const handlePartSelection = (index, partId) => {
    const part = spareparts.find((sp) => sp.id === Number(partId));
    if (!part) return;
    const updated = [...proposedItems];
    updated[index] = {
      sparepart_id: part.id,
      name: part.name,
      qty: updated[index].qty || 1,
      unit_price: part.selling_price,
      approval_status: 'proposed',
    };
    setProposedItems(updated);
  };

  const handleQtyChange = (index, qty) => {
    const updated = [...proposedItems];
    updated[index].qty = Number(qty) || 1;
    setProposedItems(updated);
  };

  const handleRemoveRow = (index) => {
    setProposedItems(proposedItems.filter((_, i) => i !== index));
  };

  const handleSubmitProposal = async (e) => {
    e.preventDefault();
    if (!selectedWO) return;
    await mockApi.proposeSparepartsEstimate(selectedWO.id, proposedItems, mechanicNotes);
    setModalOpen(false);
    loadData();
  };

  const handleMarkAsCompleted = async (woId) => {
    await mockApi.completeWorkOrder(woId);
    loadData();
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#091426]">Mechanic Workbench & Work Orders (WO)</h1>
          <p className="text-xs text-slate-500 mt-1">
            Papan kerja mekanik di pit bay, pengajuan estimasi sparepart, dan penyelesaian unit perbaikan.
          </p>
        </div>
      </div>

      {/* KANBAN BOARD */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* COLUMN 1: INSPEKSI & CHECKUP */}
        <div className="rounded-2xl border border-slate-200 bg-slate-100 p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center space-x-2">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              <span>1. Inspeksi / Checkup ({workOrders.filter((w) => w.status === 'inspecting').length})</span>
            </h3>
          </div>

          <div className="space-y-3">
            {workOrders
              .filter((w) => w.status === 'inspecting')
              .map((wo) => (
                <div key={wo.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#091426]">{wo.work_order_number}</span>
                    <span className="font-mono font-bold text-xs bg-slate-900 text-white px-2 py-0.5 rounded">
                      {wo.license_plate}
                    </span>
                  </div>

                  <div>
                    <p className="text-xs font-bold text-slate-900">{wo.vehicle_model}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Mekanik: {wo.mechanic_name}</p>
                  </div>

                  <button
                    onClick={() => openProposeModal(wo)}
                    className="w-full flex items-center justify-center space-x-1 rounded-xl bg-amber-500 px-3 py-2 text-xs font-bold text-white shadow-sm hover:bg-amber-600"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Ajukan Rekomendasi Part</span>
                  </button>
                </div>
              ))}
          </div>
        </div>

        {/* COLUMN 2: ESTIMASI & REPAIR IN PROGRESS */}
        <div className="rounded-2xl border border-slate-200 bg-slate-100 p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center space-x-2">
              <span className="h-2 w-2 rounded-full bg-indigo-500" />
              <span>2. Perbaikan Fisik ({workOrders.filter((w) => ['estimate_proposed', 'in_repair'].includes(w.status)).length})</span>
            </h3>
          </div>

          <div className="space-y-3">
            {workOrders
              .filter((w) => ['estimate_proposed', 'in_repair'].includes(w.status))
              .map((wo) => (
                <div key={wo.id} className="rounded-xl border border-indigo-200 bg-white p-4 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-slate-900">{wo.work_order_number}</span>
                    <span className="font-mono font-bold text-xs bg-indigo-900 text-white px-2 py-0.5 rounded">
                      {wo.license_plate}
                    </span>
                  </div>

                  <div>
                    <p className="text-xs font-bold text-slate-900">{wo.vehicle_model}</p>
                    <p className="text-[11px] text-slate-600 mt-1 italic">"{wo.mechanic_notes}"</p>
                  </div>

                  <div className="space-y-1.5 border-t border-slate-100 pt-2 text-[11px]">
                    <p className="font-bold text-slate-700">Part Direkomendasikan:</p>
                    {wo.proposed_spareparts.map((p) => (
                      <div key={p.sparepart_id} className="flex justify-between items-center text-slate-600">
                        <span>• {p.name} ({p.qty}x)</span>
                        <span className={`font-bold capitalize text-[10px] ${p.approval_status === 'approved' ? 'text-emerald-600' : 'text-amber-600'}`}>
                          {p.approval_status}
                        </span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => handleMarkAsCompleted(wo.id)}
                    className="w-full flex items-center justify-center space-x-1 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-700"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Tandai Pengerjaan Selesai</span>
                  </button>
                </div>
              ))}
          </div>
        </div>

        {/* COLUMN 3: COMPLETED */}
        <div className="rounded-2xl border border-slate-200 bg-slate-100 p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center space-x-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>3. Selesai (Siap Kasir POS) ({workOrders.filter((w) => w.status === 'completed').length})</span>
            </h3>
          </div>

          <div className="space-y-3">
            {workOrders
              .filter((w) => w.status === 'completed')
              .map((wo) => (
                <div key={wo.id} className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-slate-900">{wo.work_order_number}</span>
                    <span className="font-mono font-bold text-xs bg-emerald-700 text-white px-2 py-0.5 rounded">
                      {wo.license_plate}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-slate-900">{wo.vehicle_model}</p>
                  <p className="text-[11px] text-emerald-800 font-semibold">Ready for POS Cashier Checkout</p>
                </div>
              ))}
          </div>
        </div>

      </div>

      {/* PROPOSE SPAREPARTS ESTIMATE MODAL [BR-006] */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Pengajuan Rekomendasi Sparepart [{selectedWO?.work_order_number}]
                </h3>
                <p className="text-xs text-slate-500">
                  Customer ({selectedWO?.customer_name}) akan menerima notifikasi WA persetujuan.
                </p>
              </div>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitProposal} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Catatan Diagnostik Mekanik</label>
                <textarea
                  rows="2"
                  value={mechanicNotes}
                  onChange={(e) => setMechanicNotes(e.target.value)}
                  placeholder="Catatan hasil inspeksi..."
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 p-3 text-xs font-medium text-slate-900 focus:border-[#eb6905] focus:outline-none"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700">Daftar Suku Cadang Direkomendasikan:</label>
                  <button
                    type="button"
                    onClick={handleAddProposedRow}
                    className="text-xs font-bold text-[#eb6905] hover:underline flex items-center space-x-1"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>+ Baris Sparepart</span>
                  </button>
                </div>

                {proposedItems.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <select
                      value={item.sparepart_id}
                      onChange={(e) => handlePartSelection(index, e.target.value)}
                      className="flex-1 rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-900"
                    >
                      {spareparts.map((sp) => (
                        <option key={sp.id} value={sp.id}>
                          {sp.name} (Stok: {sp.stock}) - Rp {sp.selling_price.toLocaleString('id-ID')}
                        </option>
                      ))}
                    </select>

                    <input
                      type="number"
                      min="1"
                      value={item.qty}
                      onChange={(e) => handleQtyChange(index, e.target.value)}
                      className="w-16 rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-xs font-bold text-center text-slate-900"
                    />

                    <button
                      type="button"
                      onClick={() => handleRemoveRow(index)}
                      className="text-rose-500 hover:text-rose-700 p-1"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex items-center space-x-1 rounded-xl bg-[#eb6905] px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#d95d00]"
                >
                  <Send className="h-4 w-4" />
                  <span>Kirimkan Notifikasi Link WA</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

WorkOrders.layout = (page) => <AdminLayout children={page} />;

export default WorkOrders;
