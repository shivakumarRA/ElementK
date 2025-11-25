import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import InvoiceList from './pages/InvoiceList';
import InvoiceForm from './pages/InvoiceForm';
import EditInvoice from './pages/EditInvoice';
import './App.css';

function App() {
    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/" element={<InvoiceList />} />
                    <Route path="/invoice/new" element={<InvoiceForm />} />
                    <Route path="/invoice/:id/edit" element={<EditInvoice />} />
                </Routes>
            </Layout>
        </Router>
    );
}

export default App;

