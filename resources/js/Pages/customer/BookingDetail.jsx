import React, { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { mockApi } from '../../services/mockApi';
import confetti from 'canvas-confetti';
import CustomerLayout from '@/Layouts/CustomerLayout';
import {
  Calendar,
  Clock,
  Car,
  Wrench,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Check,
  X,
  Sparkles,
  PhoneCall,
} from 'lucide-react';

const BookingDetail = () => {
  const page = usePage();
  const url = new URL(page.url, window.location.origin);
  const id = Number(url.pathname.split('/').filter(Boolean).pop());
  const searchParams = new URLSearchParams(url.search);
  const isNewBooking = searchParams.get('new') === 'true';

  const [booking, setBooking] = useState(null);
  const [workOrder, setWorkOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadDetail = async () => {
    setLoading(true);
    try {
      const bList = await mockApi.getBookings();
      const b = bList.find((item) => item.id === Number(id)) || bList[0];
      setBooking(b);

      const woList = await mockApi.getWorkOrders();
      const wo = woList.find((w) => w.booking_id === b.id) || woList[0];
      setWorkOrder(wo);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDetail();
    if (isNewBooking) {
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
    }
  }, [id]);

  const handleApproval = async (partId, status) => {
    if (!workOrder) return;
    await mockApi.updateEstimateApproval(workOrder.id, partId, status);
    loadDetail();
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#eb6905] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      
      {/* NEW BOOKING SUCCESS ALERT BANNER */}
      {isNewBooking && (
        <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-4 text-emerald-950 flex items-center justify-between space-x-3">
          <div className="flex items-center space-x-3">
            <CheckCircle2 className="h-6 w-6 text-emerald-600 shrink-0" />
            <div>
              <p className="font-extrabold text-sm">Booking Servis Berhasil Dibuat! 🎉</p>
              <p className="text-xs text-slate-700">
                Pesan WhatsApp konfirmasi berisi kode reservasi telah dikirimkan ke nomor HP Anda.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* HEADER CARD */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-base font-extrabold bg-slate-900 text-white px-3 py-1 rounded-xl">
                {booking?.booking_code}
              </span>
              <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 uppercase border border-indigo-200">
                Status: {booking?.status}
              </span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 mt-2">
              Detail Tracking Servis Kendaraan
            </h1>
          </div>

          <Link
            href="/customer/bookings"
            className="text-xs font-bold text-[#eb6905] hover:underline"
          >
            ← Kembali ke Daftar Booking
          </Link>
        </div>

        {/* PROGRESS STEPPER BAR */}
        <div className="space-y-2">
          <p className="text-xs font-bold text-slate-700">Progres Pengerjaan Real-Time:</p>
          <div className="grid grid-cols-4 gap-2 text-center text-xs font-bold">
            <div className="bg-emerald-100 text-emerald-800 p-2 rounded-xl border border-emerald-200">
              1. Booked (v)
            </div>
            <div className={`p-2 rounded-xl border ${['in_progress', 'completed'].includes(booking?.status) ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-slate-100 text-slate-400'}`}>
              2. Inspeksi
            </div>
            <div className={`p-2 rounded-xl border ${['in_progress', 'completed'].includes(booking?.status) ? 'bg-indigo-100 text-indigo-800 border-indigo-200' : 'bg-slate-100 text-slate-400'}`}>
              3. Perbaikan
            </div>
            <div className={`p-2 rounded-xl border ${booking?.status === 'completed' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-slate-100 text-slate-400'}`}>
              4. Selesai (Paid)
            </div>
          </div>
        </div>
      </div>

      {/* MECHANIC ESTIMATE APPROVAL WIDGET [BR-006] */}
      {workOrder && workOrder.proposed_spareparts && workOrder.proposed_spareparts.length > 0 && (
        <div className="rounded-3xl border border-amber-300 bg-gradient-to-r from-amber-50 to-orange-50 p-6 shadow-md space-y-4">
          <div className="flex items-center space-x-2 text-amber-900">
            <AlertTriangle className="h-5 w-5 text-[#eb6905]" />
            <h3 className="text-sm font-extrabold">Persetujuan Estimasi Suku Cadang Tambahan Mekanik [BR-006]</h3>
          </div>

          <p className="text-xs text-slate-700 leading-relaxed">
            Mekanik (<strong>{workOrder.mechanic_name}</strong>) mencatat rekomendasi perbaikan berikut:
            <br />
            <span className="italic font-medium text-slate-900">"{workOrder.mechanic_notes}"</span>
          </p>

          <div className="space-y-3 pt-2">
            {workOrder.proposed_spareparts.map((part) => (
              <div
                key={part.sparepart_id}
                className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-4 rounded-2xl border border-amber-200 gap-3"
              >
                <div>
                  <p className="text-xs font-bold text-slate-900">{part.name}</p>
                  <p className="text-xs text-[#eb6905] font-extrabold mt-0.5">
                    {part.qty} Unit × Rp {part.unit_price.toLocaleString('id-ID')} = Rp {(part.qty * part.unit_price).toLocaleString('id-ID')}
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  {part.approval_status === 'approved' ? (
                    <span className="inline-flex items-center space-x-1 rounded-xl bg-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-800 border border-emerald-200">
                      <Check className="h-4 w-4" />
                      <span>Disetujui</span>
                    </span>
                  ) : part.approval_status === 'rejected' ? (
                    <span className="inline-flex items-center space-x-1 rounded-xl bg-rose-100 px-3 py-1.5 text-xs font-bold text-rose-800 border border-rose-200">
                      <X className="h-4 w-4" />
                      <span>Ditolak</span>
                    </span>
                  ) : (
                    <>
                      <button
                        onClick={() => handleApproval(part.sparepart_id, 'approved')}
                        className="flex items-center space-x-1 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700"
                      >
                        <Check className="h-4 w-4" />
                        <span>Setujui</span>
                      </button>
                      <button
                        onClick={() => handleApproval(part.sparepart_id, 'rejected')}
                        className="flex items-center space-x-1 rounded-xl bg-rose-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-rose-700"
                      >
                        <X className="h-4 w-4" />
                        <span>Tolak</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUMMARY INFO CARD */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4 text-xs">
        <h3 className="font-bold text-slate-900 text-sm">Rincian Unit & Layanan</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-slate-500">Nomor Polisi & Model:</p>
            <p className="font-bold text-slate-900 mt-0.5">{booking?.license_plate} ({booking?.vehicle_model})</p>
          </div>
          <div>
            <p className="text-slate-500">Tanggal & Jam Reservasi:</p>
            <p className="font-bold text-slate-900 mt-0.5">{booking?.booking_date} Jam {booking?.booking_time}</p>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-3">
          <p className="text-slate-500 mb-2">Layanan yang Dikerjakan:</p>
          <ul className="space-y-1 font-medium text-slate-800">
            {booking?.services.map((s) => (
              <li key={s.id} className="flex justify-between">
                <span>• {s.name}</span>
                <span className="font-bold">Rp {s.price.toLocaleString('id-ID')}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

    </div>
  );
};

BookingDetail.layout = (page) => <CustomerLayout children={page} />;

export default BookingDetail;
