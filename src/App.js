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
import "./firebase/init";
import { writeUserData } from "./firebase/database";
import { selectCurrentConjectureIdx } from "./components/Game.js";
// import { conjectures } from "./models/conjectures.js";

// const uid = "";
// if (firebase.auth().currentUser !== null)
//   const uid = firebase.auth().currentUser.uid;

// if (app.auth().currentUser !== null)
//   console.log("user id: " + firebase.auth().currentUser.uid);

let currentdate = new Date();

let data = {
  documentId: "random letters assigned by Firebase",
  id: "username based on the UID of the user",
  // userId: getAuth(),
  poseData: "current pose data based on the frame rate limitation given",
  conjectureId:
    "add the conjecture id to determine the current point of the story",
  timestamp:
    currentdate.getDate() +
    "/" +
    (currentdate.getMonth() + 1) +
    "/" +
    currentdate.getFullYear() +
    " - " +
    currentdate.getHours() +
    ":" +
    currentdate.getMinutes() +
    ":" +
    currentdate.getSeconds() +
    ":" +
    currentdate.getMilliseconds(),
};

// writeUserData(data);
// writeUserData(
//   "did",
//   "id",
//   "uid",
//   selectCurrentConjectureIdx,
//   "posedata",
//   "timestamps"
// );

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
