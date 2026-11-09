import React from "react";
import styles from "./OnBoardSuccess.module.css";
import { Link } from "react-router-dom";

const OnBoardSuccess = () => {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <img src="/images/success.svg" alt="" className={styles.sImage} />
        <h3 className={styles.content}>
          Your Details have been sent for verification, and you will be notified
          on your Email
        </h3>
        <Link to={"/"} className={styles.linkText}>
          Go to Home
        </Link>
      </div>
    </div>
  );
};

export default OnBoardSuccess;
