import React, { useContext, useEffect } from "react";
import styles from "./Orders.module.css";
import { AppContext } from "../../../context/AppContext";
import { Link, useNavigate } from "react-router-dom";

const Orders = () => {
  const { getOrders, userOrders, isLoadingData, user } = useContext(AppContext);

  const navigate = useNavigate();
  useEffect(() => {
    getOrders();
  }, []);

  if (user && user.userType === "seller") {
    navigate("/seller-dashboard");
  }

  if (isLoadingData) {
    return <div>....loading</div>;
  }
  if (!isLoadingData && userOrders.length === 0) {
    return <div>No Data to show</div>;
  }
  return (
    <div className={styles.container}>
      <div className={styles.searchContainer}>
        <div className={styles.searchWrapper}>
          <div className={styles.searchLeft}>
            <img
              src="/images/search.svg"
              alt=""
              className={styles.searchIcon}
            />
            <input
              type="text"
              placeholder="Search"
              className={styles.searchInput}
            />
          </div>

          <img
            src="/images/filterArrow.png"
            alt=""
            className={styles.filterArrow}
          />
        </div>
      </div>
      <h2 className={styles.header}>Orders</h2>

      <div className={styles.tableContainer}>
        <div className={styles.headerRow}>
          <h3 className={styles.tHeader}>
            Mark{" "}
            <img
              src="/images/darkFilterArrow.jpg"
              className={styles.filterArwImage}
              alt=""
            />
          </h3>
          <h3 className={styles.tHeader}>
            Offer List{" "}
            <img
              src="/images/darkFilterArrow.jpg"
              className={styles.filterArwImage}
              alt=""
            />
          </h3>
          <h3 className={styles.tHeader}>
            Invoice{" "}
            <img
              src="/images/darkFilterArrow.jpg"
              className={styles.filterArwImage}
              alt=""
            />
          </h3>
          <h3 className={styles.tHeader}>
            Order No{" "}
            <img
              src="/images/darkFilterArrow.jpg"
              className={styles.filterArwImage}
              alt=""
            />
          </h3>
          <h3 className={styles.tHeader}>Current Price</h3>
          <h3 className={styles.tHeader}>Buyer Price</h3>
          <h3 className={styles.tHeader}>
            Seller{" "}
            <img
              src="/images/darkFilterArrow.jpg"
              className={styles.filterArwImage}
              alt=""
            />
          </h3>
          {/* <h3 className={styles.tHeader}>
            Offered to{" "}
            <img
              src="/images/darkFilterArrow.jpg"
              className={styles.filterArwImage}
              alt=""
            />
          </h3> */}
          <div className={styles.imgHeader}></div>
        </div>

        {userOrders.map((val, i) => {
          return (
            <div className={styles.rowContainer} key={i}>
              <h3 className={styles.tContent}>{val.mark} </h3>
              <h3 className={styles.tContent}>
                #{val.offerListNumber.offerListNumber}
              </h3>
              <h3 className={styles.tContent}>{val.invoiceNumber}</h3>
              <h3 className={styles.tContent}>{val.invoiceNumber}</h3>
              <h3 className={styles.tContent}>₹{val.price}</h3>
              <h3 className={styles.tContent}>₹{val.highestBiddingPrice}</h3>
              <h3 className={styles.tContent}>{val.seller.companyName}</h3>

              <Link
                to={`/buyer-dashboard/order/${val._id}`}
                className={styles.eyeImageWrapper}
              >
                <img
                  src="/images/eyeImage.svg"
                  className={styles.eyeImage}
                  alt=""
                />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Orders;
