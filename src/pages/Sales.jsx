import React, { useState, useEffect } from 'react';
import { Calendar, Search, DollarSign } from 'lucide-react';
import './Sales.css';

const Sales = () => {
    const [sales, setSales] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSale, setSelectedSale] = useState(null);
    const [dateRange, setDateRange] = useState({
        start: new Date().toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0]
    });

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

    const filteredSales = sales.filter(sale => {
        const saleDate = new Date(sale.date);
        const startDate = new Date(dateRange.start);
        startDate.setHours(0, 0, 0, 0);

        const endDate = new Date(dateRange.end);
        endDate.setHours(23, 59, 59, 999);

        const matchesSearch = sale.id.toString().includes(searchQuery) ||
            new Date(sale.date).toLocaleDateString().includes(searchQuery);

        const matchesDate = saleDate >= startDate && saleDate <= endDate;

        return matchesSearch && matchesDate;
    });

    const totalRevenue = filteredSales.reduce((sum, sale) => sum + (sale.total || 0), 0);
    const totalCount = filteredSales.length;

    return (
        <div className="sales-page-container">
            <header className="sales-header">
                <div>
                    <h1>Sales Report</h1>
                    <p className="sales-desc">
                        {new Date(dateRange.start).toLocaleDateString()} - {new Date(dateRange.end).toLocaleDateString()}
                    </p>
                </div>
                <div className="stats-container">
                    <div className="stat-card">
                        <div className="stat-label">Sales Count</div>
                        <div className="stat-value">{totalCount}</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon-wrapper">
                            <DollarSign size={16} />
                        </div>
                        <div>
                            <div className="stat-label">Total Revenue</div>
                            <div className="stat-value">${totalRevenue.toFixed(2)}</div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="sales-controls">
                <div className="date-inputs">
                    <div className="date-field">
                        <span>From:</span>
                        <input
                            type="date"
                            value={dateRange.start}
                            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                        />
                    </div>
                    <div className="date-field">
                        <span>To:</span>
                        <input
                            type="date"
                            value={dateRange.end}
                            onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                        />
                    </div>
                </div>

                <div className="search-field">
                    <Search className="search-icon" size={18} />
                    <input
                        type="text"
                        placeholder="Search by ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="sales-table-section">
                <div className="table-container">
                    <table className="sales-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Transaction ID</th>
                                <th>Items</th>
                                <th>Total</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSales.map((sale) => (
                                <tr key={sale.id}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <Calendar size={16} style={{ color: 'var(--text-secondary)' }} />
                                            {new Date(sale.date).toLocaleString()}
                                        </div>
                                    </td>
                                    <td style={{ fontFamily: 'monospace' }}>#{sale.id}</td>
                                    <td>
                                        {sale.items.length} items ({sale.items.map(i => i.name).join(', ').slice(0, 30)}{sale.items.length > 2 ? '...' : ''})
                                    </td>
                                    <td style={{ fontWeight: '700', color: 'var(--accent-primary)' }}>
                                        ${(sale.total || 0).toFixed(2)}
                                    </td>
                                    <td>
                                        <button
                                            className="btn-view"
                                            onClick={() => setSelectedSale(sale)}
                                        >
                                            View Invoice
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredSales.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="no-data">
                                        No sales found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>    {
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
        </div>
    );
};

export default Sales;
