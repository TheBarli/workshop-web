import React, { useState } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import CustomerLayout from '@/Layouts/CustomerLayout';
import {
  Calendar,
  Car,
  Clock,
  Wrench,
  Package,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

const TIME_SLOTS = [
  { time: '08:00', label: '08:00 WIB (Pagi)' },
  { time: '09:30', label: '09:30 WIB (Pagi)' },
  { time: '11:00', label: '11:00 WIB (Siang)' },
  { time: '13:00', label: '13:00 WIB (Siang)' },
  { time: '14:30', label: '14:30 WIB (Sore)' },
  { time: '16:00', label: '16:00 WIB (Sore)' },
];

const CreateBooking = ({ vehicles = [], services = [] }) => {
  const { auth } = usePage().props;
  const user = auth?.user;

  const [step, setStep] = useState(1);
  const [bookingType, setBookingType] = useState('service'); // 'service' | 'sparepart'

  const [bookingDate, setBookingDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('09:30');

  const form = useForm({
    vehicle_id:      vehicles[0]?.id ?? '',
    scheduled_at:    `${bookingDate} ${selectedTimeSlot}:00`,
    complaint_notes: '',
    service_ids:     services[0] ? [services[0].id] : [],
  });

  const handleDateOrTimeChange = (newDate, newTime) => {
    setBookingDate(newDate);
    setSelectedTimeSlot(newTime);
    form.setData('scheduled_at', `${newDate} ${newTime}:00`);
  };

  const selectedVehicle  = vehicles.find((v) => v.id === Number(form.data.vehicle_id));
  const selectedServices = services.filter((s) => form.data.service_ids.includes(s.id));
  const totalPrice       = selectedServices.reduce((acc, s) => acc + Number(s.price), 0);
  const totalEstimatedMinutes = selectedServices.reduce((acc, s) => acc + (Number(s.estimated_minutes) || 30), 0);

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
    form.setData('scheduled_at', `${bookingDate} ${selectedTimeSlot}:00`);
    form.post(route('customer.bookings.store'));
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">

      {/* Title & Stepper */}
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#091426]">Formulir Reservasi &amp; Pemesanan Online</h1>
          <p className="text-xs text-slate-600">Lengkapi 3 langkah sederhana untuk reservasi jadwal atau pemesanan sparepart.</p>
        </div>

        {/* Tab Selection: Service vs Sparepart */}
        <div className="grid grid-cols-2 gap-3 p-1.5 rounded-2xl bg-slate-100 border border-slate-200 text-xs font-bold">
          <button
            type="button"
            onClick={() => setBookingType('service')}
            className={`flex items-center justify-center space-x-2 py-2.5 rounded-xl transition-all ${
              bookingType === 'service'
                ? 'bg-slate-900 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Wrench className="h-4 w-4 text-[#eb6905]" />
            <span>Booking Servis Perbaikan</span>
          </button>
          <button
            type="button"
            onClick={() => setBookingType('sparepart')}
            className={`flex items-center justify-center space-x-2 py-2.5 rounded-xl transition-all ${
              bookingType === 'sparepart'
                ? 'bg-slate-900 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Package className="h-4 w-4 text-[#eb6905]" />
            <span>Pemesanan &amp; Pemasangan Sparepart</span>
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2 rounded-2xl bg-white p-2 border border-slate-200 shadow-xs text-xs font-bold text-center">
          {['1. Kendaraan', '2. Jam & Layanan', '3. Konfirmasi'].map((label, i) => (
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
              <span>Langkah 1: Pilih Unit Kendaraan Anda</span>
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

        {/* STEP 2: SCHEDULE (CLEAR HOURS & MINUTES UI) + SERVICES */}
        {step === 2 && (
          <div className="space-y-6">
            <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <Clock className="h-5 w-5 text-[#eb6905]" />
              <span>Langkah 2: Atur Jam Kedatangan &amp; Layanan</span>
            </h3>

            {/* Clear Hours & Minutes Picker UI */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 space-y-4">
              <div className="flex items-center space-x-2 text-xs font-bold text-slate-900 border-b border-slate-200 pb-3">
                <Calendar className="h-4 w-4 text-[#eb6905]" />
                <span>Pengaturan Tanggal &amp; Jam Kedatangan</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Date Selection */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">1. Pilih Tanggal Reservasi *</label>
                  <input
                    type="date"
                    value={bookingDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => handleDateOrTimeChange(e.target.value, selectedTimeSlot)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:border-[#eb6905] focus:outline-none"
                  />
                </div>

                {/* Time Slot Selection */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">2. Pilih Jam Kedatangan (WIB) *</label>
                  <select
                    value={selectedTimeSlot}
                    onChange={(e) => handleDateOrTimeChange(bookingDate, e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-900 focus:border-[#eb6905] focus:outline-none"
                  >
                    {TIME_SLOTS.map((slot) => (
                      <option key={slot.time} value={slot.time}>
                        {slot.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Quick Time Badges */}
              <div className="space-y-1.5 pt-1">
                <p className="text-[11px] font-semibold text-slate-500">Pilih Slot Jam Cepat:</p>
                <div className="flex flex-wrap gap-2">
                  {TIME_SLOTS.map((slot) => (
                    <button
                      key={slot.time}
                      type="button"
                      onClick={() => handleDateOrTimeChange(bookingDate, slot.time)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        selectedTimeSlot === slot.time
                          ? 'bg-[#eb6905] text-white shadow-md scale-105'
                          : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      ⏱️ {slot.time} WIB
                    </button>
                  ))}
                </div>
              </div>

              {/* Estimated Duration Indicator */}
              <div className="flex items-center justify-between rounded-xl bg-white p-3 border border-slate-200 text-xs">
                <span className="text-slate-600 font-medium">Jam Kedatangan Dipilih:</span>
                <span className="font-extrabold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg">
                  {new Date(`${bookingDate}T${selectedTimeSlot}`).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })} — Pukul {selectedTimeSlot} WIB
                </span>
              </div>
            </div>

            {/* Service / Sparepart Selection */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-slate-700">
                Pilih {bookingType === 'service' ? 'Paket Layanan Servis' : 'Suku Cadang (Sparepart)'} (Bisa Lebih Dari Satu) *
              </label>
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
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold">{service.name}</p>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${isChecked ? 'bg-slate-800 text-amber-400' : 'bg-slate-200 text-slate-700'}`}>
                            ⏱️ {service.estimated_minutes || 30} Menit
                          </span>
                        </div>
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
              <label className="block text-xs font-semibold text-slate-700 mb-1">Catatan Keluhan / Instruksi Pemasangan (Opsional)</label>
              <textarea
                rows="3"
                value={form.data.complaint_notes}
                onChange={(e) => form.setData('complaint_notes', e.target.value)}
                placeholder="Contoh: Tolong sekalian periksa oli transmisi dan bunyi rem berdecit..."
                className="w-full rounded-xl border border-slate-300 bg-slate-50 p-3 text-xs font-medium text-slate-900 focus:border-[#eb6905] focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* STEP 3: SUMMARY */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-4 space-y-1">
              <h3 className="text-base font-bold text-slate-900">Langkah 3: Ringkasan &amp; Konfirmasi Reservasi</h3>
              <p className="text-xs text-slate-500">Periksa kembali detail jadwal jam kedatangan dan item servis sebelum mengonfirmasi.</p>
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
                  <p className="text-slate-500">Jadwal Jam Kedatangan:</p>
                  <p className="font-bold text-slate-900 text-sm mt-0.5">
                    {new Date(`${bookingDate}T${selectedTimeSlot}`).toLocaleString('id-ID', { dateStyle: 'medium' })} Pukul {selectedTimeSlot} WIB
                  </p>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-3">
                <p className="text-slate-500 mb-2">Item Dipilih &amp; Estimasi Durasi:</p>
                <ul className="space-y-1.5 font-medium text-slate-800">
                  {selectedServices.map((s) => (
                    <li key={s.id} className="flex justify-between items-center">
                      <span>• {s.name} ({s.estimated_minutes || 30} Menit)</span>
                      <span className="font-bold">Rp {Number(s.price).toLocaleString('id-ID')}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-slate-200 pt-3 flex items-center justify-between">
                <span className="text-slate-500">Total Estimasi Durasi Pengerjaan:</span>
                <span className="font-bold text-slate-900 bg-slate-200 px-2 py-0.5 rounded">
                  ⏱️ {totalEstimatedMinutes} Menit
                </span>
              </div>

              {form.data.complaint_notes && (
                <div className="border-t border-slate-200 pt-3">
                  <p className="text-slate-500">Catatan Keluhan:</p>
                  <p className="font-medium text-slate-800 italic mt-0.5">"{form.data.complaint_notes}"</p>
                </div>
              )}

              <div className="border-t border-slate-200 pt-3 flex items-center justify-between text-sm">
                <span className="font-bold text-slate-900">Total Biaya Estimasi:</span>
                <span className="font-extrabold text-[#eb6905] text-base">
                  Rp {totalPrice.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            <div className="rounded-xl border border-blue-200 bg-blue-50 p-3 text-xs text-blue-900 flex items-center space-x-2">
              <Sparkles className="h-4 w-4 text-blue-600 shrink-0" />
              <span>Konfirmasi pengingat jadwal jam kedatangan akan dikirimkan ke nomor WhatsApp Anda ({user?.phone_number ?? '—'}).</span>
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
                <span className="animate-pulse">Menyimpan Reservasi...</span>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Konfirmasi Reservasi</span>
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
