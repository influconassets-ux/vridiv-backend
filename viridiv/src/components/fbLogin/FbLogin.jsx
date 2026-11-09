import React from "react";
import styles from "./FbLogin.module.css";
import FacebookLogin from "@greatsumini/react-facebook-login";

const FbLogin = () => {
  return (
    <FacebookLogin
      appId="1181810163318736"
      onSuccess={(res) => {
        console.log("Login Success:", res);
      }}
      onFail={(err) => {
        console.error("Login Failed:", err);
      }}
      render={({ onClick }) => (
        <button
          onClick={onClick}
          style={{
            backgroundColor: "#4267B2",
            color: "#fff",
            padding: "10px 20px",
            border: "none",
            borderRadius: "5px",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          Login with Facebook Custom
        </button>
      )}
    />
  );
};

export default FbLogin;
