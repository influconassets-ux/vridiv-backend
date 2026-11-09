import React, { useContext, useEffect, useState } from "react";
import styles from "./ChangePassword.module.css";
import { Link, useNavigate } from "react-router-dom";

const ChangePassword = () => {
  const [redirecting, setRedirecting] = useState(false);

  const navigation = useNavigate();

  const [formData, setFormData] = useState({
    secret: "",
    email: "",
    newPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.topContainer}>
          <h3 className={styles.topHeader}>Change Password</h3>
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
          // onSubmit={handleSubmit}
        >
          {error && <p className={styles.errText}>{error}</p>}
          <div className={styles.inputWrapper}>
            <label htmlFor="" className={styles.inputLabel}>
              Secret
            </label>
            <input
              type="password"
              placeholder="Secret Key"
              className={styles.inputField}
              required
              name="secret"
              value={formData.secret}
              onChange={handleChange}
            />
          </div>
          <div className={styles.inputWrapper}>
            <label htmlFor="" className={styles.inputLabel}>
              Email
            </label>
            <input
              type="email"
              placeholder="Eg : test@gmail.com"
              className={styles.inputField}
              required
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className={styles.inputWrapper}>
            <label htmlFor="" className={styles.inputLabel}>
              Password
            </label>
            <input
              type="password"
              placeholder="Enter New Password"
              className={styles.inputField}
              required
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
            />
          </div>

          <button className={styles.submitBtn} type="submit">
            Change Password
          </button>
        </form>
        {loading && (
          <div className={styles.loadingScreen}>
            <img
              src="/images/customLoading.gif"
              className={styles.loadingImage}
              alt=""
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChangePassword;
