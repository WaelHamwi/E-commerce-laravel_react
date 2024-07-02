import { Outlet } from "react-router-dom";
import SidePanel from "../Components/Dashboard/Panels/SidePanel";
import TopPanel from "../Components/Dashboard/Panels/TopPanel";
import "./Dashboard.css";
import {ModeContext} from "../Context/ModeHandler";
import { useContext, useEffect, useRef } from "react";


export default function Dashboard() {
  const rootRef = useRef(null);
  const ModeHandler=useContext(ModeContext);
  const isLightMode=ModeHandler.isLightMode;

  useEffect(() => {
    const root = rootRef.current;
    root.style.setProperty('--box-shadow-color', !isLightMode ? 'var(--dark-blue)' : 'transparent');
  }, [isLightMode]);

  return (
    <div className={`Dashboard ${isLightMode ? "Dashboard-lightmode" : "Dashboard-darkmode"}`} ref={rootRef}>
      <TopPanel />
      <div className="sidePanel-users">
        <SidePanel />
        <Outlet  />
        {/* users page */}
      </div>
    </div>
  );
}
