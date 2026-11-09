import React, { useContext, useEffect, useState } from "react";
import styles from "./LoginMain.module.css";

import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext";

const LoginMain = () => {
  const { manualLogin, isLoading, user } = useContext(AppContext);
  const [redirecting, setRedirecting] = useState(false);

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await manualLogin(formData);
      if (data.success) {
        const user = data.user;
        console.log("login main user");
        console.log(user);

        setLoading(false);
        navigate("/");
      } else {
        setError(data.message);
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
      setError("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoading) {
      // console.log("first Loop");
      if (user) {
        // console.log("second Loop");
        setRedirecting(true);
        navigate("/");
      }
    }
  }, [isLoading, user]);

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.topContainer}>
          <h3 className={styles.topHeader}>LOG IN</h3>
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
          {error && <p className={styles.errText}>{error}</p>}
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
              placeholder="Enter Password"
              className={styles.inputField}
              required
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <button className={styles.submitBtn} type="submit">
            Continue
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

export default LoginMain;
