function validateInvoiceData(req, res, next) {
  const { items, subtotal } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ 
      error: 'Items are required and must be a non-empty array' 
    });
  }

  for (const item of items) {
    if (!item.name || !item.quantity || item.price === undefined) {
      return res.status(400).json({ 
        error: 'Each item must have name, quantity, and price' 
      });
    }
    
    if (item.quantity <= 0) {
      return res.status(400).json({ 
        error: 'Item quantity must be greater than 0' 
      });
    }
    
    if (item.price < 0) {
      return res.status(400).json({ 
        error: 'Item price cannot be negative' 
      });
    }
  }

  if (!subtotal || subtotal <= 0) {
    return res.status(400).json({ 
      error: 'Valid subtotal is required and must be greater than 0' 
    });
  }

  next();
}

function validateInvoiceId(req, res, next) {
  const invoiceId = parseInt(req.params.id);

  if (isNaN(invoiceId) || invoiceId <= 0) {
    return res.status(400).json({ 
      error: 'Invalid invoice ID' 
    });
  }

  req.params.id = invoiceId;
  next();
}

module.exports = {
  validateInvoiceData,
  validateInvoiceId
};

