import React, { useContext, useEffect, useState } from "react";
import styles from "./OfferList.module.css";
import { RxHamburgerMenu } from "react-icons/rx";
import OfferSideBar from "../offerSideBar/OfferSideBar";
import { AppContext } from "../../../context/AppContext";
import RaisePrice from "../../raisePrice/RaisePrice";
import SimilarOfferLists from "../../similarOfferLists/SimilarOfferLists";
import { MdDownloadForOffline } from "react-icons/md";

const OfferList = () => {
  const {
    fetchOfferLists,
    isLoadingData,
    allOfferLists,
    sidebarSelectedOfferList,
    downloadOfferList,
  } = useContext(AppContext);
  const [showSidebar, setShowSidebar] = useState(false);
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [showRaisePrice, setShowRaisePrice] = useState(false);

  const handleCheckAll = (e) => {
    const checked = e.target.checked;
    setIsAllChecked(checked);

    if (checked) {
      // Select all invoices
      const validInvoices = col.invoices
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

  useEffect(() => {
    fetchOfferLists();
  }, []);

  if (isLoadingData) {
    return <div>....loading</div>;
  }
  if (!isLoadingData && allOfferLists.length === 0) {
    return (
      <div className={`${styles.lotsTxt} ${styles.noHeader}`}>
        No Offer List Added Yet
      </div>
    );
  }

  if (allOfferLists.length > 0) {
    return (
      <div className={styles.container}>
        <div className={styles.mainSidebar}>
          <OfferSideBar setShowSidebar={setShowSidebar} />
        </div>

        {allOfferLists.length === 0 ? (
          <div>No offer Lists to show</div>
        ) : (
          <div className={styles.wrapper}>
            <div
              className={styles.menuIcon}
              onClick={() => setShowSidebar(true)}
            >
              <RxHamburgerMenu />
            </div>
            <div className={styles.offerListContainer}>
              <div className={styles.offHeaderContainer}>
                <h2 className={styles.lotsTxt}>LOTS</h2>
                {sidebarSelectedOfferList.offerListStatus !== "Live" && (
                  <div className={styles.dwnOffer} onClick={downloadOfferList}>
                    <MdDownloadForOffline />
                  </div>
                )}
              </div>
            </div>

            <div className={styles.tableContainer}>
              <div className={styles.headerRow}>
                <h3 className={styles.medRow}>Offer List</h3>
                <h3 className={styles.medRow}>Invoice </h3>
                <h3 className={styles.medRow}>Mark</h3>
                <h3 className={styles.medRow}>Grade</h3>
                <h3 className={styles.medRow}>Quantity</h3>
                <h3 className={styles.smallRow}>Bags</h3>
                <h3 className={styles.smallRow}>Price</h3>
                <h3 className={styles.medRow}>Sold To</h3>
                <h3 className={styles.bigRow}>Status</h3>
              </div>

              {sidebarSelectedOfferList.invoices.map((val, i) => {
                return (
                  <div className={styles.contentRow} key={i}>
                    <h3 className={styles.medRow}>
                      #{sidebarSelectedOfferList.offerListNumber}
                    </h3>
                    <h3 className={styles.medRow}>{val.invoiceNumber}</h3>
                    <h3 className={styles.medRow}>{val.mark}</h3>
                    <h3 className={styles.medRow}>{val.grade}</h3>
                    <h3 className={styles.medRow}>{val.quantity}</h3>
                    <h3 className={styles.smallRow}>{val.bags}</h3>
                    <h3 className={styles.smallRow}>₹{val.price}</h3>

                    <h3 className={styles.medRow}>
                      {val.soldTo ? val.soldTo.companyName : "NA"}
                    </h3>

                    {sidebarSelectedOfferList.offerListStatus === "Hidden" && (
                      <h4 className={styles.statusBtn}>Sale Not Started</h4>
                    )}
                    {val.status !== "Ordered" &&
                      sidebarSelectedOfferList.offerListStatus !== "Hidden" && (
                        <h4 className={styles.statusBtn}>Sale In Progress</h4>
                      )}
                    {val.status === "Ordered" && (
                      <h4
                        className={styles.statusBtn}
                        style={{ background: "#023602", color: "white" }}
                      >
                        Sold
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
          </div>
        )}
        <div
          className={
            showSidebar
              ? `${styles.sidebarContainer} ${styles.show}`
              : `${styles.sidebarContainer} ${styles.hide}`
          }
        >
          <OfferSideBar setShowSidebar={setShowSidebar} />
        </div>

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
  }
};

export default OfferList;
