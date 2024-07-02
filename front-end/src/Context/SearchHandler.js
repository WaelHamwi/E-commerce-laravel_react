import { createContext, useState } from "react";

export const SearchContext = createContext({
  filteredData: [],
  setFilteredData: () => {},
});

export default function SearchHandler({ children }) {
  const [filteredData, setFilteredData] = useState([]);

  return (
    <SearchContext.Provider value={{ filteredData, setFilteredData }}>
      {children}
    </SearchContext.Provider>
  );
}
