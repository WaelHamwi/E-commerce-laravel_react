<?php

namespace App\Enums;

/**
 * PaymentStatus enum class.
 */
final class PaymentStatus
{
    const PENDING = 'pending';
    const PAID = 'paid';
    const COMPLETED = 'completed';

    /**
     * Get all possible payment status values.
     *
     * @return array
     */
    public static function all(): array
    {
        return [
            self::PENDING,
            self::PAID,
            self::COMPLETED,
        ];
    }

    /**
     * Check if a given status value is valid.
     *
     * @param string $status
     * @return bool
     */
    public static function isValid(string $status): bool
    {
        return in_array($status, self::all());
    }
}
