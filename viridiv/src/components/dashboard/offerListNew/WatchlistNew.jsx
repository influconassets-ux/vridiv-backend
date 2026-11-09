import React, { useContext, useEffect, useRef, useState } from "react";
import styles from "./WatchlistNew.module.css";

import { RxHamburgerMenu } from "react-icons/rx";
import OfferSideBar from "../offerSideBar/OfferSideBar";
import { AppContext } from "../../../context/AppContext";
import RaisePrice from "../../raisePrice/RaisePrice";
import SimilarOfferLists from "../../similarOfferLists/SimilarOfferLists";
import { useLocation, useNavigate } from "react-router-dom";
import OfferFilter from "../offerFilter/OfferFilter";
import PageLoader from "../../pageLoader/PageLoader";

const WatchlistNew = () => {
  const {
    fetchOfferLists,
    isLoadingData,
    allOfferLists,
    sidebarSelectedOfferList,
    changeSideBarOfferList,
    removeFromWatchlist,
    addBid,
    handlePriceChange,
    getWatchlist,
    watchlist,
    user,
    acceptBid,
  } = useContext(AppContext);
  const [showSidebar, setShowSidebar] = useState(false);
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [showRaisePrice, setShowRaisePrice] = useState(false);

  const [filteredInvoiceList, setFilteredInvoiceList] = useState([]);
  const [currentFilter, setCurrentFilter] = useState("");
  const [localPrices, setLocalPrices] = useState({});
  const [isOfferlistChanging, setIsOfferlistChanging] = useState(false);
  const wrapperRef = useRef(null);

  const location = useLocation();
  const navigate = useNavigate();
  const handleCheckAll = (e) => {
    const checked = e.target.checked;
    setIsAllChecked(checked);

    if (checked) {
      // Select all invoices
      const validInvoices = filteredInvoiceList.map((invoice) => ({
        _id: invoice._id,
        price: invoice.currentPrice,
      }));

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

  const handleDeleteSingleWatchlist = (invoiceId) => {
    const confirmation = window.confirm(
      "Are you sure you want to remove this invoice?"
    );
    if (confirmation) {
      removeFromWatchlist(invoiceId);
    }
  };

  const handleDeleteMultipleWatchlist = () => {
    const confirmation = window.confirm(
      "Are you sure you want to remove this invoice?"
    );

    const invoiceIds = selectedInvoices.map((invoice) => invoice._id);
    if (confirmation) {
      removeFromWatchlist(invoiceIds);
    }
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

  const handleFilterInvoice = (headerType, headerValue) => {
    if (!Array.isArray(headerValue) || headerValue.length === 0) {
      return; // Return full list if headerValue is not a valid array
    }

    const updatedList = watchlist.filter((invoice) =>
      headerValue.includes(invoice[headerType])
    );

    setFilteredInvoiceList(updatedList);
    setCurrentFilter("");
    setSelectedInvoices([]);
    setIsAllChecked(false);
  };

  const handleFilterClear = () => {
    if (filteredInvoiceList.length !== watchlist.length) {
      setFilteredInvoiceList(watchlist);
      setSelectedInvoices([]);
      setIsAllChecked(false);
    }
    setCurrentFilter("");
  };

  const handleFilterlistPriceChange = (invoiceId, newPrice) => {
    const numericPrice = Number(newPrice);
    setLocalPrices((prev) => ({
      ...prev,
      [invoiceId]: numericPrice,
    }));

    setFilteredInvoiceList((prevList) =>
      prevList.map((invoice) =>
        invoice._id === invoiceId
          ? { ...invoice, currentPrice: isNaN(numericPrice) ? 0 : numericPrice }
          : invoice
      )
    );
  };

  const handleFilterlistIncDec = (invoiceId, change) => {
    setFilteredInvoiceList((prevList) =>
      prevList.map((invoice) => {
        if (invoice._id === invoiceId) {
          const current = Number(invoice.currentPrice);
          const updatedPrice = isNaN(current) ? change : current + change;

          return { ...invoice, currentPrice: updatedPrice };
        }
        return invoice;
      })
    );

    // Also update local input state
    setLocalPrices((prev) => ({
      ...prev,
      [invoiceId]: (prev[invoiceId] || 0) + change,
    }));
  };

  const handleAcceptPrice = () => {
    if (selectedInvoices.length < 1) {
      return;
    }
    acceptBid(selectedInvoices);
    setSelectedInvoices([]);
    setIsAllChecked(false);
  };

  useEffect(() => {
    fetchOfferLists();
    getWatchlist();
  }, []);

  useEffect(() => {
    if (watchlist) {
      setFilteredInvoiceList(watchlist);
    }
  }, [watchlist]);

  useEffect(() => {
    function handleClickOutside(event) {
      // Delay execution to allow new component to mount first

      // Add text values to ignore
      const ignoredIds = [
        "filterMarkId",
        "filterGradeId",
        "filterofferListNumberId",
      ]; // Add valid IDs here

      // Check if clicked element has an ID in the ignored list
      if (ignoredIds.includes(event.target.id)) {
        return; // Do nothing if the clicked element has an ignored ID
      }

      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        console.log("inside no wrapper");
        setCurrentFilter(""); // Reset filter if clicked outside
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [currentFilter]);

  useEffect(() => {
    const prices = {};
    if (filteredInvoiceList) {
      filteredInvoiceList.forEach((invoice) => {
        prices[invoice._id] = invoice.currentPrice;
      });
      setLocalPrices(prices);
    }
  }, [filteredInvoiceList]);

  if (user && user.userType === "seller") {
    navigate("/seller-dashboard");
  }
  if (isLoadingData) {
    return <PageLoader />;
  }
  if (
    !isLoadingData &&
    watchlist.length < 1
  ) {
    return (
      <div className={`${styles.lotsTxt} ${styles.noHeader}`}>
        No Watchlist Added
      </div>
    );
  }

  if (watchlist.length > 0) {
    return (
      <div className={styles.container}>
        {allOfferLists.length === 0 ? (
          <div>No Watchlist Lists to show</div>
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
                <h2 className={styles.lotsTxt}>
                  {location.pathname !== "/buyer-dashboard/watchlist"
                    ? "LOTS"
                    : "Watchlist"}
                </h2>
                <h2
                  className={styles.putPrice}
                  style={{
                    background:
                      selectedInvoices.length > 0 ? "#718de1" : "#979797",
                  }}
                  onClick={handleShowRaisePrice}
                >
                  Put Your Price
                </h2>
                <h2
                  className={styles.putPrice}
                  style={{
                    background:
                      selectedInvoices.length > 0 ? "#6bc981" : "#979797",
                  }}
                  onClick={handleAcceptPrice}
                >
                  Accept Price
                </h2>
                <h2
                  className={styles.putPrice}
                  style={{
                    background:
                      selectedInvoices.length > 0 ? "#BD3039" : "#979797",
                  }}
                  onClick={handleDeleteMultipleWatchlist}
                >
                  Remove from Watchlist
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
                <h3
                  className={styles.medRow}
                  id="filterofferListNumberId"
                  onClick={(e) => handleFilterHeader(e, "offerListNumber")}
                >
                  Offer List{" "}
                  <img
                    src="/images/filterArrow.png"
                    className={styles.filImage}
                    alt=""
                    style={{ pointerEvents: "none" }}
                  />
                  {currentFilter === "offerListNumber" && (
                    <div className={styles.ofWrapper} ref={wrapperRef}>
                      <OfferFilter
                        filterHeader={"offerListNumber"}
                        handleFilterInvoice={handleFilterInvoice}
                        handleFilterClear={handleFilterClear}
                        invoiceListtype={"watchlist"}
                      />
                    </div>
                  )}
                </h3>
                <h3 className={styles.medRow}>Invoice </h3>
                <h3
                  className={styles.medRow}
                  id="filterMarkId"
                  onClick={(e) => handleFilterHeader(e, "mark")}
                >
                  Mark{" "}
                  <img
                    src="/images/filterArrow.png"
                    className={styles.filImage}
                    alt=""
                    style={{ pointerEvents: "none" }}
                  />
                  {currentFilter === "mark" && (
                    <div className={styles.ofWrapper} ref={wrapperRef}>
                      <OfferFilter
                        filterHeader={"mark"}
                        handleFilterInvoice={handleFilterInvoice}
                        handleFilterClear={handleFilterClear}
                        invoiceListtype={"watchlist"}
                      />
                    </div>
                  )}
                </h3>
                <h3
                  className={styles.medRow}
                  id="filterGradeId"
                  onClick={(e) => {
                    handleFilterHeader(e, "grade");
                  }}
                >
                  Grade{" "}
                  <img
                    src="/images/filterArrow.png"
                    className={styles.filImage}
                    alt=""
                    style={{ pointerEvents: "none" }}
                  />
                  {currentFilter === "grade" && (
                    <div className={styles.ofWrapper} ref={wrapperRef}>
                      <OfferFilter
                        filterHeader={"grade"}
                        handleFilterInvoice={handleFilterInvoice}
                        handleFilterClear={handleFilterClear}
                        invoiceListtype={"watchlist"}
                      />
                    </div>
                  )}
                </h3>
                <h3 className={styles.smallRow}>Bags</h3>
                <h3 className={styles.medRow}>Quantity</h3>
                <h3 className={styles.smallRow}>Price</h3>
                <h3 className={styles.medRow}>Your Price</h3>
                <h3 className={styles.bigRow}>Status</h3>
                <h3 className={styles.medRow}></h3>
              </div>

              {filteredInvoiceList.map((val, i) => {
                return (
                  <div
                    className={styles.contentRow}
                    key={i}
                    style={{
                      background:
                        val.adminBidTime &&
                        val.biddingHistory.length > 0 &&
                        new Date(val.adminBidTime).getTime() >
                          new Date(
                            val.biddingHistory[
                              val.biddingHistory.length - 1
                            ].bidTime
                          ).getTime()
                          ? "#feedda"
                          : "none",
                    }}
                  >
                    <input
                      type="checkbox"
                      name=""
                      id=""
                      className={styles.checkInput}
                      checked={selectedInvoices.some(
                        (item) => item._id === val._id
                      )}
                      onChange={(e) => handleCheckInvoice(e, val)}
                    />
                    <h3 className={styles.medRow}>
                      #{val.offerListNumber.offerListNumber}
                      <img
                        src="/images/trash.svg"
                        className={styles.awBid}
                        alt=""
                        onClick={() => handleDeleteSingleWatchlist([val._id])}
                      />
                    </h3>
                    <h3 className={styles.medRow}>{val.invoiceNumber}</h3>
                    <h3 className={styles.medRow}>{val.mark}</h3>
                    <h3 className={styles.medRow}>{val.grade}</h3>
                    <h3 className={styles.smallRow}>{val.bags}</h3>
                    <h3 className={styles.medRow}>{val.quantity}</h3>
                    <h3 className={styles.smallRow}>
                      ₹{val.adminBid}{" "}
                      <span
                        className={styles.pricetick}
                        style={{
                          background: "#6bc981",
                        }}
                        onClick={async () => {
                          acceptBid([val._id]);
                        }}
                      >
                        &#x2713;
                      </span>
                    </h3>
                    <div className={styles.medRow}>
                      <span
                        className={styles.incdecbtn}
                        onClick={() => handleFilterlistIncDec(val._id, -1)}
                      >
                        -
                      </span>{" "}
                      <input
                        type="text"
                        value={localPrices[val._id] || ""}
                        className={styles.cPriceInput}
                        onChange={(e) =>
                          handleFilterlistPriceChange(val._id, e.target.value)
                        }
                      />
                      <span
                        className={styles.incdecbtn}
                        onClick={() => handleFilterlistIncDec(val._id, +1)}
                      >
                        +
                      </span>
                    </div>

                    <h4 className={styles.statusBtn}>{val.status}</h4>
                    <h3 className={styles.medRow}>
                      <span
                        className={styles.changeBtn}
                        onClick={() => {
                          if (!localPrices[val._id]) {
                            window.alert("Please add a price");
                            return;
                          }
                          addBid([val._id], localPrices[val._id]);
                        }}
                      >
                        Submit
                      </span>
                    </h3>
                  </div>
                );
              })}
            </div>
            {/* 
            <div className={styles.similarWrapper}>
              <SimilarOfferLists />
            </div> */}
          </div>
        )}

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
        {isOfferlistChanging && (
          <div className={styles.loaderContainer}>
            <img
              src="/images/customLoading.gif"
              className={styles.loader}
              alt=""
            />
          </div>
        )}
      </div>
    );
  }
};

export default WatchlistNew;
