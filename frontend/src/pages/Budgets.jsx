import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import Layout from '../components/Layout';
import BudgetModal from '../components/BudgetModal';
import ProgressBar from '../components/ProgressBar';
import { getBudgets, createBudget, updateBudget, deleteBudget } from '../api/budgets';
import { getCategories } from '../api/categories';

function currentMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

export default function Budgets() {
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [error, setError] = useState('');
  const month = currentMonth();

  const loadData = async () => {
    setLoading(true);
    try {
      const [budgetsRes, categoriesRes] = await Promise.all([
        getBudgets(month),
        getCategories(),
      ]);
      setBudgets(budgetsRes.data);
      setCategories(categoriesRes.data);
    } catch (err) {
      console.error('Failed to load budgets', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = async (data) => {
    setError('');
    try {
      if (editingBudget) {
        await updateBudget(editingBudget.id, data);
      } else {
        await createBudget(data);
      }
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save budget');
      throw err;
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this budget?')) return;
    await deleteBudget(id);
    await loadData();
  };

  const openAddModal = () => {
    setEditingBudget(null);
    setModalOpen(true);
  };

  const openEditModal = (budget) => {
    setEditingBudget(budget);
    setModalOpen(true);
  };

  // Categories that don't yet have a budget this month
  const availableCategories = categories.filter(
    (c) => !budgets.some((b) => b.categoryId === c.id)
  );

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Budgets</h1>
          <p className="text-gray-400 text-sm">Set monthly budget limits for categories</p>
        </div>
        <button
          onClick={openAddModal}
          disabled={availableCategories.length === 0}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-medium text-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus size={16} />
          Add Budget
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
        ) : budgets.length === 0 ? (
          <p className="text-gray-500 p-6">No budgets set for this month yet</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#2a2a38] text-left text-gray-500">
                <th className="p-4 font-medium">Category</th>
                <th className="p-4 font-medium">Budget</th>
                <th className="p-4 font-medium w-48">Progress</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {budgets.map((b) => (
                <tr key={b.id} className="border-b border-[#2a2a38] last:border-0 hover:bg-white/[0.02]">
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{b.categoryIcon}</span>
                      <span className="font-medium">{b.categoryName}</span>
                    </div>
                  </td>
                  <td className="p-4 text-gray-400">
                    ${b.spentAmount.toFixed(2)} / ${b.limitAmount.toFixed(2)}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <ProgressBar percent={b.percentUsed} exceeded={b.exceeded} />
                      <span className={`text-xs ${b.exceeded ? 'text-red-400' : 'text-gray-500'}`}>
                        {b.percentUsed.toFixed(0)}%
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(b)}
                        className="p-1.5 rounded-md text-gray-400 hover:bg-white/5 hover:text-purple-400 transition"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(b.id)}
                        className="p-1.5 rounded-md text-gray-400 hover:bg-white/5 hover:text-red-400 transition"
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

      <BudgetModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        categories={editingBudget ? categories : availableCategories}
        budget={editingBudget}
        month={month}
      />
    </Layout>
  );
}