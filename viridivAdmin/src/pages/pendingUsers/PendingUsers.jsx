import React, { useContext, useEffect, useState } from "react";
import styles from "./PendingUsers.module.css";
import { AppContext } from "../../context/AppContext";
import { IoMdClose } from "react-icons/io";

const PendingUsers = () => {
  const { pendingUsers, isFetching, fetchPendingUser, verifyUser, rejectUser } =
    useContext(AppContext);

  const [rejectUserId, setRejectUserId] = useState(null);
  const [showMessageBox, setShowMessageBox] = useState(false);
  const [rejectionMessage, setRejectionMessage] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    fetchPendingUser();
  }, []);

  const handleRejection = async (userId) => {
    setShowMessageBox(true);
    setRejectUserId(userId);
  };

  const handleRejSubmit = async (e) => {
    e.preventDefault();
    await rejectUser(rejectUserId, rejectionMessage);
    setShowMessageBox(false);
  };

  if (!pendingUsers || isFetching) {
    return <div>....loading</div>;
  }

  if (!isFetching && pendingUsers.length === 0) {
    return (
      <div className={styles.container}>
        <h2 className={styles.header}>No Pending Users</h2>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.header}>Pending Verifications</h2>

      <div className={styles.tableContainer}>
        <div className={styles.headerRow}>
          <h3 className={styles.tHeader}>
            Name
            {/* <img
              src="/images/darkFilterArrow.jpg"
              className={styles.filterArwImage}
              alt=""
            /> */}
          </h3>
          <h3 className={styles.tHeader}>Email</h3>
          <h3 className={styles.tHeader}>Phone</h3>
          <h3 className={styles.tHeader}>User Type</h3>
          <h3 className={styles.tHeader}>Company</h3>
          <h3 className={styles.tHeader}>GST</h3>
          <h3 className={styles.tHeader}>FSSAI</h3>
          <h3 className={styles.tHeader}>Documents</h3>
          <h3 className={styles.tContent}></h3>
        </div>

        {pendingUsers.map((val, i) => {
          return (
            <div className={styles.rowContainer} key={i}>
              <h3 className={styles.tContent}>{val.name}</h3>
              <h3 className={styles.tContent}>{val.email}</h3>
              <h3 className={styles.tContent}>{val.phoneNumber}</h3>
              <h3 className={styles.tContent}>{val.userType}</h3>
              <h3 className={styles.tContent}>{val.companyName}</h3>
              <h3 className={styles.tContent}>{val.gst}</h3>
              <h3 className={styles.tContent}>{val.fssai}</h3>
              <a
                href={val.folderLink}
                target="_blank"
                className={styles.tContent}
              >
                {!val.folderLink ? "NA" : "Link"}
              </a>
              <h3 className={`${styles.tContent} ${styles.resRejContainer}`}>
                <span
                  className={styles.conf}
                  onClick={async () => {
                    setIsVerifying(true);
                    await verifyUser(val._id);
                    setIsVerifying(false);
                  }}
                >
                  ✔
                </span>{" "}
                <span
                  className={styles.rej}
                  onClick={() => handleRejection(val._id)}
                >
                  X
                </span>
              </h3>
            </div>
          );
        })}

        {showMessageBox && (
          <form
            action=""
            onSubmit={handleRejSubmit}
            className={styles.messageForm}
          >
            <div className={styles.formWrapper}>
              <div
                className={styles.closeIcon}
                onClick={() => setShowMessageBox(false)}
              >
                <IoMdClose />
              </div>
              <textarea
                name="rejectionReason"
                id=""
                placeholder="Reason for Rejection"
                className={styles.rejTxt}
                value={rejectionMessage}
                required
                onChange={(e) => setRejectionMessage(e.target.value)}
              ></textarea>
              <button type="submit" className={styles.rejBtn}>
                Reject
              </button>
            </div>
          </form>
        )}
      </div>
      {isVerifying && (
        <div className={styles.loaderContainer}>
          <img src="/images/newLoader.gif" className={styles.loader} alt="" />
        </div>
      )}
    </div>
  );
};

export default PendingUsers;
