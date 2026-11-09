import React, { useContext, useEffect, useState } from "react";
import styles from "./SingleOrder.module.css";
import { AppContext } from "../../../context/AppContext";
import { useParams } from "react-router-dom";
import PageLoader from "../../pageLoader/PageLoader";

const SingleOrder = () => {
  const { userOrders, isLoadingData, getOrders } = useContext(AppContext);

  const [sellerInvoice, setSellerInvoice] = useState(null);
  const [deliveryNote, setDeliveryNote] = useState(null);
  const [eWayBill, setEWayBill] = useState(null);
  const { invoiceId } = useParams();
  const currentInvoice = userOrders?.find(
    (invoice) => invoice._id === invoiceId
  );

  const handleDownload = (webViewLink) => {
    const match = webViewLink.match(/\/d\/(.+?)\//);
    const fileId = match ? match[1] : null;

    if (!fileId) {
      alert("Invalid Google Drive link");
      return;
    }

    const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
    const anchor = document.createElement("a");
    anchor.href = downloadUrl;
    anchor.setAttribute("download", "document.pdf"); // optional file name
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  };

  useEffect(() => {
    getOrders();
  }, []);

  useEffect(() => {
    if (userOrders) {
      const findOrder = userOrders.find((invoice) => invoice._id === invoiceId);

      if (findOrder) {
        setSellerInvoice(findOrder.sellerInvoiceUrl);
        setDeliveryNote(findOrder.deliveryNoteUrl);
        setEWayBill(findOrder.ewayBillUrl);
      }
    }
  }, [userOrders]);

  if (isLoadingData) {
    return <PageLoader />;
  }
  if (!isLoadingData && !currentInvoice) {
    return <div> Order not found</div>;
  }

  // if (!isLoadingData && currentInvoice && !currentInvoice.sellerInvoiceUrl) {
  //   return <div>Order Details will be available soon</div>;
  // }
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
      <h2 className={styles.header}>Order History</h2>

      <div className={styles.contentContainer}>
        <div className={styles.topRows}>
          <div className={styles.row1}>
            <h2 className={styles.row1Content}>
              Mark : <span>{currentInvoice.mark}</span>
            </h2>
            <h2 className={styles.row1Content}>
              Offer list :{" "}
              <span>{currentInvoice.offerListNumber.offerListNumber}</span>
            </h2>
            <h2 className={styles.row1Content}>
              Invoice No : <span>{currentInvoice.invoiceNumber}</span>
            </h2>
          </div>

          <div className={styles.row1}>
            <h2 className={styles.row1Content}>
              Seller : <span>{currentInvoice.seller.companyName}</span>
            </h2>
            <h2 className={styles.row1Content}>
              Buyer : <span>{currentInvoice.highestBidder.companyName}</span>
            </h2>
          </div>
        </div>

        <div className={styles.botRowContainer}>
          <div className={styles.botRow}>
            <h2 className={styles.botRowHeader}>Invoice :</h2>
            {!currentInvoice.sellerInvoiceUrl && (
              <h2 className={styles.botRowHeader}>In Process</h2>
            )}
            {currentInvoice.sellerInvoiceUrl && (
              <div className={styles.botRowRight}>
                <img
                  src="/images/fileIcon.svg"
                  className={styles.fileImage}
                  alt=""
                />

                <button onClick={() => handleDownload(sellerInvoice)}>
                  <img
                    src="/images/download.svg"
                    className={styles.dwnImage}
                    alt=""
                  />{" "}
                  Download
                </button>
              </div>
            )}
          </div>

          <div className={styles.botRow}>
            <h2 className={styles.botRowHeader}>Delivey Note : </h2>
            {!currentInvoice.deliveryNoteUrl && (
              <h2 className={styles.botRowHeader}>In Process</h2>
            )}
            {currentInvoice.deliveryNoteUrl && (
              <div className={styles.botRowRight}>
                <img
                  src="/images/fileIcon.svg"
                  className={styles.fileImage}
                  alt=""
                />
                <button onClick={() => handleDownload(deliveryNote)}>
                  <img
                    src="/images/download.svg"
                    className={styles.dwnImage}
                    alt=""
                  />{" "}
                  Download
                </button>
              </div>
            )}
          </div>

          <div className={styles.botRow}>
            <h2 className={styles.botRowHeader}>E-way Bill (Part A) :</h2>
            {!currentInvoice.ewayBillUrl && (
              <h2 className={styles.botRowHeader}>In Process</h2>
            )}
            {currentInvoice.ewayBillUrl && (
              <div className={styles.botRowRight}>
                <img
                  src="/images/fileIcon.svg"
                  className={styles.fileImage}
                  alt=""
                />
                <button onClick={() => handleDownload(eWayBill)}>
                  <img
                    src="/images/download.svg"
                    className={styles.dwnImage}
                    alt=""
                  />{" "}
                  Download
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleOrder;
