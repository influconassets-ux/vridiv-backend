import React, { useContext, useEffect, useState } from "react";
import styles from "./OfferListAdmin.module.css";
import { AppContext } from "../../../context/AppContext";
import { IoMdClose } from "react-icons/io";
const UpdateMultipleBuyers = ({
  invoicesForBuyerUpdates,
  setShowMultipleBuyers,
}) => {
  const { updateBuyersForMultipleInvoices, allBuyers } = useContext(AppContext);
  const [selectedBuyer, setSelectedBuyer] = useState([]);
  const [filteredBuyers, setFilteredBuyers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

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

  const handleSearchFilter = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCloseBuyerBox = () => {
    setSelectedBuyer([]);
    setShowMultipleBuyers(false);
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
  }, [allBuyers, selectedBuyer, searchTerm]);

  return (
    <div className={styles.sBuyerWrapper}>
      <div className={styles.closeIcon} onClick={handleCloseBuyerBox}>
        <IoMdClose />
      </div>

      <h3 className={styles.popupHeader}>Assign Buyers (Bulk)</h3>

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
          if (selectedBuyer.length < 1) {
            return;
          }
          updateBuyersForMultipleInvoices(
            invoicesForBuyerUpdates,
            selectedBuyer
          );
          setShowMultipleBuyers(false);
        }}
      >
        Apply Selection
      </div>
    </div>
  );
};

export default UpdateMultipleBuyers;
