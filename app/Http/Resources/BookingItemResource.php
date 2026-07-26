<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BookingItemResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'         => $this->id,
            'booking_id' => $this->booking_id,
            'service_id' => $this->service_id,
            'quantity'   => $this->quantity,
            'price'      => (float) $this->price,
            'subtotal'   => (float) $this->subtotal,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
            'service'    => new ServiceResource($this->whenLoaded('service')),
        ];
    }
}
