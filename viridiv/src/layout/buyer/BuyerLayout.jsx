import React, { useContext, useEffect, useState } from "react";
import styles from "./BuyerLayout.module.css";
import Navbar from "../../components/dashboard/navbar/Navbar";
import { Outlet, useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import PageLoader from "../../components/pageLoader/PageLoader";

const BuyerLayout = () => {
  const { isLoading, user } = useContext(AppContext);
  const [redirecting, setRedirecting] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    console.log("running");
    console.log(isLoading, user);

    if (!isLoading) {
      console.log("first Loop");
      if (!user) {
        console.log("Redirecting due to no user");
        setRedirecting(true);
        navigate("/");
      }
      if (user && !user.hasCompletedOnboarding) {
        setRedirecting(true);
        navigate("/onboard");
      }
    }
  }, [isLoading, user]);

  if (isLoading || redirecting) {
    return <PageLoader />;
  }

  if (user) {
    return (
      <div className={styles.container}>
        <Navbar />
        <Outlet />
      </div>
    );
  }
};

export default BuyerLayout;
