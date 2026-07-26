import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import Layout from '../components/Layout';
import CategoryModal from '../components/CategoryModal';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../api/categories';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [error, setError] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await getCategories();
      setCategories(res.data);
    } catch (err) {
      console.error('Failed to load categories', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadData();
    }, []);

  const handleSave = async (data) => {
    if (editingCategory) {
      await updateCategory(editingCategory.id, data);
    } else {
      await createCategory(data);
    }
    await loadData();
  };

  const handleDelete = async (id) => {
    setError('');
    if (!confirm('Delete this category?')) return;
    try {
      await deleteCategory(id);
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete category');
    }
  };

  const openAddModal = () => {
    setEditingCategory(null);
    setModalOpen(true);
  };

  const openEditModal = (category) => {
    setEditingCategory(category);
    setModalOpen(true);
  };

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Categories</h1>
          <p className="text-gray-400 text-sm">Manage your expense categories</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-medium text-sm transition"
        >
          <Plus size={16} />
          Add Category
        </button>
      </div>

      {error && (
        <div className="mb-4 px-4 py-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="bg-[#13131a] border border-[#2a2a38] rounded-xl overflow-hidden">
        {loading ? (
          <p className="text-gray-400 p-6">Loading...</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#2a2a38] text-left text-gray-500">
                <th className="p-4 font-medium">Category</th>
                <th className="p-4 font-medium">Type</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id} className="border-b border-[#2a2a38] last:border-0 hover:bg-white/[0.02]">
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{c.icon}</span>
                      <span className="font-medium">{c.name}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-md text-xs ${
                      c.preset ? 'bg-blue-500/10 text-blue-400' : 'bg-purple-500/10 text-purple-400'
                    }`}>
                      {c.preset ? 'Preset' : 'Custom'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(c)}
                        className="p-1.5 rounded-md text-gray-400 hover:bg-white/5 hover:text-purple-400 transition"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
                        disabled={c.preset}
                        className="p-1.5 rounded-md text-gray-400 hover:bg-white/5 hover:text-red-400 transition disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <CategoryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        category={editingCategory}
      />
    </Layout>
  );
}