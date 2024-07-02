import axios from "axios";
import { API_BASE_URL } from "./Api";
import Cookie from "cookie-universal";

const cookie = Cookie();
const accessToken = cookie.get("bearer");

const Axios = axios.create({
  baseURL: `${API_BASE_URL}`,
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
});

export default Axios;
