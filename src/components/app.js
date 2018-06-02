import React from 'react';
import { Switch, Route, Redirect } from 'react-router';

import Table from './table';

const App = () => (
  <div>
    <Switch>
      <Route path="/:config" component={Table} />
      <Route component={() => <Redirect to="/{}" />} />
    </Switch>
  </div>
);

export default App;
