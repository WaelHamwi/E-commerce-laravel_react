<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;

class AdminGuard{
  public function handle(Request $request, Closure $next)
  {
      $user = Auth::guard('api')->user();

      if ($user && ($user->role === '1')) {
          return $next($request);
      } else {
          return new Response('Forbidden', 403);
      }
  }
}
