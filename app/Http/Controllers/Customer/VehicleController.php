<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Vehicle;
use App\Http\Requests\StoreVehicleRequest;
use App\Http\Requests\UpdateVehicleRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class VehicleController extends Controller
{
    /**
     * List customer's vehicles.
     */
    public function index(): Response
    {
        $vehicles = Vehicle::where('user_id', auth()->id())
            ->withCount('bookings')
            ->latest()
            ->get();

        return Inertia::render('customer/MyVehicles', [
            'vehicles' => $vehicles,
        ]);
    }

    /**
     * Store a new vehicle under logged-in customer.
     */
    public function store(StoreVehicleRequest $request): RedirectResponse
    {

        Vehicle::create([
            'user_id'       => auth()->id(),
            'license_plate' => strtoupper(str_replace(' ', '', $request->license_plate)),
            'brand'         => $request->brand,
            'model'         => $request->model,
            'year'          => $request->year,
            'color'         => $request->color,
        ]);

        return redirect()->route('customer.vehicles')
            ->with('success', 'Kendaraan berhasil didaftarkan.');
    }

    /**
     * Update an existing vehicle (ownership-checked).
     */
    public function update(UpdateVehicleRequest $request, Vehicle $vehicle): RedirectResponse
    {
        abort_if($vehicle->user_id !== auth()->id(), 403);

        $vehicle->update($request->only(['brand', 'model', 'year', 'color']));

        return redirect()->route('customer.vehicles')
            ->with('success', 'Data kendaraan berhasil diperbarui.');
    }

    /**
     * Delete a vehicle (ownership-checked).
     */
    public function destroy(Vehicle $vehicle): RedirectResponse
    {
        abort_if($vehicle->user_id !== auth()->id(), 403);

        $vehicle->delete();

        return redirect()->route('customer.vehicles')
            ->with('success', 'Kendaraan berhasil dihapus.');
    }
}