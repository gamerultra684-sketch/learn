'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FaArrowLeft, FaPlus, FaTrash } from 'react-icons/fa';
import GlassCard from '@/components/ui/GlassCard';

interface Node { id: string; label: string; x: number; y: number; }
interface Edge { from: string; to: string; label: string; }

export default function DualCodingPage() {
  const [nodes, setNodes] = useState<Node[]>([
    { id: '1', label: 'Konsep Utama', x: 50, y: 50 },
  ]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [newLabel, setNewLabel] = useState('');
  const [selected, setSelected] = useState<string | null>(null);
  const [connecting, setConnecting] = useState<string | null>(null);

  function addNode() {
    if (!newLabel.trim()) return;
    const id = Date.now().toString();
    setNodes((n) => [...n, { id, label: newLabel, x: Math.random() * 60 + 10, y: Math.random() * 60 + 10 }]);
    setNewLabel('');
  }

  function selectNode(id: string) {
    if (connecting && connecting !== id) {
      setEdges((e) => [...e, { from: connecting, to: id, label: '' }]);
      setConnecting(null);
    } else {
      setSelected(id);
    }
  }

  function deleteNode(id: string) {
    setNodes((n) => n.filter((nd) => nd.id !== id));
    setEdges((e) => e.filter((ed) => ed.from !== id && ed.to !== id));
    if (selected === id) setSelected(null);
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 relative z-10">
      <Link href="/learning" className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary-600 mb-6"><FaArrowLeft /> Metode Belajar</Link>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-1">Visual Builder</h1>
        <p className="text-gray-500 text-sm">Buat peta konsep interaktif. Klik node untuk memilih, lalu klik &ldquo;Hubungkan&rdquo; untuk membuat koneksi.</p>
      </div>

      <div className="flex gap-3 mb-4">
        <input value={newLabel} onChange={(e) => setNewLabel(e.target.value)} placeholder="Nama konsep baru..."
          onKeyDown={(e) => e.key === 'Enter' && addNode()}
          className="flex-1 px-4 py-2 glass rounded-xl border border-white/20 dark:border-gray-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-pink-500" />
        <button onClick={addNode} className="flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-xl hover:bg-pink-700 transition-colors text-sm">
          <FaPlus /> Tambah Node
        </button>
        {selected && (
          <>
            <button onClick={() => setConnecting(selected)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors text-sm">
              {connecting === selected ? 'Pilih Target...' : 'Hubungkan'}
            </button>
            <button onClick={() => deleteNode(selected)}
              className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors text-sm">
              <FaTrash />
            </button>
          </>
        )}
      </div>

      {connecting && (
        <div className="mb-4 p-3 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-xl text-sm text-indigo-700 dark:text-indigo-400">
          Klik node tujuan untuk membuat koneksi dari &ldquo;{nodes.find((n) => n.id === connecting)?.label}&rdquo;
        </div>
      )}

      {/* Canvas */}
      <GlassCard className="relative h-96 overflow-hidden cursor-crosshair" padding="p-0">
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {edges.map((e, i) => {
            const from = nodes.find((n) => n.id === e.from);
            const to   = nodes.find((n) => n.id === e.to);
            if (!from || !to) return null;
            const x1 = `${from.x}%`, y1 = `${from.y}%`, x2 = `${to.x}%`, y2 = `${to.y}%`;
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#8b5cf6" strokeWidth="2" strokeDasharray="6,3" />;
          })}
        </svg>
        {nodes.map((nd) => (
          <div key={nd.id} onClick={() => selectNode(nd.id)}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer px-4 py-2 rounded-xl font-medium text-sm transition-all ${
              selected === nd.id ? 'bg-pink-500 text-white shadow-lg scale-110' :
              connecting === nd.id ? 'bg-indigo-500 text-white shadow-lg' :
              'glass hover:scale-105'
            }`}
            style={{ left: `${nd.x}%`, top: `${nd.y}%` }}>
            {nd.label}
          </div>
        ))}
        {nodes.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
            Tambahkan node untuk mulai membuat peta konsep
          </div>
        )}
      </GlassCard>

      <p className="text-xs text-gray-400 mt-2 text-center">{nodes.length} node • {edges.length} koneksi</p>
    </div>
  );
}
