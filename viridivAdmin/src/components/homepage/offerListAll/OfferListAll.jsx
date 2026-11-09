import React, { useContext, useEffect, useRef, useState } from "react";
import styles from "./OfferListAll.module.css";
import { RxHamburgerMenu } from "react-icons/rx";
import OfferSideBar from "../offerSideBar/OfferSideBar";
import RaisePrice from "../../raisePrice/RaisePrice";
import { AppContext } from "../../../context/AppContext";
import { IoMdClose } from "react-icons/io";
import OfferFilterAll from "../../offerFilter/OfferFilterAll";
import { MdDownloadForOffline } from "react-icons/md";
import { motion } from "motion/react";
import PageLoader from "../../pageLoader/PageLoader";

const OfferListAll = () => {
  const {
    fetchOfferLists,
    isLoadingData,
    allOfferLists,
    acceptBid,
    sidebarSelectedOfferList,
    deleteInvoice,
    handlePriceChange,
    updateOfferlistStatus,
    addBid,
    allBuyers,
    getBuyers,
    updateBuyers,
    downloadOfferList,
    fetchAllInvoices,
    allInvoices,
    downloadOfferListData,
  } = useContext(AppContext);

  const [isPageLoading, setIsPageLoading] = useState(true);

  const [showSidebar, setShowSidebar] = useState(false);
  const [showRaisePrice, setShowRaisePrice] = useState(false);
  const [selectedOfferListStatus, setSelectedOfferListStatus] =
    useState("Hidden");

  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const [isAllChecked, setIsAllChecked] = useState(false);

  const [showBuyers, setShowBuyers] = useState(false);
  const [selectedBuyer, setSelectedBuyer] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [clickedInvoiceBuyer, setClickedInvoiceBuyer] = useState(null);
  const [singleInvoiceBuyerId, setSingleInvoiceBuyerId] = useState(null);
  const [filteredBuyers, setFilteredBuyers] = useState([]);

  const [localPrices, setLocalPrices] = useState({});
  const [filteredInvoiceList, setFilteredInvoiceList] = useState("");
  const [currentFilter, setCurrentFilter] = useState("");

  const [isOfferListChanging, setIsOfferListChanging] = useState(false);

  const [isDeleteSelectedInvoices, setIsDeleteSelectedInvoices] =
    useState(false);

  const [selectedInvoicesToDel, setSelectedInvoicesToDel] = useState([]);

  const [isAllDeleteInvoiceChecked, setIsAllDeleteInvoiceChecked] =
    useState(false);

  const wrapperRef = useRef(null);

  const handleShowRaisePrice = () => {
    if (selectedInvoices.length < 1) {
      return;
    }
    setShowRaisePrice(true);
  };

  const handleCheckAll = (e) => {
    const checked = e.target.checked;
    setIsAllChecked(checked);

    if (checked) {
      // Select all invoices
      const validInvoices = filteredInvoiceList
        .filter((invoice) => ["Your Counter Price"].includes(invoice.status))
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

  const handleHideRaisePrice = () => {
    setShowRaisePrice(false);
  };

  const handleAcceptPrice = async () => {
    if (selectedInvoices < 1) {
      return;
    }
    await acceptBid(selectedInvoices);
    setSelectedInvoices([]);
  };
  const handleDeleteInvoice = async (invoiceIds) => {
    const confirmation = window.confirm("Are You sure you want to delete ?");
    if (confirmation) {
      await deleteInvoice(invoiceIds);

      setIsDeleteSelectedInvoices(false);

      setSelectedInvoicesToDel([]);

      setIsAllDeleteInvoiceChecked(false);
    }
    return;
  };

  const handleCloseBuyerBox = () => {
    setSelectedBuyer([]);
    setSingleInvoiceBuyerId(null);
    setShowBuyers(false);
    setSearchTerm("");
  };

  const removeSelectedBuyer = (buyer) => {
    setSelectedBuyer((prevSelected) =>
      prevSelected.filter((b) => b._id !== buyer._id)
    );
  };

  const addToSelectedBuyer = (buyer) => {
    setSelectedBuyer((prevSelected) => {
      if (prevSelected.some((b) => b._id === buyer._id)) {
        return prevSelected;
      }
      return [...prevSelected, buyer];
    });
  };

  const handleShowBuyersBox = (invoiceDetails) => {
    if (invoiceDetails.status === "Ordered") {
      return;
    }
    setClickedInvoiceBuyer(invoiceDetails);
    setSelectedBuyer(invoiceDetails.allowedBuyers);
    setShowBuyers(true);
  };

  const handleSearchFilter = (e) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    if (allBuyers) {
      const filtered = allBuyers.filter((buyer) => {
        const isSelected = selectedBuyer.some((s) => s._id === buyer._id);
        const matchesSearch = buyer.companyName
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        return !isSelected && matchesSearch;
      });
      setFilteredBuyers(filtered);
    }
  }, [allBuyers, selectedBuyer, searchTerm, showBuyers]);

  const handleFilterlistPriceChange = (invoiceId, newPrice) => {
    const numericPrice = !newPrice ? 0 : Number(newPrice);
    setLocalPrices((prev) => ({
      ...prev,
      [invoiceId]: numericPrice,
    }));

    setFilteredInvoiceList((prevList) =>
      prevList.map((invoice) =>
        invoice._id === invoiceId
          ? {
              ...invoice,
              adminBid: isNaN(numericPrice) ? 0 : numericPrice,
            }
          : invoice
      )
    );
  };

  const handleFilterlistIncDec = (invoiceId, change) => {
    // return;

    setFilteredInvoiceList((prevList) =>
      prevList.map((invoice) => {
        if (invoice._id === invoiceId) {
          const current = Number(invoice.adminBid);
          const updatedPrice = isNaN(current) ? change : current + change;

          return { ...invoice, adminBid: updatedPrice };
        }
        return invoice;
      })
    );

    // Also update local input state
    setLocalPrices((prev) => ({
      ...prev,
      [invoiceId]: (prev[invoiceId] || 0) + change,
    }));

    // handlePriceChange(invoiceId, change);
  };

  const handleFilterInvoice = (headerType, headerValue) => {
    console.log(headerType, headerValue);

    if (!Array.isArray(headerValue) || headerValue.length === 0) {
      return; // Return full list if headerValue is not a valid array
    }

    let updatedList;
    if (headerType === "buyer") {
      updatedList = allInvoices.filter((invoice) => {
        return (
          invoice.highestBidder &&
          headerValue.includes(invoice.highestBidder?.companyName)
        );
      });
    } else {
      updatedList = allInvoices.filter((invoice) =>
        headerValue.includes(invoice[headerType])
      );
    }

    setFilteredInvoiceList(updatedList);
    setCurrentFilter("");
  };

  const handleFilterClear = () => {
    setFilteredInvoiceList(allInvoices);
    setCurrentFilter("");
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

  //   useEffect(() => {
  //     fetchOfferLists();
  //   }, []);

  const handleCheckAllDeleteInvoices = (e) => {
    const checked = e.target.checked;
    setIsAllDeleteInvoiceChecked(checked);
    if (checked) {
      const allInvoices = filteredInvoiceList.map((val) => val._id);

      setSelectedInvoicesToDel(allInvoices);
    } else {
      setSelectedInvoicesToDel([]);
    }
  };

  const handleDeleteCheckInvoice = (e, invoice) => {
    const checked = e.target.checked;

    if (checked) {
      setSelectedInvoicesToDel((prev) => [...prev, invoice._id]);
    } else {
      setSelectedInvoicesToDel((prev) =>
        prev.filter((val) => val !== invoice._id)
      );
    }

    if (!checked) {
      setIsAllDeleteInvoiceChecked(false);
    }
  };
  useEffect(() => {
    setIsPageLoading(true);
    if (allInvoices.length > 0) {
      setFilteredInvoiceList(allInvoices);
    }
    setIsPageLoading(false);
  }, [allInvoices]);

  useEffect(() => {
    function handleClickOutside(event) {
      // Delay execution to allow new component to mount first

      // Add text values to ignore
      const ignoredIds = ["filterMarkId", "filterGradeId"]; // Add valid IDs here

      // Check if clicked element has an ID in the ignored list
      if (ignoredIds.includes(event.target.id)) {
        return; // Do nothing if the clicked element has an ignored ID
      }

      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        // console.log("inside no wrapper");
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
        prices[invoice._id] = invoice.adminBid;
      });
      setLocalPrices(prices);
    }
  }, [filteredInvoiceList]);

  if (isLoadingData) {
    return <PageLoader />;
  }
  if (
    (!isLoadingData && allOfferLists.length === 0) ||
    filteredInvoiceList.length < 1
  ) {
    return (
      <div className={`${styles.offHeader} ${styles.noHeader}`}>
        No Offer Lists added yet
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* <div className={styles.mainSidebar}>
        <OfferSideBar setShowSidebar={setShowSidebar} />
      </div> */}
      <div className={styles.wrapper}>
        <div className={styles.menuIcon} onClick={() => setShowSidebar(true)}>
          <RxHamburgerMenu />
        </div>
        <div className={styles.offerListContainer}>
          <div className={styles.offHeaderContainer}>
            <h2 className={styles.offHeader}>All Invoices</h2>
            <div className={styles.offHeaderBtnContainer}>
              <h3
                className={styles.offHeaderBtn}
                style={{
                  background: "rgb(249, 200, 109)",
                }}
                onClick={() => downloadOfferListData("")}
              >
                Download offerlist
              </h3>
              {!isDeleteSelectedInvoices && (
                <h3
                  className={styles.offHeaderBtn}
                  style={{
                    background:
                      selectedInvoices.length > 0 ? "#6bc981" : "#979797",
                  }}
                  onClick={handleAcceptPrice}
                >
                  Accept Price
                </h3>
              )}
              {!isDeleteSelectedInvoices && (
                <h3
                  className={styles.offHeaderBtn}
                  onClick={handleShowRaisePrice}
                  style={{
                    background:
                      selectedInvoices.length > 0 ? "#718de1" : "#979797",
                  }}
                >
                  Change Price
                </h3>
              )}
              {!isDeleteSelectedInvoices && (
                <h3 className={styles.offHeaderBtn}>Delete Offer List</h3>
              )}
            </div>

            <div className={styles.upStatusContainer}>
              <div
                className={styles.offHeaderBtn}
                style={{
                  background: isDeleteSelectedInvoices ? "#E49B0F" : "#EEDC82",
                }}
                onClick={() => {
                  setIsDeleteSelectedInvoices((prev) => !prev);
                  setSelectedInvoicesToDel([]);
                }}
              >
                Select Invoices to delete{" "}
                <span
                  style={{
                    color: "red",
                    opacity: isDeleteSelectedInvoices ? 1 : 0,
                  }}
                >
                  x
                </span>
              </div>
              {selectedInvoicesToDel.length > 0 && (
                <motion.div
                  className={styles.offHeaderBtn}
                  style={{
                    background: "#c30010",
                  }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ duration: 0.3, type: "spring" }}
                  onClick={() => handleDeleteInvoice(selectedInvoicesToDel)}
                >
                  Delete Selected Invoices
                </motion.div>
              )}
            </div>
          </div>
        </div>

        <div className={styles.tableContainer}>
          <div className={styles.headerRow}>
            {!isDeleteSelectedInvoices && (
              <input
                type="checkbox"
                name=""
                id=""
                className={styles.checkInput}
                checked={isAllChecked ? true : false}
                onChange={handleCheckAll}
              />
            )}
            {isDeleteSelectedInvoices && (
              <input
                type="checkbox"
                name=""
                id=""
                checked={isAllDeleteInvoiceChecked ? true : false}
                onChange={handleCheckAllDeleteInvoices}
                className={styles.checkInput}
              />
            )}
            <h3 className={styles.smallRow}>Date</h3>
            <h3 className={styles.medRow}>Offer List</h3>
            <h3
              className={`${styles.medRow} ${styles.filRow}`}
              onClick={(e) => handleFilterHeader(e, "mark")}
              id="filterMarkId"
              style={{ cursor: "pointer" }}
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
                  <OfferFilterAll
                    filterHeader={"mark"}
                    handleFilterInvoice={handleFilterInvoice}
                    handleFilterClear={handleFilterClear}
                    invoiceListtype={"offer"}
                  />
                </div>
              )}
            </h3>
            <h3 className={styles.medRow}>Invoice </h3>
            <h3
              className={`${styles.smallRow} ${styles.filRow}`}
              id="filterGradeId"
              onClick={(e) => {
                handleFilterHeader(e, "grade");
              }}
              style={{ cursor: "pointer" }}
            >
              Grade
              <img
                src="/images/filterArrow.png"
                className={styles.filImage}
                alt=""
                style={{ pointerEvents: "none" }}
              />
              {currentFilter === "grade" && (
                <div className={styles.ofWrapper} ref={wrapperRef}>
                  <OfferFilterAll
                    filterHeader={"grade"}
                    handleFilterInvoice={handleFilterInvoice}
                    handleFilterClear={handleFilterClear}
                    invoiceListtype={"offer"}
                  />
                </div>
              )}
            </h3>
            <h3 className={styles.smallRow}>Bags</h3>
            <h3 className={styles.smallRow}>Quantity</h3>
            <h3 className={styles.bigRow}>Offer Price</h3>
            <h3 className={styles.smallRow}>Buyer Price</h3>
            <h3
              className={styles.medRow}
              style={{ cursor: "pointer" }}
              onClick={(e) => {
                console.log("clicked");

                handleFilterHeader(e, "buyer");
              }}
            >
              Buyer
              <img
                src="/images/filterArrow.png"
                className={styles.filImage}
                alt=""
                style={{ pointerEvents: "none" }}
              />
              {currentFilter === "buyer" && (
                <div className={styles.ofWrapper} ref={wrapperRef}>
                  <OfferFilterAll
                    filterHeader={"buyer"}
                    handleFilterInvoice={handleFilterInvoice}
                    handleFilterClear={handleFilterClear}
                    invoiceListtype={"offer"}
                  />
                </div>
              )}
            </h3>
            <h3 className={styles.medRow}>Offered to</h3>
            <h3 className={styles.bigRow}>Status</h3>
          </div>

          {filteredInvoiceList.map((val, i) => {
            return (
              <div
                className={styles.contentRow}
                style={{
                  background:
                    !val.adminBidTime &&
                    val.biddingHistory.length > 0 &&
                    val.status !== "Ordered"
                      ? "#feedda"
                      : val.adminBidTime &&
                        val.biddingHistory.length > 0 &&
                        new Date(val.adminBidTime).getTime() <
                          new Date(
                            val.biddingHistory[
                              val.biddingHistory.length - 1
                            ].bidTime
                          ).getTime() &&
                        val.status !== "Ordered"
                      ? "#feedda"
                      : "none",
                }}
                key={i}
              >
                {!isDeleteSelectedInvoices && (
                  <input
                    type="checkbox"
                    name=""
                    id=""
                    className={styles.checkInput}
                    checked={selectedInvoices.some(
                      (item) => item._id === val._id
                    )}
                    disabled={val.status !== "Your Counter Price"}
                    onChange={(e) => handleCheckInvoice(e, val)}
                  />
                )}
                {isDeleteSelectedInvoices && (
                  <input
                    type="checkbox"
                    name=""
                    id=""
                    className={styles.checkInput}
                    checked={selectedInvoicesToDel.some(
                      (item) => item === val._id
                    )}
                    onChange={(e) => handleDeleteCheckInvoice(e, val)}
                  />
                )}
                <h3 className={styles.smallRow}>
                  {new Date(val.createdAt).toLocaleDateString("en-GB", {
                    timeZone: "Asia/Kolkata",
                  })}
                </h3>
                <h3 className={styles.medRow}>
                  {val.offerListNumber?.offerListNumber}{" "}
                  <img
                    src="/images/trash.svg"
                    className={styles.awBid}
                    alt=""
                    onClick={() => handleDeleteInvoice([val._id])}
                  />
                </h3>
                <h3 className={styles.medRow}>{val.mark}</h3>
                <h3 className={styles.medRow}>{val.invoiceNumber}</h3>
                <h3 className={styles.smallRow}>{val.grade}</h3>
                <h3 className={styles.smallRow}>{val.bags}</h3>
                <h3 className={styles.smallRow}>{val.quantity}</h3>
                <div className={`${styles.bigRow} ${styles.incDecPriceIn}`}>
                  <span
                    className={styles.incdecbtn}
                    onClick={() => {
                      if (val.status === "Your Price") {
                        return;
                      }
                      handleFilterlistIncDec(val._id, -1);
                    }}
                    style={{
                      background:
                        val.status === "Ordered" || val.status === "Your Price"
                          ? "#979797"
                          : "#3b868c",
                    }}
                  >
                    -
                  </span>{" "}
                  <input
                    type="text"
                    value={localPrices[val._id] || ""}
                    className={styles.cPriceInput}
                    disabled={
                      val.status === "Ordered" || val.status === "Your Price"
                    }
                    onChange={(e) =>
                      handleFilterlistPriceChange(val._id, e.target.value)
                    }
                  />
                  <span
                    className={styles.incdecbtn}
                    onClick={() => {
                      if (val.status === "Your Price") {
                        return;
                      }
                      handleFilterlistIncDec(val._id, +1);
                    }}
                    style={{
                      background:
                        val.status === "Ordered" || val.status === "Your Price"
                          ? "#979797"
                          : "#3b868c",
                    }}
                  >
                    +
                  </span>
                  <span
                    className={styles.pricetick}
                    onClick={() => addBid([val._id], localPrices[val._id])}
                    style={{
                      background:
                        val.status === "Ordered" || val.status === "Your Price"
                          ? "#979797"
                          : "#005B9F",
                    }}
                  >
                    &#x2713;
                  </span>
                </div>
                {val.highestBiddingPrice > 0 && (
                  <h3 className={styles.smallRow}>
                    ₹{val.highestBiddingPrice}{" "}
                    <span
                      className={styles.pricetick}
                      style={{
                        background:
                          val.status === "Your Counter Price"
                            ? "#28A745"
                            : "#979797",
                      }}
                      onClick={async () => {
                        if (val.status === "Your Counter Price") {
                          setIsOfferListChanging(true);
                          await acceptBid([val._id]);
                          setIsOfferListChanging(false);
                        }
                      }}
                    >
                      &#x2713;
                    </span>
                  </h3>
                )}
                {val.highestBiddingPrice === 0 && (
                  <h3 className={styles.smallRow} style={{ color: "#979797" }}>
                    No Offers
                  </h3>
                )}
                {val.highestBidder && (
                  <h3 className={styles.medRow}>
                    {val.highestBidder.companyName}
                  </h3>
                )}
                {!val.highestBidder && (
                  <h3 className={styles.medRow} style={{ color: "#979797" }}>
                    No Offers
                  </h3>
                )}
                <h3 className={`${styles.medRow} ${styles.buyersCell}`}>
                  <span
                    className={styles.incdecbtn}
                    onClick={() => handleShowBuyersBox(val)}
                    style={{
                      background:
                        val.status !== "Ordered"
                          ? "rgb(253, 253, 97)"
                          : "#979797",
                      color: "grey",
                    }}
                  >
                    +
                  </span>{" "}
                  <span className={styles.viewBtn}>
                    {val.allowedBuyers.length > 0
                      ? `${val.allowedBuyers.length} Buyers`
                      : "Public"}
                    <ul className={styles.bList}>
                      {val.allowedBuyers.length > 0 ? (
                        val.allowedBuyers.map((item, i) => (
                          <li key={i} className={styles.blistItem}>
                            {item.companyName}
                          </li>
                        ))
                      ) : (
                        <li className={styles.blistItem}>All Buyers</li>
                      )}
                    </ul>
                  </span>
                </h3>
                {val.status !== "Ordered" && (
                  <h4 className={styles.statusBtn}>
                    {val.status === "Your Price" ? "No offers Yet" : val.status}
                  </h4>
                )}

                {val.status === "Ordered" && (
                  <h4 className={styles.statusBtn}>
                    Sold Out{" "}
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

      {showBuyers && <div className={styles.bgBlack}></div>}      {showBuyers && (
        <div className={styles.sBuyerContainer}>
          <div className={styles.bgBlack} onClick={handleCloseBuyerBox}></div>
          <div className={styles.sBuyerWrapper}>
            <div className={styles.closeIcon} onClick={handleCloseBuyerBox}>
              <IoMdClose />
            </div>

            <h3 className={styles.popupHeader}>Assign Buyers</h3>

            <div className={styles.searchSection}>
              <div className={styles.searchWrapper}>
                <img src="/images/search.svg" alt="" className={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="Search buyers..."
                  className={styles.searchInput}
                  value={searchTerm}
                  onChange={handleSearchFilter}
                />
              </div>
            </div>

            <div className={styles.selectionSection}>
              <div className={styles.selectionHeader}>
                <h4>Selected Buyers ({selectedBuyer.length})</h4>
                {selectedBuyer.length > 0 && (
                  <span className={styles.clearAll} onClick={() => setSelectedBuyer([])}>
                    Clear All
                  </span>
                )}
              </div>
              <div className={`${styles.filBuyers} ${styles.selectedList}`}>
                {selectedBuyer.length > 0 ? (
                  selectedBuyer.map((buyer, i) => (
                    <div
                      key={i}
                      className={styles.buyerChip}
                      onClick={() => removeSelectedBuyer(buyer)}
                      title="Click to remove"
                    >
                      {buyer.companyName}
                      <IoMdClose className={styles.chipRemove} />
                    </div>
                  ))
                ) : (
                  <p className={styles.emptyText}>No buyers selected</p>
                )}
              </div>
            </div>

            <div className={styles.availableSection}>
              <div className={styles.selectionHeader}>
                <h4>Available Buyers</h4>
              </div>
              <div className={`${styles.filBuyers} ${styles.availableList}`}>
                {filteredBuyers.length > 0 ? (
                  filteredBuyers.map((buyer, i) => (
                    <div
                      key={i}
                      className={styles.availableBuyerItem}
                      onClick={() => addToSelectedBuyer(buyer)}
                    >
                      <span>{buyer.companyName}</span>
                      <span className={styles.addBtn}>+ Add</span>
                    </div>
                  ))
                ) : (
                  <p className={styles.emptyText}>No available buyers match your search</p>
                )}
              </div>
            </div>

            <div
              className={styles.updateBtn}
              onClick={async () => {
                if (!clickedInvoiceBuyer?._id) {
                  toast.warning("No invoice selected");
                  return;
                }
                updateBuyers(clickedInvoiceBuyer._id, selectedBuyer);
                setShowBuyers(false);
              }}
            >
              Update Selection
            </div>
          </div>
        </div>
      )}

      {isOfferListChanging && (
        <div className={styles.loaderContainer}>
          <img src="/images/newLoader.gif" className={styles.loader} alt="" />
        </div>
      )}
    </div>
  );
};

export default OfferListAll;
