import React, { useEffect, useState } from "react";
import "./Index.css"; // Make sure to import your CSS file
import LoadingSpinner from "../../../Components/Loading/loadingSpinner";
import Axios from "../../../Api/Axios";
import { CUSTOMER } from "../../../Api/Api";
import { useNavigate } from "react-router-dom";
const AddCustomer = () => {
  // State variables to store form data
  const [customerDetails, setCustomerData] = useState({
    countries: [],
    states: [],
    cities: [],
    users: [],
  });
  console.log(customerDetails);

  const [birthdate, setBirthdate] = useState("");

  const [loading, setLoading] = useState(false);

  const initialFormData = {
    firstName: "",
    lastName: "",
    phoneNumber: "",
    birthdate: "",
    addressLine1: "",
    addressLine2: "",
    postalCode: "",
    country: "",
    state: "",
    city: "",
    user: "",
    ActivedOrDeactivated: "",
    addressType: "",
  };
 
  const [formData, setFormData] = useState(initialFormData);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };
  console.log(formData);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await Axios.post(`/${CUSTOMER}/add`, formData);
      console.log("Add customer response:", response.data);

     
      navigate("/dashboard/customers"); 
    } catch (error) {
      console.error("Error adding customer:", error);
     
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const fetchCustomerDetails = async () => {
      try {
        setLoading(true);
        const response = await Axios.get(`/${CUSTOMER}/countries`);
        console.log(response);
        setCustomerData((prevDetails) => ({
          ...prevDetails,
          countries: response.data.countries,
          users: response.data.users,
        }));
        setIsSubmitting(false);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerDetails();
  }, []);

  // Fetch states based on selected country
  useEffect(() => {
    const fetchStates = async () => {
      if (formData.country) {
        try {
          setLoading(true);
          const response = await Axios.post(
            `/${CUSTOMER}/states/${formData.country}`
          );
          console.log(response);
          setCustomerData((prevDetails) => ({
            ...prevDetails,
            states: response.data.states,
          }));
          setIsSubmitting(false);
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchStates();
  }, [formData.country]);

  // Fetch cities based on selected state
  useEffect(() => {
    const fetchCities = async () => {
    
      if (formData.state) {
       
        try {
          setLoading(true);
          const response = await Axios.post(
            `/${CUSTOMER}/cities/${formData.state}`
          );
          console.log(response);
          
          setCustomerData((prevDetails) => ({
            ...prevDetails,
            cities: response.data.cities,
          }));
          setIsSubmitting(false);
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchCities();
  }, [formData.state]);

  //set the date of now if the user has not inserted the date
  useEffect(() => {
    if (!birthdate) {
      const today = new Date().toISOString().split("T")[0];
      setBirthdate(today);
    }
  }, [birthdate]);

  return (
    <section className="customer-container">
      <header className="Registration-customer">Registration Form</header>
      <form onSubmit={handleSubmit} className="form">
        <div className="input-box">
          <label>First Name</label>
          <input
            type="text"
            name="firstName"
            placeholder="Enter first name"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-box">
          <label>Last Name</label>
          <input
            type="text"
            name="lastName"
            placeholder="Enter last name"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="column">
          <div className="input-box">
            <label>Phone Number</label>
            <input
              type="tel"
              name="phoneNumber"
              placeholder="Enter phone number"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-box">
            <label>Date of creation</label>
            <input
              type="date"
              name="birthdate"
              value={formData.birthdate}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="input-box address">
          <label>Address</label>
          <input
            type="text"
            name="addressLine1"
            placeholder="Enter street address"
            value={formData.addressLine1}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="addressLine2"
            placeholder="Enter street address line 2"
            value={formData.addressLine2}
            onChange={handleChange}
            required
          />
          <label htmlFor="addressType">country, state, city and user</label>
          <div className="column">
            <div className="select-box">
              <select
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
              >
                <option value="" disabled hidden>
                  select Country
                </option>
                {loading ? (
                  <option value="" disabled>
                    Loading countries...
                  </option>
                ) : customerDetails.countries.length > 0 ? (
                  customerDetails.countries.map((country) => (
                    <option key={country.id} value={country.id}>
                      {country.name}
                    </option>
                  ))
                ) : (
                  <option value="">No countries to show</option>
                )}
              </select>
            </div>
          </div>

          <div className="column">
            <div className="select-box">
              <select
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
              >
                <option value="" disabled hidden>
                  select State
                </option>
                {loading ? (
                  <option value="" disabled>
                    Loading states...
                  </option>
                ) : customerDetails.states.length > 0 ? (
                  customerDetails.states.map((state) => (
                    <option key={state.id} value={state.id}>
                      {state.name}
                    </option>
                  ))
                ) : (
                  <option value="">No states to show</option>
                )}
              </select>
            </div>
          </div>

          <div className="column">
            <div className="select-box">
              <select
                name="city"
                value={formData.city}
                onChange={handleChange}
              >
                <option value="" disabled hidden>
                  select City
                </option>
                {loading ? (
                  <option value="" disabled>
                    Loading cities...
                  </option>
                ) : customerDetails.cities.length > 0 ? (
                  customerDetails.cities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ))
                ) : (
                  <option value="">No cities to show</option>
                )}
              </select>
            </div>
          </div>

          <div className="column">
            <div className="select-box">
              <select
                name="user"
                value={formData.user}
                onChange={handleChange}
                required
              >
                <option value="" disabled hidden>
                  select User
                </option>
                {loading ? (
                  <option value="" disabled>
                    Loading users...
                  </option>
                ) : customerDetails.users.length > 0 ? (
                  customerDetails.users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))
                ) : (
                  <option value="">No users to show</option>
                )}
              </select>
            </div>
          </div>
          <br></br>
          <label htmlFor="addressType">other info</label>
          <div className="column">
            <div className="select-box">
              <select
                name="ActivedOrDeactivated"
                value={formData.ActivedOrDeactivated}
                onChange={handleChange}
                required
              >
                <option value="" disabled hidden>
                  activate or deactivate
                </option>
                <option value={"activated"}>active</option>
                <option value={"deactivated"}>non-active</option>
              </select>
            </div>
            <input
              type="number"
              name="postalCode"
              placeholder="Enter postal code"
              value={formData.postalCode}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <label htmlFor="addressType">Address Type</label>
        <div className="column">
          <div className="select-box">
            <select
              id="addressType"
              name="addressType"
              value={formData.addressType}
              onChange={handleChange}
              required
            >
              <option value="" disabled hidden>
                Select Address Type
              </option>
              <option value="home">Home</option>
              <option value="work">Work</option>
              <option value="billing">Billing</option>
              <option value="shipping">Shipping</option>
            </select>
          </div>
        </div>
        <button type="submit">Submit</button>
      </form>
    </section>
  );
};

export default AddCustomer;
