const express = require('express');
const router = express.Router();
const BitGoJS = require('bitgo');
const bitgo = new BitGoJS.BitGo({ env: 'test' });

require('dotenv').config();

const accessToken = process.env.BITGO_APIKEY;
bitgo.authenticateWithAccessToken({ accessToken });

const coin = 'teth';

// GET /api/bitgoapi/listwallets
// List all multi-sig wallets at BitGo for the given coin
router.get('/listwallets', async (req, res, next) => {
  const wallets = await bitgo.coin(coin).wallets().list({});

  for(const wallet of wallets.wallets){
    console.log(`Wallet label: ${wallet.label()}`);
    console.log(`Wallet ID: ${wallet.id()}`);
  }
  return res.status(200).json({ data: wallets });
});

// GET /api/bitgoapi/transfertransactions
// List all transfers on a multi-sig wallets at BitGo for the given coin
router.get('/transfertransactions', async (req, res, next) => {
  const basecoin = bitgo.coin(coin);
  const walletId = '60dcfd0776918e0006fc8d532af66320';

  const walletInstance = await basecoin.wallets().get({ id: walletId });
  const transfers = await walletInstance.transfers();

  console.log('Wallet ID:', walletInstance.id());
  console.log('Current Receive Address:', walletInstance.receiveAddress());
  console.log('Wallet Transactions:', JSON.stringify(transfers, null, 4));

  return res.status(200).json({
    'Wallet ID': walletInstance.id(),
    'Current Receive Address': walletInstance.receiveAddress(),
    'Wallet Transactions': transfers
  });
});

module.exports = router;