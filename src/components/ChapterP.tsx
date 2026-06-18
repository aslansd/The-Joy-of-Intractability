import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Truck, Home, Sparkles, RefreshCw, Layers } from 'lucide-react';

interface ChapterPProps {
  onNext: () => void;
}

export default function ChapterP({ onNext }: ChapterPProps) {
  const [gridSize, setGridSize] = useState<number>(10);
  const [start, setStart] = useState<[number, number]>([1, 1]);
  const [end, setEnd] = useState<[number, number]>([8, 8]);
  const [walls, setWalls] = useState<Set<string>>(
    new Set([
      '3,3', '3,4', '3,5', '3,6',
      '6,3', '6,4', '6,5', '6,6',
      '4,6', '5,6'
    ])
  );
  const [dragType, setDragType] = useState<'start' | 'end' | 'draw' | 'erase' | null>(null);
  const [path, setPath] = useState<[number, number][]>([]);
  const [operations, setOperations] = useState<number>(0);

  // Compute the shortest path whenever parameters change
  useEffect(() => {
    const queue: [number, number][] = [[start[0], start[1]]];
    const visited = new Set<string>();
    visited.add(`${start[0]},${start[1]}`);

    const parent: { [key: string]: [number, number] } = {};
    const directions = [
      [-1, 0], [1, 0], [0, -1], [0, 1]
    ];

    let found = false;
    let ops = 0;

    while (queue.length > 0) {
      const current = queue.shift()!;
      ops++;
      const [r, c] = current;

      if (r === end[0] && c === end[1]) {
        found = true;
        break;
      }

      for (const [dr, dc] of directions) {
        const nr = r + dr;
        const nc = c + dc;
        const key = `${nr},${nc}`;

        if (
          nr >= 0 &&
          nr < gridSize &&
          nc >= 0 &&
          nc < gridSize &&
          !walls.has(key) &&
          !visited.has(key)
        ) {
          visited.add(key);
          parent[key] = current;
          queue.push([nr, nc]);
        }
      }
    }

    setOperations(ops);

    if (found) {
      const reconstructedPath: [number, number][] = [];
      let curr: [number, number] | undefined = end;
      while (curr) {
        reconstructedPath.push(curr);
        const key = `${curr[0]},${curr[1]}`;
        curr = parent[key];
      }
      setPath(reconstructedPath.reverse());
    } else {
      setPath([]);
    }
  }, [gridSize, start, end, walls]);

  const handleCellInteraction = (row: number, col: number, isMouseDown: boolean) => {
    const key = `${row},${col}`;
    if (row === start[0] && col === start[1]) {
      if (isMouseDown) setDragType('start');
      return;
    }
    if (row === end[0] && col === end[1]) {
      if (isMouseDown) setDragType('end');
      return;
    }

    if (isMouseDown) {
      const isWall = walls.has(key);
      const newWalls = new Set(walls);
      if (isWall) {
        newWalls.delete(key);
        setDragType('erase');
      } else {
        newWalls.add(key);
        setDragType('draw');
      }
      setWalls(newWalls);
    } else if (dragType === 'draw' || dragType === 'erase') {
      const newWalls = new Set(walls);
      if (dragType === 'draw') {
        newWalls.add(key);
      } else {
        newWalls.delete(key);
      }
      setWalls(newWalls);
    } else if (dragType === 'start') {
      if (!walls.has(key) && !(row === end[0] && col === end[1])) {
        setStart([row, col]);
      }
    } else if (dragType === 'end') {
      if (!walls.has(key) && !(row === start[0] && col === start[1])) {
        setEnd([row, col]);
      }
    }
  };

  const handleMouseUp = () => {
    setDragType(null);
  };

  const resetWalls = () => {
    setWalls(new Set());
  };

  const loadPresetMaze = () => {
    const preset = new Set<string>();
    for (let i = 0; i < gridSize; i++) {
      if (i !== 2 && i !== 7) preset.add(`${4},${i}`);
      if (i !== 1 && i !== 8) preset.add(`${7},${i}`);
    }
    setWalls(preset);
    setStart([1, 1]);
    setEnd([gridSize - 2, gridSize - 2]);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" onMouseUp={handleMouseUp}>
      {/* Narrative Section */}
      <div className="lg:col-span-5 space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold rounded-full tracking-wide">
          <Layers className="w-3.5 h-3.5" />
          CHAPTER 1: THE FAST & THE EASY
        </div>

        <h1 className="text-3.5xl font-extrabold tracking-tight text-slate-900 leading-none">
          What is <span className="text-emerald-600 underline decoration-wavy decoration-emerald-300">P</span>?
        </h1>

        <div className="text-slate-600 space-y-4 text-[15px] leading-relaxed">
          <p>
            Meet <strong>Dusty the delivery truck</strong>. His job is to find the quickest route to the Customer's house. 
          </p>
          <p className="bg-lime-50/50 p-3.5 border-l-4 border-lime-500 rounded-r-lg text-[14px]">
            👉 <strong>Try it!</strong> Click and drag to draw walls. Or drag 
            <span className="inline-flex items-center gap-1 mx-1 px-1 bg-white border border-slate-200 rounded text-emerald-600 font-semibold"><Truck className="w-3.5 h-3.5" /> Dusty</span> 
            or <span className="inline-flex items-center gap-1 mx-1 px-1 bg-white border border-slate-200 rounded text-orange-600 font-semibold"><Home className="w-3.5 h-3.5" /> Customer</span>.
          </p>
          <p>
            No matter how chaotic your maze gets, the computer solves it instantly. This algorithm runs in <strong>Polynomial Time</strong>, or simply: <strong className="text-emerald-600">P</strong>.
          </p>
          <p>
            For a city of size <strong className="font-mono text-slate-800 bg-slate-100 px-1 rounded">N × N</strong>, finding the path takes at most a small multiple of <strong className="font-mono text-slate-800 bg-slate-100 px-1 rounded">N²</strong> steps. If the city size doubles, the work only quadruples. Easy peasy!
          </p>
        </div>

        <div className="pt-4 flex flex-wrap gap-3">
          <button
            onClick={() => {
              if (gridSize === 10) {
                setGridSize(15);
                setStart([1, 1]);
                setEnd([13, 13]);
                setWalls(new Set(['5,5', '5,6', '10,10']));
              } else {
                setGridSize(10);
                setStart([1, 1]);
                setEnd([8, 8]);
                setWalls(new Set(['3,3', '3,4', '3,5', '6,6']));
              }
            }}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-semibold text-xs rounded-lg transition-transform duration-100 hover:-translate-y-0.5 cursor-pointer"
          >
            Switch to {gridSize === 10 ? '15x15' : '10x10'} Grid
          </button>

          <button
            onClick={loadPresetMaze}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-semibold text-xs rounded-lg transition-transform duration-100 hover:-translate-y-0.5 cursor-pointer"
          >
            Load Maze
          </button>

          <button
            onClick={resetWalls}
            className="px-3 py-1.5 hover:bg-slate-100 text-slate-500 font-semibold text-xs rounded-lg flex items-center gap-1 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Clear Walls
          </button>
        </div>
      </div>

      {/* Interactive Grid Simulation */}
      <div className="lg:col-span-7 flex flex-col items-center">
        <div className="w-full bg-white rounded-2xl border border-slate-200 p-6 shadow-sm relative overflow-hidden select-none">
          <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-800 flex items-center gap-1.5 text-sm uppercase tracking-wider">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
              Live City Network Simulator
            </h3>
            <div className="flex gap-4 text-xs font-mono text-slate-500">
              <div>Size: <span className="text-slate-800 font-bold">{gridSize}x{gridSize}</span></div>
              <div>Visits: <span className="text-slate-800 font-bold">{operations}</span></div>
              <div>Time: <span className="text-emerald-600 font-bold">&lt; 0.5ms</span></div>
            </div>
          </div>

          <div 
            className="grid gap-1 bg-slate-50 p-2.5 rounded-xl border border-slate-150 TouchScrollPrevent"
            style={{
              gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
              aspectRatio: '1/1'
            }}
          >
            {Array.from({ length: gridSize }).map((_, r) =>
              Array.from({ length: gridSize }).map((_, c) => {
                const key = `${r},${c}`;
                const isStart = start[0] === r && start[1] === c;
                const isEnd = end[0] === r && end[1] === c;
                const isWall = walls.has(key);
                const isPath = path.some(([pr, pc]) => pr === r && pc === c) && !isStart && !isEnd;

                let cellBg = 'bg-white hover:bg-slate-50';
                if (isWall) cellBg = 'bg-slate-700 shadow-inner scale-95 border-none';
                if (isPath) cellBg = 'bg-emerald-50 border-emerald-100';

                return (
                  <div
                    key={key}
                    id={`cell-${r}-${c}`}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleCellInteraction(r, c, true);
                    }}
                    onMouseEnter={() => {
                      if (dragType) {
                        handleCellInteraction(r, c, false);
                      }
                    }}
                    className={`relative rounded-md border border-slate-100 flex items-center justify-center cursor-pointer transition-all duration-150 group ${cellBg}`}
                  >
                    {isStart && (
                      <motion.div
                        layoutId="truck"
                        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                        className="absolute inset-0 flex items-center justify-center text-emerald-600 p-0.5 bg-emerald-100 rounded-md shadow-sm border border-emerald-300"
                      >
                        <Truck className="w-5 h-5 sm:w-6 sm:h-6" />
                      </motion.div>
                    )}

                    {isEnd && (
                      <motion.div
                        layoutId="home"
                        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                        className="absolute inset-0 flex items-center justify-center text-orange-600 p-0.5 bg-orange-100 rounded-md shadow-sm border border-orange-300"
                      >
                        <Home className="w-5 h-5 sm:w-6 sm:h-6 animate-bounce" />
                      </motion.div>
                    )}

                    {isPath && (
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 border border-emerald-500 shadow-sm" />
                    )}
                  </div>
                );
              })
            )}
          </div>

          <AnimatePresence>
            {path.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute inset-x-6 bottom-6 bg-red-50 text-red-800 text-xs py-2 px-3 rounded-lg border border-red-200 text-center font-semibold"
              >
                🚨 Dusty is blocked! Tear down some walls to clear a path.
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="w-full mt-4 bg-slate-50 border border-slate-150 p-4 rounded-xl text-xs text-slate-500 text-center flex flex-col items-center gap-1">
          <span>
            💡 <strong>P (Polynomial Time)</strong> includes everything computers do comfortably:
          </span>
          <span className="font-bold text-slate-700 bg-white px-2 py-0.5 border border-slate-150 rounded-full mt-1.5">
            Searching web pages • Sorting profiles • Chatting over the network
          </span>
        </div>

        <div className="w-full flex justify-end mt-6">
          <button
            onClick={onNext}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center gap-2 shadow-md shadow-emerald-150 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
          >
            But what if finding is hard? Let's check NP!
            <Sparkles className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
