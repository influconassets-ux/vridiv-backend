import React from "react";
import styles from "./AccCard.module.css";
import { MdDeleteOutline } from "react-icons/md";

const AccCard = ({ account, handleAccountDeletion }) => {
  const { _id, name, email } = account;
  return (
    <div className={styles.container}>
      <h1 className={styles.content}>
        Name: <strong>{name ? name : "Viridiv"}</strong>
      </h1>
      <h1 className={styles.content}>
        Email: <strong>{email}</strong>
      </h1>

      <div className={styles.del}>
        <div
          className={styles.delInner}
          onClick={() => handleAccountDeletion(_id)}
        >
          <MdDeleteOutline />
        </div>
      </div>
    </div>
  );
};

export default AccCard;
