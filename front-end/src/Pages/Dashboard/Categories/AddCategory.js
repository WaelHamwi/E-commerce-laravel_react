import React, { useEffect, useRef, useState } from "react";
import Axios from "../../../Api/Axios";
import { CATEGORY } from "../../../Api/Api";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../../Components/Loading/loadingSpinner";
import "./Category.css"
const AddCategory = () => {
  const [categoryData, setCategoryData] = useState({
    title: "",
    image: null,
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  {
    /* initialize the default values for the password fields */
  }

  /*to show invalid border for fields which caues an error*/

  const [invalidFields, setInvalidFields] = useState({
    title: false,
    image: false,
  });

  /*to prevent the button from submitting till the info is retrieved from the backend*/
  const [isSubmitting, setIsSubmitting] = useState(true);
  const navigate = useNavigate();
  
  /*==============================================let us focus on the field================================================ */
  const fieldFocused = useRef("");
  /*=================================================set the new values for the category===================================*/
  const handleChange = (event) => {
    setIsSubmitting(false);
    event.preventDefault();
    const { name, value, files } = event.target;

    if (name === "image" && files.length > 0) {
      const uploadedFile = files[0];
      console.log("Uploaded file:", uploadedFile);
      setCategoryData({
        ...categoryData,
        [name]: uploadedFile,
      });
      setError(null);
    } else {
      setCategoryData({
        ...categoryData,
        [name]: value,
      });
    }

    setInvalidFields((prev) => ({ ...prev, [name]: false }));
  };
  /*==============================================send the new category's info================================================ */
  const handleAddCategory = async (event) => {
    event.preventDefault();

    setLoading(true);
    try {
      const CategoryData = new FormData();
      CategoryData.append("title", categoryData.title);
      CategoryData.append("image", categoryData.image);
      const response = await Axios.post(`${CATEGORY}/add`, CategoryData);
      navigate("/dashboard/categories");
    } catch (error) {
      if (error.response.status === 500) {
        setError("internal server occurs");
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
      }
    } finally {
      setLoading(false);
    }
  };

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
        <div className="form-container form-category">
          <form onSubmit={handleAddCategory}>
            <div className="title">Add Category</div>
            <div className="form-details">
              <div className="input-box">
                <span className="details">Title</span>
                <input
                  name="title"
                  value={categoryData.title}
                  ref={fieldFocused}
                  type="text"
                  className={invalidFields.title ? "invalid" : ""}
                  placeholder="Enter the category title"
                  onChange={handleChange}
                  required
                />
                {invalidFields.name && (
                  <span className="error-message">
                    Please enter a valid title
                  </span>
                )}
              </div>
              <div className="input-box">
                <span className="details">Image</span>
                <input
                  name="image"
                  type="file"
                  className={invalidFields.image ? "invalid" : ""}
                  placeholder="Enter the category image"
                  onChange={handleChange}
                  required
                />
                {invalidFields.name && (
                  <span className="error-message">
                    Please enter a valid image
                  </span>
                )}
              </div>
            </div>
            <div className="button">
              <button type="submit" disabled={isSubmitting}>
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

export default AddCategory;
