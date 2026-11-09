import React, { useContext } from "react";
import styles from "./OfferSideBar.module.css";
import { AppContext } from "../../../context/AppContext";

const OfferSideBar = ({ setShowSidebar }) => {
  const {
    allOfferLists,
    changeSideBarOfferList,
    sidebarSelectedOfferList,
    allInvoices,
  } = useContext(AppContext);

  const handleOfferListChange = (offerList) => {
    // console.log(offerList);
    changeSideBarOfferList(offerList);
    setShowSidebar(false);
  };
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
      <h2 className={styles.header}>Your Offer Lists</h2>

      <div className={styles.serachContainer}>
        <div className={styles.searchWrapper}>
          <img src="/images/search.svg" className={styles.searchIcon} alt="" />
          <input
            type="text"
            placeholder="Search"
            className={styles.searchInput}
          />
        </div>
      </div>

      <div className={styles.cardContainer}>
        <div
          style={{
            backgroundColor:
              !sidebarSelectedOfferList && allInvoices.length > 0
                ? "#F5F5C9"
                : "",
          }}
          className={`${styles.card} ${styles.allCard}`}
          onClick={() => {
            setShowSidebar(false);
            changeSideBarOfferList("");
          }}
        >
          <h2 className={styles.cardLeft}>Show All offerlists</h2>
        </div>
        {allOfferLists.map((val) => {
          return (
            <div
              className={styles.card}
              key={val._id}
              style={{
                backgroundColor:
                  val._id === sidebarSelectedOfferList?._id ? "#F5F5C9" : "",
              }}
              onClick={() => handleOfferListChange(val)}
            >
              <h2 className={styles.cardLeft}>
                Offer List #{val.offerListNumber}
              </h2>
              <h2 className={styles.cardRight}>{val.selle?.companyName} </h2>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OfferSideBar;
