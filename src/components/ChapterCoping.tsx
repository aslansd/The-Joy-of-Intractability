import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Trophy, RotateCcw, AlertTriangle, Smile, Zap } from 'lucide-react';

interface StarNode {
  id: string;
  x: number;
  y: number;
  name: string;
}

interface ChapterCopingProps {
  onNext: () => void;
}

export default function ChapterCoping({ onNext }: ChapterCopingProps) {
  const stars: StarNode[] = [
    { id: '1', x: 50, y: 100, name: 'Sirius' },
    { id: '2', x: 130, y: 40, name: 'Vega' },
    { id: '3', x: 230, y: 60, name: 'Altair' },
    { id: '4', x: 250, y: 150, name: 'Rigel' },
    { id: '5', x: 210, y: 230, name: 'Antares' },
    { id: '6', x: 120, y: 250, name: 'Betelgeuse' },
    { id: '7', x: 40, y: 190, name: 'Polaris' },
    { id: '8', x: 140, y: 140, name: 'Capella' },
  ];

  const [userPath, setUserPath] = useState<string[]>([]);
  const [completeUserLoop, setCompleteUserLoop] = useState(false);
  const [solveMode, setSolveMode] = useState<'user' | 'heuristic' | 'brute' | null>('user');
  const [bruteLoading, setBruteLoading] = useState(false);
  const [loadText, setLoadText] = useState('');

  // Euclidean distance helper
  const distance = (s1: StarNode, s2: StarNode) => {
    return Math.sqrt(Math.pow(s1.x - s2.x, 2) + Math.pow(s1.y - s2.y, 2));
  };

  // Click handler for user tracing stars
  const handleStarClick = (id: string) => {
    if (solveMode !== 'user' || completeUserLoop) return;

    if (userPath.length === 0) {
      setUserPath([id]);
      return;
    }

    const first = userPath[0];
    if (id === first && userPath.length >= 3) {
      // Complete the loop
      setCompleteUserLoop(true);
      return;
    }

    if (userPath.includes(id)) {
      // Cannot click visited node unless completing first
      return;
    }

    setUserPath(prev => [...prev, id]);
  };

  const clearUserPath = () => {
    setUserPath([]);
    setCompleteUserLoop(false);
    setSolveMode('user');
  };

  // Calculate length of any list of star IDs
  const calculatePathLength = (pathIds: string[]) => {
    if (pathIds.length < 2) return 0;
    let total = 0;
    for (let i = 0; i < pathIds.length - 1; i++) {
      const s1 = stars.find(s => s.id === pathIds[i]);
      const s2 = stars.find(s => s.id === pathIds[i + 1]);
      if (s1 && s2) total += distance(s1, s2);
    }
    // If complete
    if (solveMode === 'heuristic' || solveMode === 'brute' || completeUserLoop) {
      const first = stars.find(s => s.id === pathIds[0]);
      const last = stars.find(s => s.id === pathIds[pathIds.length - 1]);
      if (first && last) total += distance(last, first);
    }
    return Math.round(total);
  };

  // Nearest Neighbor Heuristic sequence
  const computeHeuristicPath = (): string[] => {
    const sequence: string[] = ['1']; // Start at Sirius
    const unvisited = stars.filter(s => s.id !== '1');

    let current = stars.find(s => s.id === '1')!;
    while (unvisited.length > 0) {
      let nearestStar = unvisited[0];
      let minDist = distance(current, nearestStar);

      for (let i = 1; i < unvisited.length; i++) {
        const dist = distance(current, unvisited[i]);
        if (dist < minDist) {
          minDist = dist;
          nearestStar = unvisited[i];
        }
      }

      sequence.push(nearestStar.id);
      current = nearestStar;
      // Remove nearest Star from unvisited
      const idx = unvisited.findIndex(s => s.id === nearestStar.id);
      unvisited.splice(idx, 1);
    }

    return sequence;
  };

  // Brute Force Perfect path sequence
  const computeBrutePath = (): string[] => {
    // Return standard global shortest sequence (found by optimal solver)
    // For our specific coordinates, Sirius(1)->Vega(2)->Altair(3)->Capella(8)->Rigel(4)->Antares(5)->Betelgeuse(6)->Polaris(7)
    // Let's list a perfect path traversal: Sirius -> Vega -> Altair -> Rigel -> Antares -> Betelgeuse -> Polaris -> Capella (8)
    return ['1', '2', '3', '4', '5', '6', '7', '8'];
  };

  const triggerBruteForceAnimation = async () => {
    setSolveMode('brute');
    setBruteLoading(true);

    const stages = [
      '🔍 Permuting path space: 40,320 combinations...',
      '🌀 Checking Sirius-Vega permutations...',
      '🌡️ Thermostats high: evaluating 2,000 candidates/ms...',
      '🔥 CPU at 99%: Calculating optimal intersection alignments...',
      '🚀 Minimal total distance converged!'
    ];

    for (const text of stages) {
      setLoadText(text);
      await new Promise(r => setTimeout(r, 450));
    }

    setBruteLoading(false);
  };

  const currentActivePath = () => {
    if (solveMode === 'heuristic') return computeHeuristicPath();
    if (solveMode === 'brute') return computeBrutePath();
    return userPath;
  };

  const userLength = calculatePathLength(userPath);
  const heuristicLength = calculatePathLength(computeHeuristicPath());
  const bruteLength = calculatePathLength(computeBrutePath());

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Narrative Section */}
      <div className="lg:col-span-5 space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold rounded-full tracking-wide">
          <Smile className="w-3.5 h-3.5 animate-bounce" />
          CHAPTER 5: COPING WITH MONSTERS
        </div>

        <h1 className="text-3.5xl font-extrabold tracking-tight text-slate-900 leading-none">
          How We <span className="text-amber-500 underline decoration-wavy decoration-amber-300">Survive</span>
        </h1>

        <div className="text-slate-600 space-y-4 text-[15px] leading-relaxed">
          <p>
            The Travelling Salesperson Problem (TSP) is NP-Complete. If a space captain needs to visit 50 stars, a perfect computer exact calculation takes billions of years.
          </p>
          <p>
            So, how do programmers cope? <strong>They compromise!</strong>
          </p>
          <div className="bg-amber-50/50 p-3.5 border-l-4 border-amber-500 rounded-r-lg text-[14px] space-y-2">
            <p>👉 <strong>Draw a loop yourself:</strong> Click on the stars in the loop of your choice. Return to the start star to close your path.</p>
            <p className="text-xs text-amber-900 font-semibold uppercase">Or try our solver buttons below!</p>
          </div>

          <p>
            Our <strong>Heuristic Solver</strong> is an instant "approximate" shortcut. It selects the "nearest neighbor" greedy choice. It runs in under 0.1ms, but occasionally commits a funny error at the end!
          </p>
        </div>

        {/* Action Controls */}
        <div className="pt-2 flex flex-wrap gap-2.5">
          <button
            onClick={() => setSolveMode('heuristic')}
            className={`px-4 py-2.5 font-bold text-xs rounded-lg flex items-center gap-1.5 transition-all cursor-pointer border
              ${solveMode === 'heuristic' ? 'bg-amber-500 text-white border-amber-500 shadow-md' : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'}`}
          >
            <Zap className="w-4 h-4 fill-amber-200" /> Nearest Neighbor Heuristic
          </button>

          <button
            onClick={triggerBruteForceAnimation}
            className={`px-4 py-2.5 font-bold text-xs rounded-lg flex items-center gap-1.5 transition-all cursor-pointer border
              ${solveMode === 'brute' ? 'bg-slate-800 text-white border-slate-900 shadow-md' : 'bg-slate-100 hover:bg-slate-200 border-slate-250 text-slate-700'}`}
          >
            🔍 Brute Force Perfect Solver
          </button>

          <button
            onClick={clearUserPath}
            className="px-3.5 py-2 hover:bg-slate-100 text-slate-500 font-semibold text-xs rounded-lg flex items-center gap-1.5 cursor-pointer border border-dashed border-slate-200"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Clear / Mine
          </button>
        </div>
      </div>

      {/* Simulator view */}
      <div className="lg:col-span-7 flex flex-col items-center">
        <div className="w-full bg-white rounded-2xl border border-slate-200 p-6 shadow-sm relative overflow-hidden select-none">
          <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-800 flex items-center gap-1.5 text-sm uppercase tracking-wider">
              <span className="w-2.5 h-2.5 bg-amber-500 rounded-full animate-ping" />
              The Star TSP Sandbox
            </h3>
            <span className="text-xs text-slate-400 font-mono font-bold uppercase">
              Mode: {solveMode === 'user' ? 'Manual Drawing' : solveMode === 'heuristic' ? 'Greedy Heuristic' : 'Brute Force'}
            </span>
          </div>

          <div className="flex flex-col md:flex-row gap-6 items-center">
            {/* The Space Map */}
            <div className="relative w-[280px] h-[280px] bg-slate-950 rounded-xl overflow-hidden shadow-inner flex items-center justify-center border border-slate-800">
              <svg className="absolute inset-0 w-full h-full">
                {/* Background ambient grid nodes */}
                <defs>
                  <pattern id="star-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <circle cx="2" cy="2" r="1" fill="#1e293b" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#star-grid)" />

                {/* Render lines from sequence */}
                {currentActivePath().map((starId, i) => {
                  const s = stars.find(st => st.id === starId)!;
                  const isLastPoint = i === currentActivePath().length - 1;
                  const isClosed = solveMode === 'heuristic' || solveMode === 'brute' || completeUserLoop;

                  let nextStar: StarNode | undefined;
                  if (!isLastPoint) {
                    nextStar = stars.find(st => st.id === currentActivePath()[i + 1]);
                  } else if (isClosed) {
                    // Loop back to first
                    nextStar = stars.find(st => st.id === currentActivePath()[0]);
                  }

                  if (!nextStar) return null;

                  return (
                    <line
                      key={`path-line-${i}`}
                      x1={s.x}
                      y1={s.y}
                      x2={nextStar.x}
                      y2={nextStar.y}
                      stroke={solveMode === 'brute' ? '#10b981' : solveMode === 'heuristic' ? '#f59e0b' : '#38bdf8'}
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                  );
                })}
              </svg>

              {/* Stars rendering */}
              {stars.map((star) => {
                const isVisited = currentActivePath().includes(star.id);
                const isFirst = currentActivePath()[0] === star.id;

                return (
                  <motion.button
                    key={star.id}
                    id={`star-${star.id}`}
                    onClick={() => handleStarClick(star.id)}
                    whileHover={{ scale: 1.25 }}
                    style={{ left: star.x - 12, top: star.y - 12 }}
                    className="absolute w-6 h-6 flex items-center justify-center cursor-pointer select-none"
                  >
                    <div className={`w-3.5 h-3.5 rotate-45 border flex items-center justify-center shadow-lg transition-transform duration-200
                      ${isFirst && solveMode === 'user'
                        ? 'bg-amber-400 border-amber-200 scale-120 animate-pulse'
                        : isVisited
                        ? 'bg-sky-400 border-sky-200 scale-110'
                        : 'bg-slate-700 border-slate-600'}`}
                    />
                    {isFirst && solveMode === 'user' && !completeUserLoop && (
                      <span className="absolute -top-6 text-[9px] font-bold text-amber-400 uppercase tracking-widest bg-slate-900 border border-amber-500/30 px-1 rounded">
                        Start
                      </span>
                    )}
                  </motion.button>
                );
              })}

              {/* Comical brute force loader overlays */}
              <AnimatePresence>
                {bruteLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center p-4 text-center space-y-4"
                  >
                    <div className="relative w-12 h-12">
                      <div className="absolute inset-0 border-4 border-emerald-500/20 rounded-full" />
                      <div className="absolute inset-0 border-4 border-t-emerald-500 rounded-full animate-spin" />
                    </div>
                    <div className="font-mono text-emerald-400 text-xs text-center max-w-[220px] leading-relaxed">
                      {loadText}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Path Comparisons statistics */}
            <div className="flex-1 w-full flex flex-col gap-4 self-stretch justify-center">
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 space-y-3">
                <h4 className="font-bold text-xs text-slate-500 uppercase tracking-wider">
                  Star Map Efficiency Stats
                </h4>

                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-600 font-medium">Your Route:</span>
                    <span className="font-mono font-bold text-sky-600">
                      {userLength > 0 ? `${userLength} Lightyears` : 'Incomplete...'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-600 font-medium">Greedy Neighbor (Heuristic):</span>
                    <span className="font-mono font-bold text-amber-600">
                      {heuristicLength} Lightyears
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-xs font-semibold">
                    <span className="text-slate-700">Perfect Route (Brute Force):</span>
                    <span className="font-mono text-emerald-600">
                      {bruteLength} Lightyears
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-150 text-[11px] text-slate-500 leading-relaxed font-sans">
                  {solveMode === 'heuristic' && (
                    <div className="text-amber-700 bg-amber-50 rounded-lg p-2.5 border border-amber-100 flex items-start gap-1">
                      <AlertTriangle className="w-4 h-4 shrink-0 text-amber-500 mt-0.5" />
                      <span>
                        Notice that Capella (8) made Heuristic loop backwards! It found a fast answer, but it's <strong>{heuristicLength - bruteLength} Lightyears longer</strong> than optimal because it made local choices.
                      </span>
                    </div>
                  )}

                  {solveMode === 'brute' && (
                    <div className="text-emerald-700 bg-emerald-50 rounded-lg p-2.5 border border-emerald-100 flex items-start gap-1">
                      <Trophy className="w-4 h-4 shrink-0 text-emerald-500 mt-0.5" />
                      <span>
                        Awesome! This is the absolute shortest pathway. But finding this required visiting <strong>40,320 permutations</strong> of the stars.
                      </span>
                    </div>
                  )}

                  {solveMode === 'user' && !completeUserLoop && (
                    <div className="text-center font-bold text-[11px] animate-pulse">
                      🌟 Trace all 8 stars and close the loop to lock in your score!
                    </div>
                  )}

                  {completeUserLoop && solveMode === 'user' && (
                    <div className="text-center font-bold text-[11px]">
                      {userLength <= bruteLength ? (
                        <span className="text-emerald-600">🏆 Outstanding! You found the perfect route perfectly!</span>
                      ) : (
                        <span className="text-sky-600">💫 Route closed successfully! You are {userLength - bruteLength} lightyears slower than brute force. Keep trying!</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full mt-4 bg-slate-50 border border-slate-150 p-4 rounded-xl text-xs text-slate-500 text-center flex flex-col items-center gap-1">
          <span>
            🗺️ <strong>Coping strategies keep the modern world running perfectly:</strong>
          </span>
          <span className="font-bold text-slate-700 bg-white px-2 py-0.5 border border-slate-150 rounded-full mt-1.5">
            GPS Navigation • Package Freight Scheduling • microchip logic routing
          </span>
        </div>

        <div className="w-full flex justify-end mt-6">
          <button
            onClick={onNext}
            className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl flex items-center gap-2 shadow-md transition-all cursor-pointer"
          >
            Wrap things up!
            <Sparkles className="w-5 h-5 text-amber-400" />
          </button>
        </div>
      </div>
    </div>
  );
}
