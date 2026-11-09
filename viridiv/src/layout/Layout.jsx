import React, { useContext, useEffect } from "react";
import styles from "./Layout.module.css";
import Navbar from "../components/navbar/Navbar";
import { Outlet, useNavigate } from "react-router-dom";
import Footer from "../components/footer/Footer";
import Login from "../components/login/Login";
import { AppContext } from "../context/AppContext";
import { GoogleOAuthProvider } from "@react-oauth/google";

const Layout = () => {
  const { showLoginPage, isLoading, user } = useContext(AppContext);

  if (isLoading) {
    return <div>....Loading</div>;
  }

  return (
    <div className={styles.container}>
      <Navbar />
      <Outlet />
      <Footer />

      {showLoginPage && <div className={styles.blackBg}></div>}
      <GoogleOAuthProvider clientId="489268107936-sl9nukou3r1aonn9dmif2p8pc4rripjp.apps.googleusercontent.com">
        <div
          className={
            showLoginPage
              ? `${styles.loginContainer} ${styles.showLogin}`
              : `${styles.loginContainer} ${styles.hideLogin}`
          }
        >
          <Login />
        </div>
      </GoogleOAuthProvider>
    </div>
  );
};

export default Layout;
