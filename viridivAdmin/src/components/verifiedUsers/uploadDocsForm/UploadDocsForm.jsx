import React, { useContext, useState } from "react";
import styles from "../VerifiedUsers.module.css";
import { AppContext } from "../../../context/AppContext";
import { FaFileUpload } from "react-icons/fa";

const UploadDocsForm = ({ userId, setIsUploadingDocs }) => {
  const { uploadUserDocuments } = useContext(AppContext);

  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const pdfFiles = files.filter((file) => file.type === "application/pdf");

    setUploadedFiles((prevFiles) => [...prevFiles, ...pdfFiles]);
  };
  const handleRemoveFile = (fileName) => {
    setUploadedFiles((prevFiles) =>
      prevFiles.filter((file) => file.name !== fileName)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submissionData = new FormData();
    if (uploadedFiles.length === 0) {
      window.alert("No Documents uploaded");
      return;
    }
    setIsUploadingDocs(true);
    submissionData.append("userId", userId);
    uploadedFiles.forEach((file) => {
      submissionData.append("uploadedDocuments", file);
    });

    await uploadUserDocuments(submissionData);
    setUploadedFiles([]);
    setIsUploadingDocs(false);
  };
  return (
    <form action="" onSubmit={handleSubmit}>
      <label htmlFor={`documentUpload${userId}`} style={{ cursor: "pointer" }}>
        <FaFileUpload />
      </label>

      <div className={styles.imageContainer}>
        {uploadedFiles.map((fileName, index) => (
          <p key={index} className={styles.inputLabel}>
            📄 {fileName.name}{" "}
            <button
              className={styles.remTxt}
              onClick={() => handleRemoveFile(fileName.name)}
              type="button"
            >
              remove
            </button>
          </p>
        ))}
      </div>
      <input
        type="file"
        accept="application/pdf" // Restrict to PDFs
        multiple // Allow multiple files
        onChange={handleFileUpload}
        id={`documentUpload${userId}`}
        style={{ display: "none" }}
      />
      <button
        type="submit"
        // style={{ background: onboardLoading ? "grey" : "#002600" }}
        className={styles.btn}
      >
        Submit
      </button>
    </form>
  );
};

export default UploadDocsForm;
