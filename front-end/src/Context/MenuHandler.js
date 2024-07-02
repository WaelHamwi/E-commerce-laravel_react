import { createContext,  useState } from "react";
export const MenuHandleContext = createContext("");
export default function MenuHandler({ children }) {
  const [isOpened, setIsOpened] = useState(true);
  return (
    <MenuHandleContext.Provider value={{isOpened, setIsOpened}}>{children}</MenuHandleContext.Provider>
  );
}
