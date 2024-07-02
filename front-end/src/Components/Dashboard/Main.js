import {
  faShoppingCart,
  faChartPie,
  faBarChart,
  faChartLine,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import Axios from "../../Api/Axios";
import { ORDERS } from "../../Api/Api";
import Slicing from "../../helpers/Slicing";

export const Main = () => {
  const [latestOrders, setLatestOrders] = useState([]);
  const [totalOrderPrices, setTotalOrderPrices] = useState(null);
  const [latestUpdatedOrder, setLatestUpdatedOrder] = useState(null);
  const [numberOfOrders, setNumberOfOrders] = useState(null);
  const [ordersPaid, setOrdersPaid] = useState(null);
  const [ordersUnpaid, setOrdersUnpaid] = useState(null);
  const [totalProducts, setTotalProducts] = useState(null);
  const [totalCategories, setTotalCategories] = useState(null);
  const [totalUsers, setTotalUsers] = useState(null);
  const [orderItemsQuantity, setOrderItemsQuantity] = useState(null);
  const [loading, setLoading] = useState(true); // State to track loading state

  useEffect(() => {
    Axios.get(`/${ORDERS}/OrdersDetails`)
      .then((response) => {
        const data = response.data;
        setTotalOrderPrices(data.totalOrderPrices || 0);
        setLatestOrders(data.latestOrders || []);
        setLatestUpdatedOrder(
          data.latestUpdatedOrder
            ? Slicing(data.latestUpdatedOrder.updated_at, 0, 10)
            : "No update date available"
        );
        setNumberOfOrders(data.ordersNumber || 0);
        setOrdersPaid(data.ordersPaid || 0);
        setOrdersUnpaid(data.ordersUnpaid || 0);
        setTotalProducts(data.productsNumber || 0);
        setTotalCategories(data.categoriesNumber || 0);
        setTotalUsers(data.usersNumber || 0);
        setOrderItemsQuantity(data.orderItemsQuantity || 0);
        setLoading(false); // Set loading to false once data is fetched
      })
      .catch((error) => {
        console.error("Error fetching order data:", error);
        setLoading(false); // Set loading to false on error
      });
  }, []);

  // Render loading spinner or content based on loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <main className="analytics">
     
      <div className="insights">
        <div className="sales">
          <FontAwesomeIcon icon={faChartLine} />
          <div className="middle">
            <div className="left">
              <h4>Total Income</h4>
              <div className="divider"></div>
              <h2>{totalOrderPrices !== null ? `${totalOrderPrices} $` : "No income data"}</h2>
              <h4>Total Orders Sale</h4>
              <div className="divider"></div>
              <h2>{orderItemsQuantity !== null ? orderItemsQuantity : "No order item data"}</h2>
            </div>
          </div>
          <div>
            <small className="text-muted">
              {latestUpdatedOrder ? latestUpdatedOrder : "No update date available"}
            </small>
          </div>
        </div>

        <div className="expenses">
          <FontAwesomeIcon icon={faBarChart} />
          <div className="middle">
            <div className="left">
              <h4>Total Orders</h4>
              <div className="divider"></div>
              <h2>{numberOfOrders !== null ? numberOfOrders : "No orders data"}</h2>
              <h4>Unpaid Orders</h4>
              <div className="divider"></div>
              <h2>{ordersUnpaid !== null ? ordersUnpaid : "No unpaid orders data"}</h2>
              <h4>Paid Orders</h4>
              <div className="divider"></div>
              <h2>{ordersPaid !== null ? ordersPaid : "No paid orders data"}</h2>
            </div>
          </div>
          <div>
            <small className="text-muted">
              {latestUpdatedOrder ? latestUpdatedOrder : "No update date available"}
            </small>
          </div>
        </div>

        <div className="income">
          <FontAwesomeIcon icon={faChartPie} />
          <div className="middle">
            <div className="left">
              <h4>Total Products</h4>
              <div className="divider"></div>
              <h2>{totalProducts !== null ? totalProducts : "No products data"}</h2>
              <h4>Total Categories</h4>
              <div className="divider"></div>
              <h2>{totalCategories !== null ? totalCategories : "No categories data"}</h2>
              <h4>Total Users</h4>
              <div className="divider"></div>
              <h2>{totalUsers !== null ? totalUsers : "No users data"}</h2>
            </div>
          </div>
        </div>
      </div>
      <h2 className="orders-title">Latest Orders</h2>
      <div className="orders">
        {latestOrders.length === 0 ? (
          <p>No orders found</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>User Name</th>
                <th>Product Price</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {latestOrders.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.user_name || "N/A"}</td>
                  <td>{item.total_price || "N/A"}</td>
                  <td
                    className={
                      item.status === "paid" ? "active-order" : "passive-order"
                    }
                  >
                    {item.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
};
