import React, { useContext } from "react";
import styles from "./Navbar.module.css";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext";

const Navbar = () => {
  const { handleShowLoginPage, user } = useContext(AppContext);
  const navigate = useNavigate();
  const handleLetsWork = () => {
    window.location.href = "https://dashboard.viridiv.com/";
  };
  return (
    <div className={`${styles.container} paddingLeftRight`}>
      <div className={styles.wrapper}>
        {/* <img src="/images/logo.png" className={styles.logoImage} alt="" /> */}
        <div className={styles.menuContainer}>
          <Link to={"/"} className={styles.menuItem}>
            Home
          </Link>
          <Link className={styles.menuItem}>About Us</Link>
          <Link className={styles.menuItem}>Contact Us</Link>
        </div>

        <div onClick={handleLetsWork} className={styles.mrkPlaceLink}>
          Let's Work
        </div>
      </div>
    </div>
  );
};

export default Navbar;
