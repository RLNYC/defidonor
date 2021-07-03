import React, { useEffect, useState } from 'react';

import { COVALENTAPIKEY } from '../config';

function GivingAccount() {
    const [tokens, setTokens] = useState([]);
    const [token, setToken] = useState('ETH');
    const [amount, setAmount] = useState('');

    useEffect(() => {
        async function getUserTokens(){
            const res = await fetch(`https://api.covalenthq.com/v1/42/address/0x4d7FB3b1F1dae456b814f2173aA64BaAfBd8f7ba/balances_v2/?key=${COVALENTAPIKEY}`);
            const { data } = await res.json();
            console.log(data);
            setTokens(data.items);
        }

        getUserTokens();
    }, [])

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
                                <td>${token.quote_rate}</td>
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
            <button className="btn btn-primary btn-lg mt-2" type="button" >
                Submit
            </button>
        </div>
    )
}

export default GivingAccount;
