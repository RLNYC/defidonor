const express = require('express');
const router = express.Router();
const BitGoJS = require('bitgo');
const bitgo = new BitGoJS.BitGo({ env: 'test' });

require('dotenv').config();

const accessToken = process.env.BITGO_APIKEY;
bitgo.authenticateWithAccessToken({ accessToken });

const coin = 'teth';
const walletPassphrase = process.env.WALLETPASSPHRASE;;

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

// GET /api/bitgoapi/balance/:walletid
// Get the balance of a multi-sig wallet at BitGo
router.get('/balance/:walletid', async (req, res, next) => {
  const basecoin = bitgo.coin(coin);
  bitgo.authenticateWithAccessToken({ accessToken: accessToken });
 
  const walletInstance = await basecoin.wallets().get({ id: req.params.walletid });
  
  console.log('Wallet ID:', walletInstance.id());
  //console.dir(wallet.balanceString(), { depth: 100 });
  console.log('Current Receive Address:', walletInstance.receiveAddress());
  console.log('Balance:', walletInstance.balanceString());
  console.log('Confirmed Balance:', walletInstance.confirmedBalanceString());
  console.log('Spendable Balance:', walletInstance.spendableBalanceString());

  return res.status(200).json({
    'WalletID': walletInstance.id(),
    'CurrentReceiveAddress': walletInstance.receiveAddress(),
    'Balance': walletInstance.balanceString(),
    'ConfirmedBalance': walletInstance.confirmedBalanceString(),
    'SpendableBalance': walletInstance.spendableBalanceString(),
    'Data': walletInstance
  });
});

// GET /api/bitgoapi/alltokens/:walletid
// Get the balance of all tokens from multi-sig wallet at BitGo
router.get('/alltokens/:walletid', async (req, res, next) => {
  bitgo.authenticateWithAccessToken({ accessToken: accessToken });
 
  const teth = await bitgo.coin('teth').wallets().get({ id: req.params.walletid });
  const tdai = await bitgo.coin('tdai').wallets().get({ id: req.params.walletid });
  
  return res.status(200).json({
    'teth': {
      'balance': teth.balanceString(),
      'name': 'Ether',
      'symbol': 'ETH'
    },
    'tdai':{
      'balance': tdai.balanceString(),
      'name': 'Dai Stablecoin',
      'symbol': 'DAI'
    },
  });
});

// GET /api/bitgoapi/transfertransactions/:walletid
// List all transfers on a multi-sig wallets at BitGo for the given coin
router.get('/transfertransactions/:walletid', async (req, res, next) => {
  const basecoin = bitgo.coin(coin);
  const walletInstance = await basecoin.wallets().get({ id: req.params.walletid });
  const transfers = await walletInstance.transfers();

  console.log('Wallet ID:', walletInstance.id());
  console.log('Current Receive Address:', walletInstance.receiveAddress());
  console.log('Wallet Transactions:', JSON.stringify(transfers, null, 4));

  return res.status(200).json({
    'WalletID': walletInstance.id(),
    'CurrentReceiveAddress': walletInstance.receiveAddress(),
    'WalletTransactions': transfers
  });
});

// POST /api/bitgoapi/createwallet
// Create a multi-sig wallet at BitGo.
router.post('/createwallet', async (req, res, next) => {
    const label = req.body.label;
    const passphrase = walletPassphrase;
    bitgo.authenticateWithAccessToken({ accessToken });
  
    const walletOptions = {
      label,
      passphrase,
      enterprise: process.env.ENTERPRISE_KEY
    };
  
    const wallet = await bitgo.coin(coin).wallets().generateWallet(walletOptions);
  
    const walletInstance = wallet.wallet;
  
    console.log(`Wallet ID: ${walletInstance.id()}`);
    //console.log(`Receive address: ${walletInstance.receiveAddress()}`);
  
    console.log('BACK THIS UP: ');
    console.log(`User keychain encrypted xPrv: ${wallet.userKeychain.encryptedPrv}`);
    console.log(`Backup keychain xPrv: ${wallet.backupKeychain.prv}`);

    return res.status(201).json({
      "Wallet ID": walletInstance.id(),
      "User keychain encrypted xPrv": wallet.userKeychain.encryptedPrv,
      "Backup keychain xPrv": wallet.backupKeychain.prv
    });
});

// PUT /api/bitgoapi/listwallets
// Send a transaction from a multi-sig wallet at BitGo
router.put('/sendtransaction', async (req, res, next) => {
  const amount = req.body.amount;
  const toAddress = req.body.toAddress;
  const walletId = req.body.walletId;

  //await bitgo.unlock({ otp: '000000', duration: 3600 });
  //const basecoin = bitgo.coin('tdai');

  const walletInstance = await basecoin.wallets().get({ id: walletId });
  const transaction = await walletInstance.sendMany({
    recipients: [
      {
        amount: amount,
        address: toAddress
      },
    ],
    walletPassphrase: walletPassphrase
  });

  console.log('Wallet ID:', walletInstance.id());
  console.log('Current Receive Address:', walletInstance.receiveAddress());
  console.log('New Transaction:', JSON.stringify(transaction, null, 4));

  return res.status(200).json({
    "data": transaction
  });
});

module.exports = router;