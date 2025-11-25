const invoiceService = require('../services/invoiceService');
const path = require('path');

function showNewInvoicePage(req, res) {
  res.sendFile(path.join(__dirname, '../../frontend/views/invoice.html'));
}

async function getAllInvoices(req, res) {
  try {
    const invoices = await invoiceService.getAllInvoices();
    res.json({
      success: true,
      count: invoices.length,
      data: invoices
    });
  } catch (error) {
    console.error('Error fetching invoices:', error);
    res.status(500).json({
      error: 'Failed to fetch invoices',
      details: error.message
    });
  }
}

async function getInvoiceById(req, res) {
  try {
    const invoiceId = req.params.id;

    const invoiceData = await invoiceService.getInvoiceById(invoiceId);

    if (!invoiceData) {
      return res.status(404).json({ 
        error: 'Invoice not found',
        message: `Invoice with ID ${invoiceId} does not exist`
      });
    }

    res.json({
      success: true,
      data: {
        invoice: invoiceData.invoice,
        items: invoiceData.items
      }
    });
  } catch (error) {
    console.error('Error loading invoice:', error);
    res.status(500).json({
      error: 'Failed to load invoice',
      details: error.message
    });
  }
}

async function createInvoice(req, res) {
  try {
    const { items, subtotal, couponCode } = req.body;

    const invoice = await invoiceService.createInvoice(
      { subtotal },
      items,
      couponCode
    );

    res.status(201).json({
      success: true,
      message: 'Invoice created successfully',
      data: {
        invoiceId: invoice.id,
        invoice: invoice
      }
    });
  } catch (error) {
    console.error('Error creating invoice:', error);
    res.status(500).json({
      error: 'Failed to create invoice',
      details: error.message
    });
  }
}

async function updateInvoice(req, res) {
  try {
    const invoiceId = req.params.id;
    const { items, subtotal, couponCode } = req.body;

    const exists = await invoiceService.invoiceExists(invoiceId);
    if (!exists) {
      return res.status(404).json({ 
        error: 'Invoice not found',
        message: `Invoice with ID ${invoiceId} does not exist`
      });
    }

    const invoice = await invoiceService.updateInvoice(
      invoiceId,
      { subtotal },
      items,
      couponCode
    );

    res.json({
      success: true,
      message: 'Invoice updated successfully',
      data: {
        invoiceId: invoice.id,
        invoice: invoice
      }
    });
  } catch (error) {
    console.error('Error updating invoice:', error);
    res.status(500).json({
      error: 'Failed to update invoice',
      details: error.message
    });
  }
}

async function deleteInvoice(req, res) {
  try {
    const invoiceId = req.params.id;

    const exists = await invoiceService.invoiceExists(invoiceId);
    if (!exists) {
      return res.status(404).json({ 
        error: 'Invoice not found',
        message: `Invoice with ID ${invoiceId} does not exist`
      });
    }

    await invoiceService.deleteInvoice(invoiceId);

    res.json({
      success: true,
      message: 'Invoice deleted successfully',
      data: {
        invoiceId: invoiceId
      }
    });
  } catch (error) {
    console.error('Error deleting invoice:', error);
    res.status(500).json({
      error: 'Failed to delete invoice',
      details: error.message
    });
  }
}

module.exports = {
  showNewInvoicePage,
  getAllInvoices,
  getInvoiceById,
  createInvoice,
  updateInvoice,
  deleteInvoice
};

