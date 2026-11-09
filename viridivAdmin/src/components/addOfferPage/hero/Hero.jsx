import React, { useContext, useState, useEffect, useRef } from "react";
import styles from "./Hero.module.css";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { AppContext } from "../../../context/AppContext";
import { IoMdClose } from "react-icons/io";
import { v4 as uuidv4 } from "uuid";
import { MdDeleteForever } from "react-icons/md";
import { MdDownload } from "react-icons/md";
import { FaAngleDown } from "react-icons/fa";
import AddFilter from "../addFilter/AddFilter";

const Hero = () => {
  const { addOfferList, getBuyers, allBuyers, getSellers, allSellers } =
    useContext(AppContext);
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [rowsBackup, setRowsBackUp] = useState([]);
  const [filteredGradeValues, setFilteredGradeValues] = useState([]);
  const [showGradeFilter, setShowGradeFilter] = useState(false);

  const [showBuyers, setShowBuyers] = useState(false);
  const [showSellers, setShowSellers] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBuyer, setSelectedBuyer] = useState([]);
  const [selectedSeller, setSelectedSeller] = useState("");

  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const [selectedOfferListStatus, setSelectedOfferListStatus] =
    useState("Hidden");

  const [singleInvoiceBuyerId, setSingleInvoiceBuyerId] = useState("");

  const [filteredBuyers, setFilteredBuyers] = useState([]);

  const [filteredSellers, setFilteredSellers] = useState([]);
  const wrapperRef = useRef(null);
  const [isOfferadding, setIsOfferAdding] = useState(false);

  const handleShowFilter = () => {
    setShowGradeFilter((prev) => !prev);
  };

  const handleOfferliststatusChange = (event) => {
    setSelectedOfferListStatus(event.target.value);
  };

  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      const arrayBuffer = e.target.result;
      const workbook = XLSX.read(arrayBuffer, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(sheet);

      const capitalize = (str) =>
        typeof str === "string" && str.length > 0 ? str.toUpperCase() : str;

      // ✅ Keep previous rows and add new ones with buyers: []
      const newGrades = [];
      const updatedData = data.map((row) => {
        newGrades.push(row.grade);
        return {
          ...row,
          id: uuidv4(),
          mark: capitalize(row.mark),
          grade: capitalize(row.grade),
          sellerName: "",
          buyers: [],
        };
      });

      setRows([...rows, ...updatedData]);
      setRowsBackUp([...rows, ...updatedData]);
      setSelectAll(false);
    };

    reader.readAsArrayBuffer(file);
  };

  const handleExcelFormatFileDownload = () => {
    // Define headers
    const headers = [
      [
        "offerListNumber",
        "invoiceNumber",
        "mark",
        "grade",
        "bags",
        "quantity",
        "price",
      ],
    ];

    // Create a worksheet from the headers
    const worksheet = XLSX.utils.aoa_to_sheet(headers);

    // Create a new workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "OfferListFormat");

    // Write the workbook and trigger download
    XLSX.writeFile(workbook, "OfferlistFormat.xlsx");
  };

  useEffect(() => {
    getBuyers();
    getSellers();
  }, []);

  useEffect(() => {
    if (allBuyers.length > 0) {
      setFilteredBuyers(allBuyers);
    }

    if (allSellers.length > 0) {
      setFilteredSellers(allSellers);
    }
    // const filteredSellers = allSellers.filter((seller) =>
    //   seller.companyName.toLowerCase().includes(searchTerm.toLowerCase())
    // );
  }, [allBuyers, allSellers]);

  const handBuyerSearch = (value) => {
    setSearchTerm(value);
    if (!value) {
      setFilteredBuyers(allBuyers);
    } else {
      setFilteredBuyers(
        allBuyers.filter(
          (buyer) =>
            !selectedBuyer.some((selected) => selected._id === buyer._id) && // exclude already selected
            buyer.companyName.toLowerCase().includes(value.toLowerCase()) // search filter
        )
      );
    }
  };
  const handSellerSearch = (value) => {
    console.log("handSellerSearch");

    setSearchTerm(value);
    console.log(selectedSeller);
    if (!value) {
      setFilteredSellers(
        allSellers.filter((val) => val._id !== selectedSeller._id)
      );
    } else {
      setFilteredSellers(
        allSellers.filter(
          (seller) =>
            selectedSeller._id !== seller._id &&
            seller.companyName.toLowerCase().includes(value.toLowerCase())
        )
      );
    }
  };

  const addToSelectedBuyer = (buyer) => {
    setSelectedBuyer((prevSelected) => {
      // Check if the buyer is already in the selected list
      if (prevSelected.some((b) => b._id === buyer._id)) {
        return prevSelected; // If already added, return the same array (no duplicates)
      }

      setFilteredBuyers((prevFiltered) =>
        prevFiltered.filter((b) => b._id !== buyer._id)
      );

      return [...prevSelected, buyer]; // Add the new buyer
    });
  };

  const removeSelectedBuyer = (buyer) => {
    setSelectedBuyer((prevSelected) =>
      prevSelected.filter((b) => b._id !== buyer._id)
    );
  };

  const addInvoiceRow = () => {
    // ✅ Add an empty row when "Add Invoice" is clicked
    const newData = [
      ...rows,
      {
        id: uuidv4(),
        offerListNumber: "",
        invoiceNumber: "",
        mark: "",
        grade: "",
        quantity: "",
        bags: "",
        price: "",
        sellerName: "",
        buyers: [],
      },
    ];
    setRows(newData);
    setRowsBackUp(newData);
    setSelectAll(false);
  };

  const handleInputChange = (index, field, value) => {
    // ✅ Update the specific row and field when typing
    const updatedRows = [...rows];
    updatedRows[index][field] = value;
    setRows(updatedRows);
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedInvoices([]);
    } else {
      setSelectedInvoices(rows.map((row) => row.id));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectInvoice = (id) => {
    setSelectedInvoices((prevSelected) => {
      if (prevSelected.includes(id)) {
        setSelectAll(false);
        return prevSelected.filter((selectedId) => selectedId !== id);
      } else {
        if ([...prevSelected, id].length === rows.length && rows.length !== 0) {
          setSelectAll(true);
        }
        return [...prevSelected, id];
      }
    });
  };

  const handleSingleBuyersAdd = (id) => {
    const singleUpdateInvoice = rows.find((row) => row.id === id);
    setSelectedBuyer(singleUpdateInvoice ? singleUpdateInvoice.buyers : []);
    setSingleInvoiceBuyerId(id);
    setShowBuyers(true);
  };

  const deleteInvoice = (id) => {
    setRows((prevRows) => {
      const updatedRows = prevRows.filter((row) => row.id !== id);

      setSelectedInvoices((prevSelected) => {
        const updatedSelected = prevSelected.filter(
          (selectedId) => selectedId !== id
        );

        // Check if all remaining rows are selected
        setSelectAll(
          updatedRows.length > 0 &&
            updatedSelected.length === updatedRows.length
        );

        return updatedSelected;
      });

      return updatedRows;
    });
  };

  const handleCloseBuyerBox = () => {
    setSelectedBuyer([]);
    setSingleInvoiceBuyerId(null);
    setShowBuyers(false);
    setSearchTerm("");
  };

  const handleAssignBuyers = () => {
    setRows((prevRows) =>
      prevRows.map((row) => {
        if (singleInvoiceBuyerId) {
          // Update only the single invoice
          return row.id === singleInvoiceBuyerId
            ? { ...row, buyers: [...selectedBuyer] }
            : row;
        } else if (selectedInvoices.includes(row.id)) {
          // Update all selected invoices
          return { ...row, buyers: [...selectedBuyer] };
        }
        return row;
      })
    );

    toast.success("Buyers assigned successfully");
    handleCloseBuyerBox();
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

  useEffect(() => {
    if (allSellers) {
      const filtered = allSellers.filter((seller) => {
        const isSelected = selectedSeller && selectedSeller._id === seller._id;
        const matchesSearch = seller.companyName
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        return !isSelected && matchesSearch;
      });
      setFilteredSellers(filtered);
    }
  }, [allSellers, selectedSeller, searchTerm, showSellers]);

  const addToSelectedSeller = (seller) => {
    setSelectedSeller(seller);
    setFilteredSellers((prev) => prev.filter((val) => val._id !== seller._id));
  };

  const handleAssignSeller = () => {
    if (!selectedSeller) return; // If no seller is selected, do nothing
    console.log(selectedSeller);
    setRows((prevRows) =>
      prevRows.map((row) => ({
        ...row,
        sellerName: selectedSeller, // Assign the new seller
      }))
    );
    setShowSellers(false);
  };

  const handleAddOfferList = async () => {
    setIsOfferAdding(true);
    // Validate all fields except buyers
    for (let row of rows) {
      if (
        !row.offerListNumber ||
        !row.invoiceNumber ||
        !row.mark ||
        !row.grade ||
        !row.quantity ||
        !row.bags ||
        !row.price ||
        !row.sellerName
      ) {
        alert("⚠️ Please fill all fields before submitting.");
        setIsOfferAdding(false);
        return;
      }
    }

    // Check for duplicate combinations of invoiceNumber, mark, and grade
    const seenCombos = new Set();
    let hasDuplicates = false;
    for (let row of rows) {
      const combo = `${row.invoiceNumber}-${row.mark}-${row.grade}`.toUpperCase();
      if (seenCombos.has(combo)) {
        hasDuplicates = true;
        break;
      }
      seenCombos.add(combo);
    }

    if (hasDuplicates) {
      alert(
        "⚠️ Duplicate Invoice combinations found (Same Invoice, Mark, and Grade). Please ensure each entry is unique."
      );
      setIsOfferAdding(false);
      return;
    }
    const capitalizeCell = (str) =>
      typeof str === "string" && str.length > 0 ? str.toUpperCase() : str;

    // Update buyers if empty
    const validatedRows = rows.map((row) => ({
      ...row,
      offerListNumber: capitalizeCell(row.offerListNumber),
      invoiceNumber: capitalizeCell(row.invoiceNumber),
      mark: capitalizeCell(row.mark),
      grade: capitalizeCell(row.grade),
      buyers: row.buyers.length > 0 ? row.buyers : [], // Set "All" if buyers array is empty
    }));

    // Send data to backend
    const result = await addOfferList(validatedRows, selectedOfferListStatus);

    console.log(result);
    if (result.success) {
      setRows([]);
      setShowBuyers(false);
      setShowSellers(false);
      setSearchTerm("");
      setSelectedBuyer([]);
      setSelectedSeller("");
      setSelectedInvoices([]);
      setSelectAll(false);
      setSelectedOfferListStatus("Hidden");
      setSingleInvoiceBuyerId("");
      setFilteredBuyers([]);

      setFilteredSellers([]);
    }
    setIsOfferAdding(false);
  };
  useEffect(() => {
    function handleClickOutside(event) {
      const ignoredIds = ["filterMarkId", "filterGradeId", "filterStatusId"]; // Add valid IDs here

      if (ignoredIds.includes(event.target.id)) {
        return;
      }

      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        console.log("inside no wrapper");
        setShowGradeFilter(false); // Reset filter if clicked outside
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [filteredGradeValues]);

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        {selectedInvoices.length > 0 && (
          <div
            className={styles.uploadBtn}
            onClick={() => {
              console.log("Clicked");
              setShowBuyers(true);
            }}
          >
            Add Buyers
          </div>
        )}
      </div>

      <div className={styles.right}>
        <div className={styles.rightTop}>
          <div className={styles.rightHeaderContainer}>
            <h2 className={styles.rightHeader}>Add an Offer List</h2>

            <button
              className={styles.dwnFile}
              onClick={handleExcelFormatFileDownload}
            >
              <span className={styles.dwnIcon}>
                <MdDownload />
              </span>
              Offer List File{" "}
            </button>
          </div>

          <div className={styles.tableContainer}>
            {rows.length > 0 && (
              <div className={styles.headerContainer}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={selectAll}
                  onChange={handleSelectAll}
                />
                <h2 className={styles.theader}>Offer List No:</h2>
                <h2 className={styles.theader}>Invoice</h2>
                <h2 className={styles.theader}>Mark</h2>
                <h2
                  className={styles.theader}
                  id="filterMarkId"
                  onClick={handleShowFilter}
                  style={{ cursor: "pointer" }}
                >
                  Grade{" "}
                  <span style={{ pointerEvents: "none" }}>
                    <FaAngleDown />
                  </span>
                  {showGradeFilter && (
                    <div className={styles.ofWrapper} ref={wrapperRef}>
                      <AddFilter
                        rows={rows}
                        setFilteredGradeValues={setFilteredGradeValues}
                        handleShowFilter={handleShowFilter}
                      />
                    </div>
                  )}
                </h2>
                <h2 className={styles.theader}>Bags</h2>
                <h2 className={styles.theader}>Quantity</h2>
                <h2 className={styles.theader}>Price</h2>
                <h2 className={styles.theader}>Seller</h2>
                <h2 className={styles.theader}>Buyers</h2>
                <div className={styles.delBtn}></div>
              </div>
            )}
            {rows.map((row, i) => (
              <div className={styles.rowsContainer} key={i}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={selectedInvoices.includes(row.id)}
                  onChange={() => handleSelectInvoice(row.id)}
                />
                <input
                  type="text"
                  className={styles.row}
                  name="offerListNumber"
                  value={row["offerListNumber"] || ""}
                  onChange={(e) =>
                    handleInputChange(i, e.target.name, e.target.value)
                  }
                />
                <input
                  type="text"
                  className={styles.row}
                  name="invoiceNumber"
                  value={row["invoiceNumber"] || ""}
                  onChange={(e) =>
                    handleInputChange(i, e.target.name, e.target.value)
                  }
                />
                <input
                  type="text"
                  className={styles.row}
                  name="mark"
                  value={row["mark"] || ""}
                  onChange={(e) =>
                    handleInputChange(i, e.target.name, e.target.value)
                  }
                />
                <input
                  type="text"
                  className={styles.row}
                  name="grade"
                  value={row["grade"] || ""}
                  onChange={(e) =>
                    handleInputChange(i, e.target.name, e.target.value)
                  }
                />
                <input
                  type="text"
                  className={styles.row}
                  name="bags"
                  value={row["bags"] || ""}
                  onChange={(e) =>
                    handleInputChange(i, e.target.name, e.target.value)
                  }
                />
                <input
                  type="text"
                  className={styles.row}
                  name="quantity"
                  value={row["quantity"] || ""}
                  onChange={(e) =>
                    handleInputChange(i, e.target.name, e.target.value)
                  }
                />

                <input
                  type="text"
                  className={styles.row}
                  name="price"
                  value={row["price"] || ""}
                  onChange={(e) =>
                    handleInputChange(i, e.target.name, e.target.value)
                  }
                />
                <div className={`${styles.row} ${styles.brow}`}>
                  <span
                    className={styles.browText}
                    onClick={() => setShowSellers(true)}
                  >
                    +
                  </span>
                  <input
                    type="text"
                    name="seller"
                    className={styles.browInput}
                    readOnly
                    value={row.sellerName.companyName}
                  />
                </div>

                <div className={`${styles.row} ${styles.brow}`}>
                  <span
                    className={styles.browText}
                    onClick={() => handleSingleBuyersAdd(row.id)}
                  >
                    +
                  </span>
                  <input
                    type="text"
                    name="buyers"
                    className={styles.browInput}
                    readOnly
                    value={
                      row.buyers.length > 0
                        ? row.buyers.map((b) => b.companyName).join(", ")
                        : ""
                    }
                  />
                </div>
                <img
                  src="/images/trash.svg"
                  onClick={() => deleteInvoice(row.id)}
                  alt=""
                  className={styles.delBtn}
                />
              </div>
            ))}
            {rows.length > 0 && (
              <div className={styles.selectContainer}>
                <select
                  className={styles.selEl}
                  value={selectedOfferListStatus}
                  onChange={handleOfferliststatusChange}
                >
                  <option value="Hidden">Hidden</option>
                  <option value="Upcoming">Upcoming</option>
                  <option value="Live">Live</option>
                </select>
              </div>
            )}
          </div>
        </div>
        <div className={styles.uploadWrapper}>
          <input
            type="file"
            id="fileInput"
            hidden
            accept=".xlsx, .xls"
            onChange={handleFileUpload}
          />
          <label htmlFor="fileInput" className={styles.uploadBtn}>
            Upload Excel Sheet
          </label>

          <div className={styles.uploadBtn} onClick={addInvoiceRow}>
            Add Invoice
          </div>
        </div>

        {rows.length > 0 && (
          <div className={styles.uploadWrapper}>
            <div className={styles.uploadBtn} onClick={handleAddOfferList}>
              Submit
            </div>
          </div>
        )}

        {showBuyers && (
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
                    onChange={(e) => setSearchTerm(e.target.value)}
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

              <div className={styles.updateBtn} onClick={handleAssignBuyers}>
              Update Selection
            </div>
            </div>
          </div>
        )}

        {/* ----Seller Dialogue box starts here--- */}
        {showSellers && (
          <div className={styles.sBuyerContainer}>
            <div className={styles.sBuyerWrapper}>
              <div
                className={styles.closeIcon}
                onClick={() => {
                  setSelectedSeller("");
                  setShowSellers(false);
                  setSearchTerm("");
                }}
              >
                <IoMdClose />
              </div>

              <h3 className={styles.rightSubheader} style={{ fontSize: "1.2vw", marginBottom: "0.5vw" }}>
                Selected Seller
              </h3>
              <div className={styles.filBuyers}>
                {selectedSeller ? (
                  <p className={styles.scName} onClick={() => setSelectedSeller("")}>
                    - {selectedSeller.companyName}
                  </p>
                ) : (
                  <p style={{ fontSize: "0.8vw", color: "grey" }}>None selected</p>
                )}
              </div>

              <div className={styles.leftWrapper}>
                <div className={styles.searchLeft}>
                  <img
                    src="/images/search.svg"
                    alt=""
                    className={styles.searchIcon}
                  />
                  <input
                    type="text"
                    placeholder="Search available sellers"
                    className={styles.searchInput}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <h3 className={styles.rightSubheader} style={{ fontSize: "1.2vw", marginBottom: "0.5vw" }}>
                Available Sellers
              </h3>
              <div className={styles.filBuyers}>
                {filteredSellers.length > 0 ? (
                  filteredSellers.map((seller, i) => (
                    <p
                      key={i}
                      className={styles.scName}
                      onClick={() => addToSelectedSeller(seller)}
                    >
                      + {seller.companyName}
                    </p>
                  ))
                ) : (
                  <p style={{ fontSize: "0.8vw", color: "grey" }}>No Seller found</p>
                )}
              </div>
              <div className={styles.uploadBtn} onClick={handleAssignSeller}>
                Assign Seller
              </div>
            </div>
          </div>
        )}
      </div>
      {isOfferadding && (
        <div className={styles.loadingWrapper}>
          <img
            src="/images/newLoader.gif"
            alt=""
            className={styles.loadingImage}
          />
        </div>
      )}
    </div>
  );
};

export default Hero;
