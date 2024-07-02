import React, { useContext, useEffect, useState } from "react";
import Axios from "../../../Api/Axios";
import { PRODUCT, PRODUCTS } from "../../../Api/Api";
import LoadingSpinner from "../../../Components/Loading/loadingSpinner";
import DataTable from "../../../Components/Dashboard/Table";

export default function Products() {
  /*************************************bring all available products*****************************************************/
  const [products, setProducts] = useState([]);
  /*************************************set loading*****************************************************/
  const [loading, setLoading] = useState(false);

  /*************************************handle the case of no Prouducts found*****************************************************/
  const [noProductsFound, setNoProductsFound] = useState(false);
  /***************************************************handle the pagination case*************************************************************** */
  const [limitDataShow, setLimitDataShow] = useState(5);
  const [pagesToShow, setPagesToShow] = useState(1);
  const [totalData,setTotalData]=useState();
  const Header = [
    {
      key: "id",
      name: "Id",
    },
    {
      key: "title",
      name: "Title",
    },
    {
      key: "images",
      name: "Image",
    },
    {
      key: "description",
      name: "Description",
    },
    {
      key: "price",
      name: "price",
    },
    {
      key: "created_at",
      name: "created at",
    },
  ];

  /*************************************1- show  all categories****************************************/
  useEffect(() => {
    setNoProductsFound(true);
    Axios.get(`/${PRODUCTS}`, {
      params: {
        limitDataShow: limitDataShow,
        page: pagesToShow,
      },
    })

      .then((response) => {
        setProducts(response.data.data);
        setTotalData(response.data.total);
        //we assign it here to include that there is no product after the fetching
      })
      .catch((error) => {
        console.error("Error fetching product data:", error);
      });
  }, [limitDataShow,pagesToShow]);

  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <DataTable
          Header={Header}
          Data={products}
          DataName={"Products"}
          Dataname={"Product"}
          noRecordsFound={noProductsFound}
          products={products}
          delete={PRODUCT}
          setDeleteRecord={setProducts}
          AddRecord={"AddProduct"}
          limitDataShow={limitDataShow}
          pagesToShow={pagesToShow}
          setPagesToShow={setPagesToShow}
          setLimitDataShow={setLimitDataShow}
          totalData={totalData}
          searchApi={PRODUCT}
        />
      )}
    </>
  );
}
