<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\ProductImage;
use Illuminate\Database\Eloquent\Model;
use Database\Factories\ProductFactory;

class Product extends Model
{
   use HasFactory;
    protected $fillable = [
        'title',
        'description',
        'category',
        'price',
        'discount',
        'average_rating',
    ];

    public function Category()
    {
        return $this->belongsTo(Category::class);
    }

    public function Images()
    {
        return $this->hasMany(ProductImage::class);
    }
    public function cartItems()
  {
      return $this->hasMany(CartItem::class);
  }
  public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }
}
