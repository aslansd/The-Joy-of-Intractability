import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, ArrowLeft, Layers, Trophy, Cpu, Network, CheckCircle2 } from 'lucide-react';
import { ActiveChapter } from './types';

// Import our custom interactive modular chapters
import ChapterP from './components/ChapterP';
import ChapterNP from './components/ChapterNP';
import ChapterNPC from './components/ChapterNPC';
import ChapterPvsNP from './components/ChapterPvsNP';
import ChapterCoping from './components/ChapterCoping';

const STAGES: { id: ActiveChapter; label: string; color: string }[] = [
  { id: 'intro', label: 'Start', color: 'bg-slate-400' },
  { id: 'p', label: 'P', color: 'bg-emerald-500' },
  { id: 'np', label: 'NP', color: 'bg-indigo-500' },
  { id: 'npc', label: 'NP-Complete', color: 'bg-pink-500' },
  { id: 'p_vs_np', label: 'P vs NP', color: 'bg-purple-500' },
  { id: 'coping', label: 'Coping', color: 'bg-amber-500' },
  { id: 'outro', label: 'End', color: 'bg-slate-800' }
];

export default function App() {
  const [activeChapter, setActiveChapter] = useState<ActiveChapter>('intro');

  const currentIndex = STAGES.findIndex(s => s.id === activeChapter);

  const handleNext = () => {
    if (currentIndex < STAGES.length - 1) {
      setActiveChapter(STAGES[currentIndex + 1].id);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setActiveChapter(STAGES[currentIndex - 1].id);
    }
  };

  const jumpToChapter = (id: ActiveChapter) => {
    setActiveChapter(id);
  };

  return (
    <div id="app-container" className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col justify-between pt-4 pb-8 px-4 sm:px-6">
      
      {/* Upper Navigation & Progress Indicators */}
      <header className="max-w-5xl w-full mx-auto mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2 border-b border-slate-100">
          {/* Logo Brand Title */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => jumpToChapter('intro')}>
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-soft font-bold text-sm">
              🔑
            </div>
            <div>
              <span className="font-extrabold text-slate-900 tracking-tight text-base sm:text-lg">
                The Joy of Intractability
              </span>
              <span className="font-mono text-[10px] text-slate-400 block -mt-1 uppercase tracking-widest font-black">
                Playable Computer Science • v1.0
              </span>
            </div>
          </div>

          {/* Interactive Progress Bar */}
          <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-1">
            {STAGES.map((stage, idx) => {
              const isPast = idx < currentIndex;
              const isActive = idx === currentIndex;

              return (
                <button
                  key={stage.id}
                  id={`nav-item-${stage.id}`}
                  onClick={() => jumpToChapter(stage.id)}
                  className={`flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-full transition-all duration-200 cursor-pointer border select-none
                    ${isActive 
                      ? 'bg-slate-900 border-slate-900 text-white shadow-sm font-black' 
                      : isPast
                      ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50' 
                      : 'bg-white/50 border-transparent text-slate-400'}`}
                >
                  <span className={`w-2 h-2 rounded-full ${stage.color} shrink-0`} />
                  <span className="hidden sm:inline">{stage.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Chapter Content Slot */}
      <main className="max-w-5xl w-full mx-auto bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 flex-1 flex flex-col justify-center relative overflow-hidden self-center my-2">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeChapter}
            initial={{ opacity: 0, x: 25 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -25 }}
            transition={{ type: 'spring', stiffness: 220, damping: 24 }}
            className="w-full"
          >
            {activeChapter === 'intro' && (
              <div id="chapter-intro" className="flex flex-col lg:flex-row gap-12 items-center py-6">
                <div className="flex-1 space-y-6 text-center lg:text-left">
                  <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-semibold px-3 py-1 rounded-full tracking-wide">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                    Interactive Explainer
                  </div>

                  <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 leading-none">
                    How hard is a problem, <span className="text-indigo-600 underline decoration-wavy decoration-indigo-300">really</span>?
                  </h1>

                  <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0">
                    Why can computers find routes on a map instantly, but get totally stumped scheduling school exams? 
                    <br /><span className="mt-2 block font-semibold text-slate-800">Welcome to computational complexity.</span>
                  </p>

                  <div className="p-4 bg-slate-50 border border-slate-150 rounded-2xl flex flex-col sm:flex-row items-center gap-3.5 text-xs text-slate-500 leading-relaxed text-left max-w-lg mx-auto lg:mx-0">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-lg shadow-sm font-bold shrink-0">
                      💡
                    </div>
                    <div>
                      This is a <strong>Playable Guide</strong> inspired by the active learning design of Nicky Case. No dense math equations—just things you can click, break, and explore!
                    </div>
                  </div>

                  <div className="pt-2 flex justify-center lg:justify-start">
                    <button
                      onClick={handleNext}
                      className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-2xl flex items-center gap-3 shadow-lg shadow-indigo-150 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
                    >
                      Step Inside Complexity!
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="flex-1 max-w-md relative flex items-center justify-center py-8">
                  {/* Decorative visual representing the complexity space */}
                  <div className="relative w-[300px] h-[300px] bg-slate-50 border border-slate-150 rounded-full flex items-center justify-center shadow-inner">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
                      className="absolute inset-4 border border-dashed border-slate-300 rounded-full"
                    />

                    {/* NPC Circle */}
                    <div className="absolute w-[210px] h-[210px] border-2 border-dashed border-pink-300 rounded-full flex items-center justify-center bg-pink-50/10">
                      <span className="absolute top-1 text-[10px] font-bold text-pink-500 uppercase tracking-widest bg-white px-2 border border-pink-100 rounded-full select-none">
                        NP-Complete
                      </span>
                    </div>

                    {/* NP Circle */}
                    <div className="absolute left-8 w-[150px] h-[150px] border-2 border-indigo-200 rounded-full flex items-center justify-center bg-indigo-50/20 shadow-sm">
                      <span className="absolute bottom-1 text-[10px] font-bold text-indigo-500 uppercase tracking-widest bg-white px-2 border border-indigo-100 rounded-full select-none">
                        NP
                      </span>
                    </div>

                    {/* P Circle */}
                    <div className="absolute left-12 w-[80px] h-[80px] border-2 border-emerald-300 rounded-full flex items-center justify-center bg-emerald-50/40 shadow-sm">
                      <span className="text-[11px] font-black text-emerald-600 select-none">
                        P
                      </span>
                    </div>

                    {/* Floating decoration node symbols */}
                    <motion.div 
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 4, repeat: Infinity }}
                      className="absolute top-10 right-10 w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs shadow-md font-bold"
                    >
                      $N!$
                    </motion.div>
                    <motion.div 
                      animate={{ y: [0, 8, 0] }}
                      transition={{ duration: 5, repeat: Infinity }}
                      className="absolute bottom-8 right-12 w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs shadow-md font-bold"
                    >
                      $2^N$
                    </motion.div>
                  </div>
                </div>
              </div>
            )}

            {activeChapter === 'p' && <ChapterP onNext={handleNext} />}
            {activeChapter === 'np' && <ChapterNP onNext={handleNext} />}
            {activeChapter === 'npc' && <ChapterNPC onNext={handleNext} />}
            {activeChapter === 'p_vs_np' && <ChapterPvsNP onNext={handleNext} />}
            {activeChapter === 'coping' && <ChapterCoping onNext={handleNext} />}

            {activeChapter === 'outro' && (
              <div id="chapter-outro" className="py-6 max-w-3xl mx-auto space-y-8 text-center flex flex-col items-center">
                <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 border border-emerald-300 flex items-center justify-center text-3xl shadow-md">
                  🎓
                </div>

                <div className="space-y-3.5">
                  <h1 className="text-4xl font-black tracking-tight text-slate-950">
                    Complexity Theory, Achieved!
                  </h1>
                  <p className="text-slate-600 text-base max-w-xl mx-auto leading-relaxed">
                    You have successfully navigated standard complex intractability concepts! Here is your quick cheat-sheet for computer science master status:
                  </p>
                </div>

                {/* Review bento layout cells */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                  <div className="border border-slate-150 rounded-2xl p-5 bg-slate-50 text-left space-y-2">
                    <span className="inline-block px-2 py-0.5 bg-emerald-100 border border-emerald-200 text-emerald-800 rounded font-black font-mono text-[10px] uppercase">
                      Class P
                    </span>
                    <h3 className="font-extrabold text-slate-900 text-sm">Solved Fast</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Easy to find and easy to check. Examples are shortest roads, dictionary searches, and sorting numbers.
                    </p>
                  </div>

                  <div className="border border-slate-150 rounded-2xl p-5 bg-slate-50 text-left space-y-2">
                    <span className="inline-block px-2 py-0.5 bg-indigo-100 border border-indigo-200 text-indigo-800 rounded font-black font-mono text-[10px] uppercase">
                      Class NP
                    </span>
                    <h3 className="font-extrabold text-slate-900 text-sm">Verified Fast</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Wicked hard to solve on larger scales, but instantly simple to check if handed a key/solution.
                    </p>
                  </div>

                  <div className="border border-slate-150 rounded-2xl p-5 bg-slate-50 text-left space-y-2">
                    <span className="inline-block px-2 py-0.5 bg-pink-100 border border-pink-200 text-pink-800 rounded font-black font-mono text-[10px] uppercase">
                      NP-Complete
                    </span>
                    <h3 className="font-extrabold text-slate-900 text-sm">The Chameleons</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      The hardest problems in NP. Solving any single one fast unlocks polynomial solutions for every problem in NP!
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-150 rounded-2xl flex items-start gap-3.5 text-xs text-slate-600 max-w-xl text-left leading-relaxed">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <strong>Remember:</strong> Even though computers can't calculate optimal solutions for NP-Complete equations perfectly, 
                    programmers survive using <strong>smart approximations</strong> and <strong>heuristics</strong> to keep civilization thriving!
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    onClick={() => jumpToChapter('intro')}
                    className="px-6 py-3 border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-sm rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-4 h-4" /> Start Over
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Persistent Footer and Back/Next Buttons */}
      <footer className="max-w-5xl w-full mx-auto mt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-400 font-sans border-t border-slate-100 pt-4">
        <div>
          An interactive playable guide inspired by Nicky Case. Built with 🤍
        </div>

        {/* Global Manual Step Controls */}
        <div className="flex gap-2">
          {currentIndex > 0 && (
            <button
              onClick={handleBack}
              className="px-3 py-1.5 border border-slate-200 hover:bg-white bg-white/50 text-slate-500 font-bold text-xs rounded-lg flex items-center gap-1 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          )}

          {currentIndex < STAGES.length - 1 && (
            <button
              onClick={handleNext}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg flex items-center gap-1 transition-all cursor-pointer shadow-sm"
            >
              Next <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </footer>
    </div>
  );
}
