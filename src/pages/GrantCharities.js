import React, { useEffect, useState } from 'react';
import CPK from 'contract-proxy-kit';

import axios from '../axios';
import { COVALENTAPIKEY } from '../config';
import Spinner from '../components/Spinner';

function GrantCharities({ bitgoWalletId, charitableBlockchain, cpk, tokenBlockchain }) {
    const [givingAddress, setGivingAddress] = useState('');
    const [balance, setBalance] = useState(0);
    const [tokens, setTokens] = useState([]);
    const [token, setToken] = useState('');
    const [charityAddress, setCharityAddress] = useState('');
    const [amount, setAmount] = useState('');
    const [friendAddress, setFriendAddress] = useState('');
    const [friendAmount, setFriendAmount] = useState('');
    const [price, setPrice] = useState(0);
    const [transactionHash, setTransactionHash] = useState('');
    const [transactionHash2, setTransactionHash2] = useState('');
    const [loading, setLoading] = useState(false);
    const [loading2, setLoading2] = useState(false);
    
    // useEffect(() => {
    //     async function getBalance(){
    //         const { data } = await axios.get(`bitgoapi/balance/${bitgoWalletId}`);
    //         console.log(data);
    //         setBalance(data.Balance);
    //         setGivingAddress(data.CurrentReceiveAddress);
    //     }

    //     getBalance();
    // }, [bitgoWalletId])

    // useEffect(() => {
    //     async function getUserTokens(){
    //         const res = await fetch(`https://api.covalenthq.com/v1/42/address/${givingAddress}/balances_v2/?key=${COVALENTAPIKEY}`);
    //         const { data } = await res.json();
    //         console.log(data);
    //         setTokens(data.items);
    //     }

    //     if(givingAddress) getUserTokens();
    // }, [givingAddress])

    const donateToCharities = async () => {
        try{
            setLoading(true);
            const payData = {
                "amount": window.web3.utils.toWei(amount, 'Ether'),
                "toAddress": charityAddress,
                "walletId": bitgoWalletId,
                "coinType": token
            }
            const { data } = await axios.put('bitgoapi/sendtransaction', payData);
            console.log(data);
            setTransactionHash(data.data.txid);
            setLoading(false);
        } catch(err) {
            console.error(err);
            setLoading(false);
        }
    }

    const donateToFriend = async () => {
        try{
            setLoading2(true);
            const txs = [
                {
                    operation: CPK.Call,
                    // Token Address
                    to: "0xdc5d1EB6B42F04eA92c1c026C09723034c254426",
                    value: 0,
                    data: tokenBlockchain.methods.transfer(friendAddress, window.web3.utils.toWei(friendAmount, 'Ether')).encodeABI()
                  }
            ]
        
            const txObject = await cpk.execTransactions(txs);
            console.log(txObject)
            setTransactionHash2(txObject.hash);
            setLoading2(false);
        } catch(err) {
            console.error(err);
            setLoading2(false);
        }
    }

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

    return (
        <div className="container">
            <h2 className="mt-3 h3">
                Your Giving Account Assets
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
                <div className="col-12 col-md-6">
                    <div className="card mt-1">
                        <div className="card-body">

                        <div className="form-group">
                            <label htmlFor="text">Charity List</label>
                            <select className="custom-select" onChange={(e) => setCharityAddress(e.target.value)}>
                                <option value="">Select Chartiy</option>
                                <option value="0x83eb0e2e36da037d4a2f9145a2544252421d52d0">Red Cross</option>
                                <option value="0x41026a0c3880e0c6d19b0cdbb421f587f3029f40">Pet Shelter</option>
                            </select>
                        </div>

                        <div className="d-flex">
                            <div className="form-group">
                                <label>Amount</label>
                                <input
                                    className="form-control"
                                    
                                    type="number"
                                    name="amount"
                                    value={amount}
                                    onChange={handleAmount} 
                                />
                            </div>
                            <div className="form-group" style={{ marginTop: '2rem'}}>
                                <select className="custom-select" onChange={(e) => setToken(e.target.value)}  style={{ backgroundColor: 'lightgrey'}}>
                                    <option value="">Select Assets</option>
                                    {tokens.map(token => (
                                        <option key={token.contract_name} value={`t${token.contract_ticker_symbol.toLowerCase()}`}>
                                            {token.contract_ticker_symbol}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <p style={{ fontSize: '1.6rem'}}>
                            ${price}
                        </p>
                        
                        {loading
                            ? <Spinner />
                            : <button
                                className="btn btn-primary btn-block"
                                onClick={donateToCharities}
                                disabled={!charityAddress || !amount || !token}
                            >
                                Donate to Charity
                            </button>
                        }

                        {transactionHash &&
                            <p className="mt-2 text-success" style={{ fontSize: '1.4rem'}}>
                                Success, see transaction {" "}
                                <a href={`https://rinkeby.etherscan.io/tx/${transactionHash}`} target="_blank" rel="noopener noreferrer">
                                    {transactionHash.substring(0, 10) + '...' + transactionHash.substring(56, 66)}
                                </a>
                            </p>
                        }
                        </div>
                    </div>
                </div>
                
                <div className="col-12 col-md-6">
                    <div className="card mt-1">
                        <div className="card-body">

                            <div className="form-group">
                                <label>Friend Address</label>
                                <input
                                    className="form-control"
                                    name="friendAddress"
                                    value={friendAddress}
                                    onChange={(e) => setFriendAddress(e.target.value)} 
                                />
                            </div>

                            <div className="form-group">
                                <label>Amount</label>
                                <input
                                    className="form-control"
                                    
                                    type="number"
                                    name="amount"
                                    value={friendAmount}
                                    onChange={(e) => setFriendAmount(e.target.value)} 
                                />
                            </div>
                            
                            {loading2
                                ? <Spinner />
                                : <button
                                    className="btn btn-primary btn-block"
                                    onClick={donateToFriend}
                                    disabled={!friendAddress || !friendAmount}
                                >
                                    Send token to friend
                                </button>
                            }

                            {transactionHash2 &&
                                <p className="mt-2 text-success" style={{ fontSize: '1.4rem'}}>
                                    Success, see transaction {" "}
                                    <a href={`https://rinkeby.etherscan.io/tx/${transactionHash2}`} target="_blank" rel="noopener noreferrer">
                                        {transactionHash2.substring(0, 10) + '...' + transactionHash2.substring(56, 66)}
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

export default GrantCharities;
