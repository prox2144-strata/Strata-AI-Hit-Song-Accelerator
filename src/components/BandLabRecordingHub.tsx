import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  ExternalLink,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  Type,
  Square,
  Radio,
  Sliders,
  Download,
  CheckCircle2,
  ListMusic,
  Maximize2,
  Minimize2,
} from 'lucide-react';

interface BandLabRecordingHubProps {
  onCopy: (text: string, message: string) => void;
  onPhaseComplete: () => void;
  lyricsText: string;
  setLyricsText: (text: string) => void;
}

export const BandLabRecordingHub: React.FC<BandLabRecordingHubProps> = ({
  onCopy,
  onPhaseComplete,
  lyricsText,
  setLyricsText,
}) => {
  // Teleprompter State
  const [isPlaying, setIsPlaying] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState(2); // 1 to 5
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg' | 'xl'>('md');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const teleprompterRef = useRef<HTMLDivElement>(null);

  // Voice Recording Rehearsal State
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);

  // Metronome State
  const [metronomeBpm, setMetronomeBpm] = useState(120);
  const [isMetronomeActive, setIsMetronomeActive] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const metronomeIntervalRef = useRef<any>(null);

  // Auto Scroll Effect for Teleprompter
  useEffect(() => {
    let scrollInterval: any = null;
    if (isPlaying && teleprompterRef.current) {
      scrollInterval = setInterval(() => {
        if (teleprompterRef.current) {
          teleprompterRef.current.scrollTop += scrollSpeed;
          // Loop or stop at bottom
          if (
            teleprompterRef.current.scrollTop + teleprompterRef.current.clientHeight >=
            teleprompterRef.current.scrollHeight - 5
          ) {
            setIsPlaying(false);
          }
        }
      }, 50);
    }
    return () => {
      if (scrollInterval) clearInterval(scrollInterval);
    };
  }, [isPlaying, scrollSpeed]);

  const handleResetScroll = () => {
    setIsPlaying(false);
    if (teleprompterRef.current) {
      teleprompterRef.current.scrollTop = 0;
    }
  };

  // Rehearsal Mic Recording Handler
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
      onPhaseComplete();
    } catch (err) {
      console.error(err);
      alert('Microphone access denied or not available.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
      // Stop media stream tracks
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
    }
  };

  // Metronome Beep Generator
  const toggleMetronome = () => {
    if (isMetronomeActive) {
      setIsMetronomeActive(false);
      if (metronomeIntervalRef.current) clearInterval(metronomeIntervalRef.current);
    } else {
      setIsMetronomeActive(true);
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const intervalMs = (60 / metronomeBpm) * 1000;
      metronomeIntervalRef.current = setInterval(() => {
        if (audioCtxRef.current) {
          const osc = audioCtxRef.current.createOscillator();
          const gain = audioCtxRef.current.createGain();
          osc.frequency.value = 800;
          gain.gain.value = 0.2;
          osc.connect(gain);
          gain.connect(audioCtxRef.current.destination);
          osc.start();
          osc.stop(audioCtxRef.current.currentTime + 0.05);
        }
      }, intervalMs);
    }
  };

  // Font size mapping for teleprompter
  const fontSizeClasses = {
    sm: 'text-xs leading-relaxed',
    md: 'text-sm sm:text-base leading-relaxed',
    lg: 'text-lg sm:text-xl leading-loose font-medium',
    xl: 'text-2xl sm:text-3xl leading-loose font-bold',
  };

  return (
    <section className="bg-[#12141C] border border-[#1F2833] rounded-2xl overflow-hidden shadow-xl relative">
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#45A29E]/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Sleek Card Header */}
      <div className="card-sleek-header p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1F2833]">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[#0B0C10] border border-[#66FCF1]/40 text-[#66FCF1] shrink-0">
            <Mic className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase text-[#66FCF1] tracking-wider">
                PHASE 03 &amp; 04
              </span>
              <span className="status-dot"></span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-wide uppercase">
              BANDLAB STUDIO &amp; RECORDING HUB
            </h2>
          </div>
        </div>

        <a
          href="https://www.bandlab.com/studio"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 min-h-[48px] rounded-lg bg-[#45A29E] hover:bg-[#66FCF1] text-[#0B0C10] text-xs font-bold uppercase tracking-wider transition-all active:scale-95 cursor-pointer"
        >
          <span>Open BandLab Studio</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      <div className="p-4 sm:p-6 space-y-5 sm:space-y-6">
        {/* Guided Step Cards for DAW Setup - Vertical Stack on Mobile */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          <div className="bg-[#0B0C10] p-3.5 sm:p-4 rounded-xl border border-[#1F2833] relative">
            <span className="absolute top-3 right-3 text-[10px] font-mono px-2 py-0.5 rounded bg-[#1F2833] text-[#66FCF1]">
              01
            </span>
            <Download className="w-5 h-5 text-[#45A29E] mb-2" />
            <h3 className="text-xs font-bold text-white uppercase mb-1">
              Import Suno Instrumental (WAV)
            </h3>
            <p className="text-xs text-[#C5C6C7] leading-relaxed">
              Download high-bitrate WAV or MP3 beat generated in Phase 01 from Suno.
            </p>
          </div>

          <div className="bg-[#0B0C10] p-3.5 sm:p-4 rounded-xl border border-[#1F2833] relative">
            <span className="absolute top-3 right-3 text-[10px] font-mono px-2 py-0.5 rounded bg-[#1F2833] text-[#66FCF1]">
              02
            </span>
            <ListMusic className="w-5 h-5 text-[#66FCF1] mb-2" />
            <h3 className="text-xs font-bold text-white uppercase mb-1">
              Set Session BPM &amp; Key
            </h3>
            <p className="text-xs text-[#C5C6C7] leading-relaxed">
              Drag beat into BandLab Studio &amp; align DAW project BPM to match your beat.
            </p>
          </div>

          <div className="bg-[#0B0C10] p-3.5 sm:p-4 rounded-xl border border-[#1F2833] relative">
            <span className="absolute top-3 right-3 text-[10px] font-mono px-2 py-0.5 rounded bg-[#1F2833] text-[#66FCF1]">
              03
            </span>
            <CheckCircle2 className="w-5 h-5 text-emerald-400 mb-2" />
            <h3 className="text-xs font-bold text-white uppercase mb-1">
              Enable Monitoring &amp; Record Stems
            </h3>
            <p className="text-xs text-[#C5C6C7] leading-relaxed">
              Create lead vocal tracks, record dry vocals with low latency monitoring &amp; export stems.
            </p>
          </div>
        </div>

        {/* Interactive Teleprompter & Rehearsal Hub */}
        <div
          className={`bg-[#0B0C10] border border-[#1F2833] rounded-xl p-3.5 sm:p-5 transition-all ${
            isFullscreen ? 'fixed inset-2 z-50 overflow-auto bg-[#0B0C10] border-[#66FCF1]' : ''
          }`}
        >
          {/* Teleprompter Top Toolbar */}
          <div className="flex flex-col gap-3 pb-3.5 border-b border-[#1F2833] mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-[#66FCF1] animate-pulse shrink-0" />
                <span className="text-xs font-bold uppercase text-white tracking-wider">
                  Teleprompter &amp; Lyric Scratchpad
                </span>
              </div>

              {/* Fullscreen Toggle */}
              <button
                type="button"
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2.5 rounded-lg bg-[#12141C] border border-[#1F2833] text-gray-300 hover:text-white cursor-pointer active:scale-95 shrink-0"
                title="Toggle Fullscreen Teleprompter"
              >
                {isFullscreen ? (
                  <Minimize2 className="w-4 h-4 text-[#66FCF1]" />
                ) : (
                  <Maximize2 className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Teleprompter Control Toolbar - Mobile Scrollable/Wrap */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {/* Play / Pause Auto Scroll */}
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className={`px-4 py-2.5 min-h-[44px] rounded-lg font-bold flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 ${
                  isPlaying
                    ? 'bg-amber-500 text-black'
                    : 'bg-[#45A29E] text-[#0B0C10] hover:bg-[#66FCF1]'
                }`}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isPlaying ? 'Pause' : 'Auto Scroll'}</span>
              </button>

              {/* Reset Scroll */}
              <button
                type="button"
                onClick={handleResetScroll}
                className="px-3 py-2.5 min-h-[44px] rounded-lg bg-[#12141C] border border-[#1F2833] text-gray-300 hover:text-white cursor-pointer active:scale-95 flex items-center gap-1.5"
                title="Reset Scroll Position"
              >
                <RotateCcw className="w-4 h-4" />
                <span className="text-[11px] font-semibold">Reset</span>
              </button>

              {/* Speed Slider */}
              <div className="flex items-center gap-2 bg-[#12141C] border border-[#1F2833] px-3 py-2 min-h-[44px] rounded-lg">
                <span className="text-[11px] text-gray-400">Speed:</span>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={scrollSpeed}
                  onChange={(e) => setScrollSpeed(Number(e.target.value))}
                  className="w-16 accent-[#66FCF1]"
                />
                <span className="text-[11px] font-mono text-[#66FCF1]">{scrollSpeed}x</span>
              </div>

              {/* Font Size Toggles */}
              <div className="flex items-center gap-1 bg-[#12141C] border border-[#1F2833] p-1.5 min-h-[44px] rounded-lg">
                <Type className="w-3.5 h-3.5 text-gray-400 ml-1 shrink-0" />
                {(['sm', 'md', 'lg', 'xl'] as const).map((size) => (
                  <button
                    key={size}
                    onClick={() => setFontSize(size)}
                    className={`px-2.5 py-1.5 rounded text-[11px] uppercase font-bold transition-all cursor-pointer active:scale-95 ${
                      fontSize === size
                        ? 'bg-[#1F2833] text-[#66FCF1]'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Teleprompter Display Screen */}
          <div
            ref={teleprompterRef}
            className={`w-full bg-[#000000]/60 border border-[#1F2833] rounded-lg p-3.5 sm:p-4 overflow-y-auto transition-all ${
              isFullscreen ? 'h-[calc(100vh-220px)]' : 'h-72'
            }`}
          >
            <textarea
              value={lyricsText}
              onChange={(e) => setLyricsText(e.target.value)}
              placeholder="Paste or write your lyrics here... Click Auto Scroll above to read in real time during vocal recording!"
              className={`w-full h-full bg-transparent text-[#66FCF1] focus:outline-none resize-none font-mono ${fontSizeClasses[fontSize]}`}
            />
          </div>

          {/* Rehearsal Microphone & Metronome Bar - Single Column on Mobile */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-[#1F2833]">
            {/* Microphone Rehearsal Recorder */}
            <div className="bg-[#12141C] p-3.5 rounded-xl border border-[#1F2833] flex flex-col justify-between gap-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold uppercase text-[#66FCF1] flex items-center gap-1.5">
                  <Mic className="w-3.5 h-3.5 shrink-0" />
                  Vocal Cadence Test Mic
                </span>
                {isRecording && (
                  <span className="inline-flex items-center gap-1 text-xs text-red-400 animate-pulse font-mono font-bold">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                    {recordingTime}s Recording...
                  </span>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {!isRecording ? (
                  <button
                    type="button"
                    onClick={startRecording}
                    className="w-full sm:w-auto px-4 py-3 min-h-[44px] rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
                  >
                    <Radio className="w-4 h-4" />
                    <span>Record Vocal Test</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={stopRecording}
                    className="w-full sm:w-auto px-4 py-3 min-h-[44px] rounded-lg bg-gray-700 hover:bg-gray-600 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
                  >
                    <Square className="w-4 h-4 text-red-400" />
                    <span>Stop Recording</span>
                  </button>
                )}

                {audioUrl && (
                  <audio controls src={audioUrl} className="h-10 w-full flex-1" />
                )}
              </div>
            </div>

            {/* Rhythm Metronome */}
            <div className="bg-[#12141C] p-3.5 rounded-xl border border-[#1F2833] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold uppercase text-[#66FCF1] block mb-1">
                  Studio Metronome
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="60"
                    max="200"
                    value={metronomeBpm}
                    onChange={(e) => setMetronomeBpm(Number(e.target.value))}
                    className="w-20 bg-[#0B0C10] border border-[#1F2833] rounded-lg px-2.5 py-2 min-h-[40px] text-xs text-center text-white font-mono focus:border-[#66FCF1]"
                  />
                  <span className="text-xs text-gray-400">BPM</span>
                </div>
              </div>

              <button
                type="button"
                onClick={toggleMetronome}
                className={`w-full sm:w-auto px-4 py-3 min-h-[44px] rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 ${
                  isMetronomeActive
                    ? 'bg-amber-500 text-black'
                    : 'bg-[#1F2833] text-[#66FCF1] hover:bg-gray-700 border border-[#45A29E]/30'
                }`}
              >
                <Volume2 className="w-4 h-4" />
                <span>{isMetronomeActive ? 'Stop Click' : 'Start Metronome'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
