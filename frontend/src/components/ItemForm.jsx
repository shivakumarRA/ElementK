import React, { useState } from 'react';
import './ItemForm.css';

const ItemForm = ({ onAddItem }) => {
    const [itemName, setItemName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [price, setPrice] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const name = itemName.trim();
        const qty = parseFloat(quantity);
        const itemPrice = parseFloat(price) || 0;

        if (!name || !qty || qty <= 0) {
            return;
        }

        const total = qty * itemPrice;

        onAddItem({
            name,
            quantity: qty,
            price: itemPrice,
            total
        });

        // Clear form
        setItemName('');
        setQuantity('');
        setPrice('');
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSubmit(e);
        }
    };

    return (
        <div className="add-item-section">
            <h3 style={{ marginBottom: '15px' }}>Add New Item</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="itemName" className="required">Title</label>
                        <input
                            type="text"
                            id="itemName"
                            value={itemName}
                            onChange={(e) => setItemName(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Enter item name"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="itemQuantity" className="required">Quantity</label>
                        <input
                            type="number"
                            id="itemQuantity"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Enter quantity"
                            min="1"
                            step="1"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="itemPrice">Per Unit Price</label>
                        <input
                            type="number"
                            id="itemPrice"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Enter price"
                            min="0"
                            step="0.01"
                        />
                    </div>
                    <button type="submit" className="btn-add" title="Add Item">
                        +
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ItemForm;

