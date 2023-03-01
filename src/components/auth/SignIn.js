import "../utilities/Loader.css";
import "./SignIn.css";
import loginWithChar from "../../assets/LOGIN_wCHAR_666.png";
// Import FirebaseAuth and firebase.
import React from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";

// Configure FirebaseUI
const uiConfig = {
  // Popup signin flow rather than redirect flow.
  signInFlow: "popup",
  // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
  signInSuccessUrl: "/",
  signInOptions: [firebase.auth.EmailAuthProvider.PROVIDER_ID],
};

const SignInScreen = () => {
  return (
    <div>
      <div className="model-loader">
        <div className="login">
          <img src={loginWithChar} />
          <div className="login-inputs">
            <label className="login-inputs-label">Login</label>
            <input className="login-inputs-input" type="text" />
            <br />
            <br />
            <label className="login-inputs-label">Password</label>
            <input className="login-inputs-input" type="password" />
          </div>
        </div>
        <br />
        <div className="mosaic-loader">
          <div className="cell d-0"></div>
          <div className="cell d-1"></div>
          <div className="cell d-2"></div>
          <div className="cell d-3"></div>
          <div className="cell d-1"></div>
          <div className="cell d-2"></div>
          <div className="cell d-3"></div>
          <div className="cell d-4"></div>
          <div className="cell d-2"></div>
          <div className="cell d-3"></div>
          <div className="cell d-4"></div>
          <div className="cell d-5"></div>
          <div className="cell d-3"></div>
          <div className="cell d-4"></div>
          <div className="cell d-5"></div>
          <div className="cell d-6"></div>
        </div>
      </div>
    </div>
  );
};

export default SignInScreen;
