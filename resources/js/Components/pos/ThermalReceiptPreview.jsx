import React from 'react';
import { Printer, CheckCircle } from 'lucide-react';

const ThermalReceiptPreview = ({ invoice }) => {
  if (!invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      {/* 80mm THERMAL RECEIPT DISPLAY AREA (TARGETED BY @media print) */}
      <div
        id="thermal-receipt-area"
        className="mx-auto w-full max-w-[300px] border border-dashed border-slate-300 bg-white p-4 font-mono text-[11px] text-slate-900 shadow-md rounded-xl"
      >
        <div className="text-center space-y-1 border-b border-dashed border-slate-300 pb-3">
          <h2 className="text-sm font-extrabold tracking-widest">BENGKEL STELLE</h2>
          <p className="text-[10px] text-slate-600">Jl. Raya Automotive No. 88, South Jakarta</p>
          <p className="text-[10px] text-slate-600">Telp / WA: 0812-3456-7890</p>
        </div>

        <div className="py-2 border-b border-dashed border-slate-300 space-y-0.5 text-[10px]">
          <div className="flex justify-between">
            <span>No. Nota:</span>
            <span className="font-bold">{invoice.invoice_number}</span>
          </div>
          <div className="flex justify-between">
            <span>Tanggal:</span>
            <span>{invoice.paid_at}</span>
          </div>
          <div className="flex justify-between">
            <span>Pelanggan:</span>
            <span className="font-bold">{invoice.customer_name}</span>
          </div>
          <div className="flex justify-between">
            <span>No. Polisi:</span>
            <span className="font-bold">{invoice.license_plate}</span>
          </div>
          <div className="flex justify-between">
            <span>Kasir:</span>
            <span>{invoice.cashier_name}</span>
          </div>
        </div>

        {/* ITEMS TABLE */}
        <div className="py-2 border-b border-dashed border-slate-300 space-y-1 text-[10px]">
          <div className="flex justify-between font-bold border-b border-slate-200 pb-1">
            <span>Deskripsi Item</span>
            <span>Subtotal</span>
          </div>
          <div className="flex justify-between">
            <span>Subtotal Jasa Servis</span>
            <span>Rp {invoice.subtotal_services.toLocaleString('id-ID')}</span>
          </div>
          <div className="flex justify-between">
            <span>Subtotal Suku Cadang</span>
            <span>Rp {invoice.subtotal_spareparts.toLocaleString('id-ID')}</span>
          </div>
          {invoice.discount_amount > 0 && (
            <div className="flex justify-between text-rose-600 font-bold">
              <span>Diskon Promo</span>
              <span>-Rp {invoice.discount_amount.toLocaleString('id-ID')}</span>
            </div>
          )}
          <div className="flex justify-between text-slate-600">
            <span>PPN (11%)</span>
            <span>Rp {invoice.tax_amount.toLocaleString('id-ID')}</span>
          </div>
        </div>

        {/* TOTALS */}
        <div className="py-2 space-y-1 text-[11px] font-bold">
          <div className="flex justify-between text-sm">
            <span>GRAND TOTAL:</span>
            <span className="text-emerald-700">Rp {invoice.grand_total.toLocaleString('id-ID')}</span>
          </div>
          <div className="flex justify-between text-[10px] text-slate-600 font-normal">
            <span>Metode Bayar:</span>
            <span className="uppercase font-bold">{invoice.payment_method}</span>
          </div>
          <div className="flex justify-between text-[10px] text-slate-600 font-normal">
            <span>Bayar (Cash/Digital):</span>
            <span>Rp {invoice.paid_amount.toLocaleString('id-ID')}</span>
          </div>
          <div className="flex justify-between text-[10px] text-slate-600 font-normal">
            <span>Kembalian:</span>
            <span>Rp {invoice.change_amount.toLocaleString('id-ID')}</span>
          </div>
        </div>

        <div className="text-center pt-3 border-t border-dashed border-slate-300 text-[9px] text-slate-500 space-y-0.5">
          <p className="font-bold text-slate-700">TERIMA KASIH ATAS KUNJUNGAN ANDA</p>
          <p>Garansi Pengerjaan & Part Original 100%</p>
          <p>Simpan Struk Ini Sebagai Bukti Garansi</p>
        </div>
      </div>

      <button
        onClick={handlePrint}
        className="w-full flex items-center justify-center space-x-2 rounded-xl bg-slate-900 py-3 text-xs font-bold text-white shadow-lg hover:bg-slate-800 transition-colors"
      >
        <Printer className="h-4 w-4 text-[#eb6905]" />
        <span>Cetak Nota Struk Thermal 80mm</span>
      </button>
    </div>
  );
};

export default ThermalReceiptPreview;
