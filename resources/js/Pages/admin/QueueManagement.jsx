import React, { useState, useEffect } from 'react';
import { mockApi } from '../../services/mockApi';
import AdminLayout from '@/Layouts/AdminLayout';
import { Calendar, Clock, CheckCircle2, UserCheck, Wrench, Car, ArrowRight, Filter, ChevronRight } from 'lucide-react';

const QueueManagement = () => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [slotData, setSlotData] = useState({ date: '', slots: [] });
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');

  const loadData = async () => {
    setLoading(true);
    try {
      const sData = await mockApi.checkSlotAvailability(date);
      const bData = await mockApi.getBookings();
      setSlotData(sData);
      setBookings(bData.filter((b) => b.booking_date === date || true));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [date]);

  const handleUpdateStatus = async (bookingId, nextStatus) => {
    if (nextStatus === 'sedang_dikerjakan') {
      await mockApi.createWorkOrderFromBooking(bookingId);
    }
    await mockApi.updateBookingStatus(bookingId, nextStatus);
    loadData();
  };

  // Normalize status into 4 core phases
  const getPhaseKey = (status) => {
    if (status === 'sedang_dikerjakan' || status === 'in_progress') return 'sedang_dikerjakan';
    if (status === 'selesai' || status === 'completed') return 'selesai';
    if (status === 'diambil' || status === 'picked_up') return 'diambil';
    return 'mengantri'; // default pending/confirmed
  };

  const getPhaseBadge = (status) => {
    const phase = getPhaseKey(status);
    switch (phase) {
      case 'mengantri':
        return {
          label: '1. Mengantri',
          badgeClass: 'bg-amber-100 text-amber-900 border border-amber-300',
          icon: Clock,
        };
      case 'sedang_dikerjakan':
        return {
          label: '2. Sedang Dikerjakan',
          badgeClass: 'bg-blue-100 text-blue-900 border border-blue-300',
          icon: Wrench,
        };
      case 'selesai':
        return {
          label: '3. Selesai',
          badgeClass: 'bg-emerald-100 text-emerald-900 border border-emerald-300',
          icon: CheckCircle2,
        };
      case 'diambil':
        return {
          label: '4. Diambil',
          badgeClass: 'bg-purple-100 text-purple-900 border border-purple-300',
          icon: Car,
        };
      default:
        return {
          label: '1. Mengantri',
          badgeClass: 'bg-amber-100 text-amber-900 border border-amber-300',
          icon: Clock,
        };
    }
  };

  // Phase counts
  const phaseCounts = {
    mengantri: bookings.filter((b) => getPhaseKey(b.status) === 'mengantri').length,
    sedang_dikerjakan: bookings.filter((b) => getPhaseKey(b.status) === 'sedang_dikerjakan').length,
    selesai: bookings.filter((b) => getPhaseKey(b.status) === 'selesai').length,
    diambil: bookings.filter((b) => getPhaseKey(b.status) === 'diambil').length,
  };

  const filteredBookings = activeFilter === 'all'
    ? bookings
    : bookings.filter((b) => getPhaseKey(b.status) === activeFilter);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#091426]">Manajemen Antrean & Ketersediaan Slot</h1>
          <p className="text-xs text-slate-500 mt-1">
            Pantau 4 fase status servis kendaraan: <span className="font-bold text-amber-700">Mengantri</span> ➔ <span className="font-bold text-blue-700">Sedang Dikerjakan</span> ➔ <span className="font-bold text-emerald-700">Selesai</span> ➔ <span className="font-bold text-purple-700">Diambil</span>.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <label className="text-xs font-semibold text-slate-700">Tanggal Operasional:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-900 focus:border-[#eb6905] focus:outline-none"
          />
        </div>
      </div>

      {/* 4 FASE WORKFLOW SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div
          onClick={() => setActiveFilter('mengantri')}
          className={`cursor-pointer rounded-2xl border p-4 transition-all ${
            activeFilter === 'mengantri' ? 'ring-2 ring-amber-500 bg-amber-50/50 border-amber-300' : 'bg-white border-slate-200 hover:border-amber-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-amber-800 uppercase tracking-wider">Fase 1</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-amber-900 mt-2">{phaseCounts.mengantri}</p>
          <p className="text-xs font-bold text-slate-700 mt-1">Mengantri</p>
          <p className="text-[10px] text-slate-500">Unit tiba / Reservasi slot</p>
        </div>

        <div
          onClick={() => setActiveFilter('sedang_dikerjakan')}
          className={`cursor-pointer rounded-2xl border p-4 transition-all ${
            activeFilter === 'sedang_dikerjakan' ? 'ring-2 ring-blue-500 bg-blue-50/50 border-blue-300' : 'bg-white border-slate-200 hover:border-blue-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-blue-800 uppercase tracking-wider">Fase 2</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-100 text-blue-800">
              <Wrench className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-blue-900 mt-2">{phaseCounts.sedang_dikerjakan}</p>
          <p className="text-xs font-bold text-slate-700 mt-1">Sedang Dikerjakan</p>
          <p className="text-[10px] text-slate-500">Dalam pengerjaan pit bay</p>
        </div>

        <div
          onClick={() => setActiveFilter('selesai')}
          className={`cursor-pointer rounded-2xl border p-4 transition-all ${
            activeFilter === 'selesai' ? 'ring-2 ring-emerald-500 bg-emerald-50/50 border-emerald-300' : 'bg-white border-slate-200 hover:border-emerald-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-emerald-800 uppercase tracking-wider">Fase 3</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-900 mt-2">{phaseCounts.selesai}</p>
          <p className="text-xs font-bold text-slate-700 mt-1">Selesai</p>
          <p className="text-[10px] text-slate-500">Servis rampung, siap diambil</p>
        </div>

        <div
          onClick={() => setActiveFilter('diambil')}
          className={`cursor-pointer rounded-2xl border p-4 transition-all ${
            activeFilter === 'diambil' ? 'ring-2 ring-purple-500 bg-purple-50/50 border-purple-300' : 'bg-white border-slate-200 hover:border-purple-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-purple-800 uppercase tracking-wider">Fase 4</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-100 text-purple-800">
              <Car className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-purple-900 mt-2">{phaseCounts.diambil}</p>
          <p className="text-xs font-bold text-slate-700 mt-1">Diambil</p>
          <p className="text-[10px] text-slate-500">Diserahkan ke customer</p>
        </div>

      </div>

      {/* SLOT MATRIX OVERVIEW */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
          <Clock className="h-4 w-4 text-[#eb6905]" />
          <span>Kapasitas Slot Jam Operasional (Maksimal 4 Unit Per Jam)</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {slotData.slots.map((slot) => (
            <div
              key={slot.time}
              className={`p-3 rounded-xl border text-center space-y-1 ${
                slot.booked_count >= slot.max_limit
                  ? 'bg-rose-50 border-rose-200 text-rose-900'
                  : slot.booked_count > 0
                  ? 'bg-amber-50 border-amber-200 text-amber-900'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-900'
              }`}
            >
              <p className="font-mono text-xs font-bold">{slot.time.substring(0, 5)} WIB</p>
              <p className="text-xs font-extrabold">
                {slot.booked_count} / {slot.max_limit} Terisi
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* QUEUE LIST TABLE WITH FILTER TABS */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
            <span>Daftar Antrean Kendaraan ({filteredBookings.length})</span>
          </h3>

          {/* Filter Tabs */}
          <div className="flex items-center space-x-1 overflow-x-auto bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeFilter === 'all' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semua ({bookings.length})
            </button>
            <button
              onClick={() => setActiveFilter('mengantri')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeFilter === 'mengantri' ? 'bg-amber-500 text-white font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Mengantri ({phaseCounts.mengantri})
            </button>
            <button
              onClick={() => setActiveFilter('sedang_dikerjakan')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeFilter === 'sedang_dikerjakan' ? 'bg-blue-600 text-white font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sedang Dikerjakan ({phaseCounts.sedang_dikerjakan})
            </button>
            <button
              onClick={() => setActiveFilter('selesai')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeFilter === 'selesai' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Selesai ({phaseCounts.selesai})
            </button>
            <button
              onClick={() => setActiveFilter('diambil')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeFilter === 'diambil' ? 'bg-purple-600 text-white font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Diambil ({phaseCounts.diambil})
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 uppercase font-bold border-b border-slate-200">
              <tr>
                <th className="p-3">Kode Booking</th>
                <th className="p-3">Jam Slot</th>
                <th className="p-3">Customer & HP</th>
                <th className="p-3">Kendaraan</th>
                <th className="p-3">Fase Status</th>
                <th className="p-3 text-right">Aksi Update Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-500 font-medium">
                    Tidak ada antrean dalam fase status ini.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => {
                  const currentPhase = getPhaseKey(b.status);
                  const badgeInfo = getPhaseBadge(b.status);
                  const IconComp = badgeInfo.icon;

                  return (
                    <tr key={b.id} className="hover:bg-slate-50 font-medium">
                      <td className="p-3 font-mono font-bold text-slate-900">{b.booking_code}</td>
                      <td className="p-3 font-bold text-indigo-700">{b.booking_time}</td>
                      <td className="p-3 font-bold text-slate-800">{b.user_name} ({b.user_phone})</td>
                      <td className="p-3 font-bold text-slate-900">{b.license_plate} - {b.vehicle_model}</td>
                      <td className="p-3">
                        <span className={`inline-flex items-center space-x-1.5 rounded-full px-3 py-1 font-bold text-[11px] ${badgeInfo.badgeClass}`}>
                          <IconComp className="h-3.5 w-3.5" />
                          <span>{badgeInfo.label}</span>
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        {currentPhase === 'mengantri' && (
                          <button
                            onClick={() => handleUpdateStatus(b.id, 'sedang_dikerjakan')}
                            className="inline-flex items-center space-x-1 rounded-xl bg-blue-600 px-3 py-1.5 font-bold text-white text-[11px] hover:bg-blue-700 ml-auto transition-colors shadow-xs"
                          >
                            <span>1 ➔ 2 Mulai Dikerjakan</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                          </button>
                        )}
                        {currentPhase === 'sedang_dikerjakan' && (
                          <button
                            onClick={() => handleUpdateStatus(b.id, 'selesai')}
                            className="inline-flex items-center space-x-1 rounded-xl bg-emerald-600 px-3 py-1.5 font-bold text-white text-[11px] hover:bg-emerald-700 ml-auto transition-colors shadow-xs"
                          >
                            <span>2 ➔ 3 Tandai Selesai</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                          </button>
                        )}
                        {currentPhase === 'selesai' && (
                          <button
                            onClick={() => handleUpdateStatus(b.id, 'diambil')}
                            className="inline-flex items-center space-x-1 rounded-xl bg-purple-600 px-3 py-1.5 font-bold text-white text-[11px] hover:bg-purple-700 ml-auto transition-colors shadow-xs"
                          >
                            <span>3 ➔ 4 Serahkan (Diambil)</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                          </button>
                        )}
                        {currentPhase === 'diambil' && (
                          <span className="inline-flex items-center space-x-1 text-slate-500 font-bold text-[11px]">
                            <CheckCircle2 className="h-3.5 w-3.5 text-purple-600" />
                            <span>Telah Diambil Customer</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

QueueManagement.layout = (page) => <AdminLayout children={page} />;

export default QueueManagement;
