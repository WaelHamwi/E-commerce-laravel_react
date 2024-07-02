# 🛒 E-Commerce Laravel & React Setup

🎯 Welcome to the **E-Commerce Laravel & React** project! 🚀
 This is a **full-stack web application** designed to offer a **seamless and secure e-commerce experience**. Built using **Laravel** for the backend and **React** for the frontend, this project incorporates advanced features to ensure a top-notch user experience and robust functionality.

# 🌟 Project Overview
 **E-Commerce Laravel & React** combines modern technologies and best practices to create a feature-rich e-commerce platform. Here’s what makes this project stand out:

# 🌟 Features
 1. **Secure Payment Integration** - **Stripe Integration**: The application integrates with [Stripe](https://stripe.com/) to handle secure payment processing.
 2. **Image Upload Progress Bar** - **Progress Bar for Image Uploading**: A visual progress bar is provided for users during the image upload process.
 3. **Big Data Management** - **Efficient Data Handling**: The application uses pagination and chunking techniques to manage large datasets.
 4. **Enhanced User Experience** - **Native CSS**: The project is built using native CSS only.
 5. **Modern Front-End Technologies** - **React and Redux** for state management, **React Router** for navigation, and **Styled Components** for styling.
 6. **Rich Component Library** - **FontAwesome Icons**, **React Toastify** for notifications, **React Paginate** for pagination, and **React Loading Skeleton** for skeleton screens.
 7. **Social Authentication** - **Google Sign-In** using [Laravel Socialite](https://laravel.com/docs/10.x/socialite).

# 📂 Project Structure
 - **Backend**: Developed using Laravel with features like API authentication, database management, and server-side logic.
 - **Frontend**: Developed using React with features like state management, routing, and interactive UI components.

# 🏗️ Technologies Used
 - **Backend**: Laravel, PHP 8.1, Laravel Passport, MySQL
 - **Frontend**: React, Redux, React Router, FontAwesome, Styled Components, Native CSS
 - **Payment Processing**: Stripe API
 - **Authentication**: Google Sign-In via Laravel Socialite
 - **Data Handling**: Pagination, Chunking, React Loading Skeleton

# 🚀 Getting Started
 Follow the steps below to get started with the project.

 # Table of Contents
 1. [Clone the Repository](#clone-the-repository)
 2. [Front-End Setup](#front-end-setup)
 3. [Back-End Setup](#back-end-setup)
 4. [Google Sign-In Setup](#google-sign-in-setup)
 5. [Handle SSL Issues](#handle-ssl-issues)
 6. [Database Seeding](#database-seeding)
 7. [Additional Models, Migrations, and Controllers](#additional-models-migrations-and-controllers)
 8. [Install Required Packages](#install-required-packages)

# 🛠️ **Clone the Repository**
echo "🚀 Cloning the repository..."
git clone https://github.com/yourusername/E-commerce-laravel_react.git
cd e-commerce-laravel-react

# 🖥️ **Front-End Setup**
🖥️ Setting up the front-end..."

 **Navigate to the front-end directory and create a new React app**
npx create-react-app front-end
cd front-end

# Install Required Packages
📦 Installing front-end dependencies...

`npm install react-router-dom`

`npm install axios`

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

# ⚙️ **Back-End Setup**
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
 Edit .env file manually to add your database settings:
 DB_CONNECTION=mysql
 DB_HOST=127.0.0.1
 DB_PORT=3306
 DB_DATABASE=your_database_name
 DB_USERNAME=your_database_user
 DB_PASSWORD=your_database_password

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
 Client Name: EcommerceClient
 Redirect URL: http://localhost/auth/callback
 The output will provide the Client ID and Client Secret.

# Create Controllers
echo "🎨 Creating controllers..."
php artisan make:controller AuthController
php artisan make:controller GoogleAuthController

# Google Sign-In Setup
echo "🔐 Setting up Google Sign-In..."
composer require laravel/socialite
 Follow the guide: Laravel Google Sign-In
 [Laravel Socialite Documentation](https://laravel.com/docs/10.x/socialite)

# Handle SSL Issue
echo "🔄 Handling SSL issues..."
 Follow this YouTube guide for SSL Issue Resolution: [YouTube Guide](https://www.youtube.com/watch?v=YOUR_VIDEO_ID)

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

# 🌟 **Summary**
 The E-Commerce Laravel & React project is a feature-rich e-commerce platform designed to offer a secure and enjoyable shopping experience.
 - 🔒 **Secure Payments**: Integrated with Stripe for safe and reliable payment processing.
 - 📈 **Image Upload Progress**: A visual progress bar to enhance user feedback during image uploads.
 - 💾 **Efficient Big Data Handling**: Optimized for managing large datasets with pagination and chunking.
 - 🎨 **Native CSS Styling**: Clean, maintainable styles for a consistent user experience.
 - ⚛️ **Modern Technologies**: Built with React and Laravel for a dynamic, scalable application.
 - 🔗 **Social Authentication**: Google Sign-In for easy and secure user login.

# 🤝 **Contributing**
 We welcome contributions to the project! If you have suggestions or want to contribute, please follow these steps:
 - Fork the repository.
 - Create a new branch for your changes.
 - Submit a pull request with a detailed description of your changes.

# 📄 **License**
 This project is licensed under the MIT License. Happy coding! 🎉
