import React from 'react';
import { Wrench, Printer, X, CheckCircle2 } from 'lucide-react';

const InvoiceModal = ({ isOpen, onClose, data }) => {
  if (!isOpen || !data) return null;

  const {
    invoiceNumber = 'INV-' + Math.floor(100000 + Math.random() * 900000),
    bookingCode = data.booking_code || 'BK-ONLINE',
    createdAt = data.paid_at || data.created_at || new Date().toISOString(),
    cashierName = data.cashier_name || 'Kasir Stelle',
    customerName = data.customer?.name || data.booking?.customer?.name || 'Pelanggan Umum',
    customerPhone = data.customer?.phone_number || data.booking?.customer?.phone_number || '-',
    vehiclePlate = data.vehicle?.license_plate || data.booking?.vehicle?.license_plate || '-',
    vehicleModel = (data.vehicle?.brand || data.booking?.vehicle?.brand || '') + ' ' + (data.vehicle?.model || data.booking?.vehicle?.model || ''),
    items = data.items || data.booking?.items || [],
    subtotal = data.subtotal || items.reduce((acc, i) => acc + Number(i.subtotal || 0), 0),
    discount = data.discountAmount || 0,
    tax = data.taxAmount || 0,
    grandTotal = data.grandTotal || data.total_amount || (subtotal - discount + tax),
    paymentMethod = data.payment_method || data.paymentMethod || 'cash',
    paidAmount = data.paidAmountInput || data.paidAmount || grandTotal,
    changeAmount = data.changeAmount || (Number(paidAmount) > grandTotal ? Number(paidAmount) - grandTotal : 0),
  } = data;

  const handlePrint = () => {
    window.print();
  };

  const formatPaymentMethod = (method) => {
    switch (method) {
      case 'cash':
        return 'Tunai (Cash)';
      case 'qris':
        return 'QRIS Non-Tunai';
      case 'transfer':
        return 'Transfer Bank';
      case 'debit_card':
      case 'debit':
        return 'Kartu Debit';
      default:
        return method.toUpperCase();
    }
  };

  return (
    <>
      {/* Inline Print Styles */}
      <style>{`
        @media print {
          /* Hide all UI elements except printable invoice */
          body * {
            visibility: hidden !important;
          }
          .no-print, nav, header, aside, footer, button, .backdrop-blur-xs {
            display: none !important;
          }
          #invoice-print-area, #invoice-print-area * {
            visibility: visible !important;
          }
          #invoice-print-area {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            max-width: 80mm !important;
            margin: 0 auto !important;
            padding: 10px !important;
            background: #ffffff !important;
            color: #000000 !important;
            box-shadow: none !important;
            border: none !important;
            font-family: monospace, sans-serif !important;
          }
          .invoice-card {
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
          }
          .invoice-divider {
            border-bottom: 1px dashed #000000 !important;
          }
        }
      `}</style>

      {/* Modal Overlay backdrop */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs no-print">
        <div className="w-full max-w-lg rounded-3xl bg-white shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
          
          {/* Modal Header Controls (No Print) */}
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50 no-print">
            <div className="flex items-center space-x-2 text-[#091426]">
              <ReceiptIcon className="h-5 w-5 text-[#eb6905]" />
              <h2 className="text-base font-extrabold">Struk Pembayaran &amp; Invoice</h2>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-800 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Printable Receipt Area */}
          <div className="overflow-y-auto p-6 space-y-4 text-slate-900 bg-white" id="invoice-print-area">
            <div className="invoice-card space-y-4">

              {/* Workshop Header */}
              <div className="text-center space-y-1 pb-3 border-b border-dashed border-slate-300 invoice-divider">
                <div className="flex items-center justify-center space-x-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900 text-white">
                    <Wrench className="h-4 w-4 text-[#eb6905]" />
                  </div>
                  <span className="text-lg font-black tracking-tight text-slate-900">Bengkel Stelle</span>
                </div>
                <p className="text-[11px] font-semibold text-slate-600">Jl. Raya Jend. Sudirman No. 88, Cilegon, Banten</p>
                <p className="text-[10px] text-slate-500">Telp/WA: (0254) 388-9900 | Servis &amp; Sparepart Spesialis</p>
              </div>

              {/* Transaction Metadata */}
              <div className="grid grid-cols-2 text-[11px] gap-y-1 border-b border-dashed border-slate-300 pb-3 invoice-divider">
                <div>
                  <span className="text-slate-500">No. Invoice:</span>
                  <p className="font-mono font-bold text-slate-900">{invoiceNumber}</p>
                </div>
                <div className="text-right">
                  <span className="text-slate-500">Tanggal:</span>
                  <p className="font-medium text-slate-800">
                    {new Date(createdAt).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                  </p>
                </div>
                <div>
                  <span className="text-slate-500">No. Booking:</span>
                  <p className="font-mono font-semibold text-slate-800">{bookingCode}</p>
                </div>
                <div className="text-right">
                  <span className="text-slate-500">Kasir:</span>
                  <p className="font-medium text-slate-800">{cashierName}</p>
                </div>
              </div>

              {/* Customer & Vehicle Info */}
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-[11px] space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Pelanggan:</span>
                  <span className="font-bold text-slate-900">{customerName} ({customerPhone})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Kendaraan:</span>
                  <span className="font-bold text-slate-900">{vehicleModel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">No. Polisi (Plat):</span>
                  <span className="font-mono font-bold bg-slate-900 text-white px-1.5 py-0.2 rounded text-[10px]">
                    {vehiclePlate}
                  </span>
                </div>
              </div>

              {/* Itemized Table */}
              <div className="space-y-2">
                <table className="w-full text-left text-[11px]">
                  <thead>
                    <tr className="border-b border-slate-300 text-slate-500 font-bold">
                      <th className="py-1">Deskripsi Item</th>
                      <th className="py-1 text-center">Qty</th>
                      <th className="py-1 text-right">Harga</th>
                      <th className="py-1 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {items.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-2 text-center text-slate-400 italic">
                          Tidak ada rincian item layanan.
                        </td>
                      </tr>
                    ) : (
                      items.map((item, idx) => (
                        <tr key={item.id || idx}>
                          <td className="py-1.5 font-medium text-slate-800 pr-1">
                            {item.service?.name || item.name || 'Jasa Servis'}
                          </td>
                          <td className="py-1.5 text-center font-bold text-slate-700">{item.quantity}</td>
                          <td className="py-1.5 text-right text-slate-600">
                            Rp {Number(item.price || item.service?.price || 0).toLocaleString('id-ID')}
                          </td>
                          <td className="py-1.5 text-right font-bold text-slate-900">
                            Rp {Number(item.subtotal || (item.price * item.quantity)).toLocaleString('id-ID')}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Payment Summary */}
              <div className="border-t border-dashed border-slate-300 pt-3 space-y-1.5 text-[11px] invoice-divider">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span>Rp {Number(subtotal).toLocaleString('id-ID')}</span>
                </div>
                {Number(discount) > 0 && (
                  <div className="flex justify-between text-rose-600">
                    <span>Diskon / Potongan</span>
                    <span>- Rp {Number(discount).toLocaleString('id-ID')}</span>
                  </div>
                )}
                {Number(tax) > 0 && (
                  <div className="flex justify-between text-slate-500">
                    <span>PPN (11%)</span>
                    <span>Rp {Number(tax).toLocaleString('id-ID')}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-extrabold text-slate-900 border-t border-slate-300 pt-1.5">
                  <span>TOTAL BAYAR</span>
                  <span className="text-[#eb6905]">Rp {Number(grandTotal).toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-slate-700 pt-1">
                  <span>Metode Pembayaran</span>
                  <span className="font-bold">{formatPaymentMethod(paymentMethod)}</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>Nominal Diterima</span>
                  <span className="font-bold">Rp {Number(paidAmount).toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-slate-700 font-bold">
                  <span>Kembalian</span>
                  <span className="text-emerald-600">Rp {Number(changeAmount).toLocaleString('id-ID')}</span>
                </div>
              </div>

              {/* Receipt Footer */}
              <div className="text-center text-[10px] text-slate-500 border-t border-dashed border-slate-300 pt-3 space-y-0.5 invoice-divider">
                <p className="font-bold text-slate-800">*** LUNAS ***</p>
                <p>Terima kasih atas kunjungan Anda di Bengkel Stelle!</p>
                <p className="italic">Simpan struk ini sebagai bukti garansi pengerjaan &amp; transaksi resmi.</p>
              </div>

            </div>
          </div>

          {/* Modal Footer Controls (No Print) */}
          <div className="flex items-center justify-end space-x-3 border-t border-slate-200 px-6 py-4 bg-slate-50 no-print">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              Tutup
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center space-x-2 rounded-xl bg-[#eb6905] px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-[#d95d00] transition-colors"
            >
              <Printer className="h-4 w-4" />
              <span>Cetak Struk / Invoice</span>
            </button>
          </div>

        </div>
      </div>
    </>
  );
};

const ReceiptIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" />
    <path d="M16 8h-6" />
    <path d="M16 12h-6" />
    <path d="M16 16h-6" />
  </svg>
);

export default InvoiceModal;
