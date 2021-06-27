import React, { useEffect, useState } from 'react';
import { v4 as uuidV4 } from 'uuid';

import axios from '../axios';

function Main() {
  const [masterWallet, setMasterWallet] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  
  useEffect(() => {
    async function getMasterWallet(){
      const {data} = await axios.get('/v1/configuration');
      console.log(data);
      setMasterWallet(data.data.payments.masterWalletId);
    }

    async function getWalletAddress(){
      const {data} = await axios.get('/v1/businessAccount/wallets/addresses/deposit');
      console.log(data);
      setWalletAddress(data.data[0].address);
    }
    getMasterWallet();
    getWalletAddress();
  }, [])

  return (
    <div>
      <p>Master Wallet: {masterWallet}</p>
      <p>Wallet Address: {walletAddress}</p>
      <p>{uuidV4(0)}</p>
    </div>
  )
}

export default Main;
