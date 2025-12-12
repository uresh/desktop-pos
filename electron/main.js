import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { app, BrowserWindow, ipcMain } = require('electron');
import path from 'path';
import { fileURLToPath } from 'url';
import { initDB } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;
let db;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.cjs'),
            contextIsolation: true,
            nodeIntegration: false,
        },
    });

    const startUrl = process.env.ELECTRON_START_URL || 'http://localhost:5173';

    if (app.isPackaged) {
        mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
    } else {
        mainWindow.loadURL(startUrl);
        mainWindow.webContents.openDevTools();
    }

    mainWindow.on('closed', function () {
        mainWindow = null;
    });
}

const ensureDbStructure = (data) => {
    data = data || {};
    data.products = data.products || [];
    data.categories = data.categories || [];
    data.sales = data.sales || [];
    data.cart = data.cart || [];
    return data;
};

app.whenReady().then(async () => {
    db = await initDB();
    createWindow();

    app.on('activate', function () {
        if (mainWindow === null) createWindow();
    });
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});

ipcMain.handle('get-categories', async () => {
    await db.read();
    db.data = ensureDbStructure(db.data);
    return db.data.categories;
});

ipcMain.handle('add-category', async (event, category) => {
    try {
        await db.read();
        db.data = ensureDbStructure(db.data);

        const newCategory = { ...category, id: Date.now().toString() };
        db.data.categories.push(newCategory);
        await db.write();
        return newCategory;
    } catch (error) {
        console.error('Failed to add category:', error);
        throw error;
    }
});

ipcMain.handle('update-category', async (event, category) => {
    try {
        await db.read();
        db.data = ensureDbStructure(db.data);

        const index = db.data.categories.findIndex(c => c.id === category.id);
        if (index !== -1) {
            db.data.categories[index] = { ...db.data.categories[index], ...category };
            await db.write();
            return db.data.categories[index];
        }
        throw new Error('Category not found');
    } catch (error) {
        console.error('Failed to update category:', error);
        throw error;
    }
});

ipcMain.handle('delete-category', async (event, id) => {
    try {
        await db.read();
        db.data = ensureDbStructure(db.data);

        db.data.categories = db.data.categories.filter(c => c.id !== id);
        // Optional: Reset category for products using this category?
        await db.write();
        return id;
    } catch (error) {
        console.error('Failed to delete category:', error);
        throw error;
    }
});

ipcMain.handle('get-products', async () => {
    await db.read();
    db.data = ensureDbStructure(db.data);
    return db.data.products;
});

ipcMain.handle('add-product', async (event, product) => {
    try {
        await db.read();
        db.data = ensureDbStructure(db.data);
        const newProduct = { ...product, id: Date.now().toString() };
        db.data.products.push(newProduct);
        await db.write();
        return newProduct;
    } catch (error) {
        console.error('Failed to add product:', error);
        throw error;
    }
});

ipcMain.handle('delete-product', async (event, id) => {
    await db.read();
    db.data = ensureDbStructure(db.data);
    db.data.products = db.data.products.filter(p => p.id !== id);
    await db.write();
    return id;
});

ipcMain.handle('edit-product', async (event, product) => {
    await db.read();
    db.data = ensureDbStructure(db.data);
    const index = db.data.products.findIndex(p => p.id === product.id);
    if (index !== -1) {
        db.data.products[index] = { ...db.data.products[index], ...product };
        await db.write();
        return db.data.products[index];
    }
    throw new Error('Product not found');
});

ipcMain.handle('add-sale', async (event, sale) => {
    await db.read();
    db.data = ensureDbStructure(db.data);

    // Check stock availability first
    for (const item of sale.items) {
        const product = db.data.products.find(p => p.id === item.id);
        if (!product || (product.stock || 0) < item.quantity) {
            throw new Error(`Insufficient stock for product: ${item.name}`);
        }
    }

    // Deduct stock
    for (const item of sale.items) {
        const product = db.data.products.find(p => p.id === item.id);
        if (product) {
            product.stock = (product.stock || 0) - item.quantity;
        }
    }

    const newSale = { ...sale, id: Date.now().toString(), date: new Date().toISOString() };
    db.data.sales.push(newSale);
    await db.write();
    return newSale;
});

ipcMain.handle('get-sales', async () => {
    await db.read();
    db.data = ensureDbStructure(db.data);
    return db.data.sales;
});
