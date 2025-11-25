const express = require('express');
const router = express.Router();
const path = require('path');
const invoiceController = require('../controllers/invoiceController');
const { validateInvoiceData, validateInvoiceId } = require('../middleware/validation');

router.get('/', invoiceController.getAllInvoices);
router.get('/:id', validateInvoiceId, invoiceController.getInvoiceById);
router.post('/', validateInvoiceData, invoiceController.createInvoice);
router.put('/:id', validateInvoiceId, validateInvoiceData, invoiceController.updateInvoice);
router.delete('/:id', validateInvoiceId, invoiceController.deleteInvoice);

module.exports = router;

