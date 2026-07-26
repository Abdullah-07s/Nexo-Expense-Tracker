import { useState, useEffect } from 'react';
import Modal from './Modal';

const EMOJI_OPTIONS = ['🍔', '🚗', '💡', '🎬', '🛍️', '📦', '💊', '🎓', '✈️', '🏠', '🎮', '💰'];

export default function CategoryModal({ isOpen, onClose, onSave, category }) {
  const [form, setForm] = useState({ name: '', icon: '🍔' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
        if (category) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setForm({ name: category.name, icon: category.icon });
        } else {
            setForm({ name: '', icon: '🍔' });
        }
    }, [category, isOpen]);
    
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(form);
      onClose();
    } catch (err) {
      console.error('Failed to save category', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={category ? 'Edit Category' : 'Add New Category'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-300 mb-1.5">Name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Health"
            required
            className="w-full px-4 py-2.5 rounded-lg bg-[#1a1a24] border border-[#2a2a38] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-1.5">Icon</label>
          <div className="grid grid-cols-6 gap-2">
            {EMOJI_OPTIONS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => setForm({ ...form, icon: emoji })}
                className={`text-xl p-2 rounded-lg border transition ${
                  form.icon === emoji
                    ? 'border-purple-500 bg-purple-500/10'
                    : 'border-[#2a2a38] hover:bg-white/5'
                }`}
              >
                {emoji}
              </button>
            ))}
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
            {saving ? 'Saving...' : 'Save Category'}
          </button>
        </div>
      </form>
    </Modal>
  );
}