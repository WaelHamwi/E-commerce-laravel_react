import React, { useContext, useEffect, useState } from "react";
import Axios from "../../../Api/Axios";
import { CATEGORY, CATEGORIES } from "../../../Api/Api";
import LoadingSpinner from "../../../Components/Loading/loadingSpinner";
import DataTable from "../../../Components/Dashboard/Table";

export default function Categories() {
  /*************************************bring all available categories*****************************************************/
  const [categories, setCategories] = useState([]);
  /*************************************set loading*****************************************************/
  const [loading, setLoading] = useState(false);

  /*************************************handle the case of no products found*****************************************************/
  const [noCategoriesFound, setNoCategoriesFound] = useState();
  /***************************************************handle the pagination case*************************************************************** */
  const [limitDataShow, setLimitDataShow] = useState(5);
  const [pagesToShow, setPagesToShow] = useState(1);

  const [totalData,setTotalData]=useState();
  /*************************************handle the case of no products found*****************************************************/
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
      key: "image",
      name: "Image",
    },
    {
      key: "created_at",
      name: "created at",
    },
  ];
  /*************************************1- show  all categories****************************************/
  useEffect(() => {
    Axios.get(`/${CATEGORIES}`, {
      params: {
        limitDataShow: limitDataShow,
        page: pagesToShow,
      },
    })
      .then((response) => {
        setCategories(response.data.data);
        setTotalData(response.data.total);
        setNoCategoriesFound(true); //we assign it here to include that there is no category after the fetching
      })
      .catch((error) => {
        console.error("Error fetching category data:", error);
      });
  }, [limitDataShow,pagesToShow]);

  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <DataTable
          Header={Header}
          Data={categories}
          DataName={"Categories"}
          Dataname={"Category"}
          noRecordsFound={noCategoriesFound}
          categories={categories}
          delete={CATEGORY}
          setDeleteRecord={setCategories}
          AddRecord={"AddCategory"}
          limitDataShow={limitDataShow}
          pagesToShow={pagesToShow}
          setPagesToShow={setPagesToShow}
          setLimitDataShow={setLimitDataShow}
          totalData={totalData}
          searchApi={CATEGORY}
        />
      )}
    </>
  );
}
