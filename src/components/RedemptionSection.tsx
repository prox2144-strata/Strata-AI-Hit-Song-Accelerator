import React, { useState, useEffect } from 'react';
import { TokenSubmission } from '../types';
import { Flame, Send, CheckCircle2, ShieldCheck, Clock, FileAudio, ExternalLink, RefreshCw } from 'lucide-react';

interface RedemptionSectionProps {
  onCopy: (text: string, message: string) => void;
  onPhaseComplete: () => void;
}

export const RedemptionSection: React.FC<RedemptionSectionProps> = ({
  onCopy,
  onPhaseComplete,
}) => {
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [songTitle, setSongTitle] = useState('');
  const [stemsUrl, setStemsUrl] = useState('');
  const [notes, setNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeSubmission, setActiveSubmission] = useState<TokenSubmission | null>(null);
  const [pastSubmissions, setPastSubmissions] = useState<TokenSubmission[]>([]);

  // Load past submissions from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('platinum_mix_submissions');
      if (saved) {
        setPastSubmissions(JSON.parse(saved));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleSubmitToken = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userName || !userEmail || !songTitle || !stemsUrl) {
      alert('Please fill out all required fields: Name, Email, Song Title, and Stems URL.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/redeem-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName,
          userEmail,
          songTitle,
          stemsUrl,
          notes,
        }),
      });

      const data = await res.json();

      if (data.success && data.submission) {
        const newSub: TokenSubmission = data.submission;
        setActiveSubmission(newSub);

        const updatedHistory = [newSub, ...pastSubmissions];
        setPastSubmissions(updatedHistory);
        localStorage.setItem('platinum_mix_submissions', JSON.stringify(updatedHistory));

        onCopy(newSub.tokenId, `Mix Token redeemed! Confirmation Code: ${newSub.tokenId}`);
        onPhaseComplete();

        // Clear inputs
        setSongTitle('');
        setStemsUrl('');
        setNotes('');
      } else {
        alert(data.error || 'Failed to process token submission.');
      }
    } catch (err) {
      console.error(err);
      alert('Error submitting mix token. Please check your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-[#12141C] border border-[#1F2833] rounded-2xl overflow-hidden shadow-xl relative">
      {/* Background Accent Flame Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Sleek Card Header */}
      <div className="card-sleek-header p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1F2833]">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[#0B0C10] border border-amber-500/40 text-amber-400">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase text-amber-400 tracking-wider">
                PHASE 05
              </span>
              <span className="status-dot"></span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-wide uppercase">
              REDEMPTION &amp; SCRATCHPAD
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs bg-[#0B0C10] px-3 py-1.5 rounded-lg border border-[#1F2833] text-gray-300">
          <ShieldCheck className="w-4 h-4 text-[#66FCF1]" />
          <span>1x Token Included in Package</span>
        </div>
      </div>

      <div className="p-4 sm:p-6 space-y-5 sm:space-y-6">
        {/* Active Submission Confirmation Banner */}
        {activeSubmission && (
          <div className="bg-[#0B0C10] border border-[#66FCF1] rounded-xl p-4 sm:p-5 glow-mint animate-fade-in">
            <div className="flex items-start justify-between gap-3 mb-3 pb-3 border-b border-[#1F2833]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-[#66FCF1] shrink-0" />
                <div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    Platinum Mix Token Redeemed!
                  </h3>
                  <p className="text-xs text-[#66FCF1] font-mono break-all">
                    Token Confirmation ID: {activeSubmission.tokenId}
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-[#1F2833] text-[#66FCF1] border border-[#45A29E]/40 shrink-0">
                {activeSubmission.status}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-gray-300 mb-4">
              <div className="p-2.5 bg-[#12141C] rounded-lg border border-[#1F2833]">
                <span className="text-gray-400 block text-[10px]">Song Title:</span>
                <span className="font-semibold text-white break-words">{activeSubmission.songTitle}</span>
              </div>
              <div className="p-2.5 bg-[#12141C] rounded-lg border border-[#1F2833]">
                <span className="text-gray-400 block text-[10px]">Artist / Email:</span>
                <span className="font-semibold text-white break-all">{activeSubmission.userName} ({activeSubmission.userEmail})</span>
              </div>
              <div className="p-2.5 bg-[#12141C] rounded-lg border border-[#1F2833]">
                <span className="text-gray-400 block text-[10px]">Estimated Turnaround:</span>
                <span className="font-semibold text-[#66FCF1] flex items-center gap-1">
                  <Clock className="w-3 h-3 shrink-0" />
                  {activeSubmission.estimatedTurnaround}
                </span>
              </div>
            </div>

            <p className="text-xs text-gray-400 italic leading-relaxed">
              Our head mixing engineer at tjbpro.ai has received your vocal stems. You will receive progress updates and the final mastered WAV track directly to {activeSubmission.userEmail}.
            </p>
          </div>
        )}

        {/* Submission Form */}
        <form onSubmit={handleSubmitToken} className="space-y-4 sm:space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {/* User Name */}
            <div>
              <label className="block text-xs font-semibold text-[#45A29E] uppercase mb-1.5">
                Artist / User Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Marcus Vance"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full bg-[#0B0C10] border border-[#1F2833] rounded-xl px-4 py-3 min-h-[48px] text-base sm:text-sm text-white focus:outline-none focus:border-[#66FCF1]"
              />
            </div>

            {/* User Email */}
            <div>
              <label className="block text-xs font-semibold text-[#45A29E] uppercase mb-1.5">
                Email Address *
              </label>
              <input
                type="email"
                required
                placeholder="e.g. artist@tjbpro.ai"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                className="w-full bg-[#0B0C10] border border-[#1F2833] rounded-xl px-4 py-3 min-h-[48px] text-base sm:text-sm text-white focus:outline-none focus:border-[#66FCF1]"
              />
            </div>

            {/* Song Title */}
            <div>
              <label className="block text-xs font-semibold text-[#45A29E] uppercase mb-1.5">
                Song Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Platinum Elevation (AI Cover)"
                value={songTitle}
                onChange={(e) => setSongTitle(e.target.value)}
                className="w-full bg-[#0B0C10] border border-[#1F2833] rounded-xl px-4 py-3 min-h-[48px] text-base sm:text-sm text-white focus:outline-none focus:border-[#66FCF1]"
              />
            </div>

            {/* Google Drive / Dropbox Stems Link */}
            <div>
              <label className="block text-xs font-semibold text-[#45A29E] uppercase mb-1.5 flex items-center gap-1">
                <FileAudio className="w-3.5 h-3.5 shrink-0" />
                Platinum Mix Token (Google Drive / Dropbox Link) *
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  required
                  placeholder="https://drive.google.com/drive/folders/..."
                  value={stemsUrl}
                  onChange={(e) => setStemsUrl(e.target.value)}
                  className="w-full bg-[#0B0C10] border border-[#1F2833] rounded-xl px-4 py-3 min-h-[48px] text-base sm:text-sm text-white focus:outline-none focus:border-[#66FCF1]"
                />
              </div>
              <span className="text-[10px] text-gray-400 mt-1 block">
                Ensure folder access permission is set to "Anyone with the link".
              </span>
            </div>
          </div>

          {/* Notes / Reference tracks */}
          <div>
            <label className="block text-xs font-semibold text-[#45A29E] uppercase mb-1.5">
              Mixing / Vocal Processing Notes (Optional):
            </label>
            <textarea
              rows={3}
              placeholder="Specify vocal tuning preferences (Auto-Tune style, light pitch correction), reverb tail length, double stacks, or reference song links..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-[#0B0C10] border border-[#1F2833] rounded-xl p-3.5 text-xs sm:text-sm text-white focus:outline-none focus:border-[#66FCF1] resize-none"
            />
          </div>

          {/* Submit Token Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 min-h-[52px] rounded-lg bg-[#45A29E] hover:bg-[#66FCF1] text-[#0B0C10] font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Redeeming Token...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Redeem Platinum Mix Token</span>
              </>
            )}
          </button>
        </form>

        {/* Local History of Past Submissions */}
        {pastSubmissions.length > 0 && (
          <div className="pt-4 border-t border-[#1F2833]">
            <h3 className="text-xs font-bold uppercase text-[#C5C6C7] tracking-wider mb-3">
              Redemption History ({pastSubmissions.length})
            </h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {pastSubmissions.map((sub) => (
                <div
                  key={sub.tokenId}
                  className="bg-[#0B0C10] p-3 rounded-xl border border-[#1F2833] flex items-center justify-between gap-2 text-xs"
                >
                  <div className="min-w-0 flex-1">
                    <span className="font-bold text-white block truncate">{sub.songTitle}</span>
                    <span className="text-[10px] text-[#66FCF1] font-mono block truncate">{sub.tokenId}</span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#1F2833] text-emerald-400 font-semibold block">
                      {sub.status}
                    </span>
                    <span className="text-[10px] text-gray-500">
                      {new Date(sub.submittedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
