import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, CheckCircle2, AlertCircle, RefreshCw, Key } from 'lucide-react';

interface Node {
  id: string;
  name: string;
  x: number;
  y: number;
  color?: 'red' | 'green' | 'blue';
}

interface Edge {
  u: string;
  v: string;
}

interface ChapterNPProps {
  onNext: () => void;
}

const COLOR_MAP = {
  red: { bg: 'bg-red-500 hover:bg-red-600', border: 'border-red-300 shadow-red-150', text: 'text-red-500 font-bold', hex: '#ef4444' },
  green: { bg: 'bg-emerald-500 hover:bg-emerald-600', border: 'border-emerald-300 shadow-emerald-150', text: 'text-emerald-500 font-bold', hex: '#10b981' },
  blue: { bg: 'bg-indigo-500 hover:bg-indigo-600', border: 'border-indigo-300 shadow-indigo-150', text: 'text-indigo-500 font-bold', hex: '#6366f1' },
};

export default function ChapterNP({ onNext }: ChapterNPProps) {
  // Let's create an elegant, solvable 6-node graph.
  const initialNodes: Node[] = [
    { id: 'A', name: 'Alamo', x: 150, y: 50 },
    { id: 'B', name: 'Baker', x: 260, y: 110 },
    { id: 'C', name: 'Clara', x: 240, y: 230 },
    { id: 'D', name: 'Delta', x: 120, y: 260 },
    { id: 'E', name: 'Echo', x: 40, y: 160 },
  ];

  const initialEdges: Edge[] = [
    { u: 'A', v: 'B' },
    { u: 'B', v: 'C' },
    { u: 'C', v: 'D' },
    { u: 'D', v: 'E' },
    { u: 'E', v: 'A' },
    { u: 'A', v: 'C' },
    { u: 'A', v: 'D' },
  ];

  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [conflictEdges, setConflictEdges] = useState<Set<string>>(new Set());
  const [allColored, setAllColored] = useState(false);
  const [isSolved, setIsSolved] = useState(false);
  const [selectedSolver, setSelectedSolver] = useState<'human' | 'computer'>('human');
  const [computerLogs, setComputerLogs] = useState<string[]>([]);
  const [computing, setComputing] = useState(false);

  // Check state whenever node coloring is updated
  useEffect(() => {
    const conflicts = new Set<string>();
    let complete = true;

    initialEdges.forEach((edge) => {
      const nodeU = nodes.find((n) => n.id === edge.u);
      const nodeV = nodes.find((n) => n.id === edge.v);

      if (nodeU && nodeV) {
        if (!nodeU.color || !nodeV.color) {
          complete = false;
        } else if (nodeU.color === nodeV.color) {
          conflicts.add(`${edge.u}-${edge.v}`);
          conflicts.add(`${edge.v}-${edge.u}`);
        }
      }
    });

    // Also check if any other nodes are uncolored
    if (nodes.some(n => !n.color)) {
      complete = false;
    }

    setConflictEdges(conflicts);
    setAllColored(complete);
    setIsSolved(complete && conflicts.size === 0);
  }, [nodes]);

  const cycleColor = (nodeId: string) => {
    if (computing) return;
    setNodes(prev => prev.map(node => {
      if (node.id === nodeId) {
        const nextColorMap: { [key: string]: 'red' | 'green' | 'blue' | undefined } = {
          undefined: 'red',
          'red': 'green',
          'green': 'blue',
          'blue': undefined
        };
        return {
          ...node,
          color: nextColorMap[String(node.color)]
        };
      }
      return node;
    }));
  };

  const resetGraph = () => {
    setNodes(initialNodes);
    setComputerLogs([]);
    setSelectedSolver('human');
    setComputing(false);
  };

  const solveInstantlyWithVerifications = async () => {
    setComputing(true);
    setComputerLogs([
      '⚡ Initiating graph 3-coloring brute solver...',
      '🔍 Attempt 1: Alamo=Red, Baker=Red... Edges A-B conflict! Rejecting.'
    ]);

    await new Promise(r => setTimeout(r, 600));
    setComputerLogs(prev => [...prev, '🔍 Attempt 2: Alamo=Red, Baker=Green, Clara=Green... Edges B-C conflict! Rejecting.']);

    await new Promise(r => setTimeout(r, 600));
    setComputerLogs(prev => [
      ...prev,
      '🔍 Attempt 3: Alamo=Red, Baker=Green, Clara=Blue, Delta=Green, Echo=Blue...',
      '✅ SUCCESS! Check all 7 connections: 0 conflicts found.'
    ]);

    setNodes([
      { id: 'A', name: 'Alamo', x: 150, y: 50, color: 'red' },
      { id: 'B', name: 'Baker', x: 260, y: 110, color: 'green' },
      { id: 'C', name: 'Clara', x: 240, y: 230, color: 'blue' },
      { id: 'D', name: 'Delta', x: 120, y: 260, color: 'green' },
      { id: 'E', name: 'Echo', x: 40, y: 160, color: 'blue' },
    ]);
    setComputing(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Descriptive side */}
      <div className="lg:col-span-5 space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold rounded-full tracking-wide">
          <Key className="w-3.5 h-3.5" />
          CHAPTER 2: THE MAGIC KEY
        </div>

        <h1 className="text-3.5xl font-extrabold tracking-tight text-slate-900 leading-none">
          What is <span className="text-indigo-600 underline decoration-wavy decoration-indigo-300">NP</span>?
        </h1>

        <div className="text-slate-600 space-y-4 text-[15px] leading-relaxed">
          <p>
            Some puzzles are extremely hard to <strong>solve</strong>, but if someone hands you the solution, it's a piece of cake to <strong>verify</strong>. That's the land of <strong className="text-indigo-600">NP</strong>.
          </p>
          <p className="bg-indigo-50/50 p-3.5 border-l-4 border-indigo-500 rounded-r-lg text-[14px]">
            👉 <strong>Try it!</strong> Click individual map nodes below to cycle their colors between <strong>Red</strong>, <strong>Green</strong>, and <strong>Blue</strong>. 
            <br /><strong className="text-indigo-900">Your Goal:</strong> Color the graph so that no connected cities have the same color.
          </p>
          <p>
            When you color correctly, checking the graph takes the computer <strong>less than 1 microsecond</strong> ($O(E)$ edges). No matter how big the graph gets, checking is instantaneous!
          </p>
          <p>
            But <strong>solving it</strong> from scratch requires guessing. With 5 nodes, there are $3^5 = 243$ possibilities. With 100 nodes, there are $3^{100}$ combinations—practically impossible to exhaustive search.
          </p>
        </div>

        <div className="pt-4 flex flex-wrap gap-3">
          <button
            onClick={() => {
              setSelectedSolver('computer');
              solveInstantlyWithVerifications();
            }}
            disabled={computing}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold text-xs rounded-lg transition-transform duration-100 hover:-translate-y-0.5 shadow-md shadow-indigo-100 cursor-pointer"
          >
            {computing ? 'Computer Solving...' : 'Let Computer Solve!'}
          </button>
          
          <button
            onClick={resetGraph}
            className="px-3 py-1.5 border border-slate-200 hover:bg-slate-100 text-slate-600 font-semibold text-xs rounded-lg flex items-center gap-1 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Start Over
          </button>
        </div>
      </div>

      {/* Simulator Side */}
      <div className="lg:col-span-7 flex flex-col items-center">
        <div className="w-full bg-white rounded-2xl border border-slate-200 p-6 shadow-sm relative overflow-hidden select-none">
          <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-800 flex items-center gap-1.5 text-sm uppercase tracking-wider">
              <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-pulse" />
              Graph 3-Coloring Machine
            </h3>
            <span className="font-mono text-xs text-slate-400">
              $N=5 \text{ nodes}, E=7 \text{ edges}$
            </span>
          </div>

          <div className="flex flex-col md:flex-row gap-6 items-center">
            {/* Interactive Graph Box */}
            <div className="relative w-[300px] h-[300px] bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center overflow-hidden">
              <svg className="absolute inset-0 w-full h-full">
                {/* Edges */}
                {initialEdges.map((edge, idx) => {
                  const nodeU = nodes.find((n) => n.id === edge.u)!;
                  const nodeV = nodes.find((n) => n.id === edge.v)!;
                  const isConflict = conflictEdges.has(`${edge.u}-${edge.v}`);

                  return (
                    <line
                      key={`${edge.u}-${edge.v}-${idx}`}
                      x1={nodeU.x}
                      y1={nodeU.y}
                      x2={nodeV.x}
                      y2={nodeV.y}
                      stroke={isConflict ? '#ef4444' : '#cbd5e1'}
                      strokeWidth={isConflict ? '4' : '2'}
                      className={isConflict ? 'animate-pulse' : ''}
                    />
                  );
                })}
              </svg>

              {/* Nodes */}
              {nodes.map((node) => {
                const isSelected = node.color !== undefined;
                const nodeColorMeta = node.color ? COLOR_MAP[node.color] : null;

                return (
                  <motion.button
                    key={node.id}
                    id={`node-${node.id}`}
                    onClick={() => cycleColor(node.id)}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.95 }}
                    style={{ left: node.x - 20, top: node.y - 20 }}
                    className={`absolute w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold text-xs shadow-md transition-colors cursor-pointer select-none
                      ${nodeColorMeta ? `${nodeColorMeta.bg} text-white ${nodeColorMeta.border}` : 'bg-white hover:bg-slate-100 border-slate-300 text-slate-700'}`}
                  >
                    {node.id}
                  </motion.button>
                );
              })}
            </div>

            {/* Verification Checklist */}
            <div className="flex-1 w-full flex flex-col gap-4 self-stretch justify-between">
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 space-y-3.5">
                <h4 className="font-bold text-xs text-slate-500 uppercase tracking-wider">
                  Verification Engine
                </h4>

                <div className="space-y-3">
                  <div className="flex items-center gap-2.5">
                    {nodes.every(n => n.color) ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-slate-300 shrink-0" />
                    )}
                    <span className="text-xs text-slate-700">All nodes assigned a color</span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    {conflictEdges.size === 0 && allColored ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    ) : conflictEdges.size > 0 ? (
                      <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-slate-300 shrink-0" />
                    )}
                    <span className="text-xs text-slate-700">No adjacent nodes share colors</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-150">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
                    <span>Checking efficiency:</span>
                    <span className="text-slate-800 font-bold">O(E) steps (7 operations)</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 mt-1">
                    <span>Verification speed:</span>
                    <span className="text-emerald-600 font-bold">0.001 milliseconds</span>
                  </div>
                </div>
              </div>

              {selectedSolver === 'computer' && (
                <div className="bg-slate-800 text-slate-300 rounded-xl p-3 font-mono text-[11px] space-y-1 h-[90px] overflow-y-auto shadow-inner border border-slate-900 leading-tight">
                  {computerLogs.map((log, i) => (
                    <div key={i} className={log.includes('✅') ? 'text-emerald-400 font-bold animate-pulse' : ''}>
                      {log}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <AnimatePresence>
            {isSolved && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="mt-4 p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl border border-emerald-200 text-center font-semibold flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-4 h-4 text-emerald-500" />
                Solved! Clicking verify confirms correctness instantly. This is why Graph Coloring is in NP!
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="w-full mt-4 bg-slate-50 border border-slate-150 p-4 rounded-xl text-xs text-slate-500 text-center flex flex-col items-center gap-1">
          <span>
            🔑 <strong>NP (Nondeterministic Polynomial Time)</strong> means:
          </span>
          <span className="font-bold text-slate-700 bg-white px-2 py-0.5 border border-slate-150 rounded-full mt-1.5">
            Hard to solve, but trivially easy to check when handed a key.
          </span>
        </div>

        <div className="w-full flex justify-end mt-6">
          <button
            onClick={onNext}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl flex items-center gap-2 shadow-md shadow-indigo-150 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
          >
            What is the hardest problem of all? Meet NP-Complete!
            <Sparkles className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
