import React, { useEffect, useRef, useState } from "react";
import "./User.css";
import Axios from "../../../Api/Axios";
import { USER } from "../../../Api/Api";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../../Components/Loading/loadingSpinner";

const AddUser = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    role: null,
    password_confirmation: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  {
    /* initialize the default values for the password fields */
  }
  const [visibility, setVisibility] = useState({
    password: { type: "password", icon: "visibility_off" },
    new_password: { type: "password", icon: "visibility_off" },
    password_confirmation: { type: "password", icon: "visibility_off" },
  });
  /*to show invalid border for fields which caues an error*/

  const [invalidFields, setInvalidFields] = useState({
    name: false,
    email: false,
    password: false,
    password_confirmation: false,
    role: false,
  });

  /*to prevent the button from submitting till the info is retrieved from the backend*/
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

   /*==============================================let us focus on the field================================================ */
   const fieldFocused = useRef("");

  /*=================================================set the new valuse for the user===================================*/
  const handleChange = (event) => {
    event.preventDefault();
    const { name, value } = event.target;
    console.log(name, value); 
    setUserData({
      ...userData,
      [name]: value,
    });
    setInvalidFields((prev) => ({ ...prev, [name]: false }));
    
  };
  /*==============================================send the new user's info================================================ */
  const handleAddUser = async (event) => {
    event.preventDefault();

    setLoading(true);
    try {
      const response = await Axios.post(`${USER}/add`, userData);
      navigate("/dashboard/users");
    } catch (error) {
      if(error.response.status===500){
       setError("internal server occurs")
      }
      console.log(error.response.status);
      const errorMessage =
        error.response?.data?.message || "An error has occurred";
      setError(errorMessage);
      if (error.response?.data?.message) {
        setInvalidFields((prevInvalidFields) => {
          const fieldsWithError = Object.keys(prevInvalidFields).filter(
            (field) => errorMessage.includes(`${field} field`)
          );
          return fieldsWithError.reduce(
            (acc, curr) => ({ ...acc, [curr]: true }),
            prevInvalidFields
          );
        });
      }
      if (error.response?.data?.message) {
        if (
          errorMessage.includes(
            "The password confirmation field must match password."
          )
        ) {
          setInvalidFields((prevInvalidFields) => ({
            ...prevInvalidFields,
            password: true,
            password_confirmation: true,
          }));
        }
      }
    } finally {
      setLoading(false);
    }
  };

  /***********************set the visibility for the password ************************/
  const handleVisibility = (fieldName) => {
    setVisibility((prevVisibility) => ({
      ...prevVisibility,
      [fieldName]: {
        ...prevVisibility[fieldName],
        type:
          prevVisibility[fieldName].type === "password" ? "text" : "password",
        icon:
          prevVisibility[fieldName].icon === "visibility_off"
            ? "visibility"
            : "visibility_off",
      },
    }));
  };
 /*==============================================let us focus on the field================================================ */
  useEffect(() => {
    if (!loading) {
      fieldFocused.current.focus();
    }
  }, [loading]);
  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="form-container">
          <form onSubmit={handleAddUser}>
            <div className="title">add user</div>
            <div className="form-details">
              <div className="input-box">
                <span className="details">Full Name</span>
                <input
                  name="name"
                  value={userData.name}
                  type="text"
                  className={invalidFields.name ? "invalid" : ""}
                  placeholder="Enter your name"
                  onChange={handleChange}
                />
              </div>
              <div className="input-box">
                <span className="details">Email</span>
                <input
                  name="email"
                  type="email"
                  ref={fieldFocused}
                  value={userData.email}
                  className={invalidFields.email ? "invalid" : ""}
                  placeholder="Enter your email"
                  onChange={handleChange}
                />
              </div>
              <div className="input-box">
                <span className="details">Password</span>
                <div className="password_visibile">
                  <input
                    name="password"
                    value={userData.password}
                    className={invalidFields.password ? "invalid" : ""}
                    type={
                      visibility.password
                        ? visibility.password.type
                        : "password"
                    }
                    placeholder="Enter your password"
                    onChange={handleChange}
                  />
                  <span
                    className="material-icons toggle-password"
                    onClick={() => handleVisibility("password")}
                  >
                    {visibility.password
                      ? visibility.password.icon
                      : "visibility_off"}
                  </span>
                </div>
              </div>
              <div className="input-box">
                <span className="details">Password Confirmation</span>
                <div className="password_visibile">
                  <input
                    name="password_confirmation"
                    value={userData.password_confirmation}
                    className={
                      invalidFields.password_confirmation ? "invalid" : ""
                    }
                    type={
                      visibility.password_confirmation
                        ? visibility.password_confirmation.type
                        : "password"
                    }
                    placeholder="Repeat your password"
                    onChange={handleChange}
                  />
                  <span
                    className="material-icons toggle-password"
                    onClick={() => handleVisibility("password_confirmation")}
                  >
                    {visibility.password_confirmation
                      ? visibility.password_confirmation.icon
                      : "visibility_off"}
                  </span>
                </div>
              </div>
              <div className="input-box">
                <span className="details">Role</span>
                <div className="select-wrapper">
                  <select
                    className={invalidFields.role ? "invalid" : ""}
                    value={userData.role}
                    name="role"
                    onChange={handleChange}
                  >
                    <option disabled selected value={""}>
                      select the role
                    </option>
                    <option value="0">User</option>
                    <option value="1">Admin</option>
                    <option value="2">product manager</option>
                  </select>
                  <span className="material-icons">arrow_drop_down</span>
                </div>
              </div>
            </div>

            <div className="button">
              <button type="submit" disabled={isSubmitting} required>
                save
              </button>
            </div>
            {error && (
              <div className="error">
                <span>{error}</span>
              </div>
            )}
          </form>
        </div>
      )}
    </>
  );
};

export default AddUser;
