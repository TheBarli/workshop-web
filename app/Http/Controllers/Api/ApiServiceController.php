<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreServiceRequest;
use App\Http\Requests\UpdateServiceRequest;
use App\Http\Resources\ServiceResource;
use App\Models\Service;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;

class ApiServiceController extends Controller
{
    use ApiResponse;

    /**
     * Display a listing of services.
     */
    public function index(): JsonResponse
    {
        $services = Service::latest()->get();

        return $this->successResponse(
            ServiceResource::collection($services),
            'Services retrieved successfully'
        );
    }

    /**
     * Store a newly created service in storage.
     */
    public function store(StoreServiceRequest $request): JsonResponse
    {
        $service = Service::create($request->validated());

        return $this->successResponse(
            new ServiceResource($service),
            'Service created successfully',
            201
        );
    }

    /**
     * Display the specified service.
     */
    public function show(Service $service): JsonResponse
    {
        return $this->successResponse(
            new ServiceResource($service),
            'Service details retrieved successfully'
        );
    }

    /**
     * Update the specified service in storage.
     */
    public function update(UpdateServiceRequest $request, Service $service): JsonResponse
    {
        $service->update(array_filter($request->validated(), fn ($val) => $val !== null));

        return $this->successResponse(
            new ServiceResource($service),
            'Service updated successfully'
        );
    }

    /**
     * Remove the specified service from storage.
     */
    public function destroy(Service $service): JsonResponse
    {
        $service->delete();

        return $this->successResponse(
            null,
            'Service deleted successfully'
        );
    }
}
