import React from "react";
import styles from "./Unauthorized.module.css";
import { FaLock } from "react-icons/fa6";

const Unauthorized = () => {
  return (
    <div className={styles.container}>
      <h2 className={styles.header}>UNAUTHORIZED</h2>
      <div className={styles.lock}>
        <FaLock />
      </div>
    </div>
  );
};

export default Unauthorized;
