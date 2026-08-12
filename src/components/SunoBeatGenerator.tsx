import React, { useState, useEffect } from 'react';
import { SunoPromptParams } from '../types';
import { Music, Copy, ExternalLink, RefreshCw, Sparkles, Check, Sliders, Volume2 } from 'lucide-react';

interface SunoBeatGeneratorProps {
  onCopy: (text: string, message: string) => void;
  onPhaseComplete: () => void;
  sunoParams: SunoPromptParams;
  setSunoParams: React.Dispatch<React.SetStateAction<SunoPromptParams>>;
}

const GENRE_OPTIONS = [
  'Southern Trap',
  'Melodic Trap',
  'Cloud Rap',
  'R&B',
  'Pop',
  'Southern Rap',
  'West Coast Bounce',
  'Drill / Dark Trap',
  'Afrobeats Trap',
  'Lo-Fi Rap',
];

const MOOD_OPTIONS = [
  'Dark',
  'Energetic',
  'Atmospheric',
  'Emotional',
  'Aggressive',
  'Smooth',
  'Triumphant',
  'Melancholic',
  'Hypnotic',
];

const BPM_PRESETS = [
  { label: 'Slow (60-85 BPM)', range: '75 BPM' },
  { label: 'Mid-Tempo (90-120 BPM)', range: '110 BPM' },
  { label: 'Fast/Upbeat (130-160+ BPM)', range: '142 BPM' },
];

const SONIC_TEXTURES = [
  'Heavy Sub-Bass',
  'Crisp 808s',
  'Ambient Pads',
  'Crisp Snare',
  'Spacey Reverb',
  'Melodic Synths',
  'Acoustic Guitar Chords',
  'Brass Hits & Horns',
  'Vocal Chops & Stacks',
  'Rolling Hi-Hats',
  'Vinyl Crackle Texture',
  'Distorted Basslines',
];

const QUICK_PRESETS = [
  {
    name: 'Southern Trap Anthem',
    genre: 'Southern Trap',
    mood: 'Energetic',
    bpm: '138 BPM',
    textures: ['Crisp 808s', 'Heavy Sub-Bass', 'Brass Hits & Horns', 'Rolling Hi-Hats'],
  },
  {
    name: 'OVO Melodic R&B Trap',
    genre: 'R&B',
    mood: 'Emotional',
    bpm: '96 BPM',
    textures: ['Ambient Pads', 'Spacey Reverb', 'Vocal Chops & Stacks', 'Crisp Snare'],
  },
  {
    name: 'Dark Atlanta Slum',
    genre: 'Southern Rap',
    mood: 'Dark',
    bpm: '125 BPM',
    textures: ['Heavy Sub-Bass', 'Crisp 808s', 'Distorted Basslines', 'Crisp Snare'],
  },
  {
    name: 'Cloud Rap Dreamscape',
    genre: 'Cloud Rap',
    mood: 'Atmospheric',
    bpm: '82 BPM',
    textures: ['Spacey Reverb', 'Ambient Pads', 'Melodic Synths', 'Heavy Sub-Bass'],
  },
];

export const SunoBeatGenerator: React.FC<SunoBeatGeneratorProps> = ({
  onCopy,
  onPhaseComplete,
  sunoParams,
  setSunoParams,
}) => {
  const [copied, setCopied] = useState(false);
  const [isInstrumental, setIsInstrumental] = useState(true);
  const [generatedPrompt, setGeneratedPrompt] = useState('');

  // Dynamically construct Suno style prompt tag string
  const constructPrompt = () => {
    const parts: string[] = [];

    if (isInstrumental) {
      parts.push('Instrumental');
    }

    if (sunoParams.genre) {
      parts.push(sunoParams.genre);
    }

    if (sunoParams.mood) {
      parts.push(`${sunoParams.mood} Mood`);
    }

    if (sunoParams.bpm) {
      parts.push(sunoParams.bpm);
    }

    if (sunoParams.textures && sunoParams.textures.length > 0) {
      sunoParams.textures.forEach((texture) => parts.push(texture));
    }

    if (sunoParams.customStyleText.trim()) {
      parts.push(sunoParams.customStyleText.trim());
    }

    // High fidelity production tags for Suno v3.5/v4
    parts.push('Studio Quality Master', 'High Fidelity 44.1kHz');

    return parts.join(', ');
  };

  useEffect(() => {
    setGeneratedPrompt(constructPrompt());
  }, [sunoParams, isInstrumental]);

  const toggleTexture = (texture: string) => {
    setSunoParams((prev) => {
      const exists = prev.textures.includes(texture);
      const updated = exists
        ? prev.textures.filter((t) => t !== texture)
        : [...prev.textures, texture];
      return { ...prev, textures: updated };
    });
  };

  const applyPreset = (preset: typeof QUICK_PRESETS[0]) => {
    setSunoParams({
      genre: preset.genre,
      mood: preset.mood,
      bpm: preset.bpm,
      textures: preset.textures,
      customStyleText: '',
    });
  };

  const handleCopy = () => {
    const promptText = generatedPrompt;
    navigator.clipboard.writeText(promptText);
    setCopied(true);
    onCopy(promptText, 'Suno Style Prompt copied to clipboard! Ready to paste into Suno Engine.');
    onPhaseComplete();
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section className="bg-[#12141C] border border-[#1F2833] rounded-2xl overflow-hidden shadow-xl relative">
      {/* Sleek Card Header */}
      <div className="card-sleek-header p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1F2833]">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[#0B0C10] border border-[#45A29E]/40 text-[#66FCF1]">
            <Music className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase text-[#66FCF1] tracking-wider">
                PHASE 01
              </span>
              <span className="status-dot"></span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-wide uppercase">
              SUNO BEAT PROMPT GENERATOR
            </h2>
          </div>
        </div>

        {/* Quick External Link */}
        <a
          href="https://suno.com/create"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg bg-[#1F2833] hover:bg-[#1F2833]/80 text-[#66FCF1] text-xs font-semibold border border-[#45A29E]/30 transition-all"
        >
          <span>Access Suno Engine</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      <div className="p-4 sm:p-6 space-y-5 sm:space-y-6">
        {/* Background Accent Mesh */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#45A29E]/5 rounded-full blur-3xl pointer-events-none"></div>

        {/* Preset Badges */}
        <div>
          <label className="block text-xs font-semibold text-[#45A29E] uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#66FCF1]" />
            Quick Studio Sound Profiles:
          </label>
          <div className="flex flex-wrap gap-2">
            {QUICK_PRESETS.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => applyPreset(preset)}
                className="text-xs px-3.5 py-2.5 min-h-[40px] rounded-lg bg-[#1F2833] border border-transparent hover:border-[#66FCF1] text-[#C5C6C7] hover:text-[#66FCF1] transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <span>{preset.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Parameter Controls Grid - Single column on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {/* Genre / Style Dropdown */}
          <div className="bg-[#0B0C10] p-3.5 sm:p-4 rounded-xl border border-[#1F2833]">
            <label className="block text-xs font-semibold text-[#45A29E] uppercase mb-2">
              1. Genre &amp; Style
            </label>
            <select
              value={sunoParams.genre}
              onChange={(e) => setSunoParams({ ...sunoParams, genre: e.target.value })}
              className="w-full bg-[#12141C] border border-[#1F2833] rounded-lg px-3.5 py-3 min-h-[48px] text-base sm:text-sm text-white focus:outline-none focus:border-[#66FCF1] transition-all"
            >
              {GENRE_OPTIONS.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          {/* Mood / Vibe Dropdown */}
          <div className="bg-[#0B0C10] p-3.5 sm:p-4 rounded-xl border border-[#1F2833]">
            <label className="block text-xs font-semibold text-[#45A29E] uppercase mb-2">
              2. Mood &amp; Vibe
            </label>
            <select
              value={sunoParams.mood}
              onChange={(e) => setSunoParams({ ...sunoParams, mood: e.target.value })}
              className="w-full bg-[#12141C] border border-[#1F2833] rounded-lg px-3.5 py-3 min-h-[48px] text-base sm:text-sm text-white focus:outline-none focus:border-[#66FCF1] transition-all"
            >
              {MOOD_OPTIONS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* Tempo / BPM Controls */}
          <div className="bg-[#0B0C10] p-3.5 sm:p-4 rounded-xl border border-[#1F2833]">
            <label className="block text-xs font-semibold text-[#45A29E] uppercase mb-2 flex items-center justify-between">
              <span>3. Tempo &amp; BPM</span>
              <span className="text-[#66FCF1] font-mono bg-[#1F2833] px-2 py-0.5 rounded text-[11px]">
                {sunoParams.bpm}
              </span>
            </label>
            <div className="grid grid-cols-3 gap-1.5 mb-3">
              {BPM_PRESETS.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => setSunoParams({ ...sunoParams, bpm: p.range })}
                  className={`text-[11px] sm:text-xs py-2.5 px-1 min-h-[44px] rounded border text-center transition-all cursor-pointer active:scale-95 ${
                    sunoParams.bpm === p.range
                      ? 'bg-[#1F2833] border-[#66FCF1] text-[#66FCF1] font-bold'
                      : 'bg-[#12141C] border-[#1F2833] text-gray-400 hover:text-white'
                  }`}
                >
                  {p.label.split(' ')[0]}
                </button>
              ))}
            </div>
            <input
              type="text"
              placeholder="Or custom BPM e.g., 128 BPM"
              value={sunoParams.bpm}
              onChange={(e) => setSunoParams({ ...sunoParams, bpm: e.target.value })}
              className="w-full bg-[#12141C] border border-[#1F2833] rounded-lg px-3.5 py-2.5 min-h-[44px] text-base sm:text-xs text-white focus:outline-none focus:border-[#66FCF1]"
            />
          </div>

          {/* Audio Mode Toggle */}
          <div className="bg-[#0B0C10] p-3.5 sm:p-4 rounded-xl border border-[#1F2833] flex flex-col justify-between">
            <label className="block text-xs font-semibold text-[#45A29E] uppercase mb-2">
              4. Instrumental Output Setting
            </label>
            <div className="flex items-center justify-between bg-[#12141C] p-3 rounded-lg border border-[#1F2833]">
              <div className="flex items-center gap-2 pr-2">
                <Volume2 className="w-4 h-4 text-[#45A29E] shrink-0" />
                <span className="text-xs text-white font-medium">
                  {isInstrumental ? 'Pure Instrumental Beat' : 'With Vocal Chops & Hooks'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsInstrumental(!isInstrumental)}
                className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full transition-colors ${
                  isInstrumental ? 'bg-[#45A29E]' : 'bg-[#1F2833]'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                    isInstrumental ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <p className="text-[11px] text-[#C5C6C7] mt-2">
              Always generate a clean instrumental beat in Suno so you can overlay custom lyrics in Phase 02/03.
            </p>
          </div>
        </div>

        {/* Multi-Select Sonic Textures */}
        <div className="bg-[#0B0C10] p-3.5 sm:p-4 rounded-xl border border-[#1F2833]">
          <label className="block text-xs font-semibold text-[#45A29E] uppercase mb-3 flex items-center justify-between">
            <span>5. Sonic Textures &amp; Instrumentation</span>
            <span className="text-[11px] text-gray-400 font-normal">
              {sunoParams.textures.length} Selected
            </span>
          </label>
          <div className="flex flex-wrap gap-2">
            {SONIC_TEXTURES.map((texture) => {
              const isSelected = sunoParams.textures.includes(texture);
              return (
                <button
                  key={texture}
                  type="button"
                  onClick={() => toggleTexture(texture)}
                  className={`text-xs px-3 py-2 min-h-[40px] rounded border transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 ${
                    isSelected
                      ? 'sleek-tag-selected border-[#66FCF1] text-[#66FCF1] font-semibold'
                      : 'bg-[#1F2833] border-transparent text-[#C5C6C7] hover:border-[#45A29E]'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#66FCF1] shrink-0" />}
                  <span>{texture}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Tag Input */}
        <div>
          <label className="block text-xs font-semibold text-[#45A29E] uppercase mb-1.5">
            Additional Style Tags or Reference Artists (Optional):
          </label>
          <input
            type="text"
            placeholder="e.g. 808 Mafia style, atmospheric synth pad, heavy bounce"
            value={sunoParams.customStyleText}
            onChange={(e) => setSunoParams({ ...sunoParams, customStyleText: e.target.value })}
            className="w-full bg-[#0B0C10] border border-[#1F2833] rounded-xl px-4 py-3 min-h-[48px] text-base sm:text-sm text-white focus:outline-none focus:border-[#66FCF1]"
          />
        </div>

        {/* Generated Suno Style Prompt Result Card */}
        <div className="bg-[#0B0C10] border border-[#45A29E]/50 rounded-xl p-4 sm:p-5 relative glow-cyan">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#66FCF1] shrink-0" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#66FCF1]">
                Constructed Suno Style String
              </span>
            </div>
            <span className="text-[10px] text-[#C5C6C7] font-mono">
              Copy &amp; paste into Suno "Style of Music"
            </span>
          </div>

          <div className="output-box-sleek text-xs sm:text-sm text-white leading-relaxed break-words min-h-[50px] p-3 flex items-center select-all">
            {generatedPrompt}
          </div>

          {/* Touch-Friendly Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 mt-4">
            <button
              type="button"
              onClick={handleCopy}
              className={`w-full flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 min-h-[48px] rounded-lg text-xs font-bold uppercase tracking-wider transition-all active:scale-95 cursor-pointer ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#45A29E] text-[#0B0C10] hover:bg-[#66FCF1] hover:text-[#0B0C10]'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Prompt Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Suno Prompt</span>
                </>
              )}
            </button>

            <a
              href="https://suno.com/create"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 min-h-[48px] rounded-lg bg-transparent hover:bg-[#1F2833] text-[#66FCF1] text-xs font-bold uppercase tracking-wider border border-[#66FCF1] transition-all active:scale-95 cursor-pointer"
            >
              <span>Access Suno Engine</span>
              <ExternalLink className="w-4 h-4 text-[#66FCF1]" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
