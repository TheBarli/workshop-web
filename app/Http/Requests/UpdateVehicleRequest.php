<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateVehicleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'brand' => ['required', 'string', 'max:50'],
            'model' => ['required', 'string', 'max:50'],
            'year'  => ['nullable', 'integer', 'digits:4', 'min:1900', 'max:' . date('Y')],
            'color' => ['nullable', 'string', 'max:30'],
        ];
    }
}
