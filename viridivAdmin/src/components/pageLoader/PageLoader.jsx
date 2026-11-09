import React from "react";
import styles from "./PageLoader.module.css";

const PageLoader = () => {
  return (
    <div className={styles.container}>
      <span className={styles.loader}></span>
    </div>
  );
};

export default PageLoader;
