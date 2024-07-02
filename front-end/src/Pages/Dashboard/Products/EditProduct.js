import React, { useEffect, useRef, useState } from "react";
import Axios from "../../../Api/Axios";
import { PRODUCT } from "../../../Api/Api";
import { useNavigate, useParams } from "react-router-dom";
import LoadingSpinner from "../../../Components/Loading/loadingSpinner";
import { CATEGORIES } from "../../../Api/Api";
import "./Product.css";
import { faTrashAlt } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const Product = () => {
  const [productData, setProductData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    discount: "",
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [storedBackendImages, setStoredBackendImages] = useState([]);

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

  /*==============================================let us focus on the field================================================ */
  const fieldFocused = useRef("");

  /*************************************bring all available categories*****************************************************/
  const [categories, setCategories] = useState([]);
  /*==============================use the hook ref to open the img==========================================*/
  const openImage = useRef(null);

  /*********************************************ref of the progress ration********************************************************/
  const progressRatio = useRef([]);
  /***********************************************************************************************************/
  const [uploadImage, setUploadImage] = useState(false);
  /***************************************ref for handle delete images************************************************/
  const imagesId = useRef([]);

  /*************************************get the product id*************************************** */
  const { id } = useParams();
  /******************************************store id of deleted images from the user interface*********************************************************/
  const [idOfDeletedImages, setIdOfDeletedImages] = useState([]);
  console.log(idOfDeletedImages);
  /*=================================================set the new values for the product===================================*/
  const handleChange = (event) => {
    setIsSubmitting(false);
    event.preventDefault();
    const { name, value } = event.target;
    setProductData({
      ...productData,
      [name]: value,
    });
    setError(null);
    setInvalidFields((prev) => ({ ...prev, [name]: false }));
  };
  /************************ handle the image******************** */
  const fileSelectedHandler = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      const uploadedFiles = Array.from(files);
      setImages([...images, ...uploadedFiles]);
    }
  };
  const j = useRef(-1);
  useEffect(() => {
    const uploadImages = async () => {
      setUploadImage(true);

      // we use the use effect to ensure that we had brought the images properly
      if (images.length > 0) {
        const DataImage = new FormData();
        for (let i = 0; i < images.length; i++) {
          j.current++;
          DataImage.append("image", images[i]);
          DataImage.append("product_id", id);
          try {
            const response = await Axios.post("productImg/upload", DataImage, {
              onUploadProgress: (ProgressEvent) => {
                progressRatio.current[i].classList.add("inner-progress");
                const progress = Math.floor(
                  (ProgressEvent.loaded * 100) / ProgressEvent.total
                );
                if (progress % 10 === 0) {
                  progressRatio.current[i].setAttribute(
                    "data-ratio",
                    progress.toString()
                  );
                  progressRatio.current[i].style.width = `${progress}%`;
                }
              },
            });
            imagesId.current[j.current] = response.data.data.id;
          } catch (error) {
            console.log(error);
            const errorMessage =
              error.response?.data?.message || "An error has occurred";
            setError(errorMessage);
          }
        }
      }
      setUploadImage(false);
    };

    uploadImages();
  }, [images]); //  this effect whenever `images` changes will be run auto

  /************************************delete image*************************************/
  async function handleDeleteImage(id, img) {
    const RealImageId = imagesId.current[id];
    const response = await Axios.delete(`productImg/delete/${RealImageId}`);
    setImages((prev) => prev.filter((images) => images !== img));
    imagesId.current = imagesId.current.filter(
      (index) => index !== RealImageId
    ); //update the array of the images's ids after the deleting process
    //decrease the number of the j after the deletion process so we can decrease the number index of the array of the ids
    --j.current;

    console.log(RealImageId);
  }

  /************************************delete image from backend*************************************/
  async function handleHideImageFromBackend(img, id) {
    setStoredBackendImages((prev) => prev.filter((item) => item !== img));
    setIdOfDeletedImages((prev) => [...prev, id]);
  }

  /*******************************************handle show uploaded images *********************************************/
  const showImages = images.map((img, key) => (
    <>
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
          type="button"
          className="delete-icon"
          onClick={() => handleDeleteImage(key, img)}
        >
          <FontAwesomeIcon icon={faTrashAlt} />
        </button>
      </div>
    </>
  ));

  /************************************show the previous images from the backend***************************************** */
  const showBackendImages = storedBackendImages.map((img, key) => (
    <>
      <div key={key} className="image-container">
        <img
          src={`http://127.0.0.1:8000/images/${img.image}`}
          alt={`Image ${key + 1}`}
        />

        <div>
          <p>name: {img.image}</p>
        </div>
        <button
          className="delete-icon"
          onClick={() => handleHideImageFromBackend(img, img.id)}
        >
          <FontAwesomeIcon icon={faTrashAlt} />
        </button>
      </div>
    </>
  ));

  console.log(showBackendImages);

  /*==============================================send the new product's info================================================ */
  const handleEditProduct = async (event) => {
    event.preventDefault();

    setLoading(true);
    for (let i = 0; i < idOfDeletedImages.length; i++) {
      try {
        const response = await Axios.delete(
          `productImg/delete/${idOfDeletedImages[i]}`
        );
      } catch (error) {
        console.log(error);
      }
    }
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
      const response = await Axios.post(`${PRODUCT}/edit/${id}`, ProductData); //change the method to edit since we already excuted the method add so this as a confirmation of the user
      navigate("/dashboard/products");
    } catch (error) {
      setImages([]);
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
      if (error.response?.data?.message) {
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
  /********************************bring the product to edit them*********************************************/
  useEffect(() => {
    Axios.get(`/${PRODUCT}/${id}`)

      .then((response) => {
        setProductData(response.data[0]); //cause the data retreived is an object and the product data is an array
        //we assign it here to include that there is no product after the fetching
        setStoredBackendImages(response.data[0].images);
      })
      .catch((error) => {
        console.error("Error fetching product data:", error);
      });
  }, []);
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
                />
                {invalidFields.name && (
                  <span className="error-message">
                    Please enter a valid image
                  </span>
                )}
              </div>
              <div className="input-box">
                <div className="img-container" onClick={handleOpenImg}>
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
              <button type="submit" disabled={uploadImage}>
                save
              </button>
            </div>
            {error && (
              <div className="error">
                <span>{error}</span>
              </div>
            )}
            <div className="img-show"> {showImages}</div>
            <div className="img-show"> {showBackendImages}</div>
          </form>
        </div>
      )}
    </>
  );
};

export default Product;
