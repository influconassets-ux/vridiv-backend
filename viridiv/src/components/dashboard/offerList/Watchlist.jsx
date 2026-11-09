import React, { useContext, useEffect, useState } from "react";
import styles from "./OfferList.module.css";
import { RxHamburgerMenu } from "react-icons/rx";
import { AppContext } from "../../../context/AppContext";
import RaisePrice from "../../raisePrice/RaisePrice";
import SimilarOfferLists from "../../similarOfferLists/SimilarOfferLists";
import { useLocation } from "react-router-dom";

const Watchlist = () => {
  const {
    fetchOfferLists,
    isLoadingData,
    allOfferLists,
    removeFromWatchlist,
    watchlist,
  } = useContext(AppContext);
  const [showSidebar, setShowSidebar] = useState(false);
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [showRaisePrice, setShowRaisePrice] = useState(false);

  const location = useLocation();

  //   console.log(watchlist);

  const handleCheckAll = (e) => {
    const checked = e.target.checked;
    setIsAllChecked(checked);

    if (checked) {
      // Select all invoices
      const validInvoices = watchlist
        .filter((invoice) =>
          ["Place Bid", "Increase Price"].includes(invoice.status)
        )
        .map((invoice) => ({ _id: invoice._id, price: invoice.currentPrice }));

      console.log(validInvoices);
      setSelectedInvoices(validInvoices);
    } else {
      // Uncheck all
      setSelectedInvoices([]);
    }
  };
  const handleCheckInvoice = (e, invoice) => {
    const checked = e.target.checked;

    if (checked) {
      setSelectedInvoices((prev) => [
        ...prev,
        { _id: invoice._id, price: invoice.currentPrice },
      ]);
    } else {
      setSelectedInvoices((prev) =>
        prev.filter((item) => item._id !== invoice._id)
      );
    }

    // If any individual checkbox is unchecked, uncheck "Select All"
    if (!checked) {
      setIsAllChecked(false);
    }
  };

  const handleShowRaisePrice = () => {
    if (selectedInvoices.length < 1) {
      return;
    }
    setShowRaisePrice(true);
  };

  const handleHideRaisePrice = () => {
    setShowRaisePrice(false);
  };

  if (isLoadingData) {
    return <div>....loading</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.mainSidebar}></div>

      {watchlist.length === 0 ? (
        <div>No Data</div>
      ) : (
        <div className={styles.wrapper}>
          <div className={styles.menuIcon} onClick={() => setShowSidebar(true)}>
            <RxHamburgerMenu />
          </div>
          <div className={styles.offerListContainer}>
            <div
              className={styles.offHeaderContainer}
              style={{ marginBottom: "1vw" }}
            >
              <h2 className={styles.lotsTxt}>
                {location.pathname !== "/buyer-dashboard/watchlist"
                  ? "LOTS"
                  : "Watchlist"}
              </h2>
              <h2
                className={styles.putPrice}
                style={{
                  background:
                    selectedInvoices.length > 0 ? "#023602" : "#979797",
                }}
                onClick={handleShowRaisePrice}
              >
                PUT YOUR PRICE
              </h2>
            </div>
          </div>

          <div className={styles.tableContainer}>
            <div className={styles.headerRow}>
              <input
                type="checkbox"
                name=""
                id=""
                checked={isAllChecked ? true : false}
                onChange={handleCheckAll}
                className={styles.checkInput}
              />
              <h3 className={styles.medRow}>Offer List</h3>
              <h3 className={styles.medRow}>Invoice </h3>
              <h3 className={styles.medRow}>Mark</h3>
              <h3 className={styles.medRow}>Lots</h3>
              <h3 className={styles.medRow}>Quantity</h3>
              <h3 className={styles.smallRow}>Bags</h3>
              <h3 className={styles.smallRow}>Price</h3>
              <h3 className={styles.medRow}>Current Price</h3>
              <h3 className={styles.bigRow}>Status</h3>
            </div>

            {watchlist.map((val, i) => {
              return (
                <div className={styles.contentRow} key={i}>
                  <input
                    type="checkbox"
                    name=""
                    id=""
                    className={styles.checkInput}
                    checked={selectedInvoices.some(
                      (item) => item._id === val._id
                    )}
                    disabled={
                      val.status !== "Increase Price" &&
                      val.status !== "Place Bid"
                    }
                    onChange={(e) => handleCheckInvoice(e, val)}
                  />
                  <h3 className={styles.medRow}>
                    #{allOfferLists[0].offerListNumber}
                  </h3>
                  <h3 className={styles.medRow}>{val.invoiceNumber}</h3>
                  <h3 className={styles.medRow}>{val.mark}</h3>
                  <h3 className={styles.medRow}>{val.lots}</h3>
                  <h3 className={styles.medRow}>{val.quantity}</h3>
                  <h3 className={styles.smallRow}>{val.bags}</h3>
                  <h3 className={styles.smallRow}>₹{val.price}</h3>
                  <h3 className={styles.medRow}>
                    <span>-</span> ₹{val.currentPrice} <span>+</span>
                  </h3>
                  {val.status === "Place Bid" && (
                    <h4
                      className={styles.statusBtn}
                      style={{ background: "#BFFF00" }}
                    >
                      Place Bid{" "}
                    </h4>
                  )}
                  {val.status === "Increase Price" && (
                    <h4
                      className={styles.statusBtn}
                      style={{ background: "#DADADA" }}
                    >
                      {val.status}
                    </h4>
                  )}
                  {val.status === "Awaiting Bids" && (
                    <h4
                      className={styles.statusBtn}
                      style={{ background: "#DADADA" }}
                    >
                      Awaiting Bids{" "}
                      <img
                        src="/images/awBid.svg"
                        className={styles.awBid}
                        alt=""
                      />
                    </h4>
                  )}
                  {val.status === "Ordered" && (
                    <h4
                      className={styles.statusBtn}
                      style={{ background: "#023602", color: "white" }}
                    >
                      Ordered
                      <img
                        src="/images/ordered.svg"
                        className={styles.stawBid}
                        alt=""
                      />
                    </h4>
                  )}
                </div>
              );
            })}
          </div>

          {/* <div className={styles.similarWrapper}>
            <SimilarOfferLists />
          </div> */}
        </div>
      )}

      <div
        className={
          showSidebar
            ? `${styles.sidebarContainer} ${styles.show}`
            : `${styles.sidebarContainer} ${styles.hide}`
        }
      ></div>

      {showRaisePrice && <div className={styles.blackBg}></div>}
      <div
        className={
          showRaisePrice
            ? `${styles.raisePriceContainer} ${styles.show}`
            : `${styles.raisePriceContainer} ${styles.hide}`
        }
      >
        <RaisePrice
          handleHideRaisePrice={handleHideRaisePrice}
          selectedInvoices={selectedInvoices}
          setSelectedInvoices={setSelectedInvoices}
        />
      </div>
    </div>
  );
};

export default Watchlist;
