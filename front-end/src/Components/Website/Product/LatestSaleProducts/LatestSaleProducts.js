import Axios from "../../../../Api/Axios";
import { LATESTSALEPRODUCTS } from "../../../../Api/Api";
import Product from "./ShowLatestSaleProducts";
import { useEffect, useState, useContext } from "react";
import Slicing from "../../../../helpers/Slicing";
import Skeleton from "react-loading-skeleton";
import defaultProductImage  from "../../../../Assets/default_product.png";
import { SearchContext } from "../../../../Context/SearchHandler";
export default function LatestSaleProducts() {
  const [latestSaleProducts, setLatestProduct] = useState([]);
  const [loadingSkelton, setLoadingSkelton] = useState(true);
  const { filteredData } = useContext(SearchContext);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Axios.get(LATESTSALEPRODUCTS);
        setLatestProduct(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoadingSkelton(false);
      }
    };

    fetchData();
  }, []);


  const latestProductResult = latestSaleProducts.map((product) => (
    <Product
      title={product.title}
      price={product.price}
      id={product.id} 
      product={product}
      description={
        product.description.length > 20
          ? Slicing(product.description, 1, 50)
          : product.description
      }
      image={
        product.images && product.images.length > 0
          ? product.images[0].image
          : defaultProductImage 
      }
      sale
      discount={product.discount}
      rating={product.average_rating}
    />
  ));
  const skeletonItems = Array.from({ length: 8 }, (_, index) => (
    <div className="latestSaleProducts" key={index}>
      <Skeleton width={160} height={160} />
      <div className="price-container">
        <Skeleton width={50} height={30} />
        <Skeleton width={50} height={30} />
      </div>
      <Skeleton width={100} height={20} />
    </div>
  ));
  if(filteredData.length>0){
    return null;
  }
  return (
    <>
      <h2 className="latest-sale-title" id="latest-sale-products">
        Latest Sale Products
      </h2>
      <div className="gallery-latestSale">
        {loadingSkelton ? (
          <div className="skelton-show">
            {/* Skeleton loading items */}
            {skeletonItems}
          </div>
        ) : (
          latestProductResult
        )}
      </div>
    </>
  );
}
