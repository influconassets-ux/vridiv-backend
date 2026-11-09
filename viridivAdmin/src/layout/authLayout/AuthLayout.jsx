import React, { useContext } from "react";
import styles from "./AuthLayout.module.css";
import { IoChevronBackOutline } from "react-icons/io5";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { IoIosLogOut } from "react-icons/io";
import { AppContext } from "../../context/AppContext";

const AuthLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // const logoutUser = async () => {
  //   const result = await handleLogout();
  //   if (result) {
  //     navigate("/");
  //   }
  // };
  return (
    <div className={styles.container}>
      <div className={styles.left}>
        {/* <h2 className={styles.cTextLeft}>VIRIDIV</h2> */}
        <img
          src="/images/footerHeader.png"
          className={styles.leftImage}
          alt=""
        />
      </div>
      <div className={styles.right}>
        <div className={styles.topContainer}>
          {/* <div className={styles.absIconsContainer}>
            <Link to={"/"} className={styles.backIcon}>
              <IoChevronBackOutline />
            </Link>
          </div> */}

          <h2 className={styles.cText}>VIRIDIV Admin</h2>
        </div>

        <div className={styles.contentContainer}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
