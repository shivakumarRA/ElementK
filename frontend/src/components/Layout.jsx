import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Layout.css';

const Layout = ({ children }) => {
    const location = useLocation();

    return (
        <div className="layout">
            <nav className="navbar">
                <div className="nav-container">
                    <Link to="/" className="nav-logo">
                        Invoice Management
                    </Link>
                    <ul className="nav-menu">
                        <li className="nav-item">
                            <Link 
                                to="/" 
                                className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
                            >
                                Invoice List
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link 
                                to="/invoice/new" 
                                className={`nav-link ${location.pathname === '/invoice/new' ? 'active' : ''}`}
                            >
                                Create Invoice
                            </Link>
                        </li>
                    </ul>
                </div>
            </nav>
            <main className="main-content">
                {children}
            </main>
        </div>
    );
};

export default Layout;

