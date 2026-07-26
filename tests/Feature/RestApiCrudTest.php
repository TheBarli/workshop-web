<?php

namespace Tests\Feature;

use App\Models\Booking;
use App\Models\BookingItem;
use App\Models\Service;
use App\Models\Transaction;
use App\Models\User;
use App\Models\Vehicle;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class RestApiCrudTest extends TestCase
{
    use RefreshDatabase;

    private function createTestUser(string $role = 'customer'): User
    {
        return User::create([
            'name'         => 'Test ' . ucfirst($role),
            'email'        => strtolower($role) . '_' . uniqid() . '@example.com',
            'password'     => Hash::make('password'),
            'role'         => $role,
            'phone_number' => '08123456789',
        ]);
    }

    public function test_service_crud_for_staff()
    {
        $admin = $this->createTestUser('admin');
        Sanctum::actingAs($admin);

        // Store
        $response = $this->postJson('/api/services', [
            'code'              => 'SRV-001',
            'name'              => 'Oil Change',
            'category'          => 'service',
            'price'             => 150000,
            'stock'             => 10,
            'estimated_minutes' => 30,
            'description'       => 'Standard synthetic oil change',
        ]);

        $response->assertStatus(201)
            ->assertJson([
                'status'  => 'success',
                'message' => 'Service created successfully',
                'data'    => [
                    'code' => 'SRV-001',
                    'name' => 'Oil Change',
                ],
            ]);

        $serviceId = $response->json('data.id');

        // Index
        $this->getJson('/api/services')
            ->assertStatus(200)
            ->assertJsonStructure(['status', 'message', 'data']);

        // Show
        $this->getJson("/api/services/{$serviceId}")
            ->assertStatus(200)
            ->assertJsonPath('data.code', 'SRV-001');

        // Update
        $this->putJson("/api/services/{$serviceId}", [
            'price' => 175000,
        ])->assertStatus(200)
          ->assertJsonPath('data.price', 175000);

        // Destroy
        $this->deleteJson("/api/services/{$serviceId}")
            ->assertStatus(200)
            ->assertJson(['status' => 'success']);
    }

    public function test_vehicle_crud_and_scoping()
    {
        $customer = $this->createTestUser('customer');
        $otherCustomer = $this->createTestUser('customer');

        Sanctum::actingAs($customer);

        // Create vehicle as customer
        $response = $this->postJson('/api/vehicles', [
            'license_plate' => 'B1234XYZ',
            'brand'         => 'Honda',
            'model'         => 'Civic',
            'year'          => 2022,
            'color'         => 'Black',
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('data.user_id', $customer->id);

        $vehicleId = $response->json('data.id');

        // Customer sees own vehicle
        $this->getJson('/api/vehicles')
            ->assertStatus(200)
            ->assertJsonCount(1, 'data');

        // Other customer cannot see vehicle details
        Sanctum::actingAs($otherCustomer);
        $this->getJson("/api/vehicles/{$vehicleId}")
            ->assertStatus(403);
    }

    public function test_booking_crud_with_transaction_and_items()
    {
        $customer = $this->createTestUser('customer');
        $vehicle = Vehicle::create([
            'user_id'       => $customer->id,
            'license_plate' => 'B9999ABC',
            'brand'         => 'Toyota',
            'model'         => 'Corolla',
        ]);
        $service = Service::create([
            'code'     => 'SRV-002',
            'name'     => 'Brake Check',
            'category' => 'service',
            'price'    => 100000,
        ]);

        Sanctum::actingAs($customer);

        // Store Booking
        $response = $this->postJson('/api/bookings', [
            'vehicle_id'   => $vehicle->id,
            'scheduled_at' => now()->addDays(2)->toDateTimeString(),
            'service_ids'  => [$service->id],
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('data.customer_id', $customer->id)
            ->assertJsonCount(1, 'data.items');

        $bookingId = $response->json('data.id');

        // Staff can update booking status & assign mechanic
        $admin = $this->createTestUser('admin');
        $mechanic = $this->createTestUser('mechanic');
        Sanctum::actingAs($admin);

        $this->putJson("/api/bookings/{$bookingId}", [
            'status'      => 'in_progress',
            'mechanic_id' => $mechanic->id,
        ])->assertStatus(200)
          ->assertJsonPath('data.status', 'in_progress')
          ->assertJsonPath('data.mechanic_id', $mechanic->id);
    }

    public function test_transaction_creation_and_booking_completion()
    {
        $admin = $this->createTestUser('admin');
        $customer = $this->createTestUser('customer');
        $vehicle = Vehicle::create([
            'user_id'       => $customer->id,
            'license_plate' => 'B5555XYZ',
            'brand'         => 'Yamaha',
            'model'         => 'NMAX',
        ]);
        $booking = Booking::create([
            'booking_code' => 'BK-TEST01',
            'customer_id'  => $customer->id,
            'vehicle_id'   => $vehicle->id,
            'scheduled_at' => now()->toDateTimeString(),
            'status'       => 'in_progress',
        ]);

        Sanctum::actingAs($admin);

        $response = $this->postJson('/api/transactions', [
            'booking_id'     => $booking->id,
            'payment_method' => 'cash',
            'payment_status' => 'paid',
            'total_amount'   => 150000,
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('data.payment_status', 'paid')
            ->assertJsonPath('data.total_amount', 150000);

        // Booking status automatically set to completed
        $this->assertDatabaseHas('bookings', [
            'id'     => $booking->id,
            'status' => 'completed',
        ]);
    }

    public function test_owner_user_management()
    {
        $owner = $this->createTestUser('owner');
        Sanctum::actingAs($owner);

        // Create User
        $response = $this->postJson('/api/users', [
            'name'         => 'New Admin',
            'email'        => 'newadmin@workshop.com',
            'password'     => 'secret123',
            'role'         => 'admin',
            'phone_number' => '08123456789',
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('data.email', 'newadmin@workshop.com')
            ->assertJsonPath('data.role', 'admin');

        // Customer route
        $this->getJson('/api/customers')
            ->assertStatus(200)
            ->assertJsonStructure(['status', 'message', 'data']);
    }
}
