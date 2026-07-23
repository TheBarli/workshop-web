<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreServiceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'code'              => ['required', 'string', 'max:50', 'unique:services,code'],
            'name'              => ['required', 'string', 'max:255'],
            'category'          => ['required', 'in:service,sparepart'],
            'price'             => ['required', 'numeric', 'min:0'],
            'stock'             => ['required', 'integer', 'min:0'],
            'estimated_minutes' => ['nullable', 'integer', 'min:0'],
            'description'       => ['nullable', 'string', 'max:1000'],
        ];
    }
}
