import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import axios from '../axios';

function Home({ walletAddress, bitgoWalletId, charitableBlockchain }) {
    const [balance, setBalance] = useState(0);
    const [transactions, setTransactions] = useState([]);
    const [receipts, setReceipts] = useState([]);
    
    useEffect(() => {
        async function getBalance(){
            const { data } = await axios.get(`bitgoapi/balance/${bitgoWalletId}`);
            console.log(data);
            setBalance(data.Balance);
        }

        async function getTransactions(){
            const { data } = await axios.get(`bitgoapi/transfertransactions/${bitgoWalletId}`);
            console.log(data.WalletTransactions.transfers);
            setTransactions(data.WalletTransactions.transfers)
        }

        if(bitgoWalletId){
            getBalance();
            getTransactions();
        }
    }, [bitgoWalletId])

    useEffect(() => {
        async function getReceiptNFT(){
            const totalSupply = await charitableBlockchain.methods
                .totalSupply()
                .call();

            console.log(totalSupply);

            const temp = [];

            for(let i = 1; i <= totalSupply; i++){
                const ownerAddress = await charitableBlockchain.methods
                    .ownerOf(i)
                    .call();

                if(ownerAddress === walletAddress){
                    const url = await charitableBlockchain.methods
                        .tokenURI(i)
                        .call();

                    temp.push(url);
                }
            }

            setReceipts(temp);
        }

        if(charitableBlockchain) getReceiptNFT();
    }, [charitableBlockchain])

    return (
        <div className="container">
            <div className="jumbotron pt-3 pb-3 mt-3 mb-3">
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
                                    <Link to="/givingaccount" className="btn btn-outline-primary btn-lg">
                                        Fund your Giving
                                    </Link>
                                </div>
                            </div>
                            <div className="card">
                                <div className="card-body">
                                    <Link to="/grantcharities" className="btn btn-outline-primary btn-lg">
                                        Grant to Charity
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <h2 className="mt-0 h3">
                Recent grant activity
            </h2>
            <hr />
            <div className="table-responsive table-height">
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

            <h2 className="mt-4 h3">
                Proof for Donation Fund
            </h2>
            <hr />
            <div className="d-flex flex-column">
                {receipts.map((receipt, index) => (
                    <a style={{ fontSize: '1.4rem'}} key={index} href={`${receipt}/receipt.pdf`}  target="_blank" rel="noopener noreferrer">
                        Receipt #{index + 1}
                    </a>
                ))}
            </div>
            
        </div>
    )
}

export default Home
