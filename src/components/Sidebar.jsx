import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutGrid, ShoppingCart, Package, Settings, LogOut } from 'lucide-react';
import '../index.css'; // Ensure styles are available

const Sidebar = () => {
    const navItems = [
        { icon: <LayoutGrid size={20} />, label: 'POS', path: '/' },
        { icon: <Package size={20} />, label: 'Products', path: '/products' },
        { icon: <ShoppingCart size={20} />, label: 'Sales', path: '/sales' },
        { icon: <Settings size={20} />, label: 'Settings', path: '/settings' },
    ];

    return (
        <div className="h-screen w-64 bg-secondary border-r border-border-color flex flex-col justify-between p-4" style={{ backgroundColor: 'var(--bg-secondary)', borderRight: '1px solid var(--border-color)' }}>
            <div>
                <div className="flex items-center gap-2 mb-8 px-2">
                    <div className="w-8 h-8 rounded-lg bg-accent-primary flex items-center justify-center" style={{ backgroundColor: 'var(--accent-primary)' }}>
                        <ShoppingCart size={20} color="white" />
                    </div>
                    <h1 className="text-xl font-bold text-white" style={{ color: 'var(--text-primary)' }}>Nexus POS</h1>
                </div>

                <nav className="flex flex-col gap-2">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                                    ? 'bg-accent-primary text-white shadow-glow'
                                    : 'text-secondary hover:bg-tertiary hover:text-white'
                                }`
                            }
                            style={({ isActive }) => ({
                                backgroundColor: isActive ? 'var(--accent-primary)' : 'transparent',
                                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                                boxShadow: isActive ? 'var(--shadow-glow)' : 'none',
                            })}
                        >
                            {item.icon}
                            <span className="font-medium">{item.label}</span>
                        </NavLink>
                    ))}
                </nav>
            </div>

            <button className="flex items-center gap-3 px-4 py-3 rounded-lg text-danger hover:bg-tertiary transition-all duration-200 w-full" style={{ color: 'var(--danger)' }}>
                <LogOut size={20} />
                <span className="font-medium">Logout</span>
            </button>
        </div>
    );
};

export default Sidebar;
