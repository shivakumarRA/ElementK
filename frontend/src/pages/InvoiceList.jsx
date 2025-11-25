import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Message from '../components/Message';
import './InvoiceList.css';

const InvoiceList = () => {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ text: '', type: '', show: false });
    const navigate = useNavigate();

    useEffect(() => {
        loadInvoices();
    }, []);

    const loadInvoices = async () => {
        try {
            setLoading(true);
            const response = await fetch('/invoice');
            const data = await response.json();

            if (data.success) {
                setInvoices(data.data || []);
            } else {
                showMessage('Failed to load invoices', 'error');
            }
        } catch (error) {
            console.error('Error loading invoices:', error);
            showMessage('Error loading invoices: ' + error.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!window.confirm('Are you sure you want to delete this invoice?')) {
            return;
        }

        try {
            const response = await fetch(`/invoice/${id}`, {
                method: 'DELETE'
            });

            const data = await response.json();

            if (data.success) {
                showMessage('Invoice deleted successfully', 'success');
                loadInvoices();
            } else {
                showMessage(data.error || 'Failed to delete invoice', 'error');
            }
        } catch (error) {
            console.error('Error deleting invoice:', error);
            showMessage('Error deleting invoice: ' + error.message, 'error');
        }
    };

    const showMessage = (text, type) => {
        setMessage({ text, type, show: true });
    };

    const closeMessage = () => {
        setMessage({ text: '', type: '', show: false });
    };

    if (loading) {
        return (
            <div className="container">
                <div className="loading">Loading invoices...</div>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="page-header">
                <h1>Invoice List</h1>
                <Link to="/invoice/new" className="btn btn-primary">
                    + Create New Invoice
                </Link>
            </div>

            <Message message={message} onClose={closeMessage} />

            {invoices.length === 0 ? (
                <div className="empty-state">
                    <p>No invoices found.</p>
                    <Link to="/invoice/new" className="btn btn-primary">
                        Create Your First Invoice
                    </Link>
                </div>
            ) : (
                <div className="invoice-grid">
                    {invoices.map((invoice) => (
                        <Link
                            key={invoice.id}
                            to={`/invoice/${invoice.id}/edit`}
                            className="invoice-card"
                        >
                            <div className="invoice-card-header">
                                <h3>Invoice #{invoice.id}</h3>
                                <button
                                    className="btn-delete"
                                    onClick={(e) => handleDelete(invoice.id, e)}
                                    title="Delete Invoice"
                                >
                                    ×
                                </button>
                            </div>
                            <div className="invoice-card-body">
                                <div className="invoice-info">
                                    <div className="info-row">
                                        <span className="label">Subtotal:</span>
                                        <span className="value">${parseFloat(invoice.subtotal || 0).toFixed(2)}</span>
                                    </div>
                                    {invoice.couponCode && (
                                        <div className="info-row">
                                            <span className="label">Coupon:</span>
                                            <span className="value">{invoice.couponCode} ({parseFloat(invoice.discountPercent || 0)}%)</span>
                                        </div>
                                    )}
                                    <div className="info-row">
                                        <span className="label">Discount:</span>
                                        <span className="value">-${parseFloat(invoice.discountAmount || 0).toFixed(2)}</span>
                                    </div>
                                    <div className="info-row total">
                                        <span className="label">Total:</span>
                                        <span className="value">${parseFloat(invoice.finalPrice || 0).toFixed(2)}</span>
                                    </div>
                                </div>
                                <div className="invoice-date">
                                    Created: {new Date(invoice.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default InvoiceList;

