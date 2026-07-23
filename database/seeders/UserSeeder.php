<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Customer
        User::firstOrCreate(
            ['email' => 'budi@stelle.id'],
            [
                'name'         => 'Budi Santoso',
                'password'     => Hash::make('password123'),
                'phone_number' => '081234567890',
                'role'         => 'customer',
            ]
        );

        // Additional customer
        User::firstOrCreate(
            ['email' => 'dewi@stelle.id'],
            [
                'name'         => 'Dewi Rahayu',
                'password'     => Hash::make('password123'),
                'phone_number' => '081298765432',
                'role'         => 'customer',
            ]
        );

        // Mechanic
        User::firstOrCreate(
            ['email' => 'agus.mechanic@stelle.id'],
            [
                'name'         => 'Agus Pratama',
                'password'     => Hash::make('password123'),
                'phone_number' => '081987654321',
                'role'         => 'mechanic',
            ]
        );

        // Admin
        User::firstOrCreate(
            ['email' => 'siti.admin@stelle.id'],
            [
                'name'     => 'Siti Admin',
                'password' => Hash::make('password123'),
                'role'     => 'admin',
            ]
        );

        // Owner
        User::firstOrCreate(
            ['email' => 'owner@stelle.id'],
            [
                'name'     => 'Dian Owner',
                'password' => Hash::make('password123'),
                'role'     => 'owner',
            ]
        );
    }
}
