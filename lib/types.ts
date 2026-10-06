export interface DocumentItem {
  id: string;
  label: string; // e.g., "Belge 1"
  title: string;
  content: string;
}

export interface InterviewMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  citedDocument?: string;
  timestamp: number;
}

export interface NewspaperArticle {
  gazeteAdi?: string;
  tarih?: string;
  sayi?: string;
  manset: string;
  spot: string;
  haberMetni: string;
  alintilar: Array<{
    metin: string;
    belge: string;
  }>;
  kontrolSorulari: string[]; // exactly 3 questions
}

export interface PodcastDialogueTurn {
  speaker: 'Muhabir' | 'Tarihçi';
  text: string;
}

export interface PodcastResult {
  title: string;
  dialogue: PodcastDialogueTurn[];
  audioBase64?: string; // base64 wav if TTS succeeded
  audioMimeType?: string;
  durationEstimateSeconds?: number;
}
