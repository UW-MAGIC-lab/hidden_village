import "./SignIn.css";
import circle_sprite from "../../assets/circle_sprite.png";
import scaleneTriangle_sprite from "../../assets/scaleneTriangle_sprite.png";

const SignInScreen = () => {
  return (
    <div>
      <div className="model-loader">
        <form>
          <div className="login">
            <div className="login-inputs">
              <label htmlFor="email" className="login-input-label">
                Login
              </label>
              <input id="email" className="login-input-input" type="text" />
              <label htmlFor="password" className="login-input-label">
                Password
              </label>
              <input
                id="password"
                className="login-input-input"
                type="password"
              />
              <div></div>
              <input className="login-input-submit" type="submit" />
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
