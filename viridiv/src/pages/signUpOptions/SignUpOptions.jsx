import React, { useContext } from "react";
import styles from "./SignUpOptions.module.css";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext";

const SignUpOptions = () => {
  const { setSignupUserType } = useContext(AppContext);

  const navigate = useNavigate();

  const handleSignupOption = () => {
    navigate("/sign-up/create-account");
  };
  return (
    <div className={styles.container}>
      <div
        className={styles.circle}
        onClick={() => {
          setSignupUserType("seller");
          handleSignupOption();
        }}
      >
        <img src="/images/signupAdd.svg" className={styles.addImage} alt="" />
        <h3 className={styles.content}>Become a Seller</h3>
      </div>
      <div
        className={styles.circle}
        onClick={() => {
          setSignupUserType("buyer");
          handleSignupOption();
        }}
      >
        <img src="/images/signupAdd.svg" className={styles.addImage} alt="" />
        <h3 className={styles.content}>Become a Buyer</h3>
      </div>
    </div>
  );
};

export default SignUpOptions;
