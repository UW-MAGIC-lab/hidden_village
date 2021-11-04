import { StrictMode, lazy, Suspense } from "react";
import { render } from "react-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Loader from "./components/utilities/Loader.js";
import Settings from "./components/Settings.js";

const Story = lazy(() => import("./Story"));

const App = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Router>
        <Switch>
          <Route path="/settings">
            <Settings />
          </Route>
          <Route path="/admin">
            <Story />
          </Route>
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
