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
  const [safeAddress, setSafeAddress] = useState('');
  const [cpk, setCPK] = useState(null);
  const [charitableBlockchain, setCharitableBlockchain] = useState(null);
  const [tokenBlockchain, setTokenBlockchain] = useState(null);
  
  return (
    <Router className="App">
      <Navbar
        walletAddress={walletAddress}
        setWalletAddress={setWalletAddress}
        setCharitableBlockchain={setCharitableBlockchain}
        setBitgoWalletId={setBitgoWalletId}
        setSafeAddress={setSafeAddress}
        setCPK={setCPK}
        setTokenBlockchain={setTokenBlockchain} />
      <Switch>
        <Route exact path="/givingaccount">
          <GivingAccount
             walletAddress={walletAddress}
             bitgoWalletId={bitgoWalletId}
             charitableBlockchain={charitableBlockchain}
             safeAddress={safeAddress}
             cpk={cpk}
             tokenBlockchain={tokenBlockchain} />
        </Route>
        <Route exact path="/grantcharities">
          <GrantCharities
            bitgoWalletId={bitgoWalletId}
            charitableBlockchain={charitableBlockchain}
            safeAddress={safeAddress}
            cpk={cpk}
            tokenBlockchain={tokenBlockchain} />
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
