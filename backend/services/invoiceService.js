const db = require('../db');
const couponService = require('./couponService');

async function createInvoice(invoiceData, items, couponCode = null) {
  const { subtotal } = invoiceData;
  
  let discountPercent = 0;
  let discountAmount = 0;
  
  if (couponCode) {
    const coupon = await couponService.getCouponByCode(couponCode);
    if (coupon) {
      discountPercent = coupon.discount_percent;
      discountAmount = couponService.calculateDiscountAmount(subtotal, discountPercent);
    }
  }

  const finalPrice = subtotal - discountAmount;

  const connection = await db.getConnection();
  await connection.beginTransaction();

  try {
    const [invoiceResult] = await connection.execute(
      `INSERT INTO invoices (subtotal, coupon_code, discount_percent, discount_amount, final_price, created_at) 
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [subtotal, couponCode || null, discountPercent, discountAmount, finalPrice]
    );

    const invoiceId = invoiceResult.insertId;

    for (const item of items) {
      await connection.execute(
        `INSERT INTO invoice_items (invoice_id, item_name, quantity, price, total) 
         VALUES (?, ?, ?, ?, ?)`,
        [invoiceId, item.name, item.quantity, item.price, item.total]
      );
    }

    await connection.commit();
    connection.release();

    return {
      id: invoiceId,
      subtotal,
      couponCode,
      discountPercent,
      discountAmount,
      finalPrice
    };
  } catch (error) {
    await connection.rollback();
    connection.release();
    throw error;
  }
}

async function getAllInvoices() {
  try {
    const [invoiceRows] = await db.execute(
      'SELECT * FROM invoices ORDER BY created_at DESC'
    );

    return invoiceRows.map(invoice => ({
      id: invoice.id,
      subtotal: parseFloat(invoice.subtotal),
      couponCode: invoice.coupon_code,
      discountPercent: parseFloat(invoice.discount_percent),
      discountAmount: parseFloat(invoice.discount_amount),
      finalPrice: parseFloat(invoice.final_price),
      createdAt: invoice.created_at,
      updatedAt: invoice.updated_at
    }));
  } catch (error) {
    console.error('Error fetching all invoices:', error);
    throw error;
  }
}

async function getInvoiceById(invoiceId) {
  try {
    const [invoiceRows] = await db.execute(
      'SELECT * FROM invoices WHERE id = ?',
      [invoiceId]
    );

    if (invoiceRows.length === 0) {
      return null;
    }

    const invoice = invoiceRows[0];

    const [itemRows] = await db.execute(
      'SELECT * FROM invoice_items WHERE invoice_id = ? ORDER BY id',
      [invoiceId]
    );

    return {
      invoice: {
        id: invoice.id,
        subtotal: parseFloat(invoice.subtotal),
        couponCode: invoice.coupon_code,
        discountPercent: parseFloat(invoice.discount_percent),
        discountAmount: parseFloat(invoice.discount_amount),
        finalPrice: parseFloat(invoice.final_price),
        createdAt: invoice.created_at,
        updatedAt: invoice.updated_at
      },
      items: itemRows.map(item => ({
        id: item.id,
        item_name: item.item_name,
        quantity: parseFloat(item.quantity),
        price: parseFloat(item.price),
        total: parseFloat(item.total)
      }))
    };
  } catch (error) {
    console.error('Error fetching invoice:', error);
    throw error;
  }
}

async function invoiceExists(invoiceId) {
  try {
    const [rows] = await db.execute(
      'SELECT id FROM invoices WHERE id = ?',
      [invoiceId]
    );
    return rows.length > 0;
  } catch (error) {
    console.error('Error checking invoice existence:', error);
    throw error;
  }
}

async function updateInvoice(invoiceId, invoiceData, items, couponCode = null) {
  const { subtotal } = invoiceData;
  
  let discountPercent = 0;
  let discountAmount = 0;
  
  if (couponCode) {
    const coupon = await couponService.getCouponByCode(couponCode);
    if (coupon) {
      discountPercent = coupon.discount_percent;
      discountAmount = couponService.calculateDiscountAmount(subtotal, discountPercent);
    }
  }

  const finalPrice = subtotal - discountAmount;

  const connection = await db.getConnection();
  await connection.beginTransaction();

  try {
    await connection.execute(
      'DELETE FROM invoice_items WHERE invoice_id = ?',
      [invoiceId]
    );

    for (const item of items) {
      await connection.execute(
        `INSERT INTO invoice_items (invoice_id, item_name, quantity, price, total) 
         VALUES (?, ?, ?, ?, ?)`,
        [invoiceId, item.name, item.quantity, item.price, item.total]
      );
    }

    await connection.execute(
      `UPDATE invoices 
       SET subtotal = ?, coupon_code = ?, discount_percent = ?, discount_amount = ?, final_price = ?, updated_at = NOW() 
       WHERE id = ?`,
      [subtotal, couponCode || null, discountPercent, discountAmount, finalPrice, invoiceId]
    );

    await connection.commit();
    connection.release();

    return {
      id: invoiceId,
      subtotal,
      couponCode,
      discountPercent,
      discountAmount,
      finalPrice
    };
  } catch (error) {
    await connection.rollback();
    connection.release();
    throw error;
  }
}

async function deleteInvoice(invoiceId) {
  const connection = await db.getConnection();
  await connection.beginTransaction();

  try {
    await connection.execute(
      'DELETE FROM invoice_items WHERE invoice_id = ?',
      [invoiceId]
    );

    const [result] = await connection.execute(
      'DELETE FROM invoices WHERE id = ?',
      [invoiceId]
    );

    await connection.commit();
    connection.release();

    return result.affectedRows > 0;
  } catch (error) {
    await connection.rollback();
    connection.release();
    throw error;
  }
}

module.exports = {
  getAllInvoices,
  createInvoice,
  getInvoiceById,
  invoiceExists,
  updateInvoice,
  deleteInvoice
};

