import React, { useState, useEffect, useContext } from "react";
import "./cart.css";
import { API_BASE_URL, CART, PRODUCT } from "../../../Api/Api";
import Cookie from "cookie-universal";
import axios from "axios";
import defaultProductImage from "./../../../Assets/default_product.png";
import { CountHandleContext } from "../../../Context/CountHandler";
import {
  showToastSuccess,
  showToastError,
} from "../../../Components/Website/Product/Toastify";
import Axios from "../../../Api/Axios";
import { Elements, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { toast } from "react-toastify";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const cookies = Cookie();
  const cart_items = cookies.get("cart_items") || [];
  const [productsFullDetails, setProductsDetails] = useState([]);
  const { setCartCount } = useContext(CountHandleContext);
  const accessToken = cookies.get("bearer");
  const [publishKey, setPublishKey] = useState(null);
  const stripePromise = publishKey ? loadStripe(publishKey) : null;

  useEffect(() => {
    fetchCartData();
  }, []);

  useEffect(() => {
    setCartItems(
      combinedItems.map((item) => ({
        ...item,
        visibleQuantity: item.quantity,
      }))
    );
  }, []);

  const fetchCartData = async (totalItemsAfterUpdating) => {
    try {
      let response;
      if (accessToken) {
        response = await axios.get(`${API_BASE_URL}/${CART}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setTotal(response.data.total);
        console.log(response);
      } else {
        response = await axios.get(`${API_BASE_URL}/${CART}`, {
          params: { cart_items },
        });
      }
      const cartItemsArray = Object.values(response.data.cart_items);
      const totalItems = cartItemsArray.reduce((total, item) => {
        return total + parseInt(item.quantity, 10);
      }, 0);
      const fetchedCartItems = Array.isArray(response.data.cart_items)
        ? response.data.cart_items
        : [];
      const fetchedProducts = Array.isArray(response.data.products)
        ? response.data.products
        : [];
      if (accessToken) {
        setCartItems(fetchedCartItems);
      }
      setProductsDetails(fetchedProducts);
      setCartCount(
        totalItemsAfterUpdating ? totalItemsAfterUpdating : totalItems
      );
      if (response.data.url) {
        toast.success("Redirecting to payment page...");
        setCartCount(0);
      }
    } catch (error) {
      console.error("Error fetching cart data:", error);
    }
  };

  const totalAmount =
    cart_items && cart_items.length > 0
      ? cart_items.reduce((sum, item) => sum + item.price * item.quantity, 0)
      : productsFullDetails.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );

  const handleRemoveFromCart = async (productId) => {
    const cartItem = (
      cart_items && cart_items.length > 0 ? cart_items : cartItems
    ).find((item) => item.product_id === productId);
    const cartItemQuantity = cartItem ? cartItem.quantity : "Unknown Item";
    try {
      const updatedCartItems = cart_items.filter(
        (item) => item.product_id !== productId
      );

      const totalItemsAfterUpdating = updatedCartItems.reduce((total, item) => {
        return total + parseInt(item.quantity, 10);
      }, 0);

      cookies.set("cart_items", updatedCartItems);
      if (cartItems.length > 1 && accessToken) {
        const response = await Axios.delete(`${CART}/remove/${PRODUCT}`, {
          params: {
            product_id: productId,
          },
        });
      }

      fetchCartData(totalItemsAfterUpdating);
      showToastSuccess(
        cartItemQuantity > 1
          ? `${cartItemQuantity} items deleted from cart successfully`
          : `Item deleted from cart successfully`
      );
    } catch (error) {
      console.error("Error deleting cart:", error);
      showToastError(
        cartItemQuantity + " " + "Item failed delete from cart successfully"
      );
    }
  };

  const handleUpdateQuantity = async (productId, quantity) => {
    try {
      if (quantity <= 0) {
        handleRemoveFromCart(productId);
        return;
      }

      const updatedCartItems = cart_items.map((item) =>
        item.product_id === productId ? { ...item, quantity } : item
      );

      cookies.set("cart_items", updatedCartItems);

      if (accessToken) {
        const payload = { quantity, productId };
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        };

        const response = await axios.put(
          `${API_BASE_URL}/${CART}/update-quantity/${PRODUCT}`,
          payload,
          { headers }
        );

        fetchCartData(response.data.count);
      } else {
        const totalItemsAfterUpdating = updatedCartItems.reduce(
          (total, item) => total + parseInt(item.quantity, 10),
          0
        );

        setCartCount(totalItemsAfterUpdating);
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const combinedItems = cartItems.length > 0
  ? cartItems.map((cartItem) => {
      const productDetails = productsFullDetails.find(
        (product) => product.id === cartItem.product_id
      );
      return {
        ...cartItem,
        ...(productDetails || {}), 
      };
    })
  : [...cart_items];  




  const handleVisibleQuantityChange = (productId, newQuantity) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.product_id === productId
          ? { ...item, visibleQuantity: newQuantity }
          : item
      )
    );

    handleUpdateQuantity(productId, newQuantity);
  };
  
  console.log(combinedItems);
  console.log(cartItems);
  console.log(cart_items);
  console.log(productsFullDetails);


  return (
    <Elements stripe={stripePromise}>
      <CartContent
        publishKey={publishKey}
        combinedItems={combinedItems}
        cartItems={cartItems}
        total={total}
        totalAmount={totalAmount}
        handleVisibleQuantityChange={handleVisibleQuantityChange}
        handleRemoveFromCart={handleRemoveFromCart}
        accessToken={accessToken}
        setPublishKey={setPublishKey}
        stripePromise={stripePromise}
        fetchCartData={fetchCartData}
      
      />
    </Elements>
  );
}

function CartContent({
  cartItems,
  combinedItems,
  total,
  totalAmount,
  handleVisibleQuantityChange,
  handleRemoveFromCart,
  accessToken,
  stripePromise,
  setPublishKey,
  fetchCartData,

}) {
  const stripe = useStripe();
  const elements = useElements();

  const handleCheckout = async () => {
    const amount = total;

    try {
      const response = await axios.post(
        `${API_BASE_URL}/checkout/process`,
        { amount, cartItems },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      const URL = response.data.url;
    
      window.open(URL, "_blank");
      console.log(response);

      if (response.data.success_sign === true) {
        toast.success("orders have beed added successfully");
        fetchCartData();
      }
      const { client_secret, publishable_key, line_items } = response.data;
      setPublishKey(publishable_key);
      const stripe = await stripePromise;

      const paymentMethod = {
        type: "card",
      };

      const { error, paymentIntent } = await stripe.confirmCardPayment(
        client_secret,
        {
          payment_method: {
            billing_details: {
              name: "John Doe",
              email: "john.doe@example.com",
              address: {
                line1: "123 Main Street",
                city: "Anytown",
                postal_code: "12345",
                state: "CA",
                country: "US",
              },
            },
          },
          line_items: line_items,
        }
      );

      if (error) {
        console.error(error.message);
      } else {
        if (paymentIntent.status === "succeeded") {
          alert("wqeqwe");
          console.log("Payment succeeded!");
          window.open("/checkout/success", "_blank");
        }
      }
    } catch (error) {
      console.error("Error during checkout process:", error);
      window.open("/checkout/cancel", "_blank");
    }
  };

  const [successData, setSuccessData] = useState(null);
  const [error, setError] = useState(null);
  const headers = {
    "Content-Type": "application/json",
  };
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }
 
 

  return (
    <>
      <div className="cart-body">
        <div className="cart-container">
          <div className="row">
            <div className="col-md-8 cart">
              <div className="title">
                <div className="row">
                  <div className="col">
                    <h4>
                      <b>Shopping Cart</b>
                    </h4>
                  </div>
                  <div className="col align-self-center text-right text-muted">
                    {combinedItems.length} items
                  </div>
                </div>
              </div>
              {combinedItems.length > 0 ? (
                combinedItems.map((item) => (
                  <>
                    <div className="divider"></div>
                    <div className="col flex">
                      <span
                        className="close border"
                        onClick={() => handleRemoveFromCart(item.product_id)}
                      >
                        &#10005;
                      </span>
                    </div>
                    <div
                      key={item.product_id}
                      className="row border-top border-bottom main align-items-center"
                    >
                      <div className="col-2">
                        <img
                          className="img-fluid"
                          src={item.images?.[0]?.image || defaultProductImage}
                          alt={item.name}
                        />
                      </div>
                      <div className="col">
                        <div className="row text-muted">{item.name}</div>
                        <div className="row">{item.description}</div>
                      </div>
                      <div className="flex increament">
                        <div className="col quantity-container">
                          <input
                            type="hidden"
                            className="border hidden-quantity"
                            id={`hidden-quantity-${item.product_id}`}
                            value={item.quantity}
                            readOnly
                          />
                          <input
                            type="number"
                            className="border quantity"
                            value={item.visibleQuantity || item.quantity}
                            onChange={(e) =>
                              handleVisibleQuantityChange(
                                item.product_id,

                                e.target.value
                              )
                            }
                            min="0"
                          />
                        </div>
                        <div className="col">
                          &euro; {item.price ?? item.price.toFixed(2)}{" "}
                        </div>
                      </div>
                    </div>
                  </>
                ))
              ) : (
                <div className="empty-cart-message">
                  <h5>Your cart is currently empty.</h5>
                  <div className="back-to-shop">
                    <a href="#">&leftarrow;</a>
                    <span className="text-muted">Back to shop</span>
                  </div>
                </div>
              )}
            </div>
            <div className="col-md-4 summary">
              <div>
                <h5>
                  <b>Summary</b>
                </h5>
              </div>
              <hr />

              <div
                className="row"
                style={{
                  borderTop: "1px solid rgba(0,0,0,.1)",
                  padding: "2vh 0",
                }}
              >
                <div className="col">TOTAL PRICE</div>
                <div className="col text-right">
                  &euro; {total ? total : totalAmount.toFixed(2)}
                </div>
              </div>
              <div className="col">
                {accessToken ? (
                  <button className="btn btn-primary" onClick={handleCheckout}>
                    CHECKOUT
                  </button>
                ) : (
                  <button disabled className="btn btn-danger">
                    You need to login to checkout
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
