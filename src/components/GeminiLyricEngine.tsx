import React, { useState, useEffect, useRef } from 'react';
import { GeminiPromptParams } from '../types';
import {
  Sparkles,
  Copy,
  Check,
  Zap,
  HelpCircle,
  FileAudio,
  Loader2,
  BookOpen,
  ArrowRight,
  Play,
  Square
} from 'lucide-react';

interface GeminiLyricEngineProps {
  onCopy: (text: string, message: string) => void;
  onPhaseComplete: () => void;
  geminiParams: GeminiPromptParams;
  setGeminiParams: React.Dispatch<React.SetStateAction<GeminiPromptParams>>;
  onLyricsGenerated: (lyrics: string) => void;
  sunoBeatSummary?: string;
}

const FLOW_STYLES = [
  'Fast Rap / Chopper',
  'Melodic Rap-Singing',
  'Slow Spoken Flow',
  'Bounce Cadence',
  'Smooth R&B Hooks',
  'Aggressive Drill Flow',
];

const SONG_STRUCTURES = [
  'Verse - Chorus - Verse - Chorus - Outro (Hit Song Formula)',
  'Verse - Hook - Verse - Hook - Bridge - Hook',
  'Intro - Verse 1 - Chorus - Verse 2 - Chorus - Outro',
  'Continuous Flow (No Hook / Freeform)',
];

const RHYME_DENSITIES = [
  'Heavy Multi-Syllabic',
  'Simple Catchy Hooks',
  'Melodic Vocal Stacks',
  'Internal Rhymes & Wordplay',
];

export const GeminiLyricEngine: React.FC<GeminiLyricEngineProps> = ({
  onCopy,
  onPhaseComplete,
  geminiParams,
  setGeminiParams,
  onLyricsGenerated,
  sunoBeatSummary = '',
}) => {
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [masterPrompt, setMasterPrompt] = useState('');
  const [isLiveGenerating, setIsLiveGenerating] = useState(false);
  const [liveLyrics, setLiveLyrics] = useState('');
  const [showInstructions, setShowInstructions] = useState(true);
  
  // Teleprompter Auto-Scroll State
  const teleprompterRef = useRef<HTMLPreElement>(null);
  const [isScrolling, setIsScrolling] = useState(false);

  // Auto-Scroll Loop
  useEffect(() => {
    let animationFrameId: number;
    const scrollTeleprompter = () => {
      if (isScrolling && teleprompterRef.current) {
        teleprompterRef.current.scrollTop += 0.5; // Adjust speed here
        animationFrameId = requestAnimationFrame(scrollTeleprompter);
      }
    };

    if (isScrolling) {
      animationFrameId = requestAnimationFrame(scrollTeleprompter);
    }

    return () => cancelAnimationFrame(animationFrameId);
  }, [isScrolling]);

  // Generate Master Prompt using TJB Pocket & Lyric Architect Gem Instructions
  const constructGeminiPrompt = () => {
    return `SYSTEM INSTRUCTION: You are an elite music producer and songwriter specializing in Southern rap, Southern trap, hip-hop, and pop. When analyzing audio, assess tempo, groove, song structure, and dynamic rhythmic pockets first. Draft raw, industry-level lyrics that perfectly fit those exact vocal pockets. Do not reference beat-making or mixing mechanics. Avoid clichés like brass, tubas, or flutes. Ensure the lyrics sound natural for a human to re-record so the final track is copyright-safe and authentic.

1. AUDIO ANALYSIS INSTRUCTION:
Please perform a detailed acoustic and rhythmic analysis of the uploaded audio beat track.
Identify:
- Exact estimated BPM and rhythmic tempo feel.
- Key, scale tone, and musical vibe.
- Arrangement structure (where beat drops, breakdowns, transitions, and main hook sections occur).

2. VOCAL CADENCE & LYRIC REQUIREMENTS:
Generate complete hit song lyrics matching the audio breakdown with the following artist specs:
- Vocal Flow Style: ${geminiParams.flowStyle}
- Song Structure Template: ${geminiParams.songStructure}
- Rhyme Density & Cadence: ${geminiParams.rhymeDensity}
${geminiParams.topic ? `- Song Topic / Theme: "${geminiParams.topic}"` : '- Song Topic / Theme: Overcoming obstacles, elevated status, and platinum success.'}
${geminiParams.artistVibe ? `- Artist Vibe Reference: ${geminiParams.artistVibe}` : ''}
${sunoBeatSummary ? `- Beat Context: ${sunoBeatSummary}` : ''}

3. OUTPUT FORMATTING REQUIREMENTS:
- Label each song section using bracketed headers: [INTRO], [VERSE 1], [CHORUS].
- Include vocal delivery notes in parentheses e.g. (Ad-lib: Yeah!), (Stack vocal).`;
  };

  useEffect(() => {
    setMasterPrompt(constructGeminiPrompt());
  }, [geminiParams, sunoBeatSummary]);

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(masterPrompt);
    setCopiedPrompt(true);
    onCopy(
      masterPrompt,
      'Gemini Master Prompt copied! Upload your beat to Gemini and paste this prompt.'
    );
    onPhaseComplete();
    setTimeout(() => setCopiedPrompt(false), 2500);
  };

  // Live in-app Gemini generation
  const handleLiveGenerateLyrics = async () => {
    setIsLiveGenerating(true);
    try {
      const response = await fetch('/api/gemini/generate-lyrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'gemini-4-neon', // Updated to latest audio-capable model
          prompt: masterPrompt,
          systemInstruction: "You are an elite music producer and songwriter specializing in Southern rap, Southern trap, hip-hop, and pop. Analyze audio for tempo, groove, and rhythmic pockets. Draft raw, industry-level lyrics that perfectly fit those exact vocal pockets. Do not reference beat-making or mixing mechanics. Avoid clichés like brass, tubas, or flutes. Ensure the lyrics sound natural for a human to re-record so the final track is copyright-safe and authentic."
        }),
      });

      const data = await response.json();
      if (data.success && data.lyrics) {
        setLiveLyrics(data.lyrics);
        onCopy('Lyrics generated!', 'Live Gemini lyrics successfully generated!');
        onPhaseComplete();
      } else {
        alert(data.error || 'Failed to generate lyrics. Please check API key configuration.');
      }
    } catch (err: any) {
      console.error(err);
      alert('Error connecting to Gemini API server.');
    } finally {
      setIsLiveGenerating(false);
    }
  };

  const handleSendToTeleprompter = () => {
    if (liveLyrics) {
      onLyricsGenerated(liveLyrics);
      onCopy(
        'Lyrics sent!',
        'Lyrics transferred to Teleprompter Scratchpad in Phase 03/04!'
      );
    }
  };

  return (
    <section className="bg-[#12141C] border border-[#1F2833] rounded-2xl overflow-hidden shadow-xl relative">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-[#66FCF1]/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Sleek Card Header */}
      <div className="card-sleek-header p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1F2833]">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[#0B0C10] border border-[#66FCF1]/40 text-[#66FCF1]">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase text-[#66FCF1] tracking-wider">
                PHASE 02
              </span>
              <span className="status-dot"></span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-wide uppercase">
              GEMINI LYRIC ENGINE
            </h2>
          </div>
        </div>

        <button
          onClick={() => setShowInstructions(!showInstructions)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0B0C10] border border-[#1F2833] text-xs text-[#C5C6C7] hover:text-white cursor-pointer"
        >
          <HelpCircle className="w-3.5 h-3.5 text-[#66FCF1]" />
          <span>{showInstructions ? 'Hide Instructions' : 'Show Instructions'}</span>
        </button>
      </div>

      <div className="p-4 sm:p-6 space-y-5 sm:space-y-6">
        {/* Step-by-Step Instructions Card */}
        {showInstructions && (
          <div className="bg-[#0B0C10] border border-[#45A29E]/30 rounded-xl p-3.5 sm:p-4">
            <h3 className="text-xs font-bold uppercase text-[#66FCF1] mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4 shrink-0" />
              3-Step Workflow: Gemini Audio-to-Lyric Flow
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-[#C5C6C7]">
              <div className="p-3 bg-[#12141C] rounded-lg border border-[#1F2833]">
                <span className="font-bold text-white block mb-1">Step 1: Download Beat</span>
                <p className="leading-relaxed">Download the generated instrumental WAV/MP3 beat file from Suno.com to your phone or computer.</p>
              </div>
              <div className="p-3 bg-[#12141C] rounded-lg border border-[#1F2833]">
                <span className="font-bold text-white block mb-1">Step 2: Upload to Gemini</span>
                <p className="leading-relaxed">Open Google Gemini (gemini.google.com) and click the attachment button to upload your beat audio file.</p>
              </div>
              <div className="p-3 bg-[#12141C] rounded-lg border border-[#1F2833]">
                <span className="font-bold text-white block mb-1">Step 3: Paste Prompt</span>
                <p className="leading-relaxed">Copy the Gemini Master Prompt generated below and paste it in Gemini alongside the audio track for exact flow alignment.</p>
              </div>
            </div>
          </div>
        )}

        {/* Interactive Vocal Flow Customizer - Mobile Stack */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          <div className="bg-[#0B0C10] p-3.5 sm:p-4 rounded-xl border border-[#1F2833]">
            <label className="block text-xs font-semibold text-[#45A29E] uppercase mb-2">1. Vocal Cadence</label>
            <select
              value={geminiParams.flowStyle}
              onChange={(e) => setGeminiParams({ ...geminiParams, flowStyle: e.target.value })}
              className="w-full bg-[#12141C] border border-[#1F2833] rounded-lg px-3.5 py-3 min-h-[48px] text-base sm:text-sm text-white focus:outline-none focus:border-[#66FCF1]"
            >
              {FLOW_STYLES.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>

          <div className="bg-[#0B0C10] p-3.5 sm:p-4 rounded-xl border border-[#1F2833]">
            <label className="block text-xs font-semibold text-[#45A29E] uppercase mb-2">2. Structure Template</label>
            <select
              value={geminiParams.songStructure}
              onChange={(e) => setGeminiParams({ ...geminiParams, songStructure: e.target.value })}
              className="w-full bg-[#12141C] border border-[#1F2833] rounded-lg px-3.5 py-3 min-h-[48px] text-base sm:text-sm text-white focus:outline-none focus:border-[#66FCF1]"
            >
              {SONG_STRUCTURES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="bg-[#0B0C10] p-3.5 sm:p-4 rounded-xl border border-[#1F2833]">
            <label className="block text-xs font-semibold text-[#45A29E] uppercase mb-2">3. Rhyme Density & Cadence</label>
            <select
              value={geminiParams.rhymeDensity}
              onChange={(e) => setGeminiParams({ ...geminiParams, rhymeDensity: e.target.value })}
              className="w-full bg-[#12141C] border border-[#1F2833] rounded-lg px-3.5 py-3 min-h-[48px] text-base sm:text-sm text-white focus:outline-none focus:border-[#66FCF1]"
            >
              {RHYME_DENSITIES.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
        </div>

        {/* Additional Concept & Artist References */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#45A29E] uppercase mb-1.5">Song Concept / Topic (Optional):</label>
            <input
              type="text"
              placeholder="e.g. Turning struggles into triumphs, late night studio"
              value={geminiParams.topic}
              onChange={(e) => setGeminiParams({ ...geminiParams, topic: e.target.value })}
              className="w-full bg-[#0B0C10] border border-[#1F2833] rounded-xl px-4 py-3 min-h-[48px] text-base sm:text-sm text-white focus:outline-none focus:border-[#66FCF1]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#45A29E] uppercase mb-1.5">Artist Vibe Reference (Optional):</label>
            <input
              type="text"
              placeholder="e.g. Rod Wave melodic hooks, Drake storytelling"
              value={geminiParams.artistVibe}
              onChange={(e) => setGeminiParams({ ...geminiParams, artistVibe: e.target.value })}
              className="w-full bg-[#0B0C10] border border-[#1F2833] rounded-xl px-4 py-3 min-h-[48px] text-base sm:text-sm text-white focus:outline-none focus:border-[#66FCF1]"
            />
          </div>
        </div>

        {/* Gemini Master Prompt Box */}
        <div className="bg-[#0B0C10] border border-[#45A29E]/40 rounded-xl p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
            <div className="flex items-center gap-2">
              <FileAudio className="w-4 h-4 text-[#66FCF1] shrink-0" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#66FCF1]">Master Gemini Audio Prompt</span>
            </div>
            <span className="text-[10px] text-gray-400 font-mono">Optimized for Gemini Audio Processing</span>
          </div>

          <textarea
            readOnly
            rows={6}
            value={masterPrompt}
            className="w-full output-box-sleek text-xs font-mono text-gray-300 leading-relaxed resize-none focus:outline-none p-3 select-all"
          />

          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <button
              type="button"
              onClick={handleCopyPrompt}
              className={`w-full flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 min-h-[48px] rounded-lg text-xs font-bold uppercase tracking-wider transition-all active:scale-95 cursor-pointer ${
                copiedPrompt ? 'bg-emerald-600 text-white' : 'bg-[#45A29E] text-[#0B0C10] hover:bg-[#66FCF1] hover:text-[#0B0C10]'
              }`}
            >
              {copiedPrompt ? <><Check className="w-4 h-4" /><span>Prompt Copied!</span></> : <><Copy className="w-4 h-4" /><span>Copy Gemini Prompt</span></>}
            </button>

            <button
              type="button"
              onClick={handleLiveGenerateLyrics}
              disabled={isLiveGenerating}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 min-h-[48px] rounded-lg bg-transparent hover:bg-[#1F2833] text-[#66FCF1] text-xs font-bold uppercase tracking-wider border border-[#66FCF1] transition-all active:scale-95 cursor-pointer disabled:opacity-50"
            >
              {isLiveGenerating ? <><Loader2 className="w-4 h-4 text-[#66FCF1] animate-spin" /><span>Generating Lyrics with AI...</span></> : <><Zap className="w-4 h-4 text-[#66FCF1]" /><span>Generate Lyrics Now (In-App)</span></>}
            </button>
          </div>
        </div>

        {/* Live Generated Lyrics Preview & Teleprompter */}
        {liveLyrics && (
          <div className="bg-[#0B0C10] border border-[#66FCF1] rounded-xl p-4 sm:p-5 animate-fade-in glow-mint">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1F2833] pb-3 mb-3">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#66FCF1] shrink-0" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wide">Live Teleprompter Lyrics</h3>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsScrolling(!isScrolling)}
                  className={`inline-flex items-center justify-center gap-2 px-4 py-2 min-h-[44px] rounded-lg font-bold text-xs uppercase tracking-wider transition-all active:scale-95 cursor-pointer ${
                    isScrolling ? 'bg-red-500/20 text-red-400 border border-red-500' : 'bg-[#12141C] text-[#66FCF1] border border-[#66FCF1]'
                  }`}
                >
                  {isScrolling ? <><Square className="w-4 h-4" /><span>Stop Scroll</span></> : <><Play className="w-4 h-4" /><span>Auto-Scroll</span></>}
                </button>
                <button
                  onClick={handleSendToTeleprompter}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 min-h-[44px] rounded-lg bg-[#45A29E] text-[#0B0C10] font-bold text-xs uppercase tracking-wider hover:bg-[#66FCF1] transition-all active:scale-95 cursor-pointer"
                >
                  <span>Send to Workspace</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <pre 
              ref={teleprompterRef}
              className="output-box-sleek p-3.5 text-xs sm:text-lg md:text-xl font-sans text-gray-100 whitespace-pre-wrap leading-loose h-[400px] overflow-y-auto scroll-smooth"
            >
              {liveLyrics}
            </pre>
          </div>
        )}
      </div>
    </section>
  );
};
