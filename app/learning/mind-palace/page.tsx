'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FaArrowLeft, FaPlus, FaTrash, FaMapPin } from 'react-icons/fa';
import GlassCard from '@/components/ui/GlassCard';

interface Item { id: string; label: string; desc: string; x: number; y: number; }

const ROOM_COLORS = ['from-amber-500 to-orange-600','from-teal-500 to-cyan-600','from-pink-500 to-rose-600'];
const ROOMS = ['Pintu Masuk','Ruang Tamu','Dapur'];

export default function MindPalacePage() {
  const [activeRoom, setActiveRoom] = useState(0);
  const [items, setItems] = useState<Record<number, Item[]>>({ 0:[], 1:[], 2:[] });
  const [newItem, setNewItem] = useState({ label:'', desc:'' });
  const [selected, setSelected] = useState<string | null>(null);

  function addItem() {
    if (!newItem.label.trim()) return;
    const item: Item = { id: Date.now().toString(), ...newItem, x: Math.random() * 70 + 5, y: Math.random() * 70 + 5 };
    setItems((prev) => ({ ...prev, [activeRoom]: [...(prev[activeRoom] ?? []), item] }));
    setNewItem({ label:'', desc:'' });
  }

  function removeItem(id: string) {
    setItems((prev) => ({ ...prev, [activeRoom]: prev[activeRoom].filter((i) => i.id !== id) }));
    if (selected === id) setSelected(null);
  }

  const roomItems = items[activeRoom] ?? [];
  const sel = roomItems.find((i) => i.id === selected);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 relative z-10">
      <Link href="/learning" className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary-600 mb-6"><FaArrowLeft /> Metode Belajar</Link>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-1">Mind Palace</h1>
        <p className="text-gray-500 text-sm">Tempatkan konsep dalam ruangan virtual dan ingat via lokasi spasial.</p>
      </div>

      {/* Room tabs */}
      <div className="flex gap-3 mb-6">
        {ROOMS.map((r, i) => (
          <button key={r} onClick={() => { setActiveRoom(i); setSelected(null); }}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${activeRoom === i ? `bg-gradient-to-r ${ROOM_COLORS[i]} text-white` : 'glass hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
            {r}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Room canvas */}
        <div className="lg:col-span-2">
          <GlassCard className="relative h-80 overflow-hidden" padding="p-0">
            <div className={`absolute inset-0 bg-gradient-to-br ${ROOM_COLORS[activeRoom]} opacity-10`} />
            {roomItems.map((item) => (
              <button key={item.id} onClick={() => setSelected(item.id === selected ? null : item.id)}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1 transition-all ${selected === item.id ? 'scale-110' : 'hover:scale-105'}`}
                style={{ left: `${item.x}%`, top: `${item.y}%` }}>
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${ROOM_COLORS[activeRoom]} flex items-center justify-center shadow-lg ${selected === item.id ? 'ring-4 ring-white/50' : ''}`}>
                  <FaMapPin className="text-white text-sm" />
                </div>
                <span className="text-xs font-medium glass px-2 py-0.5 rounded-full whitespace-nowrap">{item.label}</span>
              </button>
            ))}
            {roomItems.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
                Tambahkan item ke {ROOMS[activeRoom]}
              </div>
            )}
          </GlassCard>
        </div>

        {/* Side panel */}
        <div className="space-y-4">
          <GlassCard>
            <h3 className="font-bold mb-3 text-sm">Tambah Item</h3>
            <input value={newItem.label} onChange={(e) => setNewItem((f) => ({ ...f, label: e.target.value }))}
              placeholder="Nama konsep..." className="w-full px-3 py-2 glass rounded-xl border border-white/20 dark:border-gray-700 bg-transparent focus:outline-none text-sm mb-2" />
            <textarea value={newItem.desc} onChange={(e) => setNewItem((f) => ({ ...f, desc: e.target.value }))} rows={2}
              placeholder="Deskripsi..." className="w-full px-3 py-2 glass rounded-xl border border-white/20 dark:border-gray-700 bg-transparent focus:outline-none text-sm mb-3 resize-none" />
            <button onClick={addItem} className="w-full flex items-center justify-center gap-2 py-2 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-colors text-sm">
              <FaPlus /> Tambah ke Ruangan
            </button>
          </GlassCard>

          {sel && (
            <GlassCard>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-sm">{sel.label}</h3>
                <button onClick={() => removeItem(sel.id)} className="text-red-500 hover:text-red-600"><FaTrash className="text-xs" /></button>
              </div>
              <p className="text-sm text-gray-500">{sel.desc || 'Tidak ada deskripsi'}</p>
            </GlassCard>
          )}

          <GlassCard>
            <h3 className="font-bold mb-2 text-sm">Item di Ruangan ({roomItems.length})</h3>
            {roomItems.map((item) => (
              <div key={item.id} onClick={() => setSelected(item.id === selected ? null : item.id)}
                className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer mb-1 transition-colors ${selected === item.id ? 'bg-amber-50 dark:bg-amber-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                <FaMapPin className="text-amber-500 text-xs flex-shrink-0" />
                <span className="text-sm truncate">{item.label}</span>
              </div>
            ))}
            {roomItems.length === 0 && <p className="text-xs text-gray-400">Belum ada item</p>}
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
