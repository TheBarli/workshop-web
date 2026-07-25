<?php

namespace Database\Seeders;

use App\Models\Service;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

class MonotaroSeeder extends Seeder
{
    public function run(): void
    {
        $jsonPath = database_path('data/monotaro_c66_p2.json');

        if (!File::exists($jsonPath)) {
            $this->command->error("File JSON tidak ditemukan di: {$jsonPath}");
            return;
        }

        $jsonData = json_decode(File::get($jsonPath), true);

        if (!is_array($jsonData)) {
            $this->command->error("Format JSON tidak valid!");
            return;
        }

        foreach ($jsonData as $item) {
            // Clean price string e.g. "Mulai Rp2.599.900" -> 2599900
            $priceNumeric = (float) preg_replace('/[^0-9]/', '', $item['harga'] ?? '0');
            $stock = ($item['ketersediaan'] ?? '') === 'Ready Stock' ? 50 : 10;
            $code = strtoupper($item['kode_produk'] ?? 'SP-' . uniqid());

            Service::updateOrCreate(
                ['code' => $code],
                [
                    'name'              => $item['nama_produk'] ?? 'Sparepart Monotaro',
                    'category'          => 'sparepart',
                    'price'             => $priceNumeric,
                    'estimated_minutes' => 0,
                    'stock'             => $stock,
                    'description'       => "Brand: {$item['brand']} | Ketersediaan: {$item['ketersediaan']} | Link: {$item['link']}",
                ]
            );
        }

        $this->command->info("Berhasil mengimpor " . count($jsonData) . " produk dari Monotaro ke tabel services.");
    }
}
