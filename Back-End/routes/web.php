<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\GoogleAuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CartController;


/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});
Route::get('/google-auth/redirect', [GoogleAuthController::class, 'redirect'])->name("google.redirect");//btn
Route::get('/google-auth/callback', [GoogleAuthController::class, 'callback'])->name("google.callback");
Route::get('/user', [UserController::class, 'authenticatedUser'])->name("AuthUser");
Route::post('/webhook/stripe', [CartController::class, 'success'])->name('webhook.success');
//Route::post('/login', [AuthController::class, 'login'])->name('login');
