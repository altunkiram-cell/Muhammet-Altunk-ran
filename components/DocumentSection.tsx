'use client';

import React, { useState } from 'react';
import { Plus, Trash2, Sparkles, ArrowRight, ShieldAlert, CheckCircle2, RotateCcw, Copy } from 'lucide-react';
import { DocumentItem } from '@/lib/types';
import { SAMPLE_DOCUMENT_SETS } from '@/lib/sample-documents';

interface DocumentSectionProps {
  documents: DocumentItem[];
  setDocuments: React.Dispatch<React.SetStateAction<DocumentItem[]>>;
  onContinueToInterview: () => void;
}

export function DocumentSection({
  documents,
  setDocuments,
  onContinueToInterview,
}: DocumentSectionProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Update a document content
  const handleContentChange = (id: string, newContent: string) => {
    setDocuments(prev =>
      prev.map(doc => (doc.id === id ? { ...doc, content: newContent } : doc))
    );
  };

  // Update document title
  const handleTitleChange = (id: string, newTitle: string) => {
    setDocuments(prev =>
      prev.map(doc => (doc.id === id ? { ...doc, title: newTitle } : doc))
    );
  };

  // Add document
  const handleAddDocument = () => {
    const nextNum = documents.length + 1;
    const newDoc: DocumentItem = {
      id: `doc-${Date.now()}`,
      label: `Belge ${nextNum}`,
      title: `Yeni Tarihî Belge ${nextNum}`,
      content: `Belge ${nextNum}:\n(Öğretmen buraya belgenin orijinal veya sadeleştirilmiş metnini yapıştırır...)`,
    };
    setDocuments(prev => [...prev, newDoc]);
  };

  // Remove document
  const handleRemoveDocument = (id: string) => {
    if (documents.length <= 1) return;
    const filtered = documents.filter(doc => doc.id !== id);
    // Re-label
    const relabeled = filtered.map((doc, idx) => ({
      ...doc,
      label: `Belge ${idx + 1}`,
    }));
    setDocuments(relabeled);
  };

  // Load sample set
  const handleLoadSampleSet = (setId: string) => {
    const found = SAMPLE_DOCUMENT_SETS.find(s => s.id === setId);
    if (!found) return;
    const newDocs: DocumentItem[] = found.documents.map((d, idx) => ({
      id: `sample-${found.id}-${idx + 1}`,
      label: d.label,
      title: d.title,
      content: d.content,
    }));
    setDocuments(newDocs);
  };

  // Quick copy helper
  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const totalWords = documents.reduce((acc, doc) => {
    const words = doc.content.trim().split(/\s+/).filter(Boolean).length;
    return acc + words;
  }, 0);

  const isValid = documents.some(d => d.content.trim().length > 20);

  return (
    <div className="space-y-6">
      {/* Top Welcome / Guidance Card */}
      <div className="bg-[#f5efe4] border border-[#e2d5c3] rounded-xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#e7dbca] text-[#6b4e33] mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#8a2522]" />
              Bölüm 1: Tarihî Belgeleri Yükleme
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#2a1d15]">
              Öğretmen Belge Giriş Masası
            </h2>
            <p className="text-sm text-[#665444] mt-1 max-w-2xl">
              Öğrencilerin incelemesi için 2 veya 3 tarihî birincil belge metnini aşağıya ekleyin.
              Muhabir <strong>yalnızca bu metinlerdeki bilgileri</strong> kullanacak ve her cevabında dayandığı belgeyi referans gösterecektir.
            </p>
          </div>

          {/* Quick preset buttons */}
          <div className="flex flex-col gap-2 shrink-0">
            <span className="text-xs font-semibold text-[#735d49] uppercase tracking-wider">
              Hazır Örnek Belge Setleri:
            </span>
            <div className="flex flex-wrap gap-2">
              {SAMPLE_DOCUMENT_SETS.map(set => (
                <button
                  key={set.id}
                  onClick={() => handleLoadSampleSet(set.id)}
                  className="px-3 py-1.5 text-xs font-medium bg-[#ffffff] hover:bg-[#ebdcc9] text-[#423122] rounded-md border border-[#cbbca9] transition-all shadow-xs flex items-center gap-1.5 active:scale-95"
                >
                  <RotateCcw className="w-3 h-3 text-[#8a2522]" />
                  {set.name.split(' (')[0]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Rules Notice */}
      <div className="bg-[#fffbf0] border-l-4 border-[#c87d25] p-4 rounded-r-lg text-xs sm:text-sm text-[#5d411b] flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-[#c87d25] shrink-0 mt-0.5" />
        <div>
          <strong className="font-semibold">Muhabir Çalışma İlkesi:</strong> Belgelerdeki metinler &quot;Belge 1:&quot;, &quot;Belge 2:&quot; şeklinde etiketlenmelidir. Muhabir tarihî kişilerin ağzından konuşmaz, kendi yorumunu eklemez ve belgede olmayan sorular için standart olarak <em>&quot;Bu belgelerde bu sorunun cevabı yok...&quot;</em> yanıtını verir.
        </div>
      </div>

      {/* Document Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {documents.map((doc, index) => {
          const wordCount = doc.content.trim().split(/\s+/).filter(Boolean).length;
          return (
            <div
              key={doc.id}
              className="bg-[#ffffff] border border-[#dcd3c4] rounded-xl overflow-hidden shadow-xs hover:border-[#b8a791] transition-all flex flex-col"
            >
              {/* Card Header */}
              <div className="bg-[#f8f5ee] border-b border-[#e5dccf] px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="bg-[#8a2522] text-[#ffffff] font-serif font-bold text-xs px-2.5 py-1 rounded-sm shadow-xs">
                    {doc.label}
                  </span>
                  <input
                    type="text"
                    value={doc.title}
                    onChange={e => handleTitleChange(doc.id, e.target.value)}
                    placeholder="Belge Başlığı"
                    className="text-xs sm:text-sm font-semibold text-[#2f2218] bg-transparent border-b border-transparent hover:border-[#bdafa0] focus:border-[#8a2522] focus:outline-hidden px-1 py-0.5"
                  />
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleCopy(doc.id, doc.content)}
                    title="Metni Kopyala"
                    className="p-1.5 text-[#736353] hover:text-[#2a1d15] hover:bg-[#ede5d8] rounded-md transition-colors"
                  >
                    {copiedId === doc.id ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                  {documents.length > 1 && (
                    <button
                      onClick={() => handleRemoveDocument(doc.id)}
                      title="Belgeyi Sil"
                      className="p-1.5 text-[#9c4542] hover:text-[#d32f2f] hover:bg-[#fee2e2] rounded-md transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Text Area */}
              <div className="p-4 flex-1 flex flex-col">
                <label className="text-[11px] font-semibold text-[#7c6957] mb-1.5 flex items-center justify-between">
                  <span>Birincil Metin (Orijinal veya Sadeleştirilmiş):</span>
                  <span className="text-[10px] text-[#9c8976]">{wordCount} kelime</span>
                </label>
                <textarea
                  value={doc.content}
                  onChange={e => handleContentChange(doc.id, e.target.value)}
                  placeholder={`${doc.label}:\nBelge metnini buraya yapıştırın...`}
                  rows={12}
                  className="w-full flex-1 p-3 text-xs sm:text-sm font-serif leading-relaxed text-[#2c221a] bg-[#fdfbf7] border border-[#e5dccf] rounded-lg focus:outline-hidden focus:ring-2 focus:ring-[#8a2522]/30 focus:border-[#8a2522] resize-y placeholder:text-[#a89c8e]"
                />
              </div>

              {/* Card Footer status */}
              <div className="bg-[#fbf9f4] border-t border-[#eee5d8] px-4 py-2 flex items-center justify-between text-[11px] text-[#7c6b5b]">
                <span>
                  {doc.content.startsWith(`Belge ${index + 1}:`) ? (
                    <span className="text-emerald-700 font-medium">✓ Etiketli</span>
                  ) : (
                    <span className="text-[#a46816]">Belge {index + 1}: etiketi içerir</span>
                  )}
                </span>
                <span>{doc.content.length} karakter</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#e2d7c7]">
        <div className="flex items-center gap-3">
          {documents.length < 5 && (
            <button
              onClick={handleAddDocument}
              className="px-4 py-2 text-xs sm:text-sm font-medium bg-[#ede4d4] hover:bg-[#e2d5bf] text-[#3d2c1f] rounded-lg border border-[#cbbba6] transition-all flex items-center gap-2 shadow-xs"
            >
              <Plus className="w-4 h-4 text-[#8a2522]" />
              Yeni Belge Ekle ({documents.length + 1})
            </button>
          )}
          <span className="text-xs text-[#7d6957]">
            Toplam <strong>{documents.length}</strong> belge, <strong>{totalWords}</strong> kelime
          </span>
        </div>

        <button
          onClick={onContinueToInterview}
          disabled={!isValid}
          className={`px-6 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all shadow-md ${
            isValid
              ? 'bg-[#8a2522] hover:bg-[#731f1c] text-[#ffffff] cursor-pointer'
              : 'bg-[#cfc3b2] text-[#736554] cursor-not-allowed'
          }`}
        >
          <span>2. Bölüme Geç: Röportaj Yap</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
