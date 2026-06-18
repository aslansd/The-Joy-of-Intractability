import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, RefreshCw, Layers, Check } from 'lucide-react';

interface Cell {
  id: number;
  row: number;
  col: number;
  box: number;
  initialVal?: number;
  value?: number; // 1-4 represented as colors (Red, Green, Blue, Yellow)
}

const N_COLORS = {
  1: { name: 'Red', bg: 'bg-red-400', hover: 'bg-red-500', text: 'text-red-500 font-bold', colorHex: '#ee5555' },
  2: { name: 'Green', bg: 'bg-emerald-400', hover: 'bg-emerald-500', text: 'text-emerald-500 font-bold', colorHex: '#22cc88' },
  3: { name: 'Blue', bg: 'bg-indigo-400', hover: 'bg-indigo-500', text: 'text-indigo-500 font-bold', colorHex: '#5566ee' },
  4: { name: 'Yellow', bg: 'bg-amber-400', hover: 'bg-amber-500', text: 'text-amber-500 font-bold', colorHex: '#eebb22' }
};

interface ChapterNPCProps {
  onNext: () => void;
}

export default function ChapterNPC({ onNext }: ChapterNPCProps) {
  const [isReduced, setIsReduced] = useState(false);
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);

  // Simple 4x4 Sudoku preset
  const [cells, setCells] = useState<Cell[]>([
    { id: 0, row: 0, col: 0, box: 0, initialVal: 1, value: 1 },
    { id: 1, row: 0, col: 1, box: 0, initialVal: 2, value: 2 },
    { id: 2, row: 0, col: 2, box: 1, value: undefined },
    { id: 3, row: 0, col: 3, box: 1, value: undefined },

    { id: 4, row: 1, col: 0, box: 0, value: undefined },
    { id: 5, row: 1, col: 1, box: 0, value: undefined },
    { id: 6, row: 1, col: 2, box: 1, initialVal: 3, value: 3 },
    { id: 7, row: 1, col: 3, box: 1, value: undefined },

    { id: 8, row: 2, col: 0, box: 2, value: undefined },
    { id: 9, row: 2, col: 1, box: 2, initialVal: 4, value: 4 },
    { id: 10, row: 2, col: 2, box: 3, value: undefined },
    { id: 11, row: 2, col: 3, box: 3, value: undefined },

    { id: 12, row: 3, col: 0, box: 2, value: undefined },
    { id: 13, row: 3, col: 1, box: 2, value: undefined },
    { id: 14, row: 3, col: 2, box: 3, value: undefined },
    { id: 15, row: 3, col: 3, box: 3, initialVal: 1, value: 1 }
  ]);

  const cycleCellVal = (id: number) => {
    setCells(prev => prev.map(cell => {
      if (cell.id === id && !cell.initialVal) {
        const nextVal = cell.value === undefined ? 1 : cell.value === 4 ? undefined : cell.value + 1;
        return { ...cell, value: nextVal };
      }
      return cell;
    }));
  };

  const getCoordinates = (cell: Cell) => {
    if (!isReduced) {
      // Grid mode coordinate layout
      const gridOffset = 18;
      const spacing = 65;
      return {
        x: gridOffset + cell.col * spacing,
        y: gridOffset + cell.row * spacing
      };
    } else {
      // Graph circle layout coordinate
      const centerX = 145;
      const centerY = 145;
      const radius = 100;
      const angle = (2 * Math.PI * cell.id) / 16;
      return {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle)
      };
    }
  };

  // Helper to check constraints for currently hovered item
  const getConstrainedCells = (activeId: number): number[] => {
    const active = cells.find(c => c.id === activeId);
    if (!active) return [];
    return cells
      .filter(c => c.id !== activeId && (c.row === active.row || c.col === active.col || c.box === active.box))
      .map(c => c.id);
  };

  const activeConstraints = hoveredNode !== null ? getConstrainedCells(hoveredNode) : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Narrative block */}
      <div className="lg:col-span-5 space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold rounded-full tracking-wide">
          <Layers className="w-3.5 h-3.5" />
          CHAPTER 3: THE CHAMELEON (REDUCTION)
        </div>

        <h1 className="text-3.5xl font-extrabold tracking-tight text-slate-900 leading-none">
          NP-Hard & <span className="text-pink-600 underline decoration-wavy decoration-pink-300">NP-Complete</span>
        </h1>

        <div className="text-slate-600 space-y-4 text-[15px] leading-relaxed">
          <p>
            In the 1970s, computer scientists discovered somethng magical. Some NP problems are <strong>Chameleons</strong>. If you can solve just <em>one</em> of them quickly, you can instantly solve <em>all</em> of them!
          </p>
          <p>
            This process of translating one puzzle into another is called <strong>Reduction</strong>.
          </p>
          <p className="bg-pink-50/50 p-3.5 border-l-4 border-pink-500 rounded-r-lg text-[14px]">
            👉 <strong>Try it!</strong> Click <span className="font-bold text-pink-700">Animate Reduction!</span> to see the Sudoku puzzle morph into a Graph Coloring network. 
            <br /><strong>Hover over any node/cell</strong> to trace its connections.
          </p>
          <p>
            Sudoku is secretly just a Graph Coloring problem. Each cell is a Node, and cells in the same row, col, or box are connected by Edges so they can't share a color (number 1-4).
          </p>
        </div>

        <div className="pt-2">
          <button
            onClick={() => setIsReduced(prev => !prev)}
            className="px-5 py-3 bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-xl flex items-center gap-2 shadow-md shadow-pink-100 transition-transform duration-100 hover:-translate-y-0.5 cursor-pointer"
          >
            <Sparkles className="w-5 h-5 animate-spin" />
            {isReduced ? 'View as Sudoku Grid' : 'Animate Reduction!'}
          </button>
        </div>
      </div>

      {/* Interactives */}
      <div className="lg:col-span-7 flex flex-col items-center">
        <div className="w-full bg-white rounded-2xl border border-slate-200 p-6 shadow-sm relative select-none">
          <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-800 flex items-center gap-1.5 text-sm uppercase tracking-wider">
              {isReduced ? (
                <>
                  <span className="w-2.5 h-2.5 bg-pink-500 rounded-full animate-ping" />
                  Reduced Graph Coloring Representation
                </>
              ) : (
                <>
                  <span className="w-2.5 h-2.5 bg-slate-400 rounded-full" />
                  Classic 4x4 Sudoku Grid
                </>
              )}
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              Hover items to view edges
            </span>
          </div>

          {/* Morphing Arena */}
          <div className="flex justify-center py-4 bg-slate-50/50 rounded-2xl border border-slate-100 relative h-[350px]">
            <div className="relative w-[320px] h-[320px]">
              {/* Render glowing constraint edges for hovered node */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
                {hoveredNode !== null && activeConstraints.map((targetId) => {
                  const nodeU = cells.find(c => c.id === hoveredNode)!;
                  const nodeV = cells.find(c => c.id === targetId)!;
                  const uPos = getCoordinates(nodeU);
                  const vPos = getCoordinates(nodeV);

                  return (
                    <line
                      key={`edge-${hoveredNode}-${targetId}`}
                      x1={uPos.x + 20}
                      y1={uPos.y + 20}
                      x2={vPos.x + 20}
                      y2={vPos.y + 20}
                      stroke={isReduced ? '#f43f5e' : '#64748b'}
                      strokeWidth={isReduced ? '3' : '2'}
                      strokeDasharray={isReduced ? 'none' : '4 4'}
                    />
                  );
                })}
              </svg>

              {/* Grid partition bounds (only shown in Sudoku mode) */}
              {!isReduced && (
                <div className="absolute inset-[15px] pointer-events-none border border-slate-200">
                  <div className="absolute left-1/2 top-0 bottom-0 border-r-2 border-slate-700" />
                  <div className="absolute top-1/2 left-0 right-0 border-b-2 border-slate-700" />
                </div>
              )}

              {/* Render morphing cells */}
              {cells.map((cell) => {
                const pos = getCoordinates(cell);
                const isHovered = hoveredNode === cell.id;
                const isConstrained = activeConstraints.includes(cell.id);
                const valueMeta = cell.value ? N_COLORS[cell.value as 1 | 2 | 3 | 4] : null;

                return (
                  <motion.div
                    key={cell.id}
                    layout
                    transition={{ type: 'spring', stiffness: 180, damping: 20 }}
                    style={{
                      position: 'absolute',
                      left: pos.x,
                      top: pos.y,
                      width: 40,
                      height: 40,
                    }}
                    onMouseEnter={() => setHoveredNode(cell.id)}
                    onMouseLeave={() => setHoveredNode(null)}
                    onClick={() => cycleCellVal(cell.id)}
                    className={`rounded-lg flex items-center justify-center font-bold text-sm cursor-pointer shadow-sm select-none border transition-all duration-150 relative z-20
                      ${valueMeta 
                        ? `${isReduced ? valueMeta.bg : 'bg-white border-slate-300 text-slate-800'} ${isHovered ? 'scale-110 z-30 ring-2 ring-pink-500' : ''}` 
                        : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-300'}
                      ${isConstrained ? (isReduced ? 'ring-1 ring-pink-300 scale-105 bg-pink-50' : 'bg-slate-100 ring-1 ring-slate-400') : ''}
                      ${isHovered ? 'scale-115 ring-2 ring-indigo-500 z-30' : ''}`}
                  >
                    {isReduced ? (
                      // Graph Coloring view shows colored circles
                      <div className={`w-6 h-6 rounded-full border border-white/45 shadow-inner flex items-center justify-center text-[10px] text-white`}>
                        {cell.value ? '' : '?'}
                      </div>
                    ) : (
                      // Sudoku Grid view shows text values
                      <div className="flex flex-col items-center">
                        <span className={cell.initialVal ? 'text-slate-900 font-extrabold' : 'text-slate-500 font-medium'}>
                          {cell.value || ''}
                        </span>
                        {cell.value && (
                          <div className={`w-1.5 h-1.5 rounded-full ${valueMeta?.bg} mt-0.5`} />
                        )}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Description of constraints */}
          <div className="mt-4 bg-slate-50 rounded-xl p-3 border border-slate-100 text-xs text-slate-600 flex flex-col justify-center min-h-[44px]">
            {hoveredNode !== null ? (
              <div>
                Selected Item <strong className="font-mono text-slate-800 bg-slate-200 px-1.5 rounded-md">#{hoveredNode}</strong> at Row {cells[hoveredNode].row + 1}, Col {cells[hoveredNode].col + 1} imposes <strong className="text-pink-600 font-bold">{activeConstraints.length} constraint connections</strong> in graph coloring!
              </div>
            ) : (
              <div className="text-center font-semibold text-slate-500 animate-pulse">
                💡 Hover over any node or Sudoku cell to show reduction connections!
              </div>
            )}
          </div>
        </div>

        <div className="w-full mt-4 bg-slate-50 border border-slate-150 p-4 rounded-xl text-xs text-slate-500 text-center flex flex-col items-center gap-1">
          <span>
            💫 <strong>NP-Complete (The Chameleon Class)</strong> is amazing:
          </span>
          <span className="font-bold text-slate-700 bg-white px-2 py-0.5 border border-slate-150 rounded-full mt-1.5">
            Sudoku • Traveling Salesperson • Protein Folding • Circuit Design
          </span>
        </div>

        <div className="w-full flex justify-end mt-6">
          <button
            onClick={onNext}
            className="px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-xl flex items-center gap-2 shadow-md shadow-pink-150 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
          >
            The Ultimate Mystery: Does P equal NP?
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
