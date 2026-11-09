import React, { useContext } from "react";
import styles from "./OfferSideBar.module.css";
import { AppContext } from "../../../context/AppContext";

const OfferSideBar = ({ setShowSidebar, setSelectedInvoices }) => {
  const { allOfferLists, changeSideBarOfferList, sidebarSelectedOfferList } =
    useContext(AppContext);

  // console.log(handleSidebarselection);

  const handleOfferListChange = (offerList) => {
    console.log("handleOfferListChange");
    console.log(offerList);
    setSelectedInvoices(offerList);

    // console.log(offerList);
    // changeSideBarOfferList(offerList);
    // setShowSidebar(false);
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
        {allOfferLists.map((val) => {
          return (
            <div
              className={styles.card}
              key={val._id}
              onClick={() => changeSideBarOfferList(val)}
              style={{
                backgroundColor:
                  val._id === sidebarSelectedOfferList._id ? "#F5F5C9" : "",
              }}
            >
              <h2 className={styles.cardLeft}>
                Offer List #{val.offerListNumber}
              </h2>
              <h2 className={styles.cardRight}>{val.seller?.companyName} </h2>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OfferSideBar;
