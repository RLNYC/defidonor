import React from 'react';
import { Link } from 'react-router-dom';

function Navbar({ account = "0x09efu923u9023f3290m", tokens }) {
    return (
        <nav className="navbar navbar-light bg-light">
            <div className="container">
                <Link className="navbar-brand mb-0 h1 p-0" to="/">
                    Logo
                </Link>
                <div className="d-flex align-items-center">
                    <button
                        className="btn btn-warning btn-lg my-2 my-sm-0"
                    >
                        {account ? account.substring(0, 7) + '...' + account.substring(35, 42) : 'Connect to Wallet'}
                    </button>
                </div>
                
            </div>
            
        </nav>
    )
}

export default Navbar;