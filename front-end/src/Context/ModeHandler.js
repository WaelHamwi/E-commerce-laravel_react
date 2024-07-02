
import { createContext, useState } from "react";
export const ModeContext=createContext("");
export default function ModeHandler({children}){
    const [isLightMode,setLightmode]=useState(false);

   
     return (<ModeContext.Provider value={{isLightMode,setLightmode}}>{children}</ModeContext.Provider>);
}
