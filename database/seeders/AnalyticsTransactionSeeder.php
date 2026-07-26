<?php

namespace Database\Seeders;

use App\Models\Booking;
use App\Models\BookingItem;
use App\Models\Service;
use App\Models\Transaction;
use App\Models\User;
use App\Models\Vehicle;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AnalyticsTransactionSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Ensure additional mechanics exist for varied job assignments
        $mechanicNames = [
            ['name' => 'Agus Pratama', 'email' => 'agus.mechanic@stelle.id'],
            ['name' => 'Bambang Wijaya', 'email' => 'bambang.mechanic@stelle.id'],
            ['name' => 'Eko Prasetyo', 'email' => 'eko.mechanic@stelle.id'],
            ['name' => 'Rizky Kurniawan', 'email' => 'rizky.mechanic@stelle.id'],
        ];

        $mechanics = [];
        foreach ($mechanicNames as $m) {
            $mechanics[] = User::firstOrCreate(
                ['email' => $m['email']],
                [
                    'name'         => $m['name'],
                    'password'     => Hash::make('password123'),
                    'phone_number' => '08' . rand(100000000, 999999999),
                    'role'         => 'mechanic',
                    'status'       => 'active',
                ]
            );
        }

        // 2. Ensure customers and vehicles exist
        $customerData = [
            ['name' => 'Budi Santoso', 'email' => 'budi@stelle.id', 'plate' => 'B1234CDG', 'brand' => 'Honda', 'model' => 'Civic Turbo'],
            ['name' => 'Dewi Rahayu', 'email' => 'dewi@stelle.id', 'plate' => 'D4321DEW', 'brand' => 'Suzuki', 'model' => 'Ertiga GX'],
            ['name' => 'Rudi Hermawan', 'email' => 'rudi.customer@stelle.id', 'plate' => 'B8877RUD', 'brand' => 'Toyota', 'model' => 'Innova Zenix'],
            ['name' => 'Sinta Nurhaliza', 'email' => 'sinta.customer@stelle.id', 'plate' => 'B3344SNT', 'brand' => 'Daihatsu', 'model' => 'Xenia 1.5'],
            ['name' => 'Andi Wijaya', 'email' => 'andi.customer@stelle.id', 'plate' => 'B9900AND', 'brand' => 'Mitsubishi', 'model' => 'Xpander Cross'],
        ];

        $customersWithVehicles = [];
        foreach ($customerData as $c) {
            $user = User::firstOrCreate(
                ['email' => $c['email']],
                [
                    'name'         => $c['name'],
                    'password'     => Hash::make('password123'),
                    'phone_number' => '08' . rand(100000000, 999999999),
                    'role'         => 'customer',
                    'status'       => 'active',
                ]
            );

            $vehicle = Vehicle::firstOrCreate(
                ['license_plate' => $c['plate']],
                [
                    'user_id' => $user->id,
                    'brand'   => $c['brand'],
                    'model'   => $c['model'],
                    'year'    => rand(2018, 2024),
                    'color'   => 'Hitam',
                ]
            );

            $customersWithVehicles[] = [
                'customer' => $user,
                'vehicle'  => $vehicle,
            ];
        }

        // 3. Fetch Master Services & Spareparts
        $services = Service::all();
        if ($services->isEmpty()) {
            // Fallback service creation if database is empty
            $services = collect([
                Service::create(['code' => 'SRV-001', 'name' => 'Servis Berkala & Ganti Oli', 'category' => 'service', 'price' => 350000, 'stock' => 999]),
                Service::create(['code' => 'SRV-002', 'name' => 'Tune Up Mesin Injeksi', 'category' => 'service', 'price' => 450000, 'stock' => 999]),
                Service::create(['code' => 'SRV-003', 'name' => 'Spooring & Balancing 4 Roda', 'category' => 'service', 'price' => 250000, 'stock' => 999]),
                Service::create(['code' => 'PART-001', 'name' => 'Oli Mesin Fully Synthetic 4L', 'category' => 'sparepart', 'price' => 480000, 'stock' => 50]),
                Service::create(['code' => 'PART-002', 'name' => 'Filter Oli Genuine', 'category' => 'sparepart', 'price' => 65000, 'stock' => 100]),
            ]);
        }

        $complaints = [
            'Servis berkala rutin & ganti oli mesin.',
            'Mesin agak bergetar saat stasioner, perlu tune up.',
            'Rem terdengar berdecit kasar saat pengereman.',
            'AC kurang dingin, minta diisi freon dan cek filter.',
            'Cek kaki-kaki depan & spooring balancing.',
            'Tarikan mesin berat & konsumsi BBM boros.',
            'Ganti kanvas rem depan & kuras minyak rem.',
            'Lampu indikator mesin menyala, perlu scan ECU.',
        ];

        $diagnoses = [
            'Oli kotor & filter udara tersumbat. Sudah dilakukan penggantian dan tune up.',
            'Kanvas rem aus 80%. Telah diganti dengan unit baru dan di-bleeding.',
            'Freon AC kurang akibat kotoran pada filter cabin. Filter diganti & freon diisi ulang.',
            'Spooring & balancing selesai. Kemudi kembali stabil.',
            'Busi perlu diganti akibat deposit karbon. Mesin kembali halus.',
            'Semua komponen utama teruji normal. Unit siap diserahkan.',
        ];

        $paymentMethods = ['cash', 'qris', 'transfer', 'debit'];

        $globalSeq = 100;

        // 4. Generate 5 months of historical data (e.g. 5 months ago to current month)
        for ($monthOffset = 5; $monthOffset >= 0; $monthOffset--) {
            $baseDate = Carbon::now()->subMonths($monthOffset);
            $daysInMonth = $baseDate->daysInMonth;

            // 15-25 transactions per month for historical months; 10-15 for current month
            $count = ($monthOffset === 0) ? rand(10, 15) : rand(18, 26);

            for ($i = 0; $i < $count; $i++) {
                $globalSeq++;
                $day = rand(1, min(28, $daysInMonth));
                $hour = rand(8, 16);
                $minute = rand(0, 59);

                $recordDate = $baseDate->copy()->setDay($day)->setHour($hour)->setMinute($minute)->setSecond(0);

                // For current month ($monthOffset === 0), include a mix of status
                if ($monthOffset === 0) {
                    $statusRand = rand(1, 10);
                    if ($statusRand <= 6) {
                        $status = 'completed';
                    } elseif ($statusRand <= 8) {
                        $status = 'in_progress';
                    } else {
                        $status = 'pending';
                    }
                } else {
                    $status = 'completed';
                }

                $pair = $customersWithVehicles[array_rand($customersWithVehicles)];
                $mechanic = $mechanics[array_rand($mechanics)];

                $bookingCode = 'BK-' . $recordDate->format('Ymd') . '-' . str_pad($globalSeq, 4, '0', STR_PAD_LEFT);

                // Create Booking
                $booking = Booking::create([
                    'booking_code'       => $bookingCode,
                    'customer_id'        => $pair['customer']->id,
                    'vehicle_id'         => $pair['vehicle']->id,
                    'mechanic_id'        => $mechanic->id,
                    'scheduled_at'       => $recordDate,
                    'status'             => $status,
                    'complaint_notes'    => $complaints[array_rand($complaints)],
                    'mechanic_diagnosis' => in_array($status, ['completed', 'in_progress']) ? $diagnoses[array_rand($diagnoses)] : null,
                    'created_at'         => $recordDate,
                    'updated_at'         => $recordDate,
                ]);

                // Create 1-3 BookingItems
                $itemCount = rand(1, 3);
                $selectedServices = $services->random(min($itemCount, $services->count()));
                $totalAmount = 0;

                foreach ($selectedServices as $srv) {
                    $qty = rand(1, 2);
                    $subtotal = $srv->price * $qty;
                    $totalAmount += $subtotal;

                    BookingItem::create([
                        'booking_id' => $booking->id,
                        'service_id' => $srv->id,
                        'quantity'   => $qty,
                        'price'      => $srv->price,
                        'subtotal'   => $subtotal,
                        'created_at' => $recordDate,
                        'updated_at' => $recordDate,
                    ]);
                }

                // Create Transaction for completed or in_progress bookings
                if ($status === 'completed') {
                    Transaction::create([
                        'invoice_number' => 'INV-' . $recordDate->format('Ymd') . '-' . str_pad($globalSeq, 4, '0', STR_PAD_LEFT),
                        'booking_id'     => $booking->id,
                        'total_amount'   => $totalAmount,
                        'payment_status' => 'paid',
                        'payment_method' => $paymentMethods[array_rand($paymentMethods)],
                        'paid_at'        => $recordDate->copy()->addMinutes(rand(30, 120)),
                        'created_at'     => $recordDate,
                        'updated_at'     => $recordDate,
                    ]);
                } elseif ($status === 'in_progress') {
                    Transaction::create([
                        'invoice_number' => 'INV-' . $recordDate->format('Ymd') . '-' . str_pad($globalSeq, 4, '0', STR_PAD_LEFT),
                        'booking_id'     => $booking->id,
                        'total_amount'   => $totalAmount,
                        'payment_status' => 'unpaid',
                        'payment_method' => null,
                        'paid_at'        => null,
                        'created_at'     => $recordDate,
                        'updated_at'     => $recordDate,
                    ]);
                }
            }
        }
    }
}
