import React from "react";
import styles from "./SignUpSuccess.module.css";
import { Link } from "react-router-dom";

const SignUpSuccess = () => {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <img src="/images/success.svg" alt="" className={styles.sImage} />
        <h3 className={styles.content}>
          Your Account has been <br />
          created Successfully!
        </h3>
        <Link to={"/sign-in"} className={styles.linkText}>
          Go to Login
        </Link>
      </div>
    </div>
  );
};

export default SignUpSuccess;
