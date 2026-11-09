import React, { useContext, useEffect, useState } from "react";
import styles from "./AdminAccounts.module.css";
import AccCard from "../../components/adminAccountsPage/accCard/AccCard";
import { AppContext } from "../../context/AppContext";
import PageLoader from "../../components/pageLoader/PageLoader";
import Unauthorized from "../../components/unauthorized/Unauthorized";

const AdminAccounts = () => {
  const { fetchAdminAccounts, deleteAdminAccount, user } =
    useContext(AppContext);
  const [loading, setIsLoading] = useState(true);
  const [adminAccounts, setAdminAccounts] = useState(null);

  const handleAccountDeletion = async (accountId) => {
    setIsLoading(true);
    try {
      const isConfirmed = window.confirm("Are you sure?");
      if (isConfirmed) {
        const data = await deleteAdminAccount(accountId);
        if (data.success) {
          setAdminAccounts(data.admins);
        }
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const result = async () => {
      const data = await fetchAdminAccounts();
      console.log(data);
      setAdminAccounts(data.admins);
      setIsLoading(false);
    };
    result();
  }, []);

  if (loading) {
    return <PageLoader />;
  }
  if (!loading && user && user.userType !== "superAdmin") {
    return <Unauthorized />;
  }
  if (!loading && !adminAccounts) {
    return <p>No Accounts Created</p>;
  }
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {adminAccounts.map((acc) => (
          <AccCard
            key={acc._id}
            account={acc}
            handleAccountDeletion={handleAccountDeletion}
          />
        ))}
      </div>
    </div>
  );
};

export default AdminAccounts;
