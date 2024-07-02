<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Product;
use App\Models\CartItem;
use App\Models\order;
use App\Models\payment;
use App\Models\OrderItem;
use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use Illuminate\Support\Facades\Auth;
use App\Helpers\Cart;
use Illuminate\Support\Facades\Log;
use Stripe\Exception\ApiErrorException;
use Illuminate\Support\Str;
use Stripe\StripeClient;
use Stripe\Webhook;
use Stripe\Exception\SignatureVerificationException;

class CartController extends Controller
{
    public function index(Request $request)
    {
      $authorizationHeader = $request->header('Authorization');
        $token = null;

        if (Str::startsWith($authorizationHeader, 'Bearer ')) {
            $token = Str::substr($authorizationHeader, 7);
        }

        $user = $token ? Auth::guard('api')->authenticate($token) : null;

        if ($user) {
            $userId = $user->id;
            $cartItems = CartItem::where('user_id', $userId)->get();
        } else {
            $cartItems = $request->has('cart_items') ? $request->input('cart_items') : [];
        }

        $productIds = collect($cartItems)->pluck('product_id')->all();
        $products = Product::whereIn('id', $productIds)->with('images')->get();

        $total = 0;
        foreach ($cartItems as $item) {
            $product = $products->where('id', $item['product_id'])->first();
            if ($product) {
                $subtotal = $product->price * $item['quantity'];
                $total += $subtotal;
            }
        }

        $responseData = [
            'cart_items' => $cartItems,
            'products' => $products,
            'total' => $total
        ];

        return response()->json($responseData);
    }

    public function add(Request $request, Product $product)
    {
        try {
            $request->validate([
                'quantity' => 'required|integer|min:1',
            ]);

            $quantity = $request->input('quantity');
            $productId = $request->input('product.id');
            $productPrice = $product->price;
            $cartItems = $request->has('cart_items') ? $request->input('cart_items') : null;

            $price = $request->input('price');
            $authorizationHeader = $request->header('Authorization');
              $token = null;

              if (Str::startsWith($authorizationHeader, 'Bearer ')) {
                  $token = Str::substr($authorizationHeader, 7);
              }

              $user = $token ? Auth::guard('api')->authenticate($token) : null;

            if ($user) {
                $existingCartItem = $user->cartItems()->where('product_id', $productId)->first();

                if ($existingCartItem) {
                    $existingCartItem->quantity += $quantity;
                    $existingCartItem->save();
                } else {
                    $user->cartItems()->create([
                        'user_id' => $user->id,
                        'product_id' => $productId,
                        'quantity' => $quantity,
                        'price' => $price,
                    ]);
                }

                $count = $user->cartItems()->sum('quantity');
                return response(['count' => $count]);
            } else {
                $productFound = false;

                foreach ($cartItems as &$item) {
                    if ($item['product_id'] === $productId) {
                        $item['quantity'] += $quantity;
                        $item['price'] += $price;
                        $productFound = true;
                        break;
                    }
                }

                if (!$productFound) {
                    $cartItems[] = [
                        'product_id' => $productId,
                        'quantity' => $quantity,
                        'price' => $price,
                    ];
                }

                $responseData = [
                    'count' => Cart::getCountFromItems($cartItems),
                    'cart_items' => $cartItems,
                ];

                return response()->json($responseData);
            }
        } catch (\Exception $e) {
            return response(['error' => 'An error occurred while processing the request.'], 500);
        }
    }

    public function remove(Request $request)
    {
        Log::info('Request Details:', [
            'method' => $request->method(),
            'url' => $request->fullUrl(),
            'headers' => $request->headers->all(),
            'parameters' => $request->all(),
        ]);

        $request->validate([
            'product_id' => 'required|exists:products,id',
        ]);

        $productId = $request->input('product_id');
        $authorizationHeader = $request->header('Authorization');
          $token = null;

          if (Str::startsWith($authorizationHeader, 'Bearer ')) {
              $token = Str::substr($authorizationHeader, 7);
          }

          $user = $token ? Auth::guard('api')->authenticate($token) : null;

        if ($user) {
            CartItem::where('user_id', $user->id)
                ->where('product_id', $productId)
                ->delete();
            $count = $user->cartItems()->sum('quantity');
            return response(['count' => $count]);
        } else {
            $cartItems = $request->has('cart_items') ? $request->input('cart_items') : null;
            foreach ($cartItems as $key => $item) {
                if ($item['product_id'] === $productId) {
                    unset($cartItems[$key]);
                    break;
                }
            }

            $responseData = [
                'count' => Cart::getCountFromItems($cartItems),
                'cart_items' => $cartItems,
            ];

            return response()->json($responseData);
        }
    }

    public function updateQuantity(Request $request, Product $product)
    {
        \Log::info('pro info', [
            'parameters' => $request->all(),
        ]);

        $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        $quantity = $request->input('quantity');
        $productId = $request->input('productId');
        $authorizationHeader = $request->header('Authorization');
          $token = null;

          if (Str::startsWith($authorizationHeader, 'Bearer ')) {
              $token = Str::substr($authorizationHeader, 7);
          }

          $user = $token ? Auth::guard('api')->authenticate($token) : null;
        if ($user) {
            $cartItem = CartItem::where('user_id', $user->id)
                ->where('product_id', $productId)
                ->first();

            if ($cartItem) {
                $cartItem->quantity = $quantity;
                $cartItem->save();

                $count = $user->cartItems()->sum('quantity');
                return response(['count' => $count]);
            } else {
                return response()->json(['error' => 'Cart item not found for the user'], 404);
            }
        }
    }

    public function getCartItemsCount()
    {
        $count = Cart::getCartItemsCount();
        return response()->json(['count' => $count]);
    }

    public function moveCartItemsIntoDatabase(Request $request)
    {
        $cartItems = $request->has('cart_items') ? $request->input('cart_items') : null;
        Cart::moveCartItemsIntoDatabase($cartItems);
        return response()->json(['message' => 'Cart items moved successfully.']);
    }
/*======================================================check out method starts===================================================================================*/
public function checkout(Request $request)
{
    try {
      $authorizationHeader = $request->header('Authorization');
        $token = null;

        if (Str::startsWith($authorizationHeader, 'Bearer ')) {
            $token = Str::substr($authorizationHeader, 7);
        }

        $user = $token ? Auth::guard('api')->authenticate($token) : null;
        $cartItems = Cart::getCartItems();
        $productIds = collect($cartItems)->pluck('product_id')->all();
        $products = Product::whereIn('id', $productIds)->with('images')->get();
        $cartItemsCollection = collect($cartItems)->keyBy('product_id');

        $lineItems = [];
        $amount = 0;
        $orderItems = [];

        foreach ($products as $product) {
            $cartItem = $cartItemsCollection->get($product->id);
            if ($cartItem) {
                $quantity = $cartItem['quantity'];
                $amount += $product->price * $quantity;

                $images = [];
                foreach ($product->images as $image) {
                    $images[] = $image->image;
                }

                $lineItems[] = [
                    'price_data' => [
                        'currency' => 'usd',
                        'product_data' => [
                            'name' => $product->title,
                            'images' => $images,
                        ],
                        'unit_amount' => $product->price * 100,
                    ],
                    'quantity' => $quantity,
                ];

                $orderItems[] = [
                    'product_id' => $product->id,
                    'quantity' => $quantity,
                    'unit_price' => $product->price
                ];
            }
        }

        $existingOrder = Order::where('created_by', $user->id)
                              ->where('status', OrderStatus::UNPAID)
                              ->where('total_price', $amount)
                              ->first();

        if ($existingOrder) {
            $order = $existingOrder;
        } else {
            $orderData = [
                'total_price' => $amount,
                'status' => OrderStatus::UNPAID,
                'created_by' => $user->id,
                'updated_by' => $user->id,
            ];

            $order = Order::create($orderData);

            foreach ($orderItems as $orderItem) {
                $orderItem['order_id'] = $order->id;
                OrderItem::create($orderItem);
            }
        }

        $existingPayment = Payment::where('order_id', $order->id)
                                  ->where('status', PaymentStatus::PENDING)
                                  ->first();

        if ($existingPayment) {
            $payment = $existingPayment;
            $session_id = $payment->session_id;

            $stripe = new \Stripe\StripeClient(config('services.stripe.secret'));
            $session = $stripe->checkout->sessions->retrieve($session_id);
        } else {
            $stripe = new \Stripe\StripeClient(config('services.stripe.secret'));
            $session = $stripe->checkout->sessions->create([
                'payment_method_types' => ['card'],
                'line_items' => $lineItems,
                'payment_intent_data' => [
                    'metadata' => [
                        'integration_check' => 'accept_a_payment',
                    ],
                ],
                'mode' => 'payment',
                'success_url' => route('checkout.success') . '?session_id={CHECKOUT_SESSION_ID}',
                'cancel_url' => route('checkout.cancel'),
                'client_reference_id' => $user->id,
            ]);

            $paymentData = [
                'order_id' => $order->id,
                'session_id' => $session->id,
                'amount' => $amount,
                'status' => PaymentStatus::PENDING,
                'type' => 'cc',
                'created_by' => $user->id,
                'updated_by' => $user->id,
            ];

            $payment = Payment::create($paymentData);
        }

        Log::info('Stripe Session Details:', [
            'session_id' => $session->id,
            'session' => $session,
            'order' => $order,
            'payment' => $payment,
        ]);



        $successSign = session('success_sign', true);

        return response()->json([
            'url' => $session->url,
          'success_sign' => $successSign,

        ]);
    } catch (\Stripe\Exception\ApiErrorException $e) {
        Log::error('Stripe Session Creation Error:', ['error' => $e->getMessage()]);
        return response()->json(['error' => 'An error occurred during checkout. Please try again.'], 500);
    } catch (\Exception $e) {
        Log::error('Checkout Error:', ['error' => $e->getMessage()]);
        return response()->json(['error' => 'An unexpected error occurred. Please try again.'], 500);
    }
}


/*========================================create payment for one orderItem===========================================*/
public function checkoutSingleItem(Request $request, $orderId)
{
    try {
      $authorizationHeader = $request->header('Authorization');
        $token = null;

        if (Str::startsWith($authorizationHeader, 'Bearer ')) {
            $token = Str::substr($authorizationHeader, 7);
        }

        $user = $token ? Auth::guard('api')->authenticate($token) : null;

        // Retrieve all OrderItems related to the $orderId
        $orderItems = OrderItem::where('order_id', $orderId)->get();
        $totalAmount = 0;
        $lineItems = [];

        foreach ($orderItems as $orderItem) {
            // Fetch associated Product for each OrderItem
            $product = Product::with('images')->findOrFail($orderItem->product_id);
            $amount = $orderItem->quantity * $product->price;
            $totalAmount += $amount; // Accumulate total amount

            $images = [];
            foreach ($product->images as $image) {
                $images[] = $image->image;
            }

            $lineItems[] = [
                'price_data' => [
                    'currency' => 'usd',
                    'product_data' => [
                        'name' => $product->title,
                        'images' => $images,
                    ],
                    'unit_amount' => $product->price * 100,
                ],
                'quantity' => $orderItem->quantity,
            ];
        }

        // Create the Stripe Checkout session
        $stripe = new \Stripe\StripeClient(config('services.stripe.secret'));
        $session = $stripe->checkout->sessions->create([
            'payment_method_types' => ['card'],
            'line_items' => $lineItems,
            'payment_intent_data' => [
                'metadata' => [
                    'integration_check' => 'accept_a_payment',
                ],
            ],
            'mode' => 'payment',
            'success_url' => route('checkout.success') . '?session_id={CHECKOUT_SESSION_ID}',
            'cancel_url' => route('checkout.cancel'),
            'client_reference_id' => $user->id,
        ]);

        // Find the payment associated with the order
        $payment = Payment::where('order_id', $orderId)->first();

        if (!$payment) {
            Log::error('Payment not found for order_id: ' . $orderId);
            return response()->json(['error' => 'Payment not found for order.'], 404);
        }

        // Update the payment record with the session ID
        $payment->update(['session_id' => $session->id]);

        // Log the created session ID
        Log::info('Stripe Session Created:', ['session_id' => $session->id]);

        return response()->json(['url' => $session->url]);
    } catch (\Stripe\Exception\ApiErrorException $e) {
        Log::error('Stripe Session Creation Error:', ['error' => $e->getMessage()]);
        return response()->json(['error' => 'An error occurred during checkout. Please try again.'], 500);
    } catch (\Exception $e) {
        Log::error('Checkout Error:', ['error' => $e->getMessage()]);
        return response()->json(['error' => 'An unexpected error occurred. Please try again.'], 500);
    }
}

  public function success(Request $request)
  {

      $sessionId = $request->query('session_id');
      if (!$sessionId) {
          Log::error('Missing session_id in success endpoint query parameters.');
          abort(404);
      }

      try {
          // Retrieve session details from Stripe using the session ID
          $stripe = new \Stripe\StripeClient(config('services.stripe.secret'));
          $session = $stripe->checkout->sessions->retrieve($sessionId, []);

          // Log session details
          Log::info('Stripe Session Details:', ['session_id' => $session->id, 'session' => $session]);

          // Check and update payment status
          $payment = Payment::where('session_id', $sessionId)
                      ->where('status', PaymentStatus::PENDING)
                      ->first();
          if (!$payment || $payment->status !== PaymentStatus::PENDING) {
              Log::error('Payment not found or status is not pending.');
              return view('checkout.cancel')->with('error', 'Payment not found or status is not pending.');
          }

          // Update payment status to PAID
          $payment->update(['status' => PaymentStatus::PAID]);

          // Find and update associated order status to PAID
          $order = Order::find($payment->order_id);
          if (!$order) {
              Log::error('Associated order not found for payment.');
              return view('checkout.cancel')->with('error', 'Associated order not found for payment.');
          }
          $order->update(['status' => OrderStatus::PAID]);

          $userId = isset($session->client_reference_id) ? (int) $session->client_reference_id : null;
                 if (!$userId) {
                     Log::error('User ID not found in session client_reference_id.');
                     return view('checkout.cancel')->with('error', 'User ID not found in session client_reference_id.');
                 }
      $deleted = CartItem::where('user_id', $userId)->delete();

      session(['success_sign' => true]);

          // Render success view with session details
          return view('checkout.success', [
              'sessionId' => $session->id,
              'amount_total' => $session->amount_total / 100, // Amount in cents to dollars
              'currency' => strtoupper($session->currency),
              'customer_name' => $session->customer_details->name,
              'customer_email' => $session->customer_details->email,
              'payment_status' => $session->payment_status,
              'created_at' => \Carbon\Carbon::createFromTimestamp($session->created)->toDateTimeString()
          ]);
      } catch (\Stripe\Exception\ApiErrorException $e) {
          Log::error('Stripe API Error:', ['error' => $e->getMessage()]);
          return view('checkout.cancel')->with('error', 'An error occurred during payment processing. Please try again.');
      } catch (\Exception $e) {
          Log::error('Unexpected Error:', ['error' => $e->getMessage()]);
          return view('checkout.cancel')->with('error', 'An unexpected error occurred. Please try again later.');
      }
  }
  public function webhook(Request $request)
  {
      $payload = $request->getContent();
      $sigHeader = $request->header('Stripe-Signature');
      $webhookSecret = config('services.stripe.webhook_secret');

      Log::info('Received webhook', ['payload' => $payload, 'sigHeader' => $sigHeader]); // Log raw payload and signature header

      try {
          $event = \Stripe\Webhook::constructEvent(
              $payload, $sigHeader, $webhookSecret
          );
      } catch (\Exception $e) {
          Log::error('Webhook error', ['error' => $e->getMessage()]);
          return response()->json(['error' => 'Webhook signature verification failed'], 400);
      }

      // Handle the event
      switch ($event->type) {
          case 'payment_intent.succeeded':
              $paymentIntent = $event->data->object; // Contains a Stripe payment intent object
              Log::info('Payment intent succeeded', ['payment_intent' => $paymentIntent]);
              // Handle the payment_intent.succeeded event
              break;
          case 'payment_intent.failed':
              $paymentIntent = $event->data->object; // Contains a Stripe payment intent object
              Log::warning('Payment intent failed', ['payment_intent' => $paymentIntent]);
              // Handle the payment_intent.failed event
              break;
          // Add additional event types as needed
          default:
              Log::info('Received unknown event type', ['type' => $event->type]);
      }

      return response()->json(['status' => 'success']);
  }


  }
