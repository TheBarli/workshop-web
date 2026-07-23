<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Service;
use App\Http\Requests\StoreServiceRequest;
use App\Http\Requests\UpdateServiceRequest;
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
    public function update(UpdateServiceRequest $request, Service $service): RedirectResponse
    {
        $service->update(array_filter($request->only(['stock', 'price', 'name', 'estimated_minutes', 'description']), fn($v) => !is_null($v)));

        return back()->with('success', 'Data item berhasil diperbarui.');
    }
}
