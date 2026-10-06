'use client';

import React, { useState } from 'react';
import { Send, Sparkles, BookOpen, Newspaper, Mic, AlertCircle, Quote, Check, RefreshCw, HelpCircle } from 'lucide-react';
import { DocumentItem, InterviewMessage } from '@/lib/types';

interface InterviewSectionProps {
  documents: DocumentItem[];
  messages: InterviewMessage[];
  setMessages: React.Dispatch<React.SetStateAction<InterviewMessage[]>>;
  onGoToPublish: () => void;
}

export function InterviewSection({
  documents,
  messages,
  setMessages,
  onGoToPublish,
}: InterviewSectionProps) {
  const [inputQuestion, setInputQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const counterRef = React.useRef(1);

  // Suggested questions based on primary source analysis
  const suggestedQuestions = [
    'İstanbul Hükûmeti genelgeye ve millî harekete karşı nasıl bir tepki verdi?',
    'Belgelere göre milletin istiklali nasıl kurtarılacaktır?',
    'Kongre kararlarında manda ve himaye hakkında ne belirtilmiştir?',
    'Mustafa Kemal Paşa gibi konuşup durumu bana birinci şahısla anlatır mısın?',
    'Lozan Antlaşması bu belgelerde geçiyor mu, ne zaman imzalandı?',
  ];

  const handleAskQuestion = async (questionText: string) => {
    const q = questionText.trim();
    if (!q || loading) return;

    setError(null);
    setLoading(true);

    const userCount = counterRef.current++;
    const userMessage: InterviewMessage = {
      id: `msg-user-${userCount}`,
      role: 'user',
      content: q,
      timestamp: userCount,
    };

    setMessages(prev => [...prev, userMessage]);
    setInputQuestion('');

    try {
      const docTexts = documents.map(d => d.content);
      const historyPayload = messages.map(m => ({
        role: m.role,
        text: m.content,
      }));

      const res = await fetch('/api/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documents: docTexts,
          question: q,
          history: historyPayload,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Muhabir yanıt veremedi.');
      }
      const data = await res.json();

      const assistantCount = counterRef.current++;
      const assistantMessage: InterviewMessage = {
        id: `msg-reporter-${assistantCount}`,
        role: 'assistant',
        content: data.answer,
        citedDocument: data.citedDocument,
        timestamp: assistantCount,
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err: unknown) {
      console.error(err);
      const msg = err instanceof Error ? err.message : 'Soru gönderilirken hata oluştu.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([]);
    setError(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Section Banner */}
      <div className="bg-[#f5efe4] border border-[#e2d5c3] rounded-xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#e7dbca] text-[#6b4e33] mb-2">
              <BookOpen className="w-3.5 h-3.5 text-[#8a2522]" />
              Bölüm 2: Tarih Muhabiri ile Röportaj
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#2a1d15]">
              Sınıf Soru-Cevap Odası
            </h2>
            <p className="text-sm text-[#665444] mt-1 max-w-2xl">
              Öğretmen, öğrencilerin merak ettiği soruları muhabire iletir. Muhabir tarihî kişileri canlandırmaz,
              yalnızca <strong>üçüncü şahısla</strong> ve <strong>yüklenen belgelere</strong> dayanarak en fazla 5 cümleyle yanıtlar.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {messages.length > 0 && (
              <button
                onClick={handleClearHistory}
                className="px-3 py-1.5 text-xs text-[#735e4d] hover:text-[#2a1d15] bg-[#ede5d6] hover:bg-[#e4d9c6] rounded-md transition-colors flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                Sohbeti Sıfırla
              </button>
            )}
            <button
              onClick={onGoToPublish}
              className="px-4 py-2 text-xs sm:text-sm font-semibold bg-[#8a2522] hover:bg-[#731f1c] text-[#ffffff] rounded-lg transition-all shadow-xs flex items-center gap-1.5"
            >
              <Newspaper className="w-4 h-4" />
              <span>Yayın Masasına Geç</span>
            </button>
          </div>
        </div>
      </div>

      {/* Suggested Questions Pill bar */}
      <div className="bg-[#ffffff] border border-[#e2d8c9] rounded-xl p-4 shadow-xs">
        <div className="flex items-center gap-2 mb-2.5 text-xs font-bold text-[#6d5743] uppercase tracking-wider">
          <HelpCircle className="w-3.5 h-3.5 text-[#8a2522]" />
          <span>Örnek Öğrenci Soruları (Tek Tıkla Sorun):</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {suggestedQuestions.map((q, i) => (
            <button
              key={i}
              onClick={() => handleAskQuestion(q)}
              disabled={loading}
              className="text-xs bg-[#f8f5ee] hover:bg-[#ede5d6] text-[#3f2f21] border border-[#dacfc0] hover:border-[#8a2522] px-3 py-1.5 rounded-lg transition-all text-left max-w-full truncate shadow-2xs disabled:opacity-50"
            >
              💬 &quot;{q}&quot;
            </button>
          ))}
        </div>
      </div>

      {/* Messages Feed */}
      <div className="bg-[#fcfaf7] border border-[#ded5c5] rounded-xl p-4 sm:p-6 min-h-[380px] flex flex-col justify-between shadow-xs">
        <div className="space-y-5">
          {messages.length === 0 ? (
            <div className="text-center py-12 px-4 max-w-md mx-auto">
              <div className="w-14 h-14 mx-auto rounded-full bg-[#f1e8da] flex items-center justify-center text-[#8a2522] mb-3 border border-[#ded3be]">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#2f2218]">
                Muhabir Yayına Hazır
              </h3>
              <p className="text-xs sm:text-sm text-[#736353] mt-1.5">
                Öğrencilerinizin sorularını aşağıdaki alana yazın veya yukarıdaki hazır sorulardan birini seçin. Muhabir belgeleri inceleyerek yanıtlayacaktır.
              </p>
            </div>
          ) : (
            messages.map(msg => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.role === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                {/* Role Badge */}
                <div className="flex items-center gap-2 mb-1 px-1">
                  {msg.role === 'user' ? (
                    <span className="text-[11px] font-semibold text-[#66513d]">
                      Öğretmen / Öğrenci Sorusu
                    </span>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="bg-[#8a2522] text-[#ffffff] font-serif font-bold text-[10px] tracking-wide uppercase px-2 py-0.5 rounded-xs">
                        Tarih Muhabiri
                      </span>
                      <span className="text-[11px] text-[#7d6957]">
                        Üçüncü Şahıs Anlatımı
                      </span>
                    </div>
                  )}
                </div>

                {/* Message Bubble */}
                <div
                  className={`max-w-2xl rounded-xl p-4 text-sm leading-relaxed shadow-xs ${
                    msg.role === 'user'
                      ? 'bg-[#3b2b20] text-[#f7f2eb] rounded-tr-xs'
                      : 'bg-[#ffffff] text-[#241a13] border border-[#d6c7b3] font-serif rounded-tl-xs'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.content}</div>

                  {/* Assistant Extra Meta */}
                  {msg.role === 'assistant' && (
                    <div className="mt-3 pt-2.5 border-t border-[#eee4d6] flex flex-wrap items-center justify-between gap-2 text-xs text-[#7e6955] font-sans">
                      <div className="flex items-center gap-2">
                        {msg.citedDocument && (
                          <span className="bg-[#f0e6d6] text-[#733529] font-semibold px-2 py-0.5 rounded-sm border border-[#decbb4] text-[11px]">
                            Kaynak: {msg.citedDocument}
                          </span>
                        )}
                        <span className="text-[10px] text-emerald-800 font-medium">
                          ✓ Belgeye Sadık
                        </span>
                      </div>
                      <span className="text-[10px] text-[#9a8979]">
                        En fazla 5 cümle &bull; 7-12. sınıf dili
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}

          {/* Loading indicator */}
          {loading && (
            <div className="flex items-start gap-3">
              <div className="bg-[#8a2522] text-[#ffffff] font-serif font-bold text-[10px] px-2 py-0.5 rounded-xs mt-1">
                Tarih Muhabiri
              </div>
              <div className="bg-[#ffffff] border border-[#d6c7b3] rounded-xl p-4 text-xs sm:text-sm text-[#5d4b3c] font-serif flex items-center gap-2 shadow-xs">
                <span className="inline-block w-3 h-3 rounded-full bg-[#8a2522] animate-ping" />
                <span>Belgeler taranıyor ve muhabir yanıtı hazırlanıyor...</span>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-[#fdf2f2] border border-[#fca5a5] rounded-lg text-xs text-[#991b1b] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Question Input Form */}
        <div className="mt-6 pt-4 border-t border-[#ded5c5]">
          <form
            onSubmit={e => {
              e.preventDefault();
              handleAskQuestion(inputQuestion);
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={inputQuestion}
              onChange={e => setInputQuestion(e.target.value)}
              placeholder="Öğrencinin sorusunu yazın (örn: Vatanın istiklali için ne teklif ediliyor?)"
              disabled={loading}
              className="flex-1 bg-[#ffffff] border border-[#cfc1af] rounded-lg px-4 py-2.5 text-xs sm:text-sm text-[#2c2118] placeholder:text-[#9e8f7f] focus:outline-hidden focus:ring-2 focus:ring-[#8a2522]/30 focus:border-[#8a2522] shadow-inner"
            />
            <button
              type="submit"
              disabled={!inputQuestion.trim() || loading}
              className="px-5 py-2.5 bg-[#8a2522] hover:bg-[#731f1c] disabled:bg-[#d0c4b3] text-[#ffffff] rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
              <span>Sor</span>
            </button>
          </form>
          <p className="text-[11px] text-[#857361] mt-2 text-center">
            Gizlilik İlkesi: Uygulamada hiçbir öğrenci adı veya kişisel veri toplanmaz ve saklanmaz.
          </p>
        </div>
      </div>
    </div>
  );
}
