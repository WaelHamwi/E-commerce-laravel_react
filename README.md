# 🛒 E-Commerce Laravel & React Setup

# 🎯 Clone the Repository
echo "🚀 Cloning the repository..."
git clone https://github.com/yourusername/E-commerce-laravel_react.git
cd e-commerce-laravel-react

# 🖥️ Front-End Setup
echo "🖥️ Setting up the front-end..."
# Navigate to the front-end directory and create a new React app
npx create-react-app front-end
cd front-end

# Install Required Packages
echo "📦 Installing front-end dependencies..."
npm install react-router-dom
npm install axios
npm install typeface-poppins
npm install cookie-universal
npm install --save react-google-button
npm install --save @fortawesome/fontawesome-svg-core
npm install --save @fortawesome/free-solid-svg-icons
npm install --save @fortawesome/free-regular-svg-icons
npm install --save @fortawesome/react-fontawesome@latest
npm install --save @fortawesome/free-brands-svg-icons
npm install babel-plugin-macros
npm install styled-components
npm install sass
npm install react-paginate
npm install react-loading-skeleton
npm install @formspree/react
npm install lottie-react
npm install react-toastify
npm install @stripe/react-stripe-js @stripe/stripe-js
npm install react-minimal-pie-chart

# Back to Project Root
cd ..

# ⚙️ Back-End Setup
echo "⚙️ Setting up the back-end..."
# Create a new Laravel project
composer create-project laravel/laravel:^10.0 Back-End
cd Back-End

# Update composer.json for PHP 8.1 compatibility and add Passport package
echo "📝 Updating composer.json for PHP 8.1 and Passport..."
composer require laravel/passport -W

# Install the updated dependencies
echo "🔄 Installing dependencies..."
composer update

# Set up environment configuration
echo "🔧 Setting up environment configuration..."
cp .env.example .env
php artisan key:generate

# Configure Passport
echo "🔑 Configuring Passport..."
php artisan passport:install
php artisan migrate

# Update the .env file with your database settings
echo "🗂️ Updating .env file with database settings..."
# Edit .env file manually to add your database settings:
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=your_database_name
# DB_USERNAME=your_database_user
# DB_PASSWORD=your_database_password

# Start the development server
echo "🚀 Starting the Laravel development server..."
php artisan serve

# Install Passport
echo "🔑 Installing Passport..."
composer require laravel/passport -W

# Run Migrations and Passport Setup
echo "⚙️ Running migrations and completing Passport setup..."
php artisan migrate
php artisan passport:install
php artisan key:generate
php artisan passport:client --password
php artisan passport:client --personal
php artisan route:clear

# Follow Prompts to Create a New Client
echo "📝 Creating a new client..."
# Client Name: EcommerceClient
# Redirect URL: http://localhost/auth/callback
# The output will provide the Client ID and Client Secret.

# Create Controllers
echo "🎨 Creating controllers..."
php artisan make:controller AuthController
php artisan make:controller GoogleAuthController

# Google Sign-In Setup
echo "🔐 Setting up Google Sign-In..."
composer require laravel/socialite
# Follow the guide: Laravel Google Sign-In
# [Laravel Socialite Documentation](https://laravel.com/docs/10.x/socialite)

# Handle SSL Issue
echo "🔄 Handling SSL issues..."
# Follow this YouTube guide for SSL Issue Resolution: [YouTube Guide](https://www.youtube.com/watch?v=YOUR_VIDEO_ID)

# Database Seeding
echo "🌱 Seeding the database..."
php artisan make:factory CategoryFactory --model=Category
php artisan make:factory ProductFactory --model=Product
php artisan make:factory ProductImageFactory --model=ProductImage
php artisan db:seed --class=DatabaseSeeder

# Create Models, Migrations, and Controllers
echo "⚙️ Creating models, migrations, and controllers..."
php artisan make:migration create_categories_table
php artisan migrate
php artisan make:model Category
php artisan make:controller CategoryController

# Create Additional Models and Migrations
echo "⚙️ Creating additional models and migrations..."
php artisan make:model Order -m
php artisan make:model Country -m
php artisan make:model CartItem -m
php artisan make:model OrderDetail -m
php artisan make:model OrderItem -m
php artisan make:model Payment -m
php artisan make:model Customer -m
php artisan make:model CustomerAddress -m

# 🎉 Setup Complete!
echo "🎉 E-Commerce Laravel & React setup is complete! 🚀"
echo "🌟 Enjoy building your e-commerce platform! 🌟"
