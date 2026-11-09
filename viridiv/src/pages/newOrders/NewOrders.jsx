import React, { useContext, useEffect, useRef, useState } from "react";
import styles from "./NewOrders.module.css";
import { FaUpload } from "react-icons/fa";
import { FaFile } from "react-icons/fa";
import { FaEdit, FaFileDownload } from "react-icons/fa";
import { AppContext } from "../../context/AppContext";
import { motion } from "motion/react";
import AddressForm from "../../components/ordersPage/addressForm/AddressForm";
import OrderFilter from "../../components/dashboard/offerFilter/OrderFilter";
import OrderSidebar from "../../components/orderSidebar/OrderSidebar";
import { RxHamburgerMenu } from "react-icons/rx";
import DocumentsDwnload from "./documentsDwnload/DocumentsDwnload";
import { IoIosArrowDown } from "react-icons/io";
import PageLoader from "../../components/pageLoader/PageLoader";

const NewOrders = () => {
  const {
    getOrders,
    userOrders,
    isLoadingData,
    showLoader,
    updateOrderAddress,
  } = useContext(AppContext);

  const [showSidebar, setShowSidebar] = useState(false);
  const [sidebarSelectedOrder, setSidebarSelectedOrder] = useState("");
  const [uniqueSON, setUniqueSON] = useState("");
  const wrapperRef = useRef(null);

  const [showUpdateAddress, setShowUpdateAddress] = useState(false);
  const [showUpdateAddressMultiple, setShowUpdateAddressMultiple] =
    useState(false);
  const [selectSingleOrderId, setSelectSingleOrderId] = useState(null);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [isAllOrdersChecked, setIsAllOrdersChecked] = useState(false);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [currentFilter, setCurrentFilter] = useState("");
  const [showBankDetails, setShowBankDetails] = useState(false);
  const [showDocuments, setShowDocuments] = useState(false);

  const handleAddressModal = () => {
    setShowUpdateAddress((prev) => !prev);
  };
  const hideAddressModals = () => {
    setShowUpdateAddress(false);
    setShowUpdateAddressMultiple(false);
    setSelectSingleOrderId(null);
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
      setFilteredOrders(userOrders);
      setSelectedOrders([]);
      setIsAllOrdersChecked(false);
      setCurrentFilter("");
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

      setIsAllOrdersChecked(false);
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
            {selectedOrders.length > 0 && (
              <motion.button
                className={styles.topBtn}
                style={{
                  backgroundColor:
                    selectedOrders.length > 0 ? "#007A4D" : "rgb(66, 125, 144)",
                }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ duration: 0.3, type: "spring" }}
                onClick={() => {
                  console.log(selectedOrders);
                  setShowUpdateAddressMultiple(true);
                }}
              >
                Update Address (Selected Orders)
              </motion.button>
            )}
          </div>
          <h2 className={styles.header}>{sidebarSelectedOrder}</h2>
          <div className={styles.topRight}>
            <div className={styles.docContainer}>
              <button
                className={`${styles.topBtn} ${styles.bankBtn}`}
                // style={{
                //   backgroundColor: "rgb(66, 125, 144)",
                // }}
                onClick={() => setShowDocuments((prev) => !prev)}
              >
                Documents
                <div
                  className={styles.arrow}
                  style={{ rotate: showDocuments ? "-180deg" : "0deg" }}
                >
                  <IoIosArrowDown />
                </div>
              </button>

              {showDocuments && (
                <div className={styles.docWrapper}>
                  <DocumentsDwnload
                    documents={filteredOrders[0]?.documents}
                    setShowDocuments={setShowDocuments}
                  />
                </div>
              )}
            </div>
            <button className={`${styles.topBtn} ${styles.bankBtn}`}>
              Show bank Details
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
            <h3 className={`${styles.tHeader} ${styles.medC}`}>
              Payment Terms
            </h3>
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
                    {val.invoice.bags}
                  </h3>
                  <h3 className={`${styles.tBody} ${styles.smC}`}>
                    {val.invoice.quantity}
                  </h3>
                  <h3 className={`${styles.tBody} ${styles.smC}`}>
                    ₹{val.invoice.highestBiddingPrice}/kg
                  </h3>
                  <h3 className={`${styles.tBody} ${styles.medC}`}>
                    C.D.% : {val.cashDiscount} <br />
                    No. of Days: {val.daysCount}
                  </h3>
                  <h3 className={`${styles.tBody} ${styles.medC}`}>
                    {val.seller.companyName}
                  </h3>
                  {/* <div className={`${styles.tBody} ${styles.docC}`}>
                    <div className={styles.docOuterWrapper}>
                      <div className={styles.docWrapper}>
                        Tax Invoice:
                        {!val.documents?.taxInvoiceUrl && (
                          <p>
                            <strong>In Process</strong>
                          </p>
                        )}
                        {val.documents?.taxInvoiceUrl && (
                          <div className={styles.editContainer}>
                            <div className={styles.upIcon}>
                              <FaFileDownload />
                            </div>
                          </div>
                        )}
                      </div>

                      <div className={styles.docWrapper}>
                        E-Way Bill:
                        {val.documents?.ewayBillUrl && (
                          <div className={styles.editContainer}>
                            <div className={styles.upIcon}>
                              <FaFileDownload />
                            </div>
                          </div>
                        )}
                        {!val.documents?.ewayBillUrl && (
                          <p>
                            <strong>In Process</strong>
                          </p>
                        )}
                      </div>

                      <div className={styles.docWrapper}>
                        C. Note:
                        {!val.documents?.cNoteUrl && (
                          <p>
                            <strong>In Process</strong>
                          </p>
                        )}
                        {val.documents?.cNoteUrl && (
                          <div className={styles.editContainer}>
                            <div
                              className={styles.upIcon}
                              onClick={() =>
                                handleDownload(val.documents.cNoteUrl)
                              }
                            >
                              <FaFileDownload />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div> */}

                  <div
                    className={`${styles.tBody} ${styles.addBody} ${styles.bigC}`}
                  >
                    {val.shippingAddress.street && (
                      <>
                        <h3 className={styles.addCont}>
                          <strong>Billing:</strong> {val.billingAddress.street},{" "}
                          {val.billingAddress.city}, {val.billingAddress.state},{" "}
                          {val.billingAddress.country}{" "}
                          {val.billingAddress.zipCode}
                        </h3>

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
                      </>
                    )}
                    {val.deliveryStatus !== "Transaction Complete" && (
                      <button
                        className={styles.bankBtn}
                        style={{
                          backgroundColor: !val.saleOrderNumber
                            ? "rgb(178, 178, 178)"
                            : "#9eb4c5",
                        }}
                        onClick={() => {
                          if (!val.saleOrderNumber) {
                            return;
                          }
                          setShowUpdateAddress(true);
                          setSelectSingleOrderId(val._id);
                        }}
                      >
                        Update
                      </button>
                    )}
                  </div>

                  <h3
                    className={`${styles.tBody} ${styles.medC}`}
                    style={{ textAlign: "center" }}
                  >
                    {val.deliveryStatus}
                  </h3>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {showLoader && (
        <div className={styles.loaderContainer}>
          <img
            src="/images/customLoading.gif"
            className={styles.loader}
            alt=""
          />
        </div>
      )}
      {showUpdateAddress && (
        <AddressForm
          handleAddressModal={handleAddressModal}
          hideAddressModals={hideAddressModals}
          orderIds={[selectSingleOrderId]}
        />
      )}
      {showUpdateAddressMultiple && (
        <AddressForm
          handleAddressModal={handleAddressModal}
          hideAddressModals={hideAddressModals}
          orderIds={selectedOrders}
        />
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
