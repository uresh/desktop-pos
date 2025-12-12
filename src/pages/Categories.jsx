import { useState, useEffect } from 'react';
import './Categories.css';
import { Plus, Edit, Trash2 } from 'lucide-react';

export default function Categories() {
    const [categories, setCategories] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        is_active: true,
        sort_order: 0
    });

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        if (window.api) {
            const data = await window.api.getCategories();
            // Sort by sort_order
            const sorted = (data || []).sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
            setCategories(sorted);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (window.api) {
            try {
                if (editingCategory) {
                    await window.api.updateCategory({ ...formData, id: editingCategory.id });
                } else {
                    await window.api.addCategory(formData);
                }
                setShowModal(false);
                setEditingCategory(null);
                setFormData({ name: '', is_active: true, sort_order: 0 });
                loadCategories();
            } catch (error) {
                alert('Error processing category: ' + error.message);
            }
        }
    };

    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this category?')) {
            if (window.api) {
                await window.api.deleteCategory(id);
                loadCategories();
            }
        }
    };

    const handleEdit = (category) => {
        setEditingCategory(category);
        setFormData({
            name: category.name,
            is_active: category.is_active !== undefined ? category.is_active : true,
            sort_order: category.sort_order || 0
        });
        setShowModal(true);
    };

    const openAddModal = () => {
        setEditingCategory(null);
        setFormData({ name: '', is_active: true, sort_order: 0 });
        setShowModal(true);
    };

    return (
        <div className="categories-page">
            <div className="page-header">
                <h2>Category Management</h2>
                <button className="add-btn" onClick={openAddModal}>
                    <Plus size={20} />
                    Add Category
                </button>
            </div>

            <div className="categories-table-container">
                <table className="categories-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Sort Order</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map(category => (
                            <tr key={category.id}>
                                <td>{category.name}</td>
                                <td>{category.sort_order}</td>
                                <td>
                                    <span style={{
                                        color: category.is_active ? 'var(--success)' : 'var(--text-secondary)',
                                        fontWeight: 600
                                    }}>
                                        {category.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td>
                                    <button className="icon-btn" onClick={() => handleEdit(category)}>
                                        <Edit size={18} />
                                    </button>
                                    <button className="icon-btn delete" onClick={() => handleDelete(category.id)}>
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {categories.length === 0 && (
                            <tr>
                                <td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>
                                    No categories found. Add your first one!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>{editingCategory ? 'Edit Category' : 'Add New Category'}</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Category Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Sort Order</label>
                                <input
                                    type="number"
                                    value={formData.sort_order}
                                    onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                                />
                            </div>
                            <div className="form-group checkbox">
                                <input
                                    type="checkbox"
                                    id="is_active"
                                    checked={formData.is_active}
                                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                />
                                <label htmlFor="is_active">Active</label>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="submit-btn">
                                    {editingCategory ? 'Update' : 'Add'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
