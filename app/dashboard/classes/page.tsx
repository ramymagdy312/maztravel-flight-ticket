"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Tag,
  Plus,
  Pencil,
  Trash2,
  Check,
  X,
  Loader2,
} from "lucide-react";
import {
  getTicketClasses,
  addTicketClass,
  updateTicketClass,
  deleteTicketClass,
  type TicketClass,
} from "@/lib/settings-store";

export default function ClassesPage() {
  const [classes, setClasses] = useState<TicketClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const data = await getTicketClasses();
    setClasses(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleAdd = async () => {
    if (!newName.trim()) return;
    setAdding(true);
    const result = await addTicketClass(newName);
    if (result) {
      setClasses((prev) => [...prev, result].sort((a, b) => a.name.localeCompare(b.name)));
      setNewName("");
    }
    setAdding(false);
  };

  const handleUpdate = async (id: string) => {
    if (!editName.trim()) return;
    const ok = await updateTicketClass(id, editName);
    if (ok) {
      setClasses((prev) =>
        prev
          .map((c) => (c.id === id ? { ...c, name: editName.trim() } : c))
          .sort((a, b) => a.name.localeCompare(b.name))
      );
    }
    setEditingId(null);
    setEditName("");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this class?")) return;
    const ok = await deleteTicketClass(id);
    if (ok) {
      setClasses((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const startEdit = (cls: TicketClass) => {
    setEditingId(cls.id);
    setEditName(cls.name);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Add new */}
      <div className="bg-white rounded-xl border border-gray-200/80 p-6">
        <h3 className="text-base font-semibold text-gray-800 mb-4">Add New Class</h3>
        <div className="flex gap-3">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            placeholder="Class name..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
          />
          <button
            onClick={handleAdd}
            disabled={adding || !newName.trim()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            Add
          </button>
        </div>
      </div>

      {/* List */}
      <div className="bg-white rounded-xl border border-gray-200/80 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/80">
          <h3 className="text-sm font-semibold text-gray-600 flex items-center gap-2">
            <Tag className="w-4 h-4" />
            Ticket Classes ({classes.length})
          </h3>
        </div>

        {classes.length === 0 ? (
          <div className="p-8 text-center">
            <Tag className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No classes added yet</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {classes.map((cls) => (
              <li
                key={cls.id}
                className="flex items-center justify-between px-6 py-3 hover:bg-gray-50/50 transition-colors"
              >
                {editingId === cls.id ? (
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleUpdate(cls.id);
                        if (e.key === "Escape") setEditingId(null);
                      }}
                      autoFocus
                      className="flex-1 px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    />
                    <button
                      onClick={() => handleUpdate(cls.id)}
                      className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <span className="text-sm text-gray-800 font-medium">{cls.name}</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => startEdit(cls)}
                        className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(cls.id)}
                        className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
