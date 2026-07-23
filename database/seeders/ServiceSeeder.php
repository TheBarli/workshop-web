<?php

namespace Database\Seeders;

use App\Models\Service;
use Illuminate\Database\Seeder;

class ServiceSeeder extends Seeder
{
    public function run(): void
    {
        $services = [
            // --- Service Items ---
            [
                'code'              => 'SRV-001',
                'name'              => 'Servis Berkala & Ganti Oli',
                'category'          => 'service',
                'price'             => 150000,
                'estimated_minutes' => 45,
                'description'       => 'Servis rutin berkala termasuk penggantian oli mesin SAE 10W-40.',
                'stock'             => 999,
            ],
            [
                'code'              => 'SRV-002',
                'name'              => 'Tune Up Mesin Injeksi',
                'category'          => 'service',
                'price'             => 250000,
                'estimated_minutes' => 60,
                'description'       => 'Pembersihan injector, throttle body, dan penyesuaian idle RPM.',
                'stock'             => 999,
            ],
            [
                'code'              => 'SRV-003',
                'name'              => 'Pemeriksaan & Servis Rem',
                'category'          => 'service',
                'price'             => 180000,
                'estimated_minutes' => 45,
                'description'       => 'Pengecekan kampas rem depan dan belakang, pembersihan kaliper.',
                'stock'             => 999,
            ],
            [
                'code'              => 'SRV-004',
                'name'              => 'Overhaul Mesin',
                'category'          => 'service',
                'price'             => 2500000,
                'estimated_minutes' => 480,
                'description'       => 'Bongkar mesin total, penggantian ring piston, dan sealing.',
                'stock'             => 999,
            ],
            [
                'code'              => 'SRV-005',
                'name'              => 'Diagnostik Komputer ECU',
                'category'          => 'service',
                'price'             => 120000,
                'estimated_minutes' => 30,
                'description'       => 'Pembacaan trouble code via OBD-II scanner profesional.',
                'stock'             => 999,
            ],

            // --- Sparepart Items ---
            [
                'code'              => 'SP-001',
                'name'              => 'Oli Mesin Shell Helix HX7 1L',
                'category'          => 'sparepart',
                'price'             => 65000,
                'estimated_minutes' => 0,
                'description'       => 'Oli semi-sintetik SAE 10W-40, kemasan 1 liter.',
                'stock'             => 80,
            ],
            [
                'code'              => 'SP-002',
                'name'              => 'Filter Oli Original',
                'category'          => 'sparepart',
                'price'             => 45000,
                'estimated_minutes' => 0,
                'description'       => 'Filter oli OEM fit untuk Honda, Toyota, Mitsubishi.',
                'stock'             => 50,
            ],
            [
                'code'              => 'SP-003',
                'name'              => 'Kampas Rem Depan Brembo',
                'category'          => 'sparepart',
                'price'             => 350000,
                'estimated_minutes' => 0,
                'description'       => 'Kampas rem depan performa tinggi merek Brembo.',
                'stock'             => 20,
            ],
            [
                'code'              => 'SP-004',
                'name'              => 'Busi NGK Iridium IX',
                'category'          => 'sparepart',
                'price'             => 85000,
                'estimated_minutes' => 0,
                'description'       => 'Busi iridium performa tinggi, set 4 buah.',
                'stock'             => 40,
            ],
        ];

        foreach ($services as $item) {
            Service::firstOrCreate(['code' => $item['code']], $item);
        }
    }
}
