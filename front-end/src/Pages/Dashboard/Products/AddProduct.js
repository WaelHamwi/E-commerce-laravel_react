import React, { useEffect, useRef, useState } from "react";
import Axios from "../../../Api/Axios";
import { PRODUCT } from "../../../Api/Api";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../../Components/Loading/loadingSpinner";
import { CATEGORIES } from "../../../Api/Api";
import "./Product.css";
import { faTrashAlt } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const AddProduct = () => {
  const [productData, setProductData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    discount: "",
  });
  const seedData = {
    title: "seed",
    description: "seed",
    price: 1,
    category: null,
    discount: 1,
  };

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [stopSending, setStopSending] = useState(true);
  console.log(images);
  console.log(stopSending);

  {
    /* initialize the default values for the password fields */
  }

  /*to show invalid border for fields which caues an error*/

  const [invalidFields, setInvalidFields] = useState({
    title: false,
    description: false,
    price: false,
    category: false,
    discount: false,
    images: false,
  });

  /*to prevent the button from submitting till the info is retrieved from the backend*/
  const [isSubmitting, setIsSubmitting] = useState(true);
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  console.log(isDeleting);
  /*==============================================let us focus on the field================================================ */
  const fieldFocused = useRef("");

  /*************************************bring all available categories*****************************************************/
  const [categories, setCategories] = useState([]);
  /*==============================use the hook ref to open the img==========================================*/
  const openImage = useRef(null);

  /*****************************************state to get the id of the created product from the add method to edit it so we ensure handle the upload of the image with the progress and the product id *************************************************** */
  const [productID, setProductId] = useState("");

  /*********************************************ref of the progress ration********************************************************/
  const progressRatio = useRef([]);
  /***********************************************************************************************************/
  const [uploadImage, setUploadImage] = useState(false);
  /***************************************ref for handle delete images************************************************/
  const imagesId = useRef([]);
console.log(imagesId);

  /**************************send dummy data to the back end to send image and assign for them product id to display the progress********************* */
  async function handleSendDummyData() {
    try {
      if (!productID) {
        const response = await Axios.post(`${PRODUCT}/add`, seedData); //excute the method add so this mthod return product with status draft
        setProductId(response.data.id);
        console.log(response);
      }
    } catch (error) {}
  }

  /*=================================================set the new values for the product===================================*/
  const handleChange = (event) => {
    setIsSubmitting(false);
    event.preventDefault();
    const { name, value } = event.target;
    setProductData({
      ...productData,
      [name]: value,
    });
    setStopSending(false);
    if (stopSending !== false) {
      handleSendDummyData();
    }
    setError(null);
    setInvalidFields((prev) => ({ ...prev, [name]: false }));
  };
  /************************ handle the image******************** */
  const fileSelectedHandler = (e) => {
    setIsDeleting(false);
    const files = e.target.files;
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif"];
    const validFiles = Array.from(files).filter((file) =>
      allowedTypes.includes(file.type)
    );

    if (validFiles.length > 0) {
      setImages((prevImages) => [...prevImages, ...validFiles]);
      setError(null);  
      console.log(validFiles); // Logs the newly selected files
    } else {
      setError("Please select a valid image file (jpeg, png, jpg, gif).");
    }
  };

  useEffect(() => {
   
    if (images.length > 0 &&!isDeleting) {
      uploadImages();
    }
  }, [images]);

  const uploadImages = async () => {
    if (isDeleting) return;
    setUploadImage(true);

    for (let i = 0; i < images.length; i++) {
      const DataImage = new FormData();
      DataImage.append("image", images[i]);
      console.log(images[i]);
      DataImage.append("product_id", productID);

      try {
        
        const response = await Axios.post("productImg/upload", DataImage, {
          onUploadProgress: (ProgressEvent) => {
            if (progressRatio.current[i]) {
              progressRatio.current[i].classList.add("inner-progress");
              const progress = Math.floor(
                (ProgressEvent.loaded * 100) / ProgressEvent.total
              );
              if (progress % 10 === 0) {
                progressRatio.current[i]?.setAttribute(
                  "data-ratio",
                  progress.toString()
                );
                progressRatio.current[i].style.width = `${progress}%`;
              }
            }
          },
        });
        imagesId.current[i] = response.data.data.id;
      } catch (error) {
        console.log(error);
        const errorMessage =
          error.response?.data?.message || "An error has occurred";
        setError(errorMessage);
      }
    }

    setUploadImage(false);
  };


  /************************************delete image*************************************/
  async function handleDeleteImage(id, img) {
    setIsSubmitting(true);
    setIsDeleting(true);
    try {
      const RealImageId = imagesId.current[id];
      console.log(RealImageId);
      const response = await Axios.delete(`productImg/delete/${RealImageId}`);
      console.log(response);

      // Filter out the deleted image ID from imagesId.current
      imagesId.current = imagesId.current.filter(
        (imageId) => imageId !== RealImageId
      );
      setImages((prevImages) => prevImages.filter((image, idx) => idx !== id));
      progressRatio.current = progressRatio.current.filter((_, idx) => idx !== id);

      console.log(imagesId.current);
    } catch (error) {
      console.error("Error deleting image:", error);
    }
    finally{
      setIsSubmitting(false);
     
    }
    
  }

  /*******************************************handle show uploaded images *********************************************/
  const showImages = images.map((img, key) => (
    <div key={key} className="image-container">
      <img src={URL.createObjectURL(img)} alt={`Image ${key + 1}`} />
      <div>
        <p>name: {img.name}</p>
      </div>
      <p>
        Size:{" "}
        {img.size > 10000
          ? (img.size / (1024 * 1024)).toFixed(3) + " MB"
          : (img.size / 1024).toFixed(2) + " KB"}
      </p>
      <div className="progress-bar">
        <p ref={(e) => (progressRatio.current[key] = e)}></p>
      </div>
      <button
        className="delete-icon"
        onClick={() => handleDeleteImage( key, img)}  
      >
        <FontAwesomeIcon icon={faTrashAlt} />
      </button>
    </div>
  ));

  /*==============================================send the new product's info================================================ */
  const handleEditProduct = async (event) => {
    event.preventDefault();
    if (isSubmitting) {
        return; 
      }
    setLoading(true);
    try {
      const ProductData = new FormData();
      ProductData.append("title", productData.title);
      ProductData.append("description", productData.description);
      ProductData.append("price", parseFloat(productData.price));
      ProductData.append("discount", parseFloat(productData.discount));
      ProductData.append("category", productData.category);
      if (images.length > 0) {
        for (let i = 0; i < images.length; i++) {
          ProductData.append("images[]", images[i]);
        }
      }
      const response = await Axios.post(
        `${PRODUCT}/edit/${productID}`,
        ProductData
      );
      navigate("/dashboard/products");
    } catch (error) {
      if (error.response && error.response.status === 500) {
        setError("Internal server error occurred");
      } else {
        setError("An error has occurred");
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
    } finally {
      setLoading(false);
    }
  };

  /*******************************focus**********************************************************/
  useEffect(() => {
    if (!loading) {
      fieldFocused.current.focus();
    }
  }, [loading]);
  /**********************************bring categories to associate it with product*********************************** */
  useEffect(() => {
    Axios.get(`/${CATEGORIES}`)
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error("Error fetching category data:", error);
      });
  }, []);
  /*************************************handle open image*************************************** */
  function handleOpenImg() {
    openImage.current.click();
  }
  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="form-container form-product">
          <form onSubmit={handleEditProduct}>
            <div className="title">Add Product</div>
            <div className="form-details">
              <div className="input-box">
                <span className="details">Category</span>
                <select
                  name="category"
                  value={productData.category}
                  onChange={handleChange}
                  className={invalidFields.category ? "invalid" : ""}
                  required
                >
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="input-box">
                <span className="details">Title</span>
                <input
                  name="title"
                  value={productData.title}
                  ref={fieldFocused}
                  type="text"
                  className={invalidFields.title ? "invalid" : ""}
                  placeholder="Enter the product title"
                  onChange={handleChange}
                  required
                  disabled={stopSending}
                />
                {invalidFields.name && (
                  <span className="error-message">
                    Please enter a valid title
                  </span>
                )}
              </div>
              <div className="input-box">
                <span className="details">description</span>
                <input
                  name="description"
                  value={productData.description}
                  type="text"
                  className={invalidFields.description ? "invalid" : ""}
                  placeholder="Enter the product description"
                  onChange={handleChange}
                  required
                  disabled={stopSending}
                />
                {invalidFields.name && (
                  <span className="error-message">
                    Please enter a valid description
                  </span>
                )}
              </div>
              <div className="input-box">
                <span className="details">Price</span>
                <input
                  name="price"
                  value={productData.price}
                  type="text"
                  className={invalidFields.price ? "invalid" : ""}
                  placeholder="Enter the product price"
                  onChange={handleChange}
                  required
                  disabled={stopSending}
                />
                {invalidFields.name && (
                  <span className="error-message">
                    Please enter a valid price
                  </span>
                )}
              </div>
              <div className="input-box">
                <span className="details">Discount</span>
                <input
                  name="discount"
                  value={productData.discount}
                  type="text"
                  className={invalidFields.discount ? "invalid" : ""}
                  placeholder="Enter the product discount"
                  onChange={handleChange}
                  required
                  disabled={stopSending}
                />
                {invalidFields.name && (
                  <span className="error-message">
                    Please enter a valid discount
                  </span>
                )}
              </div>
              <div className="input-box">
                <input
                  name="images[]"
                  type="file"
                  hidden
                  className={invalidFields.images ? "invalid" : ""}
                  placeholder="Enter the product image"
                  onChange={fileSelectedHandler}
                  multiple
                  ref={openImage}
                  disabled={stopSending}
                />
                {invalidFields.images && (
                  <span className="error-message">
                    Please select a valid image (jpeg, png, jpg, gif)
                  </span>
                )}
              </div>

              <div className="input-box">
                <div
                  className={`img-container ${stopSending ? "disabled" : ""}`}
                  onClick={handleOpenImg}
                >
                  <span className="details">Images</span>
                  <div className="img-flex">
                    <img src={require("./../../../Assets/download.jpeg")} />
                  </div>

                  {invalidFields.name && (
                    <span className="error-message">
                      Please enter a valid image
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="button">
              <button type="submit" disabled={stopSending || uploadImage}>
                save
              </button>
            </div>
            {error && (
              <div className="error">
                <span>{error}</span>
              </div>
            )}
            <div className="img-show"> {showImages}</div>
          </form>
        </div>
      )}
    </>
  );
};

export default AddProduct;
