import React from 'react';
import { Moon, Bell, Shield, Database } from 'lucide-react';

const Settings = () => {
    return (
        <div className="flex flex-col h-full gap-6">
            <header>
                <h1 className="text-2xl font-bold text-white" style={{ color: 'var(--text-primary)' }}>Settings</h1>
                <p className="text-secondary text-sm" style={{ color: 'var(--text-secondary)' }}>Manage application preferences</p>
            </header>

            <div className="flex flex-col gap-4">
                {/* Appearance Section */}
                <div className="bg-secondary p-6 rounded-xl border border-border-color" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
                    <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                        <Moon size={20} className="text-accent-primary" />
                        Appearance
                    </h2>
                    <div className="flex items-center justify-between py-2">
                        <div>
                            <p className="text-white font-medium" style={{ color: 'var(--text-primary)' }}>Dark Mode</p>
                            <p className="text-sm text-secondary" style={{ color: 'var(--text-secondary)' }}>Enable dark theme for the application</p>
                        </div>
                        <div className="w-12 h-6 bg-accent-primary rounded-full relative cursor-pointer" style={{ backgroundColor: 'var(--accent-primary)' }}>
                            <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                        </div>
                    </div>
                </div>

                {/* Notifications Section */}
                <div className="bg-secondary p-6 rounded-xl border border-border-color" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
                    <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                        <Bell size={20} className="text-accent-primary" />
                        Notifications
                    </h2>
                    <div className="flex items-center justify-between py-2 border-b border-border-color" style={{ borderColor: 'var(--border-color)' }}>
                        <div>
                            <p className="text-white font-medium" style={{ color: 'var(--text-primary)' }}>Sales Alerts</p>
                            <p className="text-sm text-secondary" style={{ color: 'var(--text-secondary)' }}>Get notified when a sale is completed</p>
                        </div>
                        <div className="w-12 h-6 bg-tertiary rounded-full relative cursor-pointer" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                            <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                        </div>
                    </div>
                    <div className="flex items-center justify-between py-2 mt-2">
                        <div>
                            <p className="text-white font-medium" style={{ color: 'var(--text-primary)' }}>Low Stock Warnings</p>
                            <p className="text-sm text-secondary" style={{ color: 'var(--text-secondary)' }}>Get notified when inventory is low</p>
                        </div>
                        <div className="w-12 h-6 bg-accent-primary rounded-full relative cursor-pointer" style={{ backgroundColor: 'var(--accent-primary)' }}>
                            <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                        </div>
                    </div>
                </div>

                {/* Data Management */}
                <div className="bg-secondary p-6 rounded-xl border border-border-color" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
                    <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                        <Database size={20} className="text-accent-primary" />
                        Data Management
                    </h2>
                    <div className="flex gap-4">
                        <button className="px-4 py-2 bg-tertiary text-white rounded-lg hover:bg-accent-primary transition-colors border border-border-color" style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-color)' }}>
                            Backup Data
                        </button>
                        <button className="px-4 py-2 bg-tertiary text-white rounded-lg hover:bg-accent-primary transition-colors border border-border-color" style={{ backgroundColor: 'var(--bg-tertiary)', borderColor: 'var(--border-color)' }}>
                            Export to CSV
                        </button>
                        <button className="px-4 py-2 text-danger hover:bg-tertiary rounded-lg transition-colors ml-auto" style={{ color: 'var(--danger)' }}>
                            Reset Database
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
