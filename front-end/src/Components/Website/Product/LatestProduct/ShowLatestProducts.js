import React, { useContext, useRef } from 'react';
import "./LatestProducts.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar as solidStar,
  faShoppingBasket,
} from "@fortawesome/free-solid-svg-icons";
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";
import { useNavigate } from "react-router-dom";
import AddToCart from "../../../../Pages/Website/Cart/add";
import { showToastSuccess, showToastError } from "./../Toastify";
import { CountHandleContext } from '../../../../Context/CountHandler';
import Cookie from "cookie-universal";
export default function ShowLatestProducts(props) {
  const navigate = useNavigate();
  const numOfStars = Math.ceil(props.rating);
  const quantityRef = useRef(1);
  const cookies = Cookie();
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

  const handleAddToCart = async () => {
    try {
      let cart_items = cookies.get('cart_items');
      if (cart_items === undefined) {
        cart_items = [];
      }
      await AddToCart(props.product, quantityRef.current, setCartCount, cart_items, props.price-props.discount);

      showToastSuccess('Item added to cart successfully');
    } catch (error) {
      console.error('Error adding product to cart:', error);
      showToastError('Failed to add item to cart');
    }
  };
  

 
  return (
    <div className="latestProduct">
      <h4>{props.title}</h4>
      <div className="image-latest">
        <img src={props.image} alt={props.title} />
        {props.sale && <div className="sale">Sale</div>}
      </div>
      <p>{props.description}</p>
      <div className="price-container">
        <h5>{props.price-props.discount}$</h5>
        <FontAwesomeIcon icon={faShoppingBasket} className="basket-icon" />
      </div>
      <ul>
        {goldStars}
        {emptiedStars}
      </ul>
      <button className="buy-1" onClick={handleAddToCart}>
        Add to Cart
      </button>
    </div>
  );
}
