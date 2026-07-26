<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VehicleResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'            => $this->id,
            'user_id'       => $this->user_id,
            'license_plate' => $this->license_plate,
            'brand'         => $this->brand,
            'model'         => $this->model,
            'year'          => $this->year,
            'color'         => $this->color,
            'created_at'    => $this->created_at?->toISOString(),
            'updated_at'    => $this->updated_at?->toISOString(),
            'owner'         => new UserResource($this->whenLoaded('owner')),
        ];
    }
}
