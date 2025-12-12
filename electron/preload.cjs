const { contextBridge, ipcRenderer } = require('electron');

console.log('Preload script loaded');

contextBridge.exposeInMainWorld('api', {
    getProducts: () => ipcRenderer.invoke('get-products'),
    addProduct: (product) => ipcRenderer.invoke('add-product', product),
    editProduct: (product) => ipcRenderer.invoke('edit-product', product),
    deleteProduct: (id) => ipcRenderer.invoke('delete-product', id),
    addSale: (sale) => ipcRenderer.invoke('add-sale', sale),
    getSales: () => ipcRenderer.invoke('get-sales'),
    // Categories
    getCategories: () => ipcRenderer.invoke('get-categories'),
    addCategory: (category) => ipcRenderer.invoke('add-category', category),
    updateCategory: (category) => ipcRenderer.invoke('update-category', category),
    deleteCategory: (id) => ipcRenderer.invoke('delete-category', id),
});
