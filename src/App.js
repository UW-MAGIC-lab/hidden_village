import { StrictMode, lazy, Suspense } from "react";
import { render } from "react-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Loader from "./components/utilities/Loader.js";
import Settings from "./components/Settings.js";
import * as PIXI from "pixi.js";
import "regenerator-runtime/runtime";

// This global declaration is necessary to make the chrome PIXI devtools work
window.PIXI = PIXI;
import Sandbox from "./components/Sandbox";
import PoseCapture from "./components/PoseCapture";
import SignIn from "./components/auth/SignIn";
const Story = lazy(() => import("./components/Story"));

// Firebase Init
import { app } from "./firebase/init";

const { NODE_ENV } = process.env;

const App = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Router>
        <Switch>
          {NODE_ENV !== "production" && (
            <Route path="/sandbox">
              <Sandbox />
            </Route>
          )}
          {NODE_ENV !== "production" && (
            <Route path="/posecapture">
              <PoseCapture />
            </Route>
          )}
          <Route path="/settings">
            <Settings />
          </Route>
          {/* <Route path="/signin">
            <SignIn />
          </Route> */}
          <Route path="/">
            <Story />
          </Route>
        </Switch>
      </Router>
    </Suspense>
  );
};

render(
  <StrictMode>
    <App />
  </StrictMode>,
  document.getElementById("root")
);
