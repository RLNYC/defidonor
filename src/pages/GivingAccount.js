import React, { useEffect, useState } from 'react';

import { COVALENTAPIKEY } from '../config';
import axios from '../axios';

function GivingAccount({ walletAddress, bitgoWalletId, charitableBlockchain }) {
    const [tokens, setTokens] = useState([]);
    const [token, setToken] = useState('ETH');
    const [amount, setAmount] = useState('');
    const [transactionHash, setTransactionHash] = useState('');
    const [bitgoWalletAddress, setBitgoWalletAddress] = useState('');

    useEffect(() => {
        async function getBitgoWalletAddress(){
            const { data } = await axios.get(`bitgoapi/balance/${bitgoWalletId}`);
            console.log(data);
            setBitgoWalletAddress(data.CurrentReceiveAddress);
        }

        async function getUserTokens(){
            const res = await fetch(`https://api.covalenthq.com/v1/42/address/${walletAddress}/balances_v2/?key=${COVALENTAPIKEY}`);
            console.log("walletAddress", walletAddress)
            const { data } = await res.json();
            console.log(data);
            setTokens(data.items);
        }

        getUserTokens();
        if(bitgoWalletId) getBitgoWalletAddress();
    }, [walletAddress])

    const donateToCharities = async () => {
        try{
            const userData = {
                "sponsoringOrganization": "Red Cross",
                "sentAddress": walletAddress,
                "receiveAddress": bitgoWalletAddress,
                "assets": `${amount} ETH`,
                "totalAssetValues": "$150"
            }

            const res = await axios.post('pdf/createreceipt', userData);
            console.log(res);

            const data = await charitableBlockchain.methods
                .createReceiptandMint(res.data.url, bitgoWalletAddress)
                .send({ from: walletAddress, value: window.web3.utils.toWei(amount, 'Ether') });
            
            console.log(data);
            setTransactionHash(data.transactionHash);
        } catch(err) {
            console.err(err);
        }
      }

    return (
        <div className="container">
            <h2 className="mt-3 h3">
                Your Assets
            </h2>
            <hr />

            <div className="table-responsive">
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">Assets</th>
                            <th scope="col">Quantity</th>
                            <th scope="col">Price</th>
                            <th scope="col">Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tokens.map(token => (
                            <tr key={token.contract_name}>
                                <td className="d-flex align-items-center">
                                   <img src={token.logo_url} alt="token" style={{ width: '2rem' }} />
                                   <div className="ml-4">
                                       <p className="m-0">
                                           {token.contract_name}
                                           </p>
                                       <p className="m-0">
                                           {token.contract_ticker_symbol}
                                        </p>
                                   </div>
                                </td>
                                <td>{token.balance / 10 ** 18}</td>
                                <td>${token.quote_rate || 0}</td>
                                <td>${token.quote}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="input-group">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)} />
                <div className="input-group-append w-50">
                    <button className="btn btn-outline-secondary dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        {token}
                    </button>
                    <div className="dropdown-menu">
                        {tokens.map(token => (
                            <p key={token.contract_name} className="mx-4 my-2">
                                {token.contract_ticker_symbol}
                            </p>
                        ))}
                    </div>
                </div>
            </div>
            <button className="btn btn-primary btn-lg mt-2" type="button" onClick={donateToCharities}>
                Submit
            </button>
            {transactionHash && <p className="mt-2 text-success">Success, {transactionHash}</p>}
        </div>
    )
}

export default GivingAccount;
