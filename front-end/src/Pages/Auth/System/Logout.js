import axios from "axios";
import { API_BASE_URL, LOGOUT } from "../../../Api/Api";
import Cookie from "cookie-universal";
import { useNavigate } from "react-router-dom";
import Axios from "../../../Api/Axios";

export default function Logout() {
  const navigate = useNavigate();
  const cookie = Cookie();
  const accessToken = cookie.get("bearer");
  async function handleLogout() {
    try {
      cookie.remove('cart_items')
      const response = await Axios(`/${LOGOUT}`);
    
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  }
  return <button className="Logout" onClick={handleLogout}>Logout Page</button>;
}
