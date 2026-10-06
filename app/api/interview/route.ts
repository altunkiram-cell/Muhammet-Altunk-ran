import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';
import { TALIMAT } from '@/lib/talimat';
import { MODEL_NAME } from '@/lib/config';

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Sunucu tarafında GEMINI_API_KEY tanımlanmamış.' },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { documents, question, history } = body;

    if (!documents || !Array.isArray(documents) || documents.length === 0) {
      return NextResponse.json(
        { error: 'Lütfen en az bir tarihî belge ekleyin.' },
        { status: 400 }
      );
    }

    if (!question || typeof question !== 'string' || !question.trim()) {
      return NextResponse.json(
        { error: 'Lütfen bir soru girin.' },
        { status: 400 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    // Format the documents cleanly
    const documentsPrompt = documents
      .map((doc: string, idx: number) => {
        const trimmed = doc.trim();
        // Check if already starts with "Belge"
        if (/^belge\s*\d+/i.test(trimmed)) {
          return trimmed;
        }
        return `Belge ${idx + 1}:\n${trimmed}`;
      })
      .join('\n\n---\n\n');

    // Build chat or prompt contents
    let conversationHistory = '';
    if (Array.isArray(history) && history.length > 0) {
      conversationHistory = history
        .map(h => `${h.role === 'user' ? 'Öğretmen/Öğrenci Sorusu' : 'Muhabir Cevabı'}: ${h.text}`)
        .join('\n');
    }

    const userPrompt = `YÜKLENEN BİRİNCİL TARİHÎ BELGELER:
=========================================
${documentsPrompt}
=========================================

${conversationHistory ? `ÖNCEKİ SORU VE CEVAPLAR:\n${conversationHistory}\n\n` : ''}YENİ SORU:
"${question.trim()}"

Lütfen asistan talimatındaki tüm muhabir kurallarına (üçüncü şahıs dili, max 5 cümle, [Belge X] referansı, birebir tırnak içi alıntı, belgede yoksa standart yanıt) harfiyen uyarak cevap ver.`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: userPrompt,
      config: {
        systemInstruction: TALIMAT,
        temperature: 0.2, // Low temperature for factual precision & fidelity to source documents
      },
    });

    const answer = response.text || '';

    // Extract citation if present (e.g. [Belge 1])
    const citationMatch = answer.match(/\[Belge\s*\d+\]/gi);
    const citedDocument = citationMatch ? citationMatch[citationMatch.length - 1] : undefined;

    return NextResponse.json({
      answer: answer.trim(),
      citedDocument,
    });
  } catch (err: unknown) {
    console.error('Interview API error:', err);
    const message = err instanceof Error ? err.message : 'Bilinmeyen bir hata oluştu.';
    return NextResponse.json(
      { error: `Muhabir yanıtı oluşturulamadı: ${message}` },
      { status: 500 }
    );
  }
}
