<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Eloquent\Factories\HasFactory;
/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
      return [
        'name' => $this->faker->name(),
        'email' => 't@t.t',
        'email_verified_at' => now(),
        'role' => '1',
        'password' => Hash::make('t'),
        'remember_token' => Str::random(10),
];
    }

    /**
     * Attach a token to the user after creation.
     *
     * @return $this
     */
    public function withToken(): static
    {
        return $this->afterCreating(function ($user) {
           $user->createToken('token')->accessToken;
        });
    }

    /**
     * Indicate that the model's email address should be unverified.
     *
     * @return $this
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}
