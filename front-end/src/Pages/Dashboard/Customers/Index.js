import React, { useEffect, useState } from "react";
import Axios from "../../../Api/Axios";
import { API_BASE_URL, CUSTOMER, CUSTOMERS } from "../../../Api/Api";
import LoadingSpinner from "../../../Components/Loading/loadingSpinner";
import Cookie from "cookie-universal";
import axios from "axios";
import DataTable from "../../../Components/Dashboard/Table";

export default function Customers() {
  /*************************************bring all available customers*****************************************************/
  const [customers, setCustomers] = useState([]);
  /*************************************set loading*****************************************************/
  const [loading, setLoading] = useState(false);

  const cookie = Cookie();
  const accessToken = cookie.get("bearer");

  /*************************************handle the case of no customers found*****************************************************/
  const [noCustomersFound, setNoCustomersFound] = useState();

  /***************************************************handle the pagination case*************************************************************** */
  const [limitDataShow,setLimitDataShow] = useState(4);
  const [pagesToShow, setPagesToShow] = useState(1);
  const [totalData,setTotalData]=useState();

  const Header = [
    {
      key: "id",
      name: "Id",
    },
    {
      key: "first_name",
      name: "Name",
    },
    {
      key: "last_name",
      name: "lastName",
    },
    {
      key: "status",
      name: "status",
    },
    {
      key: "created_at",
      name: "created at",
    },
  ];

  /*************************************1- show  all customers****************************************/
  useEffect(() => {
    Axios.get(`/${CUSTOMERS}/index?limitDataShow=${limitDataShow}&page=${pagesToShow}`)
      .then((response) => {
        setCustomers(response.data.data);
        setTotalData(response.data.total);
        setNoCustomersFound(true); //we assign it here to include that there is no customer after the fetching
      })
      .catch((error) => {
        console.error("Error fetching customer data:", error);
      });
  }, [limitDataShow,pagesToShow]);

 



  return loading ? (
    <LoadingSpinner />
  ) : (
    <DataTable
      Header={Header}
      Data={customers}
      DataName={"customers"}
      Dataname={"customer"}
      noRecordsFound={noCustomersFound}
      customers={customers}
      delete={CUSTOMER}
      setDeleteRecord={setCustomers}
      AddRecord={"AddCustomer"}
      limitDataShow={limitDataShow}
      pagesToShow={pagesToShow}
      setPagesToShow={setPagesToShow}
      setLimitDataShow={setLimitDataShow}
      totalData={totalData}
      searchApi={CUSTOMER}
      view={true}
    />
  );
}
