<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CategoryFactory extends Factory
{
    use HasFactory;


    public function definition()
    {
        return [
            'title' => $this->faker->unique()->word,
            'image' => $this->faker->imageUrl(640, 480),
            'description' => $this->faker->sentence(), 
        ];
    }
}
