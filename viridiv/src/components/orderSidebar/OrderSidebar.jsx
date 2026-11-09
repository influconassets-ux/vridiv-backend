import React from "react";
import styles from "./OrderSidebar.module.css";

const OrderSidebar = ({
  setShowSidebar,
  uniqueValues,
  sidebarSelectedOrder,
  changeSiderbarSelectedOrder,
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.closeContainer}>
        <img
          src="/images/close.svg"
          className={styles.closeImage}
          alt=""
          onClick={() => setShowSidebar(false)}
        />
      </div>
      {!sidebarSelectedOrder ? (
        <h2 className={styles.header}>No Orders</h2>
      ) : (
        <h2 className={styles.header}>Sale Orders</h2>
      )}
      {sidebarSelectedOrder && (
        <>
          <div className={styles.serachContainer}>
            <div className={styles.searchWrapper}>
              <img
                src="/images/search.svg"
                className={styles.searchIcon}
                alt=""
              />
              <input
                type="text"
                placeholder="Search"
                className={styles.searchInput}
              />
            </div>
          </div>

          <div className={styles.cardContainer}>
            {uniqueValues.map((val, i) => {
              return (
                <div
                  className={styles.card}
                  key={i}
                  style={{
                    backgroundColor:
                      val === sidebarSelectedOrder ? "#F5F5C9" : "",
                  }}
                  onClick={() => changeSiderbarSelectedOrder(val)}
                >
                  <h2 className={styles.cardLeft}>Sale Order No. #{val}</h2>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default OrderSidebar;
