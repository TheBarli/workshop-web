<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| PUBLIC / GUEST ROUTES (GuestLayout)
|--------------------------------------------------------------------------
*/
Route::get('/', fn () => Inertia::render('public/LandingPage'))->name('landing');
Route::get('/services', fn () => Inertia::render('public/ServicesCatalog'))->name('services');
Route::get('/spareparts', fn () => Inertia::render('public/SparepartsCatalog'))->name('spareparts');

/*
|--------------------------------------------------------------------------
| CUSTOMER PROTECTED ROUTES (CustomerLayout)
| Allowed roles: customer, admin, owner
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'role:customer,admin,owner'])
    ->prefix('customer')
    ->name('customer.')
    ->group(function () {
        Route::get('/dashboard', fn () => Inertia::render('customer/Dashboard'))->name('dashboard');
        Route::get('/vehicles', fn () => Inertia::render('customer/MyVehicles'))->name('vehicles');
        Route::get('/bookings', fn () => Inertia::render('customer/CreateBooking'))->name('bookings.create');
        Route::get('/bookings/{id}', fn ($id) => Inertia::render('customer/BookingDetail', ['id' => $id]))->name('bookings.show');
        Route::get('/history', fn () => Inertia::render('customer/ServiceHistory'))->name('history');
    });

/*
|--------------------------------------------------------------------------
| ADMIN / MECHANIC / OWNER WORKSPACE ROUTES (AdminLayout)
| Allowed roles: admin, mechanic, owner
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'role:admin,mechanic,owner'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::get('/dashboard', fn () => Inertia::render('admin/AdminDashboard'))->name('dashboard');
        Route::get('/schedule', fn () => Inertia::render('admin/QueueManagement'))->name('schedule');
        Route::get('/work-orders', fn () => Inertia::render('admin/WorkOrders'))->name('work-orders');
        Route::get('/pos', fn () => Inertia::render('admin/POSCashier'))->name('pos');
        Route::get('/inventory', fn () => Inertia::render('admin/SparepartsInventory'))->name('inventory');
        Route::get('/reports', fn () => Inertia::render('admin/ReportsAnalytics'))->name('reports');
    });

/*
|--------------------------------------------------------------------------
| AUTH & FALLBACK ROUTES
|--------------------------------------------------------------------------
*/
require __DIR__.'/auth.php';

Route::fallback(fn () => redirect('/'));


Route::get('/dashboard', function () {
    $user = auth()->user();
    if (!$user) {
        return redirect()->route('login');
    }
    $role = $user->role;
    if ($role === 'customer') {
        return redirect()->route('customer.dashboard');
    } elseif (in_array($role, ['admin', 'mechanic', 'owner'])) {
        return redirect()->route('admin.dashboard');
    }
    return redirect('/');
})->middleware(['auth'])->name('dashboard');

Route::post('/switch-role', function (\Illuminate\Http\Request $request) {
    $request->validate(['role' => 'required|string']);
    session(['user_role' => $request->role]);
    return back();
})->middleware(['auth'])->name('switch-role');
