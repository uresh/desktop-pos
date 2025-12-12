import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit } from 'lucide-react';
import './Products.css';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', price: '', image: '', stock: '', categoryId: '' });
  const [editingId, setEditingId] = useState(null);

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
      setCategories(categoriesData || []);
    }
  };

  const getCategoryName = (id) => {
    const category = categories.find(c => c.id === id);
    return category ? category.name : '-';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting product:', formData);

    if (window.api) {
      try {
        const productData = {
          ...formData,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock) || 0
        };

        if (editingId) {
          await window.api.editProduct({ ...productData, id: editingId });
        } else {
          await window.api.addProduct(productData);
        }

        setIsModalOpen(false);
        // Reset state after a short delay to ensure modal is closed
        setTimeout(() => {
          setFormData({ name: '', price: '', image: '', stock: '', categoryId: '' });
          setEditingId(null);
        }, 100);

        loadData();
        // Removed alert to prevent blocking the UI thread
        console.log(editingId ? 'Product updated successfully!' : 'Product saved successfully!');
      } catch (error) {
        console.error('Error saving product:', error);
        alert('Failed to save product: ' + error.message);
      }
    } else {
      console.warn('Window API not found. Are you running in Electron?');
      alert('Electron API not found. Please run in Electron to save data.');
    }
  };

  const handleEdit = (product) => {
    console.log('Editing product:', product);
    setEditingId(product.id);
    setFormData({
      name: product.name,
      price: product.price,
      image: product.image || '',
      stock: product.stock || 0,
      categoryId: product.categoryId || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this product?')) {
      if (window.api) {
        await window.api.deleteProduct(id);
        loadData();
      }
    }
  };

  return (
    <div className="products-page">
      <div className="page-header">
        <h2>Product Management</h2>
        <button className="add-btn" onClick={() => {
          setEditingId(null);
          setFormData({ name: '', price: '', image: '', stock: '', categoryId: '' });
          setIsModalOpen(true);
        }}>
          <Plus size={20} />
          Add Product
        </button>
      </div>

      <div className="products-table-container">
        <table className="products-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td>
                  <div className="table-image">
                    {product.image && <img src={product.image} alt={product.name} />}
                  </div>
                </td>
                <td>{product.name}</td>
                <td>{getCategoryName(product.categoryId)}</td>
                <td>${product.price.toFixed(2)}</td>
                <td>{product.stock || 0}</td>
                <td>
                  <div className="actions">
                    <button className="icon-btn edit" onClick={() => handleEdit(product)}>
                      <Edit size={18} />
                    </button>
                    <button className="icon-btn delete" onClick={() => handleDelete(product.id)}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal" key={editingId ? `edit-${editingId}` : 'add-new'}>
            <h3>{editingId ? 'Edit Product' : 'Add New Product'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Product Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select
                  value={formData.categoryId}
                  onChange={e => setFormData({ ...formData, categoryId: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    backgroundColor: 'var(--bg-primary)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--text-primary)',
                    outline: 'none'
                  }}
                >
                  <option value="">Select Category</option>
                  {categories.filter(c => c.is_active).map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.price}
                  onChange={e => setFormData({ ...formData, price: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Stock Quantity</label>
                <input
                  type="number"
                  required
                  value={formData.stock}
                  onChange={e => setFormData({ ...formData, stock: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Image URL (Optional)</label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={e => setFormData({ ...formData, image: e.target.value })}
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => {
                  setIsModalOpen(false);
                  setFormData({ name: '', price: '', image: '', stock: '' });
                  setEditingId(null);
                }}>Cancel</button>
                <button type="submit" className="submit-btn">{editingId ? 'Update Product' : 'Save Product'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
