import axios from "axios";
import { API_BASE_URL, CART, PRODUCT } from "../../../Api/Api";
import Cookie from "cookie-universal";

const AddToCart = async (
  product,
  quantity = 1,
  setCartCount,
  cart_items,
  price
) => {
  const cookies = Cookie();
  const accessToken = cookies.get("bearer");
  try {
    if (!product || isNaN(quantity) || quantity <= 0) {
      throw new Error("Invalid productId or quantity");
    }
  
    const accessToken = cookies.get("bearer");

    try {
      if (!product || isNaN(quantity) || quantity <= 0) {
        throw new Error("Invalid product or quantity");
      }
    
      let response;
      const payload = {
        quantity: quantity,
        product: product,
        cart_items: cart_items,
        price: price,
      };
    
      const headers = {
        'Content-Type': 'application/json',
      };
    
      if (accessToken) {
        headers.Authorization = `Bearer ${accessToken}`;
      }

      response = await axios.post(
        `${API_BASE_URL}/${CART}/add/${PRODUCT}`,
        payload,
        { headers }
      );
      setCartCount(response.data.count);
      cookies.set("cart_items", JSON.stringify(response.data.cart_items), {
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
      console.log('Product added to cart:', response.data);
    } catch (error) {
      console.error('Error adding product to cart:', error);
    }
  


    // Save cart items data in cookie
    
  } catch (error) {
    console.error("Error adding product to cart:", error);
    throw error;
  }
};

export default AddToCart;
