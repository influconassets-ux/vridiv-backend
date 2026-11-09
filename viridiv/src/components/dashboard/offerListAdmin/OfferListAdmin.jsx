import React, { useState } from "react";
import styles from "./OfferListAdmin.module.css";
import { RxHamburgerMenu } from "react-icons/rx";

const OfferListAdmin = () => {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.menuIcon} onClick={() => setShowSidebar(true)}>
          <RxHamburgerMenu />
        </div>
        <div className={styles.offerListContainer}>
          <div className={styles.offHeaderContainer}>
            <h2 className={styles.lotsTxt}>LOTS</h2>
            <h2 className={styles.putPrice}>PUT YOUR PRICE</h2>
          </div>
          <p className={styles.offerListName}>
            You are viewing Offer List <span>#2344</span>
          </p>
        </div>

        <div className={styles.tableContainer}>
          <div className={styles.headerRow}>
            <input
              type="checkbox"
              name=""
              id=""
              className={styles.checkInput}
            />
            <h3 className={styles.medRow}>Offer List</h3>
            <h3 className={styles.medRow}>Invoice </h3>
            <h3 className={styles.medRow}>Mark</h3>
            <h3 className={styles.medRow}>Lots</h3>
            <h3 className={styles.medRow}>Quantity</h3>
            <h3 className={styles.medRow}>Bags</h3>
            <h3 className={styles.smallRow}>Price</h3>
            <h3 className={styles.medRow}>Current Price</h3>
            <h3 className={styles.medRow}>Seller Name</h3>
            <h3 className={styles.medRow}>Offered to</h3>
            <h3 className={styles.bigRow}>Status</h3>
          </div>

          <div className={styles.contentRow}>
            <input
              type="checkbox"
              name=""
              id=""
              className={styles.checkInput}
            />
            <h3 className={styles.medRow}>#1001</h3>
            <h3 className={styles.medRow}>654321</h3>
            <h3 className={styles.medRow}>BR-TR-001</h3>
            <h3 className={styles.medRow}>Dust</h3>
            <h3 className={styles.medRow}>1ton</h3>
            <h3 className={styles.medRow}>300</h3>
            <h3 className={styles.smallRow}>₹400</h3>

            <h3 className={styles.medRow}>
              <span>-</span> ₹400 <span>+</span>{" "}
              <span>
                <img src="/images/trash.svg" className={styles.awBid} alt="" />
              </span>
            </h3>
            <h3 className={styles.smallRow}>Ashish Tea</h3>
            <h3 className={styles.smallRow}>
              <span>+</span> Victory Group{" "}
              <span>
                <img src="/images/trash.svg" className={styles.awBid} alt="" />
              </span>
            </h3>
            <h4 className={styles.statusBtn} style={{ background: "#DADADA" }}>
              Awaiting Bids{" "}
              <img src="/images/awBid.svg" className={styles.awBid} alt="" />
              <img src="/images/edit.svg" className={styles.awBid} alt="" />
            </h4>
          </div>
          <div className={styles.contentRow}>
            <input
              type="checkbox"
              name=""
              id=""
              className={styles.checkInput}
            />
            <h3 className={styles.medRow}>#1001</h3>
            <h3 className={styles.medRow}>654321</h3>
            <h3 className={styles.medRow}>BR-TR-001</h3>
            <h3 className={styles.medRow}>Dust</h3>
            <h3 className={styles.medRow}>1ton</h3>
            <h3 className={styles.medRow}>300</h3>
            <h3 className={styles.smallRow}>₹400</h3>

            <h3 className={styles.medRow}>
              <span>-</span> ₹400 <span>+</span>{" "}
              <span>
                <img src="/images/trash.svg" className={styles.awBid} alt="" />
              </span>
            </h3>
            <h3 className={styles.smallRow}>Ashish Tea</h3>
            <h3 className={styles.smallRow}>
              <span>+</span> Victory Group{" "}
              <span>
                <img src="/images/trash.svg" className={styles.awBid} alt="" />
              </span>
            </h3>
            <h4 className={styles.statusBtn} style={{ background: "#DADADA" }}>
              Negotiating{" "}
              <img src="/images/neg.svg" className={styles.awBid} alt="" />
              <img src="/images/edit.svg" className={styles.awBid} alt="" />
            </h4>
          </div>
        </div>
      </div>
      <div
        className={
          showSidebar
            ? `${styles.sidebarContainer} ${styles.show}`
            : `${styles.sidebarContainer} ${styles.hide}`
        }
      ></div>
    </div>
  );
};

export default OfferListAdmin;
