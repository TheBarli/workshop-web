<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTransactionRequest;
use App\Http\Requests\UpdateTransactionRequest;
use App\Http\Resources\TransactionResource;
use App\Models\Booking;
use App\Models\Transaction;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ApiTransactionController extends Controller
{
    use ApiResponse;

    /**
     * Display a listing of completed/all payment transactions with eager-loaded booking & customer.
     */
    public function index(): JsonResponse
    {
        $transactions = Transaction::with(['booking.customer', 'booking.vehicle', 'booking.items.service'])
            ->latest()
            ->get();

        return $this->successResponse(
            TransactionResource::collection($transactions),
            'Transactions retrieved successfully'
        );
    }

    /**
     * Store a newly created transaction and update booking status inside DB transaction.
     */
    public function store(StoreTransactionRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $transaction = DB::transaction(function () use ($validated) {
            $booking = Booking::with('items')->findOrFail($validated['booking_id']);

            // Compute total amount if not provided
            $totalAmount = $validated['total_amount'] ?? $booking->items->sum('subtotal');
            $paymentStatus = $validated['payment_status'] ?? 'paid';
            $paidAt = ($paymentStatus === 'paid') ? ($validated['paid_at'] ?? now()) : null;

            $invoiceNumber = 'INV-' . strtoupper(Str::random(8));

            $transaction = Transaction::create([
                'invoice_number' => $invoiceNumber,
                'booking_id'     => $booking->id,
                'total_amount'   => $totalAmount,
                'payment_status' => $paymentStatus,
                'payment_method' => $validated['payment_method'],
                'paid_at'        => $paidAt,
            ]);

            if ($paymentStatus === 'paid') {
                $booking->update(['status' => 'completed']);
            }

            return $transaction;
        });

        $transaction->load(['booking.customer', 'booking.vehicle', 'booking.items.service']);

        return $this->successResponse(
            new TransactionResource($transaction),
            'Transaction created successfully',
            201
        );
    }

    /**
     * Display the specified transaction.
     */
    public function show(Transaction $transaction): JsonResponse
    {
        $transaction->load(['booking.customer', 'booking.vehicle', 'booking.items.service']);

        return $this->successResponse(
            new TransactionResource($transaction),
            'Transaction details retrieved successfully'
        );
    }

    /**
     * Update transaction payment method/status.
     */
    public function update(UpdateTransactionRequest $request, Transaction $transaction): JsonResponse
    {
        $validated = array_filter($request->validated(), fn ($val) => $val !== null);

        DB::transaction(function () use ($transaction, $validated) {
            if (isset($validated['payment_status']) && $validated['payment_status'] === 'paid' && empty($transaction->paid_at)) {
                $validated['paid_at'] = now();
                $transaction->booking?->update(['status' => 'completed']);
            }

            $transaction->update($validated);
        });

        $transaction->load(['booking.customer', 'booking.vehicle', 'booking.items.service']);

        return $this->successResponse(
            new TransactionResource($transaction),
            'Transaction updated successfully'
        );
    }

    /**
     * Remove or void transaction.
     */
    public function destroy(Transaction $transaction): JsonResponse
    {
        $transaction->delete();

        return $this->successResponse(
            null,
            'Transaction deleted successfully'
        );
    }
}
