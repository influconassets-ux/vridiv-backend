import React from "react";
import styles from "./Footer.module.css";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className={styles.container}>
      <img src="/images/footerElipse.svg" alt="" className={styles.elipImage} />

      <div className={styles.wrapper}>
        <div className={styles.contentContainer}>
          {/* <h2 className={styles.cName}>VIRIDIV</h2> */}
          <img
            src="/images/footerHeader.png"
            alt=""
            className={styles.cNameImage}
          />
          <input
            type="text"
            placeholder="Enter Your Email Address"
            className={styles.emailInput}
          />
          <Link className={styles.joinLink}>JOIN PLATFORM</Link>
          <h3 className={styles.content}>
            © All rights reserved Viridiv Global Services Pvt. Ltd.
          </h3>
        </div>
        <div className={styles.leftTextContainer}>
          <h2 className={styles.leftTextHeader}>Contact us</h2>
          <h2 className={styles.leftTextContent}>+91 7381001414</h2>
          <h2 className={styles.leftTextContent}>
            DB 129, Sector 1,
            <br /> Salt Lake, Kolkata,
            <br /> West Bengal 700064
          </h2>
        </div>
      </div>
    </div>
  );
};

export default Footer;
