<?php

use App\Http\Controllers\Api\ApiAuthController;
use App\Http\Controllers\Api\SanctumApiController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API ROUTES (Sanctum Authenticated)
|--------------------------------------------------------------------------
*/

// Public Auth API
Route::post('/login', [ApiAuthController::class, 'login']);

// Protected API Endpoints (Rubric Requirement #7)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [ApiAuthController::class, 'logout']);
    
    // Auth User Profile Check Endpoint
    Route::get('/user', function (Request $request) {
        return response()->json($request->user());
    });

    // Required Rubric Endpoints
    Route::get('/services', [SanctumApiController::class, 'getServices']);
    Route::get('/customers', [SanctumApiController::class, 'getCustomers']);
});