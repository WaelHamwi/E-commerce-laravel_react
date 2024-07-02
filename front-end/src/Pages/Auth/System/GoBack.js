import React, { useEffect, useState } from "react";
import { useLocation, Outlet } from "react-router-dom";
import Cookie from "cookie-universal";

export default function GoBack() {
  const [prevPathname, setPrevPathname] = useState("");
  const location = useLocation();
  const cookie = Cookie();
  const accessToken = cookie.get("bearer");

  useEffect(() => {
    if (location.state && location.state.prevPathname) {
      setPrevPathname(location.state.prevPathname);
    }
  }, [location]);

  const handleGoBack = () => {
    if (prevPathname) {
      window.history.back();
    }
  };

  return accessToken && prevPathname !== "" ? handleGoBack() : <Outlet />;
}
