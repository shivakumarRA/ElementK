import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import InvoiceTable from '../components/InvoiceTable';
import ItemForm from '../components/ItemForm';
import CouponSection from '../components/CouponSection';
import Message from '../components/Message';
import { API_ENDPOINTS } from '../config/api';
import './InvoiceForm.css';

const EditInvoice = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [couponCode, setCouponCode] = useState('');
    const [discountPercent, setDiscountPercent] = useState(0);
    const [discountAmount, setDiscountAmount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ text: '', type: '', show: false });

    useEffect(() => {
        loadInvoice();
    }, [id]);

    const loadInvoice = async () => {
        try {
            setLoading(true);
            const response = await fetch(API_ENDPOINTS.INVOICE_BY_ID(id));
            const data = await response.json();

            if (data.success && data.data) {
                // Populate items
                const loadedItems = data.data.items.map(item => ({
                    name: item.item_name,
                    quantity: item.quantity,
                    price: item.price,
                    total: item.total
                }));
                setItems(loadedItems);

                // Set coupon if exists
                if (data.data.invoice.couponCode) {
                    setCouponCode(data.data.invoice.couponCode);
                    setDiscountPercent(data.data.invoice.discountPercent);
                    setDiscountAmount(data.data.invoice.discountAmount);
                }

                showMessage('Invoice loaded successfully', 'success');
            } else {
                showMessage('Failed to load invoice', 'error');
                setTimeout(() => navigate('/'), 2000);
            }
        } catch (error) {
            console.error('Error loading invoice:', error);
            showMessage('Error loading invoice: ' + error.message, 'error');
            setTimeout(() => navigate('/'), 2000);
        } finally {
            setLoading(false);
        }
    };

    const handleAddItem = (item) => {
        const newItems = [...items, item];
        setItems(newItems);
        if (couponCode) {
            recalculateDiscount(newItems, couponCode);
        }
    };

    const handleRemoveItem = (index) => {
        const newItems = items.filter((_, i) => i !== index);
        setItems(newItems);
        if (couponCode) {
            recalculateDiscount(newItems, couponCode);
        }
    };

    const handleUpdateItem = (index, updatedItem) => {
        const newItems = [...items];
        newItems[index] = updatedItem;
        setItems(newItems);
        if (couponCode) {
            recalculateDiscount(newItems, couponCode);
        }
    };

    const recalculateDiscount = async (itemsList, code) => {
        const subtotal = itemsList.reduce((sum, item) => sum + item.total, 0);
        if (subtotal === 0) {
            setDiscountPercent(0);
            setDiscountAmount(0);
            return;
        }

        try {
            const response = await fetch(API_ENDPOINTS.COUPON_VALIDATE, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    code: code,
                    subtotal: subtotal
                })
            });

            const data = await response.json();
            if (data.success && data.valid) {
                setDiscountPercent(data.data.discountPercent);
                setDiscountAmount(data.data.discountAmount);
            } else {
                setDiscountPercent(0);
                setDiscountAmount(0);
            }
        } catch (error) {
            console.error('Error recalculating discount:', error);
        }
    };

    const handleApplyCoupon = async (code) => {
        const subtotal = items.reduce((sum, item) => sum + item.total, 0);
        
        if (subtotal === 0) {
            showMessage('Please add items before applying coupon', 'error');
            return;
        }

        try {
            const response = await fetch(API_ENDPOINTS.COUPON_VALIDATE, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    code: code,
                    subtotal: subtotal
                })
            });

            const data = await response.json();

            if (data.success && data.valid) {
                setCouponCode(data.data.code);
                setDiscountPercent(data.data.discountPercent);
                setDiscountAmount(data.data.discountAmount);
                showMessage(`Coupon "${code}" applied! ${data.data.discountPercent}% discount`, 'success');
            } else {
                setCouponCode('');
                setDiscountPercent(0);
                setDiscountAmount(0);
                showMessage(data.error || 'Invalid coupon code', 'error');
            }
        } catch (error) {
            console.error('Error validating coupon:', error);
            showMessage('Error validating coupon: ' + error.message, 'error');
        }
    };

    const handleUpdateInvoice = async () => {
        if (items.length === 0) {
            showMessage('Please add at least one item', 'error');
            return;
        }

        const subtotal = items.reduce((sum, item) => sum + item.total, 0);
        const invoiceData = {
            items: items,
            subtotal: subtotal,
            couponCode: couponCode || null
        };

        try {
            const response = await fetch(API_ENDPOINTS.INVOICE_BY_ID(id), {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(invoiceData)
            });

            const data = await response.json();

            if (data.success) {
                showMessage('Invoice updated successfully!', 'success');
                // Navigate to invoice list after 1 second
                setTimeout(() => {
                    navigate('/');
                }, 1500);
            } else {
                showMessage(data.error || 'Failed to update invoice', 'error');
            }
        } catch (error) {
            console.error('Error updating invoice:', error);
            showMessage('Error updating invoice: ' + error.message, 'error');
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
                <div className="loading">Loading invoice...</div>
            </div>
        );
    }

    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const finalPrice = subtotal - discountAmount;

    return (
        <div className="container">
            <div className="page-header">
                <h1>Edit Invoice #{id}</h1>
            </div>

            <Message message={message} onClose={closeMessage} />

            <InvoiceTable
                items={items}
                subtotal={subtotal}
                discountAmount={discountAmount}
                discountPercent={discountPercent}
                couponCode={couponCode}
                finalPrice={finalPrice}
                onRemoveItem={handleRemoveItem}
                editable={true}
                onUpdateItem={handleUpdateItem}
            />

            <CouponSection onApplyCoupon={handleApplyCoupon} />

            <ItemForm onAddItem={handleAddItem} />

            <div className="form-actions">
                <button
                    className="btn btn-secondary"
                    onClick={() => navigate('/')}
                >
                    Cancel
                </button>
                <button
                    className="btn btn-primary"
                    onClick={handleUpdateInvoice}
                >
                    Update Invoice
                </button>
            </div>
        </div>
    );
};

export default EditInvoice;

