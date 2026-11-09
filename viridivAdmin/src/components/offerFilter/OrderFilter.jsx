import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import styles from "./OfferFilter.module.css";

const OrderFilter = ({
  filterHeader,
  handleFilterOrders,
  handleFilterClear,
  filteredOrders,
}) => {
  const { userOrders } = useContext(AppContext);

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
    handleFilterOrders(filterHeader, selectedHeaderValues);
  };

  useEffect(() => {
    if (filteredOrders && filteredOrders.length > 0 && filterHeader) {
      const filteredValues = Array.from(
        new Set(
          filteredOrders
            .map((order) => order[filterHeader])
            .filter((value) => value !== null && value !== undefined)
        )
      );

      // Use `filteredValues` as needed here
      setUniqueFilterValues(filteredValues);
    }
  }, [userOrders]);
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

export default OrderFilter;
