"use client";

import { UtensilsCrossed, Plus, Image as ImageIcon, Trash2, Edit3, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useDashboard } from "../layout";
import toast from "react-hot-toast";

interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price?: string;
  category?: string;
  image?: string;
}

export default function MenuTab({ business }: { business: any }) {
  if (!business) return null;

  const [items, setItems] = useState<MenuItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", price: "", category: "" });

  const handleAdd = () => {
    if (!form.name.trim()) return toast.error("Item name is required");
    const newItem: MenuItem = { id: Date.now().toString(), ...form };
    setItems(prev => [...prev, newItem]);
    setForm({ name: "", description: "", price: "", category: "" });
    setShowForm(false);
    toast.success("Menu item added!");
  };

  const handleDelete = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
    toast.success("Item removed");
  };

  const categories = ["Starters", "Main Course", "Desserts", "Beverages", "Specials", "Snacks"];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-gray-900 dark:text-white">Menu</h2>
          <p className="text-gray-500 font-medium mt-1">Manage your products, dishes, or services.</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-6 py-2.5 bg-yellow-400 hover:bg-yellow-500 transition-colors rounded-xl font-bold text-black shadow-sm"
        >
          <Plus size={18} /> Add Item
        </button>
      </div>

      {/* Add Item Form */}
      {showForm && (
        <div className="bg-white dark:bg-[#242424] rounded-[28px] border border-gray-100 dark:border-gray-800 shadow-sm p-6 animate-in fade-in slide-in-from-top-4 duration-300">
          <h3 className="font-black text-gray-900 dark:text-white mb-5 flex items-center gap-2">
            <Plus size={18} className="text-yellow-500" /> New Menu Item
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Item Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                placeholder="e.g. Butter Chicken"
                className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Price</label>
              <input
                type="text"
                value={form.price}
                onChange={e => setForm(p => ({ ...p, price: e.target.value }))}
                placeholder="e.g. ₹299"
                className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Category</label>
              <select
                value={form.category}
                onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-yellow-400 transition-all"
              >
                <option value="">Select category</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Description</label>
              <input
                type="text"
                value={form.description}
                onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                placeholder="Short description..."
                className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30 transition-all"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-5">
            <button onClick={() => setShowForm(false)} className="px-5 py-2.5 rounded-xl font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#2a2a2a] transition-colors">Cancel</button>
            <button onClick={handleAdd} className="px-6 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-black font-bold rounded-xl transition-colors">Add Item</button>
          </div>
        </div>
      )}

      {/* Items by Category */}
      {items.length === 0 ? (
        <div className="bg-white dark:bg-[#242424] rounded-[28px] border border-gray-100 dark:border-gray-800 shadow-sm p-16 flex flex-col items-center justify-center text-center">
          <div className="bg-yellow-50 dark:bg-yellow-500/10 p-5 rounded-full text-yellow-500 mb-4">
            <UtensilsCrossed size={36} />
          </div>
          <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">No menu items yet</h3>
          <p className="text-gray-500 text-sm max-w-xs">Add your dishes, products or services to help customers know what you offer.</p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-6 flex items-center gap-2 px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-black font-bold rounded-xl transition-colors"
          >
            <Plus size={18} /> Add Your First Item
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Group by category */}
          {Array.from(new Set(items.map(i => i.category || "Uncategorized"))).map(cat => (
            <div key={cat} className="bg-white dark:bg-[#242424] rounded-[28px] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
                <UtensilsCrossed size={16} className="text-yellow-500" />
                <h3 className="font-black text-gray-900 dark:text-white">{cat}</h3>
                <span className="ml-auto text-xs font-bold text-gray-400 bg-gray-100 dark:bg-[#1a1a1a] px-2.5 py-1 rounded-full">
                  {items.filter(i => (i.category || "Uncategorized") === cat).length} items
                </span>
              </div>
              <div className="divide-y divide-gray-50 dark:divide-gray-800">
                {items.filter(i => (i.category || "Uncategorized") === cat).map(item => (
                  <div key={item.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50/50 dark:hover:bg-[#1a1a1a]/50 transition-colors group">
                    <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-[#1a1a1a] flex items-center justify-center shrink-0 text-gray-400">
                      <ImageIcon size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 dark:text-white text-sm">{item.name}</p>
                      {item.description && <p className="text-xs text-gray-500 truncate mt-0.5">{item.description}</p>}
                    </div>
                    {item.price && (
                      <span className="text-sm font-black text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 px-3 py-1 rounded-lg shrink-0">
                        {item.price}
                      </span>
                    )}
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 rounded-xl text-gray-300 dark:text-gray-600 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
