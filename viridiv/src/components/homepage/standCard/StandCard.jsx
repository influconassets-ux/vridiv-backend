import React from "react";
import styles from "./StandCard.module.css";

const StandCard = ({ data }) => {
  const { imgLink, header, paras } = data;
  return (
    <div className={styles.container}>
      <div className={styles.imageCard}>
        <img src={imgLink} loading="lazy" className={styles.cardImage} alt="" />
        <h2 className={styles.cardHeader}>{header}</h2>
      </div>
      <div className={styles.contentContainer}>
        {paras.map((val, i) => {
          return (
            <p className={styles.content} key={i}>
              {val}
            </p>
          );
        })}
      </div>
    </div>
  );
};

export default StandCard;
