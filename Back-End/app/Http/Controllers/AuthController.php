<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
  public function register(Request $request)
{
    $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|string|email|unique:users|max:255',
        'password' => 'required|string|min:1',
        'password_confirmation' => 'required|string|min:1|same:password',
    ]);

    if ($request->password !== $request->password_confirmation) {
        return response()->json(['error' => 'The passwords do not match.'], 422);
    }

    $user = User::create([
        'name' => $request->name,
        'email' => $request->email,
        'password' => Hash::make($request->password),
    ]);

    $token = $user->createToken('token')->accessToken;

    return response()->json([
        'user' => $user,
        'token' => $token
    ], 200);
}


    public function login(Request $request){
    $credentials = $request->validate([
        'email' => 'required|string|email',
        'password' => 'required|string',
    ]);
    if(!auth()->attempt($credentials)){
        return response()->json(['message' => 'Unauthorized'], 401);
    }
      $user = $request->user();
      $token = $user->createToken('token')->accessToken;

    return response()->json(['user' => $user, 'token' => $token], 200);
}
  public function logout(Request $request){
  $request->user()->token()->revoke();
    return response()->json(["message"=>"successfully user logged out"]);
  }

}
