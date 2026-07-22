import React from 'react';
import { Clock, CheckCircle, XCircle } from 'lucide-react';

const TimeSlotMatrix = ({ slots = [], selectedTime, onSelectTime, loading = false }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 animate-pulse">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="h-16 rounded-xl bg-slate-200" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span className="font-semibold text-slate-700">Pilih Slot Jam Operasional (Maks 4 Unit/Jam) [BR-003]:</span>
        <span className="flex items-center space-x-3">
          <span className="flex items-center space-x-1"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span><span>Tersedia</span></span>
          <span className="flex items-center space-x-1"><span className="h-2.5 w-2.5 rounded-full bg-amber-500"></span><span>Dipilih</span></span>
          <span className="flex items-center space-x-1"><span className="h-2.5 w-2.5 rounded-full bg-rose-500"></span><span>Penuh</span></span>
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {slots.map((slot) => {
          const isSelected = selectedTime === slot.time;
          const isFull = !slot.is_available;

          return (
            <button
              key={slot.time}
              type="button"
              disabled={isFull}
              onClick={() => onSelectTime(slot.time)}
              className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all text-center ${
                isSelected
                  ? 'border-[#eb6905] bg-[#eb6905]/10 ring-2 ring-[#eb6905] text-[#eb6905] shadow-md scale-105'
                  : isFull
                  ? 'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed opacity-60'
                  : 'border-slate-200 bg-white hover:border-[#eb6905]/50 hover:bg-slate-50 text-slate-800 shadow-xs'
              }`}
            >
              <div className="flex items-center space-x-1 font-mono text-sm font-bold">
                <Clock className="h-3.5 w-3.5" />
                <span>{slot.time.substring(0, 5)} WIB</span>
              </div>

              <div className="mt-1 text-[11px] font-semibold">
                {isFull ? (
                  <span className="text-rose-600 font-bold flex items-center space-x-1">
                    <XCircle className="h-3 w-3" />
                    <span>Slot Penuh ({slot.booked_count}/{slot.max_limit})</span>
                  </span>
                ) : (
                  <span className={isSelected ? 'text-[#eb6905] font-bold' : 'text-emerald-600'}>
                    Sisa {slot.max_limit - slot.booked_count} Slot
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TimeSlotMatrix;
