// API Configuration
// In production, this will use the Render backend URL from environment variables
// In development, it will use the proxy (localhost:3000)

const getApiBaseUrl = () => {
  // Check if we have a custom API URL set
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  
  // In development, use relative paths (proxy handles it)
  // In production on Vercel, use the Render backend URL
  if (process.env.NODE_ENV === 'production') {
    // This should be set in Vercel environment variables
    return process.env.REACT_APP_API_URL || '';
  }
  
  // Development: use relative paths (will be proxied to backend)
  return '';
};

export const API_BASE_URL = getApiBaseUrl();

export const API_ENDPOINTS = {
  INVOICES: `${API_BASE_URL}/invoice`,
  INVOICE_BY_ID: (id) => `${API_BASE_URL}/invoice/${id}`,
  COUPON_VALIDATE: `${API_BASE_URL}/coupon/validate`,
};

