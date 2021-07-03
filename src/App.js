
import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route  } from 'react-router-dom';

import './App.css';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';

function App() {
  return (
    <Router className="App">
      <Navbar />
      <Switch>
        <Route path="">
          <Home />
        </Route>
    </Switch>
    </Router>
  );
}

export default App;
