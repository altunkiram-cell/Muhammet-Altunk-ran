'use client';

import React, { useState } from 'react';
import { NewspaperArticle } from '@/lib/types';
import { Printer, Copy, Check, Share2, HelpCircle, BookOpen, Quote, Download } from 'lucide-react';

interface NewspaperViewProps {
  newspaper: NewspaperArticle;
  onRegenerate: () => void;
  isGenerating: boolean;
}

export function NewspaperView({
  newspaper,
  onRegenerate,
  isGenerating,
}: NewspaperViewProps) {
  const [copied, setCopied] = useState(false);
  const [showAnswerHints, setShowAnswerHints] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyText = () => {
    const text = `=== ${newspaper.gazeteAdi || 'HÂKİMİYET-İ MİLLİYE'} ===\nTarih: ${newspaper.tarih || '1919'} | Sayı: ${newspaper.sayi || '1'}\n\nMANŞET: ${newspaper.manset}\n\nSPOT: ${newspaper.spot}\n\nHABER METNİ:\n${newspaper.haberMetni}\n\nBİRİNCİL ALINTILAR:\n${newspaper.alintilar.map(a => `• "${a.metin}" (${a.belge})`).join('\n')}\n\nKONTROL SORULARI:\n${newspaper.kontrolSorulari.map((q, i) => `${i + 1}. ${q}`).join('\n')}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Top Toolbar (Hidden during print) */}
      <div className="print:hidden flex flex-wrap items-center justify-between gap-3 bg-[#f2ebd9] border border-[#d6c7b3] p-3 rounded-xl shadow-xs">
        <div className="flex items-center gap-2">
          <span className="text-xs font-serif font-bold text-[#4a392b] uppercase tracking-wide">
            1919 Dönemi Gazete Baskısı Hazır
          </span>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#e3d7c3] text-[#6d5642]">
            Orijinal Belge Dayanaklı
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyText}
            className="px-3 py-1.5 text-xs font-medium bg-[#ffffff] hover:bg-[#ede5d6] text-[#3d2f23] rounded-md border border-[#c5b5a0] transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Kopyalandı</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Metni Kopyala</span>
              </>
            )}
          </button>

          <button
            onClick={handlePrint}
            className="px-3.5 py-1.5 text-xs font-semibold bg-[#2a1e16] hover:bg-[#402f23] text-[#f7f2eb] rounded-md transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Gazeteyi Yazdır / PDF</span>
          </button>

          <button
            onClick={onRegenerate}
            disabled={isGenerating}
            className="px-3 py-1.5 text-xs font-medium text-[#7a2e28] hover:text-[#5a211c] hover:bg-[#ebd9c7] rounded-md transition-colors"
          >
            {isGenerating ? 'Yenileniyor...' : 'Yeniden Düzenle'}
          </button>
        </div>
      </div>

      {/* The 1919 BroadSheet Newspaper Page */}
      <div className="newspaper-sheet bg-[#fcf8f0] text-[#1c1612] border-4 border-[#33261c] p-6 sm:p-10 shadow-xl max-w-4xl mx-auto rounded-xs font-serif print:border-none print:shadow-none print:p-0 print:m-0">
        {/* Top Header Ornaments */}
        <div className="border-b-2 border-t-2 border-[#1c1612] py-1 mb-2 text-center text-[10px] tracking-widest uppercase font-mono font-bold text-[#45362a]">
          &bull; MÜSTAKİL &bull; HÜR &bull; MİLLÎ HÂKİMİYETİN MÜDAFİİ &bull;
        </div>

        {/* Masthead */}
        <div className="text-center py-4 border-b-4 border-[#1c1612]">
          <div className="text-xs sm:text-sm tracking-widest uppercase text-[#544133] mb-1 font-semibold">
            GÜNLÜK MİLLÎ MÜCADELE GAZETESİ
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight font-serif text-[#160f0a] uppercase my-1">
            {newspaper.gazeteAdi || 'HÂKİMİYET-İ MİLLİYE'}
          </h1>
          <p className="text-xs sm:text-sm italic text-[#544234] font-serif">
            &ldquo;Milletin istiklâlini yine milletin azim ve kararı kurtaracaktır.&rdquo;
          </p>

          {/* Issue Date line */}
          <div className="flex flex-wrap items-center justify-between border-t-2 border-[#1c1612] mt-3 pt-1 text-[11px] sm:text-xs font-mono font-bold uppercase text-[#3b2d22]">
            <span>{newspaper.sayi || 'Sayı: 142'}</span>
            <span>TARİH: {newspaper.tarih || '1919'}</span>
            <span>FİYATI: 20 PARA</span>
          </div>
        </div>

        {/* Big Headline (Manşet) */}
        <div className="my-6 text-center border-b-2 border-[#1c1612] pb-6">
          <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-[#140e0a] leading-tight font-serif">
            {newspaper.manset}
          </h2>

          {/* Spot Subheading */}
          <div className="mt-3 max-w-2xl mx-auto px-4 py-2 border-y border-[#3b2d22] bg-[#f5ede0]/60">
            <p className="text-sm sm:text-base font-serif italic text-[#302319] leading-relaxed">
              {newspaper.spot}
            </p>
          </div>
        </div>

        {/* Main Newspaper Body & Quotes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
          {/* Main Article (spans 2 columns) */}
          <div className="md:col-span-2 space-y-4 border-r-0 md:border-r border-[#3b2d22] md:pr-6">
            <div className="flex items-center gap-2 pb-1 border-b border-[#3b2d22] text-[11px] font-mono uppercase font-bold text-[#634e3e]">
              <span>[ÖZEL MUHABİR TELGRAFI]</span>
              <span>&bull;</span>
              <span>DOĞRUDAN CEPHEDEN</span>
            </div>

            <div className="text-xs sm:text-sm font-serif leading-relaxed text-justify space-y-3.5 text-[#1b140e]">
              {newspaper.haberMetni.split('\n\n').map((paragraf, idx) => (
                <p key={idx} className="first-letter:text-3xl first-letter:font-black first-letter:mr-1 first-letter:float-left first-letter:leading-none">
                  {paragraf}
                </p>
              ))}
            </div>

            {/* Historical Verification Seal */}
            <div className="mt-6 pt-3 border-t border-dashed border-[#594434] flex items-center justify-between text-[11px] font-mono text-[#5e4b3c]">
              <span>Kaynak: Birincil Tarihî Zabıtlar</span>
              <span className="font-bold">TARİH MUHABİRİ ARŞİVİ</span>
            </div>
          </div>

          {/* Sidebar: Direct Quotes & Primary Sources */}
          <div className="space-y-4">
            <div className="bg-[#ede4d2] border-2 border-[#2b1f17] p-4 rounded-xs shadow-inner">
              <div className="flex items-center gap-1.5 mb-2 pb-1 border-b border-[#2b1f17] text-[11px] font-bold uppercase tracking-wider text-[#2b1f17]">
                <Quote className="w-3.5 h-3.5 text-[#8a2522]" />
                <span>BİRİNCİL ALINTILAR (BİREBİR)</span>
              </div>
              <p className="text-[10px] text-[#5e4c3b] mb-3 italic">
                * Aşağıdaki ifadeler ilgili tarihî belgelerden kelimesi kelimesine aktarılmıştır.
              </p>

              <div className="space-y-3">
                {newspaper.alintilar.map((alinti, i) => (
                  <div key={i} className="border-l-2 border-[#8a2522] pl-3 py-1 bg-[#f9f4ea]/80">
                    <p className="text-xs italic font-serif text-[#1e150f] leading-snug">
                      &ldquo;{alinti.metin}&rdquo;
                    </p>
                    <span className="block mt-1 text-[10px] font-mono font-bold text-[#8a2522] uppercase">
                      [{alinti.belge}]
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Decorative Stamp */}
            <div className="border border-[#77624f] p-3 text-center bg-[#faf4e8]">
              <div className="text-[10px] font-mono font-bold tracking-widest text-[#77624f] uppercase">
                BASKI KONTROL
              </div>
              <div className="text-xs font-serif font-black text-[#2a1d15] my-0.5">
                MİLLÎ MÜCADELE EVRAKI
              </div>
              <div className="text-[9px] text-[#695646]">
                Sansürsüz ve Değiştirilmemiş Asıl Nüsha
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Educational Questions (Kontrol Soruları) */}
        <div className="border-t-4 border-[#1c1612] pt-5 mt-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-[#8a2522] inline-block" />
              <h3 className="font-serif font-bold text-sm sm:text-base uppercase tracking-wider text-[#1c1612]">
                TARİH DERSİ KONTROL VE ANLAMA SUALLERİ
              </h3>
            </div>
            <span className="text-[11px] font-mono text-[#5d4a39] uppercase">
              (7-12. Sınıf Düzeyi)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {newspaper.kontrolSorulari.map((soru, index) => (
              <div
                key={index}
                className="bg-[#f2ebdc] border border-[#cfc1ad] p-3.5 rounded-xs flex flex-col justify-between"
              >
                <div>
                  <div className="text-[11px] font-mono font-bold text-[#8a2522] mb-1">
                    SUAL {index + 1}
                  </div>
                  <p className="text-xs font-serif text-[#211710] leading-relaxed">
                    {soru}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-[#d8ccbb] text-[10px] text-[#786452] italic">
                  Cevabı belgelerdeki kanıtlarla açıklayınız.
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer line */}
        <div className="border-t-2 border-[#1c1612] mt-6 pt-2 flex flex-wrap items-center justify-between text-[10px] font-mono text-[#66513f]">
          <span>ANKARA &bull; İSTANBUL &bull; SİVAS &bull; ERZURUM</span>
          <span>TARİH MUHABİRİ DERS ATÖLYESİ</span>
          <span>MİLLÎ ŞUUR NEŞRİYATI</span>
        </div>
      </div>
    </div>
  );
}
