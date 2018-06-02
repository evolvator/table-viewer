import React from "react";
import { Switch, Route } from "react-router";

import Table from "./table";

const App = () => (
  <div>
    <Switch>
      <Route path="/:path/:sort/:filter/" component={Table} />
    </Switch>
  </div>
);

export default App;
