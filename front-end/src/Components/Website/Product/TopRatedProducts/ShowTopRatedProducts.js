import "./TopRatedProducts.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar as solidStar,
  faStarHalfAlt as halfStar,
  faShoppingBasket,
} from "@fortawesome/free-solid-svg-icons";
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";
import AddToCart from "../../../../Pages/Website/Cart/add";
import { showToastSuccess, showToastError } from "./../Toastify";
import { CountHandleContext } from '../../../../Context/CountHandler';
import Cookie from "cookie-universal";
import { useContext, useRef } from "react";
export default function ShowTopRatedProducts(props) {
  const numOfStars = Math.ceil(props.rating);
  const cookies = Cookie();
  const { setCartCount } = useContext(CountHandleContext);
  const quantityRef = useRef(1);
  const goldStars = Array.from({ length: numOfStars }).map((_, index) => (
    <li key={`goldStar_${index}`}>
      <FontAwesomeIcon icon={solidStar} className="solid-star" />
    </li>
  ));
  const emptiedStars = Array.from({ length: 3 - numOfStars }).map(
    (_, index) => (
      <li key={`emptyStar_${index}`}>
        <FontAwesomeIcon icon={regularStar} className="regular-star" />
      </li>
    )
  );
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
    <>
      <div className="topRatedProduct" id="top-rated">
        <h3>{props.title}</h3>
        <div className="image-container-topRated">
          <img src={props.image} alt={props.title} />
        </div>
        <div className="topRated-content">
          <p>{props.description}</p>
          <div className="price-container-topRated">
            <h6>{props.price}$</h6>
            <h3>{props.price-props.discount}$</h3>
            <FontAwesomeIcon icon={faShoppingBasket} className="basket-icon" />
          </div>

          <ul className="stars-topRated">
            {goldStars}
            {emptiedStars}
          </ul>
          <button className="topRated-button" onClick={handleAddToCart}>Add to cart</button>
        </div>
      </div>
    </>
  );
}
