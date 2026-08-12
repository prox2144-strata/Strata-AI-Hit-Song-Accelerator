export interface SunoPromptParams {
  genre: string;
  mood: string;
  bpm: string;
  textures: string[];
  customStyleText: string;
}

export interface GeminiPromptParams {
  flowStyle: string;
  songStructure: string;
  rhymeDensity: string;
  topic: string;
  artistVibe: string;
  customAudioDetails: string;
}

export interface TokenSubmission {
  tokenId: string;
  userName: string;
  userEmail: string;
  songTitle: string;
  stemsUrl: string;
  notes: string;
  submittedAt: string;
  status: string;
  estimatedTurnaround: string;
}

export interface ToastNotification {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'error';
}

export type ActivePhase = 'all' | 'phase1' | 'phase2' | 'phase3' | 'phase5';
