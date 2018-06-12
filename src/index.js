import React from "react";
import { render } from "react-dom";
import { HashRouter } from 'react-router-dom'
import { Switch, Router, Route, Redirect } from "react-router";
import Page from "./page";

import "normalize.css/normalize.css";
import "./index.css";

const App = () => (
  <div>
    <HashRouter>
      <Switch>
        <Route path={`${process.env.PUBLIC_URL}/:config`} component={() => <Page />} />
        <Route component={() => <Redirect to={`${process.env.PUBLIC_URL}/{}`} />} />
      </Switch>
    </HashRouter>
  </div>
);

render(<App />, document.getElementById("root"));
