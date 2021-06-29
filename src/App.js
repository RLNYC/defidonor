import React, { useEffect } from 'react';

import './App.css';
import { BITGO_APIKEY } from './config';
import Main from './components/Main';

function App() {
  useEffect(() => {
    const initializeBitgo = async () => {
      const BitGo = require('bitgo');
      const bitgo = new BitGo.BitGo({ accessToken: BITGO_APIKEY }); // defaults to testnet. add env: 'prod' if you want to go against mainnet
      // const result = await bitgo.session();
      console.log(bitgo);
    }

    initializeBitgo();
  }, [])
  return (
    <div className="App">
      <Main />
    </div>
  );
}

export default App;
