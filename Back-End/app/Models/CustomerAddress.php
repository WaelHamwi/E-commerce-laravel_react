<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CustomerAddress extends Model
{
    use HasFactory;

    protected $fillable = [
        'customer_id',
        'type',
        'address1',
        'address2',
        'city',
        'state',
        'zipcode',
        'country_id',
    ];

      public function country()
        {
            return $this->belongsTo(Country::class, 'country_id');
        }
        public function customer()
      {
          return $this->belongsTo(Customer::class, 'customer_id');
      }
}
