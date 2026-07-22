import React, { useState, useEffect } from 'react';
import { mockApi } from '../../services/mockApi';
import { usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import ThermalReceiptPreview from '../../components/pos/ThermalReceiptPreview';
import confetti from 'canvas-confetti';
import {
  ShoppingCart,
  Receipt,
  CreditCard,
  QrCode,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  Printer,
  Sparkles,
} from 'lucide-react';

const POSCashier = () => {
  const { auth } = usePage().props;
  const user = auth?.user;
  const [workOrders, setWorkOrders] = useState([]);
  const [selectedWO, setSelectedWO] = useState(null);

  const [discountAmount, setDiscountAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [paidAmountInput, setPaidAmountInput] = useState('');

  const [createdInvoice, setCreatedInvoice] = useState(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const loadCompletedWO = async () => {
      const list = await mockApi.getWorkOrders();
      const completed = list.filter((w) => w.status === 'completed' || w.status === 'in_repair');
      setWorkOrders(completed);
      if (completed.length > 0) {
        setSelectedWO(completed[0]);
      }
    };
    loadCompletedWO();
  }, []);

  const subtotalServices = (selectedWO?.services || []).reduce((acc, s) => acc + Number(s.price), 0);
  const subtotalParts = (selectedWO?.proposed_spareparts || [])
    .filter((p) => p.approval_status === 'approved')
    .reduce((acc, p) => acc + Number(p.unit_price) * Number(p.qty), 0);

  const grossTotal = subtotalServices + subtotalParts - Number(discountAmount || 0);
  const taxAmount = Math.round(grossTotal * 0.11); // PPN 11%
  const grandTotal = Math.max(0, grossTotal + taxAmount);

  const numericPaid = Number(paidAmountInput) || grandTotal;
  const changeAmount = Math.max(0, numericPaid - grandTotal);

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!selectedWO) return;

    setProcessing(true);
    try {
      const invoice = await mockApi.processPOSCheckout({
        work_order_id: selectedWO.id,
        discount_amount: Number(discountAmount),
        payment_method: paymentMethod,
        paid_amount: numericPaid,
        cashier_name: user?.name || 'Siti Kasir',
      });

      setCreatedInvoice(invoice);
      confetti({ particleCount: 70, spread: 50, origin: { y: 0.7 } });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#091426]">Terminal POS Kasir & Invoicing</h1>
          <p className="text-xs text-slate-500 mt-1">
            Proses checkout pembayaran transaksi perbaikan dan pencetakan nota kasir thermal 80mm.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: WORK ORDER SELECTION & BILL BREAKDOWN */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* WO Selector */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
            <label className="block text-xs font-bold text-slate-800">Pilih Unit Kendaraan / Work Order (Siap Bayar):</label>
            {workOrders.length === 0 ? (
              <p className="text-xs text-slate-500 italic">Belum ada unit dengan status completed untuk di-checkout.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {workOrders.map((wo) => (
                  <div
                    key={wo.id}
                    onClick={() => {
                      setSelectedWO(wo);
                      setCreatedInvoice(null);
                    }}
                    className={`cursor-pointer rounded-xl border p-3.5 transition-all text-xs ${
                      selectedWO?.id === wo.id
                        ? 'border-[#eb6905] bg-[#eb6905]/10 ring-2 ring-[#eb6905] font-bold'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-mono font-bold text-slate-900">{wo.work_order_number}</span>
                      <span className="font-mono bg-slate-900 text-white px-2 py-0.5 rounded text-[10px]">
                        {wo.license_plate}
                      </span>
                    </div>
                    <p className="text-slate-800 font-bold mt-1">{wo.customer_name} ({wo.vehicle_model})</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ITEM BILL RENDERER */}
          {selectedWO && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
                Rincian Item Transaksi [{selectedWO.license_plate}]
              </h3>

              <div className="space-y-3 text-xs">
                {/* Services */}
                <div>
                  <p className="font-bold text-slate-500 mb-1.5 uppercase text-[10px]">Layanan Jasa Servis:</p>
                  <div className="space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    {(selectedWO.services || []).map((s) => (
                      <div key={s.id} className="flex justify-between text-slate-800 font-medium">
                        <span>• {s.name}</span>
                        <span className="font-bold">Rp {s.price.toLocaleString('id-ID')}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Spareparts */}
                <div>
                  <p className="font-bold text-slate-500 mb-1.5 uppercase text-[10px]">Suku Cadang Disetujui Customer:</p>
                  <div className="space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    {(selectedWO.proposed_spareparts || [])
                      .filter((p) => p.approval_status === 'approved')
                      .map((p) => (
                        <div key={p.sparepart_id} className="flex justify-between text-slate-800 font-medium">
                          <span>• {p.name} ({p.qty}x)</span>
                          <span className="font-bold">Rp {(p.qty * p.unit_price).toLocaleString('id-ID')}</span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* RIGHT COLUMN: CALCULATOR & PAYMENT CHECKOUT */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md space-y-6">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2 border-b border-slate-100 pb-3">
              <Receipt className="h-4 w-4 text-[#eb6905]" />
              <span>Kalkulator Kasir POS & Diskon</span>
            </h3>

            {/* Calculations Breakdown */}
            <div className="space-y-2 text-xs text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="flex justify-between">
                <span>Subtotal Jasa:</span>
                <span className="font-bold">Rp {subtotalServices.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between">
                <span>Subtotal Spareparts:</span>
                <span className="font-bold">Rp {subtotalParts.toLocaleString('id-ID')}</span>
              </div>
              
              <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                <span>Diskon / Potongan Promo:</span>
                <input
                  type="number"
                  value={discountAmount}
                  onChange={(e) => setDiscountAmount(e.target.value)}
                  placeholder="0"
                  className="w-28 rounded-lg border border-slate-300 bg-white px-2 py-1 text-right text-xs font-bold text-slate-900 focus:border-[#eb6905] focus:outline-none"
                />
              </div>

              <div className="flex justify-between text-slate-500 pt-1">
                <span>PPN (11%):</span>
                <span className="font-bold">Rp {taxAmount.toLocaleString('id-ID')}</span>
              </div>

              <div className="flex justify-between text-sm font-extrabold text-[#091426] pt-2 border-t border-slate-300">
                <span>GRAND TOTAL:</span>
                <span className="text-[#eb6905] text-base">Rp {grandTotal.toLocaleString('id-ID')}</span>
              </div>
            </div>

            {/* PAYMENT METHOD PICKER */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-800">Metode Pembayaran:</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cash')}
                  className={`py-2 rounded-xl border text-xs font-bold flex flex-col items-center justify-center space-y-1 ${
                    paymentMethod === 'cash'
                      ? 'border-[#eb6905] bg-[#eb6905]/10 text-[#eb6905]'
                      : 'border-slate-200 bg-slate-50 text-slate-700'
                  }`}
                >
                  <DollarSign className="h-4 w-4" />
                  <span>Tunai (Cash)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('qris')}
                  className={`py-2 rounded-xl border text-xs font-bold flex flex-col items-center justify-center space-y-1 ${
                    paymentMethod === 'qris'
                      ? 'border-[#eb6905] bg-[#eb6905]/10 text-[#eb6905]'
                      : 'border-slate-200 bg-slate-50 text-slate-700'
                  }`}
                >
                  <QrCode className="h-4 w-4" />
                  <span>QRIS Instant</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('debit_card')}
                  className={`py-2 rounded-xl border text-xs font-bold flex flex-col items-center justify-center space-y-1 ${
                    paymentMethod === 'debit_card'
                      ? 'border-[#eb6905] bg-[#eb6905]/10 text-[#eb6905]'
                      : 'border-slate-200 bg-slate-50 text-slate-700'
                  }`}
                >
                  <CreditCard className="h-4 w-4" />
                  <span>Kartu Debit/EDC</span>
                </button>
              </div>
            </div>

            {/* CASH INPUT & CHANGE CALCULATION */}
            {paymentMethod === 'cash' && (
              <div className="space-y-2 bg-emerald-50/60 p-3 rounded-xl border border-emerald-200">
                <label className="block text-xs font-bold text-slate-800">Nominal Tunai Diterima:</label>
                <input
                  type="number"
                  placeholder={`Maks Rp ${grandTotal.toLocaleString('id-ID')}`}
                  value={paidAmountInput}
                  onChange={(e) => setPaidAmountInput(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-900 focus:border-[#eb6905] focus:outline-none"
                />
                <div className="flex justify-between text-xs font-extrabold text-emerald-800 pt-1">
                  <span>Kembalian Kasir:</span>
                  <span>Rp {changeAmount.toLocaleString('id-ID')}</span>
                </div>
              </div>
            )}

            {/* CHECKOUT ACTION */}
            {!createdInvoice ? (
              <button
                onClick={handleCheckout}
                disabled={processing || !selectedWO}
                className="w-full flex items-center justify-center space-x-2 rounded-xl bg-[#eb6905] py-3.5 text-xs font-bold text-white shadow-lg hover:bg-[#d95d00] transition-colors disabled:opacity-50"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>{processing ? 'Memproses Transaksi...' : 'Bayar & Terbitkan Invoice (Lunas)'}</span>
              </button>
            ) : (
              <ThermalReceiptPreview invoice={createdInvoice} />
            )}

          </div>

        </div>

      </div>

    </div>
  );
};

POSCashier.layout = (page) => <AdminLayout children={page} />;

export default POSCashier;
