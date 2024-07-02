<?php

namespace App\Helpers;

use App\Models\CartItem;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
class Cart
{
    public static function getCartItemsCount()
    {
      $request=\request();
      $authorizationHeader = $request->header('Authorization');
        $token = null;

        if (Str::startsWith($authorizationHeader, 'Bearer ')) {
            $token = Str::substr($authorizationHeader, 7);
        }

        $user = $token ? Auth::guard('api')->authenticate($token) : null;
        if ($user) {
            return CartItem::where('user_id', $user->id)->sum('quantity');
        } else {
            $cartItems = self::getCookieCartItems();
            return array_reduce(
                $cartItems,
                fn($carry, $item) => $carry + $item['quantity'],
                0
            );
        }
    }

    public static function getCartItems()
    {
        $request=\request();
        $authorizationHeader = $request->header('Authorization');
          $token = null;

          if (Str::startsWith($authorizationHeader, 'Bearer ')) {
              $token = Str::substr($authorizationHeader, 7);
          }

          $user = $token ? Auth::guard('api')->authenticate($token) : null;
        if ($user) {
            return CartItem::where('user_id', $user->id)
                ->get()
                ->map(function ($item) {
                    return [
                        'product_id' => $item->product_id,
                        'quantity' => $item->quantity,
                    ];
                });
        } else {
            return self::getCookieCartItems();
        }
    }

    public static function moveCartItemsIntoDatabase($cartItems)
    {
        $request = \request();
        $authorizationHeader = $request->header('Authorization');
          $token = null;

          if (Str::startsWith($authorizationHeader, 'Bearer ')) {
              $token = Str::substr($authorizationHeader, 7);
          }

          $user = $token ? Auth::guard('api')->authenticate($token) : null;

  if ($user) {
      \Log::info('User authenticated', ['user' => $user->toArray()]);
      foreach ($cartItems as $cartItem) {
          $existingCartItem = CartItem::where('user_id', $user->id)
              ->where('product_id', $cartItem['product_id'])
              ->first();

          if ($existingCartItem) {
              $existingCartItem->quantity += $cartItem['quantity'];
              $existingCartItem->save();
          } else {
              CartItem::create([
                  'user_id' => $user->id,
                  'product_id' => $cartItem['product_id'],
                  'quantity' => $cartItem['quantity']
              ]);
          }
      }
          } else {
              \Log::info('User not authenticated');
          }

          if ($cartItems !== null) {
              \Log::info('Cart items', ['cartItems' => $cartItems]);
          } else {
              \Log::info('No cart items found');
          }
    }

    public static function getCookieCartItems()
    {
        $request=\request();
        $cartItems = Cookie::get('cart_items', '[]');
        return json_decode($cartItems, true);
    }
    public static function getCountFromItems($cartItems)
    {
        return array_reduce(
          $cartItems,
          fn($carry, $item) => $carry + $item['quantity'],
          0
        );
    }

    public static function setCookieCartItems($cartItems)
   {
       $encodedCartItems = json_encode($cartItems);
       Cookie::queue('cart_items', $encodedCartItems, 60 * 24 * 7);
   }

}
