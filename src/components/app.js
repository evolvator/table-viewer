import React from 'react';
import { Switch, Router, Route, Redirect } from 'react-router';
import { BrowserRouter } from 'react-router-dom';

import Table from './table';

const App = () => (
  <div>
    <BrowserRouter>
      <Switch>
        <Route path="/:config" component={Table} />
        <Route component={() => <Redirect to="/{}" />} />
      </Switch>
    </BrowserRouter>
  </div>
);

export default App;
