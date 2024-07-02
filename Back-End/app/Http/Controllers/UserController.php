<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    /*====================================get all users========================================*/
    public function index(Request $request)
    {
        return User::paginate($request->input('limitDataShow', 10));
    }

    /*=============================get the auth user==========================================*/
    public function authenticatedUser()
    {
        $user = Auth::user();
        if ($user) {
            return response()->json($user);
        } else {
            return response()->json([], 401);
        }
    }

    /*=============================get user by id========================================*/
    public function showUserById($id)
    {
        return User::findOrFail($id);
    }

    /*=============================get user by searching========================================*/
    public function search(Request $request){
      $query=$request->input('title');
      $output=User::where('name','like',"%$query%")->get();
        return response()->json($output);
    }

    /*=============================edit user========================================*/
    public function editUser(Request $request, $id)
  {
      try {
          $request->validate([
              'name' => 'required',
              'email' => [
                  'required',
                  'email',
                  Rule::unique('users')->ignore($id),
              ],
              'role' => 'required',
              'password' => [
                  'nullable',
                  'string',
                  'min:1',
                  function ($attribute, $value, $fail) use ($id) { //find the id of the user to get the pass from the db
                      $user = User::findOrFail($id);
                      if (!Hash::check($value, $user->password)) {
                          $fail('The current password is incorrect.');
                      }
                  },
              ],
              'new_password' => [
                  'nullable',
                  'string',
                  'min:1',
                  'different:password',
              ],
              'password_confirmation' => 'nullable|string|min:1|same:new_password',
          ]);

          $user = User::findOrFail($id);
          $user->name = $request->name;
          $user->email = $request->email;
          $user->role = $request->role;

          if ($request->filled('new_password')) {
              $user->password = Hash::make($request->new_password);
          }

          $user->save();

          return response()->json(['message' => 'User updated successfully'], 200);
      } catch (ValidationException $e) {
          return response()->json(['errors' => $e->validator->errors()], 422);
      }
  }


  /*=============================add user========================================*/
  public function addUser(Request $request)
  {
      try {
          $request->validate([
              'name' => 'required',
              'email' => 'required|email|unique:users,email',
              'role' => 'required',
              'password' => [
                  'required',
                  'string',
                  'min:1',
              ],
              'password_confirmation' => 'required|string|min:1|same:password',
          ]);

          $user = User::create([
              'name' => $request->name,
              'email' => $request->email,
              'role' => $request->role,
              'password' => bcrypt($request->password),
          ]);

          return response()->json(['message' => 'User created successfully'], 200);
      } catch (ValidationException $e) {
          return response()->json(['errors' => $e->validator->errors()], 422);
      }
  }

    public function destroy($id)
    {
        return User::findOrFail($id)->delete();
    }
}
