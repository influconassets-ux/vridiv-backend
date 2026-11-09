import React, { useContext, useState } from "react";
import styles from "./GenerateModal.module.css";
import { AppContext } from "../../context/AppContext";

const GenerateModal = ({ handleSaleOrderGeneration }) => {
  const [formInput, setFormInput] = useState({
    cashDiscount: "",
    daysCount: "",
  });

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    if (name === "cashDiscount") {
      // Allow only numbers with at most one decimal point
      if (!/^\d*\.?\d*$/.test(value)) return;
    } else {
      // Allow only whole numbers
      if (!/^\d*$/.test(value)) return;
    }

    setFormInput((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className={styles.container}>
      <form
        action=""
        className={styles.formWrapper}
        onSubmit={(e) =>
          handleSaleOrderGeneration(
            e,
            formInput.cashDiscount,
            formInput.daysCount
          )
        }
      >
        <div className={styles.inputWrapper}>
          <label htmlFor="" className={styles.inputLable}>
            C.D. %
          </label>
          <input
            type="text"
            name="cashDiscount"
            className={styles.inputField}
            id=""
            value={formInput.cashDiscount}
            onChange={handleOnChange}
            required
          />
        </div>
        <div className={styles.inputWrapper}>
          <label htmlFor="" className={styles.inputLable}>
            No. of days
          </label>
          <input
            type="text"
            name="daysCount"
            id=""
            value={formInput.daysCount}
            className={styles.inputField}
            onChange={handleOnChange}
            required
          />
        </div>
        <button type="submit" className={styles.btn}>
          Generate Sale Order
        </button>
      </form>
    </div>
  );
};

export default GenerateModal;
