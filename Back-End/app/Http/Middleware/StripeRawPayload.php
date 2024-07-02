<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class StripeRawPayload
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        if ($request->is('webhooks-stripe')) {
            // Make sure we handle the raw body for the Stripe webhook
            $request->merge(['raw_body' => $request->getContent()]);
        }

        return $next($request);
    }
}
