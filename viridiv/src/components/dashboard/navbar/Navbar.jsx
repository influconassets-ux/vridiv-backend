import React, { useContext, useEffect, useRef, useState } from "react";
import styles from "./Navbar.module.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AppContext } from "../../../context/AppContext";

const Navbar = () => {
  const {
    user,
    handleLogout,
    getNotifications,
    unreadNotifications,
    notifications,
    changeSidebarForNewOffer,
    isLoadingData,
    fetchOfferLists,
    fetchOfferListsForChangeSidebar,
    markAsRead,
  } = useContext(AppContext);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const location = useLocation();

  const [showNotifications, setShowNotifications] = useState(false);
  const notRef = useRef(null);

  const navigate = useNavigate();

  const handleNotificationLocationChange = async (offerListId) => {
    const dashboardPath = `/${user.userType}-dashboard`;
    if (location.pathname !== dashboardPath) {
      navigate(dashboardPath);
      changeSidebarForNewOffer(offerListId);
    } else {
      await fetchOfferLists(offerListId);
    }
  };

  const handleMarkNotifcationAsRead = () => {
    const notificationsIds = notifications.map((val) => val._id);
    console.log(notificationsIds);

    markAsRead(notificationsIds);
  };
  useEffect(() => {
    // Function to detect click outside
    const handleClickOutside = (event) => {
      if (
        showProfileMenu &&
        containerRef.current &&
        !containerRef.current.contains(event.target) &&
        imageRef.current &&
        !imageRef.current.contains(event.target)
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
    getNotifications();
  }, []);

  const logoutUser = async () => {
    const result = await handleLogout();
    if (result) {
      navigate("/");
      window.location.reload(true);
    }
  };
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
        <Link to={"/buyer-dashboard"}>
          <img
            src="/images/backImage.svg"
            className={styles.arrowImage}
            alt=""
          />
        </Link>

        {location.pathname.includes("/buyer-dashboard") && (
          <div className={styles.serachContainer}>
            <img
              src="/images/search.svg"
              className={styles.searchIcon}
              alt=""
            />
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search"
            />
          </div>
        )}

        <div className={styles.profileContainer}>
          <div
            className={styles.bellContainer}
            ref={notRef}
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
                      if (
                        val.type === "ADMIN_OFFER" ||
                        val.type === "OFFERLIST_LIVE"
                      ) {
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
          {user.avatar ? (
            <img
              src="https://lh3.googleusercontent.com/a/ACg8ocKleewaj1_zU8vsc6agZcEM883uuWEt_wCCMqTLzt6gyKzwQg=s96-c"
              className={styles.dp}
              referrerPolicy="no-referrer"
              alt=""
            />
          ) : (
            <div className={styles.dp}>
              <p className={styles.char}>
                {user?.name ? user.name.split(" ")[0].charAt(0) : "V"}
              </p>
            </div>
          )}

          <div className={styles.NameContainer}>
            <h3 className={styles.username}>
              {user?.name
                ? user.name.split(" ").slice(0, 3).join(" ")
                : user?.email?.split("@")[0] || "User"}
            </h3>
            <h4 className={styles.usertype}>
              {user?.userType === "admin"
                ? "Admin"
                : location.pathname.includes("/seller-dashboard")
                ? "Seller"
                : "Buyer"}
            </h4>
          </div>

          <div className={styles.proArrowContainer}>
            <img
              src="/images/downArrow.svg"
              alt=""
              className={styles.proArrow}
              onClick={() => {
                setShowProfileMenu((prev) => !prev);
              }}
              ref={imageRef}
            />

            <div
              className={
                showProfileMenu
                  ? `${styles.profileMenuContainer} ${styles.showprofileMenu}`
                  : `${styles.profileMenuContainer} ${styles.hideprofileMenu}`
              }
              ref={containerRef}
            >
              {/* <Link
                className={styles.proMenuItem}
                onClick={() => setShowProfileMenu(false)}
              >
                Profile
              </Link> */}
              {location.pathname !== "/seller-dashboard" && (
                <Link
                  to={
                    user.userType === "buyer"
                      ? "/buyer-dashboard/orders"
                      : "/seller-dashboard/orders"
                  }
                  className={styles.proMenuItem}
                  onClick={() => setShowProfileMenu(false)}
                >
                  Orders
                </Link>
              )}
              {location.pathname !== "/seller-dashboard" && (
                <Link
                  to={"/buyer-dashboard"}
                  className={styles.proMenuItem}
                  onClick={() => setShowProfileMenu(false)}
                >
                  Offer Lists
                </Link>
              )}
              {location.pathname !== "/seller-dashboard" && (
                <Link
                  to={"/buyer-dashboard/watchlist"}
                  className={styles.proMenuItem}
                  onClick={() => setShowProfileMenu(false)}
                >
                  Watchlist
                </Link>
              )}
              <div
                style={{ cursor: "pointer" }}
                className={styles.proMenuItem}
                onClick={logoutUser}
              >
                Logout
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
