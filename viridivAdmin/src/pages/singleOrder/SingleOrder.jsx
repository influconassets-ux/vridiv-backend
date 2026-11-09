import React, { useContext, useEffect, useState } from "react";
import styles from "./SingleOrder.module.css";
import { AppContext } from "../../context/AppContext";
import { useParams } from "react-router-dom";
import PageLoader from "../../components/pageLoader/PageLoader";

const SingleOrder = () => {
  const { uploadInvoiceDocs, userOrders, isLoadingData, getOrders } =
    useContext(AppContext);
  const [uploadingDocs, setUploadingDocs] = useState(false);
  const [sellerInvoice, setSellerInvoice] = useState(null);
  const [deliveryNote, setDeliveryNote] = useState(null);

  const [driveLinks, setDriveLinks] = useState({
    sellerInvoice: "",
    deliveryNote: "",
    eWayBill: "",
  });
  const [eWayBill, setEWayBill] = useState(null);
  const { invoiceId } = useParams();
  const currentInvoice = userOrders?.find(
    (invoice) => invoice._id === invoiceId
  );
  console.log(currentInvoice);

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === "sellerInvoice") setSellerInvoice(files[0]);
    if (name === "deliveryNote") setDeliveryNote(files[0]);
    if (name === "eWayBill") setEWayBill(files[0]);
  };
  const handleSubmit = async () => {
    if (uploadingDocs) {
      return;
    }
    setUploadingDocs(true);
    if (!sellerInvoice || !deliveryNote || !eWayBill) {
      alert("Please upload all three documents");
      setUploadingDocs(false);
      return;
    }

    // Send the files to the context function
    await uploadInvoiceDocs({
      sellerInvoice,
      deliveryNote,
      eWayBill,
      invoiceId,
    });

    setUploadingDocs(false);
  };

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
        setDriveLinks({
          sellerInvoice: findOrder.sellerInvoiceUrl
            ? findOrder.sellerInvoiceUrl
            : "",
          deliveryNote: findOrder.deliveryNoteUrl,
          eWayBill: findOrder.ewayBillUrl,
        });
      }
    }
  }, [userOrders]);

  if (isLoadingData) {
    return <PageLoader />;
  }
  if (!isLoadingData && !currentInvoice) {
    return <div> Order not found</div>;
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
            <h2 className={styles.row1Content}>
              Order Price : <span>₹{currentInvoice.highestBiddingPrice}</span>
            </h2>
          </div>
        </div>

        <div className={styles.botRowContainer}>
          <div className={styles.botRow}>
            <h2 className={styles.botRowHeader}>Seller Invoice :</h2>
            <div className={styles.botRowRight}>
              {sellerInvoice && (
                <img
                  src="/images/fileIcon.svg"
                  className={styles.fileImage}
                  alt=""
                />
              )}

              {driveLinks.sellerInvoice && (
                <button
                  onClick={() => handleDownload(driveLinks.sellerInvoice)}
                >
                  <img
                    src="/images/download.svg"
                    className={styles.dwnImage}
                    alt=""
                  />{" "}
                  Download
                </button>
              )}

              <input
                type="file"
                id="sellerInvoice"
                name="sellerInvoice"
                style={{ display: "none" }}
                onChange={handleFileChange}
                accept="application/pdf"
              />

              <label htmlFor="sellerInvoice" className={styles.uplLable}>
                <img
                  src="/images/upload.svg"
                  className={styles.dwnImage}
                  alt=""
                />{" "}
                Upload
              </label>
            </div>
          </div>

          <div className={styles.botRow}>
            <h2 className={styles.botRowHeader}>Delivey Note:</h2>
            <div className={styles.botRowRight}>
              {deliveryNote && (
                <img
                  src="/images/fileIcon.svg"
                  className={styles.fileImage}
                  alt=""
                />
              )}

              {driveLinks.deliveryNote && (
                <button onClick={() => handleDownload(driveLinks.deliveryNote)}>
                  <img
                    src="/images/download.svg"
                    className={styles.dwnImage}
                    alt=""
                  />{" "}
                  Download
                </button>
              )}

              <input
                type="file"
                id="deliveryNote"
                name="deliveryNote"
                style={{ display: "none" }}
                onChange={handleFileChange}
                accept="application/pdf"
              />

              <label htmlFor="deliveryNote" className={styles.uplLable}>
                <img
                  src="/images/upload.svg"
                  className={styles.dwnImage}
                  alt=""
                />{" "}
                Upload
              </label>
            </div>
          </div>

          <div className={styles.botRow}>
            <h2 className={styles.botRowHeader}>E-way Bill (Part A) :</h2>
            <div className={styles.botRowRight}>
              {eWayBill && (
                <img
                  src="/images/fileIcon.svg"
                  className={styles.fileImage}
                  alt=""
                />
              )}
              {driveLinks.eWayBill && (
                <button onClick={() => handleDownload(driveLinks.eWayBill)}>
                  <img
                    src="/images/download.svg"
                    className={styles.dwnImage}
                    alt=""
                  />{" "}
                  Download
                </button>
              )}

              <input
                type="file"
                id="eWayBill"
                name="eWayBill"
                style={{ display: "none" }}
                onChange={handleFileChange}
                accept="application/pdf"
              />

              <label htmlFor="eWayBill" className={styles.uplLable}>
                <img
                  src="/images/upload.svg"
                  className={styles.dwnImage}
                  alt=""
                />{" "}
                Upload
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.statusBtnContainer}>
        <button
          className={styles.statusBtn}
          style={{ backgroundColor: uploadingDocs ? "grey" : "#023602" }}
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>

      {uploadingDocs && (
        <div className={styles.loaderContainer}>
          <img src="/images/newLoader.gif" className={styles.loader} alt="" />
        </div>
      )}
    </div>
  );
};

export default SingleOrder;
