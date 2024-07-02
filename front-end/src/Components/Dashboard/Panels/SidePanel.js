import "./Panels.css";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, NavLink, useNavigate } from "react-router-dom";
import defaultProfile from "../../../Assets/defaultProfile.png";
import { useContext, useEffect, useRef, useState } from "react";
import { MenuHandleContext } from "../../../Context/MenuHandler";
import { WindowHandleContext } from "../../../Context/WindowHandler";
import axios from "axios";
import { API_BASE_URL, USER } from "../../../Api/Api";
import Cookie from "cookie-universal";
import { Links } from "./Links";
import LoadingSpinner from "../../Loading/loadingSpinner";
import { ModeContext } from "../../../Context/ModeHandler";

export default function SidePanel() {
  const menuList = useRef(null);
  const listItems = useRef([]);
  const menu = useContext(MenuHandleContext);
  const isOpened = menu.isOpened;
  const window = useContext(WindowHandleContext);
  const windowSize = window.windowSize;
  const [authUserName, setAuthUser] = useState("");
  const [authUserRole, setRoleAuthUser] = useState("");
  const cookie = Cookie();
  const accessToken = cookie.get("bearer");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const ModeHandler = useContext(ModeContext);
  const isLightMode = ModeHandler.isLightMode;
  const setLightmode = ModeHandler.setLightmode;

  /*get the current user to show its name in the side bar */
  useEffect(() => {
    setLoading(true);
    axios
      .get(`${API_BASE_URL}/${USER}`, {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      })
      .then((response) => {
        setLoading(false);
        if (response && response.data) {
          setAuthUser(response.data.name);
          setRoleAuthUser(response.data.role);
        } else {
          console.error("Invalid response data:", response);
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error fetching current user data:", error);
        navigate("/login");
      });
  }, []);

  /*store the list items in the menulist to apply an event which is opposit of the event applyin on the current list item */
  useEffect(() => {
    if (menuList.current) {
      listItems.current = Array.from(menuList.current.querySelectorAll("li"));
      listItems.current.forEach((item) => {
        item.addEventListener("click", () => {
          listItems.current.forEach((li) => li.classList.remove("active"));
          item.classList.add("active");
        });
      });
    }
  }, [menuList.current]);

  return (
    <>
      <div
        className={`side-panel ${isOpened ? "active" : ""} 
            ${
              windowSize < 867
                ? !isOpened
                  ? "hideSidePanel"
                  : "showSidePanelMobile"
                : ""
            }`}
      >
        {loading ? (
          <LoadingSpinner />
        ) : (
          <ul ref={menuList} className={isLightMode ? "light-mode" : ""}>
            <>
              <div className="menulist">
                {Links.map(
                  (link, key) =>
                    link.role.includes(authUserRole) && (
                      <li key={key}>
                        <NavLink to={link.path}>
                          <div className="icon-container">
                            <FontAwesomeIcon icon={link.icon} />
                          </div>
                          <div className="text">{link.name}</div>
                        </NavLink>
                      </li>
                    )
                )}
              </div>

              <div className="bottom">
                <ul>
                  <li>
                    <a>
                      <div className="icon">
                        <div className="imgProfile">
                          <img src={defaultProfile} alt="Profile Image" />
                        </div>
                      </div>
                      <div className="text">{authUserName}</div>
                    </a>
                  </li>
                </ul>
              </div>
            </>
          </ul>
        )}
      </div>
    </>
  );
}
