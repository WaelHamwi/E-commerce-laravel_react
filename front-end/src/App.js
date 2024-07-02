import "./App.css";
import HomePage from "./Pages/Website/Home/HomePage";
import { Route, Routes } from "react-router-dom";
import Login from "./Pages/Auth/System/Login";
import Register from "./Pages/Auth/System/Register";
import Users from "./Pages/Dashboard/Users/Index";
import GoogleAuth from "./Pages/Auth/System/GoogleAuth";
import Dashboard from "./Pages/Dashboard";
import AuthGuard from "./Pages/Auth/System/AuthGuard";
import User from "./Pages/Dashboard/Users/EditUser";
import AddUser from "./Pages/Dashboard/Users/AddUser";
import AddProduct from "./Pages/Dashboard/Products/AddProduct";
import NotFound from "./Pages/Auth/Errors/NotFound";
import GoBack from "./Pages/Auth/System/GoBack";
import Products from "./Pages/Dashboard/Products/Index";
import Categories from "./Pages/Dashboard/Categories/Index";
import AddCategory from "./Pages/Dashboard/Categories/AddCategory";
import Category from "./Pages/Dashboard/Categories/EditCategory";
import Product from "./Pages/Dashboard/Products/EditProduct";
import CategoriesShow from "./Pages/Website/Category/Categories";
import Website from "./Pages/Website/Index";
import About from "./Pages/Website/About/About";
import Cart from "./Pages/Website/Cart/index";
import AddToCart from "./Pages/Website/Cart/add";
import Contact from "./Pages/Website/Contact/contactUs";
import RemoveFromCart from "./Pages/Website/Cart/remove";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Orders from "./Pages/Website/Order/index";
import Index from "./Pages/Dashboard/Landing/Index";
import AddCustomer from "./Pages/Dashboard/Customers/Add";
import Customers from "./Pages/Dashboard/Customers/Index";
import EditCustomer from "./Pages/Dashboard/Customers/Edit";
import ProductsShow from "./Pages/Website/Product/Products";


function App() {
  return (
    <div className="App">
      <Routes>
        {/* Public routes */}
        <Route element={<Website />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/categories" element={<CategoriesShow />} />
          <Route path="/categories/:id" element={<ProductsShow />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/add/product" element={<AddToCart />} />
          <Route path="/remove/product" element={<RemoveFromCart />} />
          <Route path="/orders" element={<Orders />} />
        </Route>
        <Route path="/*" element={<NotFound />} />
        <Route element={<GoBack />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
        {/* Backend route - invoked automatically after register is executed */}
        <Route path="/google-auth/callback" element={<GoogleAuth />} />

        {/* Authenticated Routes */}

        {/* Protected dashboard route */}
        <Route element={<AuthGuard AuthenticatedUser={["1", "2"]} />}>
          <Route path="/dashboard" element={<Dashboard />}>
            {/* Child routes within the dashboard */}
            <Route element={<AuthGuard AuthenticatedUser={"1"} />}>
              <Route path="users" element={<Users />} />
              <Route path="users/:id" element={<User />} />
              <Route path="AddUser" element={<AddUser />} />
            </Route>
            <Route element={<AuthGuard AuthenticatedUser={["1", "2"]} />}>
            {/* dashboard index */}
              <Route path="" element={<Index />} />
              {/* 
            category api's
              */}
              <Route path="categories" element={<Categories />} />
              <Route path="categories/:id" element={<Category />} />
              <Route path="AddCategory" element={<AddCategory />} />
              {/* 
              product api's
              */}
              <Route path="products" element={<Products />} />
              <Route path="AddProduct" element={<AddProduct />} />
              <Route path="Products/:id" element={<Product />} />
               {/* 
              orders api's
              */}
            <Route path="orders" element={<Orders />}  />
             {/* 
              customers api's
              */}
            <Route path="Addcustomer" element={<AddCustomer />}  />
            <Route path="customers" element={<Customers />}  />
            <Route path="customers/:id" element={<EditCustomer />}  />
            </Route>
          </Route>
        </Route>
      </Routes>
      <ToastContainer />
    </div>
  );
}

export default App;
