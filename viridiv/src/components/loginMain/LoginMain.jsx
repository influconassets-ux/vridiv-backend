import React, { useContext, useEffect, useState } from "react";
import styles from "./LoginMain.module.css";
import { AppContext } from "../../context/AppContext";
import { Link, useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";

import FbLogin from "../fbLogin/FbLogin";

const LoginMain = () => {
  const { googleAuth, manualLogin, isLoading, user, currentBackendLink } =
    useContext(AppContext);
  const [redirecting, setRedirecting] = useState(false);

  const navigation = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // console.log("running");
    // console.log(isLoading, user);

    if (!isLoading) {
      // console.log("first Loop");
      if (user) {
        setRedirecting(true);
        if (user.isVerified) {
          console.log("is verified");
          navigation(`/${user.userType}-dashboard`);
        } else if (!user.isVerified && user.hasCompletedOnboarding) {
          navigation(`/onboard/success`);
        } else {
          navigation("/onboard");
        }
      }
    }
  }, [isLoading, user]);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await manualLogin(formData);
      if (data.success) {
        const user = data.user;
        setLoading(false);
        if (!user.hasCompletedOnboarding) {
          navigation("/onboard");
        } else {
          navigation(`/${user.userType}-dashboard`);
        }
        // Redirect to user-specific dashboard
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

  const responseGoogle = async (authResult) => {
    setLoading(true);
    try {
      console.log(authResult);

      if (authResult.code) {
        console.log("Sending request");
        const result = await googleAuth(authResult.code);
        if (result.success) {
          navigation(`/${result.userType}-dashboard`);
          setLoading(false);
        }
        if (!result.success) {
          setError(result.message);
          setLoading(false);
        }
      }
      setLoading(false);
    } catch (e) {
      console.log("Error while Google Login...", e);
      console.log(e.message);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: responseGoogle,
    flow: "auth-code",
  });

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

          <Link to={"/sign-up"} className={styles.signUpLink}>
            Don't have an account? <span>SignUp</span>
          </Link>

          <p className={styles.tncpp}>
            By logging in, you agree to our{" "}
            <a href="" target="_blank">
              Privacy Policy
            </a>{" "}
            and{" "}
            <a href="" target="_blank">
              Terms & Conditions
            </a>
          </p>

          <div className={styles.orContainer}>
            <div className={styles.orLine}></div>
            <p className={styles.orText}>or</p>
            <div className={styles.orLine}></div>
          </div>

          <div className={styles.googleContainer} onClick={googleLogin}>
            <img src="/images/google.svg" alt="" className={styles.gImage} />
            <h2 className={styles.gText}>Continue with Google</h2>
          </div>
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
