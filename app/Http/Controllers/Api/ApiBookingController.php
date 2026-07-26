<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBookingRequest;
use App\Http\Requests\UpdateBookingRequest;
use App\Http\Resources\BookingResource;
use App\Models\Booking;
use App\Models\BookingItem;
use App\Models\Service;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ApiBookingController extends Controller
{
    use ApiResponse;

    /**
     * Display a listing of bookings with eager-loaded relations.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $query = Booking::with(['customer', 'vehicle', 'mechanic', 'items.service', 'transaction']);

        if ($user->isCustomer()) {
            $query->where('customer_id', $user->id);
        }

        $bookings = $query->latest()->get();

        return $this->successResponse(
            BookingResource::collection($bookings),
            'Bookings retrieved successfully'
        );
    }

    /**
     * Store a newly created booking and items within DB transaction.
     */
    public function store(StoreBookingRequest $request): JsonResponse
    {
        $user = $request->user();
        $validated = $request->validated();

        $customerId = ($user->isCustomer() || empty($validated['customer_id']))
            ? $user->id
            : $validated['customer_id'];

        $booking = DB::transaction(function () use ($validated, $customerId) {
            $bookingCode = 'BK-' . strtoupper(Str::random(8));

            $booking = Booking::create([
                'booking_code'    => $bookingCode,
                'customer_id'     => $customerId,
                'vehicle_id'      => $validated['vehicle_id'],
                'scheduled_at'    => $validated['scheduled_at'],
                'status'          => 'pending',
                'complaint_notes' => $validated['complaint_notes'] ?? null,
            ]);

            // Handle service_ids if provided as array of IDs
            if (! empty($validated['service_ids'])) {
                $services = Service::whereIn('id', $validated['service_ids'])->get();
                foreach ($services as $service) {
                    BookingItem::create([
                        'booking_id' => $booking->id,
                        'service_id' => $service->id,
                        'quantity'   => 1,
                        'price'      => $service->price,
                        'subtotal'   => $service->price,
                    ]);
                }
            }

            // Handle items if provided with quantities
            if (! empty($validated['items'])) {
                foreach ($validated['items'] as $item) {
                    $service = Service::find($item['service_id']);
                    if ($service) {
                        $qty = $item['quantity'] ?? 1;
                        $subtotal = $service->price * $qty;
                        BookingItem::create([
                            'booking_id' => $booking->id,
                            'service_id' => $service->id,
                            'quantity'   => $qty,
                            'price'      => $service->price,
                            'subtotal'   => $subtotal,
                        ]);
                    }
                }
            }

            return $booking;
        });

        $booking->load(['customer', 'vehicle', 'mechanic', 'items.service', 'transaction']);

        return $this->successResponse(
            new BookingResource($booking),
            'Booking created successfully',
            201
        );
    }

    /**
     * Display the specified booking.
     */
    public function show(Request $request, Booking $booking): JsonResponse
    {
        $user = $request->user();

        if ($user->isCustomer() && $booking->customer_id !== $user->id) {
            return $this->errorResponse('Unauthorized access to booking', 403);
        }

        $booking->load(['customer', 'vehicle', 'mechanic', 'items.service', 'transaction']);

        return $this->successResponse(
            new BookingResource($booking),
            'Booking details retrieved successfully'
        );
    }

    /**
     * Update the specified booking status or details.
     */
    public function update(UpdateBookingRequest $request, Booking $booking): JsonResponse
    {
        $user = $request->user();

        if ($user->isCustomer() && $booking->customer_id !== $user->id) {
            return $this->errorResponse('Unauthorized access to update booking', 403);
        }

        $validated = array_filter($request->validated(), fn ($val) => $val !== null);

        DB::transaction(function () use ($booking, $validated) {
            $booking->update($validated);

            if (isset($validated['items']) && is_array($validated['items'])) {
                $booking->items()->delete();
                foreach ($validated['items'] as $item) {
                    $service = Service::find($item['service_id']);
                    if ($service) {
                        $qty = $item['quantity'] ?? 1;
                        $subtotal = $service->price * $qty;
                        BookingItem::create([
                            'booking_id' => $booking->id,
                            'service_id' => $service->id,
                            'quantity'   => $qty,
                            'price'      => $service->price,
                            'subtotal'   => $subtotal,
                        ]);
                    }
                }
            }
        });

        $booking->load(['customer', 'vehicle', 'mechanic', 'items.service', 'transaction']);

        return $this->successResponse(
            new BookingResource($booking),
            'Booking updated successfully'
        );
    }

    /**
     * Cancel/remove booking safely within transaction.
     */
    public function destroy(Request $request, Booking $booking): JsonResponse
    {
        $user = $request->user();

        if ($user->isCustomer() && $booking->customer_id !== $user->id) {
            return $this->errorResponse('Unauthorized access to cancel booking', 403);
        }

        DB::transaction(function () use ($booking) {
            $booking->items()->delete();
            $booking->delete();
        });

        return $this->successResponse(
            null,
            'Booking deleted successfully'
        );
    }
}
