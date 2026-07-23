import React, { useEffect } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import confetti from 'canvas-confetti';
import CustomerLayout from '@/Layouts/CustomerLayout';
import {
  Calendar,
  Car,
  Wrench,
  CheckCircle2,
  FileText,
  X,
} from 'lucide-react';

const STATUS_STEPS = [
  { key: 'booked',      label: '1. Dipesan',   statuses: ['pending', 'confirmed', 'in_progress', 'completed'] },
  { key: 'inspeksi',   label: '2. Inspeksi',   statuses: ['in_progress', 'completed'] },
  { key: 'perbaikan',  label: '3. Perbaikan',  statuses: ['in_progress', 'completed'] },
  { key: 'selesai',    label: '4. Selesai',    statuses: ['completed'] },
];

const STATUS_BADGE = {
  pending:     { label: 'Menunggu Konfirmasi', cls: 'bg-amber-100 text-amber-800 border-amber-200' },
  confirmed:   { label: 'Dikonfirmasi',        cls: 'bg-blue-100 text-blue-800 border-blue-200' },
  in_progress: { label: 'Sedang Dikerjakan',   cls: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
  completed:   { label: 'Selesai',             cls: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  cancelled:   { label: 'Dibatalkan',          cls: 'bg-rose-100 text-rose-800 border-rose-200' },
};

const BookingDetail = ({ booking }) => {
  const { url } = usePage();
  const isNewBooking = new URLSearchParams(url.split('?')[1] ?? '').get('new') === 'true';

  useEffect(() => {
    if (isNewBooking) {
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
    }
  }, []);

  if (!booking) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-slate-500 text-sm">Booking tidak ditemukan.</p>
      </div>
    );
  }

  const canCancel = ['pending', 'confirmed'].includes(booking.status);

  const handleCancel = () => {
    if (!confirm('Batalkan booking ini? Tindakan tidak dapat diurungkan.')) return;
    router.patch(route('customer.bookings.cancel', booking.id));
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">

      {/* SUCCESS BANNER */}
      {isNewBooking && (
        <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-4 text-emerald-950 flex items-center space-x-3">
          <CheckCircle2 className="h-6 w-6 text-emerald-600 shrink-0" />
          <div>
            <p className="font-extrabold text-sm">Booking Servis Berhasil Dibuat! 🎉</p>
            <p className="text-xs text-slate-700">Konfirmasi booking telah tersimpan di sistem kami.</p>
          </div>
        </div>
      )}

      {/* HEADER CARD */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-base font-extrabold bg-slate-900 text-white px-3 py-1 rounded-xl">
                {booking.booking_code}
              </span>
              <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase border ${STATUS_BADGE[booking.status]?.cls ?? 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                {STATUS_BADGE[booking.status]?.label ?? booking.status}
              </span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 mt-2">Detail Tracking Servis Kendaraan</h1>
          </div>
          <div className="flex items-center space-x-3">
            {canCancel && (
              <button
                onClick={handleCancel}
                className="flex items-center space-x-1 rounded-xl border border-rose-300 bg-rose-50 px-3 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100 transition-colors"
              >
                <X className="h-3.5 w-3.5" />
                <span>Batalkan Booking</span>
              </button>
            )}
            <Link href="/customer/history" className="text-xs font-bold text-[#eb6905] hover:underline">
              ← Riwayat Servis
            </Link>
          </div>
        </div>

        {/* PROGRESS STEPPER */}
        <div className="space-y-2">
          <p className="text-xs font-bold text-slate-700">Progres Pengerjaan:</p>
          <div className="grid grid-cols-4 gap-2 text-center text-xs font-bold">
            {STATUS_STEPS.map((step) => {
              const active = step.statuses.includes(booking.status);
              return (
                <div
                  key={step.key}
                  className={`p-2 rounded-xl border ${
                    active ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-slate-100 text-slate-400 border-transparent'
                  }`}
                >
                  {step.label}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* BOOKING INFO */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4 text-xs">
        <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
          <FileText className="h-4 w-4 text-[#eb6905]" />
          <span>Rincian Unit &amp; Layanan</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-slate-500">Nomor Polisi &amp; Model:</p>
            <p className="font-bold text-slate-900 mt-0.5">
              {booking.vehicle?.license_plate} ({booking.vehicle?.brand} {booking.vehicle?.model})
            </p>
          </div>
          <div>
            <p className="text-slate-500">Jadwal Servis:</p>
            <p className="font-bold text-slate-900 mt-0.5">
              {new Date(booking.scheduled_at).toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' })}
            </p>
          </div>
          {booking.mechanic && (
            <div>
              <p className="text-slate-500">Mekanik Ditugaskan:</p>
              <p className="font-bold text-slate-900 mt-0.5">{booking.mechanic.name}</p>
            </div>
          )}
          {booking.complaint_notes && (
            <div>
              <p className="text-slate-500">Catatan Keluhan:</p>
              <p className="font-medium text-slate-800 italic mt-0.5">"{booking.complaint_notes}"</p>
            </div>
          )}
        </div>

        {/* Service Items */}
        {booking.items && booking.items.length > 0 && (
          <div className="border-t border-slate-100 pt-3">
            <p className="text-slate-500 mb-2">Layanan yang Dikerjakan:</p>
            <ul className="space-y-1 font-medium text-slate-800">
              {booking.items.map((item) => (
                <li key={item.id} className="flex justify-between">
                  <span>• {item.service?.name ?? '—'} {item.quantity > 1 ? `×${item.quantity}` : ''}</span>
                  <span className="font-bold">Rp {Number(item.subtotal).toLocaleString('id-ID')}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Transaction */}
        {booking.transaction && (
          <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
            <div>
              <p className="text-slate-500">Status Pembayaran:</p>
              <span className={`inline-block mt-0.5 rounded-full px-2.5 py-0.5 font-bold text-[10px] uppercase ${
                booking.transaction.payment_status === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {booking.transaction.payment_status}
              </span>
            </div>
            <div className="text-right">
              <p className="text-slate-500">Total Tagihan:</p>
              <p className="font-extrabold text-[#eb6905] text-base mt-0.5">
                Rp {Number(booking.transaction.total_amount).toLocaleString('id-ID')}
              </p>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

BookingDetail.layout = (page) => <CustomerLayout children={page} />;

export default BookingDetail;
