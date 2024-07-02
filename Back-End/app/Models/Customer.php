<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    use HasFactory;
    protected $fillable = [
      'id',
      'first_name',
      'last_name',
      'phone',
      'status',
      'created_by',
      'updated_by',
    ];
    public function user()
   {
       return $this->belongsTo(User::class);
   }
   public function customerAddresses()
      {
          return $this->hasOne(CustomerAddress::class, 'customer_id');
      }
}
