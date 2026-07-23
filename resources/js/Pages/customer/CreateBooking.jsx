import React, { useState } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import CustomerLayout from '@/Layouts/CustomerLayout';
import {
  Calendar,
  Car,
  Clock,
  Wrench,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

const CreateBooking = ({ vehicles = [], services = [] }) => {
  const { auth } = usePage().props;
  const user = auth?.user;

  const [step, setStep] = useState(1);

  const form = useForm({
    vehicle_id:      vehicles[0]?.id ?? '',
    scheduled_at:    '',
    complaint_notes: '',
    service_ids:     services[0] ? [services[0].id] : [],
  });

  const selectedVehicle  = vehicles.find((v) => v.id === Number(form.data.vehicle_id));
  const selectedServices = services.filter((s) => form.data.service_ids.includes(s.id));
  const totalPrice       = selectedServices.reduce((acc, s) => acc + Number(s.price), 0);

  const toggleService = (id) => {
    const current = [...form.data.service_ids];
    if (current.includes(id)) {
      if (current.length === 1) return; // at least 1 required
      form.setData('service_ids', current.filter((x) => x !== id));
    } else {
      form.setData('service_ids', [...current, id]);
    }
  };

  const handleSubmit = () => {
    form.post(route('customer.bookings.store'));
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">

      {/* Title & Stepper */}
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#091426]">Formulir Reservasi Servis Online</h1>
          <p className="text-xs text-slate-600">Lengkapi 3 langkah sederhana untuk mengamankan slot reservasi Anda.</p>
        </div>
        <div className="grid grid-cols-3 gap-2 rounded-2xl bg-white p-2 border border-slate-200 shadow-xs text-xs font-bold text-center">
          {['1. Kendaraan', '2. Jadwal & Keluhan', '3. Ringkasan'].map((label, i) => (
            <div
              key={i}
              className={`py-2 rounded-xl transition-colors ${
                step >= i + 1
                  ? i === 2 && step === 3 ? 'bg-[#eb6905] text-white' : 'bg-slate-900 text-white'
                  : 'text-slate-400'
              }`}
            >
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* Global error */}
      {Object.keys(form.errors).length > 0 && (
        <div className="flex items-center space-x-2 rounded-xl bg-rose-50 p-4 text-xs font-semibold text-rose-700 border border-rose-200">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>Terdapat kesalahan. Periksa kembali isian form Anda.</span>
        </div>
      )}

      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">

        {/* STEP 1: VEHICLE */}
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <Car className="h-5 w-5 text-[#eb6905]" />
              <span>Langkah 1: Pilih Unit Kendaraan</span>
            </h3>

            {vehicles.length === 0 ? (
              <div className="text-center py-8 space-y-3">
                <p className="text-xs text-slate-500">Anda belum mendaftarkan kendaraan.</p>
                <a href="/customer/vehicles" className="rounded-xl bg-[#eb6905] px-4 py-2 text-xs font-bold text-white inline-block">
                  + Tambah Kendaraan Dulu
                </a>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {vehicles.map((v) => (
                  <div
                    key={v.id}
                    onClick={() => form.setData('vehicle_id', v.id)}
                    className={`cursor-pointer rounded-2xl border p-4 transition-all ${
                      Number(form.data.vehicle_id) === v.id
                        ? 'border-[#eb6905] bg-[#eb6905]/10 ring-2 ring-[#eb6905] shadow-md'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold bg-slate-900 text-white px-2.5 py-1 rounded-lg">
                        {v.license_plate}
                      </span>
                      {v.year && (
                        <span className="text-[10px] font-bold text-slate-600 bg-white px-2 py-0.5 rounded border">
                          {v.year}
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-bold text-slate-900 mt-2">{v.brand} {v.model}</p>
                    {v.color && <p className="text-xs text-slate-500 mt-0.5">Warna: {v.color}</p>}
                  </div>
                ))}
              </div>
            )}
            {form.errors.vehicle_id && (
              <p className="text-xs text-rose-600">{form.errors.vehicle_id}</p>
            )}
          </div>
        )}

        {/* STEP 2: SERVICES + SCHEDULE */}
        {step === 2 && (
          <div className="space-y-6">
            <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <Wrench className="h-5 w-5 text-[#eb6905]" />
              <span>Langkah 2: Jadwal, Layanan &amp; Keluhan</span>
            </h3>

            {/* Scheduled datetime */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tanggal &amp; Jam Reservasi *</label>
              <input
                type="datetime-local"
                value={form.data.scheduled_at}
                min={new Date(Date.now() + 3600 * 1000).toISOString().slice(0, 16)}
                onChange={(e) => form.setData('scheduled_at', e.target.value)}
                className="w-full sm:w-72 rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2 text-xs font-bold text-slate-900 focus:border-[#eb6905] focus:outline-none"
              />
              {form.errors.scheduled_at && (
                <p className="text-xs text-rose-600 mt-1">{form.errors.scheduled_at}</p>
              )}
            </div>

            {/* Service selection */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-slate-700">Pilih Jenis Layanan (bisa lebih dari satu) *</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {services.map((service) => {
                  const isChecked = form.data.service_ids.includes(service.id);
                  return (
                    <div
                      key={service.id}
                      onClick={() => toggleService(service.id)}
                      className={`cursor-pointer rounded-2xl border p-4 transition-all flex items-start space-x-3 ${
                        isChecked
                          ? 'border-slate-900 bg-slate-900 text-white shadow-md'
                          : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-900'
                      }`}
                    >
                      <input type="checkbox" checked={isChecked} readOnly className="mt-1 rounded accent-[#eb6905]" />
                      <div className="space-y-1">
                        <p className="text-xs font-bold">{service.name}</p>
                        {service.description && (
                          <p className={`text-[11px] leading-relaxed ${isChecked ? 'text-slate-300' : 'text-slate-500'}`}>
                            {service.description}
                          </p>
                        )}
                        <p className={`text-xs font-extrabold pt-1 ${isChecked ? 'text-[#eb6905]' : 'text-slate-900'}`}>
                          Rp {Number(service.price).toLocaleString('id-ID')}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
              {form.errors.service_ids && (
                <p className="text-xs text-rose-600">{form.errors.service_ids}</p>
              )}
            </div>

            {/* Complaint notes */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Catatan Keluhan (Opsional)</label>
              <textarea
                rows="3"
                value={form.data.complaint_notes}
                onChange={(e) => form.setData('complaint_notes', e.target.value)}
                placeholder="Contoh: Suara mesin kasar saat rpm tinggi, rem berdecit..."
                className="w-full rounded-xl border border-slate-300 bg-slate-50 p-3 text-xs font-medium text-slate-900 focus:border-[#eb6905] focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* STEP 3: SUMMARY */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-4 space-y-1">
              <h3 className="text-base font-bold text-slate-900">Langkah 3: Ringkasan Reservasi</h3>
              <p className="text-xs text-slate-500">Periksa kembali rincian booking sebelum mengonfirmasi.</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-slate-500">Unit Kendaraan:</p>
                  <p className="font-bold text-slate-900 text-sm mt-0.5">
                    {selectedVehicle?.license_plate} ({selectedVehicle?.brand} {selectedVehicle?.model})
                  </p>
                </div>
                <div>
                  <p className="text-slate-500">Jadwal Reservasi:</p>
                  <p className="font-bold text-slate-900 text-sm mt-0.5">
                    {form.data.scheduled_at
                      ? new Date(form.data.scheduled_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })
                      : '—'}
                  </p>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-3">
                <p className="text-slate-500 mb-2">Layanan Dipilih:</p>
                <ul className="space-y-1.5 font-medium text-slate-800">
                  {selectedServices.map((s) => (
                    <li key={s.id} className="flex justify-between">
                      <span>• {s.name}</span>
                      <span className="font-bold">Rp {Number(s.price).toLocaleString('id-ID')}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {form.data.complaint_notes && (
                <div className="border-t border-slate-200 pt-3">
                  <p className="text-slate-500">Catatan Keluhan:</p>
                  <p className="font-medium text-slate-800 italic mt-0.5">"{form.data.complaint_notes}"</p>
                </div>
              )}

              <div className="border-t border-slate-200 pt-3 flex items-center justify-between text-sm">
                <span className="font-bold text-slate-900">Total Estimasi Awal:</span>
                <span className="font-extrabold text-[#eb6905] text-base">
                  Rp {totalPrice.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            <div className="rounded-xl border border-blue-200 bg-blue-50 p-3 text-xs text-blue-900 flex items-center space-x-2">
              <Sparkles className="h-4 w-4 text-blue-600 shrink-0" />
              <span>Notifikasi status booking akan dikirimkan otomatis ke WhatsApp Anda ({user?.phone_number ?? '—'}).</span>
            </div>
          </div>
        )}

        {/* NAVIGATION BUTTONS */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="flex items-center space-x-1 rounded-xl border border-slate-300 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Kembali</span>
            </button>
          ) : <div />}

          {step < 3 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              disabled={step === 1 && !form.data.vehicle_id}
              className="flex items-center space-x-1 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-[#eb6905] transition-colors disabled:opacity-40"
            >
              <span>Selanjutnya</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              disabled={form.processing}
              onClick={handleSubmit}
              className="flex items-center space-x-2 rounded-xl bg-[#eb6905] px-6 py-3 text-xs font-bold text-white shadow-lg hover:bg-[#d95d00] transition-colors disabled:opacity-50"
            >
              {form.processing ? (
                <span className="animate-pulse">Menyimpan Booking...</span>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Konfirmasi Booking Servis</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

CreateBooking.layout = (page) => <CustomerLayout children={page} />;

export default CreateBooking;
