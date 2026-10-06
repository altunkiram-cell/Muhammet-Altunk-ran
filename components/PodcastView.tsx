'use client';

import React, { useState, useEffect, useRef } from 'react';
import { PodcastResult } from '@/lib/types';
import { Play, Pause, RotateCcw, Volume2, Download, Mic, BookOpen, Sparkles, Check, Headphones, AlertTriangle } from 'lucide-react';

interface PodcastViewProps {
  podcast: PodcastResult;
  onRegenerate: () => void;
  isGenerating: boolean;
}

export function PodcastView({
  podcast,
  onRegenerate,
  isGenerating,
}: PodcastViewProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTurnIndex, setActiveTurnIndex] = useState<number>(-1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(60);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const browserUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Directly derive data URL from audioBase64 without cascading renders
  const audioUrl = React.useMemo(() => {
    if (!podcast.audioBase64) return null;
    const mime = podcast.audioMimeType || 'audio/wav';
    return `data:${mime};base64,${podcast.audioBase64}`;
  }, [podcast.audioBase64, podcast.audioMimeType]);

  const useBrowserTTS = !audioUrl;

  // Audio element timeupdate
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      setCurrentTime(current);
      const total = audioRef.current.duration || 60;
      setDuration(total);

      // Map current time to dialogue turn roughly
      const turnsCount = podcast.dialogue.length;
      if (turnsCount > 0 && total > 0) {
        const fraction = current / total;
        const turnIdx = Math.min(
          Math.floor(fraction * turnsCount),
          turnsCount - 1
        );
        setActiveTurnIndex(turnIdx);
      }
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    setActiveTurnIndex(-1);
    setCurrentTime(0);
  };

  // Play / Pause toggle
  const togglePlay = () => {
    if (useBrowserTTS || !audioUrl) {
      // Use browser SpeechSynthesis
      if (isPlaying) {
        window.speechSynthesis.cancel();
        setIsPlaying(false);
        setActiveTurnIndex(-1);
      } else {
        playWithBrowserTTS();
      }
      return;
    }

    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().catch(e => {
          console.error(e);
          // fallback to browser TTS if audio playback fails
          playWithBrowserTTS();
        });
        setIsPlaying(true);
      }
    }
  };

  // Browser TTS fallback player
  const playWithBrowserTTS = () => {
    if (!('speechSynthesis' in window)) {
      alert('Tarayıcınız ses sentezini desteklemiyor.');
      return;
    }

    window.speechSynthesis.cancel();
    setIsPlaying(true);

    const turns = podcast.dialogue;
    let turnIndex = 0;

    const playNextTurn = () => {
      if (turnIndex >= turns.length) {
        setIsPlaying(false);
        setActiveTurnIndex(-1);
        return;
      }

      setActiveTurnIndex(turnIndex);
      const turn = turns[turnIndex];
      const isMuhabir = turn.speaker === 'Muhabir';

      const utterance = new SpeechSynthesisUtterance(turn.text);
      utterance.lang = 'tr-TR';
      // Distinct pitch and rate for the two personas
      utterance.pitch = isMuhabir ? 1.15 : 0.85;
      utterance.rate = isMuhabir ? 1.05 : 0.95;

      utterance.onend = () => {
        turnIndex++;
        playNextTurn();
      };

      utterance.onerror = () => {
        setIsPlaying(false);
        setActiveTurnIndex(-1);
      };

      browserUtteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    };

    playNextTurn();
  };

  // Stop any playing audio on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = Math.floor(secs % 60);
    return `${mins}:${remainder < 10 ? '0' : ''}${remainder}`;
  };

  return (
    <div className="space-y-6">
      {/* Studio Header Card */}
      <div className="bg-[#1c232c] text-[#f0f4f8] border border-[#2e3a47] rounded-xl p-5 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#8a2522] flex items-center justify-center text-[#ffffff] shadow-md border border-[#ad322e]">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-sm bg-[#2d3a48] text-[#86a8cc] border border-[#3f5062]">
                  1 DAKİKALIK ÖZEL YAYIN
                </span>
                <span className="text-xs text-[#a0b3c6]">&bull; Çift Sesli Kayıt</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#ffffff] mt-0.5">
                {podcast.title || 'Tarih Muhabiri Radyosu: Belgelerin Sesi'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onRegenerate}
              disabled={isGenerating}
              className="px-3 py-1.5 text-xs text-[#b8cad9] hover:text-[#ffffff] bg-[#293644] hover:bg-[#344455] rounded-lg transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Yeniden Üret</span>
            </button>

            {audioUrl && (
              <a
                href={audioUrl}
                download="tarih-muhabiri-podcast.wav"
                className="px-3 py-1.5 text-xs font-semibold bg-[#2a3847] hover:bg-[#37495c] text-[#d4e4f2] rounded-lg border border-[#44586d] transition-colors flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>İndir (WAV)</span>
              </a>
            )}
          </div>
        </div>

        {/* Audio Player Bar */}
        <div className="mt-5 pt-4 border-t border-[#2e3b4a] bg-[#151c24] rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={togglePlay}
              className="w-12 h-12 rounded-full bg-[#8a2522] hover:bg-[#a62d29] text-[#ffffff] flex items-center justify-center shadow-lg transition-transform active:scale-95 cursor-pointer"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5 ml-0.5" />
              )}
            </button>
            <div>
              <div className="text-xs font-semibold text-[#f0f4f8] flex items-center gap-2">
                <span>{isPlaying ? 'Yayın Çalıyor...' : 'Dinlemeye Başla'}</span>
                {audioUrl && !useBrowserTTS && (
                  <span className="text-[10px] text-emerald-400 bg-emerald-950/80 px-1.5 py-0.2 rounded-xs border border-emerald-700">
                    Gemini TTS Çift Ses
                  </span>
                )}
              </div>
              <div className="text-[11px] text-[#8ea4b8] font-mono mt-0.5">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>
          </div>

          {/* Hidden native audio tag */}
          {audioUrl && !useBrowserTTS && (
            <audio
              ref={audioRef}
              src={audioUrl}
              onTimeUpdate={handleTimeUpdate}
              onEnded={handleAudioEnded}
              className="hidden"
            />
          )}

          {/* Speakers Key */}
          <div className="flex items-center gap-4 text-xs font-medium text-[#c0d0e0]">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#38bdf8]" />
              <span>1. Ses: Muhabir</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" />
              <span>2. Ses: Tarihçi</span>
            </div>
          </div>
        </div>
      </div>

      {/* Podcast Dialogue Script Viewer */}
      <div className="bg-[#fcfaf7] border border-[#dcd2c2] rounded-xl p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-[#e5dcce] mb-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#8a2522]" />
            <h3 className="font-serif font-bold text-base text-[#241a13]">
              1 Dakikalık Podcast Diyalog Metni
            </h3>
          </div>
          <span className="text-xs text-[#756453]">
            {podcast.dialogue.length} Karşılıklı Konuşma Sırası
          </span>
        </div>

        <div className="space-y-3.5">
          {podcast.dialogue.map((turn, index) => {
            const isMuhabir = turn.speaker === 'Muhabir';
            const isActive = activeTurnIndex === index;

            return (
              <div
                key={index}
                className={`flex gap-3 p-3.5 rounded-xl border transition-all ${
                  isActive
                    ? isMuhabir
                      ? 'bg-[#eef8ff] border-[#38bdf8] shadow-sm ring-2 ring-[#38bdf8]/20'
                      : 'bg-[#fffbeb] border-[#f59e0b] shadow-sm ring-2 ring-[#f59e0b]/20'
                    : isMuhabir
                    ? 'bg-[#ffffff] border-[#e2d8c9]'
                    : 'bg-[#faf6ee] border-[#dfd4c4]'
                }`}
              >
                {/* Speaker Avatar Icon */}
                <div
                  className={`w-9 h-9 rounded-lg shrink-0 flex items-center justify-center font-bold text-xs shadow-2xs ${
                    isMuhabir
                      ? 'bg-[#0284c7] text-[#ffffff]'
                      : 'bg-[#b45309] text-[#ffffff]'
                  }`}
                >
                  {isMuhabir ? <Mic className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />}
                </div>

                {/* Speaker Dialogue */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-xs font-bold uppercase tracking-wide font-sans ${
                        isMuhabir ? 'text-[#0369a1]' : 'text-[#92400e]'
                      }`}
                    >
                      {turn.speaker}
                    </span>
                    <span className="text-[10px] text-[#806f5e]">
                      {isMuhabir
                        ? '(Radyo Muhabiri - Soran & Aktaran)'
                        : '(Tarihçi - Üçüncü Şahısla Açıklayan)'}
                    </span>
                    {isActive && (
                      <span className="ml-auto text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full animate-pulse">
                        Şu An Seslendiriliyor
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm font-serif text-[#201812] leading-relaxed">
                    {turn.text}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pedagogical Note */}
        <div className="mt-5 pt-3 border-t border-[#e5dcce] text-[11px] text-[#7d6b5b] flex items-center justify-between">
          <span>* Tarihçi tarihî kişileri canlandırmaz; onları birincil belgelere dayanarak üçüncü şahısla anlatır.</span>
          <span className="font-semibold text-[#8a2522]">Tarih Muhabiri Stüdyosu</span>
        </div>
      </div>
    </div>
  );
}
