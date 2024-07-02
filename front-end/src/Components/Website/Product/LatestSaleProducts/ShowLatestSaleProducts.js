import React, { useContext, useRef } from "react";
import "./LatestSaleProducts.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar as solidStar,
  faShoppingBasket,
} from "@fortawesome/free-solid-svg-icons";
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";
import { showToastSuccess, showToastError } from "./../Toastify";
import { CountHandleContext } from "../../../../Context/CountHandler";
import Cookie from "cookie-universal";
import AddToCart from "../../../../Pages/Website/Cart/add";

const handleAddToCart = async (product, quantityRef, setCartCount, price, discount) => {
  try {
    const cookies = Cookie();
    let cart_items = cookies.get("cart_items");
    if (cart_items === undefined) {
      cart_items = [];
    }
    await AddToCart(product, quantityRef.current, setCartCount, cart_items, price - discount);
    showToastSuccess("Item added to cart successfully");
  } catch (error) {
    console.error("Error adding product to cart:", error);
    showToastError("Failed to add item to cart");
  }
};

const ShowLatestSaleProducts = (props) => {
  const numOfStars = Math.ceil(props.rating);
  const quantityRef = useRef(1);
  const { setCartCount } = useContext(CountHandleContext);

  const goldStars = Array.from({ length: numOfStars }).map((_, index) => (
    <li key={index}>
      <FontAwesomeIcon icon={solidStar} className="solid-star" />
    </li>
  ));

  const emptiedStars = Array.from({ length: 3 - numOfStars }).map((_, index) => (
    <li key={index}>
      <FontAwesomeIcon icon={regularStar} className="regular-star" />
    </li>
  ));

  return (
    <div className="latestSaleProducts">
      <h3>{props.title}</h3>
      <div className="image-sale">
        <img src={props.image} alt={props.title} />
        {props.sale && <div className="sale">Sale</div>}
      </div>
      <p>{props.description}</p>
      <div className="price-container-sale">
        <h6>{props.price}$</h6>
        <h2>{props.price - props.discount}$</h2>
        <FontAwesomeIcon icon={faShoppingBasket} className="basket-icon" />
      </div>
      <ul>
        {goldStars}
        {emptiedStars}
      </ul>
      <button
        className="buy-1"
        onClick={() => handleAddToCart(props.product, quantityRef, setCartCount, props.price, props.discount)}
      >
        Add to cart
      </button>
    </div>
  );
};

export { handleAddToCart };
export default ShowLatestSaleProducts;
