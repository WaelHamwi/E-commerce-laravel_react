import React, { useContext, useEffect, useState } from "react";
import { faBars, faClose, faSearch } from "@fortawesome/free-solid-svg-icons";
import {
  faGithub,
  faFacebook,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Navigation.css";
import logo from "./../../../Assets/logo.webp";
import {
  API_BASE_URL,
  LOGOUT,
  CATEGORIES,
  USER,
  CART,
  PRODUCT,
} from "../../../Api/Api";
import Axios from "../../../Api/Axios";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Slicing from "../../../helpers/Slicing";
import { WebsiteMenuContext } from "../../../Context/WebsiteMenuHandler";
import Skeleton from "react-loading-skeleton";
import Cookie from "cookie-universal";
import axios from "axios";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { CountHandleContext } from "../../../Context/CountHandler";
import { SearchContext } from "../../../Context/SearchHandler";

export default function Navigation() {
  const cookie = Cookie();
  const [authUserName, setAuthUser] = useState("");
  const [userRole, setUserRole] = useState("");
  const [categories, setCategories] = useState([]);
  const { isOpened, setOpenMenu } = useContext(WebsiteMenuContext);
  const accessToken = cookie.get("bearer");
  const { cartCount } = useContext(CountHandleContext);
  const navigate = useNavigate();
  const slicedAuthUserName =
    authUserName.length > 8 ? authUserName.slice(0, 7) : authUserName;
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const { filteredData, setFilteredData } = useContext(SearchContext);
  useEffect(() => {
    Axios.get(`${CATEGORIES}`)
      .then((response) => {
        setCategories(response.data.slice(-3));
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  }, []);

  const slicedCategories = categories.map((item) => (
    <p key={item.id}>{Slicing(item.title, 1, 8)}</p>
  ));

  const CategorySkeleton = () => (
    <div className="categories-skelton-nav">
      <p>
        <Skeleton height={20} width={80} />
      </p>
    </div>
  );

  const handleLogout = async (e) => {
    const selectedValue = e.target.value;
    if (selectedValue === "logout") {
      try {
        await Axios.get(`/${LOGOUT}`);
        cookie.remove("bearer");
        cookie.remove("cart_items");
        navigate("/login");
      } catch (error) {
        console.log(error);
      }
    } else if (selectedValue === "orders") {
      navigate("/orders");
    } else if (selectedValue === "/login") {
      navigate("/login");
    } else if (selectedValue === "dashboard") {
      navigate("/dashboard");
    }
  };

  const handleLogoutList = async () => {
    try {
      await Axios.get(`/${LOGOUT}`);
      cookie.remove("bearer");
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (!accessToken) {
        return;
      }

      try {
        const response = await axios.get(`${API_BASE_URL}/${USER}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (response.data) {
          setAuthUser(response.data.name);
          setUserRole(response.data.role);
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          console.warn(
            "User is not authenticated. Allowing page to continue loading."
          );
        } else {
          console.error("An unexpected error occurred:", error);
        }
      }
    };

    fetchUserData();
  }, [accessToken]);

  const handleSearchSubmit = async (e) => {
    if (e) {
      e.preventDefault();
    }

    try {
      const response = await Axios.post(`${PRODUCT}/search`, {
        title: searchQuery,
      });
      setFilteredData(response.data);
    } catch (error) {
      console.error("Error performing search:", error);
    } finally {
      setSearching(false);
    }
  };

  /**************************************delay search to not do many request ******************************************/
  useEffect(() => {
    const delayTimer = setTimeout(() => {
      if (searchQuery.length > 0) {
        setSearching(true);
        handleSearchSubmit();
      } else {
        setFilteredData([]);
      }
    }, 400);

    return () => clearTimeout(delayTimer);
  }, [searchQuery, setFilteredData]);
  return (
    <>
      <header className="nav">
        <div className="nav-items">
          <input type="checkbox" name="" id="check" onClick={handleOpenMenu} />
          <div className="logo">
            <img src={logo} alt="Logo" />
          </div>
          <div className="search-box">
            <form onSubmit={(e) => handleSearchSubmit(e)}>
              <input
                type="text"
                name="search"
                id="search"
                placeholder="search"
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSearching(true);
                }}
              />
              <button type="submit">
                <FontAwesomeIcon icon={faSearch} />
              </button>
            </form>
          </div>
          <div className="cart">
            <Link to="/cart" className="cart-link">
              <FontAwesomeIcon icon={faShoppingCart} /> Cart
              {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
            </Link>
          </div>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/contact">Contact</Link>
            </li>
            {authUserName ? (
              <li className="logout-list">
                <a onClick={handleLogoutList}>Logout</a>
              </li>
            ) : (
              <li className="logout-list">
                <a href="/login">Login</a>
              </li>
            )}
            <div className="social-media">
              <li>
                <a
                  className="social-link github"
                  href="https://github.com/WaelHamwi"
                >
                  <FontAwesomeIcon icon={faGithub} />
                </a>
              </li>
              <li>
                <a
                  className="social-link facebook"
                  href="https://www.facebook.com/profile.php?id=100025933565494"
                >
                  <FontAwesomeIcon icon={faFacebook} />
                </a>
              </li>
              <li>
                <a
                  className="social-link instagram"
                  href="https://www.instagram.com/wael_hamwi_/"
                >
                  <FontAwesomeIcon icon={faInstagram} />
                </a>
              </li>
            </div>
          </ul>
          {authUserName ? (
            <div className="select-logout">
              <select value={authUserName} onChange={handleLogout}>
                <option value={authUserName} disabled>
                  {slicedAuthUserName}
                </option>
                <option value="logout">Logout</option>
                <option value="orders">orders</option>
                {(userRole === "1" || userRole === "2") && (
                  <option value="dashboard">dashboard</option>
                )}
              </select>
            </div>
          ) : (
            <div className="select-logout">
              <select value="" onChange={handleLogout}>
                <option value="" disabled>
                  Select
                </option>
                <option value="/login">Log in</option>
              </select>
            </div>
          )}
          <div className="menu">
            <label htmlFor="check">
              <FontAwesomeIcon icon={isOpened ? faClose : faBars} />
            </label>
          </div>
        </div>
        <div className="categories-show">
          {categories.length > 0 ? (
            slicedCategories
          ) : (
            <div>
              <CategorySkeleton />
              <CategorySkeleton />
              <CategorySkeleton />
            </div>
          )}
          <NavLink
            className="all-categories"
            activeClassName="active"
            to="/categories"
          >
            All Categories
          </NavLink>
        </div>
      </header>
    </>
  );

  function handleOpenMenu() {
    setOpenMenu((prevIsOpened) => !prevIsOpened);
  }
}
