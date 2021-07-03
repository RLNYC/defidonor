import React, { useEffect, useState } from 'react';

import axios from '../axios';
import { COVALENTAPIKEY } from '../config';
import Spinner from '../components/Spinner';

function GrantCharities() {
    const [givingAddress, setGivingAddress] = useState('');
    const [balance, setBalance] = useState(0);
    const [tokens, setTokens] = useState([]);
    const [token, setToken] = useState('');
    const [charityAddress, setCharityAddress] = useState('');
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        async function getBalance(){
            const { data } = await axios.get('balance/60dcfd0776918e0006fc8d532af66320');
            console.log(data);
            setBalance(data.Balance);
            setGivingAddress(data.CurrentReceiveAddress);
        }

        getBalance();
    }, [])

    useEffect(() => {
        async function getUserTokens(){
            const res = await fetch(`https://api.covalenthq.com/v1/42/address/${givingAddress}/balances_v2/?key=${COVALENTAPIKEY}`);
            const { data } = await res.json();
            console.log(data);
            setTokens(data.items);
        }

        if(givingAddress) getUserTokens();
    }, [givingAddress])

    const donateToCharities = async () => {
        try{
            setLoading(true);
            const payData = {
                "amount": amount,
                "toAddress": charityAddress,
                "walletId": "60dcfd0776918e0006fc8d532af66320",
                "coinType": token
            }
            const { data } = await axios.put('sendtransaction', payData);
            console.log(data);
            setLoading(false);
        } catch(err) {
            console.error(err);
            setLoading(false);
        }
        
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
                                <td>${token.quote_rate || 0}</td>
                                <td>${token.quote}</td>
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
                                <option value="0x83eb0e2e36da037d4a2f9145a2544252421d52d0">Joe</option>
                                <option value="0x41026a0c3880e0c6d19b0cdbb421f587f3029f40">Bob</option>
                            </select>
                        </div>

                        <div className="d-flex">
                            <div className="form-group" style={{ width: '80%'}}>
                                <label>Amount</label>
                                <input
                                    className="form-control"
                                    
                                    type="number"
                                    name="amount"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)} 
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
                        
                        {loading
                            ? <Spinner />
                            : <button className="btn btn-primary btn-block" onClick={donateToCharities}>
                                Donate
                            </button>
                        }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GrantCharities;
