import React from "react";
import styles from "./Home.module.css";
import OfferListAdmin from "../../components/homepage/offerListAdmin/OfferListAdmin";

const Home = () => {
  return (
    <div className={styles.container}>
      <OfferListAdmin />
    </div>
  );
};

export default Home;
