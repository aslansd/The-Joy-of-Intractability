import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Calendar, Zap, Hourglass, ShieldAlert, ArrowRight } from 'lucide-react';

interface ChapterPvsNPProps {
  onNext: () => void;
}

export default function ChapterPvsNP({ onNext }: ChapterPvsNPProps) {
  const [nValue, setNValue] = useState<number>(20);

  // Constants
  const SUPERCOMPUTER_OPS_PER_SEC = 1e12; // 1 Trillion operations per second

  // Calculate values
  const polyOps = Math.pow(nValue, 3);
  const expOps = Math.pow(2, nValue);

  const polyTimeSec = polyOps / SUPERCOMPUTER_OPS_PER_SEC;
  const expTimeSec = expOps / SUPERCOMPUTER_OPS_PER_SEC;

  // Render text based on seconds
  const formatTimeText = (seconds: number) => {
    if (seconds < 1e-6) return { phrase: 'Instant (Blink of an eye)', color: 'text-emerald-500 font-bold', emoji: '⚡' };
    if (seconds < 1e-3) return { phrase: 'Under 1 Millisecond (Click!)', color: 'text-emerald-500 font-bold', emoji: '✨' };
    if (seconds < 1) return { phrase: 'Fraction of a second', color: 'text-emerald-500 font-bold', emoji: '⏱️' };
    if (seconds < 60) return { phrase: `About ${seconds.toFixed(2)} seconds (Brewing Espresso!)`, color: 'text-amber-500 font-semibold', emoji: '☕' };
    if (seconds < 3600) return { phrase: `About ${(seconds / 60).toFixed(1)} minutes (Lunch Break)`, color: 'text-amber-600 font-bold', emoji: '🥪' };
    if (seconds < 86400) return { phrase: `About ${(seconds / 3600).toFixed(1)} hours (Overnight run)`, color: 'text-orange-500 font-bold', emoji: '🌙' };
    if (seconds < 3.15e7) return { phrase: `About ${(seconds / 86400).toFixed(1)} days (Generational wait)`, color: 'text-red-500 font-bold', emoji: '📅' };
    if (seconds < 3.15e10) return { phrase: `About ${(seconds / 3.15e7).toFixed(1)} years (A Human Lifetime!)`, color: 'text-red-600 font-extrabold', emoji: '👵' };
    if (seconds < 3.15e13) return { phrase: `About ${(seconds / 3.15e10).toFixed(1)} Millennia (Since Rome fell)`, color: 'text-rose-600 font-extrabold', emoji: '🏛️' };
    if (seconds < 3.15e17) return { phrase: `About ${(seconds / 3.15e10).toFixed(1)} Million Years (Since the Dinosaurs died!)`, color: 'text-rose-700 font-extrabold pb-0.5 border-b border-dashed border-rose-300', emoji: '🦖' };
    if (seconds < 4.3e17) return { phrase: `About ${(seconds / 3.15e17).toFixed(1)} Billion Years (Since the Big Bang!)`, color: 'text-purple-700 font-black', emoji: '🌌' };
    return { phrase: 'Till the Heat Death of the Universe (Eternal Silence)', color: 'text-stone-800 font-black tracking-wide bg-stone-100 px-2 py-1 rounded border border-stone-200', emoji: '💀' };
  };

  const polyMeta = formatTimeText(polyTimeSec);
  const expMeta = formatTimeText(expTimeSec);

  // Compute log scale for progress filling
  const getProgressPercentage = (val: number) => {
    // We want to map 1 to 10^30 logarithmically
    if (val <= 1) return 0;
    const log = Math.log10(val);
    const maxLog = 30; // 10^30 operations maximum
    return Math.min((log / maxLog) * 100, 100);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Explanation Side */}
      <div className="lg:col-span-5 space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold rounded-full tracking-wide">
          <ShieldAlert className="w-3.5 h-3.5" />
          CHAPTER 4: THE $1,000,000 QUESTION
        </div>

        <h1 className="text-3.5xl font-extrabold tracking-tight text-slate-900 leading-none">
          Does <span className="text-purple-600">P = NP</span>?
        </h1>

        <div className="text-slate-600 space-y-4 text-[15px] leading-relaxed">
          <p>
            This is the ultimate, million-dollar mystery of computer science. If we can <em>verify</em> a solution easily (NP), is there a secret shortcut to also <em>solve</em> it easily (P)?
          </p>
          <p>
            Almost every computer scientist strongly believes <strong className="text-purple-600">P ≠ NP</strong>. Why? Because of the <strong>Exponential Explosion</strong>.
          </p>
          <p className="bg-purple-50/50 p-3.5 border-l-4 border-purple-500 rounded-r-lg text-[14px]">
            👉 <strong>Try it!</strong> Drag the slider below to increase the size of the problem 
            <strong className="mx-1 px-1.5 py-0.5 bg-white border border-slate-250 font-mono text-purple-900 rounded">N</strong>. 
            Watch how fast the NP problem explodes compared to the polynomial one!
          </p>
          <p>
            If $P = NP$, there is a magical algorithm hidden in the dark that instantly solves all scheduling, drug discovery, security encryption, and logistics problems. If $P \neq NP$, some equations are forever locked behind an unbreakable cosmic speed limit.
          </p>
        </div>
      </div>

      {/* Interactive Slider & Explosion Side */}
      <div className="lg:col-span-7 flex flex-col items-center">
        <div className="w-full bg-white rounded-2xl border border-slate-200 p-6 shadow-sm relative select-none space-y-6">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-800 flex items-center gap-1.5 text-sm uppercase tracking-wider">
              <span className="w-2.5 h-2.5 bg-purple-500 rounded-full animate-bounce" />
              Exponential Explosion Calculator
            </h3>
            <div className="bg-purple-50 text-purple-800 px-3 py-1 rounded-full font-mono text-xs font-bold border border-purple-100">
              Problem Size (N) = {nValue}
            </div>
          </div>

          {/* Slider Control */}
          <div className="space-y-2.5 p-4 bg-slate-50/50 rounded-xl border border-slate-100">
            <div className="flex justify-between text-xs text-slate-500 font-bold uppercase tracking-wide">
              <span>Tiny Problem (n = 1)</span>
              <span>Massive Problem (n = 100)</span>
            </div>
            <input
              type="range"
              min="1"
              max="100"
              value={nValue}
              onChange={(e) => setNValue(parseInt(e.target.value))}
              className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
            />
            <div className="text-center text-xs text-slate-400 font-mono pt-1">
              Simulating standard 1-Teraflop Supercomputer (1,000,000,000,000 operations/sec)
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Polynomial Level (P) */}
            <div className="border border-slate-150 rounded-xl p-5 space-y-4 bg-slate-50 relative overflow-hidden group">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-600 text-sm flex items-center gap-1">
                  <Zap className="w-4 h-4 fill-emerald-100" />
                  POLYNOMIAL (P)
                </span>
                <span className="font-mono text-xs text-slate-400 bg-white px-2 py-0.5 border border-slate-150 rounded-full">
                  $N^3$ ops
                </span>
              </div>

              <div className="space-y-1">
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Operations Count</div>
                <div className="text-2xl font-black text-slate-800 font-mono leading-none">
                  {polyOps.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </div>
              </div>

              {/* Progress gauge visual */}
              <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <motion.div
                  animate={{ width: `${getProgressPercentage(polyOps)}%` }}
                  transition={{ duration: 0.1 }}
                  className="h-full bg-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                  <Hourglass className="w-3 h-3" /> Required Time
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-700 min-h-[38px] leading-tight">
                  <span className="text-lg">{polyMeta.emoji}</span>
                  <span className={polyMeta.color}>{polyMeta.phrase}</span>
                </div>
              </div>
            </div>

            {/* Exponential Level (NP) */}
            <div className="border border-slate-150 rounded-xl p-5 space-y-4 bg-slate-50 relative overflow-hidden group">
              <div className="flex items-center justify-between">
                <span className="font-bold text-rose-600 text-sm flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  EXPONENTIAL (NP brute search)
                </span>
                <span className="font-mono text-xs text-slate-400 bg-white px-2 py-0.5 border border-slate-150 rounded-full">
                  $2^N$ ops
                </span>
              </div>

              <div className="space-y-1">
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Operations Count</div>
                <div className="text-2xl font-black text-slate-800 font-mono leading-none">
                  {expOps > 1e16 ? expOps.toExponential(3) : expOps.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </div>
              </div>

              {/* Progress gauge visual */}
              <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <motion.div
                  animate={{ width: `${getProgressPercentage(expOps)}%` }}
                  transition={{ duration: 0.1 }}
                  className="h-full bg-rose-500"
                />
              </div>

              <div className="space-y-1.5">
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                  <Hourglass className="w-3 h-3" /> Required Time
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-700 min-h-[38px] leading-tight">
                  <span className="text-lg">{expMeta.emoji}</span>
                  <span className={expMeta.color}>{expMeta.phrase}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full mt-4 bg-purple-50/50 border border-purple-100 p-4 rounded-xl text-xs text-purple-800 text-center flex flex-col items-center gap-1">
          <span>
            👩‍🏫 <strong>P vs NP in a nutshell:</strong>
          </span>
          <span className="font-medium max-w-lg mt-1">
            "If recognizing a joke is easy (NP), does that mean writing a funny joke is also easy (P)?"
          </span>
        </div>

        <div className="w-full flex justify-end mt-6">
          <button
            onClick={onNext}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl flex items-center gap-2 shadow-md shadow-purple-150 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
          >
            How do programmers survive this explosion?
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
