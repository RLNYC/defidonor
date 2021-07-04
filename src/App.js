import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route  } from 'react-router-dom';

import './App.css';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import GivingAccount from './pages/GivingAccount';
import GrantCharities from './pages/GrantCharities';

function App() {
  const [walletAddress, setWalletAddress] = useState('');
  const [charitableBlockchain, setCharitableBlockchain] = useState(null);
  
  return (
    <Router className="App">
      <Navbar
        walletAddress={walletAddress}
        setWalletAddress={setWalletAddress}
        setCharitableBlockchain={setCharitableBlockchain} />
      <Switch>
        <Route exact path="/givingaccount">
          <GivingAccount
             walletAddress={walletAddress}
             charitableBlockchain={charitableBlockchain} />
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
