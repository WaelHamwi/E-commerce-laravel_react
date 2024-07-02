import { Outlet } from "react-router-dom";
import Navigation from "../../Components/Website/Navigation/Navigation";
import { WebsiteMenuContext } from "../../Context/WebsiteMenuHandler";
import { useContext } from "react";
import Footer from "../../Components/Website/Footer/Footer";

export default function Website() {
  const { isOpened } = useContext(WebsiteMenuContext);

  return (
    <>
      <Navigation />
      <div style={{ marginTop: "170px", display: isOpened ? "none" : "block" }}>
        <Outlet />
        <Footer />
      </div>
      
    </>
  );
}
