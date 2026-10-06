'use client';

import React, { useState } from 'react';
import { NewspaperArticle, PodcastResult, DocumentItem, InterviewMessage } from '@/lib/types';
import { NewspaperView } from './NewspaperView';
import { PodcastView } from './PodcastView';
import { Newspaper, Mic, Sparkles, Loader2, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';

interface PublicationSectionProps {
  documents: DocumentItem[];
  messages: InterviewMessage[];
  newspaper: NewspaperArticle | null;
  setNewspaper: React.Dispatch<React.SetStateAction<NewspaperArticle | null>>;
  podcast: PodcastResult | null;
  setPodcast: React.Dispatch<React.SetStateAction<PodcastResult | null>>;
}

export function PublicationSection({
  documents,
  messages,
  newspaper,
  setNewspaper,
  podcast,
  setPodcast,
}: PublicationSectionProps) {
  const [activeSubTab, setActiveSubTab] = useState<'newspaper' | 'podcast'>('newspaper');
  const [loadingNewspaper, setLoadingNewspaper] = useState(false);
  const [loadingPodcast, setLoadingPodcast] = useState(false);
  const [newspaperError, setNewspaperError] = useState<string | null>(null);
  const [podcastError, setPodcastError] = useState<string | null>(null);

  // Generate Newspaper
  const handleGenerateNewspaper = async () => {
    setLoadingNewspaper(true);
    setNewspaperError(null);
    try {
      const docTexts = documents.map(d => d.content);
      const res = await fetch('/api/newspaper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documents: docTexts,
          interviewHistory: messages,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Gazete sayfası oluşturulamadı.');
      }

      const article: NewspaperArticle = await res.json();
      setNewspaper(article);
      setActiveSubTab('newspaper');
    } catch (err: unknown) {
      console.error(err);
      const msg = err instanceof Error ? err.message : 'Gazete üretimi sırasında bir hata oluştu.';
      setNewspaperError(msg);
    } finally {
      setLoadingNewspaper(false);
    }
  };

  // Generate Podcast
  const handleGeneratePodcast = async () => {
    setLoadingPodcast(true);
    setPodcastError(null);
    try {
      const docTexts = documents.map(d => d.content);
      const res = await fetch('/api/podcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          newspaperData: newspaper,
          documents: docTexts,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Podcast oluşturulamadı.');
      }

      const podcastData: PodcastResult = await res.json();
      setPodcast(podcastData);
      setActiveSubTab('podcast');
    } catch (err: unknown) {
      console.error(err);
      const msg = err instanceof Error ? err.message : 'Podcast üretimi sırasında bir hata oluştu.';
      setPodcastError(msg);
    } finally {
      setLoadingPodcast(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Header Card with the Two Requested Buttons */}
      <div className="bg-[#f5efe4] border border-[#e2d5c3] rounded-xl p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#e7dbca] text-[#6b4e33] mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#8a2522]" />
              Bölüm 3: Yayın Masası
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#2a1d15]">
              Gazete ve Podcast Yayın Merkezi
            </h2>
            <p className="text-sm text-[#665444] mt-1 max-w-2xl">
              İncelenen birincil belgeler ve yapılan röportaj ışığında; 1919 dönemi tarihî gazete sayfası basın veya çift sesli 1 dakikalık eğitici podcast üretin.
            </p>
          </div>

          {/* TWO MAIN BUTTONS REQUIRED BY THE PROMPT */}
          <div className="flex flex-wrap sm:flex-nowrap gap-3 shrink-0">
            {/* 1. Gazete Sayfası Yap */}
            <button
              onClick={handleGenerateNewspaper}
              disabled={loadingNewspaper}
              className="flex-1 sm:flex-initial px-5 py-3 rounded-xl font-serif font-bold text-sm bg-[#8a2522] hover:bg-[#721e1b] text-[#ffffff] shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loadingNewspaper ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Gazete Diziliyor...</span>
                </>
              ) : (
                <>
                  <Newspaper className="w-5 h-5" />
                  <span>Gazete Sayfası Yap</span>
                </>
              )}
            </button>

            {/* 2. Podcast Yap */}
            <button
              onClick={handleGeneratePodcast}
              disabled={loadingPodcast}
              className="flex-1 sm:flex-initial px-5 py-3 rounded-xl font-serif font-bold text-sm bg-[#223344] hover:bg-[#1a2836] text-[#ffffff] shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loadingPodcast ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Podcast Seslendiriliyor...</span>
                </>
              ) : (
                <>
                  <Mic className="w-5 h-5 text-[#f59e0b]" />
                  <span>Podcast Yap</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* View Switcher Tabs (If at least one is generated) */}
        {(newspaper || podcast) && (
          <div className="mt-5 pt-4 border-t border-[#dfd2be] flex items-center gap-2">
            <span className="text-xs font-semibold text-[#735e4d] mr-2">
              Görüntüleme Seçeneği:
            </span>
            <button
              onClick={() => setActiveSubTab('newspaper')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeSubTab === 'newspaper'
                  ? 'bg-[#ffffff] text-[#8a2522] border border-[#d6c7b3] shadow-xs'
                  : 'text-[#614e3d] hover:bg-[#ede3d3]'
              }`}
            >
              <Newspaper className="w-3.5 h-3.5" />
              <span>1919 Gazete Görünümü</span>
              {newspaper && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
            </button>

            <button
              onClick={() => setActiveSubTab('podcast')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeSubTab === 'podcast'
                  ? 'bg-[#223344] text-[#ffffff] shadow-xs'
                  : 'text-[#614e3d] hover:bg-[#ede3d3]'
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
              <span>Podcast Stüdyosu</span>
              {podcast && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
            </button>
          </div>
        )}
      </div>

      {/* Error notices */}
      {newspaperError && (
        <div className="p-4 bg-[#fef2f2] border border-[#fecaca] rounded-xl text-xs text-[#991b1b] flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{newspaperError}</span>
        </div>
      )}

      {podcastError && (
        <div className="p-4 bg-[#fef2f2] border border-[#fecaca] rounded-xl text-xs text-[#991b1b] flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{podcastError}</span>
        </div>
      )}

      {/* Main Content Area */}
      {activeSubTab === 'newspaper' ? (
        newspaper ? (
          <NewspaperView
            newspaper={newspaper}
            onRegenerate={handleGenerateNewspaper}
            isGenerating={loadingNewspaper}
          />
        ) : (
          <div className="bg-[#ffffff] border-2 border-dashed border-[#dcd1be] rounded-2xl p-12 text-center max-w-xl mx-auto my-6">
            <div className="w-16 h-16 rounded-full bg-[#f8f4ec] text-[#8a2522] flex items-center justify-center mx-auto mb-4 border border-[#e4d8c6]">
              <Newspaper className="w-8 h-8" />
            </div>
            <h3 className="font-serif font-bold text-xl text-[#2a1d15]">
              Henüz Gazete Sayfası Basılmadı
            </h3>
            <p className="text-xs sm:text-sm text-[#736353] mt-2 mb-6 max-w-md mx-auto">
              Yukarıdaki <strong>&quot;Gazete Sayfası Yap&quot;</strong> düğmesine basarak 1919 dönemi gazete mizanpajında manşet, spot, haber metni, birebir alıntılar ve 3 kontrol sorusu içeren sayfayı oluşturabilirsiniz.
            </p>
            <button
              onClick={handleGenerateNewspaper}
              disabled={loadingNewspaper}
              className="px-6 py-2.5 bg-[#8a2522] hover:bg-[#721e1b] text-[#ffffff] font-semibold text-sm rounded-lg shadow-md transition-all inline-flex items-center gap-2"
            >
              {loadingNewspaper ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Hazırlanıyor...</span>
                </>
              ) : (
                <>
                  <Newspaper className="w-4 h-4" />
                  <span>Şimdi Gazete Sayfası Yap</span>
                </>
              )}
            </button>
          </div>
        )
      ) : podcast ? (
        <PodcastView
          podcast={podcast}
          onRegenerate={handleGeneratePodcast}
          isGenerating={loadingPodcast}
        />
      ) : (
        <div className="bg-[#ffffff] border-2 border-dashed border-[#dcd1be] rounded-2xl p-12 text-center max-w-xl mx-auto my-6">
          <div className="w-16 h-16 rounded-full bg-[#f0f4f8] text-[#223344] flex items-center justify-center mx-auto mb-4 border border-[#d6e0ea]">
            <Mic className="w-8 h-8" />
          </div>
          <h3 className="font-serif font-bold text-xl text-[#1a2530]">
            Henüz Podcast Kaydı Alınmadı
          </h3>
          <p className="text-xs sm:text-sm text-[#5f7182] mt-2 mb-6 max-w-md mx-auto">
            Yukarıdaki <strong>&quot;Podcast Yap&quot;</strong> düğmesine basarak Muhabir ve Tarihçi arasında geçen 1 dakikalık çift sesli eğitici podcast oluşturabilirsiniz.
          </p>
          <button
            onClick={handleGeneratePodcast}
            disabled={loadingPodcast}
            className="px-6 py-2.5 bg-[#223344] hover:bg-[#1a2836] text-[#ffffff] font-semibold text-sm rounded-lg shadow-md transition-all inline-flex items-center gap-2"
          >
            {loadingPodcast ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Kaydediliyor...</span>
              </>
            ) : (
              <>
                <Mic className="w-4 h-4 text-[#f59e0b]" />
                <span>Şimdi Podcast Yap</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
