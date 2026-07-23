<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Service;
use App\Http\Requests\StoreServiceRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class AdminServiceController extends Controller
{
    /**
     * Store a new service or sparepart.
     * POST /admin/services
     */
    public function store(StoreServiceRequest $request): RedirectResponse
    {

        Service::create($request->only([
            'code', 'name', 'category', 'price', 'stock', 'estimated_minutes', 'description',
        ]));

        return back()->with('success', 'Item berhasil ditambahkan ke inventaris.');
    }

    /**
     * Update stock or price of an existing service/sparepart.
     * PATCH /admin/services/{service}
     */
    public function update(Request $request, Service $service): RedirectResponse
    {
        $request->validate([
            'stock'       => 'nullable|integer|min:0',
            'price'       => 'nullable|numeric|min:0',
            'name'        => 'nullable|string|max:255',
            'description' => 'nullable|string|max:1000',
        ]);

        $service->update(array_filter($request->only(['stock', 'price', 'name', 'description']), fn($v) => !is_null($v)));

        return back()->with('success', 'Data item berhasil diperbarui.');
    }
}
