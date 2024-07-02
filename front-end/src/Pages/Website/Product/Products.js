import React, { useState, useEffect,useRef, useContext } from "react";
import { PRODUCTS } from "../../../Api/Api";
import Axios from "../../../Api/Axios";
import Slicing from "../../../helpers/Slicing";
import Skeleton from "react-loading-skeleton";
import defaultProduct from "./../../../Assets/default_product.png";
import { useParams } from "react-router-dom";
import Cookie from "cookie-universal";
import AddToCart from "../Cart/add";
import { showToastError, showToastSuccess } from "../../../Components/Website/Product/Toastify";
import { CountHandleContext } from "../../../Context/CountHandler";
export default function ProductsShow() {
  const [products, setProducts] = useState([]);
  const { id } = useParams();
  const [loadingSkeleton, setLoadingSkeleton] = useState(true);
  const cookies = Cookie();
  const quantityRef = useRef(1);
  const { setCartCount } = useContext(CountHandleContext);
  useEffect(() => {
    Axios.get(`${PRODUCTS}/${id}`)
      .then((response) => {
        setProducts(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      })
      .finally(() => {
        setLoadingSkeleton(false);
      });
  }, [id]);

  const handleAddToCart = async (product) => {
    try {
      let cartItems = cookies.get('cart_items') || [];
      await AddToCart(product, quantityRef.current, setCartCount, cartItems, product.price - product.discount);
      showToastSuccess('Item added to cart successfully');
    } catch (error) {
      console.error('Error adding product to cart:', error);
      showToastError('Failed to add item to cart');
    }
  };

  // Skeleton loading items for product card
  const skeletonProducts = Array.from({ length: 10 }, (_, index) => (
    <div key={index} className="product-card">
      <Skeleton height={150} />
      <div className="card-content">
        <Skeleton height={20} width={100} />
        <Skeleton height={20} width={200} />
        <Skeleton height={20} width={100} />
      </div>
    </div>
  ));

  return (
    <div className="categoriesPage-wrapper">
      {loadingSkeleton ? (
        skeletonProducts
      ) : (
        products.map((product) => (
          <div key={product.id} className="category-card">
            <img
              src={
                product.images && product.images.length > 0
                  ? product.images[0].image
                  : defaultProduct
              }
              alt={product.title}
              className="category-image"
            />
            <div className="card-content">
              <h3 className="card-title">{product.title}</h3>
              <p className="category-description">
                {product.description
                  ? Slicing(product.description, 1, 50)
                  : "No description for this product"}
              </p>
              <button
                className="button"
                onClick={() => handleAddToCart(product)}
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
