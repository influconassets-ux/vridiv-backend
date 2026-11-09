import React from "react";
import styles from "./DocumentsDwnload.module.css";

const DocumentsDwnload = ({ documents, setShowDocuments }) => {
  const handleDownload = (webViewLink) => {
    setShowDocuments(false);
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

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <h2 className={styles.text}>Tax Invoice : </h2>
        {documents?.taxInvoiceUrl ? (
          <button
            className={styles.btn}
            onClick={() => handleDownload(documents.taxInvoiceUrl)}
          >
            Download
          </button>
        ) : (
          <p className={styles.process}>In Process</p>
        )}
      </div>
      <div className={styles.wrapper}>
        <h2 className={styles.text}>E-Way Bill : </h2>
        {documents?.ewayBillUrl ? (
          <button
            className={styles.btn}
            onClick={() => handleDownload(documents.ewayBillUrl)}
          >
            Download
          </button>
        ) : (
          <p className={styles.process}>In Process</p>
        )}
      </div>
      <div className={styles.wrapper}>
        <h2 className={styles.text}>C.N. : </h2>
        {documents?.cNoteUrl ? (
          <button
            className={styles.btn}
            onClick={() => handleDownload(documents.cNoteUrl)}
          >
            Download
          </button>
        ) : (
          <p className={styles.process}>In Process</p>
        )}
      </div>
      <div className={styles.wrapper}>
        <h2 className={styles.text}>D.O. : </h2>
        {documents?.deliveryOrderUrl ? (
          <button
            className={styles.btn}
            onClick={() => handleDownload(documents.deliveryOrderUrl)}
          >
            Download
          </button>
        ) : (
          <p className={styles.process}>In Process</p>
        )}
      </div>
    </div>
  );
};

export default DocumentsDwnload;
