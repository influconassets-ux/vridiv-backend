import React, { useContext, useEffect, useRef, useState } from "react";
import styles from "./RaisePrice.module.css";
import { AppContext } from "../../context/AppContext";

const RaisePrice = ({
  handleHideRaisePrice,
  selectedInvoices,
  setSelectedInvoices,
}) => {
  const { raisePriceCongText, addBid, removeraisePriceCongText } =
    useContext(AppContext);

  const [currentHighestPrice, setCurrentHighestPrice] = useState(
    selectedInvoices.length > 0
      ? Math.max(...selectedInvoices.map((invoice) => invoice.price))
      : 0
  );

  const containerRef = useRef(null); // Reference to the main container

  useEffect(() => {
    setCurrentHighestPrice(
      selectedInvoices.length > 0
        ? Math.max(...selectedInvoices.map((invoice) => invoice.price))
        : 0
    );
  }, [selectedInvoices]);

  useEffect(() => {
    // Function to detect click outside
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        // console.log("Container detected");
        handleHideRaisePrice(); // Call the function when clicked outside
      }
    };

    // Add event listener when component mounts
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup event listener when component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleHideRaisePrice]);

  const handleIncreament = () => {
    console.log("inc clicked");
    setCurrentHighestPrice((prev) => prev + 1);
  };
  const handleDecrement = () => {
    if (currentHighestPrice > 1) {
      setCurrentHighestPrice((prev) => prev - 1);
    }
  };

  const handleRaisePrice = () => {
    addBid(selectedInvoices, currentHighestPrice);
    setSelectedInvoices([]);

    setTimeout(() => {
      handleHideRaisePrice();
    }, 4000);
  };
  return (
    <div className={styles.container} ref={containerRef}>
      {!raisePriceCongText && (
        <div className={styles.raiseWrapper}>
          <h2 className={styles.header}>Your offer</h2>
          <div className={styles.mid}>
            <div className={styles.decInc} onClick={handleDecrement}>
              -1
            </div>
            <div className={styles.price}>
              ₹
              <input
                type="text"
                value={currentHighestPrice}
                className={styles.priceInput}
                onChange={(e) => {
                  setCurrentHighestPrice(Number(e.target.value));
                }}
              />
              /kg
            </div>
            <div className={styles.decInc} onClick={handleIncreament}>
              +1
            </div>
          </div>
          <div className={styles.raiseBtn} onClick={handleRaisePrice}>
            Change Price
          </div>
        </div>
      )}

      {raisePriceCongText && (
        <div className={styles.raiseWrapper}>
          <h2 className={styles.congHeader}>Congratulations!</h2>
          <h3 className={styles.midContent}>Your offer has been sent</h3>
          <img src="/images/tick.svg" className={styles.tickImage} alt="" />
        </div>
      )}
      <img
        src="/images/raisePrice/left.svg"
        className={styles.leftLayout}
        alt=""
      />
      <img
        src="/images/raisePrice/right.svg"
        className={styles.rightLayout}
        alt=""
      />
    </div>
  );
};

export default RaisePrice;
