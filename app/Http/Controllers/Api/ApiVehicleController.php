<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreVehicleRequest;
use App\Http\Requests\UpdateVehicleRequest;
use App\Http\Resources\VehicleResource;
use App\Models\Vehicle;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ApiVehicleController extends Controller
{
    use ApiResponse;

    /**
     * Display a listing of vehicles.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user->isCustomer()) {
            $vehicles = Vehicle::where('user_id', $user->id)->get();
        } else {
            $vehicles = Vehicle::with('owner:id,name,email,phone_number')->latest()->get();
        }

        return $this->successResponse(
            VehicleResource::collection($vehicles),
            'Vehicles retrieved successfully'
        );
    }

    /**
     * Store a newly created vehicle in storage.
     */
    public function store(StoreVehicleRequest $request): JsonResponse
    {
        $user = $request->user();
        $validated = $request->validated();

        if ($user->isCustomer() || empty($validated['user_id'])) {
            $validated['user_id'] = $user->id;
        }

        $vehicle = Vehicle::create($validated);
        $vehicle->load('owner:id,name,email,phone_number');

        return $this->successResponse(
            new VehicleResource($vehicle),
            'Vehicle registered successfully',
            201
        );
    }

    /**
     * Display the specified vehicle.
     */
    public function show(Request $request, Vehicle $vehicle): JsonResponse
    {
        $user = $request->user();

        if ($user->isCustomer() && $vehicle->user_id !== $user->id) {
            return $this->errorResponse('Unauthorized access to vehicle', 403);
        }

        $vehicle->load('owner:id,name,email,phone_number');

        return $this->successResponse(
            new VehicleResource($vehicle),
            'Vehicle details retrieved successfully'
        );
    }

    /**
     * Update the specified vehicle in storage.
     */
    public function update(UpdateVehicleRequest $request, Vehicle $vehicle): JsonResponse
    {
        $user = $request->user();

        if ($user->isCustomer() && $vehicle->user_id !== $user->id) {
            return $this->errorResponse('Unauthorized access to update vehicle', 403);
        }

        $vehicle->update(array_filter($request->validated(), fn ($val) => $val !== null));
        $vehicle->load('owner:id,name,email,phone_number');

        return $this->successResponse(
            new VehicleResource($vehicle),
            'Vehicle updated successfully'
        );
    }

    /**
     * Remove the specified vehicle from storage.
     */
    public function destroy(Request $request, Vehicle $vehicle): JsonResponse
    {
        $user = $request->user();

        if ($user->isCustomer() && $vehicle->user_id !== $user->id) {
            return $this->errorResponse('Unauthorized access to delete vehicle', 403);
        }

        $vehicle->delete();

        return $this->successResponse(
            null,
            'Vehicle removed successfully'
        );
    }
}
