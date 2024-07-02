import {
  faEdit,
  faEye,
  faSackDollar,
  faTrash,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavLink, Link } from "react-router-dom";
import DeleteConfirmation from "./DeleteConfirmation/DeleteConfirmation";
import { DeleteHandleContext } from "../../Context/DeleteHandler";
import React, { useContext, useEffect, useState } from "react";
import Axios from "../../Api/Axios";
import LoadingSpinner from "../Loading/loadingSpinner";
import PaginatedItems from "./Pagimation/Paginnation";
import ConvertDate from "../../helpers/FormattingData";
import axios from "axios";
import { API_BASE_URL, CUSTOMER } from "../../Api/Api";
import Cookie from "cookie-universal";
import "./Modal.css";

export default function DataTable(props) {
  const [loading, setLoading] = useState();
  /*************************************store the id of the selected record to pass it to the confirmation modal*****************************************************/
  const [selectedRecordId, setSelectedRecordId] = useState(null);

  /*handle the delete process*/
  /*************************************show confirm modal*****************************************************/
  const [showConfirmation, setShowConfirmation] = useState(false);

  /*************************************use context to move info from the modal to here in case the user presses a delete or cancel button*****************************************************/
  const handleDeleteFromContext = useContext(DeleteHandleContext);
  /******************************************************************handle search and filtering*******************************************************/
  const [searchField, setSearchField] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [searching, setSearching] = useState(false);
  const [searchingByDate, setSearchDate] = useState("");
  /******************************************************************handle order*******************************************************/
  const [orderItems, setOrderItems] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  /******************************************************************customer details*******************************************************/
  const [customerDetails, setCustomerDetails] = useState([]);
  const cookies = Cookie();
  const accessToken = cookies.get("bearer");

  const filteringDataByDate = props.Data.filter(
    (record) => ConvertDate(record.created_at) === searchingByDate
  );
  const filteringDataByDateAndSearch = filteredData.filter(
    (record) => ConvertDate(record.created_at) === searchingByDate
  );

  const deleteRecord = handleDeleteFromContext.deleteRecord;
  const setDetleteRecord = handleDeleteFromContext.setDetleteRecord;

  const handleDeleteRecord = async (id) => {
    if (props.currentUserId !== id) {
      // to make sure the current user not able to delete him self (admin user)
      try {
        const response = await Axios.delete(`${props.delete}/delete/${id}`);
        props.setDeleteRecord((prevRecords) =>
          prevRecords.filter((record) => record.id !== id)
        );
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
        setSelectedRecordId(null);
        setShowConfirmation(false);
        setDetleteRecord(false); // in order if the user re-press on delete the button delete to delete another user make sure it is false the confirmation
      }
    }
  };

  useEffect(() => {
    if (deleteRecord && selectedRecordId) {
      handleDeleteRecord(selectedRecordId);
    }
  }, [deleteRecord, selectedRecordId]);

  useEffect(() => {
    if (deleteRecord === false) {
      setShowConfirmation(false);
      setDetleteRecord(null); //make it null to ensure make it false once again at the context when click on cancel
    }
  }, [deleteRecord]);

  function handleShowConfirmation(id) {
    setSelectedRecordId(id);
    setShowConfirmation(true);
  }
  /*======================================view order item for the order page============================ */
  const handleViewOrder = async (viewId) => {
    setLoading(true);
    if (props.Dataname === "customer") {
      try {
        const response = await Axios.get(`${CUSTOMER}/view/${viewId}`);

        if (response.status !== 200) {
          throw new Error("Failed to fetch data");
        }
        setCustomerDetails(response.data.customerAddress);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
        setModalOpen(true);
      }
    } else {
      try {
        const response = await Axios.get(`orders/view/${viewId}`);

        if (response.status !== 200) {
          throw new Error("Failed to fetch data");
        }

        console.log(response.data.orderItems);
        setOrderItems(response.data.orderItems);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
        setModalOpen(true);
      }
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setOrderItems([]);
  };

  const checkOut = async (orderId) => {
    setLoading(true);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/checkoutSingleItem/process/${orderId}`,
        { orderId },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.url) {
        window.open(response.data.url, "_blank");
      } else {
        console.error("No URL received from server.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };
  /*======================================view customer details============================ */
  const handleViewCustomer = async (customerId) => {
    setLoading(true);

    try {
      const response = await Axios.get(`/customers/view/${customerId}`);

      if (response.status !== 200) {
        throw new Error("Failed to fetch customer data");
      }

      setCustomerDetails(response.data.customer);
      setModalOpen(true); // Open modal or display customer details
    } catch (error) {
      console.error("Error fetching customer data:", error);
    } finally {
      setLoading(false);
    }
  };

  const Headers = props.Header.map((header) => <th>{header.name}</th>);
  const queryFinalResult =
    searchingByDate.length !== 0
      ? searchField.length > 0
        ? filteringDataByDateAndSearch
        : filteringDataByDate
      : searchField.length > 0
      ? filteredData
      : props.Data;

  const DataToShow = queryFinalResult.map(
    (
      item //item representing each record //another bracket to irerate on another map
    ) => (
      <tr key={item.id}>
        {props.Header.map((header) => (
          <td style={{ textAlign: "center" }} key={header.key}>
            {header.key === "created_at" ? (
              ConvertDate(item[header.key])
            ) : header.key === "role" ? (
              item[header.key] === "1" ? (
                "Admin"
              ) : item[header.key] === "2" ? (
                "Product Manager"
              ) : (
                "User"
              )
            ) : header.key === "name" ? (
              item[header.key] +
              (item["id"] === props.currentUserId ? " (You)" : "")
            ) : header.key === "image" && item[header.key] ? (
              <img
                width="0px"
                style={{ margin: "0 auto" }}
                height="100px"
                border="none"
                src={`${item[header.key]}`}
              />
            ) : !item[header.key] ? (
              "No images available"
            ) : header.key === "images" ? (
              <div style={{ display: "flex", justifyContent: "center" }}>
                {header.key === "images" && item[header.key]?.length > 0 ? (
                  item[header.key].map((image) => (
                    <img
                      key={image.id}
                      height={"50px"}
                      width={"50px"}
                      border="none"
                      src={`${image.image}`}
                    />
                  ))
                ) : (
                  <p style={{ textAlign: "center" }}>No images available</p>
                )}
              </div>
            ) : header.key === "status" && item[header.key] === "unpaid" ? (
              <span style={{ color: "gray" }}>{item[header.key]}</span>
            ) : header.key === "status" && item[header.key] === "paid" ? (
              <span style={{ color: "green" }}>{item[header.key]}</span>
            ) : (
              item[header.key]
            )}
          </td>
        ))}
        <td>
          {props.view && (
            <>
              <button onClick={() => handleViewOrder(item.id)}>
                <FontAwesomeIcon icon={faEye} />
              </button>
              {/*modal pop up to show orderItems */}
              {modalOpen && (
                <div className="modal-orderItems">
                  <div className="modal-content">
                    <button className="close" onClick={handleCloseModal}>
                      &times;
                    </button>
                    {loading ? (
                      <div>Loading...</div>
                    ) : (
                      <div>
                        {customerDetails && customerDetails.length > 0 && (
                          <>
                            <h2>Customer Address Details</h2>
                            <div className="customer-address-details">
                              <p>
                                <strong>Address:</strong>{" "}
                                {customerDetails[0].address1},{" "}
                                {customerDetails[0].address2}
                              </p>
                              <p>
                                <strong>City:</strong> {customerDetails[0].city}
                              </p>
                              <p>
                                <strong>State:</strong>{" "}
                                {customerDetails[0].state}
                              </p>
                              <p>
                                <strong>Zip Code:</strong>{" "}
                                {customerDetails[0].zipcode}
                              </p>
                              <p>
                                <strong>Country ID:</strong>{" "}
                                {customerDetails[0].country_id}
                              </p>
                              <p>
                                <strong>Type:</strong> {customerDetails[0].type}
                              </p>
                              <p>
                                <strong>Created At:</strong>{" "}
                                {customerDetails[0].created_at}
                              </p>
                              <p>
                                <strong>Updated At:</strong>{" "}
                                {customerDetails[0].updated_at}
                              </p>
                            </div>
                          </>
                        )}

                        {orderItems && orderItems.length > 0 && (
                          <>
                            <h2>Order Items</h2>
                            {orderItems.map((item) => (
                              <div key={item.id} className="order-group">
                                <div className="order-item">
                                  <p>
                                    <strong>Product ID:</strong>{" "}
                                    {item.product_id}
                                  </p>
                                  <p>
                                    <strong>Product image:</strong> <br />
                                    <img
                                      style={{ display: "inline-block" }}
                                      src={
                                        item.images.length > 0
                                          ? item.images[0]
                                          : ""
                                      }
                                      alt="Product Image"
                                    />
                                  </p>
                                  <p>
                                    <strong>Quantity:</strong> {item.quantity}
                                  </p>
                                  <p>
                                    <strong>Unit Price:</strong> $
                                    {item.unit_price}
                                  </p>
                                  <p>
                                    <strong>Created at:</strong>{" "}
                                    {item.created_at}
                                  </p>
                                  <p>
                                    <strong>Product Price:</strong> $
                                    {item.quantity *
                                      parseFloat(item.unit_price)}
                                  </p>
                                  <hr />
                                </div>
                              </div>
                            ))}
                          </>
                        )}

                        {!customerDetails && !orderItems && (
                          <div>No details found.</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
          <button>
            {item.status === "unpaid" ? (
              <a onClick={() => checkOut(item.id)}>
                <FontAwesomeIcon icon={faSackDollar} />
              </a>
            ) : item.status === "paid" ? (
              <span>This cannot be edited or deleted!</span>
            ) : (
              <Link to={`${item.id}`}>
                <FontAwesomeIcon icon={faEdit} />
              </Link>
            )}
          </button>

          {props.currentUserId !== item.id ? (
            item.status !== "paid" && (
              <button onClick={() => handleShowConfirmation(item.id)}>
                <FontAwesomeIcon icon={faTrash} />
              </button>
            )
          ) : (
            <button>
              <FontAwesomeIcon icon={faUserCircle} />
            </button>
          )}
        </td>
      </tr>
    )
  );
  {
    /*iterate dependin on the number of th */
  }

  /**************************************search function ******************************************/
  async function handleSearch() {
    try {
      const response = await Axios.post(
        `${props.searchApi}/search?title=${searchField}`
      );
      setFilteredData(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setSearching(false);
    }
  }
  /**************************************delay search to not do many request ******************************************/
  useEffect(() => {
    const delayTimer = setTimeout(() => {
      searchField.length > 0 ? handleSearch() : setSearching(false);
    }, 400);
    return () => clearTimeout(delayTimer);
  }, [searchField]);

  return (
    <>
      {showConfirmation && (
        <DeleteConfirmation
          onCancel={() => setShowConfirmation(false)}
          onConfirm={() => {
            handleDeleteRecord(selectedRecordId);
          }}
        />
      )}
      <div className={props.fullWidth ? "table fullWidth" : "table"}>
        <div className="tableHeader">
          <p>{props.Dataname} Details</p>
          <div>
            <input
              placeholder={props.Dataname}
              onChange={(e) => {
                setSearchField(e.target.value);
                setSearching(true);
              }}
            />
            <input
              type="date"
              className="search-date"
              onChange={(e) => {
                setSearchDate(e.target.value);
                /*setSearching(true);*/
              }}
            />
            <NavLink to={`/dashboard/${props.AddRecord}`}>
              {props.DataName !== 'Orders' && (
                <button className="addNew">Add New {props.DataName}</button>
              )}
            </NavLink>
          </div>
        </div>
        <div className="tableSection">
          <table>
            <thead>
              <tr>
                {Headers}
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {props.Data.length === 0 && props.noRecordsFound ? (
                <tr className="noRecordsFound">
                  <td colSpan={12}>No {props.DataName} Found</td>
                </tr>
              ) : props.Data.length === 0 ? (
                <tr className="loading">
                  <td colSpan={12}>Loading...</td>
                </tr>
              ) : loading ? (
                <LoadingSpinner />
              ) : DataToShow.length > 0 ? (
                DataToShow
              ) : searching ? (
                <tr className="loading">
                  <td colSpan={12}>Searching...</td>
                </tr>
              ) : (
                <td colSpan={12} style={{ textAlign: "center" }}>
                  No data available
                </td>
              )}
            </tbody>
          </table>
        </div>
        <div className="Pagination-section">
          <div>
            <select onChange={(e) => props.setLimitDataShow(e.target.value)}>
              <option value="" disabled selected>
                Items
              </option>
              <option value="3">3</option>
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </div>
          <div>
            {/* Render PaginatedItems component with items */}
            <PaginatedItems
              itemsPerPage={props.limitDataShow}
              items={props.Data}
              setPagesToShow={props.setPagesToShow}
              totalData={props.totalData}
            />
          </div>
        </div>
      </div>
    </>
  );
}
