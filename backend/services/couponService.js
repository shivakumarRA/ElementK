const db = require('../db');

async function getCouponByCode(couponCode) {
  try {
    const [couponRows] = await db.execute(
      'SELECT discount_percent FROM coupons WHERE code = ?',
      [couponCode.toUpperCase()]
    );

    if (couponRows.length > 0) {
      return couponRows[0];
    }
    return null;
  } catch (error) {
    console.error('Error fetching coupon:', error);
    throw error;
  }
}

function calculateDiscountAmount(subtotal, discountPercent) {
  return (subtotal * discountPercent) / 100;
}

module.exports = {
  getCouponByCode,
  calculateDiscountAmount
};

