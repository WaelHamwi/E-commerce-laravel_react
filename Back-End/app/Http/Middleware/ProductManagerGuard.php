<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;

class ProductManagerGuard
{
    public function handle(Request $request, Closure $next)
    {
        $user = Auth::guard('api')->user();

        if ($user && ($user->role === '1' || $user->role === '2' )) {
            return $next($request);
        } else {
            return new Response('Forbidden', 403);
        }
    }
}
