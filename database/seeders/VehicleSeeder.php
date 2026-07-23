<?php

namespace Database\Seeders;

use App\Models\Booking;
use App\Models\BookingItem;
use App\Models\Service;
use App\Models\User;
use App\Models\Vehicle;
use Illuminate\Database\Seeder;

class VehicleSeeder extends Seeder
{
    public function run(): void
    {
        $customer = User::where('email', 'budi@stelle.id')->first();
        $customer2 = User::where('email', 'dewi@stelle.id')->first();
        $mechanic  = User::where('email', 'agus.mechanic@stelle.id')->first();

        if (! $customer) {
            return;
        }

        // Vehicles for customer 1
        $vehicle1 = Vehicle::firstOrCreate(
            ['license_plate' => 'B1234CDG'],
            [
                'user_id' => $customer->id,
                'brand'   => 'Honda',
                'model'   => 'Civic Turbo',
                'year'    => 2022,
                'color'   => 'Hitam',
            ]
        );

        $vehicle2 = Vehicle::firstOrCreate(
            ['license_plate' => 'B5678XYZ'],
            [
                'user_id' => $customer->id,
                'brand'   => 'Toyota',
                'model'   => 'Avanza 1.3',
                'year'    => 2019,
                'color'   => 'Putih',
            ]
        );

        // Vehicle for customer 2
        if ($customer2) {
            Vehicle::firstOrCreate(
                ['license_plate' => 'D4321DEW'],
                [
                    'user_id' => $customer2->id,
                    'brand'   => 'Suzuki',
                    'model'   => 'Ertiga GX',
                    'year'    => 2021,
                    'color'   => 'Silver',
                ]
            );
        }

        // Seed a completed booking with transaction
        $service1 = Service::where('code', 'SRV-001')->first();
        $service2 = Service::where('code', 'SRV-002')->first();

        if ($vehicle1 && $service1 && ! Booking::where('booking_code', 'BK-20260723-001')->exists()) {
            $booking = Booking::create([
                'booking_code'    => 'BK-20260723-001',
                'customer_id'     => $customer->id,
                'vehicle_id'      => $vehicle1->id,
                'mechanic_id'     => $mechanic?->id,
                'scheduled_at'    => now()->subHours(3),
                'status'          => 'in_progress',
                'complaint_notes' => 'Mesin agak kasar saat cold start, perlu tune up.',
            ]);

            BookingItem::create([
                'booking_id' => $booking->id,
                'service_id' => $service1->id,
                'quantity'   => 1,
                'price'      => $service1->price,
                'subtotal'   => $service1->price,
            ]);

            if ($service2) {
                BookingItem::create([
                    'booking_id' => $booking->id,
                    'service_id' => $service2->id,
                    'quantity'   => 1,
                    'price'      => $service2->price,
                    'subtotal'   => $service2->price,
                ]);
            }
        }

        // Seed a second pending booking for customer 2
        if ($customer2 && $service1 && ! Booking::where('booking_code', 'BK-20260724-002')->exists()) {
            $vehicle3 = Vehicle::where('license_plate', 'D4321DEW')->first();
            if ($vehicle3) {
                $booking2 = Booking::create([
                    'booking_code'    => 'BK-20260724-002',
                    'customer_id'     => $customer2->id,
                    'vehicle_id'      => $vehicle3->id,
                    'scheduled_at'    => now()->addHours(6),
                    'status'          => 'pending',
                    'complaint_notes' => 'Rem berdecit saat diinjak.',
                ]);

                BookingItem::create([
                    'booking_id' => $booking2->id,
                    'service_id' => $service1->id,
                    'quantity'   => 1,
                    'price'      => $service1->price,
                    'subtotal'   => $service1->price,
                ]);
            }
        }
    }
}
