import { createContext,  useState } from "react";
export const CountHandleContext = createContext("");
export default function CountHandler({ children }) {
    const [cartCount, setCartCount] = useState(0);
  return (
    <CountHandleContext.Provider value={{cartCount, setCartCount}}>{children}</CountHandleContext.Provider>
  );
}
