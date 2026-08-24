import React, { useEffect, useState } from 'react';
import { useTheme } from '../../../theme/ThemeContext';
import api from '../../../api/axiosClient';
import AdminNavbar from './AdminNavbar';
import { Plus, Pencil, X, AlertCircle, CheckCircle2, LayoutGrid } from 'lucide-react';

const EMPTY_FORM = { catName: '', description: '', customerPrice: '', workerPayout: '', isActive: true };

export default function AdminDashboard() {
  const { mode, theme: t } = useTheme();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadCategories = () => {
    setLoading(true);
    api.get('/Categories')
      .then((res) => setCategories(res.data || []))
      .catch(() => setError('Could not load categories.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormOpen(true);
    setError('');
  };

  const openEdit = (cat) => {
    setEditingId(cat.id);
    setForm({
      catName: cat.catName,
      description: cat.description || '',
      customerPrice: cat.customerPrice,
      workerPayout: cat.workerPayout,
      isActive: cat.isActive,
    });
    setFormOpen(true);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    const payload = {
      catName: form.catName,
      description: form.description,
      customerPrice: Number(form.customerPrice),
      workerPayout: Number(form.workerPayout),
      isActive: form.isActive,
    };

    try {
      if (editingId) {
        await api.put(`/Categories/${editingId}`, payload);
        setSuccess('Category updated.');
      } else {
        await api.post('/Categories', payload);
        setSuccess('Category created.');
      }
      setFormOpen(false);
      loadCategories();
    } catch (err) {
      setError(err.response?.data?.message || (typeof err.response?.data === 'string' ? err.response.data : 'Could not save this category.'));
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (cat) => {
    setError('');
    try {
      await api.put(`/Categories/${cat.id}`, {
        catName: cat.catName,
        description: cat.description,
        customerPrice: cat.customerPrice,
        workerPayout: cat.workerPayout,
        isActive: !cat.isActive,
      });
      loadCategories();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update category status.');
    }
  };

  return (
    <div style={{ background: t.bg, color: t.text }} className="min-h-screen flex flex-col font-sans transition-colors duration-150">
      <AdminNavbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-8 py-8 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4 border-b pb-4" style={{ borderColor: t.border }}>
          <div>
            <div className="wd-mono text-[10px] font-bold uppercase tracking-wider" style={{ color: t.accent }}>
              PLATFORM CONFIGURATION
            </div>
            <h1 className="wd-display font-black text-2xl uppercase tracking-tight mt-0.5" style={{ color: t.text }}>
              Service Categories
            </h1>
          </div>
          <button
            type="button"
            onClick={openCreate}
            className="wd-mono text-xs font-bold px-4 py-2.5 flex items-center gap-2 cursor-pointer"
            style={{ background: t.accent, color: t.accentText, border: 'none' }}
          >
            <Plus size={14} /> NEW CATEGORY
          </button>
        </div>

        {error && (
          <div className="p-3 text-xs wd-mono border flex items-start gap-2" style={{
            background: mode === 'light' ? '#FEE2E2' : '#3B1818',
            borderColor: mode === 'light' ? '#F87171' : '#7F2323',
            color: mode === 'light' ? '#B91C1C' : '#FCA5A5',
          }}>
            <AlertCircle size={14} className="shrink-0 mt-0.5" /> <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3 text-xs wd-mono border flex items-start gap-2" style={{
            background: mode === 'light' ? '#DCFCE7' : '#143823',
            borderColor: mode === 'light' ? '#86EFAC' : '#1E6B3C',
            color: mode === 'light' ? '#15803D' : '#4ADE80',
          }}>
            <CheckCircle2 size={14} className="shrink-0 mt-0.5" /> <span>{success}</span>
          </div>
        )}

        {formOpen && (
          <form onSubmit={handleSubmit} className="border p-5 sm:p-6 space-y-4" style={{ background: t.surface, borderColor: t.accent }}>
            <div className="flex items-center justify-between">
              <h2 className="wd-display font-black text-base uppercase" style={{ color: t.text }}>
                {editingId ? 'Edit Category' : 'New Category'}
              </h2>
              <button type="button" onClick={() => setFormOpen(false)} className="p-1 cursor-pointer" style={{ color: t.muted }}>
                <X size={16} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs wd-mono uppercase font-semibold mb-1.5" style={{ color: t.muted }}>Category Name</label>
                <input
                  required
                  value={form.catName}
                  onChange={(e) => setForm((p) => ({ ...p, catName: e.target.value }))}
                  className="w-full px-3 py-2.5 text-xs bg-transparent border outline-none"
                  style={{ borderColor: t.border, color: t.text }}
                />
              </div>

              <div className="flex items-end gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={form.isActive}
                  onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))}
                  className="w-4 h-4"
                />
                <label htmlFor="isActive" className="text-xs wd-mono font-semibold pb-0.5" style={{ color: t.text }}>
                  Active (visible to customers)
                </label>
              </div>

              <div>
                <label className="block text-xs wd-mono uppercase font-semibold mb-1.5" style={{ color: t.muted }}>Customer Price (₹)</label>
                <input
                  required
                  type="number"
                  min={0}
                  value={form.customerPrice}
                  onChange={(e) => setForm((p) => ({ ...p, customerPrice: e.target.value }))}
                  className="w-full px-3 py-2.5 text-xs bg-transparent border outline-none"
                  style={{ borderColor: t.border, color: t.text }}
                />
              </div>

              <div>
                <label className="block text-xs wd-mono uppercase font-semibold mb-1.5" style={{ color: t.muted }}>Worker Payout (₹)</label>
                <input
                  required
                  type="number"
                  min={0}
                  value={form.workerPayout}
                  onChange={(e) => setForm((p) => ({ ...p, workerPayout: e.target.value }))}
                  className="w-full px-3 py-2.5 text-xs bg-transparent border outline-none"
                  style={{ borderColor: t.border, color: t.text }}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs wd-mono uppercase font-semibold mb-1.5" style={{ color: t.muted }}>Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                rows={2}
                className="w-full px-3 py-2.5 text-xs bg-transparent border outline-none resize-none"
                style={{ borderColor: t.border, color: t.text }}
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="wd-mono text-xs font-bold px-6 py-2.5 cursor-pointer disabled:opacity-50"
              style={{ background: t.accent, color: t.accentText, border: 'none' }}
            >
              {saving ? 'SAVING...' : editingId ? 'UPDATE CATEGORY' : 'CREATE CATEGORY'}
            </button>
          </form>
        )}

        {loading ? (
          <div className="p-16 text-center wd-mono text-xs animate-pulse" style={{ color: t.muted }}>LOADING CATEGORIES...</div>
        ) : categories.length === 0 ? (
          <div className="border p-12 text-center space-y-2" style={{ background: t.surface, borderColor: t.border }}>
            <LayoutGrid size={20} className="mx-auto" style={{ color: t.muted }} />
            <p className="text-xs wd-mono" style={{ color: t.muted }}>No categories yet. Create your first service category above.</p>
          </div>
        ) : (
          <div className="border divide-y" style={{ background: t.surface, borderColor: t.border }}>
            {categories.map((cat) => (
              <div key={cat.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3" style={{ borderColor: t.border }}>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="wd-display font-black text-sm uppercase" style={{ color: t.text }}>{cat.catName}</span>
                    <span
                      className="wd-mono text-[10px] font-bold px-1.5 py-0.5 border"
                      style={{
                        borderColor: cat.isActive ? t.success : t.border,
                        color: cat.isActive ? t.success : t.muted,
                        background: cat.isActive ? (mode === 'light' ? '#DCFCE7' : '#143823') : t.cardHover,
                      }}
                    >
                      {cat.isActive ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                  </div>
                  <p className="text-xs mt-1 max-w-lg" style={{ color: t.muted }}>{cat.description || 'No description provided.'}</p>
                  <div className="wd-mono text-xs mt-1.5 flex gap-4" style={{ color: t.muted }}>
                    <span>Customer: <strong style={{ color: t.text }}>₹{cat.customerPrice}</strong></span>
                    <span>Payout: <strong style={{ color: t.text }}>₹{cat.workerPayout}</strong></span>
                  </div>
                </div>

                <div className="flex gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => openEdit(cat)}
                    className="wd-mono text-xs font-bold px-3 py-2 border flex items-center gap-1.5 cursor-pointer"
                    style={{ borderColor: t.border, color: t.text }}
                  >
                    <Pencil size={12} /> EDIT
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleActive(cat)}
                    className="wd-mono text-xs font-bold px-3 py-2 border cursor-pointer"
                    style={{ borderColor: t.border, color: t.muted }}
                  >
                    {cat.isActive ? 'DEACTIVATE' : 'ACTIVATE'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
