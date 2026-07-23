<?php

use App\Http\Controllers\Admin\AdminBookingController;
use App\Http\Controllers\Admin\AdminServiceController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\TransactionController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Customer\BookingController;
use App\Http\Controllers\Customer\VehicleController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| PUBLIC / GUEST ROUTES
|--------------------------------------------------------------------------
*/
Route::get('/', fn () => Inertia::render('public/LandingPage'))->name('landing');
Route::get('/services', fn () => Inertia::render('public/ServicesCatalog'))->name('services');
Route::get('/spareparts', fn () => Inertia::render('public/SparepartsCatalog'))->name('spareparts');

// Guest Auth Routes
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('/login', [AuthenticatedSessionController::class, 'store']);

    Route::get('/register', [RegisteredUserController::class, 'create'])->name('register');
    Route::post('/register', [RegisteredUserController::class, 'store']);
});

/*
|--------------------------------------------------------------------------
| AUTHENTICATED COMMON ROUTES
|--------------------------------------------------------------------------
*/
Route::middleware(['auth'])->group(function () {
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');

    // Role-based main entry point redirector
    Route::get('/dashboard', function () {
        $user = auth()->user();
        if ($user->isCustomer()) {
            return redirect()->route('customer.dashboard');
        }
        return redirect()->route('admin.dashboard');
    })->name('dashboard');

    Route::post('/switch-role', function (Request $request) {
        $request->validate(['role' => 'required|string']);
        session(['user_role' => $request->role]);
        return back();
    })->name('switch-role');
});

/*
|--------------------------------------------------------------------------
| CUSTOMER ROUTES
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'role:customer,admin,owner'])
    ->prefix('customer')
    ->name('customer.')
    ->group(function () {
        Route::get('/dashboard', [BookingController::class, 'dashboard'])->name('dashboard');

        // Customer Vehicles — full CRUD
        Route::get('/vehicles', [VehicleController::class, 'index'])->name('vehicles');
        Route::post('/vehicles', [VehicleController::class, 'store'])->name('vehicles.store');
        Route::put('/vehicles/{vehicle}', [VehicleController::class, 'update']);
        Route::patch('/vehicles/{vehicle}', [VehicleController::class, 'update'])->name('vehicles.update');
        Route::delete('/vehicles/{vehicle}', [VehicleController::class, 'destroy'])->name('vehicles.destroy');

        // Customer Bookings — Create + Read + Update Status + Delete/Cancel
        Route::get('/bookings', [BookingController::class, 'create'])->name('bookings.create');
        Route::post('/bookings', [BookingController::class, 'store'])->name('bookings.store');
        Route::get('/bookings/{id}', [BookingController::class, 'show'])->name('bookings.show');
        Route::put('/bookings/{booking}/status', [BookingController::class, 'updateStatus']);
        Route::patch('/bookings/{booking}/status', [BookingController::class, 'updateStatus'])->name('bookings.update-status');
        Route::patch('/bookings/{booking}/cancel', [BookingController::class, 'cancel'])->name('bookings.cancel');
        Route::delete('/bookings/{booking}', [BookingController::class, 'destroy'])->name('bookings.destroy');

        Route::get('/history', [BookingController::class, 'history'])->name('history');
    });

/*
|--------------------------------------------------------------------------
| ADMIN / MECHANIC / OWNER ROUTES
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'role:admin,mechanic,owner'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');
        Route::get('/schedule', [AdminDashboardController::class, 'queue'])->name('schedule');
        Route::get('/work-orders', [AdminDashboardController::class, 'workOrders'])->name('work-orders');
        Route::get('/pos', [AdminDashboardController::class, 'pos'])->name('pos');
        Route::get('/inventory', [AdminDashboardController::class, 'inventory'])->name('inventory');
        Route::get('/reports', [AdminDashboardController::class, 'reports'])->name('reports');

        // Admin Booking Status Management
        Route::patch('/bookings/{booking}/status', [AdminBookingController::class, 'updateStatus'])->name('bookings.status');

        // Admin Service / Sparepart Inventory Management
        Route::post('/services', [AdminServiceController::class, 'store'])->name('services.store');
        Route::patch('/services/{service}', [AdminServiceController::class, 'update'])->name('services.update');

        // POS Checkout — create Transaction
        Route::post('/transactions', [TransactionController::class, 'store'])->name('transactions.store');
    });

Route::fallback(fn () => redirect('/'));