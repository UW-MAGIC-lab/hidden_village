import { StrictMode, lazy, Suspense } from "react";
import {createRoot} from "react-dom/client";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Loader from "./components/utilities/Loader.js";
import Settings from "./components/Settings.js";
import * as PIXI from "pixi.js";
import "regenerator-runtime/runtime";

// This global declaration is necessary to make the chrome PIXI devtools work
window.PIXI = PIXI;
import Sandbox from "./components/Sandbox";
import PoseCapture from "./components/PoseCapture";
const Story = lazy(() => import("./components/Story"));
let { NODE_ENV } = process.env;

const App = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Router>
        <Routes>
          {NODE_ENV !== "production" && (
            <Route path="/sandbox" element={<Sandbox />} />
          )}
          {NODE_ENV !== "production" && (
            <Route path="/posecapture" element={<PoseCapture />}/>
          )}
          <Route path="/settings" element={<Settings />}/>
          <Route path="/" element={<Story />}/>
        </Routes>
      </Router>
    </Suspense>
  );
};

const container = document.getElementById("root")
const root = createRoot(container)
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
// root.unmount();
