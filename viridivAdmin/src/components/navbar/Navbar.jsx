import React, { useContext, useEffect, useRef, useState } from "react";
import styles from "./Navbar.module.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import { IoLogOutSharp } from "react-icons/io5";
import { IoIosArrowDropdown } from "react-icons/io";

import { MdDownloadForOffline } from "react-icons/md";

const Navbar = () => {
  const {
    getNotifications,
    notifications,
    unreadNotifications,
    isLoadingData,
    changeSidebarForNewOffer,
    downloadAllUsersExcel,
    handleLogout,
    markAsRead,
    user,
  } = useContext(AppContext);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const notRef = useRef(null);
  const menuRef = useRef();

  const navigate = useNavigate();
  const location = useLocation();

  const handleNotificationLocationChange = (offerListId) => {
    if (location.pathname !== "/") {
      changeSidebarForNewOffer(offerListId);
      navigate("/");
    } else {
      changeSidebarForNewOffer(offerListId);
    }
  };

  const logoutUser = async () => {
    const result = await handleLogout();
    setShowProfileMenu(false);
    if (result) {
      navigate("/");
      window.location.reload(true);
    }
  };

  const handleMarkNotifcationAsRead = () => {
    const notificationsIds = notifications.map((val) => val._id);
    console.log(notificationsIds);

    markAsRead(notificationsIds);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notRef.current && !notRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // Function to detect click outside
    const handleClickOutside = (event) => {
      if (
        showProfileMenu &&
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setShowProfileMenu(false); // Call the function when clicked outside
      }
    };

    // Add event listener when component mounts
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup event listener when component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showProfileMenu]);

  useEffect(() => {
    getNotifications();
  }, []);

  return (
    <nav className={styles.container}>
      <div className={styles.left}>
        <img
          src="/images/footerHeader.png"
          className={styles.leftImage}
          alt=""
        />
      </div>
      <div className={styles.right}>
        <Link to={"/"}>
          <img
            src="/images/backImage.svg"
            className={styles.arrowImage}
            alt=""
          />
        </Link>

        <div className={styles.midContainer}>
          <Link className={styles.midHeader} to={"/add-offerlist"}>
            <img src="/images/plus.png" className={styles.plusImage} alt="" />{" "}
            Add an Offer List
          </Link>
          <Link to={"/"} className={styles.midHeader}>
            Offer List
          </Link>
          <Link to={"/orders"} className={styles.midHeader}>
            Orders
          </Link>
          <Link to={"/verifications"} className={styles.midHeader}>
            Verifications
          </Link>
          <Link to={"/data"} className={styles.midHeader}>
            Data
          </Link>
          <div to={"/verifications"} className={styles.downloadUsers}>
            <MdDownloadForOffline onClick={downloadAllUsersExcel} />
          </div>
        </div>

        <div className={styles.profileContainer}>
          <div
            ref={notRef}
            className={styles.bellContainer}
            onClick={() => {
              setShowNotifications((prev) => {
                if (!prev && unreadNotifications > 0) {
                  handleMarkNotifcationAsRead();
                }
                return !prev;
              });
            }}
          >
            <img src="/images/bell.svg" className={styles.bell} alt="" />

            {unreadNotifications > 0 && (
              <div className={styles.notCount}>
                {unreadNotifications < 100 ? unreadNotifications : 99}
              </div>
            )}

            {showNotifications && (
              <div className={styles.notContainer}>
                {isLoadingData && <h4>...loading notifications</h4>}
                {!isLoadingData && (
                  <div className={styles.notWrapper}>
                    {notifications.map((val) => {
                      if (val.type === "NEW_OFFER") {
                        return (
                          <div
                            className={`${styles.notCard} ${
                              !val.isRead ? styles.unread : styles.read
                            }`}
                            key={val._id}
                            onClick={() =>
                              handleNotificationLocationChange(val.link)
                            }
                          >
                            <p className={styles.notItem}>{val.message}</p>
                            <div className={styles.timeWrapper}>
                              <p>
                                {" "}
                                {new Date(val.createdAt).toLocaleString(
                                  "en-IN",
                                  {
                                    timeZone: "Asia/Kolkata",
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                    hour: "numeric",
                                    minute: "2-digit",
                                    hour12: true,
                                  }
                                )}
                              </p>
                            </div>
                          </div>
                        );
                      } else {
                        return (
                          <Link
                            to={val.link}
                            className={`${styles.notCard} ${
                              !val.isRead ? styles.unread : styles.read
                            }`}
                            key={val._id}
                          >
                            <p className={styles.notItem}>{val.message}</p>
                            <div className={styles.timeWrapper}>
                              <p>
                                {" "}
                                {new Date(val.createdAt).toLocaleString(
                                  "en-IN",
                                  {
                                    timeZone: "Asia/Kolkata",
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                    hour: "numeric",
                                    minute: "2-digit",
                                    hour12: true,
                                  }
                                )}
                              </p>
                            </div>
                          </Link>
                        );
                      }
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className={styles.dp}>
            <p className={styles.char}>
              {user?.name ? user.name.split(" ")[0].charAt(0) : "V"}
            </p>
          </div>
          <div className={styles.NameContainer}>
            <h3 className={styles.username}>
              {user?.name ? user.name.split(" ")[0] : "VIRIDIV"}
            </h3>
            <h4 className={styles.usertype}>Admin</h4>
          </div>

          <div
            className={styles.downloadUsers}
            onClick={() => setShowProfileMenu((prev) => !prev)}
            ref={menuRef}
          >
            {/* <IoLogOutSharp /> */}
            <IoIosArrowDropdown />

            {showProfileMenu && (
              <div className={styles.menubar}>
                {user?.userType === "superAdmin" && (
                  <>
                    <Link to={"/admin-accounts"}>
                      <p className={styles.menuItem}>Admin Users</p>
                    </Link>
                    <Link to={"/create-admin-account"}>
                      <p className={styles.menuItem}>Add Admin</p>
                    </Link>
                  </>
                )}
                <p className={styles.menuItem} onClick={logoutUser}>
                  Logout <IoLogOutSharp />
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
