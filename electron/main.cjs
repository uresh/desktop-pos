const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
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

// Database setup
let db;

async function initDB() {
    const { JSONFilePreset } = await import('lowdb/node');
    const defaultData = { products: [], sales: [], settings: {} };
    db = await JSONFilePreset('db.json', defaultData);
}

app.whenReady().then(async () => {
    await initDB();
    createWindow();

    app.on('activate', function () {
        if (mainWindow === null) createWindow();
    });
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});

// IPC Handlers
ipcMain.handle('get-products', async () => {
    await db.read();
    return db.data.products;
});

ipcMain.handle('add-product', async (event, product) => {
    await db.read();
    const newProduct = { ...product, id: Date.now() };
    db.data.products.push(newProduct);
    await db.write();
    return newProduct;
});

ipcMain.handle('update-product', async (event, product) => {
    await db.read();
    const index = db.data.products.findIndex(p => p.id === product.id);
    if (index !== -1) {
        db.data.products[index] = product;
        await db.write();
        return product;
    }
    return null;
});

ipcMain.handle('delete-product', async (event, id) => {
    await db.read();
    db.data.products = db.data.products.filter(p => p.id !== id);
    await db.write();
    return id;
});

ipcMain.handle('create-sale', async (event, sale) => {
    await db.read();
    const newSale = { ...sale, id: Date.now(), date: new Date().toISOString() };
    db.data.sales.push(newSale);
    await db.write();
    return newSale;
});

ipcMain.handle('get-sales', async () => {
    await db.read();
    return db.data.sales;
});

