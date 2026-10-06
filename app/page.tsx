'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { DocumentSection } from '@/components/DocumentSection';
import { InterviewSection } from '@/components/InterviewSection';
import { PublicationSection } from '@/components/PublicationSection';
import { DocumentItem, InterviewMessage, NewspaperArticle, PodcastResult } from '@/lib/types';
import { SAMPLE_DOCUMENT_SETS } from '@/lib/sample-documents';
import { FileText, BookOpen, Newspaper, Mic, Sparkles, HelpCircle } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'documents' | 'interview' | 'publish'>('documents');

  // Initialize with the authentic Amasya Genelgesi 1919 preset
  const [documents, setDocuments] = useState<DocumentItem[]>(() => {
    const defaultSet = SAMPLE_DOCUMENT_SETS[0];
    return defaultSet.documents.map((d, idx) => ({
      id: `init-doc-${idx + 1}`,
      label: d.label,
      title: d.title,
      content: d.content,
    }));
  });

  const [messages, setMessages] = useState<InterviewMessage[]>([]);
  const [newspaper, setNewspaper] = useState<NewspaperArticle | null>(null);
  const [podcast, setPodcast] = useState<PodcastResult | null>(null);

  const handleResetAll = () => {
    if (confirm('Tüm belgeleri ve röportaj geçmişini sıfırlamak istediğinize emin misiniz?')) {
      const defaultSet = SAMPLE_DOCUMENT_SETS[0];
      setDocuments(
        defaultSet.documents.map((d, idx) => ({
          id: `init-doc-${idx + 1}`,
          label: d.label,
          title: d.title,
          content: d.content,
        }))
      );
      setMessages([]);
      setNewspaper(null);
      setPodcast(null);
      setActiveTab('documents');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fbf8f2] text-[#2c221a]">
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        documentCount={documents.length}
        questionCount={messages.filter(m => m.role === 'user').length}
        hasNewspaper={newspaper !== null}
        hasPodcast={podcast !== null}
        onReset={handleResetAll}
      />

      {/* Hero Strip */}
      <section className="bg-gradient-to-b from-[#f2eade] to-[#fbf8f2] border-b border-[#e2d6c4] py-8 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#e9decb] text-[#5e4732] border border-[#d6c5ad] mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#8a2522]" />
            <span>Tarih Dersi Birincil Kaynak & Gazetecilik Atölyesi</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black text-[#201711] tracking-tight">
            Tarih Muhabiri
          </h1>
          <p className="mt-2.5 text-sm sm:text-base text-[#614e3e] max-w-2xl mx-auto font-sans leading-relaxed">
            Öğretmenin yüklediği birincil tarihî belgeleri inceleyen, soruları tarafsız bir muhabir gibi yanıtlayan, <strong>1919 dönemi gazete sayfası</strong> ve <strong>çift sesli 1 dakikalık podcast</strong> üreten dijital ders istasyonu.
          </p>

          {/* Quick Flow Stepper */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto mt-6">
            <button
              onClick={() => setActiveTab('documents')}
              className={`p-3 rounded-xl border text-left transition-all ${
                activeTab === 'documents'
                  ? 'bg-[#ffffff] border-[#8a2522] shadow-sm ring-2 ring-[#8a2522]/20'
                  : 'bg-[#f5efe4] border-[#ded3c1] hover:bg-[#ffffff]'
              }`}
            >
              <div className="flex items-center gap-2 font-serif font-bold text-xs sm:text-sm text-[#251a13]">
                <span className="w-5 h-5 rounded-full bg-[#8a2522] text-[#ffffff] flex items-center justify-center text-xs">
                  1
                </span>
                <span>Belgeler</span>
              </div>
              <p className="text-[11px] text-[#735e4d] mt-1 font-sans">
                2-3 tarihî belge metnini yapıştırın veya hazır setlerden seçin.
              </p>
            </button>

            <button
              onClick={() => setActiveTab('interview')}
              className={`p-3 rounded-xl border text-left transition-all ${
                activeTab === 'interview'
                  ? 'bg-[#ffffff] border-[#8a2522] shadow-sm ring-2 ring-[#8a2522]/20'
                  : 'bg-[#f5efe4] border-[#ded3c1] hover:bg-[#ffffff]'
              }`}
            >
              <div className="flex items-center gap-2 font-serif font-bold text-xs sm:text-sm text-[#251a13]">
                <span className="w-5 h-5 rounded-full bg-[#8a2522] text-[#ffffff] flex items-center justify-center text-xs">
                  2
                </span>
                <span>Röportaj</span>
              </div>
              <p className="text-[11px] text-[#735e4d] mt-1 font-sans">
                Öğrenci sorularını sorun; muhabir 3. şahısla ve belgeye dayalı yanıtlasın.
              </p>
            </button>

            <button
              onClick={() => setActiveTab('publish')}
              className={`p-3 rounded-xl border text-left transition-all ${
                activeTab === 'publish'
                  ? 'bg-[#ffffff] border-[#8a2522] shadow-sm ring-2 ring-[#8a2522]/20'
                  : 'bg-[#f5efe4] border-[#ded3c1] hover:bg-[#ffffff]'
              }`}
            >
              <div className="flex items-center gap-2 font-serif font-bold text-xs sm:text-sm text-[#251a13]">
                <span className="w-5 h-5 rounded-full bg-[#8a2522] text-[#ffffff] flex items-center justify-center text-xs">
                  3
                </span>
                <span>Yayın</span>
              </div>
              <p className="text-[11px] text-[#735e4d] mt-1 font-sans">
                1919 Gazete Sayfası Yapın veya 1 dakikalık çift sesli Podcast dinleyin.
              </p>
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        {activeTab === 'documents' && (
          <DocumentSection
            documents={documents}
            setDocuments={setDocuments}
            onContinueToInterview={() => setActiveTab('interview')}
          />
        )}

        {activeTab === 'interview' && (
          <InterviewSection
            documents={documents}
            messages={messages}
            setMessages={setMessages}
            onGoToPublish={() => setActiveTab('publish')}
          />
        )}

        {activeTab === 'publish' && (
          <PublicationSection
            documents={documents}
            messages={messages}
            newspaper={newspaper}
            setNewspaper={setNewspaper}
            podcast={podcast}
            setPodcast={setPodcast}
          />
        )}
      </main>

      {/* Historical Footer */}
      <footer className="border-t border-[#dfd5c4] bg-[#f0e8dc] py-6 px-4 text-center text-xs text-[#6e5d4e]">
        <div className="max-w-4xl mx-auto space-y-2">
          <p className="font-serif font-semibold text-[#3b2d22]">
            Tarih Muhabiri &bull; Birincil Belge Analizi ve Medya Okuryazarlığı Dersi
          </p>
          <p className="text-[11px] text-[#806f5e]">
            Muhabir ve Tarihçi tarihî şahsiyetleri canlandırmaz, onları birincil tarihî vesikalara dayanarak üçüncü şahıs diliyle aktarır. Öğrenci kişisel verisi toplanmaz.
          </p>
        </div>
      </footer>
    </div>
  );
}
