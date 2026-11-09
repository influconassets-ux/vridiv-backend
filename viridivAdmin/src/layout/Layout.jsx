import React, { useContext, useEffect } from "react";
import styles from "./Layout.module.css";
import Navbar from "../components/navbar/Navbar";
import { Outlet, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import PageLoader from "../components/pageLoader/PageLoader";

const Layout = () => {
  const { user, isLoading } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    // console.log("main layout render");
    if (isLoading) {
      return;
    }
    if (!isLoading) {
      if (!user) {
        // console.log("main layout no user render");
        navigate("/login");
      }
    }
  }, [isLoading]);

  if (isLoading) {
    return <PageLoader />;
  }
  return (
    <div className={styles.container}>
      <Navbar />
      <Outlet />
    </div>
  );
};

export default Layout;
