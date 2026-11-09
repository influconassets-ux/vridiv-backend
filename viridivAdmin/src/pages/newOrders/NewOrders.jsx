import React, { useContext, useEffect, useRef, useState } from "react";
import styles from "./NewOrders.module.css";
import { FaUpload } from "react-icons/fa";
import { FaFile } from "react-icons/fa";
import { FaEdit, FaFileDownload } from "react-icons/fa";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";
import OrderFilter from "../../components/offerFilter/OrderFilter";
import { RxHamburgerMenu } from "react-icons/rx";
import OrderSidebar from "../../components/orderSidebar/OrderSidebar";
import OrderDocuments from "../../components/orderDocuments/OrderDocuments";
import { IoIosArrowDown } from "react-icons/io";
import PageLoader from "../../components/pageLoader/PageLoader";

const NewOrders = () => {
  const {
    getOrders,
    userOrders,
    isLoadingData,
    showLoader,
    generateSon,
    updateBankDetails,
    uploadInvoiceDocs,
    updateDeliveryStatus,
    downloadOrdersReport,
  } = useContext(AppContext);

  const wrapperRef = useRef(null);
  const [showSidebar, setShowSidebar] = useState(false);

  const [documents, setDocuments] = useState({});
  const [uploadingDocs, setUploadingDocs] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [isAllOrdersChecked, setIsAllOrdersChecked] = useState(false);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [currentFilter, setCurrentFilter] = useState("");
  const [sidebarSelectedOrder, setSidebarSelectedOrder] = useState("");
  const [uniqueSON, setUniqueSON] = useState("");
  const [showDocumentsModal, setShowDocumentsModal] = useState(false);

  const selectSidebarOrder = (saleOrderNumber) => {
    setSidebarSelectedOrder(
      userOrders.filter((order) => order.saleOrderNumber === saleOrderNumber)
    );
    setShowSidebar(false);
  };

  const handleOrderSelection = (e, orderId) => {
    const isChecked = e.target.checked;

    if (isChecked) {
      const checkedOrder = filteredOrders.find(
        (order) => order._id === orderId
      );

      const updatedOrders = [...selectedOrders, checkedOrder];

      setSelectedOrders((prev) => [...prev, checkedOrder]);
      setIsAllOrdersChecked(updatedOrders.length === filteredOrders.length);
    } else {
      setSelectedOrders((prev) => prev.filter((val) => val._id !== orderId));
      setIsAllOrdersChecked(false);
    }
  };

  const handleSelectAllCheckBox = (e) => {
    const isChecked = e.target.checked;

    if (isChecked) {
      setIsAllOrdersChecked(true);
      setSelectedOrders(filteredOrders);
    } else {
      setIsAllOrdersChecked(false);
      setSelectedOrders([]);
    }
  };

  const handleFilterOrders = (headerType, headerValue) => {
    if (!Array.isArray(headerValue) || headerValue.length === 0) {
      return; // Return full list if headerValue is not a valid array
    }
    let updatedList;
    if (headerType === "saleOrderNumber") {
      updatedList = filteredOrders.filter((order) =>
        headerValue.includes(order[headerType])
      );
    }

    setFilteredOrders(updatedList);
    setCurrentFilter("");
    setSelectedOrders([]);
    setIsAllOrdersChecked(false);
  };

  const handleFilterHeader = (e, headerType) => {
    if (
      currentFilter === headerType &&
      wrapperRef.current &&
      !wrapperRef.current.contains(e.target)
    ) {
      setCurrentFilter("");
    } else if (wrapperRef.current && wrapperRef.current.contains(e.target)) {
      return;
    } else {
      setCurrentFilter(headerType);
    }
  };

  const handleFilterClear = () => {
    if (filteredOrders.length !== userOrders.length) {
      updateFilteredValuesCorrectly("");
      setSelectedOrders([]);
      setIsAllOrdersChecked(false);
    }
    setCurrentFilter("");
  };

  const updateFilteredValuesCorrectly = (orderInput) => {
    if (orderInput) {
      setFilteredOrders(
        userOrders.filter((order) => order.saleOrderNumber === orderInput)
      );
    } else if (sidebarSelectedOrder) {
      setFilteredOrders(
        userOrders.filter(
          (order) => order.saleOrderNumber === sidebarSelectedOrder
        )
      );
    } else {
      const firstOrderSon = userOrders[0].saleOrderNumber;
      setSidebarSelectedOrder(firstOrderSon);
      setFilteredOrders(
        userOrders.filter((order) => order.saleOrderNumber === firstOrderSon)
      );
    }
  };

  const changeSiderbarSelectedOrder = (orderToChange) => {
    if (orderToChange) {
      setSidebarSelectedOrder(orderToChange);
      updateFilteredValuesCorrectly(orderToChange);
      setShowSidebar(false);
      setSelectedOrders([]);
      setDocuments({});
      setIsAllOrdersChecked(false);
      setShowDocumentsModal(false);
    }
  };
  useEffect(() => {
    function handleClickOutside(event) {
      const ignoredIds = ["saleOrderId"]; // Add valid IDs here

      // Check if clicked element has an ID in the ignored list
      if (ignoredIds.includes(event.target.id)) {
        return;
      }

      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setCurrentFilter("");
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [currentFilter]);

  useEffect(() => {
    getOrders();
  }, []);

  useEffect(() => {
    if (userOrders && userOrders.length > 0) {
      const uniqueSet = new Set(
        userOrders
          .map((order) => order.saleOrderNumber)
          .filter((order) => order !== (null || undefined))
      );

      setUniqueSON([...uniqueSet]);
      updateFilteredValuesCorrectly("");
    }
  }, [userOrders]);

  if (isLoadingData) {
    return <PageLoader />;
  }
  if (!isLoadingData && userOrders.length === 0) {
    return <div className={styles.header}>No Orders</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.menuIcon} onClick={() => setShowSidebar(true)}>
          <RxHamburgerMenu />
        </div>
        <header className={styles.topSec}>
          <div className={styles.topleft}>
            <div className={styles.cnDaysWrapper}>
              <p className={styles.cnDays}>
                C.D.% : {filteredOrders[0]?.cashDiscount}
              </p>
              <p className={styles.cnDays}>
                Days: {filteredOrders[0]?.daysCount}
              </p>
            </div>
          </div>
          <h2 className={styles.header}>{sidebarSelectedOrder}</h2>

          <div className={styles.topRight}>
            <div className={styles.docBtnWrapper}>
              <button
                onClick={() => setShowDocumentsModal((prev) => !prev)}
                className={styles.topBtn}
              >
                Documents
                <div
                  className={styles.arrow}
                  style={{ rotate: showDocumentsModal ? "-180deg" : "0deg" }}
                >
                  <IoIosArrowDown />
                </div>
              </button>

              {showDocumentsModal && (
                <div className={styles.docModal}>
                  <OrderDocuments
                    orderDocuments={filteredOrders[0]?.documents}
                    setUploadingDocs={setUploadingDocs}
                    uploadingDocs={uploadingDocs}
                    filteredOrders={filteredOrders}
                    setShowDocumentsModal={setShowDocumentsModal}
                  />
                </div>
              )}
            </div>

            <button
              className={styles.topBtn}
              onClick={() => downloadOrdersReport("", "")}
            >
              Download Orders
            </button>
          </div>
        </header>

        <div className={styles.tableContainer}>
          <div className={styles.headerRow}>
            <input
              type="checkbox"
              name=""
              id=""
              className={styles.checkInput}
              onChange={handleSelectAllCheckBox}
              checked={isAllOrdersChecked}
            />

            <h3 className={`${styles.tHeader} ${styles.medC}`}>OfferList</h3>
            <h3 className={`${styles.tHeader} ${styles.medC}`}>Mark</h3>
            <h3 className={`${styles.tHeader} ${styles.smC}`}>Invoice No.</h3>
            <h3 className={`${styles.tHeader} ${styles.medC}`}>Grade</h3>
            <h3 className={`${styles.tHeader} ${styles.smC}`}>Bags</h3>
            <h3 className={`${styles.tHeader} ${styles.smC}`}>Qty.</h3>
            <h3 className={`${styles.tHeader} ${styles.smC}`}>Sold At</h3>
            <h3 className={`${styles.tHeader} ${styles.medC}`}>Buyer</h3>
            <h3 className={`${styles.tHeader} ${styles.medC}`}>Offered To</h3>
            <h3 className={`${styles.tHeader} ${styles.medC}`}>Seller</h3>

            <h3 className={`${styles.tHeader} ${styles.bigC}`}>Address</h3>

            <h3 className={`${styles.tHeader} ${styles.medC}`}>Status</h3>
          </div>

          <div className={styles.bodyRowContainer}>
            {filteredOrders.map((val, i) => {
              return (
                <div className={styles.row} key={i}>
                  <input
                    type="checkbox"
                    name=""
                    id=""
                    className={styles.checkInput}
                    onChange={(e) => handleOrderSelection(e, val._id)}
                    checked={selectedOrders.some(
                      (item) => item._id === val._id
                    )}
                  />

                  <h3 className={`${styles.tBody} ${styles.medC}`}>
                    {val.invoice.offerListNumber.offerListNumber}
                  </h3>
                  <h3 className={`${styles.tBody} ${styles.medC}`}>
                    {val.invoice.mark}
                  </h3>
                  <h3 className={`${styles.tBody} ${styles.smC}`}>
                    {val.invoice.invoiceNumber}
                  </h3>
                  <h3 className={`${styles.tBody} ${styles.medC}`}>
                    {" "}
                    {val.invoice.grade}
                  </h3>
                  <h3 className={`${styles.tBody} ${styles.smC}`}>
                    {val.invoice.highestBiddingPrice}
                  </h3>
                  <h3 className={`${styles.tBody} ${styles.smC}`}>
                    {val.invoice.highestBiddingPrice}
                  </h3>
                  <h3 className={`${styles.tBody} ${styles.smC}`}>
                    {val.invoice.highestBiddingPrice}
                  </h3>
                  <h3 className={`${styles.tBody} ${styles.medC}`}>
                    {val.buyer.companyName}
                  </h3>
                  <div className={`${styles.tBody} ${styles.medC} ${styles.buyersCell}`}>
                    <span className={styles.viewBtn}>
                      {val.invoice.allowedBuyers.length > 0
                        ? `${val.invoice.allowedBuyers.length} Buyers`
                        : "Public"}
                      <ul className={styles.bList}>
                        {val.invoice.allowedBuyers.length > 0 ? (
                          val.invoice.allowedBuyers.map((item, i) => (
                            <li key={i} className={styles.blistItem}>
                              {item.companyName}
                            </li>
                          ))
                        ) : (
                          <li className={styles.blistItem}>All Buyers</li>
                        )}
                      </ul>
                    </span>
                  </div>
                  <h3 className={`${styles.tBody} ${styles.medC}`}>
                    {val.seller.companyName}
                  </h3>

                  <div
                    className={`${styles.tBody} ${styles.addBody} ${styles.bigC}`}
                  >
                    {!val.shippingAddress.street ? (
                      <p>Not Updated</p>
                    ) : (
                      <div style={{ width: "fit-content" }}>
                        <h3 className={styles.addCont}>
                          <strong>Billing:</strong> {val.billingAddress.street},{" "}
                          {val.billingAddress.city}, {val.billingAddress.state},{" "}
                          {val.billingAddress.country}{" "}
                          {val.billingAddress.zipCode}
                        </h3>
                        <br />

                        {val.isBillingAddressSameAsShipping ? (
                          <h3 className={styles.addCont}>
                            <strong>Shipping:</strong> Same as Billing
                          </h3>
                        ) : (
                          <h3 className={styles.addCont}>
                            <strong>Shipping:</strong>{" "}
                            {val.shippingAddress.street},{" "}
                            {val.shippingAddress.city},{" "}
                            {val.shippingAddress.state},{" "}
                            {val.shippingAddress.country}{" "}
                            {val.shippingAddress.zipCode}
                          </h3>
                        )}

                        <h3 className={styles.addCont}>
                          <strong>Transporter:</strong> {val.transporter}
                        </h3>
                      </div>
                    )}
                  </div>

                  <div
                    className={`${styles.tBody} ${styles.medC}`}
                    style={{ flexDirection: "column", gap: "0.7vw" }}
                  >
                    <h2 className={styles.statusText}>{val.deliveryStatus}</h2>

                    {val.deliveryStatus &&
                      val.deliveryStatus === "In Transit" && (
                        <button
                          className={styles.bankBtn}
                          onClick={() =>
                            updateDeliveryStatus(
                              val._id,
                              "Transaction Complete"
                            )
                          }
                        >
                          Complete Transaction
                        </button>
                      )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {showLoader && (
        <div className={styles.loaderContainer}>
          <img src="/images/newLoader.gif" className={styles.loader} alt="" />
        </div>
      )}
      <div
        className={
          showSidebar
            ? `${styles.sidebarContainer} ${styles.show}`
            : `${styles.sidebarContainer} ${styles.hide}`
        }
      >
        <OrderSidebar
          setShowSidebar={setShowSidebar}
          uniqueValues={uniqueSON}
          sidebarSelectedOrder={sidebarSelectedOrder}
          changeSiderbarSelectedOrder={changeSiderbarSelectedOrder}
        />
      </div>
    </div>
  );
};

export default NewOrders;

{
  /* <img
                src="/images/darkFilterArrow.jpg"
                className={styles.filterArwImage}
                alt=""
              /> */
}
{
  /* {currentFilter === "saleOrderNumber" && (
                <div className={styles.ofWrapper} ref={wrapperRef}>
                  <OrderFilter
                    filterHeader={"saleOrderNumber"}
                    handleFilterOrders={handleFilterOrders}
                    handleFilterClear={handleFilterClear}
                    filteredOrders={filteredOrders}
                  />
                </div>
              )} */
}
