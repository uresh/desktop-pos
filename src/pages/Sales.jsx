import React, { useState, useEffect } from 'react';
import { Calendar, Search, DollarSign } from 'lucide-react';
import './Sales.css';

const Sales = () => {
    const [sales, setSales] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSale, setSelectedSale] = useState(null);

    useEffect(() => {
        loadSales();
    }, []);

    const loadSales = async () => {
        try {
            const data = await window.api.getSales();
            // Sort by date descending
            const sortedData = (data || []).sort((a, b) => new Date(b.date) - new Date(a.date));
            setSales(sortedData);
        } catch (error) {
            console.error('Failed to load sales:', error);
        }
    };

    const filteredSales = sales.filter(sale =>
        sale.id.toString().includes(searchQuery) ||
        new Date(sale.date).toLocaleDateString().includes(searchQuery)
    );

    const totalRevenue = sales.reduce((sum, sale) => sum + (sale.total || 0), 0);

    return (
        <div className="flex flex-col h-full gap-6">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white" style={{ color: 'var(--text-primary)' }}>Sales History</h1>
                    <p className="text-secondary text-sm" style={{ color: 'var(--text-secondary)' }}>Overview of all transactions</p>
                </div>
                <div className="bg-secondary px-4 py-2 rounded-lg border border-border-color flex items-center gap-3" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
                    <div className="w-8 h-8 rounded-full bg-accent-primary flex items-center justify-center text-white" style={{ backgroundColor: 'var(--accent-primary)' }}>
                        <DollarSign size={16} />
                    </div>
                    <div>
                        <p className="text-xs text-secondary" style={{ color: 'var(--text-secondary)' }}>Total Revenue</p>
                        <p className="text-lg font-bold text-white" style={{ color: 'var(--text-primary)' }}>${totalRevenue.toFixed(2)}</p>
                    </div>
                </div>
            </header>

            <div className="flex gap-4 mb-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary" size={18} />
                    <input
                        type="text"
                        placeholder="Search by ID or Date..."
                        className="pl-10 pr-4 py-2 rounded-lg bg-secondary text-white focus:outline-none focus:ring-2 focus:ring-accent-primary w-full border border-border-color"
                        style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', borderColor: 'var(--border-color)' }}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-secondary rounded-xl border border-border-color overflow-hidden flex-1" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-border-color text-secondary text-sm" style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>
                                <th className="p-4 font-medium">Date</th>
                                <th className="p-4 font-medium">Transaction ID</th>
                                <th className="p-4 font-medium">Items</th>
                                <th className="p-4 font-medium text-right">Total</th>
                                <th className="p-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSales.map((sale) => (
                                <tr key={sale.id} className="border-b border-border-color hover:bg-tertiary transition-colors" style={{ borderColor: 'var(--border-color)' }}>
                                    <td className="p-4 text-white flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                                        <Calendar size={16} className="text-secondary" />
                                        {new Date(sale.date).toLocaleString()}
                                    </td>
                                    <td className="p-4 text-secondary font-mono text-sm" style={{ color: 'var(--text-secondary)' }}>#{sale.id}</td>
                                    <td className="p-4 text-white" style={{ color: 'var(--text-primary)' }}>
                                        {sale.items.length} items ({sale.items.map(i => i.name).join(', ').slice(0, 30)}{sale.items.length > 2 ? '...' : ''})
                                    </td>
                                    <td className="p-4 font-bold text-accent-primary text-right" style={{ color: 'var(--accent-primary)' }}>${(sale.total || 0).toFixed(2)}</td>
                                    <td className="p-4 text-right">
                                        <button
                                            className="px-3 py-1 rounded bg-accent-primary text-white text-sm hover:opacity-90"
                                            style={{ backgroundColor: 'var(--accent-primary)' }}
                                            onClick={() => setSelectedSale(sale)}
                                        >
                                            View Invoice
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredSales.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="p-8 text-center text-secondary">
                                        No sales found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

            {
        selectedSale && (
            <div className="modal-overlay">
                <div className="invoice-modal">
                    <div className="invoice-header">
                        <h2>Invoice</h2>
                        <p>Date: {new Date(selectedSale.date).toLocaleString()}</p>
                        <p>ID: {selectedSale.id}</p>
                    </div>
                    <div className="invoice-items">
                        <table>
                            <thead>
                                <tr>
                                    <th>Item</th>
                                    <th>Qty</th>
                                    <th>Price</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedSale.items.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.name}</td>
                                        <td>{item.quantity}</td>
                                        <td>${item.price.toFixed(2)}</td>
                                        <td>${(item.price * item.quantity).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="invoice-total">
                        <h3>Total: ${(selectedSale.total || 0).toFixed(2)}</h3>
                    </div>
                    <div className="invoice-actions">
                        <button onClick={() => window.print()}>Print</button>
                        <button onClick={() => setSelectedSale(null)}>Close</button>
                    </div>
                </div>
            </div>
        )
    }
        </div >
    );
};

export default Sales;
