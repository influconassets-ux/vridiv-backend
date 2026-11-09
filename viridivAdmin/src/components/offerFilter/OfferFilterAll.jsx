import React, { useContext, useEffect, useState } from "react";
import styles from "./OfferFilter.module.css";
import { AppContext } from "../../context/AppContext";

const OfferFilterAll = ({
  filterHeader,
  handleFilterInvoice,
  handleFilterClear,
  invoiceListtype,
}) => {
  const { sidebarSelectedOfferList, allInvoices } = useContext(AppContext);
  const [uniqueFilterValues, setUniqueFilterValues] = useState([]);

  const [selectedHeaderValues, setSelectedHeaderValues] = useState([]);

  const handleCheckboxChange = (event) => {
    const { checked, value } = event.target;

    setSelectedHeaderValues((prev) =>
      checked ? [...prev, value] : prev.filter((val) => val !== value)
    );
  };

  const preFilterChecks = () => {
    if (selectedHeaderValues.length < 1) {
      return;
    }
    handleFilterInvoice(filterHeader, selectedHeaderValues);
  };
  useEffect(() => {
    if (invoiceListtype === "offer") {
      if (allInvoices.length > 0) {
        // Extract unique values from the specified filterHeader field
        let filteredValues;
        if (filterHeader === "buyer") {
          filteredValues = Array.from(
            new Set(
              allInvoices
                .map((offer) => offer.highestBidder?.companyName)
                .filter((val) => val) // removes undefined or null
            )
          );
          console.log(filteredValues);
        } else {
          filteredValues = Array.from(
            new Set(allInvoices.map((offer) => offer[filterHeader]))
          );
        }

        console.log("filteredValues:", filteredValues);
        setUniqueFilterValues(filteredValues);
      }
    } else {
      if (watchlist) {
        // Extract unique values from the specified filterHeader field
        const filteredValues = Array.from(
          new Set(watchlist.map((offer) => offer[filterHeader]))
        );

        console.log("filteredValues:", filteredValues);
        setUniqueFilterValues(filteredValues);
      }
    }
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.btnContainer}>
        <button
          className={styles.fBtn}
          style={{
            background: selectedHeaderValues.length > 0 ? "#023602" : "#979797",
          }}
          onClick={preFilterChecks}
        >
          Apply
        </button>
        <button className={styles.fBtn} onClick={handleFilterClear}>
          Clear
        </button>
      </div>
      <div className={styles.listContainer}>
        {uniqueFilterValues.map((value, index) => (
          <label key={index} className={styles.item}>
            <input
              type="checkbox"
              onChange={handleCheckboxChange}
              className={styles.filInput}
              value={value}
            />{" "}
            {value}
          </label>
        ))}
      </div>
    </div>
  );
};

export default OfferFilterAll;
