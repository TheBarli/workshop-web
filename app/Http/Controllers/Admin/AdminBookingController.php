<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Http\Requests\UpdateBookingRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class AdminBookingController extends Controller
{
    /**
     * Update booking status and optionally assign a mechanic.
     * PATCH /admin/bookings/{booking}/status
     */
    public function updateStatus(UpdateBookingRequest $request, Booking $booking): RedirectResponse
    {
        $data = ['status' => $request->status];

        if ($request->filled('mechanic_id')) {
            $data['mechanic_id'] = $request->mechanic_id;
        }

        $booking->update($data);

        return back()->with('success', 'Status booking berhasil diperbarui.');
    }
}
