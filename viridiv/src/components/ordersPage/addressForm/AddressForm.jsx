import React, { useContext, useState } from "react";
import styles from "./AddressForm.module.css";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { AppContext } from "../../../context/AppContext";
const AddressForm = ({ handleAddressModal, orderIds, hideAddressModals }) => {
  const [isSameChecked, setIsSameChecked] = useState(false);
  const [useForAllLots, setUseForAllLots] = useState(false);
  const { updateOrderAddress } = useContext(AppContext);

  const handleAddressUpdate = async (e) => {
    e.preventDefault();

    // Collect Shipping Address

    const billingAddress = {
      street: e.target.billingStreet.value.trim(),
      city: e.target.billingCity.value.trim(),
      state: e.target.billingState.value.trim(),
      pincode: e.target.billingPincode.value.trim(),
      country: e.target.billingCountry.value.trim(),
    };

    let shippingAddress = null;

    if (!isSameChecked) {
      shippingAddress = {
        street: e.target.shippingStreet.value.trim(),
        city: e.target.shippingCity.value.trim(),
        state: e.target.shippingState.value.trim(),
        pincode: e.target.shippingPincode.value.trim(),
        country: e.target.shippingCountry.value.trim(),
      };
    }

    const transporter = e.target.transporter.value.trim();

    // Send to context function
    await updateOrderAddress(
      orderIds,
      shippingAddress,
      billingAddress,
      isSameChecked,
      transporter,
      useForAllLots
    );

    hideAddressModals();
  };

  return (
    <div className={styles.addFormWrapper}>
      <form onSubmit={handleAddressUpdate} className={styles.addForm}>
        <div className={styles.closeContainer}>
          <div style={{ cursor: "pointer", height: "fit-content" }}>
            <IoIosCloseCircleOutline onClick={hideAddressModals} />
          </div>
        </div>
        <div className={styles.itemWrapper}>
          <h2 className={styles.addHeader}>Billing Address:</h2>
          <>
            <div className={styles.addItem}>
              <label>Street/ House No.:</label>
              <textarea
                name="billingStreet"
                className={styles.mainAddress}
                required
              />
            </div>
            <div className={styles.addItem}>
              <label>City:</label>
              <input name="billingCity" className={styles.bankInput} required />
            </div>
            <div className={styles.addItem}>
              <label>State:</label>
              <input
                name="billingState"
                className={styles.bankInput}
                required
              />
            </div>
            <div className={styles.addItem}>
              <label>Pincode:</label>
              <input
                name="billingPincode"
                className={styles.bankInput}
                required
              />
            </div>
            <div className={styles.addItem}>
              <label>Country:</label>
              <input
                name="billingCountry"
                className={styles.bankInput}
                defaultValue="India"
                required
              />
            </div>
          </>
        </div>

        <div className={styles.sameAddLabelWrapper}>
          <input
            type="checkbox"
            id="sameAdd"
            onChange={(e) => setIsSameChecked(e.target.checked)}
          />
          <label htmlFor="sameAdd" className={styles.sameAddLabel}>
            Shipping address same as billing address
          </label>
        </div>

        <div
          className={styles.itemWrapper}
          style={{
            opacity: isSameChecked ? 0.5 : 1,
            pointerEvents: isSameChecked ? "none" : "auto",
          }}
        >
          <h2 className={styles.addHeader}>Shipping Address:</h2>

          <div className={styles.addItem}>
            <label>Street/ House No.:</label>
            <textarea
              name="shippingStreet"
              className={styles.mainAddress}
              required={!isSameChecked}
            />
          </div>
          <div className={styles.addItem}>
            <label>City:</label>
            <input
              name="shippingCity"
              className={styles.bankInput}
              required={!isSameChecked}
            />
          </div>
          <div className={styles.addItem}>
            <label>State:</label>
            <input
              name="shippingState"
              className={styles.bankInput}
              required={!isSameChecked}
            />
          </div>
          <div className={styles.addItem}>
            <label>Pincode:</label>
            <input
              name="shippingPincode"
              className={styles.bankInput}
              required={!isSameChecked}
            />
          </div>
          <div className={styles.addItem}>
            <label>Country:</label>
            <input
              name="shippingCountry"
              className={styles.bankInput}
              defaultValue="India"
              required={!isSameChecked}
            />
          </div>
        </div>

        <div className={styles.itemWrapper}>
          <div className={styles.addItem}>
            <label className={styles.addHeader}>Transporter:</label>
            <input name="transporter" className={styles.bankInput} required />
          </div>
        </div>

        <div className={styles.sameAddLabelWrapper}>
          <input
            type="checkbox"
            id="useThisInfo"
            onChange={(e) => setUseForAllLots(e.target.checked)}
          />
          <label htmlFor="useThisInfo" className={styles.sameAddLabel}>
            Use this information for all the lots in this Sale Order
          </label>
        </div>

        <button className={styles.bankBtn} type="submit">
          Update
        </button>
      </form>
    </div>
  );
};

export default AddressForm;
