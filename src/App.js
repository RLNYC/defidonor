
import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route  } from 'react-router-dom';

import './App.css';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import GivingAccount from './pages/GivingAccount';
import GrantCharities from './pages/GrantCharities';

function App() {
  return (
    <Router className="App">
      <Navbar />
      <Switch>
        <Route exact path="/givingaccount">
          <GivingAccount />
        </Route>
        <Route exact path="/grantcharities">
          <GrantCharities />
        </Route>
        <Route path="">
          <Home />
        </Route>
    </Switch>
    </Router>
  );
}

export default App;
