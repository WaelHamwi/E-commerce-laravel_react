import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faCode, faBriefcase } from "@fortawesome/free-solid-svg-icons";
import { PieChart } from "react-minimal-pie-chart";
import Axios from "../../Api/Axios";
import { CUSTOMER, ORDERS } from "../../Api/Api";
import LoadingSpinner from "../Loading/loadingSpinner";

export const StatisticsSide = () => {
  const [countryData, setCountryData] = useState([]);
  const [customerData, setCustomerData] = useState([]);
  const [loadingCountry, setLoadingCountry] = useState(true);
  const [loadingCustomer, setLoadingCustomer] = useState(true);

  useEffect(() => {
    fetchCountryData();
    fetchCustomerData();
  }, []);

  const fetchCountryData = async () => {
    try {
      const response = await Axios.get(`${ORDERS}/countryOrders`);
      setCountryData(response.data);
      setLoadingCountry(false);
    } catch (error) {
      console.error("Error fetching country data:", error);
    }
  };

  const pieChartData = countryData.map((dataEntry) => ({
    title: dataEntry.country,
    value: dataEntry.order_count,
    color: `#${((Math.random() * 0xffffff) << 0)
      .toString(16)
      .padStart(6, "0")}`, 
  }));

  const fetchCustomerData = async () => {
    try {
      const response = await Axios.get(`${CUSTOMER}/customer-details`);
      setCustomerData(response.data.customers);
      setLoadingCustomer(false);
    } catch (error) {
      console.error("Error fetching customer data:", error);
    }
  };

  if (loadingCountry || loadingCustomer) {
    return <LoadingSpinner />;
  }

  return (
    <div className="statistics-side">
      <h2 className="statistics-title">Statistics News</h2>

      <div className="recently">
        <h3 className="chart-title">Active Countries</h3>
        <div className="chart-container">
          <PieChart
            data={pieChartData}
            animation
            animationDuration={1000}
            animationEasing="ease-out"
            radius={42}
            lineWidth={25}
            paddingAngle={8}
            startAngle={0}
            rounded
            label={({ dataEntry }) =>
              `${dataEntry.title.slice(0, 5)}: ${Math.round(
                dataEntry.percentage
              )}%`
            }
            labelStyle={{
              fontSize: "4px",
              fontFamily: "sans-serif",
              fill: "#949294",
              textAnchor: "middle", 
              dominantBaseline: "middle",
            }}
            labelPosition={75}
            style={{ height: "300px", width: "300px" }}
          />
        </div>
      </div>
      <h2 className="statistics-title">Customers</h2>
      <div className="skills">
        {customerData.map((customer) => (
          <div className="items" key={customer.id}>
            <div className="icon">
              <FontAwesomeIcon icon={faUser} />
            </div>
            <div className="info">
              <div>
                <h4>{customer.first_name} {customer.last_name}</h4>
              </div>
              <h4 className="primary">Order Count: {customer.order_count}</h4>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
