import { Children, createContext, useEffect, useState } from "react";
export const WebsiteMenuContext = createContext(null);

export default function WebsiteHandler({ children }) {
    const [isOpened, setOpenMenu] = useState(false);
    return (
        <WebsiteMenuContext.Provider value={{ isOpened, setOpenMenu }}>
            {children}
        </WebsiteMenuContext.Provider>
    );
}
