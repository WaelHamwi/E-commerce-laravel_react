import { createContext, useEffect, useState } from "react";
export const WindowHandleContext = createContext(null);
export default function WindowHandler({ children }) {
  const [windowSize, setWindowSize] = useState(window.innerWidth);
  useEffect(() => {
    function handleResize() {
      setWindowSize(window.innerWidth);
    }
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <WindowHandleContext.Provider value={{ windowSize }}>
      {children}
    </WindowHandleContext.Provider>
  );
}
