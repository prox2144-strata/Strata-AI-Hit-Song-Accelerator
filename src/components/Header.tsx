import React from 'react';
import { ActivePhase } from '../types';
import { Sparkles, Music, Mic, Sliders, CheckCircle2, ShieldCheck, Flame } from 'lucide-react';

interface HeaderProps {
  activePhase: ActivePhase;
  setActivePhase: (phase: ActivePhase) => void;
  completedPhases: {
    phase1: boolean;
    phase2: boolean;
    phase3: boolean;
    phase5: boolean;
  };
}

export const Header: React.FC<HeaderProps> = ({
  activePhase,
  setActivePhase,
  completedPhases,
}) => {
  const tabs = [
    { id: 'all' as ActivePhase, label: 'All Studio Phases', icon: Sliders },
    { id: 'phase1' as ActivePhase, label: '01. Suno Beat', icon: Music, complete: completedPhases.phase1 },
    { id: 'phase2' as ActivePhase, label: '02. Gemini Lyrics', icon: Sparkles, complete: completedPhases.phase2 },
    { id: 'phase3' as ActivePhase, label: '03-04. DAW & Teleprompter', icon: Mic, complete: completedPhases.phase3 },
    { id: 'phase5' as ActivePhase, label: '05. Mix Token Redemption', icon: Flame, complete: completedPhases.phase5 },
  ];

  return (
    <header className="border-b border-[#1F2833] bg-[#0B0C10]/95 backdrop-blur-md sticky top-0 z-40">
      <div className="w-full max-w-4xl mx-auto px-3 sm:px-6 py-3">
        {/* Top Bar Info */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#12141C] text-[#66FCF1] border border-[#45A29E]/30 uppercase tracking-wider">
                <span className="status-dot"></span>
                OFFICIAL SYSTEM &bull; tjbpro.ai
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] text-gray-400 font-mono">
                <ShieldCheck className="w-3.5 h-3.5 text-[#45A29E]" />
                Platinum Suite v2.5
              </span>
            </div>
            <h1 className="text-base sm:text-xl md:text-2xl font-black tracking-wider text-white uppercase leading-tight">
              THE PLATINUM PRODUCTION PACKAGE
            </h1>
            <p className="text-[11px] sm:text-xs font-bold text-[#66FCF1] tracking-widest uppercase">
              AI Cover Song Accelerator
            </p>
          </div>

          {/* Quick Stats / Quick Status Badge */}
          <div className="flex items-center gap-2 self-start sm:self-auto bg-[#12141C] border border-[#1F2833] px-3 py-1.5 rounded-lg text-xs text-[#C5C6C7]">
            <div className="flex items-center gap-1.5 font-mono">
              <span className="text-[#66FCF1] font-bold">100%</span> Studio Workflow
            </div>
            <div className="text-[#1F2833]">|</div>
            <div className="flex items-center gap-1 text-[#C5C6C7]">
              <Flame className="w-3.5 h-3.5 text-amber-400" /> 1x Mix Token
            </div>
          </div>
        </div>

        {/* Phase Workflow Step Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2 mb-3">
          <div className={`p-2 rounded-lg text-xs border transition-all ${completedPhases.phase1 ? 'bg-[#12141C] border-[#45A29E]/60 text-[#66FCF1]' : 'bg-[#0B0C10] border-[#1F2833] text-gray-400'}`}>
            <div className="font-bold flex items-center justify-between uppercase text-[10px] sm:text-[11px] tracking-wide">
              <span className="truncate">01. Beat</span>
              {completedPhases.phase1 && <CheckCircle2 className="w-3.5 h-3.5 text-[#66FCF1] shrink-0" />}
            </div>
            <p className="text-[10px] text-[#C5C6C7] truncate hidden sm:block">Suno Style Generator</p>
          </div>

          <div className={`p-2 rounded-lg text-xs border transition-all ${completedPhases.phase2 ? 'bg-[#12141C] border-[#45A29E]/60 text-[#66FCF1]' : 'bg-[#0B0C10] border-[#1F2833] text-gray-400'}`}>
            <div className="font-bold flex items-center justify-between uppercase text-[10px] sm:text-[11px] tracking-wide">
              <span className="truncate">02. Lyrics</span>
              {completedPhases.phase2 && <CheckCircle2 className="w-3.5 h-3.5 text-[#66FCF1] shrink-0" />}
            </div>
            <p className="text-[10px] text-[#C5C6C7] truncate hidden sm:block">Gemini Audio Analysis</p>
          </div>

          <div className={`p-2 rounded-lg text-xs border transition-all ${completedPhases.phase3 ? 'bg-[#12141C] border-[#45A29E]/60 text-[#66FCF1]' : 'bg-[#0B0C10] border-[#1F2833] text-gray-400'}`}>
            <div className="font-bold flex items-center justify-between uppercase text-[10px] sm:text-[11px] tracking-wide">
              <span className="truncate">03-04. Studio</span>
              {completedPhases.phase3 && <CheckCircle2 className="w-3.5 h-3.5 text-[#66FCF1] shrink-0" />}
            </div>
            <p className="text-[10px] text-[#C5C6C7] truncate hidden sm:block">BandLab &amp; Teleprompter</p>
          </div>

          <div className={`p-2 rounded-lg text-xs border transition-all ${completedPhases.phase5 ? 'bg-[#12141C] border-[#45A29E]/60 text-[#66FCF1]' : 'bg-[#0B0C10] border-[#1F2833] text-gray-400'}`}>
            <div className="font-bold flex items-center justify-between uppercase text-[10px] sm:text-[11px] tracking-wide">
              <span className="truncate">05. Polish</span>
              {completedPhases.phase5 && <CheckCircle2 className="w-3.5 h-3.5 text-[#66FCF1] shrink-0" />}
            </div>
            <p className="text-[10px] text-[#C5C6C7] truncate hidden sm:block">Mix Token Redemption</p>
          </div>
        </div>

        {/* Navigation Tabs - Mobile Optimized Scrollable Bar with 48px touch height */}
        <nav className="flex items-center gap-2 overflow-x-auto pb-1.5 pt-0.5 no-scrollbar touch-pan-x">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activePhase === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActivePhase(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 min-h-[44px] rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all border shrink-0 cursor-pointer active:scale-95 ${
                  isActive
                    ? 'bg-[#12141C] border-[#66FCF1] text-[#66FCF1] shadow-[0_0_10px_rgba(102,252,241,0.15)]'
                    : 'bg-[#0B0C10] border-[#1F2833] text-[#C5C6C7] hover:text-white hover:border-gray-700'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#66FCF1]' : 'text-gray-400'}`} />
                <span>{tab.label}</span>
                {tab.complete && (
                  <span className="w-2 h-2 rounded-full bg-[#66FCF1]"></span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
