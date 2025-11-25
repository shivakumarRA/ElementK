import React, { useState } from 'react';
import './CouponSection.css';

const CouponSection = ({ onApplyCoupon }) => {
    const [couponCode, setCouponCode] = useState('');

    const handleApply = () => {
        const code = couponCode.trim().toUpperCase();
        if (code) {
            onApplyCoupon(code);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleApply();
        }
    };

    return (
        <div className="coupon-section">
            <label htmlFor="couponCode" style={{ fontWeight: 600, marginRight: '10px' }}>
                Coupon Code:
            </label>
            <input
                type="text"
                id="couponCode"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter coupon code (e.g., ABC)"
            />
            <button className="btn-apply" onClick={handleApply}>
                Apply
            </button>
        </div>
    );
};

export default CouponSection;

