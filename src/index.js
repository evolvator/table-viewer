import React from "react";
import { render } from "react-dom";
import { HashRouter } from 'react-router-dom'
import { Switch, Route, Redirect } from "react-router";
import Page from "./page";

import "normalize.css/normalize.css";
import "./index.css";

const App = () => (
  <div>
    <HashRouter basename={'/'}>
      <Switch>
        <Route path={`/:config`} component={() => <Page />} />
        <Route component={() => <Redirect to={`/{}`} />} />
      </Switch>
    </HashRouter>
  </div>
);

render(<App />, document.getElementById("root"));
