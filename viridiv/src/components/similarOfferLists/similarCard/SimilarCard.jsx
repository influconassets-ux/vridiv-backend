import React from "react";
import styles from "./SimilarCard.module.css";

const SimilarCard = ({ offerList }) => {
  const { offerListNumber, startingPrice, invoiceCount, seller } = offerList;
  return (
    <div className={styles.container}>
      <h2 className={styles.header}>
        Offer List #{offerListNumber}
        <br />
        from {seller.companyName}
      </h2>

      <div className={styles.botContainer}>
        <div className={styles.botLeft}>
          <h3 className={styles.lot}>{invoiceCount} Lots</h3>

          <h3 className={styles.startingPrice}>
            <img src="/images/path.svg" className={styles.pathImage} alt="" />{" "}
            Starting from ₹{startingPrice}/kg
          </h3>
        </div>

        {/* <img
          src="/images/similaryCardIcon.svg"
          className={styles.botRightImage}
          alt=""
        /> */}
      </div>
    </div>
  );
};

export default SimilarCard;
