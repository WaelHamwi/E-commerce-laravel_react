import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";
import MenuHandler from "./Context/MenuHandler";
import WindowHandler from "./Context/WindowHandler";
import DeletHandleContext from "./Context/DeleteHandler";
import ModeHandler from "./Context/ModeHandler";
import WebsiteHandler from "./Context/WebsiteMenuHandler";
import "react-loading-skeleton/dist/skeleton.css";
import  CountHandleContext  from "./Context/CountHandler";
import SearchContext  from "./Context/SearchHandler";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <SearchContext>
    <CountHandleContext>
      <WebsiteHandler>
        <ModeHandler>
          <WindowHandler>
            <MenuHandler>
              <DeletHandleContext>
                <Router>
                  <App />
                </Router>
              </DeletHandleContext>
            </MenuHandler>
          </WindowHandler>
        </ModeHandler>
      </WebsiteHandler>
    </CountHandleContext>
    </SearchContext>
  </React.StrictMode>
);
