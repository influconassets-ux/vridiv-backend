import React, { useContext, useEffect, useState } from "react";
import styles from "./DownloadData.module.css";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";

const DownloadData = () => {
  const { allBuyers, getBuyers, downloadUtil } = useContext(AppContext);
  const [formLoading, setFormLoading] = useState(false);
  const [selectedDateOption, setSelectedDateOption] = useState("tillDate");
  const [selectedBuyers, seSelectedBuyers] = useState([]);

  const handleRadioChange = (e) => {
    const { value } = e.target;
    console.log(value);

    setSelectedDateOption(value);
  };
  const handleAddRemoveBuyer = (e) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      if (e.target.value === "allBuyers") {
        seSelectedBuyers(allBuyers.map((val) => val._id));
      } else {
        seSelectedBuyers((prev) => [...prev, e.target.value]);
      }
    } else {
      if (e.target.value === "allBuyers") {
        seSelectedBuyers([]);
      } else {
        seSelectedBuyers((prev) =>
          prev.filter((val) => val !== e.target.value)
        );
      }
    }
  };

  const handleBuyerWiseFormSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    const formData = new FormData(e.target);
    const dataType = formData.get("dataType");
    let startDate = formData.get("startDate");
    let endDate = formData.get("endDate");

    const today = new Date();
    const todayStr = today.toISOString().split("T")[0]; // format as yyyy-mm-dd

    if (selectedDateOption === "30days") {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(today.getDate() - 30);
      const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().split("T")[0];

      startDate = thirtyDaysAgoStr;
      endDate = todayStr;
      // formData.set("startDate", thirtyDaysAgoStr);
      // formData.set("endDate", todayStr);
    }

    if (selectedDateOption === "today") {
      startDate = todayStr;
      endDate = todayStr;
      // formData.set("startDate", todayStr);
      // formData.set("endDate", todayStr);
    }

    if (selectedDateOption === "tillDate") {
      startDate = "";
      endDate = todayStr;
      // formData.set("startDate", "");
      // formData.set("endDate", todayStr);
    }

    if (selectedDateOption === "custom") {
      if (!startDate || !endDate) {
        toast.error("Please enter start and end date");
        return;
      }
    }

    const dataToSend = { startDate, endDate, buyerIds: selectedBuyers };
    await downloadUtil(dataToSend, dataType);
    setFormLoading(false);
  };
  useEffect(() => {
    getBuyers();
  }, []);
  return (
    <div className={styles.container}>
      <form
        onSubmit={handleBuyerWiseFormSubmit}
        className={styles.formContainer}
      >
        <div className={styles.formWrapper}>
          <div className={styles.formLeft}>
            <div className={styles.radioContainer}>
              <div className={styles.radioWrapper}>
                <input
                  type="radio"
                  id="tillDateRadio"
                  value="tillDate"
                  name="choosenData"
                  onChange={handleRadioChange}
                  defaultChecked
                />
                <label htmlFor="tillDateRadio">Till Date</label>
              </div>
              <div className={styles.radioWrapper}>
                <input
                  type="radio"
                  id="todayRadio"
                  value="today"
                  name="choosenData"
                  onChange={handleRadioChange}
                />
                <label htmlFor="todayRadio">Today</label>
              </div>
              <div className={styles.radioWrapper}>
                <input
                  type="radio"
                  id="daysRadio"
                  value="30days"
                  name="choosenData"
                  onChange={handleRadioChange}
                />
                <label htmlFor="daysRadio">Last 30 days</label>
              </div>
              <div className={styles.radioWrapper}>
                <input
                  type="radio"
                  id="customRadio"
                  value="custom"
                  name="choosenData"
                  onChange={handleRadioChange}
                />
                <label htmlFor="customRadio">Custom</label>
              </div>
            </div>

            <div className={styles.dateContainer}>
              <div
                className={
                  selectedDateOption === "custom"
                    ? `${styles.dateWrapper} ${styles.active}`
                    : `${styles.dateWrapper} ${styles.inactive}`
                }
              >
                <label htmlFor="" className={styles.dateLabel}>
                  Start Date:{" "}
                </label>
                <input
                  type="date"
                  name="startDate"
                  max={new Date().toISOString().split("T")[0]}
                />
              </div>

              <div
                className={
                  selectedDateOption === "custom"
                    ? `${styles.dateWrapper} ${styles.active}`
                    : `${styles.dateWrapper} ${styles.inactive}`
                }
              >
                <label htmlFor="" className={styles.dateLabel}>
                  End Date:{" "}
                </label>
                <input
                  type="date"
                  name="endDate"
                  max={new Date().toISOString().split("T")[0]}
                />
              </div>
            </div>
          </div>

          <div className={styles.formRight}>
            <div className={styles.selectWrapper}>
              <select name="dataType" id="" className={styles.selectOpt}>
                <option value="buyerWiseInvoice">Buyer wise invoices</option>
              </select>
            </div>

            <div className={styles.buyersWrapper}>
              <div className={styles.buyerInput}>
                <input
                  type="checkbox"
                  id="allBuyers"
                  value="allBuyers"
                  checked={
                    allBuyers.length > 0 &&
                    allBuyers.every((buyer) =>
                      selectedBuyers.includes(buyer._id)
                    )
                  }
                  onChange={handleAddRemoveBuyer}
                />
                <label htmlFor="allBuyers">All Buyers</label>
              </div>
              {allBuyers.length > 0 && (
                <>
                  {allBuyers.map((val) => (
                    <div className={styles.buyerInput} key={val._id}>
                      <input
                        type="checkbox"
                        id={val._id}
                        value={val._id}
                        checked={selectedBuyers.some(
                          (selectedBuyer) => selectedBuyer === val._id
                        )}
                        onChange={handleAddRemoveBuyer}
                      />
                      <label htmlFor={val._id}>{val.companyName} </label>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>

        <button className={styles.btn} type="submit">
          Download
        </button>
      </form>
    </div>
  );
};

export default DownloadData;
