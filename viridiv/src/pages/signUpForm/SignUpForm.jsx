import React, { useContext, useEffect, useState } from "react";
import styles from "./SignUpForm.module.css";
import { AppContext } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";

const SignUpForm = () => {
  const { googleSignup, signupUserType, currentBackendLink } =
    useContext(AppContext);
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    userType: signupUserType || "buyer", // Default to "buyer"
  });

  const responseGoogle = async (authResult) => {
    try {
      console.log(authResult);

      if (authResult.code) {
        console.log("Sending request");
        const result = await googleSignup(authResult.code, signupUserType);
        if (result.success) {
          navigate("/sign-up/success");
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

  useEffect(() => {
    if (!signupUserType) {
      navigate("/sign-up");
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    console.log("submit request");

    try {
      const response = await axios.post(
        `${currentBackendLink}/api/auth/manual-signup`,
        formData
      );
      console.log(response);
      if (response.status === 201) {
        navigate("/sign-up/success");
      }
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "Signup failed.");
      window.alert(err.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <h2 className={styles.header}>Create Account</h2>
        <form
          action=""
          onSubmit={handleSubmit}
          className={styles.formContainer}
        >
          <div className={styles.inputContainer}>
            <label className={styles.inputLable}>Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={styles.inputField}
              placeholder="John Doe"
              required
            />
          </div>

          <div className={styles.inputContainer}>
            <label htmlFor="" className={styles.inputLable}>
              Enter Email Address
            </label>
            <input
              type="email"
              className={styles.inputField}
              placeholder="test@gmail.com"
              name="email"
              value={formData.email}
              required
              onChange={handleChange}
            />
          </div>
          <div className={styles.inputContainer}>
            <label htmlFor="" className={styles.inputLable}>
              Create Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              placeholder="Enter Password"
              className={styles.inputField}
              required
              onChange={handleChange}
            />
          </div>

          <label htmlFor="" className={styles.aggCheckLabel}>
            <input type="checkbox" className={styles.aggCheck} required />I
            agree to the
            <a href="" style={{ textDecoration: "underline" }}>
              Terms & Conditions{" "}
            </a>
            and
            <a href="" style={{ textDecoration: "underline" }}>
              {" "}
              Privacy Policy
            </a>
          </label>

          <button type="submit" className={styles.btn}>
            Create Account
          </button>
        </form>
        <div className={styles.googleContainer} onClick={googleLogin}>
          <img src="/images/google.svg" alt="" className={styles.gImage} />
          <h2 className={styles.gText}>Sign Up with Google</h2>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;
