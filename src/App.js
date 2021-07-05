import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route  } from 'react-router-dom';

import './App.css';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import GivingAccount from './pages/GivingAccount';
import GrantCharities from './pages/GrantCharities';

function App() {
  const [walletAddress, setWalletAddress] = useState('');
  const [bitgoWalletId, setBitgoWalletId] = useState('');
  const [charitableBlockchain, setCharitableBlockchain] = useState(null);
  
  return (
    <Router className="App">
      <Navbar
        walletAddress={walletAddress}
        setWalletAddress={setWalletAddress}
        setCharitableBlockchain={setCharitableBlockchain}
        setBitgoWalletId={setBitgoWalletId} />
      <Switch>
        <Route exact path="/givingaccount">
          <GivingAccount
             walletAddress={walletAddress}
             bitgoWalletId={bitgoWalletId}
             charitableBlockchain={charitableBlockchain} />
        </Route>
        <Route exact path="/grantcharities">
          <GrantCharities
            bitgoWalletId={bitgoWalletId}
            charitableBlockchain={charitableBlockchain} />
        </Route>
        <Route path="/">
          <Home
            walletAddress={walletAddress}
            bitgoWalletId={bitgoWalletId}
            charitableBlockchain={charitableBlockchain} />
        </Route>
    </Switch>
    </Router>
  );
}

export default App;
