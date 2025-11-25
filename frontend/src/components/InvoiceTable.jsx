import React from 'react';
import './InvoiceTable.css';

const InvoiceTable = ({ items, subtotal, discountAmount, discountPercent, couponCode, finalPrice, onRemoveItem, editable = false, onUpdateItem }) => {
    const handleItemChange = (index, field, value) => {
        const updatedItems = [...items];
        updatedItems[index] = {
            ...updatedItems[index],
            [field]: field === 'name' ? value : parseFloat(value) || 0
        };

        if (field === 'quantity' || field === 'price') {
            updatedItems[index].total = updatedItems[index].quantity * updatedItems[index].price;
        }

        if (onUpdateItem) {
            onUpdateItem(index, updatedItems[index]);
        }
    };

    return (
        <table className="invoice-table">
            <thead>
                <tr>
                    <th>Item Name</th>
                    <th>Quantity</th>
                    <th>Per Unit Price</th>
                    <th>Total Price</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {items.map((item, index) => (
                    <tr key={index} className="item-row">
                        <td>
                            {editable ? (
                                <input
                                    type="text"
                                    value={item.name}
                                    onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                                    className="table-input"
                                />
                            ) : (
                                item.name
                            )}
                        </td>
                        <td>
                            {editable ? (
                                <input
                                    type="number"
                                    value={item.quantity}
                                    onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                                    className="table-input"
                                    min="1"
                                    step="1"
                                />
                            ) : (
                                item.quantity
                            )}
                        </td>
                        <td>
                            {editable ? (
                                <input
                                    type="number"
                                    value={item.price}
                                    onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                                    className="table-input"
                                    min="0"
                                    step="0.01"
                                />
                            ) : (
                                item.price.toFixed(2)
                            )}
                        </td>
                        <td>{item.total.toFixed(2)}</td>
                        <td>
                            <button
                                className="btn-remove"
                                onClick={() => onRemoveItem(index)}
                                title="Remove Item"
                            >
                                ×
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
            <tfoot>
                <tr className="subtotal-row">
                    <td colSpan="4" style={{ textAlign: 'right', fontWeight: 'bold' }}>
                        Subtotal:
                    </td>
                    <td>{subtotal.toFixed(2)}</td>
                </tr>
                <tr className="coupon-row">
                    <td>{couponCode ? `Coupon Code - ${couponCode}` : 'Coupon Code'}</td>
                    <td>{discountPercent > 0 ? `${discountPercent}%` : '-'}</td>
                    <td></td>
                    <td></td>
                    <td>{discountAmount.toFixed(2)}</td>
                </tr>
                <tr className="final-row">
                    <td colSpan="4" style={{ textAlign: 'right', fontWeight: 'bold' }}>
                        Price to pay:
                    </td>
                    <td>{finalPrice.toFixed(2)}</td>
                </tr>
            </tfoot>
        </table>
    );
};

export default InvoiceTable;

