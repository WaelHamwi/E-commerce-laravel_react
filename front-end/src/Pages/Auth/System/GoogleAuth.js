import axios from "axios";
import { useEffect,useContext } from "react";
import { API_BASE_URL, GOOGLE_AUTH, CART } from "../../../Api/Api";
import { useLocation } from "react-router-dom";
import Cookie from "cookie-universal";
import { CountHandleContext } from "../../../Context/CountHandler";
export default function GoogleAuth() {
  const cookie = Cookie();
  const location = useLocation();
 /***********************set the counter ************************/
 const { setCartCount } = useContext(CountHandleContext);
 /***********************set the counter ************************/
  useEffect(() => {
    async function handleGoogleAuth() {
    
      try {
        const response = await axios.get(
          `${API_BASE_URL}/${GOOGLE_AUTH}${location.search}`
        );
        console.log(response.data.access_token);
        setCartCount(response.data.count);
        const cookies = Cookie();
        let cart_items = cookies.get("cart_items");
        if (accessToken && cart_items) {
          // Create a new Axios instance with authorization header
          const AxiosAuthorized = axios.create({
            baseURL: `${API_BASE_URL}`,
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
    
          const moveCartItems = await AxiosAuthorized.post(
            `${CART}/move-cart-items`,
            { cart_items }
          );
          
          console.log("Move cart items response:", moveCartItems);
    
          if (moveCartItems.status === 200) {
            cookies.remove("cart_items");
            console.log("Cart items moved successfully");
          }
        } else {
          console.log("No access token or cart items to move");
        }
        // Redirect or navigate to appropriate dashboard based on role
  
        const accessToken = response.data.access_token;
        cookie.set("bearer", accessToken);
      } catch (error) {
        console.log(error);
      }
    }
    window.location.pathname = '/'; 
    handleGoogleAuth();
  }, []);

  return null;
}
