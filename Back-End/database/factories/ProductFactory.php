<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ProductFactory extends Factory
{
    use HasFactory;

    public function definition()
    {
        return [
            'category' =>$this->faker->numberBetween(1, 80),
            'title' => $this->faker->word,
            'description' => $this->faker->paragraph,
            'price' => $this->faker->numberBetween(100,1000),
            'discount' => $this->faker->numberBetween(10,100),
            'average_rating' => $this->faker->numberBetween(1,3),
            'status' => 'published',
        ];
    }
}
