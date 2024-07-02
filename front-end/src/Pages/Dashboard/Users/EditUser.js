import React, { useEffect, useRef, useState } from "react";
import "./User.css";
import Axios from "../../../Api/Axios";
import { USER } from "../../../Api/Api";
import { useNavigate, useParams } from "react-router-dom";
import LoadingSpinner from "../../../Components/Loading/loadingSpinner";

const User = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    new_password: "",
    role: "",
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
    new_password: false,
    password_confirmation: false,
    role: false,
  });

  /*to prevent the button from submitting till the info is retrieved from the backend*/
  const [isSubmitting, setIsSubmitting] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

   /*==============================================let us focus on the field================================================ */
   const fieldFocused = useRef("");

  /*==============================================bring the user info to edit================================================ */
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await Axios(`${USER}/${id}`);
        setUserData(response.data);
        setIsSubmitting(false);
      } catch (error) {
        setLoading(false)
        navigate('/dashboard/users/NotFound/404',{replace:true});
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  /*=================================================set the new valuse for the user===================================*/
  const handleChange = (event) => {
    event.preventDefault();
    const { name, value } = event.target;
    setUserData({
      ...userData,
      [name]: value,
    });
    setInvalidFields((prev) => ({ ...prev, [name]: false }));
    setError(null);
  };
  /*==============================================send the new user's info================================================ */
  const handleEditUser = async (event) => {
    event.preventDefault();

    setLoading(true);
    try {
      const response = await Axios.post(`${USER}/edit/${id}`, userData);
      navigate("/dashboard/users");
    } catch (error) {
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
          <form onSubmit={handleEditUser}>
            <div className="title">edit user</div>
            <div className="form-details">
              <div className="input-box">
                <span className="details">Full Name</span>
                <input
                  name="name"
                  type="text"
                  className={invalidFields.name ? "invalid" : ""}
                  placeholder="Enter your name"
                  value={userData.name}
                  onChange={handleChange}
                />
              </div>
              <div className="input-box">
                <span className="details">Email</span>
                <input
                  name="email"
                  type="email"
                  ref={fieldFocused}
                  className={invalidFields.email ? "invalid" : ""}
                  placeholder="Enter your email"
                  value={userData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="input-box">
                <span className="details">Old Password (optional)</span>
                <div className="password_visibile">
                  <input
                    name="password"
                    className={invalidFields.password ? "invalid" : ""}
                    value={userData.password}
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
                <span className="details">New Password (optional)</span>
                <div className="password_visibile">
                  <input
                    name="new_password"
                    value={userData.new_password}
                    className={invalidFields.new_password ? "invalid" : ""}
                    type={
                      visibility.new_password
                        ? visibility.new_password.type
                        : "password"
                    }
                    placeholder="Enter your password"
                    onChange={handleChange}
                  />
                  <span
                    className="material-icons toggle-password"
                    onClick={() => handleVisibility("new_password")}
                  >
                    {visibility.new_password
                      ? visibility.new_password.icon
                      : "visibility_off"}
                  </span>
                </div>
              </div>
              <div className="input-box">
                <span className="details">Password Confirmation (optional)</span>
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
                <div className="select-wrapper ">
                  <select
                    name="role"
                    value={userData.role}
                    onChange={handleChange}
                  >
                    <option disabled value="">
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
                Save
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

export default User;
