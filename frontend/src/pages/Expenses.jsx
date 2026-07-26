import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Filter } from 'lucide-react';
import Layout from '../components/Layout';
import ExpenseModal from '../components/ExpenseModal';
import { getExpenses, createExpense, updateExpense, deleteExpense } from '../api/expenses';
import { getCategories } from '../api/categories';

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [expensesRes, categoriesRes] = await Promise.all([
        getExpenses(categoryFilter ? { categoryId: categoryFilter } : {}),
        getCategories(),
      ]);
      setExpenses(expensesRes.data);
      setCategories(categoriesRes.data);
    } catch (err) {
      console.error('Failed to load expenses', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      loadData();
    }, [categoryFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSave = async (data) => {
    if (editingExpense) {
      await updateExpense(editingExpense.id, data);
    } else {
      await createExpense(data);
    }
    await loadData();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this expense?')) return;
    await deleteExpense(id);
    await loadData();
  };

  const openAddModal = () => {
    setEditingExpense(null);
    setModalOpen(true);
  };

  const openEditModal = (expense) => {
    setEditingExpense(expense);
    setModalOpen(true);
  };

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Expenses</h1>
          <p className="text-gray-400 text-sm">Track and manage your expenses</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-medium text-sm transition"
        >
          <Plus size={16} />
          Add Expense
        </button>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#13131a] border border-[#2a2a38] text-sm text-gray-400">
          <Filter size={14} />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-transparent focus:outline-none text-gray-200"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.icon} {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-[#13131a] border border-[#2a2a38] rounded-xl overflow-hidden">
        {loading ? (
          <p className="text-gray-400 p-6">Loading...</p>
        ) : expenses.length === 0 ? (
          <p className="text-gray-500 p-6">No expenses found</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#2a2a38] text-left text-gray-500">
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Description</th>
                <th className="p-4 font-medium">Category</th>
                <th className="p-4 font-medium text-right">Amount</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((e) => (
                <tr key={e.id} className="border-b border-[#2a2a38] last:border-0 hover:bg-white/[0.02]">
                  <td className="p-4 text-gray-400">{e.date}</td>
                  <td className="p-4 font-medium">{e.description}</td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/5 text-gray-300 text-xs">
                      {e.categoryIcon} {e.categoryName}
                    </span>
                  </td>
                  <td className="p-4 text-right font-medium text-red-400">-${e.amount.toFixed(2)}</td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(e)}
                        className="p-1.5 rounded-md text-gray-400 hover:bg-white/5 hover:text-purple-400 transition"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(e.id)}
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

      <ExpenseModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        categories={categories}
        expense={editingExpense}
      />
    </Layout>
  );
}