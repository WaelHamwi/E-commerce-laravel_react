import React, { useState, useEffect } from "react";
import "./Categories.css";
import { CATEGORIES } from "./../../../Api/Api";
import Axios from "./../../../Api/Axios";
import Slicing from "../../../helpers/Slicing";
import Skeleton from "react-loading-skeleton";
import defaultProduct from "./../../../Assets/default_product.png"
export default function CategoriesShow() {
  const [categories, setCategories] = useState([]);
 
  console.log(categories);
  const [loadingSkelton, setLoadingSkelton] = useState(true);
  useEffect(() => {
    Axios.get(`${CATEGORIES}`)
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      })
      .finally(() => {
        setLoadingSkelton(false);
      });
  }, []);

  // Skeleton loading items for category card
  const skeletonCategories = Array.from({ length: 10 }, (_, index) => (
    <div key={index} className="category-card ">
      <Skeleton height={150} />
      <div className="card-content">
        <Skeleton height={20} width={100} />
        <Skeleton height={20} width={200} />
        <Skeleton height={20} width={100} />
      </div>
    </div>
  ));

  return (
    <div className="categoriesPage-wrapper" >
      {loadingSkelton ? (
        skeletonCategories
      ) : (
        categories.map((category) => (
          <div key={category.id} className="category-card">
            <img
              src={category.image.length > 0 ? category.image : defaultProduct}
              alt={category.title}
              className="category-image"
            />
            <div className="card-content">
              <h3 className="card-title">{category.title}</h3>
              <p className="category-description">
                {category.description
                  ? Slicing(category.description, 1, 50)
                  : "No description for this category"}
              </p>
              <a href={`categories/${category.id}`} className="button">
                Learn More
              </a>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

