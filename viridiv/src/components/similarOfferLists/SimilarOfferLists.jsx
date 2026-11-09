import React, { useContext } from "react";
import styles from "./SimilarOfferLists.module.css";
import SimilarCard from "./similarCard/SimilarCard";
import { AppContext } from "../../context/AppContext";

const SimilarOfferLists = () => {
  const { upcomingOfferLists } = useContext(AppContext);
  return (
    <div className={styles.container}>
      <h2 className={styles.lotsTxt}>UPCOMING OFFER LISTS</h2>

      <div className={styles.cardContainer}>
        {upcomingOfferLists.map((val, i) => {
          return <SimilarCard offerList={val} key={i} />;
        })}
      </div>
    </div>
  );
};

export default SimilarOfferLists;
