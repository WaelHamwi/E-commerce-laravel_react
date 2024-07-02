import Axios from "../../../../Api/Axios";
import { TOPRATEDPRODUCTS } from "../../../../Api/Api";
import "./TopRatedProducts.css"
import { useEffect, useState,useContext } from "react";
import Slicing from "../../../../helpers/Slicing";
import Skeleton from "react-loading-skeleton";
import ShowTopRatedProducts from "./ShowTopRatedProducts"
import defaultProductImage  from "../../../../Assets/default_product.png";
import { SearchContext } from "../../../../Context/SearchHandler";
export default function TopLatestProducts() {
  const [topRatedProducts, setLatestProduct] = useState([]);
  const [loadingSkelton, setLoadingSkelton] = useState(true);
  const { filteredData } = useContext(SearchContext);
  useEffect(() => {
    Axios.get(TOPRATEDPRODUCTS)
      .then(response => {
        setLatestProduct(response.data);
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => {
        setLoadingSkelton(false); 
      });
  }, []);

  const topRatedProductResult = topRatedProducts.length > 0 ? topRatedProducts.map((product) => (
    <ShowTopRatedProducts
      key={product.id}
      title={product.title}
      price={product.price}
      id={product.id} 
      product={product}
      image={product.images && product.images.length > 0 ? product.images[0].image :defaultProductImage}
      description={
        product.description.length > 70
          ? Slicing(product.description, 1, 70)
          : product.description
      }
      sale
      discount={product.discount}
      rating={product.average_rating}
    />
  )) : null;
  

  const skeletonItems = Array.from({ length: 8 }, (_, index) => (
    <div className="topRatedProduct" key={index}>
      <Skeleton  width={200} height={200} />
      <div className="price-container-topRated">
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
      <div className="gallery-topRated">
      <h2 className="topRated-title">Top Rated Products</h2>
        {loadingSkelton ? (
          <div className="skelton-show">
            {/* Skeleton loading items */}
            {skeletonItems}
          </div>
        ) : (
           topRatedProductResult 
        )}
      </div>
    </>
  );
}