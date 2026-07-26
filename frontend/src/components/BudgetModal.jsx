import { useState, useEffect } from 'react';
import Modal from './Modal';

function currentMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

export default function BudgetModal({ isOpen, onClose, onSave, categories, budget, month }) {
  const [form, setForm] = useState({ categoryId: '', limitAmount: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
        if (budget) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setForm({ categoryId: budget.categoryId, limitAmount: budget.limitAmount });
        } else {
            setForm({ categoryId: categories[0]?.id || '', limitAmount: '' });
        }
    }, [budget, categories, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave({
        categoryId: parseInt(form.categoryId, 10),
        limitAmount: parseFloat(form.limitAmount),
        month: month || currentMonth(),
      });
      onClose();
    } catch (err) {
      console.error('Failed to save budget', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={budget ? 'Edit Budget' : 'Add New Budget'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-300 mb-1.5">Category</label>
          <select
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            required
            disabled={!!budget}
            className="w-full px-4 py-2.5 rounded-lg bg-[#1a1a24] border border-[#2a2a38] text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition disabled:opacity-50"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.icon} {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-1.5">Monthly Limit</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={form.limitAmount}
              onChange={(e) => setForm({ ...form, limitAmount: e.target.value })}
              placeholder="500.00"
              required
              className="w-full pl-8 pr-4 py-2.5 rounded-lg bg-[#1a1a24] border border-[#2a2a38] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
            />
          </div>
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
            {saving ? 'Saving...' : 'Save Budget'}
          </button>
        </div>
      </form>
    </Modal>
  );
}