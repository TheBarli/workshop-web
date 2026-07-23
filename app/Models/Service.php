<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'name',
        'category',
        'price',
        'estimated_minutes',
        'stock',
        'description',
    ];

    protected $casts = [
        'price' => 'decimal:2',
    ];
}