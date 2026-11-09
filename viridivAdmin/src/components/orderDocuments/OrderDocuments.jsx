import React, { useContext, useState } from "react";
import styles from "./OrderDocuments.module.css";
import { FaUpload } from "react-icons/fa";
import { FaFile } from "react-icons/fa";
import { FaEdit, FaFileDownload } from "react-icons/fa";
import { AppContext } from "../../context/AppContext";

const OrderDocuments = ({
  orderDocuments,
  setUploadingDocs,
  uploadingDocs,
  filteredOrders,
  setShowDocumentsModal,
}) => {
  const { uploadInvoiceDocs } = useContext(AppContext);
  const [documents, setDocuments] = useState({});
  //   const [selectedOrderDocuments, setSelectedOrderDocuments] = useState("");

  const handleOnchange = (e) => {
    const { name, files } = e.target;

    setDocuments((prev) => ({
      ...prev,
      [name]: files[0],
    }));
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

  const handleDocumentsSubmit = async () => {
    if (uploadingDocs) {
      return;
    }
    setUploadingDocs(true);
    if (
      !documents ||
      (!documents.taxInvoice &&
        !documents.cNote &&
        !documents.eWayBill &&
        !documents.deliveryOrder)
    ) {
      alert("Please upload a document");
      setUploadingDocs(false);
      return;
    }

    // Send the files to the context function
    setShowDocumentsModal(false);
    await uploadInvoiceDocs({
      taxInvoice: documents.taxInvoice,
      cNote: documents.cNote,
      deliveryOrder: documents.deliveryOrder,
      eWayBill: documents.eWayBill,

      orderId: filteredOrders[0]._id,
    });

    setUploadingDocs(false);
  };
  return (
    <div className={styles.container}>
      <div className={styles.modal}>
        <div className={styles.docOuterWrapper}>
          <div className={styles.docWrapper}>
            Tax Invoice
            {!documents?.taxInvoice && !orderDocuments?.taxInvoiceUrl && (
              <>
                <label
                  htmlFor={`taxInvoiceUpload`}
                  style={{ cursor: "pointer" }}
                  className={styles.upIcon}
                >
                  <FaUpload />
                </label>
                <input
                  type="file"
                  style={{ display: "none" }}
                  name="taxInvoice"
                  id={`taxInvoiceUpload`}
                  onChange={(e) => handleOnchange(e)}
                />
              </>
            )}
            {(documents?.taxInvoice || orderDocuments?.taxInvoiceUrl) && (
              <div className={styles.editContainer}>
                {orderDocuments?.taxInvoiceUrl ? (
                  <div
                    className={styles.upIcon}
                    style={{ cursor: "pointer" }}
                    onClick={() => handleDownload(orderDocuments.taxInvoiceUrl)}
                  >
                    <FaFileDownload />
                  </div>
                ) : (
                  <div className={styles.upIcon}>
                    <FaFile />
                  </div>
                )}
                <>
                  <label
                    htmlFor={`taxInvoiceUpload`}
                    style={{ cursor: "pointer" }}
                    className={styles.upIcon}
                  >
                    <FaEdit />
                  </label>
                  <input
                    type="file"
                    style={{ display: "none" }}
                    name="taxInvoice"
                    id={`taxInvoiceUpload`}
                    onChange={(e) => handleOnchange(e)}
                  />
                </>
              </div>
            )}
          </div>

          <div className={styles.docWrapper}>
            E-Way Bill:
            {!documents?.eWayBill && !orderDocuments?.ewayBillUrl && (
              <>
                <label
                  htmlFor={`eWayBillUpload`}
                  style={{ cursor: "pointer" }}
                  className={styles.upIcon}
                >
                  <FaUpload />
                </label>
                <input
                  type="file"
                  style={{ display: "none" }}
                  name="eWayBill"
                  id={`eWayBillUpload`}
                  onChange={(e) => handleOnchange(e)}
                />
              </>
            )}
            {(documents?.eWayBill || orderDocuments?.ewayBillUrl) && (
              <div className={styles.editContainer}>
                {orderDocuments?.ewayBillUrl ? (
                  <div
                    className={styles.upIcon}
                    style={{ cursor: "pointer" }}
                    onClick={() => handleDownload(orderDocuments.ewayBillUrl)}
                  >
                    <FaFileDownload />
                  </div>
                ) : (
                  <div className={styles.upIcon}>
                    <FaFile />
                  </div>
                )}
                <>
                  <label
                    htmlFor={`eWayBillUpload`}
                    style={{ cursor: "pointer" }}
                    className={styles.upIcon}
                  >
                    <FaEdit />
                  </label>
                  <input
                    type="file"
                    style={{ display: "none" }}
                    name="eWayBill"
                    id={`eWayBillUpload`}
                    onChange={(e) => handleOnchange(e)}
                  />
                </>
              </div>
            )}
          </div>
          <div className={styles.docWrapper}>
            C. Note:
            {!documents?.cNote && !orderDocuments?.cNoteUrl && (
              <>
                <label
                  htmlFor={`cNoteUpload`}
                  style={{ cursor: "pointer" }}
                  className={styles.upIcon}
                >
                  <FaUpload />
                </label>
                <input
                  type="file"
                  style={{ display: "none" }}
                  name="cNote"
                  id={`cNoteUpload`}
                  onChange={(e) => handleOnchange(e)}
                />
              </>
            )}
            {(documents?.cNote || orderDocuments?.cNoteUrl) && (
              <div className={styles.editContainer}>
                {orderDocuments?.cNoteUrl ? (
                  <div
                    className={styles.upIcon}
                    style={{ cursor: "pointer" }}
                    onClick={() => handleDownload(orderDocuments.cNoteUrl)}
                  >
                    <FaFileDownload />
                  </div>
                ) : (
                  <div className={styles.upIcon}>
                    <FaFile />
                  </div>
                )}
                <>
                  <label
                    htmlFor={`cNoteUpload`}
                    style={{ cursor: "pointer" }}
                    className={styles.upIcon}
                  >
                    <FaEdit />
                  </label>
                  <input
                    type="file"
                    style={{ display: "none" }}
                    name="cNote"
                    id={`cNoteUpload`}
                    onChange={(e) => handleOnchange(e)}
                  />
                </>
              </div>
            )}{" "}
          </div>
          <div className={styles.docWrapper}>
            D.O.:
            {!documents?.deliveryOrder && !orderDocuments?.deliveryOrderUrl && (
              <>
                <label
                  htmlFor={`deliveryOrderUpload`}
                  style={{ cursor: "pointer" }}
                  className={styles.upIcon}
                >
                  <FaUpload />
                </label>
                <input
                  type="file"
                  style={{ display: "none" }}
                  name="deliveryOrder"
                  id={`deliveryOrderUpload`}
                  onChange={(e) => handleOnchange(e)}
                />
              </>
            )}
            {(documents?.deliveryOrder || orderDocuments?.deliveryOrderUrl) && (
              <div className={styles.editContainer}>
                {orderDocuments?.deliveryOrderUrl ? (
                  <div
                    className={styles.upIcon}
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      handleDownload(orderDocuments.deliveryOrderUrl)
                    }
                  >
                    <FaFileDownload />
                  </div>
                ) : (
                  <div className={styles.upIcon}>
                    <FaFile />
                  </div>
                )}
                <>
                  <label
                    htmlFor={`deliveryOrderUpload`}
                    style={{ cursor: "pointer" }}
                    className={styles.upIcon}
                  >
                    <FaEdit />
                  </label>
                  <input
                    type="file"
                    style={{ display: "none" }}
                    name="deliveryOrder"
                    id={`deliveryOrderUpload`}
                    onChange={(e) => handleOnchange(e)}
                  />
                </>
              </div>
            )}{" "}
          </div>

          {(documents?.cNote ||
            documents?.eWayBill ||
            documents?.taxInvoice ||
            documents?.deliveryOrder) && (
            <button
              className={styles.bankBtn}
              style={{ width: "100%" }}
              onClick={handleDocumentsSubmit}
            >
              Upload
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDocuments;
