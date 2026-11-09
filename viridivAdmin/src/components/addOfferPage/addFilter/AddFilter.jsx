import React, { useContext, useEffect, useState } from "react";
import styles from "./AddFilter.module.css";

const AddFilter = ({ rows, setFilteredGradeValues, handleShowFilter }) => {
  const [uniqueValues, setUniqueValues] = useState([]);
  const [selectedFilters, setSelectedValues] = useState([]);

  const handleFilterChange = (e, newValue) => {
    const isChecked = e.target.checked;

    if (isChecked) {
      setSelectedValues((prev) => [...prev, newValue]);
    } else {
      setSelectedValues((prev) => prev.filter((val) => val !== newValue));
    }
  };
  const applyFilter = () => {
    if (selectedFilters.length === 0) return;
    setFilteredGradeValues(setSelectedValues);
    handleShowFilter();
  };

  const handleFilterClear = () => {
    setFilteredGradeValues([]);
    handleShowFilter();
  };

  useEffect(() => {
    setUniqueValues(Array.from(new Set(rows.map((row) => row.grade))));
  }, []);
  return (
    <div className={styles.container}>
      <div className={styles.btnContainer}>
        <button
          className={styles.fBtn}
          //   style={{
          //     background: selectedHeaderValues.length > 0 ? "#023602" : "#979797",
          //   }}
        >
          Apply
        </button>
        <button className={styles.fBtn}>Clear</button>
      </div>
      <div className={styles.listContainer}>
        {uniqueValues.map((value, index) => (
          <label key={index} className={styles.item}>
            <input
              type="checkbox"
              onChange={(e) => handleFilterChange(e, value)}
              className={styles.filInput}
            />{" "}
            {value}
          </label>
        ))}
      </div>
    </div>
  );
};

export default AddFilter;
