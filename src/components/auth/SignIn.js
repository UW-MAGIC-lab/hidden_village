import "./SignIn.css";
import circle_sprite from "../../assets/circle_sprite.png";
import scaleneTriangle_sprite from "../../assets/scaleneTriangle_sprite.png";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";

const SignInScreen = ({ firebaseApp }) => {
  // takes the entered email and password and logs in the user
  const auth = getAuth(firebaseApp);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(false);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const ErrorMessage = ({ error, message }) => {
    if (error) {
      return (
        <div className="error-output">
          <span>{message}</span>
          <br></br>
          <span>Please try again.</span>
        </div>
      );
    }
    return <></>;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        window.location.href = "/";
        console.log("success!");
      })
      .catch((error) => {
        setLoginError(true);
      });
  };

  return (
    <div>
      <div className="model-loader">
        <form onSubmit={handleSubmit}>
          <div className="login">
            <div className="login-inputs">
              <label htmlFor="email" className="login-input-label">
                Login
              </label>
              <input
                value={email}
                onChange={handleEmailChange}
                id="email"
                className="login-input-input"
                type="text"
              />
              <label htmlFor="password" className="login-input-label">
                Password
              </label>
              <input
                value={password}
                onChange={handlePasswordChange}
                id="password"
                className="login-input-input"
                type="password"
              />
              <div></div>
              <input className="login-input-submit" type="submit" />
              <ErrorMessage
                error={loginError}
                message={"Email or password is incorrect."}
              ></ErrorMessage>
            </div>
            <img src={circle_sprite} className="sprite circle-sprite" />
            <img
              src={scaleneTriangle_sprite}
              className="sprite triangle-sprite"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignInScreen;
