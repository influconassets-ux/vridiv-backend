import React, { useContext, useState } from "react";
import styles from "./AddAdmin.module.css";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";

const AddAdmin = () => {
  const { createAdminAccount } = useContext(AppContext);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!formData.name) {
        setError("Name is required");
        return;
      }
      if (!formData.email) {
        setError("Email is required");
        return;
      }
      if (!formData.password) {
        setError("Password is required");
        return;
      }
      const result = await createAdminAccount(formData);

      if (result.success) {
        setFormData({
          name: "",
          email: "",
          password: "",
        });
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(result.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.topContainer}>
          <h3 className={styles.topHeader}>Create Admin Account</h3>
        </div>

        <form
          action=""
          className={styles.formContainer}
          onSubmit={handleSubmit}
        >
          {error && <p className={styles.errText}>{error}</p>}
          <div className={styles.inputWrapper}>
            <label htmlFor="" className={styles.inputLabel}>
              Name
            </label>
            <input
              type="text"
              placeholder="Enter Name"
              className={styles.inputField}
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className={styles.inputWrapper}>
            <label htmlFor="" className={styles.inputLabel}>
              Email
            </label>
            <input
              type="email"
              placeholder="Eg : test@gmail.com"
              className={styles.inputField}
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className={styles.inputWrapper}>
            <label htmlFor="" className={styles.inputLabel}>
              Password
            </label>
            <input
              type="password"
              placeholder="Enter Password"
              className={styles.inputField}
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          {!loading && (
            <button className={styles.submitBtn} type="submit">
              Create Account
            </button>
          )}

          {loading && (
            <button className={styles.submitBtn} disabled>
              <span className={styles.loader}></span>
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default AddAdmin;
