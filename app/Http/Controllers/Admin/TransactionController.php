<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Transaction;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class TransactionController extends Controller
{
    /**
     * Process POS checkout — create a Transaction and mark booking completed.
     * POST /admin/transactions
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'booking_id'      => 'required|exists:bookings,id',
            'total_amount'    => 'required|numeric|min:0',
            'payment_method'  => 'required|in:cash,qris,debit_card,transfer',
            'payment_status'  => 'sometimes|in:paid,unpaid',
        ]);

        $booking = Booking::findOrFail($request->booking_id);

        // Create invoice
        Transaction::create([
            'invoice_number'  => 'INV-' . strtoupper(Str::random(8)),
            'booking_id'      => $booking->id,
            'total_amount'    => $request->total_amount,
            'payment_status'  => 'paid',
            'payment_method'  => $request->payment_method,
            'paid_at'         => now(),
        ]);

        // Mark booking as completed
        $booking->update(['status' => 'completed']);

        return back()->with('success', 'Transaksi berhasil diproses. Invoice diterbitkan.');
    }
}
