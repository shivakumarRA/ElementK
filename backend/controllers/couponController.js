const couponService = require('../services/couponService');

async function validateCoupon(req, res) {
  try {
    const { code, subtotal } = req.body;

    if (!code) {
      return res.status(400).json({
        error: 'Coupon code is required'
      });
    }

    if (!subtotal || subtotal <= 0) {
      return res.status(400).json({
        error: 'Valid subtotal is required'
      });
    }

    const coupon = await couponService.getCouponByCode(code);

    if (!coupon) {
      return res.status(404).json({
        error: 'Invalid coupon code',
        valid: false
      });
    }

    const discountPercent = parseFloat(coupon.discount_percent);
    const discountAmount = couponService.calculateDiscountAmount(subtotal, discountPercent);
    const finalPrice = subtotal - discountAmount;

    res.json({
      success: true,
      valid: true,
      data: {
        code: code.toUpperCase(),
        discountPercent: discountPercent,
        discountAmount: discountAmount,
        subtotal: subtotal,
        finalPrice: finalPrice
      }
    });
  } catch (error) {
    console.error('Error validating coupon:', error);
    res.status(500).json({
      error: 'Failed to validate coupon',
      details: error.message
    });
  }
}

module.exports = {
  validateCoupon
};

