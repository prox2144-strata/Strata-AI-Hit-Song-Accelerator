import React, { useState } from 'react';
import { Header } from './components/Header';
import { SunoBeatGenerator } from './components/SunoBeatGenerator';
import { GeminiLyricEngine } from './components/GeminiLyricEngine';
import { BandLabRecordingHub } from './components/BandLabRecordingHub';
import { RedemptionSection } from './components/RedemptionSection';
import { ToastContainer } from './components/ToastContainer';
import { ActivePhase, SunoPromptParams, GeminiPromptParams, ToastNotification } from './types';
import { Sparkles, Shield, Flame, RotateCcw, Award, CheckCircle } from 'lucide-react';

export default function App() {
  const [activePhase, setActivePhase] = useState<ActivePhase>('all');

  const [completedPhases, setCompletedPhases] = useState({
    phase1: false,
    phase2: false,
    phase3: false,
    phase5: false,
  });

  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  // Suno State
  const [sunoParams, setSunoParams] = useState<SunoPromptParams>({
    genre: 'Southern Trap',
    mood: 'Dark',
    bpm: '138 BPM',
    textures: ['Heavy Sub-Bass', 'Crisp 808s', 'Spacey Reverb', 'Rolling Hi-Hats'],
    customStyleText: '',
  });

  // Gemini State
  const [geminiParams, setGeminiParams] = useState<GeminiPromptParams>({
    flowStyle: 'Melodic Rap-Singing',
    songStructure: 'Verse - Chorus - Verse - Chorus - Outro (Hit Song Formula)',
    rhymeDensity: 'Heavy Multi-Syllabic',
    topic: 'Overcoming struggles, platinum success, elevated status',
    artistVibe: 'Rod Wave / Drake melodic blend',
    customAudioDetails: '',
  });

  // Teleprompter Lyrics State
  const [lyricsText, setLyricsText] = useState<string>(
    `[INTRO]
(Ad-lib: Yeah, yeah... tjbpro.ai platinum edition...)
(Sub-bass drop)

[VERSE 1]
Stepped up out the shadow, turned the vision into platinum
Every single beat I drop, they know I got the rhythm in
Started with a whisper now we echo through the stadium
Focused on the momentum, ain't no stoppin' what we buildin' in.

[CHORUS]
(Heavy vocal stack)
This the platinum elevation, listen to the wave
Turn the pressure into diamonds, markin' down the page
Every track a legacy, we never act our age
We got the whole world tuned into the main stage!`
  );

  const addToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const newToast: ToastNotification = {
      id: Math.random().toString(36).substring(2, 9),
      message,
      type,
    };
    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => {
      removeToast(newToast.id);
    }, 3500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const markPhaseComplete = (phaseKey: keyof typeof completedPhases) => {
    setCompletedPhases((prev) => ({ ...prev, [phaseKey]: true }));
  };

  const resetAllWorkflow = () => {
    if (confirm('Reset studio workflow parameters for a new song?')) {
      setSunoParams({
        genre: 'Southern Trap',
        mood: 'Dark',
        bpm: '138 BPM',
        textures: ['Heavy Sub-Bass', 'Crisp 808s', 'Spacey Reverb'],
        customStyleText: '',
      });
      setCompletedPhases({
        phase1: false,
        phase2: false,
        phase3: false,
        phase5: false,
      });
      addToast('Workflow reset for a new song project!', 'info');
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0C10] text-[#F1F5F9] font-sans antialiased selection:bg-[#66FCF1] selection:text-[#0B0C10]">
      {/* Header Bar */}
      <Header
        activePhase={activePhase}
        setActivePhase={setActivePhase}
        completedPhases={completedPhases}
      />

      {/* Main Content Area */}
      <main className="w-full max-w-4xl mx-auto px-3 sm:px-6 py-4 sm:py-8 space-y-6 sm:space-y-8 overflow-x-hidden">
        {/* Banner Card / Top Hero Callout */}
        <div className="bg-[#12141C] border border-[#1F2833] rounded-2xl overflow-hidden shadow-xl relative">
          <div className="card-sleek-header p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#0B0C10] border border-[#66FCF1]/40 text-[#66FCF1] shrink-0 mt-0.5 sm:mt-0">
                <Award className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] sm:text-xs font-bold text-[#66FCF1] uppercase tracking-wider">
                    OFFICIAL ACCELERATOR SUITE
                  </span>
                  <span className="status-dot"></span>
                </div>
                <p className="text-xs sm:text-sm text-[#C5C6C7] leading-relaxed">
                  Complete the 5-Phase Studio Pipeline: Generate Suno Beat Prompt &rarr; Analyze &amp; Draft Lyrics in Gemini &rarr; Record Dry Vocals in BandLab DAW &rarr; Redeem Platinum Mix Token.
                </p>
              </div>
            </div>

            <button
              onClick={resetAllWorkflow}
              className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-2 px-4 py-3 min-h-[44px] rounded-lg bg-[#0B0C10] hover:bg-[#1F2833] border border-[#1F2833] text-xs font-bold text-[#C5C6C7] hover:text-white uppercase tracking-wider transition-all active:scale-95 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-gray-400" />
              <span>Reset Project</span>
            </button>
          </div>
        </div>

        {/* Phase 01: Suno Beat Prompt Generator */}
        {(activePhase === 'all' || activePhase === 'phase1') && (
          <SunoBeatGenerator
            onCopy={(prompt, msg) => addToast(msg)}
            onPhaseComplete={() => markPhaseComplete('phase1')}
            sunoParams={sunoParams}
            setSunoParams={setSunoParams}
          />
        )}

        {/* Phase 02: Gemini Audio Analysis & Lyric Flow Engine */}
        {(activePhase === 'all' || activePhase === 'phase2') && (
          <GeminiLyricEngine
            onCopy={(prompt, msg) => addToast(msg)}
            onPhaseComplete={() => markPhaseComplete('phase2')}
            geminiParams={geminiParams}
            setGeminiParams={setGeminiParams}
            onLyricsGenerated={(lyrics) => {
              setLyricsText(lyrics);
              markPhaseComplete('phase2');
            }}
            sunoBeatSummary={`${sunoParams.genre}, ${sunoParams.mood}, ${sunoParams.bpm}`}
          />
        )}

        {/* Phase 03 & 04: BandLab Studio & Recording Hub */}
        {(activePhase === 'all' || activePhase === 'phase3') && (
          <BandLabRecordingHub
            onCopy={(text, msg) => addToast(msg)}
            onPhaseComplete={() => markPhaseComplete('phase3')}
            lyricsText={lyricsText}
            setLyricsText={setLyricsText}
          />
        )}

        {/* Phase 05: Redemption & Polish */}
        {(activePhase === 'all' || activePhase === 'phase5') && (
          <RedemptionSection
            onCopy={(code, msg) => addToast(msg)}
            onPhaseComplete={() => markPhaseComplete('phase5')}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1F2833] bg-[#0B0C10] py-8 mt-12 text-center text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#66FCF1]" />
            <span className="text-[#C5C6C7] font-semibold">
              The Platinum Production Package &bull; tjbpro.ai
            </span>
          </div>

          <p className="text-gray-500">
            &copy; {new Date().getFullYear()} TJB Productions. All rights reserved. AI Cover Song Accelerator.
          </p>
        </div>
      </footer>

      {/* Global Toast Container */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}
