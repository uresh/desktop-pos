import { JSONFilePreset } from 'lowdb/node';
import path from 'path';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { app } = require('electron');

// Default data
const defaultData = {
    products: [],
    categories: [],
    sales: [],
    cart: [] // Optional, if we want to persist cart state
};

// Initialize DB
export const initDB = async () => {
    // Use userData directory for persistence
    const dbPath = path.join(app.getPath('userData'), 'db.json');
    const db = await JSONFilePreset(dbPath, defaultData);
    return db;
};
