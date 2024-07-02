import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { API_BASE_URL, REGISTER } from "../../../Api/Api";
import "./Auth.css";
import logo from "./../../../Assets/logo.png";
import LoadingSpinner from "../../../Components/Loading/loadingSpinner";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Cookie from "cookie-universal";
import GoogleButton from "react-google-button";
const Register = () => {
  /***********************set the navigate ************************/
  const navigate = useNavigate();
  /***********************set the states ************************/
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  /***********************hide form ************************/
  const [hideForm, setHideForm] = useState(false);
  /***********************visibility for the password and confirm pass ************************/
  const [passwordVisibility, setPasswordVisibility] = useState({
    type: "password",
  });
  const [passwordConfvisib, setPasswordConfiVisi] = useState({
    type: "password",
  });
  /***********************set the errors ************************/
  const [Error, setError] = useState(false);
  /***********************set the loading spinner ************************/
  const [loadingSpinner, setLoadingSpinner] = useState(false);

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
    setError(null);
  };

  /***********************set the submit register ************************/
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingSpinner(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/${REGISTER}`,
        formData
      );
      const accessToken = response.data.token;
      cookie.set("bearer", accessToken);
      window.location.pathname="/"; 
    } catch (error) {
      console.log(error.response.status);
      if (error.response.status === 422) {
        setError("the email has already been taken");
      } else {
        setError("Internal server error");
      }
    } finally {
      setLoadingSpinner(false);
    }
  };
  /***********************set the visibility for the form ************************/
  const handleHideForm = async (e) => {
    hideForm ? setHideForm(false) : setHideForm(true);
  };
  /***********************set the visibility for the password ************************/
  const handlePasswordVisibility = async (e) => {
    setPasswordVisibility((prevVisibility) => ({
      ...prevVisibility,
      type: prevVisibility.type === "password" ? "text" : "password",
    }));
  };
  const handlePasswordConfVisi = async (e) => {
    setPasswordConfiVisi((prevVisibility) => ({
      ...prevVisibility,
      type: prevVisibility.type === "password" ? "text" : "password",
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
            Register
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
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-control">
                <span className="material-icons">account_circle</span>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="email">username</label>
              </div>
              <div className="form-control">
                <span className="material-icons">email</span>
                <input
                  type="email"
                  name="email"
                  ref={fieldFocused}
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="email">email</label>
              </div>
              <div className="form-control">
                <span
                  className="material-icons toggle-password"
                  onClick={handlePasswordVisibility}
                >
                  visibility_off
                </span>
                <input
                  type={passwordVisibility.type}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={1}
                />
                <label htmlFor="password">Password</label>
              </div>
              <div className="form-control">
                <span
                  className="material-icons toggle-password"
                  onClick={handlePasswordConfVisi}
                >
                  visibility_off
                </span>
                <input
                  type={passwordConfvisib.type}
                  name="password_confirmation"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  required
                  minLength={1}
                />
                <label htmlFor="password">password confirmation</label>
              </div>
              <button className="form-btn" type="submit">
                Register
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
              {Error !== "" && <span className="error">{Error}</span>}
            </form>
            <div className="login-register">
              <p>
                you already had an account? <Link to="/login">Login</Link>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
