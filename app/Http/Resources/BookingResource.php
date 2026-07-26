<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BookingResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'                 => $this->id,
            'booking_code'       => $this->booking_code,
            'customer_id'        => $this->customer_id,
            'vehicle_id'         => $this->vehicle_id,
            'mechanic_id'        => $this->mechanic_id,
            'scheduled_at'       => $this->scheduled_at,
            'status'             => $this->status,
            'complaint_notes'    => $this->complaint_notes,
            'mechanic_diagnosis' => $this->mechanic_diagnosis,
            'created_at'         => $this->created_at?->toISOString(),
            'updated_at'         => $this->updated_at?->toISOString(),
            'customer'           => new UserResource($this->whenLoaded('customer')),
            'vehicle'            => new VehicleResource($this->whenLoaded('vehicle')),
            'mechanic'           => new UserResource($this->whenLoaded('mechanic')),
            'items'              => BookingItemResource::collection($this->whenLoaded('items')),
            'transaction'        => new TransactionResource($this->whenLoaded('transaction')),
        ];
    }
}
