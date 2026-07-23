<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class SanctumApiController extends Controller
{
    /**
     * Requirement 7a: GET /api/services
     * Returns list of service transactions / services with vehicle & customer details.
     */
    public function getServices(): JsonResponse
    {
        $services = Booking::with(['customer:id,name,email,phone_number', 'vehicle', 'mechanic:id,name', 'items.service'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'status' => 'success',
            'message' => 'Service transaction history retrieved successfully',
            'data' => $services,
        ], 200);
    }

    /**
     * Requirement 7b: GET /api/customers
     * Returns list of customers with their registered vehicles.
     */
    public function getCustomers(): JsonResponse
    {
        $customers = User::where('role', 'customer')
            ->with('vehicles')
            ->get(['id', 'name', 'email', 'phone_number', 'address', 'status', 'created_at']);

        return response()->json([
            'status' => 'success',
            'message' => 'Customer list retrieved successfully',
            'data' => $customers,
        ], 200);
    }
}