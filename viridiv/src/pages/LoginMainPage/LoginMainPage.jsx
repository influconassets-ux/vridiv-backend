import React from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import LoginMain from "../../components/loginMain/LoginMain";
const LoginMainPage = () => {
  return (
    <div className="Loginmainpage">
      <GoogleOAuthProvider clientId="489268107936-sl9nukou3r1aonn9dmif2p8pc4rripjp.apps.googleusercontent.com">
        <LoginMain />
      </GoogleOAuthProvider>
    </div>
  );
};

export default LoginMainPage;
