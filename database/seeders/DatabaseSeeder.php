<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            UserSeeder::class,                // 1. Users (customer, mechanic, admin, owner)
            ServiceSeeder::class,             // 2. Services & Spareparts master data
            MonotaroSeeder::class,            // 3. Monotaro Spareparts catalog import
            VehicleSeeder::class,             // 4. Vehicles + sample bookings (depends on users & services)
            AnalyticsTransactionSeeder::class,// 5. Historical transactions for financial analytics
        ]);
    }
}