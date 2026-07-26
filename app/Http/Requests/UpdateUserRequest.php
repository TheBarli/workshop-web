<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        $userId = $this->route('user') ? $this->route('user')->id : null;

        return [
            'name'         => ['nullable', 'string', 'max:255'],
            'email'        => ['nullable', 'string', 'email', 'max:255', 'unique:users,email,' . $userId],
            'password'     => ['nullable', 'string', 'min:6'],
            'phone_number' => ['nullable', 'string', 'max:20'],
            'address'      => ['nullable', 'string', 'max:500'],
            'role'         => ['nullable', 'in:customer,mechanic,admin,owner'],
            'status'       => ['nullable', 'in:active,inactive,suspended'],
        ];
    }
}
