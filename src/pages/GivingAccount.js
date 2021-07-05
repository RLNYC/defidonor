import React, { useEffect, useState } from 'react';

import { COVALENTAPIKEY } from '../config';
import axios from '../axios';
import Spinner from '../components/Spinner';

function GivingAccount({ walletAddress, bitgoWalletId, charitableBlockchain }) {
    const [tokens, setTokens] = useState([]);
    const [token, setToken] = useState('ETH');
    const [amount, setAmount] = useState('');
    const [price, setPrice] = useState(0);
    const [transactionHash, setTransactionHash] = useState('');
    const [bitgoWalletAddress, setBitgoWalletAddress] = useState('');
    const [loading, setLoading] = useState(false);

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

    const handleAmount = async e => {
        setAmount(e.target.value);
        const totalUSDValue = await getETHtoUSD(e.target.value);
        setPrice(totalUSDValue);
    }

    const getETHtoUSD = async ETHvalue => {
        const usdValue = await charitableBlockchain.methods
            .getThePrice()
            .call();

        let totalUSDValue = (usdValue * ETHvalue) / 100000000;
        totalUSDValue = Number.parseFloat(totalUSDValue).toFixed(2);
        return totalUSDValue;
    }

    const donateToCharities = async () => {
        try{
            setLoading(true);
            const usdValue = await getETHtoUSD(amount);

            const userData = {
                "sponsoringOrganization": "DeFi Donors",
                "sentAddress": walletAddress,
                "receiveAddress": bitgoWalletAddress,
                "assets": `${amount} ETH`,
                "totalAssetValues": `$${usdValue}`
            }

            const res = await axios.post('pdf/createreceipt', userData);
            console.log(res);

            const data = await charitableBlockchain.methods
                .createReceiptandMint(res.data.url, bitgoWalletAddress)
                .send({ from: walletAddress, value: window.web3.utils.toWei(amount, 'Ether') });
            
            console.log(data);
            setLoading(false);
            setTransactionHash(data.transactionHash);
        } catch(err) {
            console.error(err);
            setLoading(false);
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
                                <td>${Number.parseFloat(token.quote_rate || 0).toFixed(2)}</td>
                                <td>${Number.parseFloat(token.quote).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="row">
                <div className="col-12 col-md-5">
                    <div className="card mt-1">
                        <div className="card-body">
                            <div className="input-group">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Amount"
                                    value={amount}
                                    onChange={handleAmount}/>
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

                            <p className="mt-1 mb-1" style={{ fontSize: '1.6rem'}}>
                                ${price}
                            </p>

                            {loading
                                ? <Spinner />
                                : <button
                                    className="btn btn-primary mt-2"
                                    type="button"
                                    onClick={donateToCharities}
                                    disabled={!amount}>
                                    Fund Giving Account
                                </button>
                            }
                            {transactionHash &&
                                <p className="mt-2 text-success" style={{ fontSize: '1.4rem'}}>
                                    Success, see transaction {" "}
                                    <a href={`https://kovan.etherscan.io/tx/${transactionHash}`} target="_blank" rel="noopener noreferrer">
                                        {transactionHash.substring(0, 10) + '...' + transactionHash.substring(56, 66)}
                                    </a>
                                </p>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GivingAccount;
