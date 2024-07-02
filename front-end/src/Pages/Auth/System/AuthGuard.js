import { Navigate, Outlet, useNavigate } from "react-router-dom";
import Cookie from "cookie-universal";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL, USER } from "../../../Api/Api";
import LoadingSpinner from "../../../Components/Loading/loadingSpinner";
import NoEntry from "../Errors/NoEntry";
export default function AuthGuard({ AuthenticatedUser }) {
  const cookie = Cookie();
  const accessToken = cookie.get("bearer");
  const [AuthUser, setAuthUser] = useState({});
  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/${USER}`, {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      })
      .then((response) => {
        if (response && response.data) {
          setAuthUser(response.data);
        
        } else {
          console.error("Invalid response data:", response);
        }
      })
      .catch((error) => {
        console.error("Error fetching current user data:", error);
        navigate("/login");
      });
  }, []);

  return accessToken ? (
    Object.keys(AuthUser).length === 0 ? (
      <LoadingSpinner />
    ) : AuthenticatedUser.includes(AuthUser.role) ? (
      <Outlet />
    ) : (
      <NoEntry role={AuthUser.role} />
    )
  ) : (
    <Navigate to={"/login"} replace={true} />
  );
}
