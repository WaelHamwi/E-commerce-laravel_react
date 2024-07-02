import React, { useEffect, useState } from "react";
import Axios from "../../../Api/Axios";
import { ORDER, ORDERS } from "../../../Api/Api";
import DataTable from "../../../Components/Dashboard/Table";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [limitDataShow, setLimitDataShow] = useState(5);
  const [pagesToShow, setPagesToShow] = useState(1);
  const [totalData, setTotalData] = useState();

  /*************************************handle the case of no users found*****************************************************/
  const [noOrdersFound, setNoOrdersFound] = useState();
  // Fetch the order data
  useEffect(() => {
    setNoOrdersFound(true);
    const response = Axios.get(`/${ORDERS}`, {
      params: {
        limitDataShow: limitDataShow,
        page: pagesToShow,
      },
    })
      .then((response) => {
        setOrders(response.data.orders);
        setTotalData(response.data.total);
        console.log(response);
      })
      .catch((error) => {
        console.error("Error fetching order data:", error);
      });
  }, [limitDataShow, pagesToShow]);

  const Header = [
    {
      key: "total_price",
      name: "Total Price",
    },
    {
      key: "status",
      name: "Status",
    },
    {
      key: "created_by",
      name: "Created By",
    },
    {
      key: "updated_by",
      name: "Updated By",
    },
    {
      key: "created_at",
      name: "Created At",
    },
    {
      key: "updated_at",
      name: "Updated At",
    },
  ];

  return (
    <div
      style={{
        width: "70%",
        ...(window.location.pathname !== "/dashboard/orders" && {
          marginLeft: "10%",
        }),
      }}
    >
      <DataTable
        Header={Header}
        Data={orders}
        DataName={"Orders"}
        Dataname={"Order"}
        AddRecord={"AddOrder"}
        orders={orders}
        delete={ORDER}
        setDeleteRecord={setOrders}
        limitDataShow={limitDataShow}
        pagesToShow={pagesToShow}
        setPagesToShow={setPagesToShow}
        setLimitDataShow={setLimitDataShow}
        searchApi={ORDER}
        noRecordsFound={noOrdersFound}
        totalData={totalData}
        view={true}
        fullWidth={true}
      />
    </div>
  );
};

export default Orders;
