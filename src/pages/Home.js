import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import axios from '../axios';

function Home() {
    const [balance, setBalance] = useState(0);
    const [transactions, setTransactions] = useState([]);
    useEffect(() => {
        async function getBalance(){
            const { data } = await axios.get('balance/60dcfd0776918e0006fc8d532af66320');
            console.log(data);
            setBalance(data.Balance);
        }

        async function getTransactions(){
            const { data } = await axios.get('transfertransactions/60dcfd0776918e0006fc8d532af66320');
            console.log(data.WalletTransactions.transfers);
            setTransactions(data.WalletTransactions.transfers)
        }

        getBalance();
        getTransactions();
    }, [])
    return (
        <div className="container">
            <div className="jumbotron pt-3 pb-3 mt-3">
                <div className="row">
                    <div className="col-12 col-md-6">
                        <h1 className="h1">
                            Welcome Guest
                        </h1>
                        <p className="lead mb-0">
                            Available to grant
                        </p>
                        <p className="h3 text-success">
                            {balance / 10 ** 18} ETH
                        </p>
                    </div>
                    <div className="col-12 col-md-6">
                        <div className="d-flex">
                            <div className="card">
                                <div className="card-body">
                                    <Link to="/" className="btn btn-outline-primary btn-lg">
                                        Fund your Giving
                                    </Link>
                                </div>
                            </div>
                            <div className="card">
                                <div className="card-body">
                                    <Link to="/" className="btn btn-outline-primary btn-lg">
                                        Grant to Giving
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <h2>
                Recent grant activity
            </h2>
            <hr />
            <div className="table-responsive">
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">Txid</th>
                            <th scope="col">Coin</th>
                            <th scope="col">Amount</th>
                            <th scope="col">Type</th>
                            <th scope="col">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map(transaction => (
                            <tr key={transaction.txid}>
                                <th>
                                    {transaction.txid.substring(0, 6) + '...' + transaction.txid.substring(60, 66)}
                                </th>
                                <td>{transaction.coin}</td>
                                <td>{transaction.value / 10 ** 18}</td>
                                <td>{transaction.type}</td>
                                <td>{transaction.date}</td>
                            </tr>
                        ))}
                        
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Home
