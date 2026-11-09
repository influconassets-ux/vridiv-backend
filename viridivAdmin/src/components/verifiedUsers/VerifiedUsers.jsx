import React, { useContext, useEffect, useState } from "react";
import styles from "./VerifiedUsers.module.css";
import { AppContext } from "../../context/AppContext";
import { FaFileUpload } from "react-icons/fa";
import UploadDocsForm from "./uploadDocsForm/UploadDocsForm";

const VerifiedUsers = () => {
  const {
    fetchVerifiedUsers,
    verifiedUsers,
    isFetching,
    updateUserGstOrFssai,
    uploadUserDocuments,
  } = useContext(AppContext);

  const [isUploadingDocs, setIsUploadingDocs] = useState(false);

  const handleUpdateGstOrFssai = async (e, userId) => {
    e.preventDefault();

    setIsUploadingDocs(true);
    const form = e.target;
    const gst = form.gst?.value || "";
    const fssai = form.fssai?.value || "";
    await updateUserGstOrFssai(userId, gst, fssai);
    setIsUploadingDocs(false);
  };

  useEffect(() => {
    fetchVerifiedUsers();
  }, []);

  if (!verifiedUsers || isFetching) {
    return <div>....loading</div>;
  }

  if (!isFetching && verifiedUsers.length === 0) {
    return (
      <div className={styles.container}>
        <h2 className={styles.header}>No Pending Users</h2>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.tableContainer}>
        <h2 className={styles.header}>Verified Users</h2>

        <div className={styles.headerRow}>
          <h3 className={styles.tHeader}>Name</h3>
          <h3 className={styles.tHeader}>Email</h3>
          <h3 className={styles.tHeader}>Phone</h3>
          <h3 className={styles.tHeader}>User Type</h3>
          <h3 className={styles.tHeader}>Company</h3>
          <h3 className={styles.tHeader}>GST</h3>
          <h3 className={styles.tHeader}>FSSAI</h3>
          <h3 className={styles.tHeader}>Documents</h3>
          <h3 className={styles.tHeader}>Upload</h3>
        </div>

        {verifiedUsers.map((val) => {
          return (
            <div className={styles.rowContainer} key={val._id}>
              <h3 className={styles.tContent}>{val.name}</h3>
              <h3 className={styles.tContent}>{val.email}</h3>
              <h3 className={styles.tContent}>{val.phoneNumber}</h3>
              <h3 className={styles.tContent}>{val.userType}</h3>
              <h3 className={styles.tContent}>{val.companyName}</h3>
              <form
                onSubmit={(e) => handleUpdateGstOrFssai(e, val._id)}
                className={`${styles.tContent} ${styles.formGstWrapper}`}
              >
                <input
                  type="text"
                  defaultValue={val.gst}
                  className={styles.formInput}
                  name="gst"
                  required
                />
                <button type="submit" className={styles.btn}>
                  Submit
                </button>
              </form>
              <form
                onSubmit={(e) => handleUpdateGstOrFssai(e, val._id)}
                className={`${styles.tContent} ${styles.formGstWrapper}`}
              >
                <input
                  type="text"
                  defaultValue={val.fssai}
                  className={styles.formInput}
                  name="fssai"
                  required
                />
                <button type="submit" className={styles.btn}>
                  Submit
                </button>
              </form>
              <a
                href={val.folderLink}
                target="_blank"
                className={styles.tContent}
              >
                {!val.folderLink ? "NA" : "Link"}
              </a>
              <h3 className={`${styles.tContent} ${styles.resRejContainer}`}>
                <UploadDocsForm
                  userId={val._id}
                  setIsUploadingDocs={setIsUploadingDocs}
                />
              </h3>
            </div>
          );
        })}
      </div>
      {isUploadingDocs && (
        <div className={styles.loaderContainer}>
          <img src="/images/newLoader.gif" className={styles.loader} alt="" />
        </div>
      )}
    </div>
  );
};

export default VerifiedUsers;
