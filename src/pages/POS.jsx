import { useState, useEffect } from 'react';
import './POS.css';
import { Search, Plus, Minus, Trash2, CreditCard } from 'lucide-react';

export default function POS() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [cart, setCart] = useState([]);
    const [search, setSearch] = useState('');
    const [showInvoice, setShowInvoice] = useState(false);
    const [lastSale, setLastSale] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        if (window.api) {
            const [productsData, categoriesData] = await Promise.all([
                window.api.getProducts(),
                window.api.getCategories()
            ]);
            setProducts(productsData || []);
            // Sort categories by sort_order
            const sortedCategories = (categoriesData || []).filter(c => c.is_active).sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
            setCategories(sortedCategories);
        }
    };

    const addToCart = (product) => {
        if (!product.stock || product.stock <= 0) {
            alert('Out of stock!');
            return;
        }
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                if (existing.quantity >= product.stock) {
                    alert('Not enough stock!');
                    return prev;
                }
                return prev.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const updateQuantity = (id, delta) => {
        setCart(prev => prev.map(item => {
            if (item.id === id) {
                const product = products.find(p => p.id === id);
                const newQty = Math.max(0, item.quantity + delta);

                if (delta > 0 && product && newQty > product.stock) {
                    alert('Not enough stock!');
                    return item;
                }

                return { ...item, quantity: newQty };
            }
            return item;
        }).filter(item => item.quantity > 0));
    };

    const removeFromCart = (id) => {
        setCart(prev => prev.filter(item => item.id !== id));
    };

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const handleCheckout = async () => {
        if (cart.length === 0) return;
        if (window.api) {
            try {
                const sale = await window.api.addSale({
                    items: cart,
                    total,
                    timestamp: Date.now()
                });
                setCart([]);
                setLastSale(sale);
                setShowInvoice(true);
                loadData(); // Reload to update stock
            } catch (error) {
                alert('Checkout failed: ' + error.message);
            }
        }
    };

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || p.categoryId === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="pos-container">
            <div className="products-section">
                <div className="filter-section">
                    <div className="search-bar">
                        <Search size={20} />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="category-tabs">
                        <button
                            className={`category-tab ${selectedCategory === 'all' ? 'active' : ''}`}
                            onClick={() => setSelectedCategory('all')}
                        >
                            All
                        </button>
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                className={`category-tab ${selectedCategory === cat.id ? 'active' : ''}`}
                                onClick={() => setSelectedCategory(cat.id)}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="products-grid">
                    {filteredProducts.map(product => (
                        <div key={product.id} className="product-card" onClick={() => addToCart(product)}>
                            <div className="product-image">
                                {product.image ? <img src={product.image} alt={product.name} /> : <div className="placeholder" />}
                            </div>
                            <div className="product-info">
                                <h3>{product.name}</h3>
                                <p>${product.price.toFixed(2)}</p>
                                <p className={`stock-info ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="cart-section">
                <h2>Current Order</h2>
                <div className="cart-items">
                    {cart.map(item => (
                        <div key={item.id} className="cart-item">
                            <div className="item-info">
                                <h4>{item.name}</h4>
                                <p>${item.price.toFixed(2)}</p>
                            </div>
                            <div className="item-controls">
                                <button onClick={() => updateQuantity(item.id, -1)}><Minus size={16} /></button>
                                <span>{item.quantity}</span>
                                <button onClick={() => updateQuantity(item.id, 1)}><Plus size={16} /></button>
                                <button className="delete-btn" onClick={() => removeFromCart(item.id)}><Trash2 size={16} /></button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="cart-footer">
                    <div className="total">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                    </div>
                    <button className="checkout-btn" onClick={handleCheckout} disabled={cart.length === 0}>
                        <CreditCard size={20} />
                        Checkout
                    </button>
                </div>
            </div>


            {
                showInvoice && lastSale && (
                    <div className="modal-overlay">
                        <div className="invoice-modal">
                            <div className="invoice-header">
                                <h2>Invoice</h2>
                                <p>Date: {new Date(lastSale.timestamp).toLocaleString()}</p>
                                <p>ID: {lastSale.id}</p>
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
                                        {lastSale.items.map((item, index) => (
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
                                <h3>Total: ${lastSale.total.toFixed(2)}</h3>
                            </div>
                            <div className="invoice-actions">
                                <button onClick={() => window.print()}>Print</button>
                                <button onClick={() => setShowInvoice(false)}>Close</button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
}
