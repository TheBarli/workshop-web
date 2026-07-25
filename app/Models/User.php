<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    /**
     * Mass assignable attributes matching database schema.
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'phone_number',
        'address',
        'role',
        'status',
    ];

    /**
     * Hidden fields for serialization.
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Type casting rules.
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // --- Role Helpers ---

    public function activeRole(): string
    {
        return $this->role;
    }

    public function isAdmin(): bool
    {
        return $this->activeRole() === 'admin';
    }

    public function isOwner(): bool
    {
        return $this->activeRole() === 'owner';
    }

    public function isMechanic(): bool
    {
        return $this->activeRole() === 'mechanic';
    }

    public function isCustomer(): bool
    {
        return $this->activeRole() === 'customer';
    }

    // --- Relationships ---

    public function vehicles()
    {
        return $this->hasMany(Vehicle::class);
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }
}