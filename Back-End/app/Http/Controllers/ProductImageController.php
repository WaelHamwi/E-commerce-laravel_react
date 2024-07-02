<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ProductImage;
class ProductImageController extends Controller
{
  public function store(Request $request)
 {
     $request->validate([
         'product_id' => 'required|exists:products,id',
         'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
     ]);
     $productImage=new productImage();
     if ($request->hasFile('image')) {
         $image = $request->file('image');
        $imageName = asset('images/' . time() . '_' . $image->getClientOriginalExtension());
         $image->move(public_path('images'), $imageName);
        $productImage->image = $imageName;
     }
     $productImage->product_id=$request->product_id;
     $productImage->save();
     return response()->json(['data' => $productImage], 201);
 }
 public function destroy($id){
     $productImage = ProductImage::findOrFail($id);
     $imagePath = public_path('images') . '.' . $productImage->image;
     if (file_exists($imagePath)) {
         unlink($imagePath);
     }
     $productImage->delete();
     return response()->json(['message' => 'Product image deleted successfully'], 200);
 }
}
