<?php

namespace App\Http\Controllers;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    /*====================================get all categories========================================*/
    public function index(Request $request)
    {

      $allCategories=Category::all();
      $Categories=Category::paginate($request->input('limitDataShow', 10));
      $finalQuery=$request->input('limitDataShow')? $Categories:$allCategories;
      return $finalQuery;
    }

    /*=============================get category by id========================================*/
    public function showCategoryById($id)
    {
        return Category::findOrFail($id);
    }
    /*=============================get category by searchin========================================*/
    public function search(Request $request){
      $query=$request->input('title');
      $output=Category::where('title','like',"%$query%")->get();
      return response()->json($output);
    }

  /*=============================add category========================================*/
  public function addCategory(Request $request)
  {
      try {
          $request->validate([
              'title' => 'required',
              'image' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
          ]);

          $categoryData = [
              'title' => $request->title,
              'image' => null,
          ];

          if ($request->hasFile('image')) {
          $image = $request->file('image');
          $extension = $image->getClientOriginalExtension();
          $timestamp = time();
          $imageName = $timestamp . '.' . $extension;
          $image->move(public_path('images'), $imageName);

          $baseUrl = url('/'); 
          $imagePath = $baseUrl . '/images/' . $imageName;

          $categoryData['image'] = $imagePath;
      }



          $category = Category::create($categoryData);

          return response()->json(['message' => 'Category created successfully'], 200);
      } catch (ValidationException $e) {
          return response()->json(['errors' => $e->validator->errors()], 422);
      }
  }




      /*=============================edit category========================================*/
      public function editCategory(Request $request, $id)
  {
      try {
          $request->validate([
              'title' => 'required',
              'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
          ]);

          $category = Category::findOrFail($id);

          $category->title = $request->title;

          if ($request->hasFile('image')) {
              $image = $request->file('image');
              $imageName = time().'.'.$image->getClientOriginalExtension();
              $image->move(public_path('images'), $imageName);

              // Update the image path in the database
              $category->image = $imageName;
          }

          $category->save();

          return response()->json(['message' => 'Category updated successfully'], 200);
      } catch (ValidationException $e) {
          return response()->json(['errors' => $e->validator->errors()], 422);
      } catch (ModelNotFoundException $e) {
          return response()->json(['error' => 'Category not found'], 404);
      }
  }

    public function destroy($id)
    {
        return Category::findOrFail($id)->delete();
    }
}
