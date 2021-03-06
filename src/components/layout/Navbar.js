import React from 'react';
import { Link } from 'react-router-dom';
import { RampInstantSDK } from '@ramp-network/ramp-instant-sdk';
import CPK, { Web3Adapter } from 'contract-proxy-kit';
import Web3 from 'web3';

import axios from '../../axios';
import Token from '../../abis/Token.json';
import CharitableBlockchain from '../../abis/Charity.json';

function Navbar({ walletAddress, setWalletAddress, setCharitableBlockchain, setBitgoWalletId, setSafeAddress, setCPK, setTokenBlockchain }) {
    const connetToWallet = async () => {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum);
        
            await window.ethereum.enable();
        }
        else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider);
        }
        else {
            window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
        }

        const web3 = window.web3;

        const accounts = await web3.eth.getAccounts();
        setWalletAddress(accounts[0]);

        const networkId = await web3.eth.net.getId();
        const networkData = CharitableBlockchain.networks[networkId];

        if(networkData){
            const abi = CharitableBlockchain.abi;
            const address = CharitableBlockchain.networks[networkId].address;

            const blockchain = new web3.eth.Contract(abi, address);
            setCharitableBlockchain(blockchain);

            const token = new web3.eth.Contract(Token.abi, Token.networks[networkId].address);
            setTokenBlockchain(token);
        } else {
            window.alert('Contract is not deployed to detected network')
        }

        const ethLibAdapter = new Web3Adapter({ web3 });
        const res = await CPK.create({ ethLibAdapter, ownerAccount: accounts[0] });
        console.log("wallet", accounts[0]);
        console.log(res);
        console.log("Gnosis Safe Address", res.address);
        setSafeAddress(res.address);
        setCPK(res);

        //getBitgoWalletId(accounts[0]);
    }

    async function getBitgoWalletId(address){
        try{
            const { data } = await axios.get(`bitgoapi/walletid/${address}`);
            console.log(data);
            setBitgoWalletId(data.data[0].id)
        } catch(err) {
            console.error(err);
            createBitgoWallet(address);
        }
        
    }

    async function createBitgoWallet(address){
        try{
            const { data } = await axios.post('bitgoapi/createwallet', {label: address});
            console.log(data);
            setBitgoWalletId(data.WalletID);
        } catch(err) {
            console.error(err);    
        }
    }

    function openRamp(){
        new RampInstantSDK({
            hostAppName: 'DeFi Donors',
            hostLogoUrl: 'https://raw.githubusercontent.com/RLNYC/ethGlobalHackMoney/master/public/logo.jpg',
            userAddress: '',
            url: 'https://ri-widget-staging-kovan.firebaseapp.com/'
          }).show();
    }

    return (
        <nav className="navbar navbar-light bg-light">
            <div className="container">
                <Link className="navbar-brand mb-0 h1 p-0" to="/">
                    <img style={{ width: '140px' }} src="./logo.jpg" alt="Logo" />
                </Link>
                <div className="d-flex align-items-center">
                    <button
                        className="btn btn-success my-2 my-sm-0 mr-2"
                        onClick={openRamp}
                    >
                        Open Ramp
                    </button>
                    <button
                        className="btn btn-warning my-2 my-sm-0"
                        onClick={connetToWallet}
                    >
                        {walletAddress
                            ? walletAddress.substring(0, 7) + '...' + walletAddress.substring(35, 42)
                            : 'Connect to Wallet'}
                    </button>
                </div>
                
            </div>
            
        </nav>
    )
}

export default Navbar;