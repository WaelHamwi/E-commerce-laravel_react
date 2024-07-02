import { createContext, useState } from "react";
export const DeleteHandleContext = createContext("");
export default function DeleteHandler({ children }) {
  const [deleteRecord, setDetleteRecord] = useState();
  return (
    <DeleteHandleContext.Provider value={{ deleteRecord, setDetleteRecord }}>
      {children}
    </DeleteHandleContext.Provider>
  );
}
