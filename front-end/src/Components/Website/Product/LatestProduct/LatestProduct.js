import Axios from "../../../../Api/Axios";
import { LATESTPRODUCTS } from "../../../../Api/Api";
import Product from "./ShowLatestProducts";
import { useEffect, useState, useContext } from "react";
import Slicing from "../../../../helpers/Slicing";
import Skeleton from "react-loading-skeleton";
import defaultProductImage from "../../../../Assets/default_product.png";
import { SearchContext } from "../../../../Context/SearchHandler";

export default function LatestProducts() {
  const [latestProducts, setLatestProduct] = useState([]);
  const [loadingSkelton, setLoadingSkelton] = useState(true);
  const { filteredData } = useContext(SearchContext)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Axios.get(LATESTPRODUCTS);
        setLatestProduct(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoadingSkelton(false);
      }
    };

    fetchData();
  }, []);

  const productsToDisplay = filteredData.length > 0 ? filteredData : latestProducts;

  const latestProductResult = productsToDisplay.map((product) => (
          <Product
            key={product.id}
            id={product.id}
            product={product}
            title={product.title}
            price={product.price}
            image={
              product.images && product.images.length > 0
                ? product.images[0].image
                : defaultProductImage
            }
            description={
              product.description.length > 70
                ? Slicing(product.description, 1, 70)
                : product.description
            }
            sale
            discount={product.discount}
            rating={product.average_rating}
          />
        ));

  const skeletonItems = Array.from({ length: 4 }, (_, index) => (
    <div className="latestProduct" key={index}>
      <Skeleton width={160} height={160} />
      <div className="price-container">
        <Skeleton width={50} height={30} />
        <Skeleton width={50} height={30} />
      </div>
      <Skeleton width={100} height={20} style={{ marginLeft: "25px" }} />
    </div>
  ));
  return (
    <>
      <div className="gallery" id="latest-sale">
        <h2 className="latest-title">Latest Products</h2>
        <div className="latest-product-content">
          {loadingSkelton ? (
            <div className="skelton-show">
              {/* Skeleton loading items */}
              {skeletonItems}
            </div>
          ) : (
            latestProductResult
          )}
        </div>
      </div>
    </>
  );
}
