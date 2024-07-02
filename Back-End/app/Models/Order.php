<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'status',
        'total_price',
        'created_by',
        'updated_by',
    ];
    public function orderItem()
 {
     return $this->hasMany(OrderItem::class);
 }
 public function payment()
    {
        return $this->hasOne(Payment::class);
    }
      public function user()
  {
    return $this->belongsTo(User::class, 'created_by');
  }
}
