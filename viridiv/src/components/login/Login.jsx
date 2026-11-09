import React, { useContext, useState } from "react";
import styles from "./Login.module.css";
import { AppContext } from "../../context/AppContext";
import { Link, useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import FbLogin from "../fbLogin/FbLogin";

const Login = () => {
  const { handleShowLoginPage, googleAuth, user } = useContext(AppContext);
  const [selectedUserType, setSelectedUserType] = useState("buyer");

  const navigation = useNavigate();

  const responseGoogle = async (authResult) => {
    try {
      console.log(authResult);

      if (authResult.code) {
        console.log("Sending request");
        const result = await googleAuth(authResult.code, selectedUserType);
        if (result) {
          if (result.userType === "admin" || result.userType === "superAdmin") {
            window.location.href = "https://dashboard.viridiv.com/";
          } else {
            navigation(`/${result.userType}-dashboard`);
          }
        }
      }
    } catch (e) {
      console.log("Error while Google Login...", e);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: responseGoogle,
    flow: "auth-code",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    navigation("/buyer-dashboard");
  };
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.topContainer}>
          <h3 className={styles.topHeader}>LOG IN</h3>
          <img
            src="/images/close.svg"
            className={styles.closeIcon}
            alt=""
            onClick={handleShowLoginPage}
          />
        </div>

        <div className={styles.formheaderContainer}>
          <h2 className={styles.formheader}>Welcome to </h2>
          <img
            src="/images/footerHeader.png"
            className={styles.formLogo}
            alt=""
          />
        </div>

        <form
          action=""
          className={styles.formContainer}
          onSubmit={handleSubmit}
        >
          <div className={styles.inputWrapper}>
            <label htmlFor="" className={styles.inputLabel}>
              Email
            </label>
            <input
              type="email"
              placeholder="Eg : badassravikaumar7@gmail.com"
              className={styles.inputField}
              required
            />
          </div>
          <div className={styles.inputWrapper}>
            <label htmlFor="" className={styles.inputLabel}>
              Password
            </label>
            <input
              type="password"
              placeholder="Enter Password"
              className={styles.inputField}
              required
            />
          </div>
          <Link to={"/sign-up"} className={styles.radioBtnLabel}>
            Create a new account
          </Link>
          {/* <div className={styles.userTypeContainer}>
            <div className={styles.userTypeWrapper}>
              <input
                type="radio"
                className={styles.radioBtn}
                name="userType"
                id="Buyer"
                value="buyer"
                defaultChecked
                onChange={(e) => setSelectedUserType(e.target.value)}
              />
              <label htmlFor="Buyer" className={styles.radioBtnLabel}>
                Buyer
              </label>
            </div>
            <div className={styles.userTypeWrapper}>
              <input
                type="radio"
                className={styles.radioBtn}
                name="userType"
                id="Seller"
                value="seller"
                onChange={(e) => setSelectedUserType(e.target.value)}
              />
              <label htmlFor="Seller" className={styles.radioBtnLabel}>
                Seller
              </label>
            </div>
          </div> */}
          <button className={styles.submitBtn} type="submit">
            Continue
          </button>

          <div className={styles.orContainer}>
            <div className={styles.orLine}></div>
            <p className={styles.orText}>or</p>
            <div className={styles.orLine}></div>
          </div>

          <div className={styles.googleContainer} onClick={googleLogin}>
            <img src="/images/google.svg" alt="" className={styles.gImage} />
            <h2 className={styles.gText}>Continue with Google</h2>
          </div>

          <div className={styles.fbBtn}>
            <FbLogin />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
