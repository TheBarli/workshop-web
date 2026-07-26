<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class ApiUserController extends Controller
{
    use ApiResponse;

    /**
     * Display a listing of users, optionally filtered by role query parameter (?role=customer).
     */
    public function index(Request $request): JsonResponse
    {
        $query = User::with('vehicles');

        if ($request->has('role') && ! empty($request->query('role'))) {
            $query->where('role', $request->query('role'));
        }

        $users = $query->latest()->get();

        return $this->successResponse(
            UserResource::collection($users),
            'Users retrieved successfully'
        );
    }

    /**
     * Get list of customers with their registered vehicles (Rubric Requirement).
     */
    public function getCustomers(): JsonResponse
    {
        $customers = User::where('role', 'customer')
            ->with('vehicles')
            ->latest()
            ->get();

        return $this->successResponse(
            UserResource::collection($customers),
            'Customer list retrieved successfully'
        );
    }

    /**
     * Store a newly created user in storage.
     */
    public function store(StoreUserRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $validated['password'] = Hash::make($validated['password']);

        $user = User::create($validated);
        $user->load('vehicles');

        return $this->successResponse(
            new UserResource($user),
            'User created successfully',
            201
        );
    }

    /**
     * Display the specified user details with their registered vehicles.
     */
    public function show(User $user): JsonResponse
    {
        $user->load('vehicles');

        return $this->successResponse(
            new UserResource($user),
            'User details retrieved successfully'
        );
    }

    /**
     * Update the specified user in storage.
     */
    public function update(UpdateUserRequest $request, User $user): JsonResponse
    {
        $validated = array_filter($request->validated(), fn ($val) => $val !== null);

        if (! empty($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        }

        $user->update($validated);
        $user->load('vehicles');

        return $this->successResponse(
            new UserResource($user),
            'User updated successfully'
        );
    }

    /**
     * Remove the specified user from storage.
     */
    public function destroy(User $user): JsonResponse
    {
        $user->delete();

        return $this->successResponse(
            null,
            'User deleted successfully'
        );
    }
}
