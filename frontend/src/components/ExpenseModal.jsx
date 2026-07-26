import { useState, useEffect } from 'react';
import Modal from './Modal';

export default function ExpenseModal({ isOpen, onClose, onSave, categories, expense }) {
  const [form, setForm] = useState({
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    categoryId: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
      if (expense) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setForm({
          description: expense.description,
          amount: expense.amount,
          date: expense.date,
          categoryId: expense.categoryId,
        });
      } else {
        setForm({
          description: '',
          amount: '',
          date: new Date().toISOString().split('T')[0],
          categoryId: categories[0]?.id || '',
        });
      }
    }, [expense, categories, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave({
        description: form.description,
        amount: parseFloat(form.amount),
        date: form.date,
        categoryId: parseInt(form.categoryId, 10),
      });
      onClose();
    } catch (err) {
      console.error('Failed to save expense', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={expense ? 'Edit Expense' : 'Add New Expense'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-300 mb-1.5">Description</label>
          <input
            type="text"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Coffee with Alex"
            required
            className="w-full px-4 py-2.5 rounded-lg bg-[#1a1a24] border border-[#2a2a38] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-1.5">Category</label>
          <select
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            required
            className="w-full px-4 py-2.5 rounded-lg bg-[#1a1a24] border border-[#2a2a38] text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.icon} {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-1.5">Amount</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              placeholder="0.00"
              required
              className="w-full pl-8 pr-4 py-2.5 rounded-lg bg-[#1a1a24] border border-[#2a2a38] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-1.5">Date</label>
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            required
            className="w-full px-4 py-2.5 rounded-lg bg-[#1a1a24] border border-[#2a2a38] text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition [color-scheme:dark]"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-lg border border-[#2a2a38] text-gray-300 hover:bg-white/5 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-medium transition disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Expense'}
          </button>
        </div>
      </form>
    </Modal>
  );
}