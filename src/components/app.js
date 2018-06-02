import React from "react";
import { Switch, Route } from "react-router";

import Table from "./table";

const App = () => (
  <div>
    <Switch>
      <Route path="/" component={Table} />
      <Route path="/:path" component={Table} />
      <Route path="/:path/:sorted/" component={Table} />
      <Route path="/:path/:sorted/:filtered/" component={Table} />
    </Switch>
  </div>
);

export default App;
