<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\BookingItem;
use App\Models\Service;
use App\Models\Vehicle;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BookingController extends Controller
{
    /**
     * Customer Dashboard with recent bookings summary.
     */
    public function dashboard(): Response
    {
        $userId = auth()->id();

        $recentBookings = Booking::where('customer_id', $userId)
            ->with(['vehicle', 'items.service'])
            ->latest()
            ->take(5)
            ->get();

        $vehicles = Vehicle::where('user_id', $userId)->latest()->get();
        $pendingBookingsCount = Booking::where('customer_id', $userId)->where('status', 'pending')->count();

        return Inertia::render('customer/Dashboard', [
            'recentBookings' => $recentBookings,
            'vehicles'       => $vehicles,
            'stats' => [
                'totalVehicles'   => $vehicles->count(),
                'pendingBookings' => $pendingBookingsCount,
            ],
        ]);
    }

    /**
     * Display service booking form.
     */
    public function create(): Response
    {
        $userId = auth()->id();

        return Inertia::render('customer/CreateBooking', [
            'vehicles' => Vehicle::where('user_id', $userId)->get(),
            'services' => Service::where('category', 'service')->get(),
        ]);
    }

    /**
     * Store new customer booking.
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'vehicle_id'      => 'required|exists:vehicles,id',
            'scheduled_at'    => 'required|date|after:now',
            'complaint_notes' => 'nullable|string|max:1000',
            'service_ids'     => 'required|array|min:1',
            'service_ids.*'   => 'exists:services,id',
        ]);

        // Build unique booking code
        $bookingCode = 'BK-' . date('Ymd') . '-' . strtoupper(substr(uniqid(), -4));

        $booking = Booking::create([
            'booking_code'    => $bookingCode,
            'customer_id'     => auth()->id(),
            'vehicle_id'      => $request->vehicle_id,
            'scheduled_at'    => $request->scheduled_at,
            'complaint_notes' => $request->complaint_notes,
            'status'          => 'pending',
        ]);

        // Attach line items
        foreach ($request->service_ids as$serviceId) {
            $service = Service::find($serviceId);
            BookingItem::create([
                'booking_id' => $booking->id,
                'service_id' => $service->id,
                'quantity'   => 1,
                'price'      => $service->price,
                'subtotal'   => $service->price,
            ]);
        }

        return redirect()->route('customer.dashboard')
            ->with('success', 'Booking submitted successfully! Tracking Code: ' . $bookingCode);
    }

    /**
     * Show detailed booking status.
     */
    public function show(int $id): Response
    {
        $booking = Booking::where('customer_id', auth()->id())
            ->with(['vehicle', 'mechanic', 'items.service', 'transaction'])
            ->findOrFail($id);

        return Inertia::render('customer/BookingDetail', [
            'booking' => $booking,
        ]);
    }

    /**
     * Service History Log.
     */
    public function history(): Response
    {
        $bookings = Booking::where('customer_id', auth()->id())
            ->with(['vehicle', 'items.service', 'transaction'])
            ->latest()
            ->get();

        return Inertia::render('customer/ServiceHistory', [
            'bookings' => $bookings,
        ]);
    }
}