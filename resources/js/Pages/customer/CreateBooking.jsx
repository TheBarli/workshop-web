import React, { useState, useEffect } from 'react';
import { router, usePage } from '@inertiajs/react';
import { mockApi } from '../../services/mockApi';
import CustomerLayout from '@/Layouts/CustomerLayout';
import TimeSlotMatrix from '../../components/booking/TimeSlotMatrix';
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

const CreateBooking = () => {
  const { auth } = usePage().props;
  const user = auth?.user;

  const [step, setStep] = useState(1);
  const [vehicles, setVehicles] = useState([]);
  const [services, setServices] = useState([]);
  const [slotData, setSlotData] = useState({ date: '', slots: [] });

  const [loadingVehicles, setLoadingVehicles] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    vehicle_id: '',
    booking_date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Default H+1
    booking_time: '09:00:00',
    service_ids: [1],
    complaint_notes: '',
  });

  useEffect(() => {
    const init = async () => {
      setLoadingVehicles(true);
      const vList = await mockApi.getVehicles(user?.id || 1);
      const sList = await mockApi.getServices();
      setVehicles(vList);
      setServices(sList);
      if (vList.length > 0) {
        setFormData((prev) => ({ ...prev, vehicle_id: vList[0].id }));
      }
      setLoadingVehicles(false);
    };
    init();
  }, [user]);

  // Load slot matrix whenever date changes
  useEffect(() => {
    if (formData.booking_date) {
      const fetchSlots = async () => {
        setLoadingSlots(true);
        const data = await mockApi.checkSlotAvailability(formData.booking_date);
        setSlotData(data);
        setLoadingSlots(false);
      };
      fetchSlots();
    }
  }, [formData.booking_date]);

  const selectedVehicle = vehicles.find((v) => v.id === Number(formData.vehicle_id));
  const selectedServices = services.filter((s) => formData.service_ids.includes(s.id));
  const totalEstimatedPrice = selectedServices.reduce((acc, s) => acc + s.price, 0);

  const toggleService = (id) => {
    let current = [...formData.service_ids];
    if (current.includes(id)) {
      if (current.length === 1) return; // Must select at least 1 service
      current = current.filter((item) => item !== id);
    } else {
      current.push(id);
    }
    setFormData({ ...formData, service_ids: current });
  };

  const handleSubmitBooking = async () => {
    setSubmitting(true);
    setError('');

    try {
      const booking = await mockApi.createBooking({
        ...formData,
        user_id: user?.id || 1,
        user_name: user?.name || 'Budi Santoso',
        user_phone: user?.phone_number || '081234567890',
      });

      router.visit(`/customer/bookings/${booking.id}?new=true`);
    } catch (err) {
      setError(err.message || 'Gagal menyimpan booking.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      
      {/* Title & Stepper Progress Bar */}
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#091426]">Formulir Reservasi Servis Online</h1>
          <p className="text-xs text-slate-600">
            Lengkapi 4 langkah sederhana di bawah untuk mengamankan slot reservasi perbaikan Anda [UC-001].
          </p>
        </div>

        {/* Stepper Tabs */}
        <div className="grid grid-cols-4 gap-2 rounded-2xl bg-white p-2 border border-slate-200 shadow-xs text-xs font-bold text-center">
          <div className={`py-2 rounded-xl transition-colors ${step >= 1 ? 'bg-slate-900 text-white' : 'text-slate-400'}`}>
            1. Kendaraan
          </div>
          <div className={`py-2 rounded-xl transition-colors ${step >= 2 ? 'bg-slate-900 text-white' : 'text-slate-400'}`}>
            2. Tanggal & Slot
          </div>
          <div className={`py-2 rounded-xl transition-colors ${step >= 3 ? 'bg-slate-900 text-white' : 'text-slate-400'}`}>
            3. Layanan Servis
          </div>
          <div className={`py-2 rounded-xl transition-colors ${step >= 4 ? 'bg-[#eb6905] text-white' : 'text-slate-400'}`}>
            4. Ringkasan
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-center space-x-2 rounded-xl bg-rose-50 p-4 text-xs font-semibold text-rose-700 border border-rose-200">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* STEP CONTENT */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
        
        {/* STEP 1: VEHICLE SELECTOR */}
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <Car className="h-5 w-5 text-[#eb6905]" />
              <span>Langkah 1: Pilih Unit Kendaraan yang Akan Diservis</span>
            </h3>

            {loadingVehicles ? (
              <div className="h-24 animate-pulse rounded-2xl bg-slate-100" />
            ) : vehicles.length === 0 ? (
              <div className="text-center py-8 space-y-3">
                <p className="text-xs text-slate-500">Anda belum mendaftarkan unit kendaraan.</p>
                <button
                  onClick={() => navigate('/customer/vehicles')}
                  className="rounded-xl bg-[#eb6905] px-4 py-2 text-xs font-bold text-white"
                >
                  + Tambah Kendaraan Dulu
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {vehicles.map((v) => (
                  <div
                    key={v.id}
                    onClick={() => setFormData({ ...formData, vehicle_id: v.id })}
                    className={`cursor-pointer rounded-2xl border p-4 transition-all ${
                      Number(formData.vehicle_id) === v.id
                        ? 'border-[#eb6905] bg-[#eb6905]/10 ring-2 ring-[#eb6905] shadow-md'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold bg-slate-900 text-white px-2.5 py-1 rounded-lg">
                        {v.license_plate}
                      </span>
                      <span className="text-[10px] font-bold text-slate-600 uppercase bg-white px-2 py-0.5 rounded border">
                        {v.type}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-slate-900 mt-2">{v.brand} {v.model}</p>
                    <p className="text-xs text-slate-500 mt-0.5">Tahun {v.manufacture_year} • {v.engine_capacity} CC</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* STEP 2: DATE & TIME SLOT MATRIX */}
        {step === 2 && (
          <div className="space-y-6">
            <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-[#eb6905]" />
              <span>Langkah 2: Tentukan Tanggal & Jam Reservasi Slot</span>
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tanggal Reservasi Servis</label>
              <input
                type="date"
                min={new Date(Date.now() + 86400000).toISOString().split('T')[0]} // Min H+1
                value={formData.booking_date}
                onChange={(e) => setFormData({ ...formData, booking_date: e.target.value })}
                className="w-full sm:w-64 rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2 text-xs font-bold text-slate-900 focus:border-[#eb6905] focus:outline-none"
              />
            </div>

            <TimeSlotMatrix
              slots={slotData.slots}
              selectedTime={formData.booking_time}
              onSelectTime={(time) => setFormData({ ...formData, booking_time: time })}
              loading={loadingSlots}
            />
          </div>
        )}

        {/* STEP 3: SERVICE SELECTION & COMPLAINT NOTES */}
        {step === 3 && (
          <div className="space-y-6">
            <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <Wrench className="h-5 w-5 text-[#eb6905]" />
              <span>Langkah 3: Pilih Paket Layanan & Tuliskan Keluhan</span>
            </h3>

            <div className="space-y-3">
              <label className="block text-xs font-semibold text-slate-700">Pilih Jenis Layanan (Bisa Pilih Lebih Dari Satu):</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {services.map((service) => {
                  const isChecked = formData.service_ids.includes(service.id);
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
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="mt-1 rounded accent-[#eb6905]"
                      />
                      <div className="space-y-1">
                        <p className="text-xs font-bold">{service.name}</p>
                        <p className={`text-[11px] leading-relaxed ${isChecked ? 'text-slate-300' : 'text-slate-500'}`}>
                          {service.description}
                        </p>
                        <p className={`text-xs font-extrabold pt-1 ${isChecked ? 'text-[#eb6905]' : 'text-slate-900'}`}>
                          Rp {service.price.toLocaleString('id-ID')}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Catatan Keluhan / Gejala Kendaraan (Opsional)</label>
              <textarea
                rows="3"
                value={formData.complaint_notes}
                onChange={(e) => setFormData({ ...formData, complaint_notes: e.target.value })}
                placeholder="Contoh: Suara mesin kasar saat rpm tinggi, rem berdecit saat hujan..."
                className="w-full rounded-xl border border-slate-300 bg-slate-50 p-3 text-xs font-medium text-slate-900 focus:border-[#eb6905] focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* STEP 4: SUMMARY & CONFIRMATION */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-4 space-y-1">
              <h3 className="text-base font-bold text-slate-900">Langkah 4: Ringkasan Reservasi Servis Anda</h3>
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
                    {formData.booking_date} Pukul {formData.booking_time.substring(0, 5)} WIB
                  </p>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-3">
                <p className="text-slate-500 mb-2">Layanan yang Dipilih:</p>
                <ul className="space-y-1.5 font-medium text-slate-800">
                  {selectedServices.map((s) => (
                    <li key={s.id} className="flex justify-between">
                      <span>• {s.name}</span>
                      <span className="font-bold">Rp {s.price.toLocaleString('id-ID')}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {formData.complaint_notes && (
                <div className="border-t border-slate-200 pt-3">
                  <p className="text-slate-500">Catatan Keluhan:</p>
                  <p className="font-medium text-slate-800 italic mt-0.5">"{formData.complaint_notes}"</p>
                </div>
              )}

              <div className="border-t border-slate-200 pt-3 flex items-center justify-between text-sm">
                <span className="font-bold text-slate-900">Total Estimasi Awal:</span>
                <span className="font-extrabold text-[#eb6905] text-base">
                  Rp {totalEstimatedPrice.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            <div className="rounded-xl border border-blue-200 bg-blue-50 p-3 text-xs text-blue-900 flex items-center space-x-2">
              <Sparkles className="h-4 w-4 text-blue-600 shrink-0" />
              <span>Notifikasi status booking akan dikirimkan otomatis ke WhatsApp Anda ({user?.phone_number || '081234567890'}).</span>
            </div>
          </div>
        )}

        {/* STEP BUTTON CONTROLS */}
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
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="flex items-center space-x-1 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-[#eb6905] transition-colors"
            >
              <span>Selanjutnya</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              disabled={submitting}
              onClick={handleSubmitBooking}
              className="flex items-center space-x-2 rounded-xl bg-[#eb6905] px-6 py-3 text-xs font-bold text-white shadow-lg hover:bg-[#d95d00] transition-colors disabled:opacity-50"
            >
              {submitting ? (
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
