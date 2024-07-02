<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\ProductImage;
use App\Models\Product;
use App\Models\Category;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
class OrderController extends Controller
{
        /*=============================get all orders for admins and customized orders for users  ========================================*/
        public function index(Request $request)
    {
        $user = $request->user();
        $limitDataShow = $request->input('limitDataShow', 10);

        $query = Order::query();

        if ($user->role !== '1') {
            $query->where('created_by', $user->id);
        }

        $orders = $query->with('user')->paginate($limitDataShow);

        // Transform the orders while preserving pagination metadata
        $orders->getCollection()->transform(function ($order) {
            $order->created_by = $order->user->name;
            unset($order->user);
            return $order;
        });

        return response()->json([
            'orders' => $orders->items(),
            'current_page' => $orders->currentPage(),
            'last_page' => $orders->lastPage(),
            'per_page' => $orders->perPage(),
            'total' => $orders->total(),
        ]);
    }

    /*=============================get orders details and products ========================================*/
    public function OrdersDetails(Request $request) {
      $latestOrders = Order::latest()->take(8)->get();

      // Fetch user names for each order's created_by field
      foreach ($latestOrders as $order) {
          $userName = User::where('id', $order->created_by)->value('name');
          $order->user_name = $userName;
          unset($order->created_by);
      }

      $totalOrderPrices = Order::sum('total_price');
      $orderItemsQuantity=orderItem::sum('quantity');
      $latestUpdatedOrder = Order::orderBy('updated_at', 'desc')->first();
      $ordersNumber = Order::count();
      $ordersUnpaid = Order::where('status', 'unpaid')->count();
      $ordersPaid = Order::where('status', 'paid')->count();
      $productsNumber = Product::count();
      $categoriesNumber = Category::count();
      $usersNumber = User::count();

      $response = [
          'latestOrders' => $latestOrders,
          'totalOrderPrices' => $totalOrderPrices,
          'latestUpdatedOrder' => $latestUpdatedOrder,
          'ordersNumber' => $ordersNumber,
          'ordersUnpaid' => $ordersUnpaid,
          'ordersPaid' => $ordersPaid,
          'productsNumber' => $productsNumber,
          'categoriesNumber' => $categoriesNumber,
          'usersNumber' => $usersNumber,
          'orderItemsQuantity'=>$orderItemsQuantity
      ];

      return response()->json($response);
  }



    /*=============================get orderItem ========================================*/
    public function view($id)
  {
      $order = Order::find($id);

      if (!$order) {
          return response()->json(['error' => 'Order not found'], 404);
      }

      $orderItems = OrderItem::where('order_id', $id)->get();

      // Prepare the response data with images
      $formattedOrderItems = [];

      foreach ($orderItems as $item) {
          $productImages = ProductImage::where('product_id', $item->product_id)->get();
          $imageUrls = $productImages->pluck('image')->toArray();
          \Log::info('Image URLs for OrderItem ' . $item->id . ': ' . json_encode($imageUrls));

          $formattedOrderItems[] = [
              'id' => $item->id,
              'product_id' => $item->product_id,
              'quantity' => $item->quantity,
              'images' => $imageUrls,
              'created_at' => $item->created_at,
              'unit_price' => $item->unit_price
          ];
      }

      // Log formatted order items for debugging
      \Log::info('Formatted Order Items: ' . json_encode($formattedOrderItems));

      return response()->json(['orderItems' => $formattedOrderItems]);
  }






    /*=============================get order by searching========================================*/
    public function search(Request $request){
      $query=$request->input('title');
      $output=Order::where('status','like',"%$query%")->get();
        return response()->json($output);
    }

    /*=============================get countries that have orders========================================*/

    public function getOrdersByCountry()
        {
            // Fetch the number of orders for each country
            $ordersByCountry = DB::table('orders')
                ->join('customers', 'orders.created_by', '=', 'customers.created_by')
                ->join('customer_addresses', 'customers.id', '=', 'customer_addresses.customer_id')
                ->join('countries', 'customer_addresses.country_id', '=', 'countries.id')
                ->select('countries.name as country', DB::raw('count(orders.id) as order_count'))
                ->groupBy('countries.name')
                ->get();

            // Return the results as a JSON response
            return response()->json($ordersByCountry);
        }



    /*=============================delete an order========================================*/
    public function delete($id)
    {
        return Order::findOrFail($id)->delete();
    }


}
