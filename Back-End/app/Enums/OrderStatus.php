<?php

namespace App\Enums;

class OrderStatus
{
    const UNPAID = 'unpaid';
    const PAID = 'paid';
    const CANCELLED='cancelled';
    const SHIPPED='shipped';
    const COMPLETED='completed';
    const FAILED = 'failed';

    /**
     * Get all possible order status values.
     *
     * @return array
     */
    public static function all(): array
    {
        return [
            self::UNPAID,
            self::PAID,
            self::CANCELLED,
            self::SHIPPED,
            self::COMPLETED,
            self::FAILED,
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
