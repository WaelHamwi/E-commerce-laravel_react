import React, { useEffect, useState } from "react";
import Axios from "../../../Api/Axios";
import { API_BASE_URL, USER, USERS } from "../../../Api/Api";
import LoadingSpinner from "../../../Components/Loading/loadingSpinner";
import Cookie from "cookie-universal";
import axios from "axios";
import DataTable from "../../../Components/Dashboard/Table";

export default function Users() {
  /*************************************bring all available users*****************************************************/
  const [users, setUsers] = useState([]);
  /*************************************set loading*****************************************************/
  const [loading, setLoading] = useState(false);

  /*************************************use state to store the current user*****************************************************/
  const [currentUserId, setCurrentUserId] = useState();

  const cookie = Cookie();
  const accessToken = cookie.get("bearer");

  /*************************************handle the case of no users found*****************************************************/
  const [noUsersFound, setNoUsersFound] = useState();

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
      key: "name",
      name: "Name",
    },
    {
      key: "email",
      name: "Email",
    },
    {
      key: "role",
      name: "Role",
    },
    {
      key: "created_at",
      name: "created at",
    },
  ];

  /*************************************1- show  all users****************************************/
  useEffect(() => {
    Axios.get(`/${USERS}?limitDataShow=${limitDataShow}&page=${pagesToShow}`)
      .then((response) => {
        setUsers(response.data.data);
        setTotalData(response.data.total);
        setNoUsersFound(true); //we assign it here to include that there is no user after the fetching
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, [limitDataShow,pagesToShow]);

  /*************************************2-show the current user****************************************/

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/${USER}`, {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      })
      .then((response) => {
        setCurrentUserId(response.data.id);
      })
      .catch((error) => {
        console.error("Error fetching current user data:", error);
      });
  }, []);



  return loading ? (
    <LoadingSpinner />
  ) : (
    <DataTable
      Header={Header}
      Data={users}
      DataName={"Users"}
      Dataname={"User"}
      noRecordsFound={noUsersFound}
      users={users}
      currentUserId={currentUserId}
      delete={USER}
      setDeleteRecord={setUsers}
      AddRecord={"AddUser"}
      limitDataShow={limitDataShow}
      pagesToShow={pagesToShow}
      setPagesToShow={setPagesToShow}
      setLimitDataShow={setLimitDataShow}
      totalData={totalData}
      searchApi={USER}
    />
  );
}
