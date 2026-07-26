<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreVehicleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'user_id'       => ['nullable', 'exists:users,id'],
            'license_plate' => ['required', 'string', 'max:15', 'unique:vehicles,license_plate'],
            'brand'         => ['required', 'string', 'max:50'],
            'model'         => ['required', 'string', 'max:50'],
            'year'          => ['nullable', 'integer', 'digits:4', 'min:1900', 'max:' . date('Y')],
            'color'         => ['nullable', 'string', 'max:30'],
        ];
    }
}
