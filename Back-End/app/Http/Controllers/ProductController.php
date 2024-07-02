<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\models\Product;
use App\Models\ProductImage;
use Illuminate\Support\Facades\DB;
class ProductController extends Controller
{
  public function index(Request $request){
      return Product::with("images")->where("status","=","published")->paginate($request->input('limitDataShow', 10));
}
public function products($id){
    return Product::with("images")->where('category',$id)->get();
}

    public function addProduct(Request $request)
    {
        $request->validate([
            'category' => 'nullable|exists:categories,id',
            'title' => 'required|string',
            'description' => 'required|string',
            'price' => 'required|numeric',
            'discount' => 'nullable|numeric',
            'created_by' => 'nullable|exists:users,id',
            'updated_by' => 'nullable|exists:users,id',
        ]);
        $user = $request->user();
        $product = Product::create([
            'category' => $request->input('category'),
            'title' => $request->input('title'),
            'description' => $request->input('description'),
            'about' => $request->input('about'),
            'price' => $request->input('price'),
            'discount' => $request->input('discount'),
            'created_by' => $user->id,
            'updated_by' => $user->id,
        ]);
        return $product;
      }



  public function showProductById($id){
      return Product::where('id',$id)->with("images")->get();
  }
public function showLatestSaleProducts(){
  return Product::with("images")
      ->where("status", "=", "published")
      ->where("discount", ">", "0")
      ->latest()
      ->take(8)
      ->get();
}
public function showLatestProducts(){
  return Product::with("images")->where("status","=","published")->latest()
    ->take(8)
    ->get();
}
public function showTopRatedProducts() {
    return Product::with("images")
                  ->where("status", "published")
                  ->where("average_rating", ">=", 3)->take(8)
                  ->get();
}

  /*=============================get product by searchin========================================*/
  public function search(Request $request){
    $query=$request->input('title');
    $output=Product::with("images")->where('title','like',"%$query%")->get();
      return response()->json($output);
  }

  public function editProduct(Request $request, $id)
  {
      try {
        $request->validate([
      'category' => 'required|exists:categories,id',
      'title' => 'required|string',
      'description' => 'required|string',
         'price' => ['required', 'numeric', 'regex:/^\d{1,8}(\.\d{1,2})?$/'],
         'discount' => ['required', 'numeric', 'regex:/^\d{1,8}(\.\d{1,2})?$/', 'lte:price'],
  ], [
      'discount.regex' => 'The discount value must be less than 9 digits numbers and 2 after comma',
      'price.regex' => 'The price value must be less than 9 digits numbers and 2 after comma',
        'discount.lte' => 'The discount must be less than or equal to the price',
  ]
);


          $product = Product::findOrFail($id);
            $user = $request->user();
          $product->update([
              'category' => $request->input('category'),
              'title' => $request->input('title'),
              'description' => $request->input('description'),
              'about' => $request->input('about'),
              'price' => $request->input('price'),
              'discount' => $request->input('discount'),
              'updated_by' => $user->id,
          ]);

          $product->status = 'published';
          $product->save();

          return response()->json(['message' => 'Product created successfully'], 200);
      } catch (ValidationException $e) {
          return response()->json(['errors' => $e->validator->errors()], 422);
      }
  }

  public function destroy($id)
 {
     DB::beginTransaction();

     try {
         $product = Product::findOrFail($id);

         $associatedImages = ProductImage::where('product_id', $id)->get();
        if($associatedImages){
          foreach ($associatedImages as $image) {
              $image->delete();
          }
        }


         $product->delete();

         DB::commit();

         return response()->json(['message' => 'Product and associated images deleted successfully']);
     } catch (\Exception $e) {
         DB::rollBack();

         return response()->json(['message' => 'Failed to delete product and associated images'], 500);
     }
 }
}
