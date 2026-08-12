import React, { useState, useEffect } from 'react';
import { GeminiPromptParams } from '../types';
import {
  Sparkles,
  Copy,
  Check,
  Zap,
  HelpCircle,
  FileAudio,
  Send,
  Loader2,
  BookOpen,
  ArrowRight,
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

  // Dynamically generate the Master Prompt for Gemini
  const constructGeminiPrompt = () => {
    return `[INSTRUCTION FOR GOOGLE GEMINI AUDIO ANALYSIS & HIT LYRIC WRITING]

1. AUDIO ANALYSIS INSTRUCTION:
Please perform a detailed acoustic and rhythmic analysis of the uploaded audio beat track.
Identify:
- Exact estimated BPM and rhythmic tempo feel.
- Key, scale tone, and musical vibe.
- Arrangement structure (where beat drops, breakdowns, transitions, and main hook sections occur).

2. VOCAL CADENCE & LYRIC REQUIREMENTS:
Generate complete, professional hit song lyrics customized to match the audio breakdown with the following artist specifications:
- Vocal Flow Style: ${geminiParams.flowStyle}
- Song Structure Template: ${geminiParams.songStructure}
- Rhyme Density & Cadence: ${geminiParams.rhymeDensity}
${geminiParams.topic ? `- Song Topic / Theme: "${geminiParams.topic}"` : '- Song Topic / Theme: Rising to victory, overcoming obstacles, elevated status, and platinum success.'}
${geminiParams.artistVibe ? `- Artist Vibe Reference: ${geminiParams.artistVibe}` : ''}
${sunoBeatSummary ? `- Beat Context: ${sunoBeatSummary}` : ''}

3. OUTPUT FORMATTING REQUIREMENTS:
- Clearly label each song section using bracketed headers like [INTRO], [VERSE 1], [CHORUS], [VERSE 2], [OUTRO].
- Include vocal delivery notes and ad-lib cues in parentheses e.g. (Ad-lib: Yeah!), (Stack vocal), (Fast chopper flow).
- Provide a brief "CADENCE & FLOW GUIDE" at the top explaining how to deliver the vocals over the beat tempo.`;
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
          genre: 'Southern Trap / Melodic Rap',
          mood: 'Energetic / Dark',
          bpm: '120 BPM',
          flowStyle: geminiParams.flowStyle,
          songStructure: geminiParams.songStructure,
          rhymeDensity: geminiParams.rhymeDensity,
          beatDescription: geminiParams.customAudioDetails || sunoBeatSummary || '808 sub-bass, atmospheric synths, crisp snare',
          topic: geminiParams.topic,
          artistVibe: geminiParams.artistVibe,
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
          {/* Vocal Flow Style */}
          <div className="bg-[#0B0C10] p-3.5 sm:p-4 rounded-xl border border-[#1F2833]">
            <label className="block text-xs font-semibold text-[#45A29E] uppercase mb-2">
              1. Vocal Cadence
            </label>
            <select
              value={geminiParams.flowStyle}
              onChange={(e) => setGeminiParams({ ...geminiParams, flowStyle: e.target.value })}
              className="w-full bg-[#12141C] border border-[#1F2833] rounded-lg px-3.5 py-3 min-h-[48px] text-base sm:text-sm text-white focus:outline-none focus:border-[#66FCF1]"
            >
              {FLOW_STYLES.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>

          {/* Song Structure Template */}
          <div className="bg-[#0B0C10] p-3.5 sm:p-4 rounded-xl border border-[#1F2833]">
            <label className="block text-xs font-semibold text-[#45A29E] uppercase mb-2">
              2. Structure Template
            </label>
            <select
              value={geminiParams.songStructure}
              onChange={(e) => setGeminiParams({ ...geminiParams, songStructure: e.target.value })}
              className="w-full bg-[#12141C] border border-[#1F2833] rounded-lg px-3.5 py-3 min-h-[48px] text-base sm:text-sm text-white focus:outline-none focus:border-[#66FCF1]"
            >
              {SONG_STRUCTURES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Rhyme Density & Cadence */}
          <div className="bg-[#0B0C10] p-3.5 sm:p-4 rounded-xl border border-[#1F2833]">
            <label className="block text-xs font-semibold text-[#45A29E] uppercase mb-2">
              3. Rhyme Density &amp; Cadence
            </label>
            <select
              value={geminiParams.rhymeDensity}
              onChange={(e) => setGeminiParams({ ...geminiParams, rhymeDensity: e.target.value })}
              className="w-full bg-[#12141C] border border-[#1F2833] rounded-lg px-3.5 py-3 min-h-[48px] text-base sm:text-sm text-white focus:outline-none focus:border-[#66FCF1]"
            >
              {RHYME_DENSITIES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Additional Concept & Artist References */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#45A29E] uppercase mb-1.5">
              Song Concept / Topic (Optional):
            </label>
            <input
              type="text"
              placeholder="e.g. Turning struggles into triumphs, late night studio"
              value={geminiParams.topic}
              onChange={(e) => setGeminiParams({ ...geminiParams, topic: e.target.value })}
              className="w-full bg-[#0B0C10] border border-[#1F2833] rounded-xl px-4 py-3 min-h-[48px] text-base sm:text-sm text-white focus:outline-none focus:border-[#66FCF1]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#45A29E] uppercase mb-1.5">
              Artist Vibe Reference (Optional):
            </label>
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
              <span className="text-xs font-bold uppercase tracking-wider text-[#66FCF1]">
                Master Gemini Audio Prompt
              </span>
            </div>
            <span className="text-[10px] text-gray-400 font-mono">
              Optimized for Gemini Audio Processing
            </span>
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
                copiedPrompt
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#45A29E] text-[#0B0C10] hover:bg-[#66FCF1] hover:text-[#0B0C10]'
              }`}
            >
              {copiedPrompt ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Prompt Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Gemini Prompt</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleLiveGenerateLyrics}
              disabled={isLiveGenerating}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 min-h-[48px] rounded-lg bg-transparent hover:bg-[#1F2833] text-[#66FCF1] text-xs font-bold uppercase tracking-wider border border-[#66FCF1] transition-all active:scale-95 cursor-pointer disabled:opacity-50"
            >
              {isLiveGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 text-[#66FCF1] animate-spin" />
                  <span>Generating Lyrics with AI...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-[#66FCF1]" />
                  <span>Generate Lyrics Now (In-App)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Live Generated Lyrics Preview Box */}
        {liveLyrics && (
          <div className="bg-[#0B0C10] border border-[#66FCF1] rounded-xl p-4 sm:p-5 animate-fade-in glow-mint">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1F2833] pb-3 mb-3">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#66FCF1] shrink-0" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wide">
                  Live Gemini Generated Lyrics
                </h3>
              </div>
              <button
                onClick={handleSendToTeleprompter}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3 min-h-[44px] rounded-lg bg-[#45A29E] text-[#0B0C10] font-bold text-xs uppercase tracking-wider hover:bg-[#66FCF1] transition-all active:scale-95 cursor-pointer"
              >
                <span>Send to Teleprompter</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <pre className="output-box-sleek p-3.5 text-xs sm:text-sm font-mono text-gray-200 whitespace-pre-wrap leading-relaxed max-h-80 overflow-y-auto">
              {liveLyrics}
            </pre>
          </div>
        )}
      </div>
    </section>
  );
};
