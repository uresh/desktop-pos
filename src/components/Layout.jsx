import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, Package, List, Settings, BarChart3 } from 'lucide-react';
import './Layout.css';

export default function Layout() {
    return (
        <div className="layout">
            <aside className="sidebar">
                <div className="logo">
                    <h1>POS</h1>
                </div>
                <nav>
                    <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>
                        <LayoutDashboard size={20} />
                        <span>Dashboard</span>
                    </NavLink>
                    <NavLink to="/pos">
                        <ShoppingCart size={20} />
                        <span>POS</span>
                    </NavLink>
                    <NavLink to="/products">
                        <Package size={20} />
                        <span>Products</span>
                    </NavLink>
                    <NavLink to="/categories">
                        <List size={20} />
                        <span>Categories</span>
                    </NavLink>

                    <div className="nav-label">Reports</div>
                    <NavLink to="/reports/sales">
                        <BarChart3 size={20} />
                        <span>Sales Report</span>
                    </NavLink>
                </nav>
                <div className="settings-link">
                    <NavLink to="/settings">
                        <Settings size={20} />
                        <span>Settings</span>
                    </NavLink>
                </div>
                <div style={{ padding: '1rem', fontSize: '0.8rem', color: window.api ? '#4ade80' : '#f87171' }}>
                    {window.api ? '● System Connected' : '● Browser Mode (No DB)'}
                </div>
            </aside>
            <main className="content">
                <Outlet />
            </main>
        </div >
    );
}
