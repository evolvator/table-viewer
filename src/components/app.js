import React from 'react';
import { Switch, Route, Redirect } from 'react-router';

import Table from './table';

const App = () => (
  <div>
    <Switch>
      <Route path="/:path/:page/:count/:sorted/:filtered/" component={Table} />
      <Route component={() => <Redirect to="/?/0/100/[]/[]" />} />
    </Switch>
  </div>
);

export default App;
