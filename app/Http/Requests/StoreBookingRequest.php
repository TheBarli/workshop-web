<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreBookingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'customer_id'       => ['nullable', 'exists:users,id'],
            'vehicle_id'        => ['required', 'exists:vehicles,id'],
            'scheduled_at'      => ['required', 'date'],
            'complaint_notes'   => ['nullable', 'string', 'max:1000'],
            'service_ids'       => ['nullable', 'array'],
            'service_ids.*'     => ['exists:services,id'],
            'items'             => ['nullable', 'array'],
            'items.*.service_id'=> ['required_with:items', 'exists:services,id'],
            'items.*.quantity'  => ['nullable', 'integer', 'min:1'],
        ];
    }
}
