import React, { useState } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import InvoiceModal from '@/Components/pos/InvoiceModal';
import confetti from 'canvas-confetti';
import {
  ShoppingCart,
  Receipt,
  CreditCard,
  QrCode,
  DollarSign,   
  CheckCircle2,
  Printer,
} from 'lucide-react';

const POSCashier = ({ unpaidBookings = [], servicesAndParts = [] }) => {
  const { auth } = usePage().props;

  const [selectedBooking, setSelectedBooking] = useState(unpaidBookings[0] ?? null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [paidAmountInput, setPaidAmountInput] = useState('');
  const [invoiceDone, setInvoiceDone] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);

  const form = useForm({
    booking_id:     selectedBooking?.id ?? '',
    payment_method: 'cash',
    total_amount:   0,
  });

  // Compute totals from the selected booking's items
  const items = selectedBooking?.items ?? [];
  const subtotal   = items.reduce((acc, item) => acc + Number(item.subtotal), 0);
  const grossTotal = Math.max(0, subtotal - Number(discountAmount || 0));
  const taxAmount  = Math.round(grossTotal * 0.11);
  const grandTotal = grossTotal + taxAmount;
  const numericPaid = Number(paidAmountInput) || grandTotal;
  const changeAmount = Math.max(0, numericPaid - grandTotal);

  const handleSelectBooking = (booking) => {
    setSelectedBooking(booking);
    setInvoiceDone(false);
    setShowPrintModal(false);
    form.setData('booking_id', booking.id);
    setPaidAmountInput('');
    setDiscountAmount(0);
  };

  const handleCheckout = (e) => {
    e.preventDefault();
    if (!selectedBooking) return;

    form.setData('total_amount', grandTotal);

    form.post(route('admin.transactions.store'), {
      data: {
        booking_id:     selectedBooking.id,
        payment_method: form.data.payment_method,
        total_amount:   grandTotal,
      },
      onSuccess: () => {
        confetti({ particleCount: 70, spread: 50, origin: { y: 0.7 } });
        setInvoiceDone(true);
        setShowPrintModal(true);
      },
    });
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-extrabold text-[#091426]">Terminal POS Kasir &amp; Invoicing</h1>
        <p className="text-xs text-slate-500 mt-1">
          Proses checkout pembayaran transaksi perbaikan dan terbitkan invoice.
        </p>
      </div>

      {invoiceDone ? (
        <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-8 text-center space-y-4 shadow-sm">
          <CheckCircle2 className="h-14 w-14 text-emerald-600 mx-auto" />
          <div>
            <h2 className="text-lg font-extrabold text-emerald-900">Transaksi Berhasil! 🎉</h2>
            <p className="text-xs text-slate-600 mt-1">Invoice telah diterbitkan dan booking ditandai selesai.</p>
          </div>
          <div className="rounded-xl bg-white border border-emerald-200 p-4 text-xs space-y-1 text-left max-w-xs mx-auto">
            <div className="flex justify-between">
              <span className="text-slate-500">Booking:</span>
              <span className="font-mono font-bold">{selectedBooking?.booking_code}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Kendaraan:</span>
              <span className="font-bold">{selectedBooking?.vehicle?.license_plate}</span>
            </div>
            <div className="flex justify-between border-t border-slate-100 pt-2 mt-2">
              <span className="font-bold text-slate-700">Grand Total:</span>
              <span className="font-extrabold text-emerald-600">Rp {grandTotal.toLocaleString('id-ID')}</span>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <button
              onClick={() => setShowPrintModal(true)}
              className="flex items-center space-x-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-slate-800 transition-colors"
            >
              <Printer className="h-4 w-4 text-[#eb6905]" />
              <span>Cetak Struk / Invoice</span>
            </button>
            <button
              onClick={() => { setInvoiceDone(false); setSelectedBooking(null); setShowPrintModal(false); }}
              className="rounded-xl bg-[#eb6905] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#d95d00] transition-colors"
            >
              Proses Transaksi Berikutnya
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* LEFT: Booking selector + Item breakdown */}
          <div className="lg:col-span-7 space-y-6">

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
              <label className="block text-xs font-bold text-slate-800">
                Pilih Unit Kendaraan (Status: Selesai, Belum Bayar):
              </label>
              {unpaidBookings.length === 0 ? (
                <p className="text-xs text-slate-500 italic py-4 text-center">
                  Tidak ada unit dengan status selesai yang belum dibayar.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {unpaidBookings.map((booking) => (
                    <div
                      key={booking.id}
                      onClick={() => handleSelectBooking(booking)}
                      className={`cursor-pointer rounded-xl border p-3.5 transition-all text-xs ${
                        selectedBooking?.id === booking.id
                          ? 'border-[#eb6905] bg-[#eb6905]/10 ring-2 ring-[#eb6905] font-bold'
                          : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-mono font-bold text-slate-900">{booking.booking_code}</span>
                        <span className="font-mono bg-slate-900 text-white px-2 py-0.5 rounded text-[10px]">
                          {booking.vehicle?.license_plate}
                        </span>
                      </div>
                      <p className="text-slate-700 font-semibold mt-1">
                        {booking.customer?.name} — {booking.vehicle?.brand} {booking.vehicle?.model}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Item breakdown */}
            {selectedBooking && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
                  Rincian Tagihan — [{selectedBooking.vehicle?.license_plate}]
                </h3>
                <div className="space-y-1 text-xs">
                  {items.length === 0 ? (
                    <p className="text-slate-400 italic">Tidak ada item layanan.</p>
                  ) : (
                    items.map((item) => (
                      <div key={item.id} className="flex justify-between text-slate-800 font-medium">
                        <span>• {item.service?.name} {item.quantity > 1 ? `×${item.quantity}` : ''}</span>
                        <span className="font-bold">Rp {Number(item.subtotal).toLocaleString('id-ID')}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Calculator + Checkout */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md space-y-6">
              <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2 border-b border-slate-100 pb-3">
                <Receipt className="h-4 w-4 text-[#eb6905]" />
                <span>Kalkulator Kasir POS</span>
              </h3>

              {/* Totals */}
              <div className="space-y-2 text-xs text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="flex justify-between">
                  <span>Subtotal Layanan:</span>
                  <span className="font-bold">Rp {subtotal.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                  <span>Diskon / Potongan:</span>
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

              {/* Payment method */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-800">Metode Pembayaran:</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'cash',       label: 'Tunai',       icon: DollarSign },
                    { value: 'qris',       label: 'QRIS',        icon: QrCode },
                    { value: 'debit_card', label: 'Kartu Debit', icon: CreditCard },
                  ].map(({ value, label, icon: Icon }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => form.setData('payment_method', value)}
                      className={`py-2 rounded-xl border text-xs font-bold flex flex-col items-center justify-center space-y-1 ${
                        form.data.payment_method === value
                          ? 'border-[#eb6905] bg-[#eb6905]/10 text-[#eb6905]'
                          : 'border-slate-200 bg-slate-50 text-slate-700'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Cash change calculator */}
              {form.data.payment_method === 'cash' && (
                <div className="space-y-2 bg-emerald-50/60 p-3 rounded-xl border border-emerald-200">
                  <label className="block text-xs font-bold text-slate-800">Nominal Tunai Diterima:</label>
                  <input
                    type="number"
                    placeholder={`Min Rp ${grandTotal.toLocaleString('id-ID')}`}
                    value={paidAmountInput}
                    onChange={(e) => setPaidAmountInput(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-900 focus:border-[#eb6905] focus:outline-none"
                  />
                  <div className="flex justify-between text-xs font-extrabold text-emerald-800 pt-1">
                    <span>Kembalian:</span>
                    <span>Rp {changeAmount.toLocaleString('id-ID')}</span>
                  </div>
                </div>
              )}

              {/* Checkout button */}
              <button
                onClick={handleCheckout}
                disabled={form.processing || !selectedBooking}
                className="w-full flex items-center justify-center space-x-2 rounded-xl bg-[#eb6905] py-3.5 text-xs font-bold text-white shadow-lg hover:bg-[#d95d00] transition-colors disabled:opacity-50"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>{form.processing ? 'Memproses...' : 'Bayar & Terbitkan Invoice (Lunas)'}</span>
              </button>
            </div>
          </div>
      {/* Invoice Modal for receipt view and printing */}
      <InvoiceModal
        isOpen={showPrintModal}
        onClose={() => setShowPrintModal(false)}
        data={{
          ...selectedBooking,
          cashier_name: auth?.user?.name,
          subtotal,
          discountAmount,
          taxAmount,
          grandTotal,
          payment_method: form.data.payment_method,
          paidAmountInput,
          changeAmount,
        }}
      />
    </div>
  );
};

POSCashier.layout = (page) => <AdminLayout children={page} />;

export default POSCashier;
