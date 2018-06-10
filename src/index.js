import React from "react";
import { render } from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { Switch, Router, Route, Redirect } from "react-router";
import Page from "./page";

import "normalize.css/normalize.css";
import "./index.css";

const App = () => (
  <div>
    <BrowserRouter>
      <Switch>
        <Route path="/:config" component={() => <Page />} />
        <Route component={() => <Redirect to="/{}" />} />
      </Switch>
    </BrowserRouter>
  </div>
);

render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById("root")
);
