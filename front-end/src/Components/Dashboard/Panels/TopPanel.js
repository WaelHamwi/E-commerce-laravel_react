import { useContext, useEffect, useState } from "react";
import { MenuHandleContext } from "../../../Context/MenuHandler";
import { API_BASE_URL, LOGOUT, USER } from "../../../Api/Api";
import Cookie from "cookie-universal";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Axios from "../../../Api/Axios";
import { faMoon, faSun } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ModeContext } from "../../../Context/ModeHandler";
import { faWebAwesome } from "@fortawesome/free-brands-svg-icons";

export default function TopPanel() {
  const menu = useContext(MenuHandleContext);
  const setIsOpened = menu.setIsOpened;
  const isOpened = menu.isOpened;
  const cookie = Cookie();
  const accessToken = cookie.get("bearer");
  const [authUserName, setAuthUser] = useState("");
  const ModeHandler = useContext(ModeContext);
  const isLightMode = ModeHandler.isLightMode;
  const setLightmode = ModeHandler.setLightmode;

  const navigate = useNavigate(false);
  /*get the current user to show its name in the side bar */
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/${USER}`, {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      })
      .then((response) => {
        if (response && response.data) {
          setAuthUser(response.data.name);
        } else {
          console.error("Invalid response data:", response);
        }
      })
      .catch((error) => {
        console.error("Error fetching current user data:", error);
        navigate("/login");
      });
  }, []);

  const handleLogout = async function () {
    try {
      const response = await Axios.get(`/${LOGOUT}`);
      cookie.remove("bearer");
      window.location.pathname = "/login";
    } catch (error) {
      console.log(error);
    } finally {
    }
  };
  const toggleMode = async function () {
    setLightmode((prev) => !prev);
  };

  return (
    <div className="top-panel">
      <h3>E-commerce
      <Link to="/">
          <FontAwesomeIcon icon={faWebAwesome} />
        </Link>
      </h3>
      <div
        className={`toggle-button ${isOpened ? "active" : ""}`}
        onClick={() => setIsOpened((prev) => !prev)}
      ></div>
    
      <div className="mode-logout">
        <div className="mode-toggle" onClick={toggleMode}>
          <FontAwesomeIcon icon={isLightMode ? faMoon : faSun} />
        </div>
        <div className="select-logout">
          <select value={authUserName} onChange={() => handleLogout()}>
            <option disabled>{authUserName}</option>
            <option>log out</option>
          </select>
        </div>
      </div>
    </div>
  );
}
