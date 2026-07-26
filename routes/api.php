<?php

use App\Http\Controllers\Api\ApiAuthController;
use App\Http\Controllers\Api\ApiBookingController;
use App\Http\Controllers\Api\ApiServiceController;
use App\Http\Controllers\Api\ApiTransactionController;
use App\Http\Controllers\Api\ApiUserController;
use App\Http\Controllers\Api\ApiVehicleController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API ROUTES (Sanctum Authenticated)
|--------------------------------------------------------------------------
*/

// Public Auth API
Route::post('/login', [ApiAuthController::class, 'login']);

// Protected API Endpoints
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [ApiAuthController::class, 'logout']);

    Route::get('/user', function (Request $request) {
        return response()->json([
            'status' => 'success',
            'user'   => $request->user(),
        ]);
    });

    // Customer & General Endpoints
    Route::apiResource('vehicles', ApiVehicleController::class);
    Route::apiResource('bookings', ApiBookingController::class);

    // Staff Endpoints (Admin, Kasir, Owner)
    Route::middleware('role:admin,kasir,owner')->group(function () {
        Route::apiResource('services', ApiServiceController::class);
        Route::apiResource('transactions', ApiTransactionController::class);
        Route::get('/customers', [ApiUserController::class, 'getCustomers']);
    });

    // Owner Only
    Route::middleware('role:owner')->group(function () {
        Route::apiResource('users', ApiUserController::class);
    });
});