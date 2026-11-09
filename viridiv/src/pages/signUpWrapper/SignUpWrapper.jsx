import React, { useContext } from "react";
import SignUpForm from "../signUpForm/SignUpForm";
import { GoogleOAuthProvider } from "@react-oauth/google";

const SignUpWrapper = () => {
  return (
    <div className={"SignUpWrapperContainer"}>
      <GoogleOAuthProvider clientId="489268107936-sl9nukou3r1aonn9dmif2p8pc4rripjp.apps.googleusercontent.com">
        <SignUpForm />
      </GoogleOAuthProvider>
    </div>
  );
};

export default SignUpWrapper;
