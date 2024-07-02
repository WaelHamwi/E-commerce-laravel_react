import { useContext } from "react";
import LandingPage from "../../../Components/Website/Landing/LandingPage";
import LatestProducts from "../../../Components/Website/Product/LatestProduct/LatestProduct";
import LatestSaleProducts from "../../../Components/Website/Product/LatestSaleProducts/LatestSaleProducts";
import TopRatedProducts  from "../../../Components/Website/Product/TopRatedProducts/TopRatedProducts";
import SearchHandler from "../../../Context/SearchHandler";
import { SearchContext } from "../../../Context/SearchHandler";
export default function HomePage() {
  const { filteredData } = useContext(SearchContext);
  return (
   
    <div>
      <LandingPage />
      <LatestSaleProducts />
      <div className={filteredData.length > 0 ? "centered-products" : "top-latest-products"}>
      <TopRatedProducts/>
      <LatestProducts />
      </div>

    </div>
  );
}
