<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProductImageController;
use App\Http\Controllers\GoogleAuthController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\CustomerController;

// Apply CorsMiddleware to all API routes
Route::middleware([\App\Http\Middleware\CorsMiddleware::class])->group(function () {

    // Authentication routes
    Route::controller(AuthController::class)->group(function () {
        Route::post('/register', 'register');
        Route::post('/login', 'login');
    });

    // Authenticated routes
    Route::middleware(['auth:api'])->group(function () {
        Route::get('/user', [UserController::class, 'authenticatedUser']);

        // AdminGuard middleware group
        Route::middleware(AdminGuard::class)->group(function () {
            Route::controller(UserController::class)->group(function () {
                Route::get('/users', 'index');
                Route::get('/user/{id}', 'showUserById');
                Route::post('/user/search','search');
                Route::post('/user/add', 'addUser');
                Route::post('/user/edit/{id}', 'editUser');
                Route::delete('/user/delete/{id}', 'destroy');
            });
        });

        // ProductManagerGuard middleware group
        Route::middleware(ProductManagerGuard::class)->group(function () {
            // Category routes
            Route::controller(CategoryController::class)->group(function () {
                Route::get('/category/{id}', 'showCategoryById');
                Route::post('/category/search', 'search');
                Route::post('/category/add', 'addCategory');
                Route::post('/category/edit/{id}', 'editCategory');
                Route::delete('/category/delete/{id}', 'destroy');
            });

            // Product routes
            Route::controller(ProductController::class)->group(function () {
                Route::get('/product/{id}', 'showProductById');
                Route::post('/product/search', 'search');
                Route::post('/product/add', 'addProduct');
                Route::post('/product/edit/{id}', 'editProduct');
                Route::delete('/product/delete/{id}', 'destroy');
            });

            // ProductImageController routes
            Route::controller(ProductImageController::class)->group(function () {
                Route::post('productImg/upload', 'store');
                Route::delete('productImg/delete/{id}', 'destroy');
            });
            // customer routes
              Route::get('/customers/index', [CustomerController::class, 'index'])->name('customers.index');
              Route::get('/customer/countries', [CustomerController::class, 'getCountries'])->name('customer.countries');
              Route::get('/customer/view/{id}', [CustomerController::class, 'view'])->name('customer.view');
              Route::get('/customer/showCustomer/{id}', [CustomerController::class, 'showCustomerById'])->name('customer.show');
              Route::post('/customer/states/{id}', [CustomerController::class, 'getStates'])->name('customers.states');
              Route::post('/customer/cities/{id}', [CustomerController::class, 'getCities'])->name('customers.cities');
              Route::post('/customer/add', [CustomerController::class, 'addCustomer'])->name('customers.add');
              Route::post('/customer/edit/{id}', [CustomerController::class, 'editUser'])->name('customers.edit');
              Route::post('/customer/search', [CustomerController::class, 'search'])->name('customer.search');
              Route::delete('/customer/delete/{id}', [CustomerController::class, 'destroy'])->name('customer.destroy');
              Route::get('/customer/customer-details', [CustomerController::class, 'getCustomersDetails'])->name('customer.getCustomersDetails');

            });

        // CartController routes
        Route::post('/cart/move-cart-items', [CartController::class, 'moveCartItemsIntoDatabase'])->name('moveCartItems');
        Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
        Route::post('/cart/add/product', [CartController::class, 'add'])->name('cart.add');
        Route::put('/cart/update-quantity/product', [CartController::class, 'updateQuantity'])->name('cart.updateQuantity');
        Route::delete('/cart/remove/product', [CartController::class, 'remove'])->name('cart.remove');
        Route::post('/checkout/process', [CartController::class, 'checkout'])->name('checkout.process');
        Route::post('/checkoutSingleItem/process/{id}', [CartController::class, 'checkoutSingleItem'])->name('checkoutSingleItem.process');


    // orderController routes
      Route::get('/orders', [OrderController::class, 'index'])->name('order.index');
      Route::post('/order/search', [OrderController::class, 'search'])->name('search.index');
      Route::delete('/order/delete/{id}', [OrderController::class, 'delete'])->name('order.delete');
      Route::get('/orders/view/{id}', [OrderController::class, 'view'])->name('order.view');
      Route::get('/orders/OrdersDetails', [OrderController::class, 'OrdersDetails'])->name('OrdersDetails');
      Route::get('/orders/countryOrders', [OrderController::class, 'getOrdersByCountry'])->name('getOrdersByCountry');

        // Logout route
        Route::get('/logout', [AuthController::class, 'logout']);
    });

    // GoogleAuthController routes
    Route::controller(GoogleAuthController::class)->group(function () {
        Route::get('/google-auth/redirect', 'redirect');
        Route::get('/google-auth/callback', 'callback');
    });

    // Public routes
    Route::controller(ProductController::class)->group(function () {
        Route::get('/products', 'index');
        Route::get('/latestSaleProducts', 'showLatestSaleProducts');
        Route::get('/latestProducts', 'showLatestProducts');
        Route::get('/topRatedProducts', 'showTopRatedProducts');
    });

    Route::controller(ProductController::class)->group(function () {
        Route::get('/products/{id}', 'index');
    });

    Route::controller(CategoryController::class)->group(function () {
        Route::get('/categories', 'index');
    });
      Route::controller(ProductController::class)->group(function () {
          Route::post('/product/search', 'search');
  });
    // Guest routes (for handling cookies)
    Route::controller(CartController::class)->prefix('cart')->group(function () {
        Route::post('/add/product', 'add')->name('cart.add');
        Route::get('/', 'index')->name('cart.index');
        Route::get('/checkout/success', 'success')->name('checkout.success');
        Route::get('/checkout/cancel',  'cancel')->name('checkout.cancel');

    });
    Route::post('/webhook/stripe', [CartController::class, 'webhook'])->name('webhook')->middleware('stripe.raw');

});
