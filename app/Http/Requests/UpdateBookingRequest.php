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
            'status'             => ['nullable', 'in:pending,confirmed,in_progress,completed,cancelled'],
            'mechanic_id'        => ['nullable', 'exists:users,id'],
            'scheduled_at'       => ['nullable', 'date'],
            'complaint_notes'    => ['nullable', 'string', 'max:1000'],
            'mechanic_diagnosis' => ['nullable', 'string', 'max:1000'],
            'items'              => ['nullable', 'array'],
            'items.*.service_id' => ['required_with:items', 'exists:services,id'],
            'items.*.quantity'   => ['nullable', 'integer', 'min:1'],
        ];
    }
}
