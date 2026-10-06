'use client';

import React from 'react';
import { Newspaper, Mic, FileText, Sparkles, BookOpen } from 'lucide-react';

interface NavbarProps {
  activeTab: 'documents' | 'interview' | 'publish';
  setActiveTab: (tab: 'documents' | 'interview' | 'publish') => void;
  documentCount: number;
  questionCount: number;
  hasNewspaper: boolean;
  hasPodcast: boolean;
  onReset: () => void;
}

export function Navbar({
  activeTab,
  setActiveTab,
  documentCount,
  questionCount,
  hasNewspaper,
  hasPodcast,
}: NavbarProps) {
  return (
    <header className="border-b border-[#dfd7cc] bg-[#f7f3ec] sticky top-0 z-40 shadow-xs">
      {/* Top vintage banner line */}
      <div className="bg-[#2c221a] text-[#ede4d8] text-xs py-1 px-4 text-center tracking-widest uppercase font-serif border-b border-[#423327]">
        <span>Millî Mücadele Basını &bull; Tarih Dersi Birincil Belge Atölyesi &bull; Maarif Vekâleti Müfredatına Uygun</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Logo & title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-sm bg-[#8a2522] text-[#f7f3ec] flex items-center justify-center font-serif font-black text-xl shadow-xs border border-[#5c1816]">
              TM
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#201812] tracking-tight">
                  TARİH MUHABİRİ
                </h1>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-sm bg-[#e8dfd1] text-[#6d5743] border border-[#d6c7b2]">
                  1919 Arşivi
                </span>
              </div>
              <p className="text-xs text-[#6e5f51] font-sans">
                Birincil Belgelerden Röportaj, 1919 Gazetesi ve Çift Sesli Podcast
              </p>
            </div>
          </div>

          {/* Navigation tabs */}
          <nav className="flex items-center gap-1.5 bg-[#ece4d6] p-1 rounded-lg border border-[#dacfc0]">
            <button
              onClick={() => setActiveTab('documents')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-md text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'documents'
                  ? 'bg-[#ffffff] text-[#2c221a] shadow-xs font-semibold'
                  : 'text-[#5d4f40] hover:text-[#2c221a] hover:bg-[#f3ede3]'
              }`}
            >
              <FileText className="w-4 h-4 text-[#8a2522]" />
              <span>1. Belgeler</span>
              <span className="ml-1 text-[11px] px-1.5 py-0.2 rounded-full bg-[#e3d7c5] text-[#4d3f32]">
                {documentCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('interview')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-md text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'interview'
                  ? 'bg-[#ffffff] text-[#2c221a] shadow-xs font-semibold'
                  : 'text-[#5d4f40] hover:text-[#2c221a] hover:bg-[#f3ede3]'
              }`}
            >
              <BookOpen className="w-4 h-4 text-[#8a2522]" />
              <span>2. Röportaj</span>
              {questionCount > 0 && (
                <span className="ml-1 text-[11px] px-1.5 py-0.2 rounded-full bg-[#e3d7c5] text-[#4d3f32]">
                  {questionCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('publish')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-md text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'publish'
                  ? 'bg-[#8a2522] text-[#ffffff] shadow-xs font-semibold'
                  : 'text-[#5d4f40] hover:text-[#2c221a] hover:bg-[#f3ede3]'
              }`}
            >
              <Newspaper className="w-4 h-4" />
              <span>3. Yayın</span>
              {(hasNewspaper || hasPodcast) && (
                <span className="w-2 h-2 rounded-full bg-[#ffd166] animate-pulse" />
              )}
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}
