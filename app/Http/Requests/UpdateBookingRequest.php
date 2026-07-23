<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateBookingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'status'      => ['required', 'in:pending,confirmed,in_progress,completed,cancelled'],
            'mechanic_id' => ['nullable', 'exists:users,id'],
        ];
    }
}
