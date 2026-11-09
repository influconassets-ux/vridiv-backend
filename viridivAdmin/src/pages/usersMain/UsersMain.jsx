import React, { useState } from "react";
import styles from "./UsersMain.module.css";
import PendingUsers from "../pendingUsers/PendingUsers";
import VerifiedUsers from "../../components/verifiedUsers/VerifiedUsers";

const UsersMain = () => {
  const [showUserType, setShowUserType] = useState("pending");

  const handleUserType = () => {
    if (showUserType === "pending") {
      setShowUserType("verified");
    } else {
      setShowUserType("pending");
    }
  };
  return (
    <div className={styles.container}>
      <button onClick={handleUserType} className={styles.btn}>
        Show {showUserType === "pending" ? "Verified" : "Pending"} Users
      </button>
      {showUserType === "pending" && <PendingUsers />}
      {showUserType === "verified" && <VerifiedUsers />}
    </div>
  );
};

export default UsersMain;
