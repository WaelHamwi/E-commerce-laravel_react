import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import { API_BASE_URL, CART, LOGIN } from "../../../Api/Api";
import "./Auth.css";
import logo from "./../../../Assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import LoadingSpinner from "../../../Components/Loading/loadingSpinner";
import Cookie from "cookie-universal";
import GoogleButton from "react-google-button";
import { CountHandleContext } from "../../../Context/CountHandler";
const Login = () => {
  /***********************set the navigate ************************/
  const navigate = useNavigate();
  /***********************set the states ************************/
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  /***********************hide form ************************/
  const [hideForm, setHideForm] = useState(false);
  /***********************loading show ************************/
  const [loadingSpinner, setLoading] = useState(false);
  /***********************visibility for the password ************************/
  const [visibility, setVisibility] = useState({
    type: "password",
    icon: "visibility_off",
  });
  /***********************set the errors ************************/
  const [Error, setError] = useState(false);
  /***********************define the cookie ************************/
  const cookie = Cookie();
  /*==============================================let us focus on the field================================================ */
  const fieldFocused = useRef("");
  /***********************set the states ************************/
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  /***********************set the counter ************************/
  const { setCartCount } = useContext(CountHandleContext);
  /***********************set the counter ************************/

  /***********************set the submit ************************/

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/${LOGIN}`, formData);
  
      const { token: accessToken, user: { role: roleOfUser }, count } = response.data;
  
      const navTo = roleOfUser === "1"
        ? "dashboard/users"
        : roleOfUser === "2"
          ? "dashboard/products"
          : "";
      if (accessToken && roleOfUser) {
        cookie.set("bearer", accessToken);
      //  window.location.pathname = `/${navTo}`;
      }
  
      setCartCount(count);
  
      const cookies = Cookie();
      const cart_items = cookies.get("cart_items");
  
      if (cart_items) {
        const AxiosAuthorized = axios.create({
          baseURL: `${API_BASE_URL}`,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
  
        const moveCartItemsResponse = await AxiosAuthorized.post(
          `${CART}/move-cart-items`,
          { cart_items }
        );
  
        
  
        if (moveCartItemsResponse.status === 200) {
          cookies.remove("cart_items");
        } else {
          console.log("Failed to move cart items");
        }
      }
      if (accessToken) {
        window.location.pathname = `/${navTo}`;
      }
    } catch (error) {
      console.error("Login error:", error);
  
      if (error.response) {
        setError(error.response.status === 401
          ? "Invalid credentials, please review your email or password"
          : "Internal server error!");
      } else {
        setError("Network error, please try again later");
      }
    } finally {
      setLoading(false);
    }
  };
  

  /***********************set the visibility for the form ************************/
  const handleHideForm = async (e) => {
    setHideForm(!hideForm);
  };
  /***********************set the visibility for the password ************************/
  const handleVisibility = () => {
    setVisibility((prevVisibility) => ({
      ...prevVisibility,
      type: prevVisibility.type === "password" ? "text" : "password",
      icon:
        prevVisibility.icon === "visibility_off"
          ? "visibility"
          : "visibility_off",
    }));
  };
  useEffect(() => {
    if (!loadingSpinner) {
      fieldFocused.current.focus();
    }
  }, [loadingSpinner]);
  return (
    <div className="authGoogle">
      <header>
        <h2 className="logo">
          <img src={logo} alt="Logo" />
        </h2>
        <nav class="navBar">
          <a href="">Home</a>
          <a href="">About</a>
          <a href="">Services</a>
          <a href="">Contact</a>
          <button className="formBtn" onClick={handleHideForm}>
            Login
          </button>
        </nav>
      </header>
      {loadingSpinner && <LoadingSpinner />}
      {!hideForm && (
        <div className="wrapper">
          <span className="material-icons close" onClick={handleHideForm}>
            close
          </span>
          {/* Login form */}
          <div className="credentials-form login">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-control">
                <span className="material-icons">email</span>
                <input
                  type="email"
                  name="email"
                  ref={fieldFocused}
                  value={formData.email}
                  onChange={handleChange}
                  required
                  minLength={3}
                />
                <label htmlFor="email">Email</label>
              </div>
              <div className="form-control">
                <span
                  className="material-icons toggle-password"
                  onClick={handleVisibility}
                >
                  {visibility.icon}
                </span>

                <input
                  type={visibility.type}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={1}
                />
                <label htmlFor="password">Password</label>
              </div>
              <button className="form-btn" type="submit">
                Login
              </button>

              <div className="GoogleButton">
                <a href="http://localhost:8000/api/google-auth/redirect">
                  <GoogleButton
                    onClick={() => {
                      console.log("Google button clicked");
                    }}
                  />
                </a>
              </div>

              <span className="error">{Error}</span>
            </form>
            <div className="login-register">
              <p>
                Don't have an account? <Link to="/register">Register</Link>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
