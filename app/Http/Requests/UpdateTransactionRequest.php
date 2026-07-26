<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTransactionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'payment_method' => ['nullable', 'string', 'max:30'],
            'payment_status' => ['nullable', 'in:unpaid,paid,refunded'],
            'total_amount'   => ['nullable', 'numeric', 'min:0'],
            'paid_at'        => ['nullable', 'date'],
        ];
    }
}
