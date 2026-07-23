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
            'vehicle_id'      => ['required', 'exists:vehicles,id'],
            'scheduled_at'    => ['required', 'date', 'after:now'],
            'complaint_notes' => ['nullable', 'string', 'max:1000'],
            'service_ids'     => ['required', 'array', 'min:1'],
            'service_ids.*'   => ['exists:services,id'],
        ];
    }
}
