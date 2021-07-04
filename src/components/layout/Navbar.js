import React from 'react';
import { Link } from 'react-router-dom';
import Web3 from 'web3';

import CharitableBlockchain from '../../abis/Charity.json';

function Navbar({ walletAddress, setWalletAddress, setCharitableBlockchain }) {
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
        } else {
            window.alert('Contract is not deployed to detected network')
        }
    }
    return (
        <nav className="navbar navbar-light bg-light">
            <div className="container">
                <Link className="navbar-brand mb-0 h1 p-0" to="/">
                    Logo
                </Link>
                <div className="d-flex align-items-center">
                    <button
                        className="btn btn-warning btn-lg my-2 my-sm-0"
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