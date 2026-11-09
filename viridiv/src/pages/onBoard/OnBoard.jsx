import React, { useContext, useEffect, useState } from "react";
import styles from "./OnBoard.module.css";
import { AppContext } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";
import { IoIosLogOut } from "react-icons/io";

const OnBoard = () => {
  const [formData, setFormData] = useState({
    companyName: "",
    name: "",
    phoneNumber: "",
    gst: "",
    fssai: "",
  });

  const [onboardLoading, setOnboardLoading] = useState(false);

  const [uploadedFiles, setUploadedFiles] = useState([]);
  const { isLoading, user, onboarding, handleLogout } = useContext(AppContext);
  const [redirecting, setRedirecting] = useState(false);
  const navigate = useNavigate();
  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const pdfFiles = files.filter((file) => file.type === "application/pdf");

    setUploadedFiles((prevFiles) => [...prevFiles, ...pdfFiles]); // Store File objects, not names
  };

  const handleRemoveFile = (fileName) => {
    setUploadedFiles((prevFiles) =>
      prevFiles.filter((file) => file.name !== fileName)
    );
  };

  useEffect(() => {
    console.log("running");
    console.log(isLoading, user);

    if (!isLoading) {
      console.log("first Loop");

      if (!user) {
        setRedirecting(true);
        console.log("second Loop");
        console.log("Redirecting due to no user");

        navigate("/");
      }

      if (user && user.isVerified && user.hasCompletedOnboarding) {
        navigate(`/${user.userType}-dashboard`);
      }
    }
  }, [isLoading, user]);

  if (isLoading || !user || redirecting) {
    console.log("....loading");
    return <div>....Loading</div>;
  }

  const handlePhonenumberchange = (e) => {
    const value = e.target.value;

    // If any non-numeric character is typed, don't update state
    if (/[^0-9]/.test(value)) return;

    setFormData({ ...formData, [e.target.name]: value });
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (onboardLoading) {
      return;
    }
    setOnboardLoading(true);

    console.log(formData);

    const submissionData = new FormData();
    submissionData.append("companyName", formData.companyName);
    submissionData.append("name", formData.name);
    submissionData.append("phoneNumber", formData.phoneNumber);
    submissionData.append("gst", formData.gst ? formData.gst : "");

    submissionData.append("fssai", formData.fssai);

    if (uploadedFiles.length > 0) {
      uploadedFiles.forEach((file) => {
        submissionData.append("uploadedDocuments", file);
      });
    }

    const result = await onboarding(submissionData);
    if (result.success) {
      setOnboardLoading(false);
      navigate("/onboard/success");
    } else {
      window.alert(result.message || "Something Went Wrong, Please try again");
    }
    setOnboardLoading(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <h2 className={styles.header}>
          {user.userType.charAt(0).toUpperCase() + user.userType.slice(1)}{" "}
          Onboard
        </h2>

        <form
          action=""
          onSubmit={handleSubmit}
          className={styles.formContainer}
        >
          <div className={styles.inputWrapper}>
            <label htmlFor="" className={styles.inputLabel}>
              Company Name *
            </label>
            <input
              type="text"
              name="companyName"
              className={styles.inputField}
              placeholder="Enter Company Name"
              value={formData.companyName}
              onChange={handleChange}
            />
          </div>

          <div className={styles.inputWrapper}>
            <label htmlFor="" className={styles.inputLabel}>
              Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={styles.inputField}
              placeholder="Eg: Ajit Bose"
            />
          </div>

          {/* <div className={styles.inputWrapper}>
            <label htmlFor="" className={styles.inputLabel}>
              Email*
            </label>
            <input
              type="email"
              name="email"
              className={styles.inputField}
              value={formData.email}
              onChange={handleChange}
              placeholder="Eg: test@gmail.com"
            
            />
          </div> */}

          <div className={styles.inputWrapper}>
            <label htmlFor="" className={styles.inputLabel}>
              Phone Number *
            </label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handlePhonenumberchange}
              className={styles.inputField}
              placeholder="Eg: 9876543210"
            />
          </div>

          <div className={styles.inputWrapper}>
            <label htmlFor="" className={styles.inputLabel}>
              GST *
            </label>
            <input
              type="text"
              name="gst"
              value={formData.gst}
              onChange={handleChange}
              className={styles.inputField}
              placeholder="Enter GSTIN"
            />
          </div>

          {/* <div className={styles.inputWrapper}>
            <label htmlFor="" className={styles.inputLabel}>
              Upload GST
              <br /> Document
            </label>
            <label htmlFor="gstDoc" className={styles.addLabel}>
              <div className={styles.addWrapper}>
                {gstImage ? (
                  <img
                    src={gstImage}
                    className={styles.previewImage}
                    alt="GST Document"
                  />
                ) : (
                  <img
                    src="/images/signupAdd.svg"
                    className={styles.addImage}
                    alt=""
                  />
                )}
              </div>
            </label>
            <input
              type="file"
              
              onChange={(e) => handleImageUpload(e, setGstImage)}
              id="gstDoc"
              style={{ display: "none" }}
            />
          </div> */}

          <div className={styles.inputWrapper}>
            <label htmlFor="" className={styles.inputLabel}>
              FSSAI
            </label>
            <input
              type="text"
              name="fssai"
              value={formData.fssai}
              onChange={handleChange}
              className={styles.inputField}
              placeholder="Enter FSSAI"
            />
          </div>

          <div className={styles.inputWrapper}>
            <label htmlFor="" className={styles.inputLabel}>
              Upload Documents
              <br />
              (FSSAI, GST, TMCO, Trustea, etc.)
              <br />
              .pdf files only
            </label>
            <label htmlFor="documentUpload" className={styles.addLabel}>
              <div className={styles.addWrapper}>
                <img
                  src="/images/signupAdd.svg"
                  className={styles.addImage}
                  alt=""
                />
              </div>
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
              id="documentUpload"
              style={{ display: "none" }}
            />
          </div>

          <button
            type="submit"
            style={{ background: onboardLoading ? "grey" : "#002600" }}
            className={styles.btn}
          >
            Complete Registration
          </button>
        </form>
        {onboardLoading && (
          <div className={styles.loadingScreen}>
            <img
              src="/images/customLoading.gif"
              className={styles.loadingImage}
              alt=""
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default OnBoard;
