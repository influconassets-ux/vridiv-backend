import React, { useContext } from "react";
import styles from "./AuthLayout.module.css";
import { IoChevronBackOutline } from "react-icons/io5";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { IoIosLogOut } from "react-icons/io";
import { AppContext } from "../../context/AppContext";

const AuthLayout = () => {
  const { handleLogout } = useContext(AppContext);

  const location = useLocation();
  const navigate = useNavigate();

  const logoutUser = async () => {
    const result = await handleLogout();
    if (result) {
      navigate("/");
    }
  };
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
          <div className={styles.absIconsContainer}>
            <Link to={"/"} className={styles.backIcon}>
              <IoChevronBackOutline />
            </Link>

            {(location.pathname === "/onboard" ||
              location.pathname === "/onboard/success") && (
              <div className={styles.logoutBtn} onClick={logoutUser}>
                <IoIosLogOut />
              </div>
            )}
          </div>

          <h2 className={styles.cText}>VIRIDIV</h2>
        </div>

        <div className={styles.contentContainer}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
